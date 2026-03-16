# Multi-Business Template

Commercial-ready website template built with React + Vite + TypeScript.

## What this package includes

- One shared codebase
- Five presets: `education`, `restaurant` (Italian), `dental`, `salon`, `gym`
- Four routes for every preset: `/`, `/services`, `/about`, `/contact`
- Centralized preset config files for content + theming
- Pluggable contact form adapters: Formspree, EmailJS, Custom endpoint
- Marketplace-focused docs and release checklists

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Set preset in `.env`:

```env
VITE_PRESET=education
```

Valid values: `education`, `restaurant`, `dental`, `salon`, `gym`

## Scripts

- `npm run dev` local development
- `npm run dev:education` preview the kids education preset
- `npm run build` type-check + production build
- `npm run preview` preview built app
- `npm run news:record` fetch and save a top-5 AI news digest to `content/ai-news/`
- `npm run lint` lint TypeScript/React files
- `npm run typecheck` TypeScript checks only
- `npm run test` run full test suite
- `npm run smoke` run route smoke tests only

## Environment variables

See `.env.example`:

- `VITE_PRESET`: active preset key
- `VITE_FORMSPREE_ENDPOINT`: Formspree endpoint URL
- `VITE_EMAILJS_SERVICE_ID`: EmailJS service ID
- `VITE_EMAILJS_TEMPLATE_ID`: EmailJS template ID
- `VITE_EMAILJS_PUBLIC_KEY`: EmailJS public key
- `VITE_CUSTOM_FORM_ENDPOINT`: Custom backend endpoint

## Main project structure

- `src/app/`: app bootstrap, context, routes, shell
- `src/components/`: reusable UI blocks
- `src/pages/`: route-level pages
- `src/presets/`: business content + design tokens
- `src/forms/`: form adapters + validation + submit orchestration
- `src/theme/`: global token and style system
- `src/types/`: shared contracts
- `docs/`: long-form product, customization, and release instructions

## Switch business preset

1. Update `VITE_PRESET` in `.env`
2. Restart dev server if needed
3. Verify all 4 routes render expected content

## Add a new business preset

1. Copy one preset folder under `src/presets/`
2. Update `config.ts` fields, optional `pageCopy`, and `designTokens`
3. Register new preset in `src/presets/index.ts`
4. Run `npm run smoke` and confirm all route tests pass

## Form provider selection

Form provider is selected from `preset.formProvider` and can read credentials/endpoints from environment variables.

See [docs/FORM_PROVIDERS.md](docs/FORM_PROVIDERS.md) for setup details.

## Shared copy overrides

Use optional `pageCopy` fields in a preset when the shared route language needs to fit a different business model.

- `pageCopy.home`: hero metrics and home section headings
- `pageCopy.services`: route badge, title, intro, process steps, CTA label
- `pageCopy.about`: supporting section heading, paragraphs, and side-card labels
- `pageCopy.contact`: route headings and supporting copy
- `pageCopy.form`: form labels, placeholders, and submit button text

## AI news content workflow

This repo includes a lightweight content workflow that records the top five AI news stories into `content/ai-news/`.

- Local run: `npm run news:record`
- Scheduled run: `.github/workflows/ai-news-content.yml` every morning at `07:00 UTC`
- Output files: `content/ai-news/latest.json`, `content/ai-news/performance-memory.json`, `content/ai-news/YYYY-MM-DD.md`, `content/ai-news/YYYY-MM-DD-content-plan.md`, `content/ai-news/YYYY-MM-DD-daily-posting-brief.md`, `content/ai-news/YYYY-MM-DD-publish-decision.md`, `content/ai-news/YYYY-MM-DD-performance-review.md`, `content/ai-news/YYYY-MM-DD-posting-tracker.md`, `content/ai-news/YYYY-MM-DD-instagram-carousel.md`, `content/ai-news/YYYY-MM-DD-instagram-reel.md`, `content/ai-news/YYYY-MM-DD-linkedin-carousel.md`, `content/ai-news/YYYY-MM-DD-newsletter.md`, `content/ai-news/YYYY-MM-DD-ready-to-post.md`, `content/ai-news/YYYY-MM-DD-quality-report.md`, `content/ai-news/YYYY-MM-DD-publishing-queue.md`, `content/ai-news/YYYY-MM-DD-publishing-checklist.md`, `content/ai-news/YYYY-MM-DD-talking-head-30s.md`, `content/ai-news/YYYY-MM-DD-video-scripts.md`, `content/ai-news/YYYY-MM-DD-x-thread.md`, and `content/ai-news/YYYY-MM-DD-social-posts.md`

The platform-specific lead-story files now include backup hooks and CTA variants, and the quality report includes auto-fix suggestions when it detects weak drafts.
The ready-to-post pack now gives you copy-paste-ready titles, bodies, and CTAs for the main platforms, using editorial "why now" language instead of raw ranking jargon.
The posting tracker gives you one markdown file with checkboxes so you can mark a topic as verified, posted, skipped, or saved for later across each platform.

Optional environment variables for the recorder:

- `AI_NEWS_QUERY`: Google News RSS query string
- `AI_NEWS_LIMIT`: number of stories to keep, default `5`
- `AI_NEWS_PREFERRED_SOURCES`: comma-separated outlets to prioritize
- `AI_NEWS_MAX_PER_SOURCE`: limit repeats from the same outlet, default `1`
- `AI_NEWS_LANGUAGE`: locale, default `en-US`
- `AI_NEWS_REGION`: region, default `US`
- `AI_NEWS_OUTPUT_DIR`: output folder, default `content/ai-news`
- `AI_NEWS_RECENT_STORY_WINDOW_DAYS`: how many recent days should penalize already-used stories, default `3`
- `AI_NEWS_TOPIC_REPEAT_THRESHOLD`: title/topic similarity threshold for repeat-topic penalties, default `0.45`
- `AI_CONTENT_MEMORY_FILE`: path to the persistent performance-memory JSON, default `content/ai-news/performance-memory.json`
- `AI_CONTENT_VOICE`: `creator`, `operator`, `founder`, `educator`, or `newsroom`
- `AI_TELEGRAM_BOT_TOKEN`: optional Telegram bot token for morning notifications
- `AI_TELEGRAM_CHAT_ID`: optional Telegram chat id for the notification target
- `AI_TELEGRAM_SILENT`: optional `true` or `false` for silent sends
- `AI_TELEGRAM_REPO_URL`: optional override for GitHub file links in Telegram
- `AI_TELEGRAM_REPO_BRANCH`: optional override for the branch used in Telegram file links

If Telegram is configured, each run also sends a short phone-friendly morning summary with the lead story, backup story, the publish decision, quick checks, direct file links, inline buttons, and a compact `Copy now` section for the newsletter title, newsletter body, reel hook, and a post caption. The Telegram links now open the ready-to-post pack first, and they now include direct links to the publish decision and performance review. In GitHub Actions, file links are inferred automatically from the repo context. Keep `AI_TELEGRAM_BOT_TOKEN` in GitHub Actions `Secrets` and the chat id or silent flag in `Variables`.

The recorder now also penalizes stories used in the last few days and near-duplicate topics from different outlets, so the morning pack rotates more instead of repeating the same AI headline for a week.

Workflow notes for the AI news niche live in [docs/AI_CONTENT_WORKFLOW.md](docs/AI_CONTENT_WORKFLOW.md).
Content strategy and platform research notes live in [docs/CONTENT_MANAGER_PLAYBOOK.md](docs/CONTENT_MANAGER_PLAYBOOK.md).
The daily human checklist lives in [docs/DAILY_OPERATOR_CHECKLIST.md](docs/DAILY_OPERATOR_CHECKLIST.md).
The phone-friendly version lives in [docs/POST_THIS_NOW_CHECKLIST.md](docs/POST_THIS_NOW_CHECKLIST.md).

## Packaging for sale

Use [docs/MARKETPLACE_PACKAGING.md](docs/MARKETPLACE_PACKAGING.md) and [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) before publishing.
