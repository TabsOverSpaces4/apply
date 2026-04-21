import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { CopyBlock } from './ui/CopyBlock';
import { StepNav } from './StepNav';
import { CoverLetterCard } from './CoverLetterCard';
import { useFlowStore } from '../lib/store';
import { useCountUp } from '../lib/useCountUp';
import type { TailorResult } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

const SECTIONS: { key: keyof TailorResult; label: string }[] = [
  { key: 'summary', label: 'Summary' },
  { key: 'skills', label: 'Skills' },
  { key: 'experience_crewscale', label: 'Experience — Crewscale' },
  { key: 'experience_intelliflow', label: 'Experience — Intelliflow.AI' },
  { key: 'experience_kredx', label: 'Experience — KredX' },
  { key: 'experience_capgemini', label: 'Experience — Capgemini' },
  { key: 'projects', label: 'Projects' },
  { key: 'cover_letter_hook', label: 'Cover Letter Hook' },
];

interface ResumeViewProps {
  data: TailorResult;
}

function ScoreComparison({
  baseline,
  projected,
  commentary,
}: {
  baseline: number | null;
  projected: number;
  commentary: string;
}) {
  const baselineAnim = useCountUp(baseline ?? 0, { duration: 0.9, delay: 0.15 });
  const projectedAnim = useCountUp(projected, { duration: 1.2, delay: 0.55 });

  return (
    <Card className="space-y-5">
      <p className="text-xs uppercase tracking-wider text-ink-500">
        Projected fit with these edits applied
      </p>

      <div className="flex items-end gap-4">
        {baseline !== null && (
          <>
            <div className="flex flex-col">
              <span className="text-xs text-ink-500">Baseline</span>
              <span className="text-2xl font-semibold tabular-nums text-ink-500 line-through decoration-ink-300">
                {Math.round(baselineAnim)}/10
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
              className="mb-2"
            >
              <ArrowRight size={20} strokeWidth={1.75} className="text-ink-300" />
            </motion.div>
          </>
        )}

        <div className="flex flex-col">
          <span className="text-xs text-ink-500">If edits applied</span>
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 14,
              delay: 0.55,
            }}
            className="text-5xl font-semibold tabular-nums text-ink-900 origin-left"
          >
            {Math.round(projectedAnim)}
            <span className="text-2xl text-ink-500 font-medium">/10</span>
          </motion.span>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden relative">
        {baseline !== null && (
          <motion.div
            className="absolute inset-y-0 left-0 bg-ink-300 rounded-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: baseline / 10 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            style={{ width: '100%' }}
          />
        )}
        <motion.div
          className="absolute inset-y-0 left-0 bg-ink-900 rounded-full origin-left"
          initial={{ scaleX: baseline !== null ? baseline / 10 : 0 }}
          animate={{ scaleX: projected / 10 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
          style={{ width: '100%' }}
        />
      </div>

      <p className="text-sm text-ink-700 leading-relaxed">{commentary}</p>

      <p className="text-[11px] text-ink-500 leading-relaxed">
        This score is what you'd reach <em>after</em> actually applying these
        changes to your resume and cover letter — it's not your current fit.
      </p>
    </Card>
  );
}

export function ResumeView({ data }: ResumeViewProps) {
  const setStage = useFlowStore((s) => s.setStage);
  const goBack = useFlowStore((s) => s.goBack);
  const fitResult = useFlowStore((s) => s.fitResult);

  const baseline = fitResult?.score ?? null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-2xl mx-auto"
    >
      <motion.div variants={item}>
        <ScoreComparison
          baseline={baseline}
          projected={data.projected_score}
          commentary={data.uplift_commentary}
        />
      </motion.div>

      <motion.div variants={item} className="space-y-6">
        {SECTIONS.map(({ key, label }) => (
          <CopyBlock key={key} label={label} content={data[key] as string} />
        ))}

        {data.study_list.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-ink-700 tracking-tight">
              Study list
            </h3>
            <ul className="space-y-1.5">
              {data.study_list.map((studyItem, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      studyItem.priority === 'H'
                        ? 'bg-ink-900'
                        : studyItem.priority === 'M'
                          ? 'bg-ink-500'
                          : 'bg-ink-300'
                    }`}
                  />
                  <span className="text-ink-900">
                    <span className="font-medium">{studyItem.skill}</span>
                    <span className="text-ink-500"> — {studyItem.why}</span>
                    <span className="text-ink-500 block text-xs">
                      {studyItem.prep}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      <motion.div variants={item}>
        <CoverLetterCard content={data.cover_letter_full} />
      </motion.div>

      <motion.div variants={item}>
        <StepNav
          onBack={() => goBack()}
          onContinue={() => setStage('networkingFetching')}
          continueLabel="Build networking plan"
        />
      </motion.div>
    </motion.div>
  );
}
