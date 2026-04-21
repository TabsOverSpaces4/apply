import { useState, useCallback, type KeyboardEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Spinner } from './ui/Spinner';
import { useFlowStore } from '../lib/store';

const EASE = [0.22, 1, 0.36, 1] as const;

export function URLInput() {
  const [input, setInput] = useState('');
  const stage = useFlowStore((s) => s.stage);
  const setUrl = useFlowStore((s) => s.setUrl);
  const setStage = useFlowStore((s) => s.setStage);
  const isLoading = stage === 'scraping';

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setUrl(trimmed);
    setStage('scraping');
  }, [input, setUrl, setStage]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="relative flex flex-col items-center w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full space-y-8 text-center"
      >
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-6xl sm:text-7xl font-semibold tracking-tight text-ink-900"
          >
            apply
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
            className="text-ink-500 text-sm max-w-md mx-auto"
          >
            Paste a job posting. Get a tailored resume, cover letter,
            and a short list of people worth reaching out to.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://jobs.lever.co/company/…"
            disabled={isLoading}
            className="flex-1 h-12 px-4 bg-white border border-ink-300/60 rounded-full text-ink-900 placeholder:text-ink-500/60 text-sm focus:outline-none focus:ring-4 focus:ring-ink-900/10 focus:border-ink-700 transition-all disabled:opacity-60"
          />
          <motion.button
            whileHover={!isLoading && input.trim() ? { scale: 1.05, boxShadow: '0 10px 28px -10px rgba(10,10,10,0.5)' } : {}}
            whileTap={!isLoading && input.trim() ? { scale: 0.95 } : {}}
            transition={{ duration: 0.2, ease: EASE }}
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            aria-label="Submit"
            className="h-12 w-12 shrink-0 rounded-full bg-ink-900 hover:bg-ink-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {isLoading ? (
              <Spinner size={18} className="text-white" />
            ) : (
              <ArrowRight size={18} strokeWidth={1.75} />
            )}
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-xs text-ink-500/80"
        >
          ⌘ + ⏎ to submit
        </motion.p>
      </motion.div>
    </div>
  );
}
