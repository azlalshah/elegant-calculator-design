import { useState, useMemo } from "react";
import { Header } from "@/components/calculator/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMasterPriceList } from "@/hooks/useMasterPriceList";
import { Trash2, Plus, DollarSign, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IconSelector } from "@/components/calculator/IconSelector";

const MasterPriceList = () => {
  const { items, addItem, updateItem, removeItem } = useMasterPriceList();
  const { toast } = useToast();
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newUnit, setNewUnit] = useState("nos");
  const [newCategory, setNewCategory] = useState("");
  const [search, setSearch] = useState("");

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "—";
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, search]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof filteredItems> = {};
    filteredItems.forEach((item) => {
      const cat = item.category || "Uncategorized";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [filteredItems]);

  const handleAdd = () => {
    if (!newName.trim() || !newPrice) return;
    addItem({
      name: newName.trim(),
      unitPrice: Number(newPrice),
      unit: newUnit || "nos",
      icon: "Package",
      category: newCategory.trim() || "General",
    });
    setNewName("");
    setNewPrice("");
    setNewUnit("nos");
    setNewCategory("");
    toast({ title: "Item Added", description: `${newName} added to master price list.` });
  };

  const handlePriceUpdate = (id: string, newPriceVal: number) => {
    updateItem(id, { unitPrice: newPriceVal });
    toast({ title: "Price Updated", description: "All saved estimates mein auto-update ho gaya." });
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
            Yahan items ki current prices hain. Price update karein to sab saved estimates mein auto-update ho jayega.
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

        {/* Add New Item */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add New Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
              <Input placeholder="Item name" value={newName} onChange={(e) => setNewName(e.target.value)} className="sm:col-span-2" />
              <Input type="number" placeholder="Unit Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
              <Input placeholder="Unit (nos, sqft...)" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} />
              <Input placeholder="Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            </div>
            <Button onClick={handleAdd} className="mt-3 gap-2" disabled={!newName.trim() || !newPrice}>
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </CardContent>
        </Card>

        {/* Items Count */}
        <div className="text-sm text-muted-foreground mb-3">
          Total Items: <span className="font-semibold text-foreground">{filteredItems.length}</span>
        </div>

        {/* Items by Category - Same style as Calculator */}
        {Object.entries(groupedItems).map(([category, catItems]) => (
          <Card key={category} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{category} ({catItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {catItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  {/* Icon & Name */}
                  <div className="col-span-12 flex items-center gap-3 sm:col-span-4">
                    <IconSelector
                      value={item.icon}
                      onChange={(icon) => updateItem(item.id, { icon })}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">{item.category}</span>
                    </div>
                  </div>

                  {/* Unit Price - Editable */}
                  <div className="col-span-4 sm:col-span-3">
                    <Input
                      type="number"
                      value={item.unitPrice || ""}
                      onChange={(e) => handlePriceUpdate(item.id, Number(e.target.value))}
                      className="h-8 text-center text-sm"
                    />
                    <span className="mt-0.5 block text-center text-[10px] text-muted-foreground">
                      per {item.unit}
                    </span>
                  </div>

                  {/* Current Price Display */}
                  <div className="col-span-4 text-right sm:col-span-3">
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.unitPrice)}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">current price</span>
                  </div>

                  {/* Delete */}
                  <div className="col-span-4 flex justify-end sm:col-span-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No items found.</p>
        )}
      </main>
    </div>
  );
};

export default MasterPriceList;
