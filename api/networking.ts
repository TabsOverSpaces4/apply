import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callClaudeJson } from './_lib/claude.js';
import { NETWORKING_SYSTEM, buildNetworkingUser } from './_lib/prompts.js';

interface NetworkingTarget {
  persona: string;
  why: string;
  linkedin_search_url: string;
}

interface NetworkingResult {
  targets: NetworkingTarget[];
  draft_message: { subject: string; body: string };
  email_guess_pattern: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { company, location, role } = (req.body ?? {}) as {
    company?: string;
    location?: string;
    role?: string;
  };

  if (!company || !role) {
    return res
      .status(400)
      .json({ error: 'Missing "company" or "role" in request body.' });
  }

  try {
    const result = await callClaudeJson<NetworkingResult>({
      system: NETWORKING_SYSTEM,
      user: buildNetworkingUser(company, location ?? 'Unknown', role),
      maxTokens: 2048,
      temperature: 0.6,
    });
    return res.status(200).json(result);
  } catch (err) {
    const message = (err as Error).message;
    console.error('[networking] error:', message);
    return res.status(500).json({ error: message });
  }
}
