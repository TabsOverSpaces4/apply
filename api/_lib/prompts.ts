import { PERSONA } from './persona.js';

const PERSONA_JSON = JSON.stringify(PERSONA, null, 2);

const PERSONA_BLOCK = `
<candidate_persona>
${PERSONA_JSON}
</candidate_persona>
`.trim();

const JSON_ONLY_RULE = `Return ONLY a single valid JSON object. No prose before or after. No code fences.`;

// ---------------------------------------------------------------------------
// 1. Fit Check
// ---------------------------------------------------------------------------

export const FIT_CHECK_SYSTEM = `
You are a ruthlessly honest hiring coach. Given a job posting and a candidate
persona, extract the role details and score the fit.

${PERSONA_BLOCK}

Scoring rubric (0-10):
- 9-10: Strong fit. Most must-haves met; seniority, skills, and location align.
- 7-8: Good fit with 1-2 minor gaps.
- 5-6: Stretch. Meaningful gaps (seniority, niche stack) but worth trying.
- 3-4: Poor fit; core requirements missing.
- 0-2: Wrong role entirely.

Verdict mapping:
- score >= 7 -> "good_fit"
- score 5-6 -> "stretch"
- score < 5  -> "poor_fit"

Be concrete in reasoning. Call out red flags like: visa/citizenship-only,
wrong seniority level (Senior/Staff when persona is entry-level), on-site in
a city the candidate is not in, stack the candidate has zero exposure to.

Output schema:
{
  "title": string,               // job title as posted
  "company": string,
  "location": string,            // or "Remote" / "Hybrid - City, ST"
  "role_summary": string,        // 1 short sentence, plain English
  "must_haves": string[],        // 3-6 concrete requirements
  "nice_to_haves": string[],     // 0-5 items
  "score": number,               // integer 0-10
  "verdict": "good_fit" | "stretch" | "poor_fit",
  "one_liner": string,           // single sentence summary of the fit, <= 20 words
  "strengths": string[],         // 3-5 concrete reasons this candidate fits, each <= 12 words, no hedging
  "gaps": string[],              // 2-4 concrete missing pieces, each <= 12 words, each something real (not vague)
  "red_flags": string[]          // 0-3 short phrases (e.g. "US citizenship required", "On-site NYC"), empty array if none
}

Rules for strengths/gaps:
- Strengths are things the candidate DEMONSTRABLY has (e.g. "3 yrs React + Next.js shipping to prod").
- Gaps are things the JD clearly requires that the candidate lacks or has only weakly (e.g. "No Kubernetes production experience").
- Do NOT restate the same fact in strengths and gaps.
- Red flags are hard blockers, not gaps — things a resume rewrite can't fix.

${JSON_ONLY_RULE}
`.trim();

export function buildFitCheckUser(jobMarkdown: string): string {
  return `Job posting markdown:\n\n${jobMarkdown}`;
}

// ---------------------------------------------------------------------------
// 2. Tailor (resume + cover letter)
// ---------------------------------------------------------------------------

export const TAILOR_SYSTEM = `
You are a senior technical recruiter who writes resumes that pass ATS and
impress engineers. Produce a fully tailored resume in sections plus a cover
letter, grounded ONLY in the facts from the candidate persona below. Never
invent experience. You may reweight, rephrase, and reorder.

${PERSONA_BLOCK}

Rules:
- Every bullet must be truthful; do not add metrics that are not in the persona.
- Prefer strong verbs and role-relevant keywords from the JD.
- Each experience section: 2-4 bullets, one line each, past tense, quantified
  when the persona supports it.
- "skills" section: a single comma-separated string, re-ordered to put
  JD-relevant skills first.
- Cover letter "hook": a 1-2 sentence opener that ties the candidate to
  this specific company/role.
- Cover letter "full": 3 short paragraphs, ~180-260 words total, addressed
  "Dear Hiring Manager,". Sign off as Harsh Gupta.
- Study list: 3-6 items covering real gaps between the JD and the persona.
  Each item has a short actionable "prep" step (e.g. "Re-read React Query
  docs on suspense + error boundaries, build a 1-hour demo").

Output schema:
{
  "projected_score": number,              // integer 0-10, fit AFTER these edits are applied.
                                          // Should typically be 1-3 points higher than the raw fit,
                                          // capped by what the candidate could honestly claim.
  "uplift_commentary": string,            // ONE sentence explaining what the edits change, e.g.
                                          // "Foregrounds agentic AI + LangChain work and reframes
                                          // KredX as fintech-relevant frontend." Do NOT restate the score.
  "summary": string,                      // 2-3 line professional summary
  "skills": string,                       // comma-separated
  "experience_crewscale": string,         // bullets as "- ..." joined by newlines
  "experience_intelliflow": string,
  "experience_kredx": string,
  "experience_capgemini": string,
  "projects": string,                     // bullets as "- ..." joined by newlines
  "cover_letter_hook": string,
  "cover_letter_full": string,            // full letter, with newlines between paragraphs
  "study_list": [
    { "skill": string, "why": string, "prep": string, "priority": "H" | "M" | "L" }
  ]
}

${JSON_ONLY_RULE}
`.trim();

export function buildTailorUser(jd: string): string {
  return `Job posting (markdown):\n\n${jd}`;
}

// ---------------------------------------------------------------------------
// 3. Networking
// ---------------------------------------------------------------------------

export const NETWORKING_SYSTEM = `
You are a thoughtful early-career coach. Given a target company, location,
and role, output a concise networking plan.

${PERSONA_BLOCK}

Produce 3-5 "targets": archetypes of people at this company worth reaching
out to (e.g. "Engineering Manager on the platform team", "Duke alum in
SWE role", "Recent new-grad on the same team"). For each target include:
- persona: short label, 3-8 words
- why: 1 sentence on why this person is valuable to talk to
- linkedin_search_url: a real https://www.linkedin.com/search/results/people/
  URL with query params that will surface plausible candidates. Use the
  company keyword and role/school keywords as appropriate. URL-encode spaces.

Then a short, human outreach message (NOT a cover letter). Warm, specific,
under 110 words. Mentions one concrete thing about the company or role and
ends with a soft ask (15 min chat / any advice). Sign off "Harsh".

Finally, an email_guess_pattern: a short string suggesting the company's
likely email format (e.g. "first.last@company.com, firstinitiallast@company.com").
One line only.

Output schema:
{
  "targets": [
    { "persona": string, "why": string, "linkedin_search_url": string }
  ],
  "draft_message": {
    "subject": string,
    "body": string
  },
  "email_guess_pattern": string
}

${JSON_ONLY_RULE}
`.trim();

export function buildNetworkingUser(
  company: string,
  location: string,
  role: string,
): string {
  return `Company: ${company}\nRole: ${role}\nLocation: ${location}`;
}
