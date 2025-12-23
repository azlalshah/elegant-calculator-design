import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalculatorState, CostSection } from "@/types/calculator";
import { Printer, Download } from "lucide-react";

interface PDFPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: CalculatorState;
  totals: Record<string, number>;
  ratePerSqft: number;
  onExport: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PDFPreviewModal = ({
  open,
  onOpenChange,
  state,
  totals,
  ratePerSqft,
  onExport,
}: PDFPreviewModalProps) => {
  const { projectInfo, sections } = state;
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Calculate chart data from sections
  const chartData = sections.map((section) => ({
    name: section.name,
    value: totals[section.id] || 0,
  })).filter(item => item.value > 0);

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Print Preview
          </DialogTitle>
        </DialogHeader>

        {/* Preview Content */}
        <div className="bg-white text-black rounded-lg p-6 space-y-6 text-sm">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-blue-500 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Econ Construction</h1>
              <p className="text-gray-500 text-xs">Building Dreams, Calculating Reality</p>
            </div>
            <div className="text-right text-xs text-gray-600">
              <p className="font-semibold text-black">Cost Estimate</p>
              <p>Date: {date}</p>
              <p>{projectInfo.category}: {formatCurrency(ratePerSqft)}/sqft</p>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-blue-600 mb-3">Project Information</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500 uppercase text-[10px]">Client Name</span>
                <p className="font-medium">{projectInfo.clientName || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[10px]">Project Name</span>
                <p className="font-medium">{projectInfo.projectName || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[10px]">Location</span>
                <p className="font-medium">{projectInfo.location || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[10px]">Duration</span>
                <p className="font-medium">{projectInfo.duration || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[10px]">Working Area</span>
                <p className="font-medium">{projectInfo.workingArea ? `${projectInfo.workingArea.toLocaleString()} sqft` : "—"}</p>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[10px]">Notes</span>
                <p className="font-medium">{projectInfo.notes || "—"}</p>
              </div>
            </div>
          </div>

          {/* Cost Distribution Chart Preview */}
          {totalValue > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-600 mb-3">Cost Distribution by Section</h3>
              <div className="space-y-3">
                {chartData.map((item, index) => {
                  const percentage = (item.value / totalValue) * 100;
                  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-900">{item.name}</span>
                        <span className="font-medium text-gray-700">{formatCurrency(item.value)} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: colors[index % colors.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sections Tables */}
          {sections.map((section) => {
            const sectionTotal = totals[section.id] || 0;
            if (section.items.length === 0) return null;

            return (
              <div key={section.id} className="space-y-2">
                <h3 className="text-sm font-semibold text-blue-600 border-b pb-1">{section.name}</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left text-[10px] uppercase text-gray-500">Item</th>
                      <th className="p-2 text-left text-[10px] uppercase text-gray-500">Description</th>
                      <th className="p-2 text-center text-[10px] uppercase text-gray-500">Qty</th>
                      <th className="p-2 text-center text-[10px] uppercase text-gray-500">Unit</th>
                      <th className="p-2 text-right text-[10px] uppercase text-gray-500">Rate</th>
                      <th className="p-2 text-right text-[10px] uppercase text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 text-gray-600">{item.description}</td>
                        <td className="p-2 text-center">{item.quantity || 0}</td>
                        <td className="p-2 text-center">{item.unit}</td>
                        <td className="p-2 text-right">{item.unitPrice > 0 ? formatCurrency(item.unitPrice) : "—"}</td>
                        <td className="p-2 text-right font-medium">
                          {item.quantity * item.unitPrice > 0 ? formatCurrency(item.quantity * item.unitPrice) : "—"}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan={5} className="p-2">Subtotal</td>
                      <td className="p-2 text-right">{formatCurrency(sectionTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}

          {/* Summary */}
          <div className="bg-slate-800 text-white rounded-lg p-4">
            <h3 className="text-xs opacity-80 mb-3">COST SUMMARY</h3>
            {sections.map((section) => {
              const sectionTotal = totals[section.id] || 0;
              if (sectionTotal === 0) return null;
              return (
                <div key={section.id} className="flex justify-between py-1 border-b border-white/10">
                  <span>{section.name}</span>
                  <span>{formatCurrency(sectionTotal)}</span>
                </div>
              );
            })}
            <div className="flex justify-between py-2 mt-2 border-t border-white/20 text-lg font-bold">
              <span>Grand Total</span>
              <span>{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
