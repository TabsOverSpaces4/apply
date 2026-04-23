import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callClaudeJson } from './_lib/claude.js';
import { TAILOR_SYSTEM, buildTailorUser } from './_lib/prompts.js';

interface StudyItem {
  skill: string;
  why: string;
  prep: string;
  priority: 'H' | 'M' | 'L';
}

interface TailorResult {
  projected_score: number;
  uplift_commentary: string;
  summary: string;
  skills: string;
  experience_crewscale: string;
  experience_intelliflow: string;
  experience_kredx: string;
  experience_capgemini: string;
  projects: string;
  cover_letter_hook: string;
  cover_letter_full: string;
  study_list: StudyItem[];
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jd } = (req.body ?? {}) as { jd?: string };
  if (!jd || typeof jd !== 'string') {
    return res.status(400).json({ error: 'Missing "jd" in request body.' });
  }

  try {
    const result = await callClaudeJson<TailorResult>({
      system: TAILOR_SYSTEM,
      user: buildTailorUser(jd),
      maxTokens: 6144,
      temperature: 0.5,
    });
    return res.status(200).json(result);
  } catch (err) {
    const message = (err as Error).message;
    console.error('[tailor] error:', message);
    return res.status(500).json({ error: message });
  }
}
