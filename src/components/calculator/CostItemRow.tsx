import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CostItem } from "@/types/calculator";
import * as Icons from "lucide-react";
import { LucideIcon, Trash2 } from "lucide-react";

interface CostItemRowProps {
  item: CostItem;
  onUpdate: (updates: Partial<CostItem>) => void;
  onRemove: () => void;
}

export const CostItemRow = ({ item, onUpdate, onRemove }: CostItemRowProps) => {
  const IconComponent = (Icons[item.icon as keyof typeof Icons] as LucideIcon) || Icons.Package;
  const lineTotal = item.quantity * item.unitPrice;

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
    <div className="grid grid-cols-12 items-center gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50">
      <div className="col-span-12 flex items-center gap-3 sm:col-span-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <IconComponent className="h-4 w-4" />
        </div>
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
      
      <div className="col-span-4 text-right sm:col-span-3">
        <span className={`text-sm font-semibold ${lineTotal > 0 ? "text-foreground" : "text-muted-foreground"}`}>
          {formatCurrency(lineTotal)}
        </span>
      </div>

      <div className="col-span-2 flex justify-end sm:col-span-1">
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
