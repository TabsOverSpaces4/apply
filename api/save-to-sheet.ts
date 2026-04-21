import type { VercelRequest, VercelResponse } from '@vercel/node';

interface NetworkingTarget {
  persona: string;
  why: string;
  linkedin_search_url: string;
}

interface SheetPayload {
  company: string;
  role: string;
  location: string;
  url: string;
  fit_score: number;
  verdict: string;
  cover_letter_full: string;
  targets: NetworkingTarget[];
}

const WEBHOOK_TIMEOUT_MS = 15_000;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { payload, webhookUrl } = (req.body ?? {}) as {
    payload?: SheetPayload;
    webhookUrl?: string;
  };

  if (!payload || !webhookUrl) {
    return res
      .status(400)
      .json({ error: 'Missing "payload" or "webhookUrl" in request body.' });
  }

  try {
    new URL(webhookUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid webhookUrl.' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error('[save-to-sheet] upstream error:', upstream.status, text);
      return res.status(502).json({
        error: `Google Sheets webhook returned ${upstream.status}`,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    const message = (err as Error).message;
    console.error('[save-to-sheet] error:', message);
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timer);
  }
}
