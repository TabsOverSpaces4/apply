import type {
  ScrapeResult,
  FitCheckResult,
  TailorResult,
  NetworkingResult,
  SheetPayload,
} from '../types';

const BASE = '/api';

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function scrapeJob(url: string) {
  return post<ScrapeResult>('/scrape', { url });
}

export function fitCheck(jobMarkdown: string) {
  return post<FitCheckResult>('/fit-check', { jobMarkdown });
}

export function tailorResume(jd: string) {
  return post<TailorResult>('/tailor', { jd });
}

export function getNetworking(company: string, location: string, role: string) {
  return post<NetworkingResult>('/networking', { company, location, role });
}

export function saveToSheet(payload: SheetPayload, webhookUrl: string) {
  return post<{ ok: boolean }>('/save-to-sheet', { payload, webhookUrl });
}
