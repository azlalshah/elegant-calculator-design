import { useEffect } from "react";
import { Header } from "@/components/calculator/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSavedEstimates } from "@/hooks/useSavedEstimates";
import { Trash2, FileText, ArrowRight, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const SavedEstimates = () => {
  const { estimates, removeEstimate, refreshFromStorage } = useSavedEstimates();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Refresh from storage on mount to pick up auto-updated prices
  refreshFromStorage();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLoad = (estimate: typeof estimates[0]) => {
    localStorage.setItem("econ-calculator-data", JSON.stringify(estimate.data));
    toast({ title: "Estimate Loaded", description: `"${estimate.name}" loaded into calculator.` });
    navigate("/");
  };

  const handleDelete = (id: string) => {
    removeEstimate(id);
    toast({ title: "Deleted", description: "Estimate removed." });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      <main className="container py-6 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Archive className="h-6 w-6 text-primary" />
            Saved Estimates
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Jab bhi aap PDF export karein ge, estimate yahan auto-save ho jayega. Master Price List update karne par yeh bhi auto-update hote hain.
          </p>
        </div>

        {estimates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Abhi tak koi estimate save nahi hua.</p>
              <p className="text-sm text-muted-foreground mt-1">PDF export karne par estimates yahan save hon ge.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {estimates.map((est) => (
              <Card key={est.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{est.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{formatDate(est.savedAt)}</span>
                        <Badge variant="secondary" className="text-xs">
                          {est.data.sections.reduce((sum, s) => sum + s.items.length, 0)} items
                        </Badge>
                        {est.data.projectInfo.workingArea > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {est.data.projectInfo.workingArea} sqft
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">{formatCurrency(est.totals.grandTotal)}</span>
                        {est.ratePerSqft > 0 && (
                          <p className="text-xs text-muted-foreground">{formatCurrency(est.ratePerSqft)}/sqft</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleLoad(est)} className="gap-1">
                        Load <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(est.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedEstimates;
