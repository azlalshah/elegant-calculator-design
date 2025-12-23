import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProjectInfo } from "@/types/calculator";
import { MapPin, User, Briefcase, Clock, Ruler, FileText, Calculator } from "lucide-react";

interface ProjectInfoCardProps {
  projectInfo: ProjectInfo;
  onUpdate: (updates: Partial<ProjectInfo>) => void;
  ratePerSqft: number;
  grandTotal: number;
}


export const ProjectInfoCard = ({ projectInfo, onUpdate, ratePerSqft, grandTotal }: ProjectInfoCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Project Information</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {projectInfo.category}: {formatCurrency(ratePerSqft)}/sqft
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="flex items-center gap-2 text-sm">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Client Name
            </Label>
            <Input
              id="clientName"
              placeholder="Enter client name"
              value={projectInfo.clientName}
              onChange={(e) => onUpdate({ clientName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectName" className="flex items-center gap-2 text-sm">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              Project Name
            </Label>
            <Input
              id="projectName"
              placeholder="Enter project name"
              value={projectInfo.projectName}
              onChange={(e) => onUpdate({ projectName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="Project location"
              value={projectInfo.location}
              onChange={(e) => onUpdate({ location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Duration
            </Label>
            <Input
              id="duration"
              placeholder="e.g., 6 months"
              value={projectInfo.duration}
              onChange={(e) => onUpdate({ duration: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="workingArea" className="flex items-center gap-2 text-sm">
              <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
              Working Area (sqft)
            </Label>
            <Input
              id="workingArea"
              type="number"
              placeholder="0"
              value={projectInfo.workingArea || ""}
              onChange={(e) => onUpdate({ workingArea: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2 text-sm">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Category
            </Label>
            <Input
              id="category"
              placeholder="Enter category"
              value={projectInfo.category}
              onChange={(e) => onUpdate({ category: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm">
              <Calculator className="h-3.5 w-3.5 text-muted-foreground" />
              Cost per Sqft
            </Label>
            <div className="flex h-9 items-center rounded-md border border-input bg-muted/50 px-3">
              <span className="text-sm font-medium">
                {projectInfo.workingArea > 0 ? formatCurrency(grandTotal / projectInfo.workingArea) : "—"}
              </span>
            </div>
          </div>
          <div></div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any special instructions or notes..."
            value={projectInfo.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="mt-4 rounded-lg bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Grand Total</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(grandTotal)}</span>
          </div>
          {projectInfo.workingArea > 0 && (
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Calculated Rate</span>
              <span className="text-sm font-medium">{formatCurrency(ratePerSqft)}/sqft</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
