import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_MODEL = 'claude-sonnet-4-5';

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set.');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export function getModel(): string {
  return process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
}

export interface ClaudeJsonOptions {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Calls Claude and returns the assistant text content concatenated.
 */
export async function callClaudeText({
  system,
  user,
  maxTokens = 4096,
  temperature = 0.4,
}: ClaudeJsonOptions): Promise<string> {
  const msg = await getClient().messages.create({
    model: getModel(),
    max_tokens: maxTokens,
    temperature,
    system,
    messages: [{ role: 'user', content: user }],
  });

  return msg.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}

/**
 * Extracts the first balanced JSON object or array from a string.
 * Handles fenced code blocks and surrounding prose.
 */
export function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : raw;

  const startIdx = candidate.search(/[{[]/);
  if (startIdx === -1) {
    throw new Error('No JSON object or array found in model response.');
  }

  const openChar = candidate[startIdx];
  const closeChar = openChar === '{' ? '}' : ']';

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIdx; i < candidate.length; i++) {
    const ch = candidate[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\' && inString) {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === openChar) depth++;
    else if (ch === closeChar) {
      depth--;
      if (depth === 0) {
        return candidate.slice(startIdx, i + 1);
      }
    }
  }

  throw new Error('Unterminated JSON in model response.');
}

/**
 * Calls Claude and parses the response as JSON.
 */
export async function callClaudeJson<T>(opts: ClaudeJsonOptions): Promise<T> {
  const raw = await callClaudeText(opts);
  const json = extractJson(raw);
  try {
    return JSON.parse(json) as T;
  } catch (err) {
    throw new Error(
      `Failed to parse Claude response as JSON: ${(err as Error).message}\n\nRaw:\n${raw.slice(0, 500)}`,
    );
  }
}
