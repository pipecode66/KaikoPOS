import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-black/5",
        tone === "default" && "bg-brand-secondary/80 text-brand-text",
        tone === "success" && "bg-brand-success/95 text-brand-text",
        tone === "warning" && "bg-brand-warning/95 text-brand-text",
        tone === "danger" && "bg-brand-error/95 text-brand-text",
        tone === "info" && "bg-brand-info/95 text-brand-text",
        className
      )}
      {...props}
    />
  );
}
