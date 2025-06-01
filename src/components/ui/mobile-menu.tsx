import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NAV_LINKS } from "@consts";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon?: LucideIcon;
}

interface MobileMenuProps {
  className?: string;
  animationDuration?: number;
  closeOnNavigation?: boolean;
  showIcons?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  className,
  animationDuration = 200,
  closeOnNavigation = true,
  showIcons = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const navLinks = NAV_LINKS as NavLink[];

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % navLinks.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex(
            (prev) => (prev - 1 + navLinks.length) % navLinks.length
          );
          break;
        case "Escape":
          setIsOpen(false);
          break;
        case "Enter":
          if (activeIndex >= 0) {
            window.location.href = navLinks[activeIndex].href;
            setIsOpen(false);
          }
          break;
      }
    },
    [isOpen]
  );

  // Handle touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (diff > 50) {
      // Swipe left
      setIsOpen(false);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle Astro page transitions
  useEffect(() => {
    const handleViewTransitionStart = () => {
      setIsOpen(false);
      setActiveIndex(-1);
    };

    document.addEventListener("astro:before-swap", handleViewTransitionStart);
    return () => {
      document.removeEventListener(
        "astro:before-swap",
        handleViewTransitionStart
      );
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className={cn("relative z-50", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "md:hidden transition-all duration-200",
              isOpen && "bg-secondary"
            )}
            title="Menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <Menu className="h-5 w-5 transition-transform duration-200" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn(
            "bg-background/95 backdrop-blur-sm",
            "w-56 animate-in slide-in-from-top-5",
            "border rounded-lg shadow-lg"
          )}
          style={{
            animationDuration: `${animationDuration}ms`,
            transformOrigin: "top right",
          }}
        >
          {navLinks.map((item, index) => (
            <DropdownMenuItem
              key={item.href}
              asChild
              className={cn(
                "flex items-center gap-2 p-3 text-lg font-medium capitalize",
                "transition-colors duration-200",
                "focus:bg-accent focus:text-accent-foreground",
                activeIndex === index && "bg-accent/50"
              )}
            >
              <a
                href={item.href}
                className="w-full"
                onClick={() => closeOnNavigation && setIsOpen(false)}
                onKeyDown={(e) =>
                  e.key === "Enter" && closeOnNavigation && setIsOpen(false)
                }
                role="menuitem"
                tabIndex={0}
              >
                <span className="flex items-center gap-2">
                  {showIcons && item.icon && (
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  )}
                  {item.label}
                </span>
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileMenu;
