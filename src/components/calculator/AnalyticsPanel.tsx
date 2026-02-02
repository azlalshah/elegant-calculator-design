import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, Layers, DollarSign, Percent, Tag } from "lucide-react";
import { CostSection, ProjectInfo } from "@/types/calculator";

interface AnalyticsPanelProps {
  totals: Record<string, number>;
  sections: CostSection[];
  workingArea: number;
  duration: string;
  taxPercentage: number;
  discountPercentage: number;
  onUpdateProjectInfo: (updates: Partial<ProjectInfo>) => void;
}

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export const AnalyticsPanel = ({ totals, sections, workingArea, duration, taxPercentage, discountPercentage, onUpdateProjectInfo }: AnalyticsPanelProps) => {
  const chartData = sections
    .map((section, index) => ({
      name: section.name,
      value: totals[section.id] || 0,
      color: COLORS[index % COLORS.length],
    }))
    .filter((item) => item.value > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const allItems = sections.flatMap((s) => s.items);
  const activeItems = allItems.filter((item) => item.quantity > 0 && item.unitPrice > 0);

  const largestExpense =
    activeItems.length > 0
      ? activeItems.reduce((max, item) =>
          item.quantity * item.unitPrice > max.quantity * max.unitPrice ? item : max
        , activeItems[0])
      : null;

  const costPerSqft = workingArea > 0 ? Math.round(totals.grandTotal / workingArea) : 0;

  // Duration chart data
  const durationMonths = parseInt(duration) || 0;
  const durationData = durationMonths > 0 ? [
    { name: "Planning", months: Math.round(durationMonths * 0.1) || 1 },
    { name: "Foundation", months: Math.round(durationMonths * 0.15) || 1 },
    { name: "Structure", months: Math.round(durationMonths * 0.3) || 1 },
    { name: "Finishing", months: Math.round(durationMonths * 0.35) || 1 },
    { name: "Handover", months: Math.round(durationMonths * 0.1) || 1 },
  ] : [];

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

        {/* Duration Bar Chart */}
        {durationData.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Project Timeline</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value} month(s)`, "Duration"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="months" radius={[0, 4, 4, 0]}>
                    {durationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

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

        {/* Tax & Discount Inputs */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Adjustments</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="discount" className="text-xs flex items-center gap-1">
                <Tag className="h-3 w-3 text-success" />
                Discount %
              </Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={discountPercentage || ""}
                onChange={(e) => onUpdateProjectInfo({ discountPercentage: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="h-8"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tax" className="text-xs flex items-center gap-1">
                <Percent className="h-3 w-3 text-warning" />
                Tax %
              </Label>
              <Input
                id="tax"
                type="number"
                min="0"
                max="100"
                value={taxPercentage || ""}
                onChange={(e) => onUpdateProjectInfo({ taxPercentage: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Breakdown</p>
          <div className="space-y-2">
            {sections.map((section, index) => {
              const sectionTotal = totals[section.id] || 0;
              if (sectionTotal === 0) return null;
              return (
                <div key={section.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{section.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(sectionTotal)}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({totals.subtotal > 0 ? Math.round((sectionTotal / totals.subtotal) * 100) : 0}%)
                    </span>
                  </span>
                </div>
              );
            })}
            {/* Subtotal */}
            <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-sm font-medium">{formatCurrency(totals.subtotal)}</span>
            </div>
            {/* Discount */}
            {discountPercentage > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-success">Discount ({discountPercentage}%)</span>
                <span className="text-sm font-medium text-success">-{formatCurrency(totals.discountAmount)}</span>
              </div>
            )}
            {/* Tax */}
            {taxPercentage > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-warning">Tax ({taxPercentage}%)</span>
                <span className="text-sm font-medium text-warning">+{formatCurrency(totals.taxAmount)}</span>
              </div>
            )}
            {/* Grand Total */}
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-sm font-semibold">Grand Total</span>
              <span className="text-base font-bold text-primary">{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
