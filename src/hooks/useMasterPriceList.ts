import { useState, useEffect, useCallback, useMemo } from "react";
import { SavedEstimate, CostSection } from "@/types/calculator";
import { getEmptyState } from "@/data/templates";

const PRICE_MAP_KEY = "econ-master-price-map";
const SAVED_ESTIMATES_KEY = "econ-saved-estimates";
const CALCULATOR_KEY = "econ-calculator-data";

// Price map: item name (lowercase) -> unit price
type PriceMap = Record<string, number>;

const loadPriceMap = (): PriceMap => {
  try {
    const saved = localStorage.getItem(PRICE_MAP_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const savePriceMap = (map: PriceMap) => {
  localStorage.setItem(PRICE_MAP_KEY, JSON.stringify(map));
};

export const useMasterPriceList = () => {
  const [priceMap, setPriceMap] = useState<PriceMap>(loadPriceMap);

  // Get sections from calculator's current state or template
  const sections = useMemo((): CostSection[] => {
    try {
      const calcData = localStorage.getItem(CALCULATOR_KEY);
      if (calcData) {
        const parsed = JSON.parse(calcData);
        if (parsed.sections && Array.isArray(parsed.sections)) {
          return parsed.sections;
        }
      }
    } catch {}
    return getEmptyState().sections;
  }, []);

  // Build display data: sections with items, prices from priceMap override
  const displaySections = useMemo(() => {
    return sections.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        const key = item.name.toLowerCase();
        return {
          ...item,
          unitPrice: priceMap[key] !== undefined ? priceMap[key] : item.unitPrice,
        };
      }),
    }));
  }, [sections, priceMap]);

  // Save price map to localStorage
  useEffect(() => {
    savePriceMap(priceMap);
  }, [priceMap]);

  const updatePrice = useCallback((itemName: string, newPrice: number) => {
    const key = itemName.toLowerCase();
    setPriceMap((prev) => ({ ...prev, [key]: newPrice }));

    // Update current calculator state
    try {
      const calcStr = localStorage.getItem(CALCULATOR_KEY);
      if (calcStr) {
        const calcData = JSON.parse(calcStr);
        if (calcData.sections) {
          let changed = false;
          calcData.sections = calcData.sections.map((section: any) => ({
            ...section,
            items: section.items.map((item: any) => {
              if (item.name.toLowerCase() === key) {
                changed = true;
                return { ...item, unitPrice: newPrice };
              }
              return item;
            }),
          }));
          if (changed) {
            localStorage.setItem(CALCULATOR_KEY, JSON.stringify(calcData));
          }
        }
      }
    } catch {}

    // Update all saved estimates
    try {
      const savedStr = localStorage.getItem(SAVED_ESTIMATES_KEY);
      if (savedStr) {
        const estimates: SavedEstimate[] = JSON.parse(savedStr);
        const updatedEstimates = estimates.map((est) => {
          let changed = false;
          const updatedSections = est.data.sections.map((section) => ({
            ...section,
            items: section.items.map((costItem) => {
              if (costItem.name.toLowerCase() === key) {
                changed = true;
                return { ...costItem, unitPrice: newPrice };
              }
              return costItem;
            }),
          }));

          if (changed) {
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
      }
    } catch {}
  }, []);

  return { displaySections, updatePrice, priceMap };
};
