import { KitchenBoard } from "@/components/kitchen/kitchen-board";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";

export default function KitchenPage() {
  return (
    <div className="space-y-6">
      <ScreenHeader
        eyebrow="Kitchen display"
        title="Cocina en tiempo real"
        description="Tickets organizados por estado, notas visibles y estructura preparada para WebSockets sobre Socket.IO."
        actions={<Button variant="secondary">Filtrar tickets</Button>}
      />
      <KitchenBoard />
    </div>
  );
}
