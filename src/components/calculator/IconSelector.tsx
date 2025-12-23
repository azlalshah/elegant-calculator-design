import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AVAILABLE_ICONS } from "@/types/calculator";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface IconSelectorProps {
  value: string;
  onChange: (icon: string) => void;
}

export const IconSelector = ({ value, onChange }: IconSelectorProps) => {
  const [open, setOpen] = useState(false);
  const CurrentIcon = (Icons[value as keyof typeof Icons] as LucideIcon) || Icons.Package;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
        >
          <CurrentIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <div className="grid grid-cols-6 gap-1">
          {AVAILABLE_ICONS.map((iconName) => {
            const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon;
            if (!Icon) return null;
            return (
              <Button
                key={iconName}
                variant={value === iconName ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9"
                onClick={() => {
                  onChange(iconName);
                  setOpen(false);
                }}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
