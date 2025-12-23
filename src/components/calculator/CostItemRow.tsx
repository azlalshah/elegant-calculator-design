import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CostItem } from "@/types/calculator";
import { Trash2, Copy, GripVertical } from "lucide-react";
import { IconSelector } from "./IconSelector";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CostItemRowProps {
  item: CostItem;
  onUpdate: (updates: Partial<CostItem>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export const CostItemRow = ({ item, onUpdate, onRemove, onDuplicate }: CostItemRowProps) => {
  const lineTotal = item.quantity * item.unitPrice;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "—";
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-12 items-center gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
    >
      {/* Drag Handle */}
      <div className="col-span-1 flex justify-center">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none rounded p-1 hover:bg-muted active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Icon & Name */}
      <div className="col-span-11 flex items-center gap-3 sm:col-span-3">
        <IconSelector value={item.icon} onChange={(icon) => onUpdate({ icon })} />
        <div className="min-w-0 flex-1 space-y-1">
          <Input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="h-7 border-transparent bg-transparent p-0 text-sm font-medium hover:border-border focus:border-border"
            placeholder="Item name"
          />
          <Input
            type="text"
            value={item.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="h-6 border-transparent bg-transparent p-0 text-xs text-muted-foreground hover:border-border focus:border-border"
            placeholder="Description"
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="col-span-3 sm:col-span-2">
        <Input
          type="number"
          placeholder="Qty"
          value={item.quantity || ""}
          onChange={(e) => onUpdate({ quantity: Number(e.target.value) })}
          className="h-8 text-center text-sm"
        />
        <Input
          type="text"
          value={item.unit}
          onChange={(e) => onUpdate({ unit: e.target.value })}
          className="mt-0.5 h-5 border-transparent bg-transparent p-0 text-center text-[10px] text-muted-foreground hover:border-border focus:border-border"
          placeholder="unit"
        />
      </div>

      {/* Unit Price */}
      <div className="col-span-3 sm:col-span-2">
        <Input
          type="number"
          placeholder="Price"
          value={item.unitPrice || ""}
          onChange={(e) => onUpdate({ unitPrice: Number(e.target.value) })}
          className="h-8 text-center text-sm"
        />
        <span className="mt-0.5 block text-center text-[10px] text-muted-foreground">per {item.unit}</span>
      </div>

      {/* Line Total */}
      <div className="col-span-4 text-right sm:col-span-2">
        <span className={`text-sm font-semibold ${lineTotal > 0 ? "text-foreground" : "text-muted-foreground"}`}>
          {formatCurrency(lineTotal)}
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-1 sm:col-span-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDuplicate}
          className="h-7 w-7 text-muted-foreground hover:text-primary"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
