<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into mej.xyz, a personal blog/portfolio site built with Astro and View Transitions. A new `posthog.astro` component was created and wired into the root `PageLayout.astro` layout, ensuring PostHog initialises on every page with the View Transitions guard (`window.__posthog_initialized`) to prevent stack overflow during soft navigation. Automatic pageview tracking is enabled via `capture_pageview: 'history_change'`. Four custom events were instrumented across four files to capture the site's most meaningful user interactions.

| Event name | Description | File |
|---|---|---|
| `contact_link_clicked` | A visitor clicked a contact link (email or social) on the contact page. | `src/pages/contact.astro` |
| `footer_link_clicked` | A visitor clicked a social or email link in the site footer. | `src/components/Footer.astro` |
| `blog_post_read` | A visitor scrolled to the end of a blog post, indicating they read it. | `src/pages/blog/[...slug].astro` |
| `color_mode_toggled` | A visitor toggled the site colour mode on or off. | `src/components/Head.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/218762/dashboard/802177)
- [Contact link clicks over time](https://eu.posthog.com/project/218762/insights/KAWzgpnf)
- [Blog posts read (scroll completion)](https://eu.posthog.com/project/218762/insights/Q9vDRJYA)
- [Contact page conversion funnel](https://eu.posthog.com/project/218762/insights/GfHfHwoU)
- [Blog reading funnel](https://eu.posthog.com/project/218762/insights/8AhSYdc6)
- [All engagement events overview](https://eu.posthog.com/project/218762/insights/iQvUHqKG)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
