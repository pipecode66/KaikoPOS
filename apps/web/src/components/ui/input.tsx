import { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-brand-text outline-none transition placeholder:text-brand-muted focus:border-brand-primary",
        className
      )}
      {...props}
    />
  );
}
