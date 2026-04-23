import type { VercelRequest, VercelResponse } from '@vercel/node';
import { scrapeJobUrl } from './_lib/scrapers.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = (req.body ?? {}) as { url?: string };
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing "url" in request body.' });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL.' });
  }

  try {
    const result = await scrapeJobUrl(url);
    return res.status(200).json(result);
  } catch (err) {
    const message = (err as Error).message;
    console.error('[scrape] error:', message);
    return res.status(502).json({ error: message });
  }
}
