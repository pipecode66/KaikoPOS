import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "default" && "bg-brand-secondary text-brand-text",
        tone === "success" && "bg-brand-success text-brand-text",
        tone === "warning" && "bg-brand-warning text-brand-text",
        tone === "danger" && "bg-brand-error text-brand-text",
        tone === "info" && "bg-brand-info text-brand-text",
        className
      )}
      {...props}
    />
  );
}
