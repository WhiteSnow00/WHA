"use client";

import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import darkModeToggleAnimation from "@/lib/atoms/fade";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { flushSync } from "react-dom";

import {
  AnimationStart,
  AnimationVariant,
  createAnimation,
} from "./theme-animations";

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant;
  start?: AnimationStart;
  showLabel?: boolean;
  url?: string;
}

export default function ThemeToggleButton({
  variant = "circle-blur",
  start = "top-left",
  showLabel = false,
  url = "",
}: ThemeToggleAnimationProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [darkModeAnim] = useAtom(darkModeToggleAnimation);

  const styleId = "theme-transition-styles";

  const updateStyles = React.useCallback((css: string): void => {
    if (typeof window === "undefined") return;

    let styleElement = document.getElementById(
      styleId,
    ) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }, []);

  const clearStyles = React.useCallback(() => {
    if (typeof window === "undefined") return;
    document.getElementById(styleId)?.remove();
  }, []);

  const toggleTheme = React.useCallback(() => {
    if (typeof window === "undefined") return;

    const current = resolvedTheme ?? "light";
    const next = current === "dark" ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }

    const animation = createAnimation(variant, start, url, darkModeAnim);
    updateStyles(animation.css);

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    transition.finished.finally(() => {
      clearStyles();
    });
  }, [
    clearStyles,
    darkModeAnim,
    resolvedTheme,
    setTheme,
    start,
    updateStyles,
    url,
    variant,
  ]);

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="w-9 p-0 h-9 relative group cursor-pointer transition-colors"
      name="Theme Toggle Button"
    >
      <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Theme Toggle </span>
      {showLabel && (
        <>
          <span className="hidden group-hover:block border rounded-full px-2 absolute -top-10">
            {" "}
            variant = {variant}
          </span>
          <span className="hidden group-hover:block border rounded-full px-2 absolute -bottom-10">
            {" "}
            start = {start}
          </span>
        </>
      )}
    </Button>
  );
}
