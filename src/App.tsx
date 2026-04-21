import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { RotateCcw } from 'lucide-react';
import { Stepper } from './components/Stepper';
import { URLInput } from './components/URLInput';
import { ScrapePreview } from './components/ScrapePreview';
import { FitCard } from './components/FitCard';
import { ResumeView } from './components/ResumeView';
import { NetworkingCard } from './components/NetworkingCard';
import { SheetLogger } from './components/SheetLogger';
import { LoadingPane } from './components/LoadingPane';
import { Button } from './components/ui/Button';
import { useFlowStore } from './lib/store';
import { useApplyFlow } from './lib/useApplyFlow';

const PAGE_EASE = [0.22, 1, 0.36, 1] as const;

const LOADING_COPY: Record<string, string[]> = {
  scraping: [
    'Reading the posting…',
    'Extracting title, company, and requirements…',
  ],
  fitChecking: [
    'Scoring the fit…',
    'Weighing your skills against the must-haves…',
    'Looking for red flags…',
  ],
  tailoring: [
    'Rewriting your summary…',
    'Reweighting experience bullets…',
    'Drafting the cover letter…',
  ],
  networkingFetching: [
    'Finding the right people to reach out to…',
    'Drafting a first-touch message…',
  ],
};

function DonePane() {
  const reset = useFlowStore((s) => s.reset);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: PAGE_EASE }}
      className="flex flex-col items-center gap-5 py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 14,
          delay: 0.1,
        }}
        className="w-14 h-14 rounded-full bg-ink-900 flex items-center justify-center text-white text-2xl"
      >
        ✓
      </motion.div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">
          Application logged
        </h2>
        <p className="text-sm text-ink-500">
          Resume, cover letter, and networking plan are ready in your sheet.
        </p>
      </div>
      <Button variant="secondary" onClick={reset}>
        <RotateCcw size={16} strokeWidth={1.75} className="mr-2" />
        Start a new application
      </Button>
    </motion.div>
  );
}

function StageRenderer() {
  const stage = useFlowStore((s) => s.stage);
  const fitResult = useFlowStore((s) => s.fitResult);
  const tailorResult = useFlowStore((s) => s.tailorResult);
  const networkingResult = useFlowStore((s) => s.networkingResult);

  switch (stage) {
    case 'idle':
      return <URLInput />;

    case 'scraping':
    case 'fitChecking':
    case 'tailoring':
    case 'networkingFetching':
      return <LoadingPane messages={LOADING_COPY[stage]} />;

    case 'scrapePreview':
      return <ScrapePreview />;

    case 'fitView':
      return fitResult ? <FitCard data={fitResult} /> : null;

    case 'resumeView':
      return tailorResult ? <ResumeView data={tailorResult} /> : null;

    case 'networkingView':
      return networkingResult ? <NetworkingCard data={networkingResult} /> : null;

    case 'logView':
      return <SheetLogger />;

    case 'done':
      return <DonePane />;

    default:
      return null;
  }
}

export default function App() {
  useApplyFlow();

  const stage = useFlowStore((s) => s.stage);
  const reset = useFlowStore((s) => s.reset);
  const showChrome = stage !== 'idle';

  return (
    <div className="min-h-screen bg-ink-100">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid rgba(210,210,215,0.6)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            color: '#0A0A0A',
            fontSize: '14px',
          },
        }}
      />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <AnimatePresence>
          {showChrome && (
            <motion.header
              key="header"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: PAGE_EASE }}
              className="flex items-center justify-between mb-10 gap-4"
            >
              <div className="shrink-0 text-sm font-semibold tracking-tight text-ink-900">
                apply
              </div>
              <div className="flex-1 flex justify-center">
                <Stepper stage={stage} />
              </div>
              <button
                onClick={reset}
                className="shrink-0 p-2 rounded-lg hover:bg-ink-300/30 transition-colors text-ink-500 hover:text-ink-900"
                aria-label="Start over"
              >
                <RotateCcw size={16} strokeWidth={1.75} />
              </button>
            </motion.header>
          )}
        </AnimatePresence>

        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: PAGE_EASE }}
              className={
                stage === 'idle' ? 'flex items-center min-h-[60vh]' : ''
              }
            >
              <div className="w-full">
                <StageRenderer />
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
