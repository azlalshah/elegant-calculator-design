export interface CostItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  icon: string;
}

export interface CostSection {
  id: string;
  name: string;
  icon: string;
  color: string;
  items: CostItem[];
}

export interface ProjectInfo {
  clientName: string;
  projectName: string;
  location: string;
  duration: string;
  workingArea: number;
  category: string;
  ratePerSqft: number;
  notes: string;
  taxPercentage: number;
  discountPercentage: number;
}

export interface CalculatorState {
  projectInfo: ProjectInfo;
  sections: CostSection[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  data: CalculatorState;
}

// Master Price List item
export interface MasterPriceItem {
  id: string;
  name: string;
  unitPrice: number;
  unit: string;
  icon: string;
  category: string;
}

// Saved Estimate
export interface SavedEstimate {
  id: string;
  name: string;
  savedAt: string;
  data: CalculatorState;
  totals: Record<string, number>;
  ratePerSqft: number;
}

// Available icons for materials/items
export const AVAILABLE_ICONS = [
  "Package", "Mountain", "Grid3x3", "Square", "Paintbrush", "DoorOpen", 
  "SquareStack", "Zap", "Pipette", "Wrench", "Hammer", "Lightbulb", 
  "Droplets", "Palette", "Brick", "LayoutGrid", "Glasses", "Frame", 
  "Bath", "MoreHorizontal", "Building", "Building2", "Home", "Factory",
  "Warehouse", "HardHat", "Ruler", "Layers", "Box", "Cylinder",
  "Cable", "Fan", "Heater", "AirVent", "Fence", "TreeDeciduous",
  "Car", "Truck", "Shovel", "Scissors", "PaintBucket", "Drill"
] as const;
