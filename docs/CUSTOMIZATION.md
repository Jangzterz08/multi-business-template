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

## AI content workflow

Use the simplified Google Sheets sync when you want a reusable "top 5-10 AI news" list without generating full drafts.

1. Create a Google Sheet and share it with your Google service account email as an editor
2. Set `AI_NEWS_SHEET_ID`, `AI_NEWS_SHEET_NAME`, `AI_NEWS_GOOGLE_CLIENT_EMAIL`, and `AI_NEWS_GOOGLE_PRIVATE_KEY`
3. Run `npm run news:sheet` locally, or let `.github/workflows/ai-news-content.yml` run every morning at `07:00 UTC`
4. Open the sheet and sort or filter the rows by `Date`, `Category`, or `Source`
5. Mark `Status`, `Picked`, `Posted`, and `Notes` manually as you decide what to publish

If you still want the full draft-heavy output, the old recorder remains available with `npm run news:record`.

If you want the shortest possible morning routine, use [docs/DAILY_OPERATOR_CHECKLIST.md](./DAILY_OPERATOR_CHECKLIST.md).

Optional environment variables:

- `AI_NEWS_QUERY`: search query passed to the Google News RSS endpoint
- `AI_NEWS_LIMIT`: number of stories to store, default `5`
- `AI_NEWS_PREFERRED_SOURCES`: comma-separated outlets to prioritize
- `AI_NEWS_MAX_PER_SOURCE`: max stories from one outlet, default `1`
- `AI_NEWS_LANGUAGE`: feed locale, default `en-US`
- `AI_NEWS_REGION`: feed region, default `US`
- `AI_NEWS_OUTPUT_DIR`: where records are written, default `content/ai-news`
- `AI_NEWS_SHEET_ID`: target Google Sheet ID
- `AI_NEWS_SHEET_NAME`: target tab name, default `AI News`
- `AI_NEWS_GOOGLE_CLIENT_EMAIL`: Google service account email
- `AI_NEWS_GOOGLE_PRIVATE_KEY`: Google service account private key
- `AI_NEWS_RECENT_STORY_WINDOW_DAYS`: recent-day window for repeat-story penalties, default `3`
- `AI_NEWS_TOPIC_REPEAT_THRESHOLD`: overlap threshold for repeat-topic penalties, default `0.45`
- `AI_CONTENT_MEMORY_FILE`: path to the persistent performance-memory JSON, default `content/ai-news/performance-memory.json`
- `AI_CONTENT_VOICE`: `creator`, `operator`, `founder`, `educator`, or `newsroom`
Store `AI_NEWS_GOOGLE_CLIENT_EMAIL` and `AI_NEWS_GOOGLE_PRIVATE_KEY` in GitHub Actions `Secrets`, and keep `AI_NEWS_SHEET_ID` and `AI_NEWS_SHEET_NAME` in `Variables`.

## Common mistakes to avoid

- Deleting required fields from `PresetConfig`
- Forgetting to update `pageCopy` when repurposing the template for a non-service business
- Using invalid route paths outside `/, /services, /about, /contact`
- Setting form provider without endpoint/credentials
- Forgetting to update `src/presets/index.ts` when adding a new preset
