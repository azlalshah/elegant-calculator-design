import { useState, useEffect, useCallback, useMemo } from "react";
import { CalculatorState, CostItem, CostSection, ProjectInfo } from "@/types/calculator";
import { getEmptyState } from "@/data/templates";
import { arrayMove } from "@dnd-kit/sortable";

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
    (sectionId: string, itemId: string, updates: Partial<CostItem>) => {
      setState((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.map((item) =>
                  item.id === itemId ? { ...item, ...updates } : item
                ),
              }
            : section
        ),
      }));
    },
    []
  );

  const addItem = useCallback((sectionId: string) => {
    const newItem: CostItem = {
      id: `${sectionId}-${Date.now()}`,
      name: "New Item",
      description: "Enter description",
      quantity: 0,
      unitPrice: 0,
      unit: "nos",
      icon: "Package",
    };
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newItem] }
          : section
      ),
    }));
  }, []);

  const removeItem = useCallback((sectionId: string, itemId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
          : section
      ),
    }));
  }, []);

  const duplicateItem = useCallback((sectionId: string, itemId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const itemIndex = section.items.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) return section;
        const originalItem = section.items[itemIndex];
        const duplicatedItem: CostItem = {
          ...originalItem,
          id: `${sectionId}-${Date.now()}`,
          name: `${originalItem.name} (Copy)`,
        };
        const newItems = [...section.items];
        newItems.splice(itemIndex + 1, 0, duplicatedItem);
        return { ...section, items: newItems };
      }),
    }));
  }, []);

  const reorderItems = useCallback(
    (sectionId: string, oldIndex: number, newIndex: number) => {
      setState((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? { ...section, items: arrayMove(section.items, oldIndex, newIndex) }
            : section
        ),
      }));
    },
    []
  );

  const updateSection = useCallback(
    (sectionId: string, updates: Partial<CostSection>) => {
      setState((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section
        ),
      }));
    },
    []
  );

  const addSection = useCallback(() => {
    const newSection: CostSection = {
      id: `section-${Date.now()}`,
      name: "New Section",
      icon: "Folder",
      color: "bg-gray-600",
      items: [],
    };
    setState((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }));
  }, []);

  const loadTemplate = useCallback((templateData: CalculatorState) => {
    setState(JSON.parse(JSON.stringify(templateData)));
  }, []);

  const resetCalculator = useCallback(() => {
    setState(getEmptyState());
  }, []);

  const calculateSectionTotal = useCallback((items: CostItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, []);

  const totals = useMemo(() => {
    const sectionTotals: Record<string, number> = {};
    let grandTotal = 0;

    state.sections.forEach((section) => {
      const total = calculateSectionTotal(section.items);
      sectionTotals[section.id] = total;
      grandTotal += total;
    });

    return {
      ...sectionTotals,
      grandTotal,
    };
  }, [state.sections, calculateSectionTotal]);

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
    duplicateItem,
    reorderItems,
    updateSection,
    addSection,
    removeSection,
    loadTemplate,
    resetCalculator,
    totals,
    ratePerSqft,
  };
};
