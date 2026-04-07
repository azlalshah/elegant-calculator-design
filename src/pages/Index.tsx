import { useState, useEffect } from "react";
import { Header } from "@/components/calculator/Header";
import { ProjectInfoCard } from "@/components/calculator/ProjectInfoCard";
import { TemplateSelector } from "@/components/calculator/TemplateSelector";
import { CostBreakdown } from "@/components/calculator/CostBreakdown";
import { AnalyticsPanel } from "@/components/calculator/AnalyticsPanel";
import { ActionBar } from "@/components/calculator/ActionBar";
import { PDFPreviewModal } from "@/components/calculator/PDFPreviewModal";
import { useCalculator } from "@/hooks/useCalculator";
import { exportToPDF } from "@/components/calculator/PDFExport";
import { useSavedEstimates } from "@/hooks/useSavedEstimates";
import { useMasterPriceList } from "@/hooks/useMasterPriceList";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { saveEstimate } = useSavedEstimates();
  const { syncFromCalculator } = useMasterPriceList();
  const { toast } = useToast();
  const {
    state,
    updateProjectInfo,
    updateItem,
    addItem,
    removeItem,
    duplicateItem,
    reorderItems,
    updateSection,
    addSection,
    removeSection,
    loadTemplate,
    resetCalculator,
    totals,
    ratePerSqft,
  } = useCalculator();

  const [showPreview, setShowPreview] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleExportPDF = () => {
    exportToPDF({ state, totals, ratePerSqft });
    saveEstimate(state, totals, ratePerSqft);
    syncFromCalculator(state.sections);
    toast({ title: "Auto-Saved", description: "Estimate & prices synced to Master Price List." });
    setShowPreview(false);
  };

  const handleOpenPreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <TemplateSelector onSelectTemplate={loadTemplate} />

            <ProjectInfoCard
              projectInfo={state.projectInfo}
              onUpdate={updateProjectInfo}
              ratePerSqft={ratePerSqft}
              grandTotal={totals.grandTotal}
            />

            <CostBreakdown
              sections={state.sections}
              totals={totals}
              onUpdateItem={updateItem}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onDuplicateItem={duplicateItem}
              onReorderItems={reorderItems}
              onUpdateSection={updateSection}
              onAddSection={addSection}
              onRemoveSection={removeSection}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <AnalyticsPanel
              totals={totals}
              sections={state.sections}
              workingArea={state.projectInfo.workingArea}
              duration={state.projectInfo.duration}
              taxPercentage={state.projectInfo.taxPercentage}
              discountPercentage={state.projectInfo.discountPercentage}
              onUpdateProjectInfo={updateProjectInfo}
            />
          </div>
        </div>
      </main>

      <ActionBar
        grandTotal={totals.grandTotal}
        subtotal={totals.subtotal}
        discountAmount={totals.discountAmount}
        taxAmount={totals.taxAmount}
        taxPercentage={state.projectInfo.taxPercentage}
        discountPercentage={state.projectInfo.discountPercentage}
        onReset={resetCalculator}
        onExportPDF={handleOpenPreview}
      />

      <PDFPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        state={state}
        totals={totals}
        ratePerSqft={ratePerSqft}
        onExport={handleExportPDF}
      />
    </div>
  );
};

export default Index;
