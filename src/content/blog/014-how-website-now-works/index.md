---
title: "Website infrastructure improvements"
description: "Migrated to Cloudflare Pages for an easier life"
date: April 30 2026
tags: 
 - website
 - astro
 - cloudflare
---

## Overview

My website has been neglected for a while. The setup got sloppy - the gap between what was in the git repo and what was actually on the server gradually widened, and the friction in the deployment process meant I kept taking shortcuts and promising myself I'd fix it later. I never did.

The catalyst was watching my son deploy his own site — [rowancodes.dev](https://rowancodes.dev) — using Pelican, GitHub, and Vercel, with a fully automated pipeline. Write a post, push it, done. I was doing something considerably more manual and considerably less reliable. It was time to sort it out.

The old setup, for posterity:

- **Source control:** GitLab (private repo)
- **Deploy method:** Manual shell script — `npm run build`, then `scp dist/ user@vps:/var/www/`
- **Hosting:** A Nonic VPS running Nginx
- **SSL:** Let's Encrypt, manually renewed

It worked, until it didn't. The moment you start making changes directly on the server — even small ones — you've broken the contract between your repo and reality.

## Gathering the pieces

My first concern was figuring out which copy of the site was actually correct. I had three candidates: GitLab, the VPS, and my local machine.

The VPS turned out to be the closest to truth — and fortunately it held the Astro source, not just the compiled output. So the recovery was straightforward: SCP the source off the server, verify it built cleanly locally, and treat that as the new baseline.

The local copy had unstaged changes, so I kept it completely separate during this process. The cardinal rule was not to conflate the extraction and the reconciliation into a single step - that's how you silently overwrite content you wanted to keep.

## Fixing and updating Astro

Once I had a clean local copy, `npm audit` surfaced a handful of vulnerabilities in the Astro installation — several CVEs across Astro, esbuild, and `@astrojs/rss`. Most were irrelevant in practice (dev server exploits don't affect a statically built site), but starting a clean repo on known-vulnerable dependencies felt like poor form.

Upgrading wasn't entirely straightforward. Astro 6 has landed, but the ecosystem hadn't fully caught up — `@astrojs/tailwind` still declared a peer dependency cap at Astro 5. Attempting `npm install astro@latest` with all integrations at `@latest` produced conflicting dependency trees. The solution was pinning all integrations to their Astro 5-compatible major versions explicitly:

```bash
npm install astro@5 @astrojs/mdx@4 @astrojs/tailwind@6 @astrojs/rss@4
```

A coherent dependency graph, a clean build, and no outstanding high-severity issues. Good enough to move forward with.

## Moving to GitHub

The repo was on GitLab. Nothing wrong with GitLab, but Cloudflare Pages has a more straightforward GitHub integration and the tooling around GitHub Actions is better documented for Astro specifically. Migration was non-destructive - GitLab remained untouched throughout. (Hopefully this note will remind me of that before I start working from that version!)

The process was:
1. Add GitHub as a second remote alongside GitLab
2. Push the clean local branch to GitHub as `main`
3. Verify GitHub looked correct
4. Remove the GitLab remote and rename GitHub to `origin`
5. Create a `develop` branch — `main` is production, `develop` is the working branch

The branching strategy is simple: nothing goes directly to `main`. Work happens on `develop`, gets pushed for a preview build, and merges to `main` when it's ready to go live.

## Setting up Cloudflare Pages

Cloudflare's UI has consolidated Workers and Pages under a single "Create application" entry point.. this worth knowing because it's easy to end up in the Workers flow by mistake, which has a meaningfully different configuration screen. The pages option is just below in a link outside the wizard window at the time of writing.

Once in the Pages flow, connecting the GitHub repo and configuring the build took about two minutes:

- **Framework:** Astro (auto-detected)
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** set via environment variable `NODE_VERSION = 22`

The Node version environment variable is easy to overlook and worth setting explicitly. Cloudflare's default Node version is old, and leaving it unset is a latent build failure waiting to happen when a dependency eventually drops support for it.

One other thing to note: branch preview builds are enabled by default. Any push to a non-production branch gets its own preview URL automatically. This turns `develop` into a genuine staging environment with zero additional configuration.

## DNS setup

I kept GoDaddy as my registrar but moved nameserver management to Cloudflare. This means GoDaddy retains ownership of the domain registration while Cloudflare handles all DNS resolution — a clean separation, and it consolidates infrastructure into one dashboard.

[dnschecker.org](https://dnschecker.org) is useful for monitoring propagation progress across global resolvers. I'd estimate that full propagation took under an hour.

One small gotcha: `www.mej.xyz` was 522ing after the cutover. Cloudflare was proxying the `www` CNAME but had nowhere to route it, since Cloudflare Pages only knew about the apex domain. The fix was two steps:

1. Add `www.mej.xyz` as an explicit custom domain in the Pages project
2. Create a Cloudflare Redirect Rule sending `www.mej.xyz` → `https://mej.xyz` permanently

The redirect rule requires a proxied DNS record for `www` pointing at `192.0.2.1`. This felt weird to me, but I learnt it is a a reserved discard address. Traffic never actually reaches that IP; Cloudflare intercepts it and fires the redirect rule first. It looks wrong but it's the correct pattern.

## The result

The new setup:

```
Local (Obsidian / VSCode)
        │
        │  git push
        ▼
   GitHub (main)
        │
        │  webhook
        ▼
Cloudflare Pages
  - Builds Astro automatically (~60 seconds)
  - Serves static output via global CDN
  - Handles SSL
  - Serves mej.xyz
```

Write a post, push to `develop`, review the preview URL, merge to `main`. The site is live within a minute. No scripts, no SCP, no SSH into a server.

The old post covering how this site used to work — [Some notes on how my website works](/blog/006-how-my-website-works) — is now mostly a historical document. Consider this the current version.
