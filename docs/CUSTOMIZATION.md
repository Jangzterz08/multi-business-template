# Customization Guide

This template is designed so buyers can edit one preset config file and avoid component rewrites.

## Primary edit surface

Preset files:

- `src/presets/education/config.ts`
- `src/presets/dental/config.ts`
- `src/presets/salon/config.ts`
- `src/presets/gym/config.ts`
- `src/presets/restaurant/config.ts`

## Section-to-config mapping

- Header brand: `brand.mark`, `businessName`, `tagline`
- Hero block: `hero.title`, `hero.subtitle`, `hero.primaryCta`, `hero.secondaryCta`
- Services page/cards: `services[]`
- About page: `about.headline`, `about.story`, `about.values`, `about.founder`, `about.yearsInBusiness`
- Testimonials: `testimonials[]`
- Contact card/hours: `contact.*`
- Optional shared route copy overrides: `pageCopy.*`
- SEO tags: `seo.title`, `seo.description`, `seo.keywords`
- Theme: `designTokens`
- Form transport: `formProvider`

## No-code-like workflow

1. Duplicate the nearest preset `config.ts`
2. Replace business copy and service list
3. Replace contact details and hours
4. Add `pageCopy` overrides if the default route copy does not fit your business type
5. Pick or configure form provider
6. Tune token colors/typography
7. Preview locally and run smoke tests

## Branding and token edits

`designTokens` controls shared CSS variables:

- Color roles: `--color-bg`, `--color-text`, `--color-accent`, etc.
- Typography: `--font-display`, `--font-body`
- Shape: `--radius-sm`, `--radius-md`, `--radius-lg`
- Depth: `--shadow-soft`

Change these values and the full UI updates globally.

## Adding/removing services

Edit `services` array in preset config:

- `name`: card heading
- `blurb`: short description
- `duration`: shown as pill text
- `priceHint`: pricing hint line

## Shared route copy overrides

Use `pageCopy` only when you need to change the language used by the shared pages without forking components.

- `pageCopy.home.metrics`: custom metric cards on `/`
- `pageCopy.home.featuredTitle` / `featuredDescription`: section above the first cards
- `pageCopy.services.*`: route heading and the "How it works" list
- `pageCopy.about.*`: supporting narrative and side-card headings
- `pageCopy.contact.*`: contact page headings and descriptions
- `pageCopy.form.*`: input labels, placeholders, consent text, and submit button labels

## Motion and accessibility

- Entry animations use `.motionReveal`
- Reduced motion is respected via `prefers-reduced-motion`
- Keep heading hierarchy and button labels clear when customizing copy

## Preset switching for QA

Set in `.env`:

```env
VITE_PRESET=education
```

Then run:

```bash
npm run dev
npm run smoke
```

## AI content recorder workflow

Use the built-in recorder when you want a reusable "top 5 AI news" content input without adding backend code.

1. Run `npm run news:record` locally, or let `.github/workflows/ai-news-content.yml` run every morning at `07:00 UTC`
2. Open `content/ai-news/YYYY-MM-DD-ready-to-post.md` first when you want copy-paste-ready platform content
3. Open `content/ai-news/YYYY-MM-DD-daily-posting-brief.md` for the one-file morning summary
4. Review `content/ai-news/YYYY-MM-DD-quality-report.md` to catch weak hooks, weak CTAs, and repeated angles before posting, then use its auto-fix options if needed
5. Open `content/ai-news/YYYY-MM-DD-publishing-queue.md` for the exact posting order
6. Review the generated digest in `content/ai-news/YYYY-MM-DD.md`
7. Start from `content/ai-news/YYYY-MM-DD-content-plan.md` when you want hooks, newsletter angles, and short-form scripts
8. Use `content/ai-news/YYYY-MM-DD-instagram-carousel.md`, `content/ai-news/YYYY-MM-DD-instagram-reel.md`, `content/ai-news/YYYY-MM-DD-linkedin-carousel.md`, `content/ai-news/YYYY-MM-DD-talking-head-30s.md`, and `content/ai-news/YYYY-MM-DD-x-thread.md` for platform-specific finals, backup hooks, and CTA variants
9. Use `content/ai-news/YYYY-MM-DD-newsletter.md`, `content/ai-news/YYYY-MM-DD-video-scripts.md`, and `content/ai-news/YYYY-MM-DD-social-posts.md` for publish-ready first drafts
10. Review `content/ai-news/YYYY-MM-DD-publishing-checklist.md` before posting so you keep originality, hooks, and measurement tight
11. Use `content/ai-news/latest.json` if you want to pipe the stories into another content step

If you want the shortest possible morning routine, use [docs/DAILY_OPERATOR_CHECKLIST.md](./DAILY_OPERATOR_CHECKLIST.md).

Optional environment variables:

- `AI_NEWS_QUERY`: search query passed to the Google News RSS endpoint
- `AI_NEWS_LIMIT`: number of stories to store, default `5`
- `AI_NEWS_PREFERRED_SOURCES`: comma-separated outlets to prioritize
- `AI_NEWS_MAX_PER_SOURCE`: max stories from one outlet, default `1`
- `AI_NEWS_LANGUAGE`: feed locale, default `en-US`
- `AI_NEWS_REGION`: feed region, default `US`
- `AI_NEWS_OUTPUT_DIR`: where records are written, default `content/ai-news`
- `AI_CONTENT_VOICE`: `creator`, `operator`, `founder`, `educator`, or `newsroom`
- `AI_TELEGRAM_BOT_TOKEN`: optional Telegram bot token for phone notifications
- `AI_TELEGRAM_CHAT_ID`: optional Telegram chat id that receives the message
- `AI_TELEGRAM_SILENT`: optional `true` or `false` for silent sends
- `AI_TELEGRAM_REPO_URL`: optional override for GitHub file links in Telegram
- `AI_TELEGRAM_REPO_BRANCH`: optional override for the branch used in Telegram file links

If you configure Telegram, each run also sends a short phone-friendly morning message with direct file links, inline buttons, and a compact `Copy now` section for the first things you are likely to post from your phone. In GitHub Actions, store the bot token in `Secrets` and the chat id in `Variables`.

## Common mistakes to avoid

- Deleting required fields from `PresetConfig`
- Forgetting to update `pageCopy` when repurposing the template for a non-service business
- Using invalid route paths outside `/, /services, /about, /contact`
- Setting form provider without endpoint/credentials
- Forgetting to update `src/presets/index.ts` when adding a new preset
