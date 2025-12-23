import { ProjectTemplate, CalculatorState } from "@/types/calculator";

const emptyState: CalculatorState = {
  projectInfo: {
    clientName: "",
    projectName: "",
    location: "",
    duration: "",
    workingArea: 0,
    category: "A Category",
    ratePerSqft: 3800,
    notes: "",
  },
  materials: [
    { id: "m1", name: "Cement", description: "Portland cement bags", quantity: 0, unitPrice: 0, unit: "bags", icon: "Package" },
    { id: "m2", name: "Sand & Crush", description: "Construction aggregate", quantity: 0, unitPrice: 0, unit: "cft", icon: "Mountain" },
    { id: "m3", name: "Tiles", description: "Floor and wall tiles", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Grid3x3" },
    { id: "m4", name: "Marble", description: "Marble flooring", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Square" },
    { id: "m5", name: "Paint", description: "Interior and exterior paint", quantity: 0, unitPrice: 0, unit: "liters", icon: "Paintbrush" },
    { id: "m6", name: "Doors", description: "Wooden/PVC doors", quantity: 0, unitPrice: 0, unit: "nos", icon: "DoorOpen" },
    { id: "m7", name: "Windows", description: "Aluminum/wooden windows", quantity: 0, unitPrice: 0, unit: "nos", icon: "SquareStack" },
    { id: "m8", name: "Electrical Items", description: "Wires, switches, boards", quantity: 0, unitPrice: 0, unit: "lot", icon: "Zap" },
    { id: "m9", name: "Plumbing Items", description: "Pipes, fittings, fixtures", quantity: 0, unitPrice: 0, unit: "lot", icon: "Pipette" },
    { id: "m10", name: "Steel/Iron", description: "Reinforcement bars", quantity: 0, unitPrice: 0, unit: "kg", icon: "Wrench" },
  ],
  labor: [
    { id: "l1", name: "Finishing Work", description: "Plastering and finishing", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Hammer" },
    { id: "l2", name: "Electric Work", description: "Electrical installation", quantity: 0, unitPrice: 0, unit: "points", icon: "Lightbulb" },
    { id: "l3", name: "Plumbing Work", description: "Plumbing installation", quantity: 0, unitPrice: 0, unit: "points", icon: "Droplets" },
    { id: "l4", name: "Color Work", description: "Painting labor", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Palette" },
    { id: "l5", name: "Mason Work", description: "Masonry and brickwork", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Brick" },
    { id: "l6", name: "Tile Installation", description: "Tile laying labor", quantity: 0, unitPrice: 0, unit: "sqft", icon: "LayoutGrid" },
  ],
  miscellaneous: [
    { id: "x1", name: "Glass Work", description: "Glass panels and mirrors", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Glasses" },
    { id: "x2", name: "Aluminum Work", description: "Aluminum sections", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Frame" },
    { id: "x3", name: "Fixtures", description: "Bathroom and kitchen fixtures", quantity: 0, unitPrice: 0, unit: "lot", icon: "Bath" },
    { id: "x4", name: "Other Items", description: "Miscellaneous items", quantity: 0, unitPrice: 0, unit: "lot", icon: "MoreHorizontal" },
  ],
};

const g2FinishingTemplate: CalculatorState = {
  projectInfo: {
    clientName: "",
    projectName: "G+2 Finishing Project",
    location: "",
    duration: "6 months",
    workingArea: 3500,
    category: "A Category",
    ratePerSqft: 3800,
    notes: "Complete finishing work for G+2 residential building",
  },
  materials: [
    { id: "m1", name: "Cement", description: "Portland cement bags", quantity: 200, unitPrice: 450, unit: "bags", icon: "Package" },
    { id: "m2", name: "Sand & Crush", description: "Construction aggregate", quantity: 500, unitPrice: 85, unit: "cft", icon: "Mountain" },
    { id: "m3", name: "Tiles", description: "Floor and wall tiles", quantity: 2800, unitPrice: 120, unit: "sqft", icon: "Grid3x3" },
    { id: "m4", name: "Marble", description: "Marble flooring", quantity: 400, unitPrice: 280, unit: "sqft", icon: "Square" },
    { id: "m5", name: "Paint", description: "Interior and exterior paint", quantity: 150, unitPrice: 650, unit: "liters", icon: "Paintbrush" },
    { id: "m6", name: "Doors", description: "Wooden/PVC doors", quantity: 18, unitPrice: 12000, unit: "nos", icon: "DoorOpen" },
    { id: "m7", name: "Windows", description: "Aluminum/wooden windows", quantity: 24, unitPrice: 8500, unit: "nos", icon: "SquareStack" },
    { id: "m8", name: "Electrical Items", description: "Wires, switches, boards", quantity: 1, unitPrice: 185000, unit: "lot", icon: "Zap" },
    { id: "m9", name: "Plumbing Items", description: "Pipes, fittings, fixtures", quantity: 1, unitPrice: 145000, unit: "lot", icon: "Pipette" },
    { id: "m10", name: "Steel/Iron", description: "Reinforcement bars", quantity: 800, unitPrice: 95, unit: "kg", icon: "Wrench" },
  ],
  labor: [
    { id: "l1", name: "Finishing Work", description: "Plastering and finishing", quantity: 3500, unitPrice: 45, unit: "sqft", icon: "Hammer" },
    { id: "l2", name: "Electric Work", description: "Electrical installation", quantity: 120, unitPrice: 850, unit: "points", icon: "Lightbulb" },
    { id: "l3", name: "Plumbing Work", description: "Plumbing installation", quantity: 45, unitPrice: 1200, unit: "points", icon: "Droplets" },
    { id: "l4", name: "Color Work", description: "Painting labor", quantity: 3500, unitPrice: 25, unit: "sqft", icon: "Palette" },
    { id: "l5", name: "Mason Work", description: "Masonry and brickwork", quantity: 2000, unitPrice: 55, unit: "sqft", icon: "Brick" },
    { id: "l6", name: "Tile Installation", description: "Tile laying labor", quantity: 2800, unitPrice: 35, unit: "sqft", icon: "LayoutGrid" },
  ],
  miscellaneous: [
    { id: "x1", name: "Glass Work", description: "Glass panels and mirrors", quantity: 150, unitPrice: 180, unit: "sqft", icon: "Glasses" },
    { id: "x2", name: "Aluminum Work", description: "Aluminum sections", quantity: 200, unitPrice: 220, unit: "sqft", icon: "Frame" },
    { id: "x3", name: "Fixtures", description: "Bathroom and kitchen fixtures", quantity: 1, unitPrice: 250000, unit: "lot", icon: "Bath" },
    { id: "x4", name: "Other Items", description: "Miscellaneous items", quantity: 1, unitPrice: 75000, unit: "lot", icon: "MoreHorizontal" },
  ],
};

const g3StructureTemplate: CalculatorState = {
  projectInfo: {
    clientName: "",
    projectName: "G+3 Structure Only",
    location: "",
    duration: "8 months",
    workingArea: 4800,
    category: "B Category",
    ratePerSqft: 2800,
    notes: "Grey structure for G+3 commercial building",
  },
  materials: [
    { id: "m1", name: "Cement", description: "Portland cement bags", quantity: 450, unitPrice: 450, unit: "bags", icon: "Package" },
    { id: "m2", name: "Sand & Crush", description: "Construction aggregate", quantity: 1200, unitPrice: 85, unit: "cft", icon: "Mountain" },
    { id: "m3", name: "Tiles", description: "Floor and wall tiles", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Grid3x3" },
    { id: "m4", name: "Marble", description: "Marble flooring", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Square" },
    { id: "m5", name: "Paint", description: "Interior and exterior paint", quantity: 0, unitPrice: 0, unit: "liters", icon: "Paintbrush" },
    { id: "m6", name: "Doors", description: "Wooden/PVC doors", quantity: 0, unitPrice: 0, unit: "nos", icon: "DoorOpen" },
    { id: "m7", name: "Windows", description: "Aluminum/wooden windows", quantity: 0, unitPrice: 0, unit: "nos", icon: "SquareStack" },
    { id: "m8", name: "Electrical Items", description: "Wires, switches, boards", quantity: 1, unitPrice: 85000, unit: "lot", icon: "Zap" },
    { id: "m9", name: "Plumbing Items", description: "Pipes, fittings, fixtures", quantity: 1, unitPrice: 65000, unit: "lot", icon: "Pipette" },
    { id: "m10", name: "Steel/Iron", description: "Reinforcement bars", quantity: 5500, unitPrice: 95, unit: "kg", icon: "Wrench" },
  ],
  labor: [
    { id: "l1", name: "Finishing Work", description: "Plastering and finishing", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Hammer" },
    { id: "l2", name: "Electric Work", description: "Electrical installation", quantity: 80, unitPrice: 650, unit: "points", icon: "Lightbulb" },
    { id: "l3", name: "Plumbing Work", description: "Plumbing installation", quantity: 30, unitPrice: 950, unit: "points", icon: "Droplets" },
    { id: "l4", name: "Color Work", description: "Painting labor", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Palette" },
    { id: "l5", name: "Mason Work", description: "Masonry and brickwork", quantity: 4800, unitPrice: 65, unit: "sqft", icon: "Brick" },
    { id: "l6", name: "Tile Installation", description: "Tile laying labor", quantity: 0, unitPrice: 0, unit: "sqft", icon: "LayoutGrid" },
  ],
  miscellaneous: [
    { id: "x1", name: "Glass Work", description: "Glass panels and mirrors", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Glasses" },
    { id: "x2", name: "Aluminum Work", description: "Aluminum sections", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Frame" },
    { id: "x3", name: "Fixtures", description: "Bathroom and kitchen fixtures", quantity: 0, unitPrice: 0, unit: "lot", icon: "Bath" },
    { id: "x4", name: "Other Items", description: "Miscellaneous items", quantity: 1, unitPrice: 120000, unit: "lot", icon: "MoreHorizontal" },
  ],
};

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "empty",
    name: "Start Fresh",
    description: "Begin with a blank calculator",
    data: emptyState,
  },
  {
    id: "g2-finishing",
    name: "G+2 Finishing",
    description: "Complete finishing work for residential building",
    data: g2FinishingTemplate,
  },
  {
    id: "g3-structure",
    name: "G+3 Structure Only",
    description: "Grey structure for commercial building",
    data: g3StructureTemplate,
  },
];

export const getEmptyState = (): CalculatorState => JSON.parse(JSON.stringify(emptyState));
