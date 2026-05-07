import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  capacityLiters: number | null;
  unitPrice: number | null;
  currency: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  compareIds: string[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  toggleCompare: (productId: string) => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      compareIds: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: qty }] };
        }),
      setQty: (productId, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i))
            .filter((i) => i.quantity > 0),
        })),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
      toggleCompare: (productId) =>
        set((s) => {
          const has = s.compareIds.includes(productId);
          if (has) return { compareIds: s.compareIds.filter((x) => x !== productId) };
          if (s.compareIds.length >= 4) return { compareIds: s.compareIds };
          return { compareIds: [...s.compareIds, productId] };
        }),
      totalItems: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((n, i) => n + (i.unitPrice ?? 0) * i.quantity, 0),
    }),
    { name: "kentainers-cart" }
  )
);
