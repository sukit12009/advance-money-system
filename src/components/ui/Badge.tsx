import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "income" | "expense" | "success" | "warning";
  className?: string;
}

const toneClass = {
  neutral: "bg-slate-100 text-slate-700",
  income: "bg-emerald-50 text-emerald-700",
  expense: "bg-rose-50 text-rose-700",
  success: "bg-teal-50 text-teal-700",
  warning: "bg-amber-50 text-amber-800",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
