export interface CostItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  icon: string;
}

export interface CostCategory {
  id: string;
  name: string;
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
}

export interface CalculatorState {
  projectInfo: ProjectInfo;
  materials: CostItem[];
  labor: CostItem[];
  miscellaneous: CostItem[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  data: CalculatorState;
}
