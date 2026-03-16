import { describe, expect, it } from 'vitest';

import {
  buildExistingStoryKeys,
  buildSheetRows,
  deriveStoryCategory,
} from './sync-ai-news-to-sheet.mjs';

describe('sync-ai-news-to-sheet helpers', () => {
  it('derives useful story categories from common AI headlines', () => {
    expect(
      deriveStoryCategory({
        title: 'OpenAI launches a new reasoning model',
        description: 'A product launch for builders.',
      }),
    ).toBe('Product');

    expect(
      deriveStoryCategory({
        title: 'Anthropic raises funding for robotics push',
        description: 'Fresh investment news.',
      }),
    ).toBe('Funding / Business');

    expect(
      deriveStoryCategory({
        title: 'OpenAI and Google employees rush to Anthropic’s defense in DOD lawsuit',
        description: 'A legal challenge tied to the Pentagon.',
      }),
    ).toBe('Policy / Legal');
  });

  it('builds Google Sheets rows with status and checkbox columns', () => {
    const rows = buildSheetRows({
      generatedAt: '2026-03-16T09:00:00.000Z',
      articles: [
        {
          title: 'OpenAI launches a new reasoning model',
          source: 'The Verge',
          pubDate: 'Sun, 16 Mar 2026 08:00:00 GMT',
          link: 'https://example.com/openai-reasoning',
          description: 'The release focuses on agents and reasoning.',
          whyItMatters: 'It changes how AI agents get marketed to developers.',
        },
      ],
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual([
      '2026-03-16',
      1,
      'OpenAI launches a new reasoning model',
      'The Verge',
      'Sun, 16 Mar 2026 08:00:00 GMT',
      'https://example.com/openai-reasoning',
      'The release focuses on agents and reasoning.',
      'It changes how AI agents get marketed to developers.',
      'Product',
      'new',
      false,
      false,
      '',
    ]);
  });

  it('builds dedupe keys from existing sheet rows', () => {
    const keys = buildExistingStoryKeys([
      ['2026-03-16', '1', 'Story A', 'Reuters', 'Sun', 'https://example.com/story-a'],
      ['2026-03-16', '2', 'Story B', 'The Verge', 'Sun', 'https://example.com/story-b'],
    ]);

    expect(keys.has('2026-03-16::https://example.com/story-a')).toBe(true);
    expect(keys.has('2026-03-16::https://example.com/story-b')).toBe(true);
    expect(keys.size).toBe(2);
  });
});
