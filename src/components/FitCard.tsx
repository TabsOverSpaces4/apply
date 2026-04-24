import { motion, type Variants } from 'framer-motion';
import { AlertTriangle, Check, Minus } from 'lucide-react';
import { Card } from './ui/Card';
import { StepNav } from './StepNav';
import { cn } from '../lib/cn';
import { useFlowStore } from '../lib/store';
import { useCountUp } from '../lib/useCountUp';
import type { FitCheckResult } from '../types';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

const VERDICT_COPY: Record<
  FitCheckResult['verdict'],
  { label: string; tone: string }
> = {
  good_fit: {
    label: 'Strong fit',
    tone: 'bg-ink-900 text-white',
  },
  stretch: {
    label: 'Stretch',
    tone: 'bg-ink-100 text-ink-900 border border-ink-300/60',
  },
  poor_fit: {
    label: 'Poor fit',
    tone: 'bg-ink-100 text-ink-500 border border-ink-300/60',
  },
};

interface FitCardProps {
  data: FitCheckResult;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const animated = useCountUp(score, { duration: 1.1, delay: 0.15 });
  const pct = Math.max(0, Math.min(10, animated)) / 10;
  const dashOffset = circumference * (1 - pct);

  return (
    <motion.div
      variants={item}
      className="relative w-28 h-28 shrink-0"
    >
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
        <circle
          cx="56"
          cy="56"
          r={radius}
          stroke="currentColor"
          className="text-ink-300/50"
          strokeWidth="7"
          fill="none"
        />
        <circle
          cx="56"
          cy="56"
          r={radius}
          stroke="currentColor"
          className="text-ink-900"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums text-ink-900">
          {Math.round(animated)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-ink-500">
          of 10
        </span>
      </div>
    </motion.div>
  );
}

function StrengthList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <motion.div variants={item} className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-700">
        Why it fits
      </h3>
      <motion.ul
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
        }}
        className="space-y-1.5"
      >
        {items.map((text, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, x: -8 },
              show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
            }}
            className="flex items-start gap-2 text-sm text-ink-900 leading-snug"
          >
            <Check
              size={14}
              strokeWidth={2.25}
              className="mt-0.5 shrink-0 text-ink-900"
            />
            <span>{text}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

function GapList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <motion.div variants={item} className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-700">
        Gaps
      </h3>
      <motion.ul
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
        }}
        className="space-y-1.5"
      >
        {items.map((text, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, x: -8 },
              show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
            }}
            className="flex items-start gap-2 text-sm text-ink-700 leading-snug"
          >
            <Minus
              size={14}
              strokeWidth={2.25}
              className="mt-0.5 shrink-0 text-ink-500"
            />
            <span>{text}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

export function FitCard({ data }: FitCardProps) {
  const setStage = useFlowStore((s) => s.setStage);
  const goBack = useFlowStore((s) => s.goBack);
  const reset = useFlowStore((s) => s.reset);

  const verdict = VERDICT_COPY[data.verdict];
  const isPoorFit = data.verdict === 'poor_fit';

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-2xl mx-auto"
    >
      <Card className="space-y-6">
        <div className="flex items-start gap-5">
          <ScoreRing score={data.score} />

          <motion.div variants={item} className="flex-1 space-y-2 min-w-0">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider',
                verdict.tone,
              )}
            >
              {verdict.label}
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-ink-900 leading-snug">
              {data.title}
            </h2>
            <p className="text-xs text-ink-500">
              {data.company}
              {data.location ? ` · ${data.location}` : ''}
            </p>
            <p className="text-sm text-ink-700 leading-relaxed pt-1">
              {data.one_liner}
            </p>
          </motion.div>
        </div>

        <motion.div variants={item} className="h-px bg-ink-300/40" />

        <div className="grid sm:grid-cols-2 gap-6">
          <StrengthList items={data.strengths} />
          <GapList items={data.gaps} />
        </div>

        {data.red_flags.length > 0 && (
          <>
            <motion.div variants={item} className="h-px bg-ink-300/40" />
            <motion.div variants={item} className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                Hard blockers
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.red_flags.map((flag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs text-papaya-600 bg-papaya-50 border border-papaya-200/70 rounded-md px-2 py-1"
                  >
                    <AlertTriangle size={12} strokeWidth={1.75} />
                    {flag}
                  </span>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </Card>

      {isPoorFit && (
        <motion.p
          variants={item}
          className="text-xs text-ink-500 text-center max-w-md mx-auto leading-relaxed -mt-2"
        >
          Targeting an internship or co-op? You can still tailor — gaps will
          be added to your study plan.
        </motion.p>
      )}

      <motion.div variants={item}>
        <StepNav
          onBack={() => goBack()}
          onContinue={() => setStage('tailoring')}
          continueLabel={isPoorFit ? 'Tailor anyway' : 'Tailor resume'}
          onSecondary={isPoorFit ? () => reset() : undefined}
          secondaryLabel={isPoorFit ? 'Start over' : undefined}
        />
      </motion.div>
    </motion.div>
  );
}
