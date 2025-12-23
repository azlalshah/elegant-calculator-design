import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Package, Hammer, MoreHorizontal, TrendingUp, Layers, DollarSign } from "lucide-react";
import { CostItem } from "@/types/calculator";

interface AnalyticsPanelProps {
  totals: {
    materials: number;
    labor: number;
    miscellaneous: number;
    grandTotal: number;
  };
  materials: CostItem[];
  labor: CostItem[];
  miscellaneous: CostItem[];
  workingArea: number;
}

export const AnalyticsPanel = ({ totals, materials, labor, miscellaneous, workingArea }: AnalyticsPanelProps) => {
  const chartData = [
    { name: "Materials", value: totals.materials, color: "hsl(217, 91%, 60%)" },
    { name: "Labor", value: totals.labor, color: "hsl(142, 76%, 36%)" },
    { name: "Miscellaneous", value: totals.miscellaneous, color: "hsl(38, 92%, 50%)" },
  ].filter((item) => item.value > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const allItems = [...materials, ...labor, ...miscellaneous];
  const activeItems = allItems.filter((item) => item.quantity > 0 && item.unitPrice > 0);
  
  const largestExpense = activeItems.length > 0
    ? activeItems.reduce((max, item) => 
        item.quantity * item.unitPrice > max.quantity * max.unitPrice ? item : max
      , activeItems[0])
    : null;

  const costPerSqft = workingArea > 0 ? Math.round(totals.grandTotal / workingArea) : 0;

  const stats = [
    {
      label: "Total Items",
      value: activeItems.length.toString(),
      icon: Layers,
      color: "text-primary",
    },
    {
      label: "Largest Expense",
      value: largestExpense?.name || "—",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "Cost per Sqft",
      value: costPerSqft > 0 ? formatCurrency(costPerSqft) : "—",
      icon: DollarSign,
      color: "text-warning",
    },
  ];

  if (totals.grandTotal === 0) {
    return (
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl">Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            <p className="text-center text-sm">Add items to see cost breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
            >
              <div className="flex items-center gap-3">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Breakdown</p>
          <div className="space-y-2">
            {[
              { label: "Materials", value: totals.materials, icon: Package, color: "bg-chart-materials" },
              { label: "Labor", value: totals.labor, icon: Hammer, color: "bg-chart-labor" },
              { label: "Miscellaneous", value: totals.miscellaneous, icon: MoreHorizontal, color: "bg-chart-misc" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(item.value)}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({totals.grandTotal > 0 ? Math.round((item.value / totals.grandTotal) * 100) : 0}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
