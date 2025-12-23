import { useState, useEffect, useCallback, useMemo } from "react";
import { CalculatorState, CostItem, ProjectInfo } from "@/types/calculator";
import { getEmptyState } from "@/data/templates";

const STORAGE_KEY = "econ-calculator-data";

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return getEmptyState();
        }
      }
    }
    return getEmptyState();
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateProjectInfo = useCallback((updates: Partial<ProjectInfo>) => {
    setState((prev) => ({
      ...prev,
      projectInfo: { ...prev.projectInfo, ...updates },
    }));
  }, []);

  const updateItem = useCallback(
    (category: "materials" | "labor" | "miscellaneous", itemId: string, updates: Partial<CostItem>) => {
      setState((prev) => ({
        ...prev,
        [category]: prev[category].map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      }));
    },
    []
  );

  const addItem = useCallback(
    (category: "materials" | "labor" | "miscellaneous") => {
      const newItem: CostItem = {
        id: `${category}-${Date.now()}`,
        name: "New Item",
        description: "Enter description",
        quantity: 0,
        unitPrice: 0,
        unit: "nos",
        icon: category === "materials" ? "Package" : category === "labor" ? "Hammer" : "MoreHorizontal",
      };
      setState((prev) => ({
        ...prev,
        [category]: [...prev[category], newItem],
      }));
    },
    []
  );

  const removeItem = useCallback(
    (category: "materials" | "labor" | "miscellaneous", itemId: string) => {
      setState((prev) => ({
        ...prev,
        [category]: prev[category].filter((item) => item.id !== itemId),
      }));
    },
    []
  );

  const loadTemplate = useCallback((templateData: CalculatorState) => {
    setState(JSON.parse(JSON.stringify(templateData)));
  }, []);

  const resetCalculator = useCallback(() => {
    setState(getEmptyState());
  }, []);

  const calculateCategoryTotal = useCallback((items: CostItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, []);

  const totals = useMemo(() => {
    const materialsTotal = calculateCategoryTotal(state.materials);
    const laborTotal = calculateCategoryTotal(state.labor);
    const miscTotal = calculateCategoryTotal(state.miscellaneous);
    const grandTotal = materialsTotal + laborTotal + miscTotal;

    return {
      materials: materialsTotal,
      labor: laborTotal,
      miscellaneous: miscTotal,
      grandTotal,
    };
  }, [state.materials, state.labor, state.miscellaneous, calculateCategoryTotal]);

  const ratePerSqft = useMemo(() => {
    if (state.projectInfo.workingArea > 0) {
      return Math.round(totals.grandTotal / state.projectInfo.workingArea);
    }
    return 0;
  }, [totals.grandTotal, state.projectInfo.workingArea]);

  return {
    state,
    updateProjectInfo,
    updateItem,
    addItem,
    removeItem,
    loadTemplate,
    resetCalculator,
    totals,
    ratePerSqft,
  };
};
