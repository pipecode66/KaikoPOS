"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { categories, products } from "@/lib/mock-data";
import { usePosStore } from "@/lib/store/use-pos-store";
import { cn } from "@/lib/utils";

const paymentOptions = ["cash", "card", "transfer", "mixed"] as const;
const orderTypes = ["counter", "table", "delivery"] as const;

export function PosWorkstation() {
  const [feedback, setFeedback] = useState("Listo para tomar pedidos");
  const {
    activeCategoryId,
    cart,
    orderType,
    paymentMethod,
    setCategory,
    setOrderType,
    setPaymentMethod,
    addProduct,
    increment,
    decrement,
    setNotes,
    clear
  } = usePosStore();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => activeCategoryId === "all" || product.categoryId === activeCategoryId);
  }, [activeCategoryId]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const service = orderType === "delivery" ? 2500 : 0;
  const total = subtotal + service;
  const units = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_380px]">
      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">Categorias</p>
        <div className="mt-4 space-y-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setCategory(category.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-[20px] px-4 py-4 text-left transition",
                activeCategoryId === category.id ? "bg-white shadow-soft" : "bg-brand-surface/85 hover:bg-brand-secondary/40"
              )}
            >
              <span>
                <span className="block text-sm font-medium text-brand-text">{category.name}</span>
                <span className="block text-xs text-brand-muted">{category.count} productos</span>
              </span>
              <Badge tone={activeCategoryId === category.id ? "info" : "default"}>{category.count}</Badge>
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="overflow-hidden border-none bg-[linear-gradient(140deg,rgba(200,162,200,0.24),rgba(255,255,255,0.94))] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">Venta rapida</p>
              <h2 className="mt-1 text-2xl font-semibold text-brand-text">Selecciona productos</h2>
              <p className="mt-2 text-sm text-brand-muted">Dos toques para vender: agregar, revisar y cobrar.</p>
            </div>
            <Badge tone="success">{feedback}</Badge>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["Items", `${units}`],
              ["Tipo de orden", orderType],
              ["Pago", paymentMethod]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[20px] bg-white/90 px-4 py-4 shadow-soft">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-muted">{label}</p>
                <p className="mt-2 text-lg font-semibold capitalize text-brand-text">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className={cn("p-4", !product.available && "opacity-60")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-brand-text">{product.name}</p>
                  <p className="mt-1 text-sm text-brand-muted">{product.subtitle}</p>
                </div>
                <Badge tone={product.available ? "success" : "warning"}>
                  {product.available ? "Disponible" : "No disponible"}
                </Badge>
              </div>
              <div className="mt-6 flex items-end justify-between gap-3">
                <p className="text-xl font-semibold text-brand-text">{formatCurrency(product.price)}</p>
                <Button
                  size="lg"
                  onClick={() => {
                    addProduct(product.id);
                    setFeedback(`${product.name} agregado al pedido`);
                  }}
                  disabled={!product.available}
                >
                  Agregar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">Pedido actual</p>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-[22px] bg-brand-surface/90 p-2">
          {orderTypes.map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={cn(
                "rounded-[16px] px-3 py-3 text-sm font-medium capitalize transition",
                orderType === type ? "bg-white text-brand-text shadow-soft" : "text-brand-muted"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {cart.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-black/10 p-6 text-center text-sm text-brand-muted">
              Aun no hay productos en el pedido.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="rounded-[22px] bg-brand-surface/90 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-brand-text">{item.name}</p>
                    <p className="text-sm text-brand-muted">{formatCurrency(item.price)}</p>
                  </div>
                  <Badge tone="info">x{item.quantity}</Badge>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => decrement(item.productId)}>
                    -
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => increment(item.productId)}>
                    +
                  </Button>
                  <Input
                    value={item.notes ?? ""}
                    onChange={(event) => setNotes(item.productId, event.target.value)}
                    placeholder="Nota para cocina"
                    className="h-10"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {paymentOptions.map((option) => (
            <button
              key={option}
              onClick={() => setPaymentMethod(option)}
              className={cn(
                "rounded-[18px] px-3 py-3 text-sm font-medium capitalize transition",
                paymentMethod === option ? "bg-brand-primary text-brand-text shadow-soft" : "bg-brand-surface/90 text-brand-muted"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[24px] bg-brand-secondary/45 p-4">
          <div className="flex items-center justify-between text-sm text-brand-muted">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-brand-muted">
            <span>Servicio</span>
            <span>{formatCurrency(service)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-lg font-semibold text-brand-text">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <Button
            size="lg"
            variant="secondary"
            disabled={cart.length === 0}
            onClick={() => setFeedback("Pedido enviado a cocina")}
          >
            Enviar a cocina
          </Button>
          <Button
            size="lg"
            disabled={cart.length === 0}
            onClick={() => {
              setFeedback(`Pago registrado por ${formatCurrency(total)}`);
              clear();
            }}
          >
            Cobrar pedido
          </Button>
        </div>
      </Card>
    </div>
  );
}
