export type ScrapeSource = 'jina' | 'firecrawl';

export interface ScrapeOutput {
  raw_markdown: string;
  source: ScrapeSource;
}

const JINA_TIMEOUT_MS = 15_000;
const FIRECRAWL_TIMEOUT_MS = 25_000;
const MIN_MARKDOWN_LENGTH = 200;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Jina Reader — free, no auth required. Returns clean markdown.
 * Docs: https://jina.ai/reader/
 */
async function scrapeWithJina(url: string): Promise<string> {
  const target = `https://r.jina.ai/${url}`;
  const headers: Record<string, string> = {
    Accept: 'text/plain',
    'X-Return-Format': 'markdown',
  };
  if (process.env.JINA_API_KEY) {
    headers.Authorization = `Bearer ${process.env.JINA_API_KEY}`;
  }

  const res = await fetchWithTimeout(target, { headers }, JINA_TIMEOUT_MS);
  if (!res.ok) {
    throw new Error(`Jina returned ${res.status}: ${await res.text()}`);
  }
  return (await res.text()).trim();
}

/**
 * Firecrawl v1 /scrape — requires FIRECRAWL_API_KEY.
 * Docs: https://docs.firecrawl.dev/api-reference/endpoint/scrape
 */
async function scrapeWithFirecrawl(url: string): Promise<string> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is not set.');
  }

  const res = await fetchWithTimeout(
    'https://api.firecrawl.dev/v1/scrape',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    },
    FIRECRAWL_TIMEOUT_MS,
  );

  if (!res.ok) {
    throw new Error(`Firecrawl returned ${res.status}: ${await res.text()}`);
  }

  const payload = (await res.json()) as {
    success?: boolean;
    data?: { markdown?: string };
    error?: string;
  };

  if (!payload.success || !payload.data?.markdown) {
    throw new Error(
      `Firecrawl returned no markdown: ${payload.error ?? 'unknown error'}`,
    );
  }
  return payload.data.markdown.trim();
}

/**
 * Scrape a job posting URL. Tries Jina first (free), falls back to Firecrawl
 * on failure or if the response looks too thin to be a real posting.
 */
export async function scrapeJobUrl(url: string): Promise<ScrapeOutput> {
  const errors: string[] = [];

  try {
    const markdown = await scrapeWithJina(url);
    if (markdown.length >= MIN_MARKDOWN_LENGTH) {
      return { raw_markdown: markdown, source: 'jina' };
    }
    errors.push(`Jina returned only ${markdown.length} chars.`);
  } catch (err) {
    errors.push(`Jina: ${(err as Error).message}`);
  }

  try {
    const markdown = await scrapeWithFirecrawl(url);
    if (markdown.length >= MIN_MARKDOWN_LENGTH) {
      return { raw_markdown: markdown, source: 'firecrawl' };
    }
    errors.push(`Firecrawl returned only ${markdown.length} chars.`);
  } catch (err) {
    errors.push(`Firecrawl: ${(err as Error).message}`);
  }

  throw new Error(`Scraping failed. ${errors.join(' | ')}`);
}
