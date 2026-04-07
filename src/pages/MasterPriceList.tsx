import { useState } from "react";
import { Header } from "@/components/calculator/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMasterPriceList } from "@/hooks/useMasterPriceList";
import { DollarSign, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : <LucideIcons.Package className={className} />;
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

const MasterPriceList = () => {
  const { displaySections, updatePrice } = useMasterPriceList();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const filteredSections = search.trim()
    ? displaySections
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (item) =>
              item.name.toLowerCase().includes(search.toLowerCase()) ||
              section.name.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((section) => section.items.length > 0)
    : displaySections.filter((section) => section.items.length > 0);

  const totalItems = filteredSections.reduce((sum, s) => sum + s.items.length, 0);

  const handlePriceUpdate = (itemName: string, newPrice: number) => {
    updatePrice(itemName, newPrice);
    toast({ title: "Price Updated", description: `${itemName} ki price update ho gayi. Sab estimates mein bhi change ho gaya.` });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      <main className="container py-6 max-w-5xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Master Price List
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Yahan calculator ke items ki current prices hain. Price update karein to sab saved estimates mein auto-update ho jayega.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Items Count */}
        <div className="text-sm text-muted-foreground mb-3">
          Total Items: <span className="font-semibold text-foreground">{totalItems}</span>
        </div>

        {/* Sections - same as calculator */}
        {filteredSections.map((section) => (
          <Card key={section.id} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DynamicIcon name={section.icon} className="h-4 w-4" />
                {section.name} ({section.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  {/* Icon & Name */}
                  <div className="col-span-12 flex items-center gap-3 sm:col-span-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                      <DynamicIcon name={item.icon} className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">{item.description}</span>
                    </div>
                  </div>

                  {/* Unit */}
                  <div className="col-span-3 sm:col-span-2 text-center">
                    <span className="text-xs text-muted-foreground">per {item.unit}</span>
                  </div>

                  {/* Editable Price */}
                  <div className="col-span-5 sm:col-span-3">
                    <Input
                      type="number"
                      value={item.unitPrice || ""}
                      onChange={(e) => handlePriceUpdate(item.name, Number(e.target.value))}
                      className="h-8 text-center text-sm"
                      placeholder="0"
                    />
                  </div>

                  {/* Formatted Price */}
                  <div className="col-span-4 text-right sm:col-span-2">
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.unitPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {totalItems === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No items found.</p>
        )}
      </main>
    </div>
  );
};

export default MasterPriceList;
