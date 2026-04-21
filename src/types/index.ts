export type FlowStage =
  | 'idle'
  | 'scraping'
  | 'scrapePreview'
  | 'fitChecking'
  | 'fitView'
  | 'tailoring'
  | 'resumeView'
  | 'networkingFetching'
  | 'networkingView'
  | 'logView'
  | 'done';

export interface ScrapeResult {
  raw_markdown: string;
  source: 'jina' | 'firecrawl';
}

export interface FitCheckResult {
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

export interface StudyItem {
  skill: string;
  why: string;
  prep: string;
  priority: 'H' | 'M' | 'L';
}

export interface TailorResult {
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

export interface NetworkingTarget {
  persona: string;
  why: string;
  linkedin_search_url: string;
}

export interface NetworkingResult {
  targets: NetworkingTarget[];
  draft_message: {
    subject: string;
    body: string;
  };
  email_guess_pattern: string;
}

export interface SheetPayload {
  company: string;
  role: string;
  location: string;
  url: string;
  fit_score: number;
  verdict: string;
  cover_letter_full: string;
  targets: NetworkingTarget[];
}
