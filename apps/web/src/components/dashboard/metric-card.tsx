import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/format";

export function MetricCard({
  label,
  value,
  accent
}: {
  label: string;
  value: number;
  accent: "success" | "warning" | "error" | "info";
}) {
  const isMoney = label.toLowerCase().includes("ventas") || label.toLowerCase().includes("caja");
  const tone = accent === "error" ? "danger" : accent;

  return (
    <Card className="overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-brand-muted">{label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-brand-text">
            {isMoney ? formatCurrency(value) : formatNumber(value)}
          </p>
        </div>
        <Badge tone={tone}>{accent}</Badge>
      </div>
      <div className="mt-5 h-1.5 rounded-full bg-brand-surface">
        <div
          className="h-full rounded-full"
          style={{
            width: accent === "success" ? "82%" : accent === "info" ? "68%" : accent === "warning" ? "54%" : "36%",
            backgroundColor:
              accent === "success"
                ? "var(--color-success)"
                : accent === "info"
                  ? "var(--color-info)"
                  : accent === "warning"
                    ? "var(--color-warning)"
                    : "var(--color-error)"
          }}
        />
      </div>
    </Card>
  );
}
