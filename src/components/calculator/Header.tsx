import { Building2, Moon, Sun, DollarSign, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Econ Construction</h1>
            <p className="text-xs text-muted-foreground">Building Dreams, Calculating Reality</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={location.pathname === "/master-prices" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate("/master-prices")}
            className="gap-1.5 text-sm"
          >
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Price List</span>
          </Button>
          <Button
            variant={location.pathname === "/saved-estimates" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate("/saved-estimates")}
            className="gap-1.5 text-sm"
          >
            <Archive className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
