import { motion } from 'framer-motion';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Card } from './ui/Card';
import { StepNav } from './StepNav';
import { useFlowStore } from '../lib/store';
import type { NetworkingResult } from '../types';

const spring = { type: 'spring' as const, stiffness: 260, damping: 30 };

interface NetworkingCardProps {
  data: NetworkingResult;
}

export function NetworkingCard({ data }: NetworkingCardProps) {
  const [copied, setCopied] = useState(false);
  const setStage = useFlowStore((s) => s.setStage);
  const goBack = useFlowStore((s) => s.goBack);

  const handleCopyMessage = useCallback(async () => {
    await navigator.clipboard.writeText(data.draft_message.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [data.draft_message.body]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-1">
        <p className="text-xs uppercase tracking-wider text-ink-500">
          Networking plan
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">
          People worth reaching out to
        </h2>
      </div>

      <Card className="space-y-3">
        {data.targets.map((target, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-3 p-3 bg-ink-100 rounded-xl"
          >
            <div className="space-y-0.5 min-w-0">
              <p className="text-sm font-medium text-ink-900">
                {target.persona}
              </p>
              <p className="text-xs text-ink-500">{target.why}</p>
            </div>
            <a
              href={target.linkedin_search_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 p-1.5 rounded-lg hover:bg-white transition-colors"
              aria-label="Open LinkedIn search"
            >
              <ExternalLink
                size={16}
                strokeWidth={1.75}
                className="text-ink-500"
              />
            </a>
          </div>
        ))}
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-700">
            Draft message
          </p>
          <button
            onClick={handleCopyMessage}
            className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900 transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} strokeWidth={1.75} />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} strokeWidth={1.75} />
                Copy
              </>
            )}
          </button>
        </div>
        {data.draft_message.subject && (
          <p className="text-xs text-ink-500">
            Subject: <span className="text-ink-900">{data.draft_message.subject}</span>
          </p>
        )}
        <pre className="whitespace-pre-wrap bg-ink-100 rounded-xl p-4 font-mono text-sm text-ink-900 leading-relaxed">
          {data.draft_message.body}
        </pre>
      </Card>

      <p className="text-xs text-ink-500 text-center">
        Likely email pattern: {data.email_guess_pattern}
      </p>

      <StepNav
        onBack={() => goBack()}
        onContinue={() => setStage('logView')}
        continueLabel="Log this application"
      />
    </motion.div>
  );
}
