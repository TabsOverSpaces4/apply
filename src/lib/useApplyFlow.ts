import { useEffect } from 'react';
import { toast } from 'sonner';
import { useFlowStore } from './store';
import { scrapeJob, fitCheck, tailorResume, getNetworking } from './api';

/**
 * Drives stage transitions. One effect per loading stage; each fires its API
 * call and advances to the matching view when done. Results are stored so Back
 * navigation is instant and never re-fetches.
 */
export function useApplyFlow() {
  const stage = useFlowStore((s) => s.stage);
  const url = useFlowStore((s) => s.url);
  const scrapeResult = useFlowStore((s) => s.scrapeResult);
  const fitResult = useFlowStore((s) => s.fitResult);
  const tailorResult = useFlowStore((s) => s.tailorResult);
  const networkingResult = useFlowStore((s) => s.networkingResult);
  const setStage = useFlowStore((s) => s.setStage);
  const setScrapeResult = useFlowStore((s) => s.setScrapeResult);
  const setFitResult = useFlowStore((s) => s.setFitResult);
  const setTailorResult = useFlowStore((s) => s.setTailorResult);
  const setNetworkingResult = useFlowStore((s) => s.setNetworkingResult);
  const reset = useFlowStore((s) => s.reset);

  // Scraping ----------------------------------------------------------------
  useEffect(() => {
    if (stage !== 'scraping' || !url) return;
    if (scrapeResult) { setStage('scrapePreview'); return; }

    let cancelled = false;
    (async () => {
      try {
        const result = await scrapeJob(url);
        if (cancelled) return;
        setScrapeResult(result);
        setStage('scrapePreview');
      } catch (err) {
        if (cancelled) return;
        toast.error(`Couldn't read the posting: ${(err as Error).message}`);
        reset();
      }
    })();
    return () => { cancelled = true; };
  }, [stage, url, scrapeResult, setScrapeResult, setStage, reset]);

  // Fit check ---------------------------------------------------------------
  useEffect(() => {
    if (stage !== 'fitChecking' || !scrapeResult) return;
    if (fitResult) { setStage('fitView'); return; }

    let cancelled = false;
    (async () => {
      try {
        const result = await fitCheck(scrapeResult.raw_markdown);
        if (cancelled) return;
        setFitResult(result);
        setStage('fitView');
      } catch (err) {
        if (cancelled) return;
        toast.error(`Fit check failed: ${(err as Error).message}`);
        reset();
      }
    })();
    return () => { cancelled = true; };
  }, [stage, scrapeResult, fitResult, setFitResult, setStage, reset]);

  // Tailor ------------------------------------------------------------------
  useEffect(() => {
    if (stage !== 'tailoring' || !scrapeResult) return;
    if (tailorResult) { setStage('resumeView'); return; }

    let cancelled = false;
    (async () => {
      try {
        const result = await tailorResume(scrapeResult.raw_markdown);
        if (cancelled) return;
        setTailorResult(result);
        setStage('resumeView');
      } catch (err) {
        if (cancelled) return;
        toast.error(`Tailoring failed: ${(err as Error).message}`);
        reset();
      }
    })();
    return () => { cancelled = true; };
  }, [stage, scrapeResult, tailorResult, setTailorResult, setStage, reset]);

  // Networking --------------------------------------------------------------
  useEffect(() => {
    if (stage !== 'networkingFetching' || !fitResult) return;
    if (networkingResult) { setStage('networkingView'); return; }

    let cancelled = false;
    (async () => {
      try {
        const result = await getNetworking(
          fitResult.company,
          fitResult.location,
          fitResult.title,
        );
        if (cancelled) return;
        setNetworkingResult(result);
        setStage('networkingView');
      } catch (err) {
        if (cancelled) return;
        toast.error(
          `Networking plan failed: ${(err as Error).message}. Skipping.`,
        );
        setStage('logView');
      }
    })();
    return () => { cancelled = true; };
  }, [stage, fitResult, networkingResult, setNetworkingResult, setStage]);
}
