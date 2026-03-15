import { describe, expect, it } from 'vitest';

import {
  buildContentPlan,
  buildContentQualityReport,
  buildDailyPublishingQueue,
  buildDailyPostingBrief,
  buildInstagramCarousel,
  buildInstagramReel,
  buildLinkedInCarouselOutline,
  buildMarkdownDigest,
  buildNewsletterDraft,
  buildPublishDecisionReport,
  buildPublishingChecklist,
  buildReadyToPostPack,
  buildSocialPostPack,
  buildTelegramNotification,
  buildTelegramReplyMarkup,
  buildTalkingHeadScript30s,
  buildVideoScriptPack,
  buildXThread,
  createGoogleNewsFeedUrl,
  parseRssItems,
  rankArticles,
} from './record-ai-news.mjs';

const sampleFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title><![CDATA[OpenAI launches a new reasoning model - The Verge]]></title>
      <link>https://example.com/openai-reasoning</link>
      <pubDate>Fri, 14 Mar 2026 08:00:00 GMT</pubDate>
      <description><![CDATA[The release focuses on agents and reasoning.]]></description>
      <source url="https://www.theverge.com">The Verge</source>
    </item>
    <item>
      <title><![CDATA[Anthropic raises funding for robotics push - Reuters]]></title>
      <link>https://example.com/anthropic-funding</link>
      <pubDate>Fri, 14 Mar 2026 06:30:00 GMT</pubDate>
      <description><![CDATA[Fresh AI funding and robotics expansion plans.]]></description>
      <source url="https://www.reuters.com">Reuters</source>
    </item>
    <item>
      <title><![CDATA[Older AI policy update - Example News]]></title>
      <link>https://example.com/older-ai-policy</link>
      <pubDate>Mon, 09 Mar 2026 09:00:00 GMT</pubDate>
      <description><![CDATA[A policy update without major product news.]]></description>
      <source url="https://example.com">Example News</source>
    </item>
  </channel>
</rss>`;

describe('record-ai-news helpers', () => {
  it('builds a Google News RSS url with locale parameters', () => {
    const url = createGoogleNewsFeedUrl({
      query: 'AI breakthroughs',
      language: 'en-US',
      region: 'US',
    });

    expect(url).toContain('https://news.google.com/rss/search?');
    expect(url).toContain('q=AI+breakthroughs');
    expect(url).toContain('hl=en-US');
    expect(url).toContain('gl=US');
    expect(url).toContain('ceid=US%3Aen');
  });

  it('parses RSS items and ranks recent headline-heavy stories first', () => {
    const items = parseRssItems(sampleFeed);
    const ranked = rankArticles(
      items,
      new Date('2026-03-14T10:00:00.000Z'),
      2,
      new Set(['the verge', 'reuters']),
      1,
    );

    expect(items).toHaveLength(3);
    expect(ranked).toHaveLength(2);
    expect(ranked[0]?.title).toBe('OpenAI launches a new reasoning model');
    expect(ranked[1]?.title).toBe('Anthropic raises funding for robotics push');
    expect(ranked[0]?.score).toBeGreaterThan(ranked[1]?.score - 5);
  });

  it('creates a markdown digest with the expected structure', () => {
    const markdown = buildMarkdownDigest({
      generatedAt: '2026-03-14T10:00:00.000Z',
      query: 'AI breakthroughs',
      feedUrl: 'https://news.google.com/rss/search?q=AI+breakthroughs',
      articles: [
        {
          title: 'OpenAI launches a new reasoning model',
          link: 'https://example.com/openai-reasoning',
          source: 'The Verge',
          pubDate: 'Fri, 14 Mar 2026 08:00:00 GMT',
          score: 61,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: launch, model.',
        },
      ],
    });

    expect(markdown).toContain('# AI News Digest for 2026-03-14');
    expect(markdown).toContain('[OpenAI launches a new reasoning model](https://example.com/openai-reasoning)');
    expect(markdown).toContain('Why it stood out: Ranked highly');
  });

  it('creates a content plan that turns the digest into publishable outputs', () => {
    const plan = buildContentPlan({
      generatedAt: '2026-03-14T10:00:00.000Z',
      voice: 'operator',
      preferredSources: ['reuters', 'the verge'],
      articles: [
        {
          title: 'OpenAI launches a new reasoning model',
          link: 'https://example.com/openai-reasoning',
          source: 'The Verge',
          pubDate: 'Fri, 14 Mar 2026 08:00:00 GMT',
          score: 61,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: launch, model.',
          description: 'The release focuses on agents and reasoning.',
        },
        {
          title: 'Anthropic raises funding for robotics push',
          link: 'https://example.com/anthropic-funding',
          source: 'Reuters',
          pubDate: 'Fri, 14 Mar 2026 06:30:00 GMT',
          score: 50,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: Anthropic, funding, robotics.',
          description: 'Fresh AI funding and robotics expansion plans.',
        },
      ],
    });

    expect(plan).toContain('# AI Content Plan for 2026-03-14');
    expect(plan).toContain('- Voice: Operator');
    expect(plan).toContain('## Newsletter package');
    expect(plan).toContain('## Short-form package');
    expect(plan).toContain('## Anti-flop guardrails');
    expect(plan).toContain('## Verification checklist');
    expect(plan).toContain('OpenAI launches a new reasoning model');
  });

  it('creates a newsletter draft, video scripts, and social posts', () => {
    const payload = {
      generatedAt: '2026-03-14T10:00:00.000Z',
      voice: 'founder',
      articles: [
        {
          title: 'OpenAI launches a new reasoning model',
          link: 'https://example.com/openai-reasoning',
          source: 'The Verge',
          pubDate: 'Fri, 14 Mar 2026 08:00:00 GMT',
          score: 61,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: launch, model.',
          description: 'The release focuses on agents and reasoning.',
        },
        {
          title: 'Anthropic raises funding for robotics push',
          link: 'https://example.com/anthropic-funding',
          source: 'Reuters',
          pubDate: 'Fri, 14 Mar 2026 06:30:00 GMT',
          score: 50,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: Anthropic, funding, robotics.',
          description: 'Fresh AI funding and robotics expansion plans.',
        },
        {
          title: 'Google shows a new AI video model',
          link: 'https://example.com/google-video',
          source: 'TechCrunch',
          pubDate: 'Fri, 14 Mar 2026 05:00:00 GMT',
          score: 48,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: model, Google, video.',
          description: 'A new video model expands creator tooling.',
        },
      ],
    };

    const newsletter = buildNewsletterDraft(payload);
    const readyToPost = buildReadyToPostPack(payload);
    const brief = buildDailyPostingBrief(payload);
    const qualityReport = buildContentQualityReport(payload);
    const instagramCarousel = buildInstagramCarousel(payload);
    const instagramReel = buildInstagramReel(payload);
    const carousel = buildLinkedInCarouselOutline(payload);
    const queue = buildDailyPublishingQueue(payload);
    const checklist = buildPublishingChecklist(payload);
    const talkingHead = buildTalkingHeadScript30s(payload);
    const videos = buildVideoScriptPack(payload);
    const xThread = buildXThread(payload);
    const posts = buildSocialPostPack(payload);

    expect(newsletter).toContain('# AI Morning Newsletter Draft for 2026-03-14');
    expect(newsletter).toContain('Voice: Founder');
    expect(newsletter).toContain('## Anti-flop notes');
    expect(newsletter).toContain('Subject line 1:');
    expect(newsletter).toContain('## 1. OpenAI launches a new reasoning model');
    expect(readyToPost).toContain('# AI Ready-to-Post Pack for 2026-03-14');
    expect(readyToPost).toContain('## LinkedIn Post');
    expect(readyToPost).toContain('## Instagram Reel');
    expect(readyToPost).toContain('## X Thread');
    expect(readyToPost).toContain('```text');
    expect(brief).toContain('# AI Daily Posting Brief for 2026-03-14');
    expect(brief).toContain('## Start here');
    expect(brief).toContain('Ready-to-post pack: content/ai-news/2026-03-14-ready-to-post.md');
    expect(brief).toContain('Publish decision: content/ai-news/2026-03-14-publish-decision.md');
    expect(brief).toContain('Performance review: content/ai-news/2026-03-14-performance-review.md');
    expect(brief).toContain('Instagram carousel: content/ai-news/2026-03-14-instagram-carousel.md');
    expect(brief).toContain('Publishing queue: content/ai-news/2026-03-14-publishing-queue.md');
    expect(brief).toContain('LinkedIn carousel: content/ai-news/2026-03-14-linkedin-carousel.md');
    expect(brief).toContain('Quality report: content/ai-news/2026-03-14-quality-report.md');
    expect(qualityReport).toContain('# AI Content Quality Report for 2026-03-14');
    expect(qualityReport).toContain('## Scorecard');
    expect(qualityReport).toContain('## Watchouts before posting');
    expect(qualityReport).toContain('## Auto-fix options');
    expect(qualityReport).toContain('Instagram Reel hook option 1:');
    expect(instagramCarousel).toContain('# AI Instagram Carousel for 2026-03-14');
    expect(instagramCarousel).toContain('## Carousel slides');
    expect(instagramCarousel).toContain('## Cover options');
    expect(instagramReel).toContain('# AI Instagram Reel Pack for 2026-03-14');
    expect(instagramReel).toContain('## Reel script');
    expect(instagramReel).toContain('## Alternate hooks');
    expect(instagramReel).toContain('## CTA options');
    expect(queue).toContain('# AI Daily Publishing Queue for 2026-03-14');
    expect(queue).toContain('## Publishing order');
    expect(queue).toContain('1. Publish the newsletter lead first.');
    expect(checklist).toContain('# AI Publishing Checklist for 2026-03-14');
    expect(checklist).toContain('Voice: Founder');
    expect(checklist).toContain('## Before publishing');
    expect(carousel).toContain('# AI LinkedIn Carousel for 2026-03-14');
    expect(carousel).toContain('## Slide outline');
    expect(carousel).toContain('## Cover options');
    expect(talkingHead).toContain('# AI Talking Head Script 30s for 2026-03-14');
    expect(talkingHead).toContain('## Beat timing');
    expect(talkingHead).toContain('## Alternate hooks');
    expect(talkingHead).toContain('## CTA options');
    expect(videos).toContain('# AI Short-Form Script Pack for 2026-03-14');
    expect(videos).toContain('Voice: Founder');
    expect(videos).toContain('### Production notes');
    expect(videos).toContain('## Video Script 3');
    expect(xThread).toContain('# AI X Thread for 2026-03-14');
    expect(xThread).toContain('## Thread');
    expect(posts).toContain('# AI Social Post Pack for 2026-03-14');
    expect(posts).toContain('Voice: Founder');
    expect(posts).toContain('Recommended LinkedIn format: native document or video');
    expect(posts).toContain('## Social Post 3');
  });

  it('creates a phone-friendly Telegram notification summary', () => {
    const telegramMessage = buildTelegramNotification({
      generatedAt: '2026-03-14T10:00:00.000Z',
      voice: 'operator',
      repoUrl: 'https://github.com/example-org/multi-business-template',
      repoBranch: 'main',
      articles: [
        {
          title: 'OpenAI launches a new reasoning model',
          link: 'https://example.com/openai-reasoning',
          source: 'The Verge',
          pubDate: 'Fri, 14 Mar 2026 08:00:00 GMT',
          score: 61,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: launch, model.',
          description: 'The release focuses on agents and reasoning.',
        },
        {
          title: 'Anthropic raises funding for robotics push',
          link: 'https://example.com/anthropic-funding',
          source: 'Reuters',
          pubDate: 'Fri, 14 Mar 2026 06:30:00 GMT',
          score: 50,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: Anthropic, funding, robotics.',
          description: 'Fresh AI funding and robotics expansion plans.',
        },
      ],
    });
    const telegramReplyMarkup = buildTelegramReplyMarkup({
      generatedAt: '2026-03-14T10:00:00.000Z',
      repoUrl: 'https://github.com/example-org/multi-business-template',
      repoBranch: 'main',
      articles: [
        {
          title: 'OpenAI launches a new reasoning model',
          link: 'https://example.com/openai-reasoning',
          source: 'The Verge',
          pubDate: 'Fri, 14 Mar 2026 08:00:00 GMT',
          score: 61,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: launch, model.',
          description: 'The release focuses on agents and reasoning.',
        },
        {
          title: 'Anthropic raises funding for robotics push',
          link: 'https://example.com/anthropic-funding',
          source: 'Reuters',
          pubDate: 'Fri, 14 Mar 2026 06:30:00 GMT',
          score: 50,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: Anthropic, funding, robotics.',
          description: 'Fresh AI funding and robotics expansion plans.',
        },
      ],
    });

    expect(telegramMessage).toContain('<b>AI Morning Pack Ready</b>');
    expect(telegramMessage).toContain('<b>Lead</b>: <a href="https://example.com/openai-reasoning">OpenAI launches a new reasoning model</a>');
    expect(telegramMessage).toContain('<b>Post now</b>');
    expect(telegramMessage).toContain('<b>Copy now</b>');
    expect(telegramMessage).toContain('<b>Newsletter title</b>');
    expect(telegramMessage).toContain('<pre>AI Brief 03-14: OpenAI launches a new reasoning model</pre>');
    expect(telegramMessage).toContain('<b>Post caption</b>');
    expect(telegramMessage).toContain('<b>Open pack</b>');
    expect(telegramMessage).toContain('https://github.com/example-org/multi-business-template/blob/main/content/ai-news/2026-03-14-daily-posting-brief.md');
    expect(telegramMessage).toContain('Use Ready Pack for the full newsletter, carousel, thread, and talking-head copy.');
    expect(telegramMessage).toContain('Use alternate hooks or CTA options if the opener feels weak');
    expect(telegramReplyMarkup).toEqual({
      inline_keyboard: [
        [
          { text: 'Lead Story', url: 'https://example.com/openai-reasoning' },
          { text: 'Backup Story', url: 'https://example.com/anthropic-funding' },
        ],
        [
          {
            text: 'Ready Pack',
            url: 'https://github.com/example-org/multi-business-template/blob/main/content/ai-news/2026-03-14-ready-to-post.md',
          },
          {
            text: 'Open Brief',
            url: 'https://github.com/example-org/multi-business-template/blob/main/content/ai-news/2026-03-14-daily-posting-brief.md',
          },
        ],
        [
          {
            text: 'Open QA',
            url: 'https://github.com/example-org/multi-business-template/blob/main/content/ai-news/2026-03-14-quality-report.md',
          },
          {
            text: 'Decision',
            url: 'https://github.com/example-org/multi-business-template/blob/main/content/ai-news/2026-03-14-publish-decision.md',
          },
        ],
        [
          {
            text: 'Open Reel',
            url: 'https://github.com/example-org/multi-business-template/blob/main/content/ai-news/2026-03-14-instagram-reel.md',
          },
          {
            text: 'Review',
            url: 'https://github.com/example-org/multi-business-template/blob/main/content/ai-news/2026-03-14-performance-review.md',
          },
        ],
      ],
    });
  });

  it('creates a publish decision report using memory and editorial heuristics', () => {
    const report = buildPublishDecisionReport({
      generatedAt: '2026-03-14T10:00:00.000Z',
      voice: 'creator',
      preferredSources: ['reuters', 'the verge'],
      performanceMemory: {
        version: 1,
        updatedAt: '2026-03-13T10:00:00.000Z',
        history: [
          {
            date: '2026-03-13',
            leadSource: 'Reuters',
            leadAngle: 'product update',
            metrics: { newsletterClicks: 42 },
            operatorReview: { status: 'published', winningPlatform: 'LinkedIn', winningAngle: 'product update', notes: '' },
          },
        ],
        insights: {
          completedEntryCount: 1,
          winningAngles: [{ label: 'product update', count: 1 }],
          winningPlatforms: [{ label: 'LinkedIn', count: 1 }],
          winningSources: [{ label: 'Reuters', count: 1 }],
          summary: 'Performance memory from 1 completed day(s): product update stories have won 1 time(s).',
        },
      },
      articles: [
        {
          title: 'OpenAI launches a new reasoning model',
          link: 'https://example.com/openai-reasoning',
          source: 'Reuters',
          pubDate: 'Fri, 14 Mar 2026 08:00:00 GMT',
          score: 61,
          ageHours: 2,
          matchedLabels: ['launch', 'model', 'OpenAI'],
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: launch, model.',
          description: 'The release focuses on agents and reasoning.',
        },
        {
          title: 'Anthropic raises funding for robotics push',
          link: 'https://example.com/anthropic-funding',
          source: 'The Verge',
          pubDate: 'Fri, 14 Mar 2026 06:30:00 GMT',
          score: 50,
          ageHours: 3.5,
          matchedLabels: ['Anthropic', 'funding', 'robotics'],
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: Anthropic, funding, robotics.',
          description: 'Fresh AI funding and robotics expansion plans.',
        },
      ],
    });

    expect(report).toContain('# AI Publish Decision for 2026-03-14');
    expect(report).toContain('Decision:');
    expect(report).toContain('Lead score:');
    expect(report).toContain('Performance memory');
    expect(report).toContain('What to do now');
  });

  it('uses the creator voice as the sharper default output', () => {
    const readyToPost = buildReadyToPostPack({
      generatedAt: '2026-03-14T10:00:00.000Z',
      articles: [
        {
          title: 'OpenAI launches a new reasoning model',
          link: 'https://example.com/openai-reasoning',
          source: 'The Verge',
          pubDate: 'Fri, 14 Mar 2026 08:00:00 GMT',
          score: 61,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: launch, model.',
          description: 'The release focuses on agents and reasoning.',
        },
      ],
    });

    expect(readyToPost).toContain('Voice: Creator');
    expect(readyToPost).toContain('Most people will repost the headline.');
    expect(readyToPost).toContain('what it changes');
  });

  it('classifies policy-heavy stories as policy signals even when launch language appears', () => {
    const plan = buildContentPlan({
      generatedAt: '2026-03-14T10:00:00.000Z',
      voice: 'newsroom',
      preferredSources: ['reuters'],
      articles: [
        {
          title: 'AI policy update lands in Europe',
          link: 'https://example.com/eu-policy',
          source: 'Reuters',
          pubDate: 'Fri, 14 Mar 2026 05:30:00 GMT',
          score: 44,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: launch.',
          description: 'New rules could affect AI product launches.',
        },
      ],
    });

    expect(plan).toContain('- Angle: policy signal');
  });

  it('changes tone based on the selected content voice', () => {
    const founderPlan = buildContentPlan({
      generatedAt: '2026-03-14T10:00:00.000Z',
      voice: 'founder',
      preferredSources: ['reuters'],
      articles: [
        {
          title: 'Anthropic raises funding for robotics push',
          link: 'https://example.com/anthropic-funding',
          source: 'Reuters',
          pubDate: 'Fri, 14 Mar 2026 06:30:00 GMT',
          score: 50,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: Anthropic, funding, robotics.',
          description: 'Fresh AI funding and robotics expansion plans.',
        },
      ],
    });

    const educatorPlan = buildContentPlan({
      generatedAt: '2026-03-14T10:00:00.000Z',
      voice: 'educator',
      preferredSources: ['reuters'],
      articles: [
        {
          title: 'OpenAI launches a new reasoning model',
          link: 'https://example.com/openai-reasoning',
          source: 'The Verge',
          pubDate: 'Fri, 14 Mar 2026 08:00:00 GMT',
          score: 61,
          whyItMatters: 'Ranked highly because it is very recent and keyword signals: launch, model.',
          description: 'The release focuses on agents and reasoning.',
        },
      ],
    });

    expect(founderPlan).toContain('Voice: Founder');
    expect(founderPlan).toContain('strategic');
    expect(educatorPlan).toContain('Voice: Educator');
    expect(educatorPlan).toContain('understand');
  });
});
