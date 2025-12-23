import { useEffect } from "react";
import { Header } from "@/components/calculator/Header";
import { ProjectInfoCard } from "@/components/calculator/ProjectInfoCard";
import { TemplateSelector } from "@/components/calculator/TemplateSelector";
import { CostBreakdown } from "@/components/calculator/CostBreakdown";
import { AnalyticsPanel } from "@/components/calculator/AnalyticsPanel";
import { ActionBar } from "@/components/calculator/ActionBar";
import { useCalculator } from "@/hooks/useCalculator";
import { exportToPDF } from "@/components/calculator/PDFExport";

const Index = () => {
  const {
    state,
    updateProjectInfo,
    updateItem,
    addItem,
    removeItem,
    loadTemplate,
    resetCalculator,
    totals,
    ratePerSqft,
  } = useCalculator();

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleExportPDF = () => {
    exportToPDF({ state, totals, ratePerSqft });
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
              materials={state.materials}
              labor={state.labor}
              miscellaneous={state.miscellaneous}
              totals={totals}
              onUpdateItem={updateItem}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <AnalyticsPanel
              totals={totals}
              materials={state.materials}
              labor={state.labor}
              miscellaneous={state.miscellaneous}
              workingArea={state.projectInfo.workingArea}
            />
          </div>
        </div>
      </main>

      <ActionBar
        grandTotal={totals.grandTotal}
        onReset={resetCalculator}
        onExportPDF={handleExportPDF}
      />
    </div>
  );
};

export default Index;
