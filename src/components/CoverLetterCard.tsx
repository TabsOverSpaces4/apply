import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const spring = { type: 'spring' as const, stiffness: 260, damping: 30 };

interface CoverLetterCardProps {
  content: string;
}

export function CoverLetterCard({ content }: CoverLetterCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [content]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-ink-700 tracking-tight">
            Cover Letter
          </h3>
          <div className="whitespace-pre-wrap text-sm text-ink-900 leading-relaxed">
            {content}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check size={16} strokeWidth={1.75} className="mr-1.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} strokeWidth={1.75} className="mr-1.5" />
                  Copy full letter
                </>
              )}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              <Download size={16} strokeWidth={1.75} className="mr-1.5" />
              Download .txt
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
