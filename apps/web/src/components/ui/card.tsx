import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/80 bg-white/88 shadow-soft backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
