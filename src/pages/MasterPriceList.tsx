import { useState } from "react";
import { Header } from "@/components/calculator/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMasterPriceList } from "@/hooks/useMasterPriceList";
import { Trash2, Plus, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MasterPriceList = () => {
  const { items, addItem, updateItem, removeItem } = useMasterPriceList();
  const { toast } = useToast();
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newUnit, setNewUnit] = useState("nos");
  const [newCategory, setNewCategory] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAdd = () => {
    if (!newName.trim() || !newPrice) return;
    addItem({
      name: newName.trim(),
      unitPrice: Number(newPrice),
      unit: newUnit || "nos",
      icon: "Package",
      category: newCategory.trim(),
    });
    setNewName("");
    setNewPrice("");
    setNewUnit("nos");
    setNewCategory("");
    toast({ title: "Item Added", description: `${newName} added to master price list.` });
  };

  const handlePriceUpdate = (id: string, newPriceVal: number) => {
    updateItem(id, { unitPrice: newPriceVal });
    toast({ title: "Price Updated", description: "All saved estimates have been auto-updated." });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      <main className="container py-6 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Master Price List
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Yahan items ki prices set karein. Jab price update karein ge to sab saved estimates mein auto-update ho jayega.
          </p>
        </div>

        {/* Add New Item */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add New Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
              <Input
                placeholder="Item name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="sm:col-span-2"
              />
              <Input
                type="number"
                placeholder="Unit Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              <Input
                placeholder="Unit (nos, sqft...)"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
              />
              <Input
                placeholder="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd} className="mt-3 gap-2" disabled={!newName.trim() || !newPrice}>
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Items ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No items yet. Add your first item above.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-2 text-center">Unit</div>
                  <div className="col-span-2 text-center">Category</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center rounded-lg border border-border bg-card p-3 hover:bg-muted/50">
                    <div className="col-span-4">
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, { name: e.target.value })}
                        className="h-8 text-sm font-medium"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.unitPrice || ""}
                        onChange={(e) => handlePriceUpdate(item.id, Number(e.target.value))}
                        className="h-8 text-sm text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                        className="h-8 text-sm text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={item.category}
                        onChange={(e) => updateItem(item.id, { category: e.target.value })}
                        className="h-8 text-sm text-center"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MasterPriceList;
