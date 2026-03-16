import { createSign } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  createGoogleNewsFeedUrl,
  loadLocalEnv,
  parseRssItems,
  rankArticles,
} from './record-ai-news.mjs';

const DEFAULT_QUERY =
  'AI OR "artificial intelligence" OR ChatGPT OR OpenAI OR Anthropic OR Gemini when:7d';
const DEFAULT_LIMIT = 10;
const DEFAULT_LANGUAGE = 'en-US';
const DEFAULT_REGION = 'US';
const DEFAULT_MAX_PER_SOURCE = 2;
const DEFAULT_SHEET_NAME = 'AI News';
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

const SHEET_HEADERS = [
  'Date',
  'Rank',
  'Title',
  'Source',
  'Published At',
  'Link',
  'Summary',
  'Why It Matters',
  'Category',
  'Status',
  'Picked',
  'Posted',
  'Notes',
];

function envValue(name, fallback = '') {
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

function normalizeSource(source) {
  return source.trim().toLowerCase();
}

function normalizePrivateKey(privateKey) {
  return privateKey.replace(/\\n/gu, '\n');
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function signJwt(unsignedToken, privateKey) {
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  return signer.sign(normalizePrivateKey(privateKey)).toString('base64url');
}

async function fetchAccessToken({
  clientEmail,
  privateKey,
  fetchImpl = fetch,
}) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 3600;
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claimSet = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: GOOGLE_SHEETS_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      exp: expiresAt,
      iat: issuedAt,
    }),
  );
  const unsignedToken = `${header}.${claimSet}`;
  const assertion = `${unsignedToken}.${signJwt(unsignedToken, privateKey)}`;

  const response = await fetchImpl(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get Google access token: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();

  if (!payload.access_token) {
    throw new Error('Google access token response did not include access_token.');
  }

  return payload.access_token;
}

async function googleSheetsRequest({
  spreadsheetId,
  pathSuffix = '',
  method = 'GET',
  accessToken,
  body,
  query = {},
  fetchImpl = fetch,
}) {
  const url = new URL(`${GOOGLE_SHEETS_API}/${spreadsheetId}${pathSuffix}`);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetchImpl(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets request failed: ${response.status} ${response.statusText} ${errorText}`.trim());
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function quoteSheetName(sheetName) {
  return /[\s']/u.test(sheetName) ? `'${sheetName.replace(/'/gu, "''")}'` : sheetName;
}

function buildA1Range(sheetName, range) {
  return `${quoteSheetName(sheetName)}!${range}`;
}

function columnIndexToLetter(index) {
  let value = index + 1;
  let output = '';

  while (value > 0) {
    const remainder = (value - 1) % 26;
    output = String.fromCharCode(65 + remainder) + output;
    value = Math.floor((value - 1) / 26);
  }

  return output;
}

async function ensureSheetExists({
  spreadsheetId,
  sheetName,
  accessToken,
  fetchImpl = fetch,
}) {
  const metadata = await googleSheetsRequest({
    spreadsheetId,
    accessToken,
    query: { fields: 'sheets.properties' },
    fetchImpl,
  });

  const existing = metadata?.sheets?.find((sheet) => sheet.properties?.title === sheetName);

  if (existing?.properties?.sheetId !== undefined) {
    return existing.properties.sheetId;
  }

  const created = await googleSheetsRequest({
    spreadsheetId,
    pathSuffix: ':batchUpdate',
    method: 'POST',
    accessToken,
    body: {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetName,
              gridProperties: {
                frozenRowCount: 1,
              },
            },
          },
        },
      ],
    },
    fetchImpl,
  });

  return created?.replies?.[0]?.addSheet?.properties?.sheetId;
}

async function applySheetFormatting({
  spreadsheetId,
  sheetId,
  accessToken,
  fetchImpl = fetch,
}) {
  if (sheetId === undefined) {
    return;
  }

  await googleSheetsRequest({
    spreadsheetId,
    pathSuffix: ':batchUpdate',
    method: 'POST',
    accessToken,
    body: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId,
              gridProperties: {
                frozenRowCount: 1,
              },
            },
            fields: 'gridProperties.frozenRowCount',
          },
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                textFormat: {
                  bold: true,
                },
              },
            },
            fields: 'userEnteredFormat.textFormat.bold',
          },
        },
        {
          setBasicFilter: {
            filter: {
              range: {
                sheetId,
                startRowIndex: 0,
                startColumnIndex: 0,
                endColumnIndex: SHEET_HEADERS.length,
              },
            },
          },
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 1,
              startColumnIndex: 10,
              endColumnIndex: 12,
            },
            cell: {
              dataValidation: {
                condition: {
                  type: 'BOOLEAN',
                },
                strict: true,
                showCustomUi: true,
              },
            },
            fields: 'dataValidation',
          },
        },
      ],
    },
    fetchImpl,
  });
}

async function ensureHeaderRow({
  spreadsheetId,
  sheetName,
  accessToken,
  fetchImpl = fetch,
}) {
  const lastHeaderColumn = columnIndexToLetter(SHEET_HEADERS.length - 1);
  const range = buildA1Range(sheetName, `A1:${lastHeaderColumn}1`);
  const existing = await googleSheetsRequest({
    spreadsheetId,
    pathSuffix: `/values/${encodeURIComponent(range)}`,
    accessToken,
    fetchImpl,
  });

  const currentHeaders = existing?.values?.[0] ?? [];
  const headersMatch =
    currentHeaders.length === SHEET_HEADERS.length &&
    currentHeaders.every((value, index) => value === SHEET_HEADERS[index]);

  if (headersMatch) {
    return;
  }

  await googleSheetsRequest({
    spreadsheetId,
    pathSuffix: `/values/${encodeURIComponent(range)}`,
    method: 'PUT',
    accessToken,
    query: {
      valueInputOption: 'RAW',
    },
    body: {
      range,
      majorDimension: 'ROWS',
      values: [SHEET_HEADERS],
    },
    fetchImpl,
  });
}

async function readExistingRows({
  spreadsheetId,
  sheetName,
  accessToken,
  fetchImpl = fetch,
}) {
  const range = buildA1Range(sheetName, 'A2:F');
  const response = await googleSheetsRequest({
    spreadsheetId,
    pathSuffix: `/values/${encodeURIComponent(range)}`,
    accessToken,
    fetchImpl,
  });

  return response?.values ?? [];
}

export function buildExistingStoryKeys(rows) {
  const keys = new Set();

  for (const row of rows) {
    const date = row[0];
    const link = row[5];

    if (date && link) {
      keys.add(`${date}::${link}`);
    }
  }

  return keys;
}

export function deriveStoryCategory(article) {
  const haystack = `${article.title ?? ''} ${article.description ?? ''}`.toLowerCase();

  if (/\b(lawsuit|regulat|policy|doj|dod|pentagon|government|court|legal)\b/iu.test(haystack)) {
    return 'Policy / Legal';
  }

  if (/\b(funding|raises|investment|venture|valuation|backed|acquisition|deal)\b/iu.test(haystack)) {
    return 'Funding / Business';
  }

  if (/\b(research|paper|scientific|study|discovery|benchmark)\b/iu.test(haystack)) {
    return 'Research';
  }

  if (/\b(inference|chip|gpu|cloud|azure|aws|foundry|infrastructure|latency)\b/iu.test(haystack)) {
    return 'Infrastructure';
  }

  if (/\b(model|launch|release|agent|video|chatgpt|claude|gemini|assistant|feature|app)\b/iu.test(haystack)) {
    return 'Product';
  }

  return 'General';
}

function truncate(value, maxLength) {
  if (!value) {
    return '';
  }

  return value.length > maxLength ? `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…` : value;
}

export function buildSheetRows({
  articles,
  generatedAt,
}) {
  const dateSlug = generatedAt.slice(0, 10);

  return articles.map((article, index) => [
    dateSlug,
    index + 1,
    article.title,
    article.source,
    article.pubDate ?? '',
    article.link,
    truncate(article.description ?? '', 220),
    truncate(article.whyItMatters ?? '', 220),
    deriveStoryCategory(article),
    'new',
    false,
    false,
    '',
  ]);
}

async function appendRows({
  spreadsheetId,
  sheetName,
  rows,
  accessToken,
  fetchImpl = fetch,
}) {
  const range = buildA1Range(sheetName, 'A1');

  return googleSheetsRequest({
    spreadsheetId,
    pathSuffix: `/values/${encodeURIComponent(range)}:append`,
    method: 'POST',
    accessToken,
    query: {
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
    },
    body: {
      range,
      majorDimension: 'ROWS',
      values: rows,
    },
    fetchImpl,
  });
}

export async function syncAiNewsToGoogleSheet({
  now = new Date(),
  limit = parseLimit(envValue('AI_NEWS_LIMIT', `${DEFAULT_LIMIT}`), DEFAULT_LIMIT),
  query = envValue('AI_NEWS_QUERY', DEFAULT_QUERY),
  language = envValue('AI_NEWS_LANGUAGE', DEFAULT_LANGUAGE),
  region = envValue('AI_NEWS_REGION', DEFAULT_REGION),
  preferredSources = new Set(
    parseCsv(envValue('AI_NEWS_PREFERRED_SOURCES', 'Reuters,The Verge,TechCrunch,MIT Technology Review,The Information')).map(
      normalizeSource,
    ),
  ),
  maxPerSource = parseLimit(envValue('AI_NEWS_MAX_PER_SOURCE', `${DEFAULT_MAX_PER_SOURCE}`), DEFAULT_MAX_PER_SOURCE),
  spreadsheetId = envValue('AI_NEWS_SHEET_ID', ''),
  sheetName = envValue('AI_NEWS_SHEET_NAME', DEFAULT_SHEET_NAME),
  googleClientEmail = envValue('AI_NEWS_GOOGLE_CLIENT_EMAIL', ''),
  googlePrivateKey = envValue('AI_NEWS_GOOGLE_PRIVATE_KEY', ''),
  fetchImpl = fetch,
} = {}) {
  if (!spreadsheetId) {
    throw new Error('Missing AI_NEWS_SHEET_ID. Add your Google Sheet ID before running the sync.');
  }

  if (!googleClientEmail || !googlePrivateKey) {
    throw new Error(
      'Missing Google service account credentials. Set AI_NEWS_GOOGLE_CLIENT_EMAIL and AI_NEWS_GOOGLE_PRIVATE_KEY.',
    );
  }

  const feedUrl = createGoogleNewsFeedUrl({ query, language, region });
  const feedResponse = await fetchImpl(feedUrl, {
    headers: {
      'User-Agent': 'ai-news-sheet-sync/1.0',
      Accept: 'application/rss+xml, application/xml, text/xml',
    },
  });

  if (!feedResponse.ok) {
    throw new Error(`Failed to fetch AI news feed: ${feedResponse.status} ${feedResponse.statusText}`);
  }

  const xml = await feedResponse.text();
  const items = parseRssItems(xml);
  const articles = rankArticles(items, now, limit, preferredSources, maxPerSource);

  if (!articles.length) {
    throw new Error('No AI news stories were found for the current query.');
  }

  const accessToken = await fetchAccessToken({
    clientEmail: googleClientEmail,
    privateKey: googlePrivateKey,
    fetchImpl,
  });

  const sheetId = await ensureSheetExists({
    spreadsheetId,
    sheetName,
    accessToken,
    fetchImpl,
  });

  await applySheetFormatting({
    spreadsheetId,
    sheetId,
    accessToken,
    fetchImpl,
  });
  await ensureHeaderRow({
    spreadsheetId,
    sheetName,
    accessToken,
    fetchImpl,
  });

  const existingRows = await readExistingRows({
    spreadsheetId,
    sheetName,
    accessToken,
    fetchImpl,
  });
  const existingKeys = buildExistingStoryKeys(existingRows);
  const generatedAt = now.toISOString();
  const rows = buildSheetRows({
    articles,
    generatedAt,
  });
  const rowsToAppend = rows.filter((row) => !existingKeys.has(`${row[0]}::${row[5]}`));

  if (rowsToAppend.length) {
    await appendRows({
      spreadsheetId,
      sheetName,
      rows: rowsToAppend,
      accessToken,
      fetchImpl,
    });
  }

  return {
    generatedAt,
    articleCount: articles.length,
    appendedCount: rowsToAppend.length,
    skippedExistingCount: rows.length - rowsToAppend.length,
    feedUrl,
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheetId ?? 0}`,
    sheetName,
  };
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  loadLocalEnv()
    .then(() => syncAiNewsToGoogleSheet())
    .then((result) => {
      console.log(
        `Synced ${result.appendedCount} new AI stories to Google Sheets in "${result.sheetName}" (${result.articleCount} ranked, ${result.skippedExistingCount} already logged).`,
      );
      console.log(`Sheet: ${result.spreadsheetUrl}`);
      console.log(`Feed used: ${result.feedUrl}`);
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
