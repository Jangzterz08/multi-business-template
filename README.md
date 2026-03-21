# Multi-Business Template

Commercial-ready website template built with React + Vite + TypeScript.

## What this package includes

- One shared codebase
- Five presets: `education`, `restaurant` (Italian), `dental`, `salon`, `gym`
- Four routes for every preset: `/`, `/services`, `/about`, `/contact`
- Centralized preset config files for content + theming
- Optional shared home experience config for interactive app-style presets
- Education preset includes a full-keyboard kid mode with fullscreen lock, parent-only recovery/exit controls, one-screen graphics-first play, header-level dark/light theme and Italian switches, and floating key bubbles instead of tap pads
- The header `EN/IT` switch now localizes the full education preset website, not just the playground
- Site language and theme selections now persist per preset after reloads
- Education preset playground now centers on a clean stage background where pressed characters rise as bubbles
- Pluggable contact form adapters: Formspree, EmailJS, Custom endpoint
- Marketplace-focused docs and release checklists

## Quick start

Use Node 22 LTS for local development and release checks. In this repo's current toolchain, Node 24 can cause Vite/Vitest startup hangs on macOS.

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

- `npm run preflight:node` fail fast when the shell is not using Node 22 LTS
- `npm run dev` local development
- `npm run dev:education` preview the kids keyboard music preset
- `npm run build` production build only
- `npm run preview` preview built app
- `npm run news:record` fetch and save a top-5 AI news digest to `content/ai-news/`
- `npm run news:sheet` fetch and append the top AI news stories into Google Sheets
- `npm run lint` lint TypeScript/React files through the direct local ESLint entrypoint
- `npm run typecheck` TypeScript checks for app files only
- `npm run test` run full test suite
- `npm run smoke` run route smoke tests only

GitHub Actions:

- `.github/workflows/verify-template.yml` runs the full Node 22 verification gate on pull requests, pushes to `main`, and manual dispatch
- `.github/workflows/ai-news-content.yml` also uses Node 22 so the scheduled sheet sync matches the repo runtime contract

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
3. Add optional `homeExperience` when the preset needs the shared keyboard-play section on `/`
4. Register new preset in `src/presets/index.ts`
5. Switch to Node 22 LTS, then run `npm run smoke` and confirm all route tests pass

## Form provider selection

Form provider is selected from `preset.formProvider` and can read credentials/endpoints from environment variables.

See [docs/FORM_PROVIDERS.md](docs/FORM_PROVIDERS.md) for setup details.

## Shared copy overrides

Use optional `pageCopy` fields in a preset when the shared route language needs to fit a different business model.

- `homeExperience`: optional interactive hero-following section for app/product presets
- Interactive presets can include immersive kid-mode behavior inside the shared home experience
- Keyboard-play experiences can expose delight-layer UI like floating key bubbles, recent-key trails, streak feedback, and mascot copy without forking the shared component
- Parent-safe play modes can require fullscreen and remove easy single-key admin shortcuts so ordinary keys stay playable
- `homeExperience.locales`: optional localized playground copy and bubble palette labels for bilingual interactive presets
- `locales`: optional full-site preset translations for shared nav labels, hero/about/services/contact copy, testimonials, form copy, and localized form-provider messages
- `pageCopy.navigation`: optional route labels for the shared header nav
- Site theme and locale preferences are stored per preset in `localStorage`, so returning visitors keep their last `EN/IT` and `Light/Dark` choice
- Leave `contact.phone` and `contact.phoneLink` blank if that preset should hide phone links from the shared footer and contact surfaces
- `pageCopy.home`: hero metrics and home section headings
- `pageCopy.services`: route badge, title, intro, process steps, CTA label
- `pageCopy.about`: supporting section heading, paragraphs, and side-card labels
- `pageCopy.contact`: route headings and supporting copy
- `pageCopy.form`: form labels, placeholders, and submit button text

## AI news content workflow

This repo includes a simplified AI news workflow that scrapes the top AI stories into Google Sheets so you can pick the topic yourself and write your own post.

- Local run: `npm run news:sheet`
- Scheduled run: `.github/workflows/ai-news-content.yml` every morning at `07:00 UTC`
- Manual detailed pack: `npm run news:record`
- Sheet columns: `Date`, `Rank`, `Title`, `Source`, `Published At`, `Link`, `Summary`, `Why It Matters`, `Category`, `Status`, `Picked`, `Posted`, `Notes`
- The sync skips duplicate `date + link` rows, so rerunning it on the same day will not keep appending the same stories
- Output files: `content/ai-news/latest.json`, `content/ai-news/performance-memory.json`, `content/ai-news/YYYY-MM-DD.md`, `content/ai-news/YYYY-MM-DD-content-plan.md`, `content/ai-news/YYYY-MM-DD-daily-posting-brief.md`, `content/ai-news/YYYY-MM-DD-publish-decision.md`, `content/ai-news/YYYY-MM-DD-performance-review.md`, `content/ai-news/YYYY-MM-DD-posting-tracker.md`, `content/ai-news/YYYY-MM-DD-instagram-carousel.md`, `content/ai-news/YYYY-MM-DD-instagram-reel.md`, `content/ai-news/YYYY-MM-DD-linkedin-carousel.md`, `content/ai-news/YYYY-MM-DD-newsletter.md`, `content/ai-news/YYYY-MM-DD-ready-to-post.md`, `content/ai-news/YYYY-MM-DD-quality-report.md`, `content/ai-news/YYYY-MM-DD-publishing-queue.md`, `content/ai-news/YYYY-MM-DD-publishing-checklist.md`, `content/ai-news/YYYY-MM-DD-talking-head-30s.md`, `content/ai-news/YYYY-MM-DD-video-scripts.md`, `content/ai-news/YYYY-MM-DD-x-thread.md`, and `content/ai-news/YYYY-MM-DD-social-posts.md`

Google Sheets is now the recommended morning workflow. The detailed markdown pack still exists if you want the old draft-heavy flow manually.
To use Google Sheets, create a sheet, share it with a Google service account, and set the sheet ID plus service-account credentials in your local `.env` or GitHub Actions.

Optional environment variables for the recorder:

- `AI_NEWS_QUERY`: Google News RSS query string
- `AI_NEWS_LIMIT`: number of stories to keep, default `5`
- `AI_NEWS_PREFERRED_SOURCES`: comma-separated outlets to prioritize
- `AI_NEWS_MAX_PER_SOURCE`: limit repeats from the same outlet, default `1`
- `AI_NEWS_LANGUAGE`: locale, default `en-US`
- `AI_NEWS_REGION`: region, default `US`
- `AI_NEWS_OUTPUT_DIR`: output folder, default `content/ai-news`
- `AI_NEWS_SHEET_ID`: target Google Sheet ID for the simplified workflow
- `AI_NEWS_SHEET_NAME`: tab name inside the Google Sheet, default `AI News`
- `AI_NEWS_GOOGLE_CLIENT_EMAIL`: Google service account email used for Sheets API access
- `AI_NEWS_GOOGLE_PRIVATE_KEY`: Google service account private key used for Sheets API access
- `AI_NEWS_RECENT_STORY_WINDOW_DAYS`: how many recent days should penalize already-used stories, default `3`
- `AI_NEWS_TOPIC_REPEAT_THRESHOLD`: title/topic similarity threshold for repeat-topic penalties, default `0.45`
- `AI_CONTENT_MEMORY_FILE`: path to the persistent performance-memory JSON, default `content/ai-news/performance-memory.json`
- `AI_CONTENT_VOICE`: `creator`, `operator`, `founder`, `educator`, or `newsroom`
- `AI_TELEGRAM_BOT_TOKEN`: optional Telegram bot token for morning notifications
- `AI_TELEGRAM_CHAT_ID`: optional Telegram chat id for the notification target
- `AI_TELEGRAM_SILENT`: optional `true` or `false` for silent sends
- `AI_TELEGRAM_REPO_URL`: optional override for GitHub file links in Telegram
- `AI_TELEGRAM_REPO_BRANCH`: optional override for the branch used in Telegram file links

For the simplified Sheets workflow, share the spreadsheet with `AI_NEWS_GOOGLE_CLIENT_EMAIL` as an editor. In GitHub Actions, store `AI_NEWS_GOOGLE_CLIENT_EMAIL` and `AI_NEWS_GOOGLE_PRIVATE_KEY` in `Secrets`, and store `AI_NEWS_SHEET_ID` and `AI_NEWS_SHEET_NAME` in `Variables`.

The recorder now also penalizes stories used in the last few days and near-duplicate topics from different outlets, so the morning pack rotates more instead of repeating the same AI headline for a week.

Workflow notes for the AI news niche live in [docs/AI_CONTENT_WORKFLOW.md](docs/AI_CONTENT_WORKFLOW.md).
Content strategy and platform research notes live in [docs/CONTENT_MANAGER_PLAYBOOK.md](docs/CONTENT_MANAGER_PLAYBOOK.md).
The daily human checklist lives in [docs/DAILY_OPERATOR_CHECKLIST.md](docs/DAILY_OPERATOR_CHECKLIST.md).
The phone-friendly version lives in [docs/POST_THIS_NOW_CHECKLIST.md](docs/POST_THIS_NOW_CHECKLIST.md).

## Packaging for sale

Use [docs/MARKETPLACE_PACKAGING.md](docs/MARKETPLACE_PACKAGING.md) and [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) before publishing.
