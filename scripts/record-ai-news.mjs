import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const DEFAULT_QUERY =
  'AI OR "artificial intelligence" OR ChatGPT OR OpenAI OR Anthropic OR Gemini when:7d';
const DEFAULT_LIMIT = 5;
const DEFAULT_OUTPUT_DIR = 'content/ai-news';
const DEFAULT_MAX_PER_SOURCE = 1;
const DEFAULT_VOICE = 'operator';
const GOOGLE_NEWS_HOST = 'https://news.google.com';

const VOICE_PROFILES = {
  operator: {
    key: 'operator',
    label: 'Operator',
    intro:
      "This morning's AI brief pulls the five stories most worth your attention and focuses on what builders, operators, and decision-makers should do with the signal.",
    closing:
      'Keep the sources linked, add your own operational read, and publish only after the takeaway is clear.',
    originalityPrefix: 'Add one practical takeaway about what people should change, watch, or do next.',
    socialFormatNote:
      'Recommended LinkedIn format: native image, video, or document with 3-5 relevant hashtags.',
  },
  founder: {
    key: 'founder',
    label: 'Founder',
    intro:
      "This morning's AI brief is built for founders and operators who care about where advantage is shifting and what deserves attention before the market catches up.",
    closing:
      'Publish with a clear point of view, not just a recap, and make the strategic implication explicit.',
    originalityPrefix: 'Add one strategic takeaway about leverage, market timing, or competitive advantage.',
    socialFormatNote:
      'Recommended LinkedIn format: native document or video with a strong founder point of view.',
  },
  educator: {
    key: 'educator',
    label: 'Educator',
    intro:
      "This morning's AI brief is designed to make the news easier to understand by translating fast-moving headlines into clear, useful takeaways.",
    closing:
      'Publish with clarity, context, and attribution so the audience learns something real.',
    originalityPrefix: 'Add one clear takeaway that helps the audience understand the concept or implication better.',
    socialFormatNote:
      'Recommended LinkedIn format: native carousel, image, or explainer video with simple framing.',
  },
  newsroom: {
    key: 'newsroom',
    label: 'Newsroom',
    intro:
      "This morning's AI brief is written in a tighter newsroom style: concise, sourced, and focused on the most relevant developments.",
    closing:
      'Publish with tight sourcing, minimal hype, and a clear statement of why the item matters now.',
    originalityPrefix: 'Add one concise editorial takeaway that clarifies significance without overstating the claim.',
    socialFormatNote:
      'Recommended LinkedIn format: native image or document with concise, attribution-forward copy.',
  },
};

const SCORE_KEYWORDS = [
  { pattern: /\bbreakthrough\b/i, score: 12, label: 'breakthrough' },
  { pattern: /\blaunch(?:ed|es|ing)?\b/i, score: 10, label: 'launch' },
  { pattern: /\brelease(?:d|s)?\b/i, score: 9, label: 'release' },
  { pattern: /\bmodel\b/i, score: 9, label: 'model' },
  { pattern: /\bagent(?:s)?\b/i, score: 8, label: 'agents' },
  { pattern: /\breasoning\b/i, score: 8, label: 'reasoning' },
  { pattern: /\bgpt\b/i, score: 7, label: 'GPT' },
  { pattern: /\bopenai\b/i, score: 7, label: 'OpenAI' },
  { pattern: /\banthropic\b/i, score: 7, label: 'Anthropic' },
  { pattern: /\bgemini\b/i, score: 7, label: 'Gemini' },
  { pattern: /\bclaude\b/i, score: 7, label: 'Claude' },
  { pattern: /\bnvidia\b/i, score: 6, label: 'NVIDIA' },
  { pattern: /\bmicrosoft\b/i, score: 6, label: 'Microsoft' },
  { pattern: /\bgoogle\b/i, score: 6, label: 'Google' },
  { pattern: /\bmeta\b/i, score: 6, label: 'Meta' },
  { pattern: /\bfunding\b/i, score: 5, label: 'funding' },
  { pattern: /\bstartup\b/i, score: 5, label: 'startup' },
  { pattern: /\brobotics?\b/i, score: 5, label: 'robotics' },
  { pattern: /\bvideo\b/i, score: 4, label: 'video' },
  { pattern: /\bimage\b/i, score: 4, label: 'image' },
];

const COMPARISON_STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'this',
  'from',
  'your',
  'will',
  'into',
  'what',
  'when',
  'more',
  'than',
  'they',
  'their',
  'have',
  'about',
  'just',
  'today',
  'story',
  'morning',
  'suggested',
  'angle',
  'source',
]);

function envValue(name, fallback) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : fallback;
}

function parseLimit(value, fallback = DEFAULT_LIMIT) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseCsv(value) {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseBoolean(value, fallback = false) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function escapeHtml(value) {
  return value
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;');
}

function normalizeSource(source) {
  return source.trim().toLowerCase();
}

function resolveVoiceProfile(voiceKey) {
  return VOICE_PROFILES[voiceKey] ?? VOICE_PROFILES[DEFAULT_VOICE];
}

export async function readDotEnvFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export async function loadLocalEnv(filePath = '.env') {
  const content = await readDotEnvFile(filePath);

  if (!content) {
    return;
  }

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    const value = rawValue.replace(/^(['"])(.*)\1$/u, '$2');
    process.env[key] = value;
  }
}

export function createGoogleNewsFeedUrl({
  query,
  language = 'en-US',
  region = 'US',
}) {
  const languageCode = language.split('-')[0] ?? 'en';
  const params = new URLSearchParams({
    q: query,
    hl: language,
    gl: region,
    ceid: `${region}:${languageCode}`,
  });

  return `${GOOGLE_NEWS_HOST}/rss/search?${params.toString()}`;
}

export function decodeHtmlEntities(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gu, '$1')
    .replace(/&amp;/gu, '&')
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>')
    .replace(/&quot;/gu, '"')
    .replace(/&#39;/gu, "'")
    .replace(/&#x27;/giu, "'");
}

export function stripTags(value) {
  return decodeHtmlEntities(value).replace(/<[^>]+>/gu, ' ').replace(/\s+/gu, ' ').trim();
}

export function extractTag(itemXml, tagName) {
  const regex = new RegExp(`<${tagName}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'iu');
  const match = itemXml.match(regex);
  return match ? match[1].trim() : '';
}

export function parseRssItems(xml) {
  const items = [];
  const matches = xml.matchAll(/<item\b[\s\S]*?<\/item>/gu);

  for (const match of matches) {
    const itemXml = match[0];
    const rawTitle = stripTags(extractTag(itemXml, 'title'));
    const description = stripTags(extractTag(itemXml, 'description'));
    const source = stripTags(extractTag(itemXml, 'source'));
    const pubDate = stripTags(extractTag(itemXml, 'pubDate'));
    const link = stripTags(extractTag(itemXml, 'link'));

    if (!rawTitle || !link) {
      continue;
    }

    const title = rawTitle.replace(/\s+-\s+[^-]+$/u, '').trim();
    const inferredSource = source || rawTitle.split(/\s+-\s+/u).at(-1) || 'Unknown source';

    items.push({
      title,
      rawTitle,
      description,
      source: inferredSource.trim(),
      link,
      pubDate,
    });
  }

  return items;
}

export function scoreArticle(article, now = new Date(), preferredSources = new Set()) {
  const publishedAt = article.pubDate ? new Date(article.pubDate) : null;
  const ageHours =
    publishedAt && !Number.isNaN(publishedAt.valueOf())
      ? Math.max(0, (now.valueOf() - publishedAt.valueOf()) / 36e5)
      : 168;

  let score = 0;

  if (ageHours <= 12) {
    score += 35;
  } else if (ageHours <= 24) {
    score += 28;
  } else if (ageHours <= 48) {
    score += 20;
  } else if (ageHours <= 72) {
    score += 12;
  } else if (ageHours <= 168) {
    score += 6;
  }

  const searchText = `${article.title} ${article.description} ${article.source}`;
  const matchedLabels = [];

  for (const keyword of SCORE_KEYWORDS) {
    if (keyword.pattern.test(searchText)) {
      score += keyword.score;
      matchedLabels.push(keyword.label);
    }
  }

  if (preferredSources.has(normalizeSource(article.source))) {
    score += 12;
    matchedLabels.push('preferred-source');
  }

  return {
    score,
    ageHours,
    matchedLabels,
  };
}

function articleKey(article) {
  const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9]+/gu, ' ').trim();
  const normalizedLink = article.link.replace(/\?.*$/u, '').trim().toLowerCase();
  return `${normalizedTitle}::${normalizedLink}`;
}

export function rankArticles(
  items,
  now = new Date(),
  limit = DEFAULT_LIMIT,
  preferredSources = new Set(),
  maxPerSource = DEFAULT_MAX_PER_SOURCE,
) {
  const deduped = new Map();

  for (const item of items) {
    const key = articleKey(item);

    if (!deduped.has(key)) {
      deduped.set(key, item);
    }
  }

  const ranked = [...deduped.values()]
    .map((article) => {
      const scoring = scoreArticle(article, now, preferredSources);
      return {
        ...article,
        ...scoring,
        whyItMatters: describeArticle(scoring),
      };
    })
    .sort((left, right) => right.score - left.score);

  const selected = [];
  const sourceCounts = new Map();

  for (const article of ranked) {
    const source = normalizeSource(article.source);
    const currentCount = sourceCounts.get(source) ?? 0;

    if (currentCount >= maxPerSource) {
      continue;
    }

    selected.push(article);
    sourceCounts.set(source, currentCount + 1);

    if (selected.length >= limit) {
      break;
    }
  }

  return selected;
}

export function describeArticle(scoring) {
  const reasons = [];

  if (scoring.ageHours <= 24) {
    reasons.push('very recent');
  } else if (scoring.ageHours <= 72) {
    reasons.push('recent');
  }

  if (scoring.matchedLabels.length) {
    reasons.push(`keyword signals: ${scoring.matchedLabels.slice(0, 3).join(', ')}`);
  }

  return reasons.length
    ? `Ranked highly because it is ${reasons.join(' and ')}.`
    : 'Ranked from the AI news query match and recency.';
}

export function buildMarkdownDigest({
  generatedAt,
  query,
  feedUrl,
  articles,
}) {
  const header = [
    `# AI News Digest for ${generatedAt.slice(0, 10)}`,
    '',
    `Generated at: ${generatedAt}`,
    `Query: ${query}`,
    `Feed: ${feedUrl}`,
    '',
    '## Top 5 AI stories',
    '',
  ];

  const body = articles.flatMap((article, index) => [
    `${index + 1}. [${article.title}](${article.link})`,
    `   Source: ${article.source}`,
    `   Published: ${article.pubDate || 'Unknown'}`,
    `   Score: ${article.score}`,
    `   Why it stood out: ${article.whyItMatters}`,
    '',
  ]);

  return [...header, ...body].join('\n').trimEnd() + '\n';
}

function normalizeRepoUrl(value) {
  return value.replace(/\.git$/u, '').replace(/\/$/u, '');
}

function buildRepoFileUrl(repoUrl, repoBranch, filePath) {
  const normalizedRepoUrl = normalizeRepoUrl(repoUrl);
  const encodedSegments = filePath.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return `${normalizedRepoUrl}/blob/${encodeURIComponent(repoBranch)}/${encodedSegments}`;
}

export function buildTelegramReplyMarkup({
  generatedAt,
  articles,
  repoUrl = '',
  repoBranch = 'main',
}) {
  if (!repoUrl) {
    return null;
  }

  const dateSlug = generatedAt.slice(0, 10);
  const lead = articles[0];
  const backup = articles[1];

  const keyboard = [
    [
      {
        text: 'Ready Pack',
        url: buildRepoFileUrl(repoUrl, repoBranch, `content/ai-news/${dateSlug}-ready-to-post.md`),
      },
      {
        text: 'Open Brief',
        url: buildRepoFileUrl(repoUrl, repoBranch, `content/ai-news/${dateSlug}-daily-posting-brief.md`),
      },
    ],
    [
      {
        text: 'Open QA',
        url: buildRepoFileUrl(repoUrl, repoBranch, `content/ai-news/${dateSlug}-quality-report.md`),
      },
      {
        text: 'Open Reel',
        url: buildRepoFileUrl(repoUrl, repoBranch, `content/ai-news/${dateSlug}-instagram-reel.md`),
      },
    ],
  ];

  if (lead || backup) {
    keyboard.unshift(
      [
        ...(lead
          ? [
              {
                text: 'Lead Story',
                url: lead.link,
              },
            ]
          : []),
        ...(backup
          ? [
              {
                text: 'Backup Story',
                url: backup.link,
              },
            ]
          : []),
      ],
    );
  }

  return {
    inline_keyboard: keyboard,
  };
}

export function buildTelegramNotification({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
  repoUrl = '',
  repoBranch = 'main',
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const lead = articles[0];
  const backup = articles[1];
  const topLinks = articles.slice(0, 2);
  const dateLabel = generatedAt.slice(0, 10);
  const packLinks = repoUrl
    ? [
        {
          label: 'Ready Pack',
          url: buildRepoFileUrl(repoUrl, repoBranch, `content/ai-news/${dateLabel}-ready-to-post.md`),
        },
        {
          label: 'Brief',
          url: buildRepoFileUrl(repoUrl, repoBranch, `content/ai-news/${dateLabel}-daily-posting-brief.md`),
        },
        {
          label: 'QA',
          url: buildRepoFileUrl(repoUrl, repoBranch, `content/ai-news/${dateLabel}-quality-report.md`),
        },
        {
          label: 'Reel',
          url: buildRepoFileUrl(repoUrl, repoBranch, `content/ai-news/${dateLabel}-instagram-reel.md`),
        },
      ]
    : [];

  if (!lead) {
    return `<b>AI Morning Pack Ready</b>\n${dateLabel}\n\nNo lead story was available this morning.`;
  }

  const lines = [
    `<b>AI Morning Pack Ready</b>`,
    `${dateLabel} • ${escapeHtml(voiceProfile.label)} voice`,
    '',
    `<b>Lead</b>: <a href="${escapeHtml(lead.link)}">${escapeHtml(lead.title)}</a>`,
    `${escapeHtml(lead.source)}`,
    backup
      ? `<b>Backup</b>: <a href="${escapeHtml(backup.link)}">${escapeHtml(backup.title)}</a>`
      : '<b>Backup</b>: none',
    '',
    '<b>Post now</b>',
    '1. Newsletter',
    '2. Reel / short video',
    '3. LinkedIn or Instagram carousel',
    '',
    ...(packLinks.length
      ? [
          '<b>Open pack</b>',
          packLinks
            .map((entry) => `<a href="${escapeHtml(entry.url)}">${escapeHtml(entry.label)}</a>`)
            .join(' • '),
          '',
        ]
      : []),
    '<b>Quick check</b>',
    '• Verify the lead source',
    '• Use alternate hooks or CTA options if the opener feels weak',
    '• Add one original takeaway before posting',
    '',
    '<b>Top links</b>',
    ...topLinks.map(
      (article, index) =>
        `${index + 1}. <a href="${escapeHtml(article.link)}">${escapeHtml(truncate(article.title, 90))}</a>`,
    ),
  ];

  return lines.join('\n');
}

export async function sendTelegramNotification({
  botToken,
  chatId,
  message,
  replyMarkup = null,
  silent = false,
  fetchImpl = fetch,
}) {
  const response = await fetchImpl(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_notification: silent,
      link_preview_options: {
        is_disabled: true,
      },
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send Telegram notification: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();

  if (!payload.ok) {
    throw new Error(`Failed to send Telegram notification: ${payload.description ?? 'Unknown Telegram API error'}`);
  }

  return payload.result;
}

function buildStoryAngle(article) {
  const lower = `${article.title} ${article.description}`.toLowerCase();

  if (/\bfunding|raises|startup|acquire|investment\b/u.test(lower)) {
    return 'business move';
  }

  if (/\bpolicy|law|regulat|safety|court|copyright\b/u.test(lower)) {
    return 'policy signal';
  }

  if (/\bresearch|breakthrough|paper|benchmark|reasoning\b/u.test(lower)) {
    return 'research milestone';
  }

  if (/\blaunch|release|model|feature\b/u.test(lower)) {
    return 'product update';
  }

  return 'industry shift';
}

function buildAudienceHook(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  const angle = buildStoryAngle(article);

  if (angle === 'product update') {
    return voiceProfile.key === 'educator'
      ? `If you want one clear product story to understand this morning, start with this ${article.source} update.`
      : `If you build with AI tools, this ${article.source} story is the one to watch this morning.`;
  }

  if (angle === 'business move') {
    return voiceProfile.key === 'founder'
      ? 'If you follow where market power is moving in AI, this is the business story to watch first.'
      : `If you follow the AI market, this move could change who wins attention and money next.`;
  }

  if (angle === 'policy signal') {
    return voiceProfile.key === 'newsroom'
      ? 'If you ship AI products, this policy development deserves closer attention than the headline alone suggests.'
      : `If you create or ship AI products, this policy update matters more than the headline suggests.`;
  }

  if (angle === 'research milestone') {
    return voiceProfile.key === 'educator'
      ? 'If you want to understand where AI capability may be heading next, begin with this research story.'
      : `If you care where AI is heading next, this research story is the one worth opening with.`;
  }

  return voiceProfile.key === 'founder'
    ? 'If you want the signal before the market gets noisy, start with this story.'
    : `If you want the signal instead of the noise in AI, start with this story.`;
}

function buildNewsletterIntro(articles, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  const topSources = [...new Set(articles.slice(0, 3).map((article) => article.source))].join(', ');
  return `${voiceProfile.intro} This edition is curated across ${topSources}.`;
}

function buildCompactSubjectLine(leadTitle, dateLabel) {
  const compactTitle = leadTitle.replace(/\bartificial intelligence\b/giu, 'AI');

  return truncate(`AI Brief ${dateLabel}: ${compactTitle}`, 50);
}

function buildSubjectLines(articles, generatedAt) {
  const lead = articles[0];
  const second = articles[1];
  const dateLabel = generatedAt.slice(5, 10);

  return [
    buildCompactSubjectLine(lead?.title ?? 'Top stories', dateLabel),
    second ? truncate(`5 AI stories today: ${lead?.source} to ${second.source}`, 50) : 'Top AI story this morning',
  ];
}

function buildShortFormScript(article, index) {
  const angle = buildStoryAngle(article);
  const intro =
    index === 0
      ? 'Here is the biggest AI story this morning.'
      : 'Here is another AI story you should not skip today.';

  return [
    intro,
    `${article.title}.`,
    `Source: ${article.source}.`,
    `${article.whyItMatters}`,
    `Use this as a ${angle} clip in a 15 to 45 second vertical video.`,
  ].join(' ');
}

export function buildContentPlan({
  generatedAt,
  articles,
  preferredSources,
  voice = DEFAULT_VOICE,
}) {
  const lead = articles[0];
  const preferredList = [...preferredSources];
  const voiceProfile = resolveVoiceProfile(voice);
  const subjectLines = buildSubjectLines(articles, generatedAt);
  const topStoryBullets = articles.map((article, index) => {
    const angle = buildStoryAngle(article);
    const hook = buildAudienceHook(article, voiceProfile);

    return [
      `### Story ${index + 1}: ${article.title}`,
      `- Source: ${article.source}`,
      `- Published: ${article.pubDate || 'Unknown'}`,
      `- Angle: ${angle}`,
      `- Why it matters: ${article.whyItMatters}`,
      `- Original take to add: ${buildOriginalityPrompt(article, voiceProfile)}`,
      `- Hook: ${hook}`,
      `- Suggested short-form script: ${buildShortFormScript(article, index)}`,
      '',
    ].join('\n');
  });

  const shortHooks = articles.slice(0, 3).map((article, index) => {
    const intro =
      index === 0
        ? `The AI headline everyone will talk about today: ${article.title}`
        : `AI creators should watch this one: ${article.title}`;

    return `- ${intro}`;
  });

  const sourceStrategy =
    preferredList.length > 0
      ? `Prioritize trusted outlets first: ${preferredList.join(', ')}.`
      : 'Prioritize trusted, recognizable outlets first and keep source diversity high.';

  return [
    `# AI Content Plan for ${generatedAt.slice(0, 10)}`,
    '',
    '## Research-based workflow',
    '',
    '- Publish in the morning while the stories are still fresh and attention is highest.',
    '- Keep the brief curated to five high-signal stories instead of a long link dump.',
    `- ${sourceStrategy}`,
    '- Turn the same daily research into multiple formats: a newsletter lead, text hooks, and short-form vertical video ideas.',
    '- Keep attribution visible and manually verify any claim before publishing your final content.',
    '',
    '## Anti-flop guardrails',
    '',
    '- Do not publish if the draft only rewrites the headline without adding an original takeaway.',
    '- Keep each post focused on one audience and one clear payoff.',
    '- For short-form video, the hook should land in the first 3 to 6 seconds.',
    '- For LinkedIn, favor native image, video, or document posts over plain link-only posts when possible.',
    '- For newsletters, keep subject lines short enough to scan on mobile and judge success by clicks and replies, not opens alone.',
    '- Verify surprising or high-stakes claims against another trusted source before publishing.',
    '',
    '## Lead story',
    '',
    `- Voice: ${voiceProfile.label}`,
    `- Title: ${lead?.title ?? 'No lead story available'}`,
    `- Source: ${lead?.source ?? 'Unknown source'}`,
    `- Positioning: ${lead ? buildAudienceHook(lead, voiceProfile) : 'No positioning available.'}`,
    '',
    '## Newsletter package',
    '',
    `- Subject line 1: ${subjectLines[0]}`,
    `- Subject line 2: ${subjectLines[1]}`,
    `- Intro: ${buildNewsletterIntro(articles, voiceProfile)}`,
    '',
    '## Short-form package',
    '',
    '- Recommended format: 9:16 vertical clips, about 15 to 45 seconds each.',
    '- Hook ideas:',
    ...shortHooks,
    '',
    '## Story breakdowns',
    '',
    ...topStoryBullets,
    '## Verification checklist',
    '',
    '- Confirm the final headline and publication time on the original source before posting.',
    '- Keep the source name and link in your notes so attribution stays intact.',
    '- Add your analysis or explanation instead of reposting the headline alone.',
    '- If a claim is sensitive, controversial, or surprising, verify it against an additional trusted source.',
    '- Avoid exaggerated framing if the underlying source does not support it.',
    '',
  ].join('\n');
}

function buildStorySummary(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  const angle = buildStoryAngle(article);

  if (angle === 'product update') {
    if (voiceProfile.key === 'educator') {
      return `${article.title} is a product shift worth understanding because it changes what AI users and builders may be able to do next.`;
    }

    return `${article.title} points to a product shift worth watching, especially for teams building with AI right now.`;
  }

  if (angle === 'business move') {
    return voiceProfile.key === 'founder'
      ? `${article.title} signals a business move that could reshape leverage, capital flow, or distribution in the AI market.`
      : `${article.title} signals a business move that could affect momentum, distribution, or funding in the AI market.`;
  }

  if (angle === 'policy signal') {
    return voiceProfile.key === 'newsroom'
      ? `${article.title} is a policy development with direct implications for how AI products may be governed or distributed.`
      : `${article.title} is a policy development that could shape how AI products are built, distributed, or governed.`;
  }

  if (angle === 'research milestone') {
    return voiceProfile.key === 'educator'
      ? `${article.title} stands out as a research milestone that may help explain where the next wave of AI capability is coming from.`
      : `${article.title} stands out as a research milestone that may influence the next wave of AI product capabilities.`;
  }

  return voiceProfile.key === 'founder'
    ? `${article.title} looks like a broader industry shift that may matter sooner than the market expects.`
    : `${article.title} looks like a broader industry shift that is worth keeping on the radar this morning.`;
}

function buildNewsletterBodyParagraph(article, index, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  const opener =
    index === 0
      ? 'The lead story this morning'
      : `Story ${index + 1} in the mix`;

  return `${opener} is ${article.title}. ${buildStorySummary(article, voiceProfile)} ${article.whyItMatters} Source: ${article.source}.`;
}

export function buildNewsletterDraft({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const subjectLines = buildSubjectLines(articles, generatedAt);
  const previewText =
    articles.length >= 2
      ? `${articles[0].title} leads today's AI brief, plus ${articles[1].title}.`
      : `${articles[0]?.title ?? 'Top AI stories'} leads today's AI brief.`;
  const bodySections = articles.map((article, index) => [
    `## ${index + 1}. ${article.title}`,
    '',
    buildNewsletterBodyParagraph(article, index, voiceProfile),
    '',
    `- Source: ${article.source}`,
    `- Published: ${article.pubDate || 'Unknown'}`,
    `- Link: ${article.link}`,
    '',
  ].join('\n'));

  return [
    `# AI Morning Newsletter Draft for ${generatedAt.slice(0, 10)}`,
    '',
    `Subject line 1: ${subjectLines[0]}`,
    `Subject line 2: ${subjectLines[1]}`,
    `Preview text: ${previewText}`,
    `Voice: ${voiceProfile.label}`,
    '',
    '## Anti-flop notes',
    '',
    '- Keep the final subject line short enough to scan on mobile.',
    '- A/B test the two subject line variants if your email platform supports it.',
    '- Judge this newsletter by clicks and replies, not open rate alone.',
    '',
    '## Opening',
    '',
    buildNewsletterIntro(articles, voiceProfile),
    '',
    ...bodySections,
    '## Closing',
    '',
    voiceProfile.closing,
    '',
  ].join('\n');
}

function buildVideoHook(article, index) {
  if (index === 0) {
    return `The biggest AI story this morning is ${article.title}.`;
  }

  return `Another AI story creators should not miss today is ${article.title}.`;
}

function buildVideoCta(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  const angle = buildStoryAngle(article);

  if (angle === 'product update') {
    return voiceProfile.key === 'educator'
      ? 'Watch this one if you want a clearer read on how AI tools are changing.'
      : 'Watch this one if you build with AI tools every week.';
  }

  if (angle === 'business move') {
    return voiceProfile.key === 'founder'
      ? 'Watch this one if you care who is gaining strategic leverage in AI.'
      : 'Watch this one if you track who is gaining leverage in AI.';
  }

  if (angle === 'policy signal') {
    return 'Watch this one if you care about how AI rules could change the market.';
  }

  if (angle === 'research milestone') {
    return 'Watch this one if you care where AI capability is heading next.';
  }

  return 'Watch this one if you want the signal, not just the noise.';
}

function buildOriginalityPrompt(
  article,
  voiceProfile = VOICE_PROFILES[DEFAULT_VOICE],
) {
  const angle = buildStoryAngle(article);

  if (voiceProfile.key === 'founder') {
    return voiceProfile.originalityPrefix;
  }

  if (voiceProfile.key === 'educator') {
    return voiceProfile.originalityPrefix;
  }

  if (voiceProfile.key === 'newsroom') {
    return voiceProfile.originalityPrefix;
  }

  if (angle === 'product update') {
    return 'Add one original takeaway about who benefits if this product shift sticks.';
  }

  if (angle === 'business move') {
    return 'Add one original takeaway about market power, funding, or distribution impact.';
  }

  if (angle === 'policy signal') {
    return 'Add one original takeaway about compliance, product shipping, or platform risk.';
  }

  if (angle === 'research milestone') {
    return 'Add one original takeaway about what capability this could unlock next.';
  }

  return 'Add one original takeaway that goes beyond the headline.';
}

function buildSuggestedAngle(
  article,
  voiceProfile = VOICE_PROFILES[DEFAULT_VOICE],
) {
  const angle = buildStoryAngle(article);

  if (angle === 'research milestone') {
    return voiceProfile.key === 'founder'
      ? 'Suggested angle: if reasoning improvements keep compounding, the edge moves from raw model access to who can turn capability into distribution and workflow advantage fastest.'
      : 'Suggested angle: this matters because research advances tend to become product changes faster than most teams expect.';
  }

  if (angle === 'product update') {
    return voiceProfile.key === 'founder'
      ? 'Suggested angle: the winner will not be the team that notices the feature first, but the one that ships the best workflow on top of it.'
      : 'Suggested angle: product changes matter most when they make real workflows faster, cheaper, or easier.';
  }

  if (angle === 'business move') {
    return voiceProfile.key === 'founder'
      ? 'Suggested angle: funding and partnership moves matter because they reshape who gets distribution, talent, and staying power next.'
      : 'Suggested angle: business news matters when it changes who can build faster or reach users sooner.';
  }

  if (angle === 'policy signal') {
    return voiceProfile.key === 'founder'
      ? 'Suggested angle: policy shifts matter when they start changing launch speed, compliance cost, and platform risk.'
      : 'Suggested angle: policy stories matter because rules can become product constraints very quickly.';
  }

  return voiceProfile.key === 'founder'
    ? 'Suggested angle: the real story is not the headline itself, but how it changes who gains leverage next.'
    : 'Suggested angle: explain how this changes the market, product decisions, or day-to-day work.';
}

function buildHookPayoff(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  const angle = buildStoryAngle(article);

  if (angle === 'product update') {
    return voiceProfile.key === 'founder'
      ? 'workflow advantage'
      : 'builder workflows';
  }

  if (angle === 'business move') {
    return voiceProfile.key === 'founder'
      ? 'AI market leverage'
      : 'distribution and momentum';
  }

  if (angle === 'policy signal') {
    return 'AI product risk';
  }

  if (angle === 'research milestone') {
    return 'next-wave AI capability';
  }

  return voiceProfile.key === 'founder'
    ? 'the AI market'
    : 'AI workflows';
}

function buildDirectChannelCta(
  article,
  voiceProfile = VOICE_PROFILES[DEFAULT_VOICE],
  channel = 'generic',
) {
  const angle = buildStoryAngle(article);
  const payoff = buildHookPayoff(article, voiceProfile);

  if (channel === 'instagram-reel') {
    if (angle === 'policy signal') {
      return 'Save this, share it with someone shipping AI products, and comment if more labs will have to draw a line publicly.';
    }

    if (angle === 'business move') {
      return 'Save this and comment on who you think gains leverage next.';
    }

    if (angle === 'research milestone') {
      return 'Save this if you track where AI capability is moving, and comment on what it unlocks next.';
    }

    return `Save this if you care about ${payoff}, and comment on the part people are missing.`;
  }

  if (channel === 'talking-head') {
    if (angle === 'policy signal') {
      return 'Comment if you think more AI companies will have to define their red lines in public.';
    }

    if (angle === 'business move') {
      return 'Tell me who you think gains leverage next, and why.';
    }

    if (angle === 'research milestone') {
      return 'Comment on the product shift you think this unlocks next.';
    }

    return `Comment if you think this changes ${payoff}, and tell me why.`;
  }

  return 'Comment with the implication you think most people are missing.';
}

function buildAlternateHooks(
  article,
  voiceProfile = VOICE_PROFILES[DEFAULT_VOICE],
  channel = 'generic',
) {
  const payoff = buildHookPayoff(article, voiceProfile);
  const compactTitle = truncate(article.title, 72);

  if (channel === 'instagram-carousel') {
    return [
      'The AI story people will miss today',
      `What this headline actually changes for ${payoff}`,
      'The real signal behind today\'s AI headline',
    ];
  }

  if (channel === 'linkedin-carousel') {
    return [
      'The AI story operators should not ignore today',
      `What this AI move changes for ${payoff}`,
      'The real takeaway behind today\'s AI headline',
    ];
  }

  if (channel === 'instagram-reel') {
    return [
      `${compactTitle} is the headline. Here is the real signal.`,
      `Before the feed moves on, here is what this changes for ${payoff}.`,
      'Most people will repost the headline. This is the part worth paying attention to.',
    ];
  }

  if (channel === 'talking-head') {
    return [
      `The headline is ${compactTitle}. The real story is what it changes next.`,
      `Everyone will quote the headline. I care more about ${payoff}.`,
      'If you build, buy, or ship AI, this is the part of today\'s news worth watching.',
    ];
  }

  return [
    `The real signal in ${compactTitle} is what it changes next.`,
    `This matters because it affects ${payoff}.`,
    'The headline is only the surface-level version of the story.',
  ];
}

function buildChannelCtaOptions(
  article,
  voiceProfile = VOICE_PROFILES[DEFAULT_VOICE],
  channel = 'generic',
) {
  const payoff = buildHookPayoff(article, voiceProfile);

  if (channel === 'instagram-reel') {
    return [
      buildDirectChannelCta(article, voiceProfile, channel),
      `Share this with someone tracking ${payoff}, then tell me what part of the story people are underestimating.`,
      'Follow for the next AI story that changes workflow, not just headlines.',
    ];
  }

  if (channel === 'talking-head') {
    return [
      buildDirectChannelCta(article, voiceProfile, channel),
      `Tell me whether this changes how you think about ${payoff}.`,
      'Follow if you want the daily AI signal without the headline fluff.',
    ];
  }

  return [
    'Ask a direct question so the audience has one clear way to respond.',
    'Invite a save, share, or reply based on the platform.',
    'Close on one action, not a vague sign-off.',
  ];
}

function tokenizeForComparison(value) {
  return value
    .toLowerCase()
    .replace(/https?:\/\/\S+/gu, ' ')
    .replace(/[^a-z0-9\s]+/gu, ' ')
    .split(/\s+/u)
    .filter((token) => token && token.length > 2 && !COMPARISON_STOPWORDS.has(token));
}

function tokenOverlapRatio(left, right) {
  const leftTokens = new Set(tokenizeForComparison(left));
  const rightTokens = new Set(tokenizeForComparison(right));

  if (!leftTokens.size || !rightTokens.size) {
    return 0;
  }

  const shared = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return shared / Math.max(leftTokens.size, rightTokens.size);
}

function normalizeDraftLine(value) {
  return value
    .toLowerCase()
    .replace(/\s+/gu, ' ')
    .replace(/[^a-z0-9\s]+/gu, '')
    .trim();
}

function clampScore(value, max) {
  return Math.max(0, Math.min(max, value));
}

function extractLineValue(markdown, label) {
  const match = markdown.match(new RegExp(`${label}:\\s*(.+)`, 'u'));
  return match ? match[1].trim() : '';
}

function extractSection(markdown, startHeading, endHeading) {
  const escapedStart = startHeading.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const escapedEnd = endHeading.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const match = markdown.match(new RegExp(`${escapedStart}\\n\\n([\\s\\S]*?)\\n\\n${escapedEnd}`, 'u'));
  return match ? match[1].trim() : '';
}

function extractLineAfter(markdown, anchor) {
  const escapedAnchor = anchor.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const match = markdown.match(new RegExp(`${escapedAnchor}\\n([^\\n]+)`, 'u'));
  return match ? match[1].trim() : '';
}

export function buildContentQualityReport({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const lead = articles[0];
  const dateSlug = generatedAt.slice(0, 10);

  if (!lead) {
    return [
      `# AI Content Quality Report for ${dateSlug}`,
      '',
      `Voice: ${voiceProfile.label}`,
      '',
      'No lead story was available, so the publishing QA pass could not run.',
      '',
    ].join('\n');
  }

  const subjectLines = buildSubjectLines(articles, generatedAt);
  const originalityPrompt = buildOriginalityPrompt(lead, voiceProfile);
  const suggestedAngle = buildSuggestedAngle(lead, voiceProfile);
  const reelHook = buildVideoHook(lead, 0);
  const xHook = buildAudienceHook(lead, voiceProfile);
  const instagramCarousel = buildInstagramCarousel({ generatedAt, articles, voice });
  const instagramReel = buildInstagramReel({ generatedAt, articles, voice });
  const linkedinCarousel = buildLinkedInCarouselOutline({ generatedAt, articles, voice });
  const talkingHead = buildTalkingHeadScript30s({ generatedAt, articles, voice });
  const xThread = buildXThread({ generatedAt, articles, voice });
  const hooks = [
    { label: 'Newsletter subject', text: subjectLines[0] },
    { label: 'Instagram carousel cover', text: lead.title },
    { label: 'Instagram Reel hook', text: reelHook },
    { label: 'LinkedIn carousel cover', text: lead.title },
    { label: 'Talking-head hook', text: reelHook },
    { label: 'X opener', text: xHook },
  ];

  const strengths = [];
  const watchouts = [];

  let hookStrength = 25;
  if (subjectLines[0].length <= 50) {
    strengths.push(`The lead subject line stays compact at ${subjectLines[0].length} characters, which is mobile-friendly.`);
  } else {
    hookStrength -= 4;
    watchouts.push(`The lead subject line is ${subjectLines[0].length} characters. Tighten it before sending to improve mobile scanability.`);
  }

  if (reelHook.split(/\s+/u).length <= 12) {
    strengths.push('The Reel and talking-head hook state the lead story immediately instead of burying the news.');
  } else {
    hookStrength -= 3;
    watchouts.push('The video hook is slightly long. Trim the first line so the promise lands faster.');
  }

  if (/\bwatch|build|care|signal|advantage|ship\b/iu.test(xHook)) {
    strengths.push('The X opener is audience-aware instead of reading like a generic headline repost.');
  } else {
    hookStrength -= 3;
    watchouts.push('The X opener needs a clearer audience payoff before posting.');
  }

  let originalityScore = 25;
  const titleSimilarity = tokenOverlapRatio(lead.title, suggestedAngle);
  if (titleSimilarity < 0.35) {
    strengths.push('The suggested angle adds a real thesis beyond the headline.');
  } else {
    originalityScore -= 7;
    watchouts.push('The suggested angle reads too close to the headline. Add a sharper point of view before publishing.');
  }

  if (originalityPrompt.split(/\s+/u).length >= 8) {
    strengths.push('The originality prompt is specific enough to force an actual takeaway, not just a rewrite.');
  } else {
    originalityScore -= 4;
    watchouts.push('The originality prompt is too generic. Add a clearer audience-specific takeaway.');
  }

  if (/\bleverage|workflow|market|product|compliance|capability|advantage|governed\b/iu.test(suggestedAngle)) {
    strengths.push('The lead angle points to downstream consequences, which usually performs better than repeating the announcement.');
  } else {
    originalityScore -= 4;
    watchouts.push('The lead angle needs a stronger consequence or implication, not just summary language.');
  }

  const channelChecks = [
    {
      label: 'Instagram carousel',
      pass:
        instagramCarousel.includes('1. Hook slide:') &&
        instagramCarousel.includes('4. Original angle:') &&
        instagramCarousel.includes('6. CTA:'),
      passNote: 'first slide, original angle, and save/comment CTA are already present.',
      failNote: 'is missing either the opening package, the original angle, or the CTA.',
    },
    {
      label: 'Instagram Reel',
      pass:
        instagramReel.includes('Hook:') &&
        instagramReel.includes('Body:') &&
        instagramReel.includes('Close:'),
      passNote: 'hook, body, and close are present.',
      failNote: 'needs a clearer hook/body/close structure.',
    },
    {
      label: 'LinkedIn carousel',
      pass:
        linkedinCarousel.includes('1. Cover:') &&
        linkedinCarousel.includes('4. Original take:') &&
        linkedinCarousel.includes('6. CTA:'),
      passNote: 'cover, original take, and comment CTA are present.',
      failNote: 'is missing either the cover structure, original take, or CTA.',
    },
    {
      label: 'Talking-head 30s',
      pass:
        talkingHead.includes('0-5s: Hook') &&
        talkingHead.includes('15-24s: Why it matters') &&
        talkingHead.includes('24-30s: Original angle + close'),
      passNote: 'timing beats are present and easy to record from.',
      failNote: 'needs a cleaner beat structure before recording.',
    },
    {
      label: 'X thread',
      pass: xThread.includes('1. ') && xThread.includes('5. Source:'),
      passNote: 'has a five-part structure and source attribution.',
      failNote: 'needs a clearer multi-post structure or source line.',
    },
  ];

  const channelFit = clampScore(channelChecks.filter((check) => check.pass).length * 5, 25);
  channelChecks
    .filter((check) => check.pass)
    .forEach((check) => strengths.push(`${check.label} passes structure QA because ${check.passNote}`));
  channelChecks
    .filter((check) => !check.pass)
    .forEach((check) => watchouts.push(`${check.label} ${check.failNote}`));

  let ctaStrength = 15;
  const reelClose = extractLineValue(instagramReel, 'Close');
  const reelCaption = extractSection(instagramReel, '## Caption', '## Reel notes');
  const talkingHeadClose = extractLineAfter(talkingHead, '24-30s: Original angle + close');
  const ctaPattern = /\b(comment|save|share|follow|reply|watch|tell me|what do you think)\b/iu;
  const reelHasDirectCta = ctaPattern.test(reelClose) || ctaPattern.test(reelCaption);
  const talkingHeadHasDirectCta = ctaPattern.test(talkingHeadClose);

  if (instagramCarousel.includes('6. CTA:') && linkedinCarousel.includes('6. CTA:')) {
    strengths.push('Instagram and LinkedIn both include explicit CTAs instead of ending as open loops.');
  } else {
    ctaStrength -= 5;
    watchouts.push('At least one carousel draft is missing a direct CTA.');
  }

  if (!reelHasDirectCta) {
    ctaStrength -= 4;
    watchouts.push('The Instagram Reel draft closes with an angle, but it still needs a direct save/share/comment CTA before posting.');
  }

  if (!talkingHeadHasDirectCta) {
    ctaStrength -= 3;
    watchouts.push('The talking-head script needs a direct final action so the close is not only informational.');
  }

  if (xThread.includes('?')) {
    strengths.push('The X draft already contains a built-in conversation prompt.');
  } else {
    ctaStrength -= 2;
    watchouts.push('Consider adding a question to the X thread so it invites replies instead of only broadcasting.');
  }

  const repeatedLineGroups = new Map();
  hooks.forEach((hook) => {
    const normalized = normalizeDraftLine(hook.text);
    const entries = repeatedLineGroups.get(normalized) ?? [];
    entries.push(hook.label);
    repeatedLineGroups.set(normalized, entries);
  });

  const duplicates = [...repeatedLineGroups.values()].filter((entries) => entries.length > 1);
  let redundancyControl = 10;

  if (duplicates.length > 0) {
    redundancyControl -= 3;
    watchouts.push(
      `These assets reuse the same opening line: ${duplicates
        .map((entries) => entries.join(', '))
        .join('; ')}. Rewrite at least one opener so the morning stack does not feel copy-pasted.`,
    );
  } else {
    strengths.push('The hooks are varied enough that the morning stack does not feel copy-pasted.');
  }

  redundancyControl -= 3;
  watchouts.push(
    'The same suggested angle appears across Instagram, LinkedIn, talking-head, and X drafts. Keep the thesis, but rewrite the phrasing per channel before publishing.',
  );

  const needsHookAlternatives = hookStrength < 25 || duplicates.length > 0;
  const needsReelCtaAlternatives = !reelHasDirectCta;
  const needsTalkingHeadCtaAlternatives = !talkingHeadHasDirectCta;
  const rescueLines = [];

  if (needsHookAlternatives) {
    buildAlternateHooks(lead, voiceProfile, 'instagram-carousel').forEach((option, index) => {
      rescueLines.push(`- Instagram carousel cover option ${index + 1}: ${option}`);
    });
    buildAlternateHooks(lead, voiceProfile, 'linkedin-carousel').forEach((option, index) => {
      rescueLines.push(`- LinkedIn carousel cover option ${index + 1}: ${option}`);
    });
    buildAlternateHooks(lead, voiceProfile, 'instagram-reel').forEach((option, index) => {
      rescueLines.push(`- Instagram Reel hook option ${index + 1}: ${option}`);
    });
    buildAlternateHooks(lead, voiceProfile, 'talking-head').forEach((option, index) => {
      rescueLines.push(`- Talking-head hook option ${index + 1}: ${option}`);
    });
  }

  if (needsReelCtaAlternatives || needsTalkingHeadCtaAlternatives) {
    buildChannelCtaOptions(lead, voiceProfile, 'instagram-reel').forEach((option, index) => {
      rescueLines.push(`- Instagram Reel CTA option ${index + 1}: ${option}`);
    });
    buildChannelCtaOptions(lead, voiceProfile, 'talking-head').forEach((option, index) => {
      rescueLines.push(`- Talking-head CTA option ${index + 1}: ${option}`);
    });
  }

  const totalScore = clampScore(
    hookStrength + originalityScore + channelFit + ctaStrength + redundancyControl,
    100,
  );

  return [
    `# AI Content Quality Report for ${dateSlug}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    '## Scorecard',
    '',
    `- Overall score: ${totalScore}/100`,
    `- Hook strength: ${clampScore(hookStrength, 25)}/25`,
    `- Originality: ${clampScore(originalityScore, 25)}/25`,
    `- Channel fit: ${channelFit}/25`,
    `- CTA strength: ${clampScore(ctaStrength, 15)}/15`,
    `- Redundancy control: ${clampScore(redundancyControl, 10)}/10`,
    '',
    '## Strong signals',
    '',
    ...strengths.map((item) => `- ${item}`),
    '',
    '## Watchouts before posting',
    '',
    ...watchouts.map((item) => `- ${item}`),
    '',
    '## Channel checks',
    '',
    ...channelChecks.map((check) =>
      `- ${check.label}: ${check.pass ? 'Pass' : 'Needs work'} - ${check.pass ? check.passNote : check.failNote}`,
    ),
    '',
    ...(rescueLines.length
      ? [
          '## Auto-fix options',
          '',
          ...rescueLines,
          '',
        ]
      : []),
    '## Open next',
    '',
    `- Daily posting brief: content/ai-news/${dateSlug}-daily-posting-brief.md`,
    `- Publishing checklist: content/ai-news/${dateSlug}-publishing-checklist.md`,
    `- Instagram Reel pack: content/ai-news/${dateSlug}-instagram-reel.md`,
    `- Talking-head script: content/ai-news/${dateSlug}-talking-head-30s.md`,
    '',
  ].join('\n');
}

export function buildVideoScriptPack({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const selectedArticles = articles.slice(0, 3);
  const scripts = selectedArticles.map((article, index) => [
    `## Video Script ${index + 1}`,
    '',
    `- Story: ${article.title}`,
    `- Source: ${article.source}`,
    `- Format: 9:16 vertical, 15 to 45 seconds`,
    '',
    '### Script',
    '',
    `${buildVideoHook(article, index)} ${buildStorySummary(article, voiceProfile)} ${article.whyItMatters} Source: ${article.source}. ${buildVideoCta(article, voiceProfile)}`,
    '',
    '### Production notes',
    '',
    '- Land the hook in the first 3 to 6 seconds.',
    '- Keep this to one story and one payoff.',
    '- Add subtitles because many viewers watch with sound off.',
    '- Keep the frame vertical and the key text inside safe margins.',
    '',
  ].join('\n'));

  return [
    `# AI Short-Form Script Pack for ${generatedAt.slice(0, 10)}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    'Use these as first-draft scripts for morning video posts.',
    '',
    ...scripts,
  ].join('\n');
}

function buildSocialPost(
  article,
  index,
  voiceProfile = VOICE_PROFILES[DEFAULT_VOICE],
) {
  const hook =
    index === 0
      ? `The AI story I would watch first this morning: ${article.title}`
      : `AI story ${index + 1} worth your time today: ${article.title}`;

  return [
    hook,
    '',
    `${buildStorySummary(article, voiceProfile)} ${article.whyItMatters} ${buildOriginalityPrompt(article, voiceProfile)}`,
    '',
    `Source: ${article.source}`,
    `Link: ${article.link}`,
    voiceProfile.socialFormatNote,
  ].join('\n');
}

function stripSuggestedPrefix(value) {
  const cleaned = value.replace(/^Suggested angle:\s*/u, '').trim();
  return cleaned ? `${cleaned.slice(0, 1).toUpperCase()}${cleaned.slice(1)}` : cleaned;
}

function buildPlatformHashtags(article) {
  const angle = buildStoryAngle(article);

  if (angle === 'product update') {
    return '#AI #OpenAI #ProductStrategy #AITools #TechNews';
  }

  if (angle === 'business move') {
    return '#AI #Startups #BusinessStrategy #TechNews #MarketSignals';
  }

  if (angle === 'policy signal') {
    return '#AI #AIPolicy #TechRegulation #AIGovernance #TechNews';
  }

  if (angle === 'research milestone') {
    return '#AI #Research #MachineLearning #AICapabilities #TechNews';
  }

  return '#AI #TechNews #FutureOfWork #AIAgents #BusinessStrategy';
}

function buildNewsletterCta(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  const angle = buildStoryAngle(article);

  if (angle === 'policy signal') {
    return 'Reply with the policy or governance shift you think AI teams are still underestimating.';
  }

  if (voiceProfile.key === 'founder') {
    return 'Reply with the move you think changes leverage next.';
  }

  return 'Reply with the implication you think most operators should be paying attention to next.';
}

function buildCommentQuestion(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  const angle = buildStoryAngle(article);

  if (angle === 'product update') {
    return 'What changes first if this product shift sticks: distribution, workflow, or pricing?';
  }

  if (angle === 'business move') {
    return voiceProfile.key === 'founder'
      ? 'Who gains the most leverage if this move works?'
      : 'Who gains the most momentum if this move works?';
  }

  if (angle === 'policy signal') {
    return 'Do you think more AI companies will have to define their red lines in public?';
  }

  if (angle === 'research milestone') {
    return 'What product change do you think this unlocks next?';
  }

  return 'What is the real implication here that most people will miss on first read?';
}

function buildInstagramCarouselSlides(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  const angle = stripSuggestedPrefix(buildSuggestedAngle(article, voiceProfile));

  return [
    article.title,
    buildStorySummary(article, voiceProfile),
    article.whyItMatters,
    angle,
    'Watch what changes in workflows, distribution, or risk over the next few weeks.',
    buildCommentQuestion(article, voiceProfile),
  ];
}

function buildLinkedInBody(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  return [
    buildAudienceHook(article, voiceProfile),
    '',
    buildStorySummary(article, voiceProfile),
    '',
    `Why it matters now: ${article.whyItMatters}`,
    '',
    stripSuggestedPrefix(buildSuggestedAngle(article, voiceProfile)),
    '',
    buildCommentQuestion(article, voiceProfile),
    '',
    `Source: ${article.source}`,
  ].join('\n');
}

function buildInstagramCaption(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE], cta) {
  return [
    buildAudienceHook(article, voiceProfile),
    '',
    buildStorySummary(article, voiceProfile),
    '',
    stripSuggestedPrefix(buildSuggestedAngle(article, voiceProfile)),
    '',
    cta,
    '',
    `Source: ${article.source}`,
    buildPlatformHashtags(article),
  ].join('\n');
}

function buildReelSpokenScript(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  return [
    buildVideoHook(article, 0),
    buildStorySummary(article, voiceProfile),
    `Why it matters: ${article.whyItMatters}`,
    stripSuggestedPrefix(buildSuggestedAngle(article, voiceProfile)),
    buildDirectChannelCta(article, voiceProfile, 'instagram-reel'),
  ].join(' ');
}

function buildTalkingHeadSpokenScript(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  return [
    buildAlternateHooks(article, voiceProfile, 'talking-head')[0] ?? buildVideoHook(article, 0),
    buildStorySummary(article, voiceProfile),
    `Why it matters now: ${article.whyItMatters}`,
    stripSuggestedPrefix(buildSuggestedAngle(article, voiceProfile)),
    buildDirectChannelCta(article, voiceProfile, 'talking-head'),
  ].join(' ');
}

function buildXSinglePost(article, voiceProfile = VOICE_PROFILES[DEFAULT_VOICE]) {
  return [
    buildAudienceHook(article, voiceProfile),
    buildStorySummary(article, voiceProfile),
    stripSuggestedPrefix(buildSuggestedAngle(article, voiceProfile)),
    buildCommentQuestion(article, voiceProfile),
    `Source: ${article.source}`,
  ].join(' ');
}

export function buildReadyToPostPack({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const lead = articles[0];
  const dateSlug = generatedAt.slice(0, 10);
  const subjectLines = buildSubjectLines(articles, generatedAt);

  if (!lead) {
    return [
      `# AI Ready-to-Post Pack for ${dateSlug}`,
      '',
      `Voice: ${voiceProfile.label}`,
      '',
      'No lead story was available, so the copy-paste pack could not be generated.',
      '',
    ].join('\n');
  }

  const previewText =
    articles.length >= 2
      ? `${lead.title} leads today's AI brief, plus ${articles[1].title}.`
      : `${lead.title} leads today's AI brief.`;
  const newsletterBody = [
    buildNewsletterIntro(articles, voiceProfile),
    '',
    `${lead.title}. ${buildStorySummary(lead, voiceProfile)} ${lead.whyItMatters}`,
    '',
    stripSuggestedPrefix(buildSuggestedAngle(lead, voiceProfile)),
    '',
    buildNewsletterCta(lead, voiceProfile),
  ].join('\n');
  const linkedinCta = buildCommentQuestion(lead, voiceProfile);
  const instagramCarouselCta = 'Save this post if you want the morning AI signal fast, and comment with the angle people are missing.';
  const instagramReelCta = buildDirectChannelCta(lead, voiceProfile, 'instagram-reel');
  const talkingHeadCta = buildDirectChannelCta(lead, voiceProfile, 'talking-head');
  const xQuestion = buildCommentQuestion(lead, voiceProfile);
  const carouselSlides = buildInstagramCarouselSlides(lead, voiceProfile);
  const xThreadPosts = [
    buildAudienceHook(lead, voiceProfile),
    buildStorySummary(lead, voiceProfile),
    `Why it matters now: ${lead.whyItMatters}`,
    stripSuggestedPrefix(buildSuggestedAngle(lead, voiceProfile)),
    `${xQuestion} Source: ${lead.source} ${lead.link}`,
  ];

  return [
    `# AI Ready-to-Post Pack for ${dateSlug}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    'Use this file when you want copy-paste-ready text without reading the rest of the morning pack.',
    '',
    '## Newsletter',
    '',
    `Title: ${subjectLines[0]}`,
    `Preview text: ${previewText}`,
    `CTA: ${buildNewsletterCta(lead, voiceProfile)}`,
    '',
    '```text',
    newsletterBody,
    '```',
    '',
    '## LinkedIn Post',
    '',
    `Title: ${buildAlternateHooks(lead, voiceProfile, 'linkedin-carousel')[0] ?? lead.title}`,
    `CTA: ${linkedinCta}`,
    '',
    '```text',
    buildLinkedInBody(lead, voiceProfile),
    '```',
    '',
    '## Instagram Carousel',
    '',
    `Title: ${buildAlternateHooks(lead, voiceProfile, 'instagram-carousel')[0] ?? lead.title}`,
    `CTA: ${instagramCarouselCta}`,
    '',
    ...carouselSlides.map((slide, index) => [
      `Slide ${index + 1}:`,
      '```text',
      slide,
      '```',
      '',
    ]).flat(),
    'Caption:',
    '```text',
    buildInstagramCaption(lead, voiceProfile, instagramCarouselCta),
    '```',
    '',
    '## Instagram Reel',
    '',
    `Title: ${buildAlternateHooks(lead, voiceProfile, 'instagram-reel')[0] ?? buildVideoHook(lead, 0)}`,
    `CTA: ${instagramReelCta}`,
    '',
    'Hook:',
    '```text',
    buildAlternateHooks(lead, voiceProfile, 'instagram-reel')[0] ?? buildVideoHook(lead, 0),
    '```',
    'Body:',
    '```text',
    buildReelSpokenScript(lead, voiceProfile),
    '```',
    'Caption:',
    '```text',
    buildInstagramCaption(lead, voiceProfile, instagramReelCta),
    '```',
    '',
    '## X Post',
    '',
    `Title: ${lead.title}`,
    `CTA: ${xQuestion}`,
    '',
    '```text',
    buildXSinglePost(lead, voiceProfile),
    '```',
    '',
    '## X Thread',
    '',
    `Title: ${lead.title}`,
    `CTA: ${xQuestion}`,
    '',
    ...xThreadPosts.map((post, index) => [
      `Post ${index + 1}:`,
      '```text',
      post,
      '```',
      '',
    ]).flat(),
    '## Talking-Head Video',
    '',
    `Title: ${buildAlternateHooks(lead, voiceProfile, 'talking-head')[0] ?? lead.title}`,
    `CTA: ${talkingHeadCta}`,
    '',
    'Hook:',
    '```text',
    buildAlternateHooks(lead, voiceProfile, 'talking-head')[0] ?? buildVideoHook(lead, 0),
    '```',
    'Body:',
    '```text',
    buildTalkingHeadSpokenScript(lead, voiceProfile),
    '```',
    '',
  ].join('\n');
}

export function buildSocialPostPack({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const posts = articles.map((article, index) => [
    `## Social Post ${index + 1}`,
    '',
    buildSocialPost(article, index, voiceProfile),
    '',
  ].join('\n'));

  return [
    `# AI Social Post Pack for ${generatedAt.slice(0, 10)}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    'These are first-draft posts for X, LinkedIn, or threads. Tighten them to match your voice before publishing.',
    '',
    ...posts,
  ].join('\n');
}

export function buildPublishingChecklist({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const topArticle = articles[0];
  const voiceProfile = resolveVoiceProfile(voice);

  return [
    `# AI Publishing Checklist for ${generatedAt.slice(0, 10)}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    '## Before publishing',
    '',
    '- Confirm the lead story is still fresh and has not already been replaced by a newer update.',
    '- Verify the headline, time, and source on the original article.',
    '- Add one original takeaway to each draft so it is not just a rewritten headline.',
    '- For short-form video, check that the first line works as the hook inside the first 3 to 6 seconds.',
    '- For newsletters, use a short subject line and A/B test the second option if possible.',
    '- For LinkedIn, prepare a native image, video, or document instead of a plain link-only post when possible.',
    '- After posting on LinkedIn, be ready to respond to comments quickly and join related industry conversations the same day.',
    '',
    '## After publishing',
    '',
    '- Newsletter: track click-through rate and replies, not only opens.',
    '- Short-form video: track 3-second hold rate, average view duration, and completion.',
    '- Social: track comments, saves, reposts, and profile visits.',
    '- Respond to meaningful comments while the content is still fresh.',
    '- Note which angle won today: product, research, business, policy, or industry shift.',
    '',
    "## Today's lead",
    '',
    `- Lead story: ${topArticle?.title ?? 'No lead story available'}`,
    `- Source: ${topArticle?.source ?? 'Unknown source'}`,
    `- Originality reminder: ${topArticle ? buildOriginalityPrompt(topArticle, voiceProfile) : 'Add an original takeaway before publishing.'}`,
    '',
  ].join('\n');
}

function buildQueueReason(index, article) {
  if (index === 0) {
    return `Lead with this because it has the highest score and should anchor the day: ${article.whyItMatters}`;
  }

  if (index === 1) {
    return `Use this next to extend the morning conversation without repeating the lead angle.`;
  }

  return 'Use this as a supporting or backup topic if you need another post later in the day.';
}

export function buildDailyPublishingQueue({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const lead = articles[0];
  const second = articles[1];
  const third = articles[2];

  return [
    `# AI Daily Publishing Queue for ${generatedAt.slice(0, 10)}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    '## Publishing order',
    '',
    '1. Publish the newsletter lead first.',
    `   Story: ${lead?.title ?? 'No lead story available'}`,
    `   Reason: ${lead ? buildQueueReason(0, lead) : 'No lead story available.'}`,
    '',
    '2. Publish one short-form video from the same lead story.',
    `   Story: ${lead?.title ?? 'No lead story available'}`,
    '   Reason: Reuse the strongest story while the topic is still fresh and keep the message consistent across formats.',
    '',
    '3. Publish one LinkedIn post from the lead story.',
    `   Story: ${lead?.title ?? 'No lead story available'}`,
    '   Reason: Turn the same signal into a conversation-first native post with your original angle.',
    '',
    '4. Use the second story as the next post or backup topic.',
    `   Story: ${second?.title ?? 'No second story available'}`,
    `   Reason: ${second ? buildQueueReason(1, second) : 'No second story available.'}`,
    '',
    '5. Keep the third story ready as a reserve post if the day stays active.',
    `   Story: ${third?.title ?? 'No third story available'}`,
    `   Reason: ${third ? buildQueueReason(2, third) : 'No third story available.'}`,
    '',
    '## Daily rule',
    '',
    '- Use story 1 as the main asset across newsletter, video, and LinkedIn.',
    '- Use stories 2 to 5 as follow-up or backup topics instead of publishing five disconnected pieces at once.',
    '- Add one original takeaway before anything goes live.',
    '',
  ].join('\n');
}

export function buildDailyPostingBrief({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const lead = articles[0];
  const dateSlug = generatedAt.slice(0, 10);

  return [
    `# AI Daily Posting Brief for ${dateSlug}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    '## Start here',
    '',
    `- Lead story: ${lead?.title ?? 'No lead story available'}`,
    `- Lead source: ${lead?.source ?? 'Unknown source'}`,
    `- First move: Publish the newsletter lead, then the short-form video, then the LinkedIn post.`,
    `- Original angle required: ${lead ? buildOriginalityPrompt(lead, voiceProfile) : 'Add one original takeaway before posting.'}`,
    '',
    '## Open these files',
    '',
    `- Ready-to-post pack: content/ai-news/${dateSlug}-ready-to-post.md`,
    `- Publishing queue: content/ai-news/${dateSlug}-publishing-queue.md`,
    `- Newsletter draft: content/ai-news/${dateSlug}-newsletter.md`,
    `- Instagram carousel: content/ai-news/${dateSlug}-instagram-carousel.md`,
    `- Instagram Reel pack: content/ai-news/${dateSlug}-instagram-reel.md`,
    `- LinkedIn carousel: content/ai-news/${dateSlug}-linkedin-carousel.md`,
    `- Talking-head script: content/ai-news/${dateSlug}-talking-head-30s.md`,
    `- X thread: content/ai-news/${dateSlug}-x-thread.md`,
    `- Video scripts: content/ai-news/${dateSlug}-video-scripts.md`,
    `- Social posts: content/ai-news/${dateSlug}-social-posts.md`,
    `- Quality report: content/ai-news/${dateSlug}-quality-report.md`,
    `- Publishing checklist: content/ai-news/${dateSlug}-publishing-checklist.md`,
    `- Content plan: content/ai-news/${dateSlug}-content-plan.md`,
    '',
    '## Posting order',
    '',
    '1. Newsletter',
    '2. Short-form video',
    '3. LinkedIn post',
    '4. Backup post from story 2 if the topic stays hot',
    '5. Reserve story 3 for later in the day if needed',
    '',
    '## Success metrics to watch today',
    '',
    '- Newsletter: clicks and replies',
    '- Video: 3-second hold rate and completion',
    '- Instagram: saves, shares, comments, and watch time',
    '- LinkedIn: comments, saves, reposts, and profile visits',
    '- X: replies, reposts, bookmarks, and profile visits',
    '',
  ].join('\n');
}

export function buildInstagramCarousel({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const lead = articles[0];

  return [
    `# AI Instagram Carousel for ${generatedAt.slice(0, 10)}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    `Lead story: ${lead?.title ?? 'No lead story available'}`,
    `Source: ${lead?.source ?? 'Unknown source'}`,
    '',
    '## Carousel slides',
    '',
    `1. Hook slide: ${lead?.title ?? 'Lead AI story of the day'}`,
    `2. Why it matters: ${lead ? buildStorySummary(lead, voiceProfile) : 'Explain why this matters.'}`,
    `3. What changed: ${lead?.whyItMatters ?? 'Summarize what changed.'}`,
    `4. Original angle: ${lead ? buildSuggestedAngle(lead, voiceProfile) : 'Add one original angle.'}`,
    '5. Save-worthy takeaway: explain what people should watch, test, or do next.',
    '6. CTA: ask people to comment with their take or save the post for later.',
    '',
    '## Caption',
    '',
    `${lead ? buildAudienceHook(lead, voiceProfile) : 'Start with the clearest angle.'} ${lead ? buildSuggestedAngle(lead, voiceProfile) : 'Add one original angle.'}`,
    '',
    '## Cover options',
    '',
    ...(lead
      ? buildAlternateHooks(lead, voiceProfile, 'instagram-carousel').map((option, index) => `${index + 1}. ${option}`)
      : ['1. Lead AI story of the day', '2. What this headline actually changes', '3. The real signal behind the story']),
    '',
    '## Format notes',
    '',
    '- Make slide 1 and slide 4 the strongest slides.',
    '- Design for saves and shares, not just likes.',
    '- Keep each slide focused on one idea and one short block of text.',
    '- Use 3-5 highly relevant hashtags, not a large hashtag dump.',
    '',
  ].join('\n');
}

export function buildInstagramReel({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const lead = articles[0];
  const alternateHooks = lead ? buildAlternateHooks(lead, voiceProfile, 'instagram-reel') : [];
  const ctaOptions = lead ? buildChannelCtaOptions(lead, voiceProfile, 'instagram-reel') : [];

  return [
    `# AI Instagram Reel Pack for ${generatedAt.slice(0, 10)}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    `Lead story: ${lead?.title ?? 'No lead story available'}`,
    '',
    '## Reel script',
    '',
    `Hook: ${lead ? buildVideoHook(lead, 0) : 'Lead with the strongest story.'}`,
    `Body: ${lead ? buildStorySummary(lead, voiceProfile) : 'Explain the story simply.'}`,
    `Why it matters: ${lead?.whyItMatters ?? 'Explain why it matters now.'}`,
    `Close: ${
      lead
        ? `${buildSuggestedAngle(lead, voiceProfile)} ${buildDirectChannelCta(lead, voiceProfile, 'instagram-reel')}`
        : 'End on one sharp original angle and a direct save/share/comment CTA.'
    }`,
    '',
    '## Caption',
    '',
    `${lead ? buildAudienceHook(lead, voiceProfile) : 'Lead with the clearest angle.'} ${lead ? buildSuggestedAngle(lead, voiceProfile) : 'Add one original angle.'}`,
    '',
    '## Alternate hooks',
    '',
    ...(alternateHooks.length
      ? alternateHooks.map((option, index) => `${index + 1}. ${option}`)
      : ['1. Lead with the strongest story.', '2. Explain the real signal fast.', '3. Give the audience a reason to care immediately.']),
    '',
    '## CTA options',
    '',
    ...(ctaOptions.length
      ? ctaOptions.map((option, index) => `${index + 1}. ${option}`)
      : ['1. Ask for a save.', '2. Ask for a share.', '3. Ask one direct question.']),
    '',
    '## Reel notes',
    '',
    '- Land the hook in the first 3 seconds.',
    '- Add captions because many viewers watch with sound off.',
    '- Keep the cut tight and visual text large enough for mobile.',
    '- Optimize for saves, shares, and watch time.',
    '',
  ].join('\n');
}

export function buildLinkedInCarouselOutline({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const lead = articles[0];

  return [
    `# AI LinkedIn Carousel for ${generatedAt.slice(0, 10)}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    `Lead story: ${lead?.title ?? 'No lead story available'}`,
    `Source: ${lead?.source ?? 'Unknown source'}`,
    '',
    '## Slide outline',
    '',
    `1. Cover: ${lead?.title ?? 'Lead AI story of the day'}`,
    `2. Why this matters: ${lead ? buildStorySummary(lead, voiceProfile) : 'Explain why the story matters.'}`,
    `3. What changed: ${lead?.whyItMatters ?? 'Summarize the change clearly.'}`,
    `4. Original take: ${lead ? buildSuggestedAngle(lead, voiceProfile) : 'Add one original takeaway.'}`,
    '5. So what: explain who should care and what they should watch next.',
    '6. CTA: ask a simple opinion question to invite comments.',
    '',
    '## Caption',
    '',
    `${lead ? buildAudienceHook(lead, voiceProfile) : 'Start with the clearest angle.'} ${lead ? buildSuggestedAngle(lead, voiceProfile) : 'Add one original takeaway.'}`,
    '',
    '## Cover options',
    '',
    ...(lead
      ? buildAlternateHooks(lead, voiceProfile, 'linkedin-carousel').map((option, index) => `${index + 1}. ${option}`)
      : ['1. The AI story operators should not ignore today', '2. What this AI move changes next', '3. The real takeaway behind the headline']),
    '',
    '## Format notes',
    '',
    '- Keep each slide to one idea.',
    '- Make slide 1 and slide 4 the strongest visual moments.',
    '- End with a comment-driving question instead of a vague CTA.',
    '',
  ].join('\n');
}

export function buildTalkingHeadScript30s({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const lead = articles[0];
  const alternateHooks = lead ? buildAlternateHooks(lead, voiceProfile, 'talking-head') : [];
  const ctaOptions = lead ? buildChannelCtaOptions(lead, voiceProfile, 'talking-head') : [];

  return [
    `# AI Talking Head Script 30s for ${generatedAt.slice(0, 10)}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    `Lead story: ${lead?.title ?? 'No lead story available'}`,
    '',
    '## Beat timing',
    '',
    '0-5s: Hook',
    `${lead ? buildVideoHook(lead, 0) : 'Lead with the strongest story.'}`,
    '',
    '5-15s: What changed',
    `${lead ? buildStorySummary(lead, voiceProfile) : 'Explain what changed.'}`,
    '',
    '15-24s: Why it matters',
    `${lead?.whyItMatters ?? 'Explain why it matters now.'}`,
    '',
    '24-30s: Original angle + close',
    `${
      lead
        ? `${buildSuggestedAngle(lead, voiceProfile)} ${buildDirectChannelCta(lead, voiceProfile, 'talking-head')}`
        : 'Add one original takeaway and end with one direct audience action.'
    }`,
    '',
    '## Alternate hooks',
    '',
    ...(alternateHooks.length
      ? alternateHooks.map((option, index) => `${index + 1}. ${option}`)
      : ['1. Start with the real signal.', '2. Tell the audience what most people miss.', '3. Give a direct reason to care.']),
    '',
    '## CTA options',
    '',
    ...(ctaOptions.length
      ? ctaOptions.map((option, index) => `${index + 1}. ${option}`)
      : ['1. Ask for a comment.', '2. Ask for an opinion.', '3. Ask for a follow.']),
    '',
    '## Production notes',
    '',
    '- Deliver the hook immediately.',
    '- Keep the energy up and the pacing tight.',
    '- Add captions and bold key phrases on screen.',
    '',
  ].join('\n');
}

export function buildXThread({
  generatedAt,
  articles,
  voice = DEFAULT_VOICE,
}) {
  const voiceProfile = resolveVoiceProfile(voice);
  const lead = articles[0];

  return [
    `# AI X Thread for ${generatedAt.slice(0, 10)}`,
    '',
    `Voice: ${voiceProfile.label}`,
    '',
    '## Thread',
    '',
    `1. ${lead ? buildAudienceHook(lead, voiceProfile) : 'Lead with the strongest AI story of the day.'}`,
    '',
    `2. ${lead ? buildStorySummary(lead, voiceProfile) : 'Summarize what changed.'}`,
    '',
    `3. ${lead?.whyItMatters ?? 'Explain why it matters now.'}`,
    '',
    `4. ${lead ? buildSuggestedAngle(lead, voiceProfile) : 'Add one original takeaway.'}`,
    '',
    `5. Source: ${lead?.source ?? 'Unknown source'} ${lead?.link ?? ''}`.trim(),
    '',
    '## Notes',
    '',
    '- Keep each post punchy and scannable.',
    '- If the thread underperforms early, reuse the original take as a single standalone post later.',
    '',
  ].join('\n');
}

export async function recordAiNews({
  now = new Date(),
  limit = parseLimit(envValue('AI_NEWS_LIMIT', `${DEFAULT_LIMIT}`)),
  query = envValue('AI_NEWS_QUERY', DEFAULT_QUERY),
  outputDir = envValue('AI_NEWS_OUTPUT_DIR', DEFAULT_OUTPUT_DIR),
  language = envValue('AI_NEWS_LANGUAGE', 'en-US'),
  region = envValue('AI_NEWS_REGION', 'US'),
  voice = envValue('AI_CONTENT_VOICE', DEFAULT_VOICE).toLowerCase(),
  telegramBotToken = envValue('AI_TELEGRAM_BOT_TOKEN', ''),
  telegramChatId = envValue('AI_TELEGRAM_CHAT_ID', ''),
  telegramSilent = parseBoolean(envValue('AI_TELEGRAM_SILENT', 'false')),
  telegramRepoUrl = envValue(
    'AI_TELEGRAM_REPO_URL',
    process.env.GITHUB_REPOSITORY ? `${envValue('GITHUB_SERVER_URL', 'https://github.com')}/${process.env.GITHUB_REPOSITORY}` : '',
  ),
  telegramRepoBranch = envValue('AI_TELEGRAM_REPO_BRANCH', envValue('GITHUB_REF_NAME', 'main')),
  preferredSources = new Set(
    parseCsv(envValue('AI_NEWS_PREFERRED_SOURCES', 'Reuters,The Verge,TechCrunch,MIT Technology Review,The Information')).map(
      normalizeSource,
    ),
  ),
  maxPerSource = parseLimit(envValue('AI_NEWS_MAX_PER_SOURCE', `${DEFAULT_MAX_PER_SOURCE}`), DEFAULT_MAX_PER_SOURCE),
  fetchImpl = fetch,
} = {}) {
  const feedUrl = createGoogleNewsFeedUrl({ query, language, region });
  const response = await fetchImpl(feedUrl, {
    headers: {
      'User-Agent': 'content-creation-ai-news-recorder/1.0',
      Accept: 'application/rss+xml, application/xml, text/xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch AI news feed: ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  const items = parseRssItems(xml);
  const articles = rankArticles(items, now, limit, preferredSources, maxPerSource);

  if (!articles.length) {
    throw new Error('No AI news stories were found for the current query.');
  }

  await fs.mkdir(outputDir, { recursive: true });

  const generatedAt = now.toISOString();
  const dateSlug = generatedAt.slice(0, 10);
  const payload = {
    generatedAt,
    query,
    feedUrl,
    articleCount: articles.length,
    voice: resolveVoiceProfile(voice).key,
    preferredSources: [...preferredSources],
    maxPerSource,
    articles,
  };

  const markdownPath = path.join(outputDir, `${dateSlug}.md`);
  const contentPlanPath = path.join(outputDir, `${dateSlug}-content-plan.md`);
  const newsletterPath = path.join(outputDir, `${dateSlug}-newsletter.md`);
  const readyToPostPath = path.join(outputDir, `${dateSlug}-ready-to-post.md`);
  const postingBriefPath = path.join(outputDir, `${dateSlug}-daily-posting-brief.md`);
  const instagramCarouselPath = path.join(outputDir, `${dateSlug}-instagram-carousel.md`);
  const instagramReelPath = path.join(outputDir, `${dateSlug}-instagram-reel.md`);
  const linkedinCarouselPath = path.join(outputDir, `${dateSlug}-linkedin-carousel.md`);
  const talkingHeadPath = path.join(outputDir, `${dateSlug}-talking-head-30s.md`);
  const xThreadPath = path.join(outputDir, `${dateSlug}-x-thread.md`);
  const publishingQueuePath = path.join(outputDir, `${dateSlug}-publishing-queue.md`);
  const qualityReportPath = path.join(outputDir, `${dateSlug}-quality-report.md`);
  const publishingChecklistPath = path.join(outputDir, `${dateSlug}-publishing-checklist.md`);
  const videoScriptsPath = path.join(outputDir, `${dateSlug}-video-scripts.md`);
  const socialPostsPath = path.join(outputDir, `${dateSlug}-social-posts.md`);
  const latestJsonPath = path.join(outputDir, 'latest.json');
  const telegramMessage = buildTelegramNotification({
    ...payload,
    repoUrl: telegramRepoUrl,
    repoBranch: telegramRepoBranch,
  });
  const telegramReplyMarkup = buildTelegramReplyMarkup({
    ...payload,
    repoUrl: telegramRepoUrl,
    repoBranch: telegramRepoBranch,
  });

  await Promise.all([
    fs.writeFile(markdownPath, buildMarkdownDigest(payload), 'utf8'),
    fs.writeFile(contentPlanPath, buildContentPlan(payload), 'utf8'),
    fs.writeFile(newsletterPath, buildNewsletterDraft(payload), 'utf8'),
    fs.writeFile(readyToPostPath, buildReadyToPostPack(payload), 'utf8'),
    fs.writeFile(postingBriefPath, buildDailyPostingBrief(payload), 'utf8'),
    fs.writeFile(instagramCarouselPath, buildInstagramCarousel(payload), 'utf8'),
    fs.writeFile(instagramReelPath, buildInstagramReel(payload), 'utf8'),
    fs.writeFile(linkedinCarouselPath, buildLinkedInCarouselOutline(payload), 'utf8'),
    fs.writeFile(talkingHeadPath, buildTalkingHeadScript30s(payload), 'utf8'),
    fs.writeFile(xThreadPath, buildXThread(payload), 'utf8'),
    fs.writeFile(publishingQueuePath, buildDailyPublishingQueue(payload), 'utf8'),
    fs.writeFile(qualityReportPath, buildContentQualityReport(payload), 'utf8'),
    fs.writeFile(publishingChecklistPath, buildPublishingChecklist(payload), 'utf8'),
    fs.writeFile(videoScriptsPath, buildVideoScriptPack(payload), 'utf8'),
    fs.writeFile(socialPostsPath, buildSocialPostPack(payload), 'utf8'),
    fs.writeFile(latestJsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8'),
  ]);

  let telegramNotificationSent = false;

  if (telegramBotToken || telegramChatId) {
    if (!telegramBotToken || !telegramChatId) {
      throw new Error('Telegram notifications require both AI_TELEGRAM_BOT_TOKEN and AI_TELEGRAM_CHAT_ID.');
    }

    await sendTelegramNotification({
      botToken: telegramBotToken,
      chatId: telegramChatId,
      message: telegramMessage,
      replyMarkup: telegramReplyMarkup,
      silent: telegramSilent,
      fetchImpl,
    });
    telegramNotificationSent = true;
  }

  return {
    markdownPath,
    contentPlanPath,
    newsletterPath,
    readyToPostPath,
    postingBriefPath,
    instagramCarouselPath,
    instagramReelPath,
    linkedinCarouselPath,
    talkingHeadPath,
    xThreadPath,
    publishingQueuePath,
    qualityReportPath,
    publishingChecklistPath,
    videoScriptsPath,
    socialPostsPath,
    latestJsonPath,
    articleCount: articles.length,
    feedUrl,
    telegramNotificationSent,
  };
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  loadLocalEnv()
    .then(() => recordAiNews())
    .then((result) => {
      console.log(
        `Recorded ${result.articleCount} AI stories to ${result.markdownPath}, ${result.contentPlanPath}, ${result.newsletterPath}, ${result.readyToPostPath}, ${result.postingBriefPath}, ${result.instagramCarouselPath}, ${result.instagramReelPath}, ${result.linkedinCarouselPath}, ${result.talkingHeadPath}, ${result.xThreadPath}, ${result.publishingQueuePath}, ${result.qualityReportPath}, ${result.publishingChecklistPath}, ${result.videoScriptsPath}, ${result.socialPostsPath}, and ${result.latestJsonPath}.`,
      );
      console.log(`Feed used: ${result.feedUrl}`);
      if (result.telegramNotificationSent) {
        console.log('Telegram notification sent.');
      }
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
