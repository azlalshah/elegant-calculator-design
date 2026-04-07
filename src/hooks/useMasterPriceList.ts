import { useState, useEffect, useCallback } from "react";
import { MasterPriceItem, SavedEstimate } from "@/types/calculator";

const MASTER_PRICES_KEY = "econ-master-prices";
const SAVED_ESTIMATES_KEY = "econ-saved-estimates";
const DEFAULT_ITEMS_LOADED_KEY = "econ-default-items-loaded";

const DEFAULT_ITEMS: Omit<MasterPriceItem, "id">[] = [
  // Raw Materials
  { name: "Cement (OPC)", unitPrice: 1350, unit: "bag", icon: "Package", category: "Raw Materials" },
  { name: "Sand (Reti)", unitPrice: 85, unit: "cft", icon: "Mountain", category: "Raw Materials" },
  { name: "Crush (Bajri)", unitPrice: 110, unit: "cft", icon: "Mountain", category: "Raw Materials" },
  { name: "Bricks (Eent)", unitPrice: 18, unit: "nos", icon: "Brick", category: "Raw Materials" },
  { name: "Steel (Sariya)", unitPrice: 280, unit: "kg", icon: "Cylinder", category: "Raw Materials" },
  { name: "Gravel (Margalla)", unitPrice: 95, unit: "cft", icon: "Mountain", category: "Raw Materials" },

  // Labor
  { name: "Mason (Mistri)", unitPrice: 2500, unit: "day", icon: "HardHat", category: "Labor" },
  { name: "Helper (Mazdoor)", unitPrice: 1500, unit: "day", icon: "HardHat", category: "Labor" },
  { name: "Electrician", unitPrice: 2500, unit: "day", icon: "Zap", category: "Labor" },
  { name: "Plumber", unitPrice: 2500, unit: "day", icon: "Pipette", category: "Labor" },
  { name: "Painter", unitPrice: 2000, unit: "day", icon: "Paintbrush", category: "Labor" },
  { name: "Carpenter", unitPrice: 2500, unit: "day", icon: "Hammer", category: "Labor" },

  // Finishing Materials
  { name: "Floor Tiles", unitPrice: 120, unit: "sqft", icon: "Grid3x3", category: "Finishing" },
  { name: "Wall Tiles", unitPrice: 90, unit: "sqft", icon: "LayoutGrid", category: "Finishing" },
  { name: "Marble", unitPrice: 250, unit: "sqft", icon: "Square", category: "Finishing" },
  { name: "Paint (Nippon/Diamond)", unitPrice: 8500, unit: "gallon", icon: "Paintbrush", category: "Finishing" },
  { name: "Putty", unitPrice: 3500, unit: "bag", icon: "Palette", category: "Finishing" },
  { name: "POP (Plaster of Paris)", unitPrice: 1200, unit: "bag", icon: "Package", category: "Finishing" },

  // Electrical
  { name: "Wire (3/29)", unitPrice: 12000, unit: "coil", icon: "Cable", category: "Electrical" },
  { name: "Wire (7/29)", unitPrice: 26000, unit: "coil", icon: "Cable", category: "Electrical" },
  { name: "Switch Board", unitPrice: 350, unit: "nos", icon: "Zap", category: "Electrical" },
  { name: "LED Light", unitPrice: 1200, unit: "nos", icon: "Lightbulb", category: "Electrical" },

  // Plumbing
  { name: "PVC Pipe (4 inch)", unitPrice: 800, unit: "10ft", icon: "Pipette", category: "Plumbing" },
  { name: "PPRC Pipe (1 inch)", unitPrice: 450, unit: "10ft", icon: "Pipette", category: "Plumbing" },
  { name: "Commode", unitPrice: 12000, unit: "nos", icon: "Bath", category: "Plumbing" },
  { name: "Wash Basin", unitPrice: 5000, unit: "nos", icon: "Droplets", category: "Plumbing" },

  // Woodwork
  { name: "Door (Wooden Panel)", unitPrice: 25000, unit: "nos", icon: "DoorOpen", category: "Woodwork" },
  { name: "Door Frame", unitPrice: 8000, unit: "nos", icon: "Frame", category: "Woodwork" },
  { name: "Window (Aluminum)", unitPrice: 650, unit: "sqft", icon: "Frame", category: "Woodwork" },

  // Structure
  { name: "Foundation Work", unitPrice: 180, unit: "sqft", icon: "Layers", category: "Structure" },
  { name: "RCC Columns", unitPrice: 15000, unit: "nos", icon: "Cylinder", category: "Structure" },
  { name: "Slab (RCC)", unitPrice: 200, unit: "sqft", icon: "Square", category: "Structure" },
  { name: "Brickwork", unitPrice: 55, unit: "sqft", icon: "Brick", category: "Structure" },
  { name: "Plastering", unitPrice: 35, unit: "sqft", icon: "Hammer", category: "Structure" },
  { name: "Waterproofing", unitPrice: 45, unit: "sqft", icon: "Droplets", category: "Structure" },
];

export const useMasterPriceList = () => {
  const [items, setItems] = useState<MasterPriceItem[]>(() => {
    const saved = localStorage.getItem(MASTER_PRICES_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    // Load defaults on first use
    const defaults = DEFAULT_ITEMS.map((item, i) => ({
      ...item,
      id: `mp-default-${i}`,
    }));
    return defaults;
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
