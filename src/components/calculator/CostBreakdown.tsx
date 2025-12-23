import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CostItem } from "@/types/calculator";
import { CostItemRow } from "./CostItemRow";
import { Package, Hammer, MoreHorizontal, Plus } from "lucide-react";

interface CostBreakdownProps {
  materials: CostItem[];
  labor: CostItem[];
  miscellaneous: CostItem[];
  totals: {
    materials: number;
    labor: number;
    miscellaneous: number;
  };
  onUpdateItem: (category: "materials" | "labor" | "miscellaneous", itemId: string, updates: Partial<CostItem>) => void;
  onAddItem: (category: "materials" | "labor" | "miscellaneous") => void;
  onRemoveItem: (category: "materials" | "labor" | "miscellaneous", itemId: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const CostBreakdown = ({ 
  materials, 
  labor, 
  miscellaneous, 
  totals, 
  onUpdateItem,
  onAddItem,
  onRemoveItem 
}: CostBreakdownProps) => {
  const sections = [
    {
      id: "materials" as const,
      title: "Materials",
      icon: Package,
      items: materials,
      total: totals.materials,
      color: "bg-chart-materials",
    },
    {
      id: "labor" as const,
      title: "Labor",
      icon: Hammer,
      items: labor,
      total: totals.labor,
      color: "bg-chart-labor",
    },
    {
      id: "miscellaneous" as const,
      title: "Miscellaneous",
      icon: MoreHorizontal,
      items: miscellaneous,
      total: totals.miscellaneous,
      color: "bg-chart-misc",
    },
  ];

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="multiple" defaultValue={["materials", "labor", "miscellaneous"]} className="w-full">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border-b-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:bg-muted/50">
                <div className="flex w-full items-center justify-between pr-2">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${section.color} text-white`}>
                      <section.icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold">{section.title}</span>
                    <Badge variant="secondary" className="ml-2">
                      {section.items.length} items
                    </Badge>
                  </div>
                  <span className="text-lg font-bold">{formatCurrency(section.total)}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <CostItemRow
                      key={item.id}
                      item={item}
                      onUpdate={(updates) => onUpdateItem(section.id, item.id, updates)}
                      onRemove={() => onRemoveItem(section.id, item.id)}
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddItem(section.id)}
                    className="w-full mt-2 border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add {section.title.slice(0, -1)}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
