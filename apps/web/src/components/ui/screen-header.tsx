import { ReactNode } from "react";

export function ScreenHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-muted">{eyebrow}</p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-text">{title}</h1>
          <p className="max-w-2xl text-sm text-brand-muted">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
