import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

// Enhanced avatar variants with animations and new styles
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full transition-all duration-200",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-20 w-20 text-2xl",
      },
      status: {
        online: "ring-2 ring-green-500",
        offline: "ring-2 ring-gray-500",
        busy: "ring-2 ring-red-500",
        away: "ring-2 ring-yellow-500",
        invisible: "ring-2 ring-transparent",
      },
      animation: {
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        none: "",
      }
    },
    defaultVariants: {
      size: "md",
      animation: "none",
    },
  }
);

// Enhanced interfaces with new features
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  spacing?: number;
  layout?: 'stack' | 'grid' | 'line';
  showCount?: boolean;
  countPosition?: 'after' | 'overlay';
}

interface AvatarStatus {
  status?: "online" | "offline" | "busy" | "away" | "invisible";
  statusPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  pulseStatus?: boolean;
}

interface EnhancedAvatarProps extends 
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
  VariantProps<typeof avatarVariants>,
  AvatarStatus {
  src?: string;
  alt?: string;
  fallback?: string;
  loading?: boolean;
  onError?: (error: Error) => void;
  placeholderType?: 'initials' | 'blur' | 'icon';
  delayMs?: number;
  animation?: "pulse" | "bounce" | "none";
  interactive?: boolean;
}

// Color generation utility for consistent avatar colors
const generateAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-100 text-red-800',
    'bg-yellow-100 text-yellow-800',
    'bg-green-100 text-green-800',
    'bg-blue-100 text-blue-800',

