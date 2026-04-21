import { motion, type Variants } from 'framer-motion';
import { useMemo } from 'react';
import { Check, FileText } from 'lucide-react';
import { Card } from './ui/Card';
import { StepNav } from './StepNav';
import { useFlowStore } from '../lib/store';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
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

function extractTitleLine(markdown: string): string {
  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) {
      return trimmed.replace(/^#+\s*/, '').slice(0, 140);
    }
    if (trimmed.length > 8) return trimmed.slice(0, 140);
  }
  return 'Job posting';
}

function firstParagraph(markdown: string, maxLen = 480): string {
  const normalized = markdown
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^[!#\-*_=]+$/.test(l))
    .filter((l) => !l.startsWith('!['))
    .filter((l) => !l.startsWith('[!['));

  const body = normalized.slice(1).join(' ');
  return body.length > maxLen ? body.slice(0, maxLen).trimEnd() + '…' : body;
}

export function ScrapePreview() {
  const scrapeResult = useFlowStore((s) => s.scrapeResult);
  const setStage = useFlowStore((s) => s.setStage);
  const reset = useFlowStore((s) => s.reset);

  const { title, snippet, charCount, source } = useMemo(() => {
    if (!scrapeResult) {
      return { title: '', snippet: '', charCount: 0, source: '' };
    }
    return {
      title: extractTitleLine(scrapeResult.raw_markdown),
      snippet: firstParagraph(scrapeResult.raw_markdown),
      charCount: scrapeResult.raw_markdown.length,
      source: scrapeResult.source,
    };
  }, [scrapeResult]);

  if (!scrapeResult) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-2xl mx-auto"
    >
      <motion.div variants={item} className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 14,
            delay: 0.15,
          }}
          className="mx-auto w-9 h-9 rounded-full bg-ink-900 flex items-center justify-center text-white"
        >
          <Check size={18} strokeWidth={2.25} />
        </motion.div>
        <p className="text-xs uppercase tracking-wider text-ink-500">
          Captured
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">
          {title}
        </h2>
      </motion.div>

      <motion.div variants={item}>
        <Card className="space-y-4">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <FileText size={14} strokeWidth={1.75} />
              {charCount.toLocaleString()} characters
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-500/80">
              via {source}
            </span>
          </div>

          <div className="relative">
            <p className="text-sm text-ink-700 leading-relaxed">{snippet}</p>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, white 90%)',
              }}
            />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <StepNav
          onBack={reset}
          onContinue={() => setStage('fitChecking')}
          continueLabel="Check fit"
        />
      </motion.div>
    </motion.div>
  );
}
