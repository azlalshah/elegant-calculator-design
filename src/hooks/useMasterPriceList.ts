import { useState, useEffect, useCallback } from "react";
import { MasterPriceItem, SavedEstimate } from "@/types/calculator";

const MASTER_PRICES_KEY = "econ-master-prices";
const SAVED_ESTIMATES_KEY = "econ-saved-estimates";

export const useMasterPriceList = () => {
  const [items, setItems] = useState<MasterPriceItem[]>(() => {
    const saved = localStorage.getItem(MASTER_PRICES_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(MASTER_PRICES_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<MasterPriceItem, "id">) => {
    setItems((prev) => [...prev, { ...item, id: `mp-${Date.now()}` }]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<MasterPriceItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    
    // Auto-update all saved estimates
    if (updates.unitPrice !== undefined || updates.name !== undefined) {
      const savedStr = localStorage.getItem(SAVED_ESTIMATES_KEY);
      if (savedStr) {
        try {
          const estimates: SavedEstimate[] = JSON.parse(savedStr);
          const currentItem = items.find((i) => i.id === id);
          const oldName = currentItem?.name || "";
          const newName = updates.name || oldName;
          const newPrice = updates.unitPrice;

          const updatedEstimates = estimates.map((est) => {
            let changed = false;
            const updatedSections = est.data.sections.map((section) => ({
              ...section,
              items: section.items.map((costItem) => {
                if (costItem.name.toLowerCase() === oldName.toLowerCase() || costItem.name.toLowerCase() === newName.toLowerCase()) {
                  changed = true;
                  return {
                    ...costItem,
                    ...(newPrice !== undefined ? { unitPrice: newPrice } : {}),
                    ...(updates.name ? { name: updates.name } : {}),
                  };
                }
                return costItem;
              }),
            }));

            if (changed) {
              // Recalculate totals
              let subtotal = 0;
              const sectionTotals: Record<string, number> = {};
              updatedSections.forEach((section) => {
                const total = section.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
                sectionTotals[section.id] = total;
                subtotal += total;
              });
              const discountAmount = (subtotal * est.data.projectInfo.discountPercentage) / 100;
              const afterDiscount = subtotal - discountAmount;
              const taxAmount = (afterDiscount * est.data.projectInfo.taxPercentage) / 100;
              const grandTotal = afterDiscount + taxAmount;

              return {
                ...est,
                data: { ...est.data, sections: updatedSections },
                totals: { ...sectionTotals, subtotal, discountAmount, taxAmount, grandTotal },
                ratePerSqft: est.data.projectInfo.workingArea > 0
                  ? Math.round(grandTotal / est.data.projectInfo.workingArea) : 0,
              };
            }
            return est;
          });

          localStorage.setItem(SAVED_ESTIMATES_KEY, JSON.stringify(updatedEstimates));
        } catch {}
      }
    }
  }, [items]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const syncFromCalculator = useCallback((sections: { id: string; name: string; items: { name: string; unitPrice: number; unit: string; icon: string }[] }[]) => {
    setItems((prev) => {
      const updated = [...prev];
      sections.forEach((section) => {
        section.items.forEach((costItem) => {
          if (!costItem.name || costItem.name === "New Item") return;
          const existing = updated.find((m) => m.name.toLowerCase() === costItem.name.toLowerCase());
          if (existing) {
            existing.unitPrice = costItem.unitPrice;
            existing.unit = costItem.unit;
          } else {
            updated.push({
              id: `mp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: costItem.name,
              unitPrice: costItem.unitPrice,
              unit: costItem.unit || "nos",
              icon: costItem.icon || "Package",
              category: section.name,
            });
          }
        });
      });
      return updated;
    });
  }, []);

  return { items, addItem, updateItem, removeItem, syncFromCalculator };
};
