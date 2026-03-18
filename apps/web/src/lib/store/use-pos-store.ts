"use client";

import { create } from "zustand";

import { products } from "../mock-data";

type OrderType = "counter" | "table" | "delivery";
type PaymentMethod = "cash" | "card" | "transfer" | "mixed";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
};

type PosState = {
  activeCategoryId: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  cart: CartItem[];
  setCategory: (categoryId: string) => void;
  setOrderType: (orderType: OrderType) => void;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
  addProduct: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  setNotes: (productId: string, notes: string) => void;
  clear: () => void;
};

export const usePosStore = create<PosState>((set) => ({
  activeCategoryId: "all",
  orderType: "counter",
  paymentMethod: "cash",
  cart: [],
  setCategory: (activeCategoryId) => set({ activeCategoryId }),
  setOrderType: (orderType) => set({ orderType }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  addProduct: (productId) =>
    set((state) => {
      const product = products.find((item) => item.id === productId);
      if (!product || !product.available) {
        return state;
      }

      const existing = state.cart.find((item) => item.productId === productId);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }

      return {
        cart: [
          ...state.cart,
          {
            productId,
            name: product.name,
            price: product.price,
            quantity: 1
          }
        ]
      };
    }),
  increment: (productId) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    })),
  decrement: (productId) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    })),
  setNotes: (productId, notes) =>
    set((state) => ({
      cart: state.cart.map((item) => (item.productId === productId ? { ...item, notes } : item))
    })),
  clear: () => set({ cart: [] })
}));
