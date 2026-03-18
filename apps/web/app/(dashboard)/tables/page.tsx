import { TableTile } from "@/components/tables/table-tile";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { tableCards } from "@/lib/mock-data";

export default function TablesPage() {
  return (
    <div className="space-y-6">
      <ScreenHeader
        eyebrow="Salon"
        title="Gestion de mesas"
        description="Estados claros para disponible, ocupada y pendiente de pago. Base lista para mover, unir o dividir pedidos."
        actions={<Button>Nueva mesa rapida</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tableCards.map((table) => (
          <TableTile key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}
