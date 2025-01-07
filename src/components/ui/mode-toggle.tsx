import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import * as React from "react";

type Theme = "theme-light" | "dark" | "system";

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<Theme>("dark");
  const [isMounted, setIsMounted] = React.useState(false);

  // Initialize theme from localStorage or default to dark
  React.useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem("theme") as Theme;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      setThemeState("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Handle system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        updateTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const updateTheme = React.useCallback((newTheme: Theme) => {
    const isDark =
      newTheme === "dark" ||
      (newTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Add transition disable class
    document.documentElement.classList.add("disable-transitions");

    // Update theme
    document.documentElement.classList.toggle("dark", isDark);

    // Force a reflow
    window.getComputedStyle(document.documentElement).getPropertyValue("opacity");

    // Remove transition disable class after animation frame
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("disable-transitions");
    });

    // Save to localStorage
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="group relative"
          title="Toggle theme"
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-background/95 backdrop-blur-sm animate-in slide-in-from-top-2"
      >
        <DropdownMenuItem 
          onClick={() => updateTheme("theme-light")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Sun className="mr-2 size-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => updateTheme("dark")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Moon className="mr-2 size-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => updateTheme("system")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Laptop className="mr-2 size-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
