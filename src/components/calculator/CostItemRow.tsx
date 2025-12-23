import { Input } from "@/components/ui/input";
import { CostItem } from "@/types/calculator";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface CostItemRowProps {
  item: CostItem;
  onUpdate: (updates: Partial<CostItem>) => void;
}

export const CostItemRow = ({ item, onUpdate }: CostItemRowProps) => {
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
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{item.name}</p>
          <p className="truncate text-xs text-muted-foreground">{item.description}</p>
        </div>
      </div>
      
      <div className="col-span-4 sm:col-span-2">
        <Input
          type="number"
          placeholder="Qty"
          value={item.quantity || ""}
          onChange={(e) => onUpdate({ quantity: Number(e.target.value) })}
          className="h-8 text-center text-sm"
        />
        <span className="mt-0.5 block text-center text-[10px] text-muted-foreground">{item.unit}</span>
      </div>
      
      <div className="col-span-4 sm:col-span-3">
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
    </div>
  );
};
