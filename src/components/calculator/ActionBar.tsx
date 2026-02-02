import { Button } from "@/components/ui/button";
import { FileDown, RotateCcw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActionBarProps {
  grandTotal: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  taxPercentage: number;
  discountPercentage: number;
  onReset: () => void;
  onExportPDF: () => void;
}

export const ActionBar = ({ 
  grandTotal, 
  subtotal, 
  discountAmount, 
  taxAmount,
  taxPercentage,
  discountPercentage,
  onReset, 
  onExportPDF 
}: ActionBarProps) => {
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = () => {
    toast({
      title: "Saved",
      description: "Your project has been saved to browser storage.",
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Subtotal:</span>
            <span className="text-sm font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {discountPercentage > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600">-{discountPercentage}%:</span>
              <span className="text-sm font-medium text-green-600">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          {taxPercentage > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-orange-600">+{taxPercentage}% Tax:</span>
              <span className="text-sm font-medium text-orange-600">+{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Grand Total:</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button size="sm" onClick={onExportPDF} className="gap-2">
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
