import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CostItem, CostSection } from "@/types/calculator";
import { CostItemRow } from "./CostItemRow";
import { Plus, Trash2, FolderPlus } from "lucide-react";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface CostBreakdownProps {
  sections: CostSection[];
  totals: Record<string, number>;
  onUpdateItem: (sectionId: string, itemId: string, updates: Partial<CostItem>) => void;
  onAddItem: (sectionId: string) => void;
  onRemoveItem: (sectionId: string, itemId: string) => void;
  onDuplicateItem: (sectionId: string, itemId: string) => void;
  onReorderItems: (sectionId: string, oldIndex: number, newIndex: number) => void;
  onUpdateSection: (sectionId: string, updates: Partial<CostSection>) => void;
  onAddSection: () => void;
  onRemoveSection: (sectionId: string) => void;
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
  sections,
  totals,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  onDuplicateItem,
  onReorderItems,
  onUpdateSection,
  onAddSection,
  onRemoveSection,
}: CostBreakdownProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (sectionId: string) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return;
      const oldIndex = section.items.findIndex((item) => item.id === active.id);
      const newIndex = section.items.findIndex((item) => item.id === over.id);
      onReorderItems(sectionId, oldIndex, newIndex);
    }
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Cost Breakdown</CardTitle>
        <Button variant="outline" size="sm" onClick={onAddSection}>
          <FolderPlus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion
          type="multiple"
          defaultValue={sections.map((s) => s.id)}
          className="w-full"
        >
          {sections.map((section) => {
            const SectionIcon = (Icons[section.icon as keyof typeof Icons] as LucideIcon) || Icons.Package;
            const sectionTotal = totals[section.id] || 0;

            return (
              <AccordionItem key={section.id} value={section.id} className="border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:bg-muted/50">
                  <div className="flex w-full items-center justify-between pr-2">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${section.color} text-white`}>
                        <SectionIcon className="h-4 w-4" />
                      </div>
                      <Input
                        type="text"
                        value={section.name}
                        onChange={(e) => {
                          e.stopPropagation();
                          onUpdateSection(section.id, { name: e.target.value });
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-40 border-transparent bg-transparent font-semibold hover:border-border focus:border-border"
                      />
                      <Badge variant="secondary" className="ml-2">
                        {section.items.length} items
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{formatCurrency(sectionTotal)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSection(section.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd(section.id)}
                  >
                    <SortableContext
                      items={section.items.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {section.items.map((item) => (
                          <CostItemRow
                            key={item.id}
                            item={item}
                            onUpdate={(updates) => onUpdateItem(section.id, item.id, updates)}
                            onRemove={() => onRemoveItem(section.id, item.id)}
                            onDuplicate={() => onDuplicateItem(section.id, item.id)}
                          />
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddItem(section.id)}
                          className="w-full mt-2 border-dashed"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </SortableContext>
                  </DndContext>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};
