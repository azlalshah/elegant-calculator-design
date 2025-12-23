import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectTemplates } from "@/data/templates";
import { CalculatorState } from "@/types/calculator";
import { FileStack, Building, Building2, Plus } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (data: CalculatorState) => void;
}

const templateIcons = {
  empty: Plus,
  "g2-finishing": Building,
  "g3-structure": Building2,
};

export const TemplateSelector = ({ onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <Card className="shadow-card animate-fade-in">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <FileStack className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Quick Templates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {projectTemplates.map((template) => {
            const Icon = templateIcons[template.id as keyof typeof templateIcons] || FileStack;
            return (
              <Button
                key={template.id}
                variant={template.id === "empty" ? "outline" : "secondary"}
                size="sm"
                onClick={() => onSelectTemplate(template.data)}
                className="gap-2"
              >
                <Icon className="h-3.5 w-3.5" />
                {template.name}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
