import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sheet, Check, Clipboard } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { StepNav } from './StepNav';
import { useFlowStore } from '../lib/store';
import type { SheetPayload } from '../types';

const spring = { type: 'spring' as const, stiffness: 260, damping: 30 };

export function SheetLogger() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const url = useFlowStore((s) => s.url);
  const fitResult = useFlowStore((s) => s.fitResult);
  const tailorResult = useFlowStore((s) => s.tailorResult);
  const networkingResult = useFlowStore((s) => s.networkingResult);
  const setStage = useFlowStore((s) => s.setStage);
  const goBack = useFlowStore((s) => s.goBack);
  const setSheetLogged = useFlowStore((s) => s.setSheetLogged);

  const buildPayload = useCallback((): SheetPayload | null => {
    if (!fitResult || !tailorResult) return null;
    return {
      company: fitResult.company,
      role: fitResult.title,
      location: fitResult.location,
      url,
      fit_score: fitResult.score,
      verdict: fitResult.verdict,
      cover_letter_full: tailorResult.cover_letter_full,
      targets: networkingResult?.targets ?? [],
    };
  }, [url, fitResult, tailorResult, networkingResult]);

  const handleLog = useCallback(async () => {
    const payload = buildPayload();
    if (!payload) return;

    const webhookUrl = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      setError('Sheets webhook URL not configured.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/save-to-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, webhookUrl }),
      });
      if (!res.ok) throw new Error('Webhook failed');
      setSaved(true);
      setSheetLogged(true);
      setStage('done');
    } catch {
      setError('Failed to log. Copy the data below as a fallback.');
    } finally {
      setSaving(false);
    }
  }, [buildPayload, setStage, setSheetLogged]);

  const handleCopyFallback = useCallback(async () => {
    const payload = buildPayload();
    if (payload) {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    }
  }, [buildPayload]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="space-y-6 max-w-md mx-auto"
    >
      <Card className="text-center space-y-4">
        <div className="mx-auto w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center">
          <Sheet size={20} strokeWidth={1.75} className="text-ink-700" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold tracking-tight">
            Log to Google Sheets
          </h3>
          <p className="text-sm text-ink-500">
            Save this application to your tracking sheet.
          </p>
        </div>

        {saved ? (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-ink-900">
            <Check size={18} strokeWidth={2} />
            Logged successfully
          </div>
        ) : (
          <Button onClick={handleLog} disabled={saving}>
            {saving ? (
              <>
                <Spinner size={16} className="text-white mr-2" />
                Saving…
              </>
            ) : (
              'Log application'
            )}
          </Button>
        )}

        {error && (
          <div className="space-y-2">
            <p className="text-sm text-ink-700">{error}</p>
            <Button variant="secondary" size="sm" onClick={handleCopyFallback}>
              <Clipboard size={16} strokeWidth={1.75} className="mr-1.5" />
              Copy JSON to clipboard
            </Button>
          </div>
        )}
      </Card>

      {!saved && <StepNav onBack={() => goBack()} />}
    </motion.div>
  );
}
