import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';

interface StepNavProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  onSecondary?: () => void;
  secondaryLabel?: string;
  className?: string;
}

export function StepNav({
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled,
  onSecondary,
  secondaryLabel,
  className,
}: StepNavProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between max-w-2xl mx-auto pt-4 gap-3',
        className,
      )}
    >
      {onBack ? (
        <motion.button
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
          Back
        </motion.button>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-3">
        {onSecondary && secondaryLabel && (
          <motion.button
            onClick={onSecondary}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'inline-flex items-center h-10 px-4 rounded-full',
              'text-sm font-medium text-ink-700',
              'border border-ink-300/70 bg-white',
              'hover:text-ink-900 hover:border-ink-500/70',
            )}
          >
            {secondaryLabel}
          </motion.button>
        )}

        {onContinue && (
          <motion.button
            onClick={onContinue}
            disabled={continueDisabled}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 24px -8px rgba(10,10,10,0.4)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'group inline-flex items-center gap-1.5 h-10 px-5 rounded-full',
              'bg-ink-900 text-white text-sm font-medium',
              'hover:bg-ink-700',
              'disabled:opacity-40 disabled:pointer-events-none',
            )}
          >
            {continueLabel}
            <motion.span
              initial={false}
              className="flex"
            >
              <ChevronRight
                size={16}
                strokeWidth={2}
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              />
            </motion.span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
