import { useState, useMemo } from "react";
import { Header } from "@/components/calculator/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMasterPriceList } from "@/hooks/useMasterPriceList";
import { Trash2, Plus, DollarSign, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MasterPriceList = () => {
  const { items, addItem, updateItem, removeItem } = useMasterPriceList();
  const { toast } = useToast();
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newUnit, setNewUnit] = useState("nos");
  const [newCategory, setNewCategory] = useState("");
  const [search, setSearch] = useState("");

  const formatCurrency = (amount: number) => {
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

        {/* Items by Category */}
        <div className="text-sm text-muted-foreground mb-3">
          Total Items: <span className="font-semibold text-foreground">{filteredItems.length}</span>
        </div>

        {Object.entries(groupedItems).map(([category, catItems]) => (
          <Card key={category} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{category} ({catItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Item Name</th>
                      <th className="text-center px-4 py-2 font-medium text-muted-foreground">Current Price</th>
                      <th className="text-center px-4 py-2 font-medium text-muted-foreground">Unit</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {catItems.map((item) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2 font-medium">{item.name}</td>
                        <td className="px-4 py-2 text-center">
                          <Input
                            type="number"
                            value={item.unitPrice || ""}
                            onChange={(e) => handlePriceUpdate(item.id, Number(e.target.value))}
                            className="h-8 text-sm text-center w-28 mx-auto"
                          />
                        </td>
                        <td className="px-4 py-2 text-center text-muted-foreground">{item.unit}</td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
