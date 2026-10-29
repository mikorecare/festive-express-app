import { useEstimator as useEstimatorInternal } from "@/hooks/estimator/useEstimator";
import { createContext, useContext, type ReactNode } from "react";

const Ctx = createContext<ReturnType<typeof useEstimatorInternal> | null>(null);

export function EstimatorProvider({ children }: { children: ReactNode }) {
  const value = useEstimatorInternal();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEstimator() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEstimator must be inside EstimatorProvider");
  return ctx;
}
