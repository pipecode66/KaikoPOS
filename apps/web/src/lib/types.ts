export type NavItem = {
  href: string;
  label: string;
  caption: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  count: number;
};

export type ProductCard = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  subtitle: string;
  available: boolean;
};

export type TableCard = {
  id: string;
  name: string;
  area: string;
  seats: number;
  status: "available" | "occupied" | "pending";
  ticket?: string;
  total?: number;
};

export type KitchenTicketCard = {
  id: string;
  orderNumber: string;
  table: string;
  status: "pending" | "preparing" | "ready" | "delivered";
  createdAt: string;
  notes: string[];
  items: Array<{ name: string; qty: number }>;
};

export type CashMovementItem = {
  id: string;
  type: string;
  reason: string;
  amount: number;
  time: string;
};

export type IngredientRow = {
  id: string;
  name: string;
  stock: number;
  minimum: number;
  unit: string;
  cost: number;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastAccess: string;
};
