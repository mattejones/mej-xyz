---
title: "When OpenBSD's virtio Driver Says 'No Carrier': A Deep Dive into MSI-X, VLAN Tags, and Driver Bugs"
description: "Debugging why OpenBSD VMs on Proxmox show permanent 'no carrier' on VLAN-tagged virtio interfaces, and what I learned about interrupt handling along the way"
pubDate: 2026-02-16
tags: ["openbsd", "proxmox", "networking", "virtualization", "debugging"]
---

## The Problem: No Carrier, But Traffic is There

I was setting up a multi-VLAN DNS server on OpenBSD 7.8 running in Proxmox VE 7.4. The end goal is actually to run CoreDNS with different filtering policies for different VLANs - clean DNS for my server network, aggressive blocklists for the kids' devices.

The setup seemed straightforward:
- **vio0**: Untagged interface on VLAN 60 (servers) - worked perfectly
- **vio1**: VLAN-tagged interface on VLAN 40 (kids) - permanently showed `status: no carrier`

```bash
vio1: flags=2008802<BROADCAST,SIMPLEX,MULTICAST,LRO> mtu 1500
        lladdr c2:8a:93:59:9a:0a
        index 2 priority 0 llprio 3
        media: Ethernet autoselect
        status: no carrier
```

While I saw no carrier, what was really strange is that: **traffic was arriving at the interface**. Running `tcpdump` on the Proxmox host's tap interface showed VLAN 40 packets flowing perfectly. The VM just couldn't see them.

## Symptoms: How to Know You're Hitting This

If you're experiencing this issue, you'll see:

1. **OpenBSD `ifconfig` shows "no carrier"** on virtio interface
2. **`dmesg` shows "msix per-VQ"** for the affected virtio device:
   ```
   vio1 at virtio4: 1 queue, address c2:8a:93:59:9a:0a
   virtio4: msix per-VQ
   ```
3. **The interface has a VLAN tag** applied at the hypervisor level
4. **`tcpdump` on the host tap shows traffic arriving** with correct VLAN tags
5. **Other virtio interfaces on the same VM work fine** (typically ones without VLAN tags)
6. **Switching to e1000 NIC model makes it work immediately**

## The Diabolical Debugging Journey

### First Suspect: The MikroTik Router

My network runs on a MikroTik RB5009 with bridge VLAN filtering. Naturally, I assumed I'd misconfigured the VLAN tagging. I spent ages combing through: 

- Verifying `ether6` was in the tagged list for VLAN 40
- Checking PVID settings (was PVID 60 stripping tags?)
- Comparing working ether7 config with non-working ether6
- Running `/interface bridge vlan print` until my eyes glazed over

**Verdict**: MikroTik config was perfect. `tcpdump` on the Proxmox side proved tagged VLAN 40 traffic was arriving.

### Second Suspect: Proxmox VLAN-Aware Bridges

Proxmox 7.4 has a VLAN-aware bridge feature that handles VLAN tag stripping for VMs. Maybe that was broken?

I verified:
```bash
cat /sys/class/net/vmbr1/bridge/vlan_filtering  # Returns 1 OK
bridge -compressvlans vlan show  # Shows correct VLAN membership OK
```

The tap interface had the right VLAN configuration:
```
tap107i1    40 PVID Egress Untagged
```

**Verdict**: Proxmox bridge was correctly stripping VLAN 40 tags and delivering untagged frames to the VM.

### Third Suspect: Proxmox Firewall Bridges

With `firewall=1` enabled on the VM network device, Proxmox creates an intermediate bridge chain: `VM → tap → fwbr → fwln/fwpr veth pair → vmbr1`. Maybe this was breaking VLAN delivery?

Testing with `firewall=0`:
```bash
qm set 107 --net1 virtio=...,bridge=vmbr1,tag=40,firewall=0
```

**Verdict**: Firewall bridges weren't the issue. Still no carrier.

### The Breakthrough: Comparing dmesg Output

Looking at working vs. non-working interfaces:

**vio0 (working)**:
```
vio0 at virtio3: 1 queue, address 7e:34:ff:40:b4:53
```

**vio1 (broken)**:
```
vio1 at virtio4: 1 queue, address c2:8a:93:59:9a:0a
virtio4: msix per-VQ
```

That `msix per-VQ` line was strange so I thought to go deeper here. The two interfaces were using **different MSI-X interrupt modes**.

### Alternative device config Option: Switching to e1000

Out of desperation:
```bash
qm set 107 --net1 e1000=C2:8A:93:59:9A:0A,bridge=vmbr1,tag=40
qm shutdown 107
qm start 107
```

OpenBSD immediately showed:
```
em0: flags=8802<BROADCAST,SIMPLEX,MULTICAST> mtu 1500
        media: Ethernet autoselect (1000baseT full-duplex)
        status: active
```

**Carrier detected. DHCP worked. Everything just worked.**

## What I Learned: MSI-X and Virtio Internals

### MSI-X: Modern PCI Interrupts

MSI-X (Message Signaled Interrupts - Extended) replaced the old physical interrupt pin model. Instead of asserting a wire, devices write to memory addresses:

- Each device has an **MSI-X table** (up to 2048 entries)
- Each entry maps to a specific interrupt vector
- When the device needs attention, it writes to the address in that entry
- The CPU receives the interrupt without needing to poll device registers

### Virtio's Two MSI-X Modes

**Shared MSI-X**: One vector for everything. The driver reads an ISR status register to determine what happened (virtqueue completion? config change?).

**Per-VQ MSI-X**: Dedicated vectors for each virtqueue plus a separate config change vector:
```
Entry 0: RX queue completions
Entry 1: TX queue completions
Entry 2: Configuration changes (link status, etc.)
```

Per-VQ mode is more efficient (less register polling), but requires correctly programming **all** vectors.

### The Bug?: Lost Config Change Interrupts

In OpenBSD's virtio driver (pre-7.6 fix), the MSI-X **config change vector** wasn't being re-programmed after device reset. The virtio spec is clear: if `config_msix_vector` is set to `0xFFFF` (NO_VECTOR), the device MUST NOT send config change interrupts.

The lifecycle:
1. VM boots, virtio driver allocates MSI-X vectors
2. `ifconfig vio1 up` triggers device reset
3. Reset clears all MSI-X vector assignments (per spec)
4. Driver re-programs queue vectors (entries 0, 1) ✓
5. Driver **forgets to re-program config vector** (entry 2) ✗
6. Config change vector remains at `0xFFFF`
7. QEMU cannot deliver link-state change interrupts
8. OpenBSD never sees link come up

**Why vio0 worked**: It landed in shared MSI-X mode (fewer vectors allocated by QEMU for that PCI slot), which uses ISR register polling as a fallback. Config changes work without a dedicated vector.

**Why e1000 worked**: Intel e1000 emulation uses standard PCI register polling for link status - no virtio config change mechanism involved.

### The Fix (That Didn't Help Me)

I did find some related fix that went into OpenBSD on September 2, 2024 (committed for 7.6). The fix creates `virtio_pci_setup_intrs()` that programs **both** queue vectors and the config vector after reset.

Also found a follow-up fix on December 20, 2024 addressed virtio 1.x `queue_enable` ordering.

**But I was running OpenBSD 7.8**  which should have had both fixes. Why did it still fail?

## The Mystery: Why 7.8 Still Failed

Honestly? I don't know for certain. Possibilities:

1. **Edge case in MSI-X vector allocation**: Specific PCI topology in my VM triggered a code path where the fix doesn't apply
2. **QEMU 7.2 quirk**: Proxmox 7.4 runs QEMU 7.2 (from 2022), potentially with its own virtio 1.x bugs
3. **Timing issue**: The config vector write might be happening before QEMU's MSI-X table is ready
4. **Different bug entirely**: Something that looks similar but has a different root cause

To properly debug this, I'd need to:
- Verify the fix is actually compiled into my kernel
- Capture MSI-X vector assignments with `pcidump -v`
- Compare interrupt state between working and broken configs
- Test on Proxmox 8.x with newer QEMU

But at some point, pragmatism wins.

## The Solution: Just Use e1000

For VLAN-tagged virtio-net interfaces on OpenBSD VMs in Proxmox 7.4:

```bash
qm set <VMID> --net1 e1000=<MAC>,bridge=vmbr1,tag=<VLAN_ID>
```

**Trade-offs**:
- **Performance**: e1000 has ~10-15% more overhead than virtio
- **Compatibility**: e1000 works everywhere, always
- **Simplicity**: No MSI-X vector debugging required

For my DNS server use case, the performance difference is negligible. CoreDNS CPU usage is measured in single-digit percentages.

## The Bigger Picture: Multi-VLAN DNS Architecture

The goal that started this odyssey: differentiated DNS filtering across VLANs.

**Final architecture something like this**:
```
OpenBSD VM ()
  └─ CoreDNS with ACL-based filtering
      ├─ VLAN 40 (Kids): Aggressive blocklists
      ├─ VLAN 60 (Servers): No filtering
      └─ Other VLANs: Custom policies
```

The e1000 workaround means both interfaces work perfectly, and I can finally get CoreDNS configured with per-VLAN policies.

## Key Takeaways

1. **"No carrier" doesn't mean no traffic**: Always verify with `tcpdump` at multiple layers
2. **MSI-X per-VQ mode is more fragile**: The config change vector must be explicitly programmed
3. **Driver bugs can persist across releases**: Even with fixes committed, edge cases may remain
4. **Performance isn't everything**: e1000 works, virtio doesn't - ship the working solution
5. **Document the weird stuff**: Someone else will hit this

## For OpenBSD Developers

If you're investigating this, check:
```bash
# Does the broken interface use per-VQ MSI-X?
dmesg | grep -i "msix per-VQ"

# What's the config change vector set to?
pcidump -v | grep -A 30 "vendor.*Red Hat"
# Look for "Configuration Change: 0xFFFF" (broken) vs valid vector number
```

## References

- [OpenBSD virtio fix commit (Sept 2024)](https://www.mail-archive.com/source-changes@openbsd.org/msg150401.html)
- [Virtio 1.0 specification](https://docs.oasis-open.org/virtio/virtio/v1.0/virtio-v1.0.html)
- [OpenBSD vio(4) man page](https://man.openbsd.org/vio.4)

---

