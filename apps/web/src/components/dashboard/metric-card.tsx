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
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-brand-muted">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-brand-text">
            {isMoney ? formatCurrency(value) : formatNumber(value)}
          </p>
        </div>
        <Badge tone={tone}>{accent}</Badge>
      </div>
    </Card>
  );
}
