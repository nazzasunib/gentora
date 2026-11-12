"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "./types";
import { getProductById } from "@/data/products";

type Toast = { id: number; message: string; kind?: "success" | "info" };

interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  quickViewId: string | null;
  toasts: Toast[];
  cartPulse: number;

  addToCart: (i: { productId: string; size?: string; color?: string; qty?: number }, opts?: { silent?: boolean; open?: boolean }) => void;
  addManyToCart: (items: { productId: string; size?: string; color?: string; qty?: number }[]) => void;
  removeFromCart: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setQuickView: (id: string | null) => void;
  toast: (message: string, kind?: Toast["kind"]) => void;
  dismissToast: (id: number) => void;
}

const keyOf = (productId: string, size?: string, color?: string) =>
  [productId, size ?? "-", color ?? "-"].join("|");

let toastId = 0;

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      cartOpen: false,
      searchOpen: false,
      quickViewId: null,
      toasts: [],
      cartPulse: 0,

      addToCart: ({ productId, size, color, qty = 1 }, opts) => {
        const key = keyOf(productId, size, color);
        set((s) => {
          const existing = s.cart.find((c) => c.key === key);
          const cart = existing
            ? s.cart.map((c) => (c.key === key ? { ...c, qty: Math.min(c.qty + qty, 10) } : c))
            : [...s.cart, { key, productId, size, color, qty }];
          return { cart, cartPulse: s.cartPulse + 1, cartOpen: opts?.open ?? s.cartOpen };
        });
        if (!opts?.silent) {
          const p = getProductById(productId);
          get().toast(`${p?.name ?? "Item"} added to cart`);
        }
      },
      addManyToCart: (items) => {
        items.forEach((i) => get().addToCart(i, { silent: true }));
        get().toast(`${items.length} pieces added — your look is ready`);
        set({ cartOpen: true });
      },
      removeFromCart: (key) => set((s) => ({ cart: s.cart.filter((c) => c.key !== key) })),
      setQty: (key, qty) =>
        set((s) => ({
          cart: qty <= 0 ? s.cart.filter((c) => c.key !== key) : s.cart.map((c) => (c.key === key ? { ...c, qty: Math.min(qty, 10) } : c)),
        })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) => {
        const has = get().wishlist.includes(productId);
        set((s) => ({ wishlist: has ? s.wishlist.filter((w) => w !== productId) : [...s.wishlist, productId] }));
        const p = getProductById(productId);
        get().toast(has ? `Removed from wishlist` : `${p?.name ?? "Item"} saved to wishlist`, "info");
      },
      setCartOpen: (v) => set({ cartOpen: v }),
      setSearchOpen: (v) => set({ searchOpen: v }),
      setQuickView: (id) => set({ quickViewId: id }),
      toast: (message, kind = "success") => {
        const id = ++toastId;
        set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, kind }] }));
        setTimeout(() => get().dismissToast(id), 2800);
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "gentora-shop",
      version: 1,
      storage: createJSONStorage(() => {
        try {
          return localStorage;
        } catch {
          return undefined as unknown as Storage;
        }
      }),
      partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist }),
    }
  )
);

export const cartTotals = (cart: CartItem[]) => {
  const lines = cart
    .map((c) => ({ ...c, product: getProductById(c.productId) }))
    .filter((l): l is CartItem & { product: NonNullable<ReturnType<typeof getProductById>> } => !!l.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  return { lines, subtotal, count };
};
