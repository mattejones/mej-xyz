# mej.xyz

Personal website and technical blog of Matt E. Jones. Built with Astro, deployed on Cloudflare Pages.

Live at [mej.xyz](https://mej.xyz)

---

## Stack

- **Framework:** [Astro 5](https://astro.build) (based on [Astro Nano](https://github.com/markhorn-dev/astro-nano))
- **Styling:** Tailwind CSS
- **Hosting:** Cloudflare Pages
- **DNS:** Cloudflare
- **Content:** Markdown / MDX

---

## Branch Structure

| Branch | Purpose |
|---|---|
| `main` | Production — auto-deploys to mej.xyz on push |
| `develop` | Working branch — builds to a preview URL on push |

**Never commit directly to `main`.** Work on `develop` or a feature branch, then merge.

---

## Writing Workflow

1. Write a new post in `src/content/blog/` as a markdown file
2. Push to `develop` — Cloudflare Pages builds a preview URL automatically
3. Review the preview
4. Merge `develop` → `main` — site goes live within ~60 seconds

No build scripts. No SCP. No manual steps.

---

## Content Structure

```
src/content/
├── blog/          # Blog posts (numbered directories, e.g. 014-my-post/)
├── work/          # Work history entries
└── projects/      # Project entries
```

Each post lives in its own directory with an `index.md` file. Frontmatter schema is defined in `src/content/config.ts`.

### Adding a new post

Create a new numbered directory under `src/content/blog/`:

```
src/content/blog/014-my-new-post/
└── index.md
```

Frontmatter:

```yaml
---
title: "My New Post"
description: "A short description"
date: "Jan 01 2026"
---
```

---

## Local Development

```bash
nvm use 22
npm install
npm run dev        # starts dev server at localhost:4321
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

---

## Project Config

Site metadata, social links and homepage counts are configured in `src/consts.ts`.

---

## Deployment

Cloudflare Pages builds automatically on push to any branch. Production deploys only trigger on `main`. All other branches get a preview URL.

Build settings:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 22
