import { PosWorkstation } from "@/components/pos/pos-workstation";
import { ScreenHeader } from "@/components/ui/screen-header";

export default function PosPage() {
  return (
    <div className="space-y-6">
      <ScreenHeader
        eyebrow="Punto de venta"
        title="Caja y toma de pedidos"
        description="Interfaz tactil optimizada para operar rapido: categorias a la izquierda, productos al centro y carrito siempre visible."
      />
      <PosWorkstation />
    </div>
  );
}
