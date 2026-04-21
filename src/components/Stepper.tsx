import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import type { FlowStage } from '../types';

const STEPS = [
  {
    key: 'link',
    label: 'Link',
    viewStages: ['idle', 'scrapePreview'] as FlowStage[],
    loadingStages: ['scraping'] as FlowStage[],
  },
  {
    key: 'fit',
    label: 'Fit',
    viewStages: ['fitView'] as FlowStage[],
    loadingStages: ['fitChecking'] as FlowStage[],
  },
  {
    key: 'resume',
    label: 'Resume',
    viewStages: ['resumeView'] as FlowStage[],
    loadingStages: ['tailoring'] as FlowStage[],
  },
  {
    key: 'network',
    label: 'Network',
    viewStages: ['networkingView'] as FlowStage[],
    loadingStages: ['networkingFetching'] as FlowStage[],
  },
  {
    key: 'log',
    label: 'Log',
    viewStages: ['logView', 'done'] as FlowStage[],
    loadingStages: [] as FlowStage[],
  },
] as const;

function getActiveIndex(stage: FlowStage): number {
  for (let i = 0; i < STEPS.length; i++) {
    if (
      STEPS[i].viewStages.includes(stage) ||
      STEPS[i].loadingStages.includes(stage)
    ) {
      return i;
    }
  }
  return 0;
}

function isLoadingStage(stage: FlowStage): boolean {
  return STEPS.some((s) =>
    (s.loadingStages as readonly FlowStage[]).includes(stage),
  );
}

interface StepperProps {
  stage: FlowStage;
}

export function Stepper({ stage }: StepperProps) {
  const activeIdx = getActiveIndex(stage);
  const loading = isLoadingStage(stage);

  return (
    <nav
      className="flex flex-col items-stretch gap-2.5 w-full max-w-md"
      aria-label="Application progress"
    >
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => {
          const isActive = i === activeIdx;
          const isCompleted = i < activeIdx;
          const isFilled = isCompleted || isActive;

          return (
            <div
              key={i}
              className="relative flex-1 h-1.5 rounded-full overflow-hidden bg-ink-300/40"
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-ink-900 rounded-full origin-left"
                initial={false}
                animate={{ scaleX: isFilled ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%' }}
              />
              {isActive && loading && (
                <motion.div
                  className="absolute inset-y-0 w-1/2"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)',
                  }}
                  initial={{ x: '-120%' }}
                  animate={{ x: '260%' }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[11px] tracking-wider uppercase">
        {STEPS.map((step, i) => {
          const isActive = i === activeIdx;
          const isCompleted = i < activeIdx;
          return (
            <motion.span
              key={step.key}
              animate={{
                scale: isActive ? 1.06 : 1,
                color: isActive
                  ? '#0A0A0A'
                  : isCompleted
                    ? '#6E6E73'
                    : '#D2D2D7',
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'flex-1 text-center origin-center',
                isActive ? 'font-semibold' : 'font-medium',
              )}
            >
              {step.label}
            </motion.span>
          );
        })}
      </div>
    </nav>
  );
}
