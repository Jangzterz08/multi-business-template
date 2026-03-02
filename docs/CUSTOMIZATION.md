# Customization Guide

This template is designed so buyers can edit one preset config file and avoid component rewrites.

## Primary edit surface

Preset files:

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
- SEO tags: `seo.title`, `seo.description`, `seo.keywords`
- Theme: `designTokens`
- Form transport: `formProvider`

## No-code-like workflow

1. Duplicate the nearest preset `config.ts`
2. Replace business copy and service list
3. Replace contact details and hours
4. Pick or configure form provider
5. Tune token colors/typography
6. Preview locally and run smoke tests

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

## Motion and accessibility

- Entry animations use `.motionReveal`
- Reduced motion is respected via `prefers-reduced-motion`
- Keep heading hierarchy and button labels clear when customizing copy

## Preset switching for QA

Set in `.env`:

```env
VITE_PRESET=restaurant
```

Then run:

```bash
npm run dev
npm run smoke
```

## Common mistakes to avoid

- Deleting required fields from `PresetConfig`
- Using invalid route paths outside `/, /services, /about, /contact`
- Setting form provider without endpoint/credentials
- Forgetting to update `src/presets/index.ts` when adding a new preset
