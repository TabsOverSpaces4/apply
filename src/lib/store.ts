import { create } from 'zustand';
import type {
  FlowStage,
  ScrapeResult,
  FitCheckResult,
  TailorResult,
  NetworkingResult,
} from '../types';

interface FlowState {
  stage: FlowStage;
  url: string;
  scrapeResult: ScrapeResult | null;
  fitResult: FitCheckResult | null;
  tailorResult: TailorResult | null;
  networkingResult: NetworkingResult | null;
  sheetLogged: boolean;
  error: string | null;

  setUrl: (url: string) => void;
  setStage: (stage: FlowStage) => void;
  setScrapeResult: (result: ScrapeResult) => void;
  setFitResult: (result: FitCheckResult) => void;
  setTailorResult: (result: TailorResult) => void;
  setNetworkingResult: (result: NetworkingResult) => void;
  setSheetLogged: (logged: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  goBack: () => void;
}

const initialState = {
  stage: 'idle' as FlowStage,
  url: '',
  scrapeResult: null,
  fitResult: null,
  tailorResult: null,
  networkingResult: null,
  sheetLogged: false,
  error: null,
};

/**
 * Stages grouped by the view the user is looking at. Back navigation rewinds
 * to the previous view — never to a loading stage. We don't re-fetch on back
 * because results are cached in the store.
 */
const VIEW_ORDER: FlowStage[] = [
  'scrapePreview',
  'fitView',
  'resumeView',
  'networkingView',
  'logView',
];

function previousView(stage: FlowStage): FlowStage | null {
  const idx = VIEW_ORDER.indexOf(stage);
  if (idx > 0) return VIEW_ORDER[idx - 1];
  return null;
}

export const useFlowStore = create<FlowState>((set) => ({
  ...initialState,

  setUrl: (url) => set({ url }),
  setStage: (stage) => set({ stage }),
  setScrapeResult: (result) => set({ scrapeResult: result }),
  setFitResult: (result) => set({ fitResult: result }),
  setTailorResult: (result) => set({ tailorResult: result }),
  setNetworkingResult: (result) => set({ networkingResult: result }),
  setSheetLogged: (logged) => set({ sheetLogged: logged }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
  goBack: () =>
    set((state) => {
      const prev = previousView(state.stage);
      return prev ? { stage: prev } : {};
    }),
}));
