# AI Content Workflow

This workflow is tuned for AI news content, where freshness, trust, and fast repurposing matter more than volume.

## What the research points to

- Morning publishing matters because news-driven attention is strongest when the story is still fresh.
- Curated lists perform better than link dumps when the editor adds context and explains why the story matters.
- Trust and attribution matter, especially for AI topics where claims can move quickly and get overstated.
- The same daily research should feed multiple formats: newsletter, short-form video, and social hooks.

## How this repo applies that

The recorder keeps the daily brief to five stories and now creates a full morning output pack:

- `content/ai-news/YYYY-MM-DD.md`: the ranked source digest
- `content/ai-news/YYYY-MM-DD-content-plan.md`: the creation brief with subject lines, hooks, scripts, and a verification checklist
- `content/ai-news/YYYY-MM-DD-daily-posting-brief.md`: the one-file morning action brief
- `content/ai-news/YYYY-MM-DD-instagram-carousel.md`: an Instagram carousel outline from the lead story, plus alternate cover options
- `content/ai-news/YYYY-MM-DD-instagram-reel.md`: an Instagram Reel pack from the lead story, plus alternate hooks and CTA options
- `content/ai-news/YYYY-MM-DD-linkedin-carousel.md`: a LinkedIn carousel outline built from the lead story, plus alternate cover options
- `content/ai-news/YYYY-MM-DD-newsletter.md`: first-draft newsletter copy
- `content/ai-news/YYYY-MM-DD-ready-to-post.md`: copy-paste-ready platform content with title, body, and CTA sections
- `content/ai-news/YYYY-MM-DD-quality-report.md`: a QA report that flags weak hooks, soft CTAs, and repeated angles before publishing, then gives auto-fix options
- `content/ai-news/YYYY-MM-DD-publishing-queue.md`: the exact order for the morning posts
- `content/ai-news/YYYY-MM-DD-publishing-checklist.md`: preflight and KPI checklist
- `content/ai-news/YYYY-MM-DD-talking-head-30s.md`: a timed 30-second talking-head script
- `content/ai-news/YYYY-MM-DD-video-scripts.md`: three vertical video scripts
- `content/ai-news/YYYY-MM-DD-x-thread.md`: an X thread from the lead story
- `content/ai-news/YYYY-MM-DD-social-posts.md`: five social post drafts

## Anti-flop principles baked into the workflow

- Originality: every story now carries an "original take to add" prompt so the output does not stop at headline rewrites.
- Hook speed: short-form scripts now assume the hook must land in the first 3 to 6 seconds.
- Native distribution: social drafts now recommend native LinkedIn formats instead of plain link-only posting.
- Measurement: the publishing checklist focuses on clicks, replies, hold rate, completion, saves, and reposts instead of vanity metrics alone.
- Quality control: the daily QA report now checks hook strength, originality, CTA coverage, and cross-channel repetition before anything goes live.
- Recovery built in: when a draft is weak, the workflow now generates alternate hooks, alternate cover lines, and direct CTA options so you can fix it fast instead of improvising.

Ranking is designed to reflect the niche:

- Fresh stories are scored higher
- Product, research, funding, and agent/model signals get extra weight
- Preferred sources can be boosted with `AI_NEWS_PREFERRED_SOURCES`
- Source diversity is enforced with `AI_NEWS_MAX_PER_SOURCE`

## Recommended morning routine

1. Let the workflow run in the morning
2. Open the ready-to-post pack first if you want immediate copy-paste text
3. Open the daily posting brief and quality report for direction and QA
4. Tighten any weak hooks, repeated angles, or missing CTAs the QA report flags
5. Pick one lead story for a short video or carousel
6. Turn the full top five into a newsletter or morning post
7. Verify any surprising claim on the original article before publishing

## Suggested repo settings

Set these in your local `.env` or GitHub Actions variables if needed:

- `AI_NEWS_QUERY`
- `AI_NEWS_LIMIT`
- `AI_NEWS_PREFERRED_SOURCES`
- `AI_NEWS_MAX_PER_SOURCE`
- `AI_NEWS_LANGUAGE`
- `AI_NEWS_REGION`
- `AI_CONTENT_VOICE`
- `AI_TELEGRAM_BOT_TOKEN`
- `AI_TELEGRAM_CHAT_ID`
- `AI_TELEGRAM_SILENT`
- `AI_TELEGRAM_REPO_URL`
- `AI_TELEGRAM_REPO_BRANCH`

When Telegram is configured, the workflow also sends a compact morning notification with the lead story, backup story, post order, quick checks, direct file links, inline buttons, and compact `Copy now` snippets so the operator can act from a phone without opening the full pack first.

## Research sources

- Google Search Central, "Creating helpful, reliable, people-first content": https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central, "Google Discover": https://developers.google.com/search/docs/appearance/google-discover
- Google Search Central, "Preferred sources in Google News": https://support.google.com/googlenews/answer/16513016?hl=en
- LinkedIn Page posting guide: https://business.linkedin.com/content/dam/me/business/en-us/amp/marketing-solutions/images/stories/best-practices/pdfs/lms-linkedin-page-posting-best-practices-one-pager.pdf
- TikTok Creative Codes: https://ads.tiktok.com/business/en/creative-codes
- YouTube Shorts tools and captions: https://blog.youtube/news-and-events/6-new-youtube-shorts-tools/
- Mailchimp email subject line best practices: https://mailchimp.com/en/help/best-practices-for-email-subject-lines/
- Mailchimp email reporting metrics: https://mailchimp.com/resources/email-reporting/
- beehiiv, "State of newsletters 2025": https://www.beehiiv.com/blog/state-of-newsletters
- Buffer, "How to write social media hooks": https://buffer.com/resources/social-media-hooks/
