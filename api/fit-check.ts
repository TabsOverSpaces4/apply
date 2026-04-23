import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callClaudeJson } from './_lib/claude.js';
import { FIT_CHECK_SYSTEM, buildFitCheckUser } from './_lib/prompts.js';

interface FitCheckResult {
  title: string;
  company: string;
  location: string;
  role_summary: string;
  must_haves: string[];
  nice_to_haves: string[];
  score: number;
  verdict: 'good_fit' | 'stretch' | 'poor_fit';
  one_liner: string;
  strengths: string[];
  gaps: string[];
  red_flags: string[];
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobMarkdown } = (req.body ?? {}) as { jobMarkdown?: string };
  if (!jobMarkdown || typeof jobMarkdown !== 'string') {
    return res
      .status(400)
      .json({ error: 'Missing "jobMarkdown" in request body.' });
  }

  try {
    const result = await callClaudeJson<FitCheckResult>({
      system: FIT_CHECK_SYSTEM,
      user: buildFitCheckUser(jobMarkdown),
      maxTokens: 2048,
      temperature: 0.2,
    });
    return res.status(200).json(result);
  } catch (err) {
    const message = (err as Error).message;
    console.error('[fit-check] error:', message);
    return res.status(500).json({ error: message });
  }
}
