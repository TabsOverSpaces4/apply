import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/cn';

interface CopyBlockProps {
  label: string;
  content: string;
  className?: string;
}

export function CopyBlock({ label, content, className }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [content]);

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-sm font-semibold text-ink-700 tracking-tight">
        {label}
      </h3>
      <div className="relative group">
        <pre className="whitespace-pre-wrap bg-ink-100 rounded-xl p-4 font-mono text-sm text-ink-900 leading-relaxed">
          {content}
        </pre>
        <button
          onClick={handleCopy}
          className={cn(
            'absolute top-3 right-3 p-1.5 rounded-lg transition-all',
            'opacity-0 group-hover:opacity-100',
            copied
              ? 'bg-ink-900 text-white'
              : 'bg-white/80 hover:bg-white text-ink-500 hover:text-ink-900 shadow-sm',
          )}
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check size={16} strokeWidth={1.75} />
          ) : (
            <Copy size={16} strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}
