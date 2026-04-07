import { useState, useEffect, useCallback } from "react";
import { SavedEstimate, CalculatorState } from "@/types/calculator";

const SAVED_ESTIMATES_KEY = "econ-saved-estimates";

export const useSavedEstimates = () => {
  const [estimates, setEstimates] = useState<SavedEstimate[]>(() => {
    const saved = localStorage.getItem(SAVED_ESTIMATES_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(SAVED_ESTIMATES_KEY, JSON.stringify(estimates));
  }, [estimates]);

  const saveEstimate = useCallback((data: CalculatorState, totals: Record<string, number>, ratePerSqft: number) => {
    const name = `${data.projectInfo.projectName || "Untitled"} - ${data.projectInfo.clientName || "No Client"}`;
    const newEstimate: SavedEstimate = {
      id: `est-${Date.now()}`,
      name,
      savedAt: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(data)),
      totals: { ...totals },
      ratePerSqft,
    };
    setEstimates((prev) => [newEstimate, ...prev]);
    return newEstimate;
  }, []);

  const removeEstimate = useCallback((id: string) => {
    setEstimates((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const refreshFromStorage = useCallback(() => {
    const saved = localStorage.getItem(SAVED_ESTIMATES_KEY);
    if (saved) {
      try { setEstimates(JSON.parse(saved)); } catch {}
    }
  }, []);

  return { estimates, saveEstimate, removeEstimate, refreshFromStorage };
};
