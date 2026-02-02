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
    taxPercentage: 0,
    discountPercentage: 0,
  },
  sections: [
    {
      id: "structure",
      name: "Structure",
      icon: "Building2",
      color: "bg-blue-600",
      items: [
        { id: "s1", name: "Foundation", description: "Foundation work", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Layers" },
        { id: "s2", name: "Columns", description: "RCC columns", quantity: 0, unitPrice: 0, unit: "nos", icon: "Cylinder" },
        { id: "s3", name: "Beams", description: "RCC beams", quantity: 0, unitPrice: 0, unit: "rft", icon: "Box" },
        { id: "s4", name: "Slabs", description: "RCC slabs", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Square" },
      ],
    },
    {
      id: "gray-structure",
      name: "Gray Structure",
      icon: "Building",
      color: "bg-slate-600",
      items: [
        { id: "gs1", name: "Brickwork", description: "Brick masonry", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Brick" },
        { id: "gs2", name: "Plastering", description: "Wall plastering", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Hammer" },
        { id: "gs3", name: "Waterproofing", description: "Waterproofing treatment", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Droplets" },
      ],
    },
    {
      id: "finishing",
      name: "Finishing",
      icon: "Paintbrush",
      color: "bg-purple-600",
      items: [
        { id: "f1", name: "Floor Tiles", description: "Floor tile installation", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Grid3x3" },
        { id: "f2", name: "Wall Tiles", description: "Wall tile installation", quantity: 0, unitPrice: 0, unit: "sqft", icon: "LayoutGrid" },
        { id: "f3", name: "Marble Work", description: "Marble flooring", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Square" },
        { id: "f4", name: "Paint Work", description: "Interior and exterior paint", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Paintbrush" },
        { id: "f5", name: "Polish Work", description: "Wood polish and finishing", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Palette" },
      ],
    },
    {
      id: "materials",
      name: "Materials",
      icon: "Package",
      color: "bg-primary",
      items: [
        { id: "m1", name: "Cement", description: "Portland cement bags", quantity: 0, unitPrice: 0, unit: "bags", icon: "Package" },
        { id: "m2", name: "Sand & Crush", description: "Construction aggregate", quantity: 0, unitPrice: 0, unit: "cft", icon: "Mountain" },
        { id: "m3", name: "Steel/Iron", description: "Reinforcement bars", quantity: 0, unitPrice: 0, unit: "kg", icon: "Wrench" },
        { id: "m4", name: "Doors", description: "Wooden/PVC doors", quantity: 0, unitPrice: 0, unit: "nos", icon: "DoorOpen" },
        { id: "m5", name: "Windows", description: "Aluminum/wooden windows", quantity: 0, unitPrice: 0, unit: "nos", icon: "SquareStack" },
        { id: "m6", name: "Electrical Items", description: "Wires, switches, boards", quantity: 0, unitPrice: 0, unit: "lot", icon: "Zap" },
        { id: "m7", name: "Plumbing Items", description: "Pipes, fittings, fixtures", quantity: 0, unitPrice: 0, unit: "lot", icon: "Pipette" },
      ],
    },
    {
      id: "labor",
      name: "Labor",
      icon: "Hammer",
      color: "bg-success",
      items: [
        { id: "l1", name: "Electric Work", description: "Electrical installation", quantity: 0, unitPrice: 0, unit: "points", icon: "Lightbulb" },
        { id: "l2", name: "Plumbing Work", description: "Plumbing installation", quantity: 0, unitPrice: 0, unit: "points", icon: "Droplets" },
        { id: "l3", name: "Color Work", description: "Painting labor", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Palette" },
        { id: "l4", name: "Mason Work", description: "Masonry and brickwork", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Brick" },
      ],
    },
    {
      id: "miscellaneous",
      name: "Miscellaneous",
      icon: "MoreHorizontal",
      color: "bg-warning",
      items: [
        { id: "x1", name: "Glass Work", description: "Glass panels and mirrors", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Glasses" },
        { id: "x2", name: "Aluminum Work", description: "Aluminum sections", quantity: 0, unitPrice: 0, unit: "sqft", icon: "Frame" },
        { id: "x3", name: "Fixtures", description: "Bathroom and kitchen fixtures", quantity: 0, unitPrice: 0, unit: "lot", icon: "Bath" },
        { id: "x4", name: "Other Items", description: "Miscellaneous items", quantity: 0, unitPrice: 0, unit: "lot", icon: "MoreHorizontal" },
      ],
    },
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
    taxPercentage: 0,
    discountPercentage: 0,
  },
  sections: [
    {
      id: "structure",
      name: "Structure",
      icon: "Building2",
      color: "bg-blue-600",
      items: [],
    },
    {
      id: "gray-structure",
      name: "Gray Structure",
      icon: "Building",
      color: "bg-slate-600",
      items: [],
    },
    {
      id: "finishing",
      name: "Finishing",
      icon: "Paintbrush",
      color: "bg-purple-600",
      items: [
        { id: "f1", name: "Floor Tiles", description: "Floor tile installation", quantity: 2800, unitPrice: 120, unit: "sqft", icon: "Grid3x3" },
        { id: "f2", name: "Wall Tiles", description: "Wall tile installation", quantity: 1200, unitPrice: 100, unit: "sqft", icon: "LayoutGrid" },
        { id: "f3", name: "Marble Work", description: "Marble flooring", quantity: 400, unitPrice: 280, unit: "sqft", icon: "Square" },
        { id: "f4", name: "Paint Work", description: "Interior and exterior paint", quantity: 3500, unitPrice: 25, unit: "sqft", icon: "Paintbrush" },
      ],
    },
    {
      id: "materials",
      name: "Materials",
      icon: "Package",
      color: "bg-primary",
      items: [
        { id: "m1", name: "Cement", description: "Portland cement bags", quantity: 200, unitPrice: 450, unit: "bags", icon: "Package" },
        { id: "m2", name: "Sand & Crush", description: "Construction aggregate", quantity: 500, unitPrice: 85, unit: "cft", icon: "Mountain" },
        { id: "m3", name: "Doors", description: "Wooden/PVC doors", quantity: 18, unitPrice: 12000, unit: "nos", icon: "DoorOpen" },
        { id: "m4", name: "Windows", description: "Aluminum windows", quantity: 24, unitPrice: 8500, unit: "nos", icon: "SquareStack" },
        { id: "m5", name: "Electrical Items", description: "Wires, switches, boards", quantity: 1, unitPrice: 185000, unit: "lot", icon: "Zap" },
        { id: "m6", name: "Plumbing Items", description: "Pipes, fittings, fixtures", quantity: 1, unitPrice: 145000, unit: "lot", icon: "Pipette" },
      ],
    },
    {
      id: "labor",
      name: "Labor",
      icon: "Hammer",
      color: "bg-success",
      items: [
        { id: "l1", name: "Electric Work", description: "Electrical installation", quantity: 120, unitPrice: 850, unit: "points", icon: "Lightbulb" },
        { id: "l2", name: "Plumbing Work", description: "Plumbing installation", quantity: 45, unitPrice: 1200, unit: "points", icon: "Droplets" },
        { id: "l3", name: "Tile Installation", description: "Tile laying labor", quantity: 4000, unitPrice: 35, unit: "sqft", icon: "LayoutGrid" },
      ],
    },
    {
      id: "miscellaneous",
      name: "Miscellaneous",
      icon: "MoreHorizontal",
      color: "bg-warning",
      items: [
        { id: "x1", name: "Glass Work", description: "Glass panels and mirrors", quantity: 150, unitPrice: 180, unit: "sqft", icon: "Glasses" },
        { id: "x2", name: "Fixtures", description: "Bathroom and kitchen fixtures", quantity: 1, unitPrice: 250000, unit: "lot", icon: "Bath" },
      ],
    },
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
    taxPercentage: 0,
    discountPercentage: 0,
  },
  sections: [
    {
      id: "structure",
      name: "Structure",
      icon: "Building2",
      color: "bg-blue-600",
      items: [
        { id: "s1", name: "Foundation", description: "Foundation work", quantity: 1200, unitPrice: 180, unit: "sqft", icon: "Layers" },
        { id: "s2", name: "Columns", description: "RCC columns", quantity: 48, unitPrice: 15000, unit: "nos", icon: "Cylinder" },
        { id: "s3", name: "Beams", description: "RCC beams", quantity: 800, unitPrice: 450, unit: "rft", icon: "Box" },
        { id: "s4", name: "Slabs", description: "RCC slabs", quantity: 4800, unitPrice: 95, unit: "sqft", icon: "Square" },
      ],
    },
    {
      id: "gray-structure",
      name: "Gray Structure",
      icon: "Building",
      color: "bg-slate-600",
      items: [
        { id: "gs1", name: "Brickwork", description: "Brick masonry", quantity: 3200, unitPrice: 65, unit: "sqft", icon: "Brick" },
        { id: "gs2", name: "Plastering", description: "Wall plastering", quantity: 6400, unitPrice: 45, unit: "sqft", icon: "Hammer" },
      ],
    },
    {
      id: "finishing",
      name: "Finishing",
      icon: "Paintbrush",
      color: "bg-purple-600",
      items: [],
    },
    {
      id: "materials",
      name: "Materials",
      icon: "Package",
      color: "bg-primary",
      items: [
        { id: "m1", name: "Cement", description: "Portland cement bags", quantity: 450, unitPrice: 450, unit: "bags", icon: "Package" },
        { id: "m2", name: "Sand & Crush", description: "Construction aggregate", quantity: 1200, unitPrice: 85, unit: "cft", icon: "Mountain" },
        { id: "m3", name: "Steel/Iron", description: "Reinforcement bars", quantity: 5500, unitPrice: 95, unit: "kg", icon: "Wrench" },
      ],
    },
    {
      id: "labor",
      name: "Labor",
      icon: "Hammer",
      color: "bg-success",
      items: [
        { id: "l1", name: "Mason Work", description: "Masonry and brickwork", quantity: 4800, unitPrice: 65, unit: "sqft", icon: "Brick" },
        { id: "l2", name: "Electric Work", description: "Electrical conduit", quantity: 80, unitPrice: 650, unit: "points", icon: "Lightbulb" },
        { id: "l3", name: "Plumbing Work", description: "Plumbing rough-in", quantity: 30, unitPrice: 950, unit: "points", icon: "Droplets" },
      ],
    },
    {
      id: "miscellaneous",
      name: "Miscellaneous",
      icon: "MoreHorizontal",
      color: "bg-warning",
      items: [
        { id: "x1", name: "Other Items", description: "Miscellaneous items", quantity: 1, unitPrice: 120000, unit: "lot", icon: "MoreHorizontal" },
      ],
    },
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
