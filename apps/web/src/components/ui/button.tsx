import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "success" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-brand-primary text-brand-text shadow-soft hover:brightness-[0.98]",
        variant === "secondary" && "bg-white text-brand-text shadow-soft ring-1 ring-black/5 hover:bg-brand-secondary/40",
        variant === "ghost" && "bg-transparent text-brand-muted hover:bg-brand-secondary/30",
        variant === "success" && "bg-brand-success text-brand-text shadow-soft",
        variant === "danger" && "bg-brand-error text-brand-text shadow-soft",
        size === "sm" && "h-10 px-4 text-sm",
        size === "md" && "h-12 px-5 text-sm",
        size === "lg" && "h-14 px-6 text-base",
        className
      )}
      {...props}
    />
  );
}
