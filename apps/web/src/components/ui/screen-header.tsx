import { ReactNode } from "react";

export function ScreenHeader({
  eyebrow,
  title,
  description,
  actions,
  chips
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  chips?: string[];
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <p className="inline-flex rounded-full bg-brand-secondary/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">
          {eyebrow}
        </p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-text lg:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-brand-muted">{description}</p>
        </div>
        {chips?.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-black/5 bg-white/85 px-3 py-1.5 text-xs font-medium text-brand-muted shadow-soft"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
