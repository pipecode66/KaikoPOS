import type {
  CashMovementItem,
  IngredientRow,
  KitchenTicketCard,
  ProductCard,
  ProductCategory,
  TableCard,
  UserRow
} from "./types";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", caption: "Resumen operativo" },
  { href: "/pos", label: "POS", caption: "Venta rapida" },
  { href: "/tables", label: "Mesas", caption: "Salon y barra" },
  { href: "/kitchen", label: "Cocina", caption: "KDS en vivo" },
  { href: "/cash-register", label: "Caja", caption: "Turnos y arqueo" },
  { href: "/products", label: "Productos", caption: "Catalogo" },
  { href: "/inventory", label: "Inventario", caption: "Ingredientes" },
  { href: "/reports", label: "Reportes", caption: "Ventas y margenes" },
  { href: "/users", label: "Usuarios", caption: "Accesos y auditoria" }
];

export const categories: ProductCategory[] = [
  { id: "all", name: "Todo", count: 12 },
  { id: "coffee", name: "Cafe", count: 4 },
  { id: "bakery", name: "Panaderia", count: 3 },
  { id: "kitchen", name: "Cocina", count: 3 },
  { id: "cold", name: "Frias", count: 2 }
];

export const products: ProductCard[] = [
  { id: "p1", name: "Espresso Doble", subtitle: "18g cafe, taza pequena", price: 7000, categoryId: "coffee", available: true },
  { id: "p2", name: "Capuccino Vainilla", subtitle: "Leche vaporizada", price: 12500, categoryId: "coffee", available: true },
  { id: "p3", name: "Latte Caramelo", subtitle: "Shot doble + sirope", price: 14500, categoryId: "coffee", available: true },
  { id: "p4", name: "Americano", subtitle: "Doble carga", price: 8500, categoryId: "coffee", available: true },
  { id: "p5", name: "Croissant Mantequilla", subtitle: "Horneado del dia", price: 8500, categoryId: "bakery", available: true },
  { id: "p6", name: "Pain au Chocolat", subtitle: "Chocolate oscuro", price: 9800, categoryId: "bakery", available: true },
  { id: "p7", name: "Roll de Canela", subtitle: "Glaseado suave", price: 9400, categoryId: "bakery", available: false },
  { id: "p8", name: "Sandwich Pavo Brie", subtitle: "Pan campesino", price: 21500, categoryId: "kitchen", available: true },
  { id: "p9", name: "Toast Aguacate", subtitle: "Semillas y limon", price: 18500, categoryId: "kitchen", available: true },
  { id: "p10", name: "Quiche Espinaca", subtitle: "Porcion individual", price: 16800, categoryId: "kitchen", available: true },
  { id: "p11", name: "Te Helado Limon", subtitle: "Base natural", price: 9000, categoryId: "cold", available: true },
  { id: "p12", name: "Soda de Frutos", subtitle: "Fruta roja y gas", price: 11000, categoryId: "cold", available: true }
];

export const dashboardMetrics: Array<{
  label: string;
  value: number;
  accent: "success" | "warning" | "error" | "info";
}> = [
  { label: "Ventas hoy", value: 1845000, accent: "success" },
  { label: "Tickets activos", value: 9, accent: "info" },
  { label: "Caja esperada", value: 387500, accent: "warning" },
  { label: "Stock critico", value: 4, accent: "error" }
];

export const tableCards: TableCard[] = [
  { id: "t1", name: "Mesa 1", area: "Salon", seats: 4, status: "occupied", ticket: "POS-1001", total: 34000 },
  { id: "t2", name: "Mesa 2", area: "Salon", seats: 2, status: "available" },
  { id: "t3", name: "Mesa 3", area: "Terraza", seats: 2, status: "pending", ticket: "POS-1002", total: 15500 },
  { id: "t4", name: "Barra 1", area: "Barra", seats: 1, status: "available" },
  { id: "t5", name: "Mesa 4", area: "Salon", seats: 6, status: "occupied", ticket: "POS-1010", total: 62000 },
  { id: "t6", name: "Mesa 5", area: "Terraza", seats: 2, status: "available" }
];

export const kitchenTickets: KitchenTicketCard[] = [
  {
    id: "k1",
    orderNumber: "POS-1001",
    table: "Mesa 1",
    status: "preparing",
    createdAt: "2026-03-18T14:10:00.000Z",
    notes: ["Sin mostaza", "Leche deslactosada"],
    items: [
      { name: "Capuccino Vainilla", qty: 1 },
      { name: "Sandwich Pavo Brie", qty: 1 }
    ]
  },
  {
    id: "k2",
    orderNumber: "POS-1002",
    table: "Mesa 3",
    status: "ready",
    createdAt: "2026-03-18T14:18:00.000Z",
    notes: ["Entregar con cubiertos"],
    items: [
      { name: "Espresso Doble", qty: 1 },
      { name: "Croissant Mantequilla", qty: 1 }
    ]
  },
  {
    id: "k3",
    orderNumber: "POS-1011",
    table: "Counter",
    status: "pending",
    createdAt: "2026-03-18T14:24:00.000Z",
    notes: ["Llevar para llevar"],
    items: [{ name: "Toast Aguacate", qty: 2 }]
  }
];

export const cashMovements: CashMovementItem[] = [
  { id: "c1", type: "Apertura", reason: "Fondo inicial", amount: 250000, time: "08:00" },
  { id: "c2", type: "Venta", reason: "POS-0998", amount: 18500, time: "09:12" },
  { id: "c3", type: "Salida", reason: "Cambio domicilio", amount: 10000, time: "11:35" },
  { id: "c4", type: "Venta", reason: "POS-1004", amount: 42000, time: "12:26" }
];

export const ingredients: IngredientRow[] = [
  { id: "i1", name: "Cafe en grano", stock: 4500, minimum: 1200, unit: "g", cost: 12 },
  { id: "i2", name: "Leche entera", stock: 18000, minimum: 5000, unit: "ml", cost: 0.008 },
  { id: "i3", name: "Sirope vainilla", stock: 280, minimum: 400, unit: "ml", cost: 0.02 },
  { id: "i4", name: "Pan campesino", stock: 8, minimum: 10, unit: "porc", cost: 1800 },
  { id: "i5", name: "Queso brie", stock: 620, minimum: 700, unit: "g", cost: 0.03 },
  { id: "i6", name: "Base te limon", stock: 2900, minimum: 1500, unit: "ml", cost: 0.01 }
];

export const users: UserRow[] = [
  { id: "u1", name: "Admin Kaiko", email: "admin@sandeli.com", role: "Admin", status: "active", lastAccess: "Hoy 08:01" },
  { id: "u2", name: "Carlos Caja", email: "caja@sandeli.com", role: "Cashier", status: "active", lastAccess: "Hoy 14:05" },
  { id: "u3", name: "Laura Mesas", email: "mesa@sandeli.com", role: "Waiter", status: "active", lastAccess: "Hoy 13:58" },
  { id: "u4", name: "Mateo Cocina", email: "kds@sandeli.com", role: "Kitchen", status: "active", lastAccess: "Hoy 14:12" },
  { id: "u5", name: "Sofia Backup", email: "backup@sandeli.com", role: "Cashier", status: "inactive", lastAccess: "Ayer 18:33" }
];

export const auditTrail = [
  { id: "a1", actor: "Carlos Caja", action: "Apertura de caja", context: "Caja Principal", time: "08:00" },
  { id: "a2", actor: "Laura Mesas", action: "Envio pedido", context: "POS-1001", time: "14:10" },
  { id: "a3", actor: "Mateo Cocina", action: "Ticket listo", context: "POS-1002", time: "14:21" },
  { id: "a4", actor: "Sara Admin", action: "Actualizo producto", context: "Latte Caramelo", time: "12:09" }
];
