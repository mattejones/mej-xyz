---
title: tmux tail tip
description: An easy script for tail with tmux
date: October 4 2026
tags:
  - Linux
  - Homelab
  - tmux
---

Every so often I print off a tmux cheat-sheet and stick it to my monitor. I'm a casual tmux user. Normally I pick something up when I have a specific need, realise the power and then continue to use it. 

One use-case for tmux that I leverage is having something run in the corner of my screen without a new terminal. For instance, seeing application traffic or a docker build completing.

Here's a simple command I found myself kludging together (really, compiling from scrolling through my command history until I got a near enough command I could modify):

```
tmux split-window -v -l 30% "ssh -t -i ~/.ssh/k8s_homelab mattjones@data.srv.home.wheeliecheesy.com 'tail -F /data/dss/run/build-base-image.log'"
```

That's nearly as long as an old-school Twitter post. Yikes. Time to clean this up a little. 

To be fair everything was useful: 
- `tmux split-window -v -l 30%` - opens a new pane underneath, at 30% of the height.
- `ssh -t` gives the remote command a proper terminal, so Ctrl+C actually stops it.
- `-i ~/.ssh/k8s_homelab` picks the right key, because... (I'll get to this later)
- `mattjones@data.srv.home.wheeliecheesy.com` is me, on a machine whose name I chose and now regret the length of.
- `tail -F` follows the file, even if it gets replaced.

## step one of two
So, first was to actually fix my SSH a little so I don't have to mention keys and FQDNs in `~/.ssh/config`. This isn't really the focus of the article. That was on me, I was just recycling my command history up until this point. 

```
# --- homelab ---
Host data k8s-01 k8s-02 k8s-03 edge filer dns01 dns02
    HostName %h.srv.home.wheeliecheesy.com

Host *.srv.home.wheeliecheesy.com data k8s-01 k8s-02 k8s-03 edge filer dns01 dns02
    User mattjones
    IdentityFile ~/.ssh/k8s_homelab
    IdentitiesOnly yes
```
Now `ssh data` just works. Wonderful. That's also where the key went: `IdentityFile` points at the right one, and `IdentitiesOnly yes` stops SSH offering every other key first, which some servers reward with a baffling "Too many authentication failures". 


## step two of two

With SSH finally set up in a reasonable way, I then added a simple shell function to `~/.bashrc`:


```
tmuxtail() {
  local host file pane
  case $# in
    1) file=$1 ;;
    2) host=$1; file=$2 ;;
    *) echo "usage: tmuxtail [host] file" >&2; return 2 ;;
  esac
  [ -n "$TMUX" ] || { echo "tmuxtail: not inside tmux" >&2; return 1; }
  if [ -n "$host" ]; then
    pane=$(tmux split-window -v -l 30% -P -F '#{pane_id}' ssh -t "$host" "tail -F $(printf %q "$file")")
  else
    pane=$(tmux split-window -v -l 30% -c "$PWD" -P -F '#{pane_id}' tail -F "$file")
  fi
  tmux set-option -p -t "$pane" remain-on-exit failed
}
```

This turned my earlier tweet-length command into this:

```
tmuxtail data /data/dss/run/build-base-image.log
```

Which gives me something like this, with the build ticking along underneath while I get on with other things:

```text
┌─ dev-box ────────────────────────────────────────────────────────────────┐
│ mattjones@dev-box:~$ tmuxtail data /data/dss/run/build-base-image.log    │
│ mattjones@dev-box:~$ git log --oneline -3                                │
│ 3f9c2e1 (HEAD -> main) add tmuxtail                                      │
│ a71b0d4 tidy ssh config                                                  │
│ 0c4d9e8 first commit                                                     │
│ mattjones@dev-box:~$ █                                                   │
│                                                                          │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ Step 36/43 : RUN pip install --no-cache-dir -r requirements.txt          │
│  ---> Running in 4be0f1c2a9d3                                            │
│ Collecting pandas==2.2.3                                                 │
│   Downloading pandas-2.2.3-cp312-manylinux_2_17_x86_64.whl (12.7 MB)     │
│ Successfully installed numpy-2.1.3 pandas-2.2.3 pyarrow-17.0.0           │
│  ---> Removed intermediate container 4be0f1c2a9d3                        │
│ Step 37/43 : USER 500                                                    │
│  ---> Running in e6af6c947e53                                            │
│ Step 38/43 : ENV HOME=/home/app                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ [0] 0:bash*                                    "dev-box" 18:35 04-Oct-26 │
└──────────────────────────────────────────────────────────────────────────┘
```

And it can be recycled for other log watching on other machines as well as local log observations, which I think is pretty dandy. 
