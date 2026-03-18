import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTime } from "@/lib/format";
import { kitchenTickets } from "@/lib/mock-data";

const columns = [
  { id: "pending", label: "Pendientes", tone: "warning" as const },
  { id: "preparing", label: "En preparacion", tone: "info" as const },
  { id: "ready", label: "Listos", tone: "success" as const },
  { id: "delivered", label: "Entregados", tone: "default" as const }
];

export function KitchenBoard() {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map((column) => (
        <Card key={column.id} className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-brand-text">{column.label}</p>
            <Badge tone={column.tone}>
              {kitchenTickets.filter((ticket) => ticket.status === column.id).length}
            </Badge>
          </div>

          <div className="mt-4 space-y-3">
            {kitchenTickets
              .filter((ticket) => ticket.status === column.id)
              .map((ticket) => (
                <div key={ticket.id} className="rounded-[20px] bg-brand-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-brand-text">{ticket.orderNumber}</p>
                      <p className="text-sm text-brand-muted">{ticket.table}</p>
                    </div>
                    <p className="text-xs text-brand-muted">{formatTime(ticket.createdAt)}</p>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-brand-text">
                    {ticket.items.map((item) => (
                      <p key={item.name}>
                        {item.qty} × {item.name}
                      </p>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {ticket.notes.map((note) => (
                      <Badge key={note} tone="warning">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
