import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type {
  AllocationPreset,
  AppState,
  CFAGroup,
  Currency,
  DonorContribution,
  MRVBatch,
  MRVSurvey,
  PayoutRecord,
  Project,
  RegulationItem,
  Role,
} from "../types";
import {
  DEFAULT_ALLOCATION,
  INITIAL_BATCHES,
  INITIAL_CFAS,
  INITIAL_CONTRIBUTIONS,
  INITIAL_PROJECTS,
  INITIAL_REGULATIONS,
} from "../data/mockData";

const STORAGE_KEY = "m-miti-state-v1";

interface PayoutInput {
  projectId: string;
  batchId: string;
  amountKsh: number;
  reason: string;
  recipient: string;
}

interface AppContextValue {
  state: AppState;
  setRole: (role: Role) => void;
  setCurrency: (currency: Currency) => void;
  setAllocation: (allocation: AllocationPreset) => void;
  updateRegulation: (id: string, status: RegulationItem["status"]) => void;
  addContribution: (c: Omit<DonorContribution, "id">) => void;
  addBatch: (b: Omit<MRVBatch, "id" | "surveys">) => void;
  addSurvey: (batchId: string, survey: Omit<MRVSurvey, "id">) => void;
  triggerPayout: (input: PayoutInput) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadInitialState(): AppState {
  if (typeof window === "undefined") {
    return createFreshState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        return parsed;
      }
    }
  } catch {
    // corrupted storage falls back to fresh seed
  }
  return createFreshState();
}

function createFreshState(): AppState {
  return {
    role: "public",
    currency: "KES",
    projects: INITIAL_PROJECTS.map((p) => ({ ...p, ledger: [...p.ledger], milestones: [...p.milestones], speciesMix: [...p.speciesMix] })),
    contributions: INITIAL_CONTRIBUTIONS.map((c) => ({ ...c })),
    batches: INITIAL_BATCHES.map((b) => ({ ...b, surveys: b.surveys.map((s) => ({ ...s })) })),
    cfas: INITIAL_CFAS.map((c) => ({ ...c, payoutHistory: c.payoutHistory.map((p) => ({ ...p })) })),
    regulations: INITIAL_REGULATIONS.map((r) => ({ ...r })),
    allocation: { ...DEFAULT_ALLOCATION },
    payouts: INITIAL_CFAS.flatMap((c) => c.payoutHistory.map((p) => ({ ...p }))),
  };
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or blocked; app keeps working in-memory
    }
  }, [state]);

  const value = useMemo<AppContextValue>(() => {
    const setRole = (role: Role) => setState((s) => ({ ...s, role }));
    const setCurrency = (currency: Currency) => setState((s) => ({ ...s, currency }));

    const setAllocation = (allocation: AllocationPreset) =>
      setState((s) => ({ ...s, allocation }));

    const updateRegulation = (id: string, status: RegulationItem["status"]) =>
      setState((s) => ({
        ...s,
        regulations: s.regulations.map((r) => (r.id === id ? { ...r, status } : r)),
      }));

    const addContribution = (c: Omit<DonorContribution, "id">) =>
      setState((s) => {
        const contribution: DonorContribution = { ...c, id: uid("dc") };
        return {
          ...s,
          contributions: [contribution, ...s.contributions],
          projects: s.projects.map((p) =>
            p.id === c.projectId
              ? { ...p, fundedKsh: p.fundedKsh + c.amountKsh, plantedTrees: p.plantedTrees + c.treesAttributed }
              : p,
          ),
        };
      });

    const addBatch = (b: Omit<MRVBatch, "id" | "surveys">) =>
      setState((s) => {
        const batch: MRVBatch = { ...b, id: uid("mrv"), surveys: [] };
        return {
          ...s,
          batches: [batch, ...s.batches],
          projects: s.projects.map((p) =>
            p.id === b.projectId ? { ...p, plantedTrees: p.plantedTrees + b.plantedCount } : p,
          ),
          cfas: s.cfas.map((c) => (c.id === batchNurseryCfa(s, b.projectId) ? { ...c, plantedBatches: c.plantedBatches + 1 } : c)),
        };
      });

    const addSurvey = (batchId: string, survey: Omit<MRVSurvey, "id">) =>
      setState((s) => {
        const surveyRecord: MRVSurvey = { ...survey, id: uid("sv") };
        return {
          ...s,
          batches: s.batches.map((b) =>
            b.id === batchId ? { ...b, surveys: [surveyRecord, ...b.surveys] } : b,
          ),
        };
      });

    const triggerPayout = (input: PayoutInput) =>
      setState((s) => {
        const payout: PayoutRecord = {
          id: uid("po"),
          projectId: input.projectId,
          batchId: input.batchId,
          amountKsh: input.amountKsh,
          reason: input.reason,
          recipient: input.recipient,
          date: new Date().toISOString().slice(0, 10),
          mpesaRef: `SIM B2C ${Math.floor(88000000 + Math.random() * 999999)}`,
          status: "Paid",
        };
        return {
          ...s,
          payouts: [payout, ...s.payouts],
          cfas: s.cfas.map((c) =>
            c.id === input.recipient
              ? {
                  ...c,
                  walletKsh: Math.max(0, c.walletKsh - payout.amountKsh),
                  payoutHistory: [payout, ...c.payoutHistory],
                }
              : c,
          ),
        };
      });

    const resetState = () => {
      window.localStorage.removeItem(STORAGE_KEY);
      setState(createFreshState());
      toast.success("Platform state restored to seed data");
    };

    return {
      state,
      setRole,
      setCurrency,
      setAllocation,
      updateRegulation,
      addContribution,
      addBatch,
      addSurvey,
      triggerPayout,
      resetState,
    };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function batchNurseryCfa(s: AppState, projectId: string) {
  const project = s.projects.find((p) => p.id === projectId);
  return project ? project.cfaId : "";
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}