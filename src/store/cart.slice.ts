// src/store/cart.slice.ts
import { createSlice, type PayloadAction, createSelector } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  nombre: string;
  precio: number;
  qty: number;
  img?: string | null; // opcional
};

export type CartState = { items: CartItem[] };

const KEY = "cart_v1";

/* Load / Save con try/catch */
const loadState = (): CartState => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
};
const saveState = (state: CartState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // no-op
  }
};

const initialState: CartState = loadState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ id: string; nombre: string; precio: number; qty?: number; img?: string | null }>
    ) => {
      const { id, nombre, precio, img = null } = action.payload;
      const qty = Math.max(1, action.payload.qty ?? 1);
      const existing = state.items.find((i) => i.id === id);
      if (existing) existing.qty += qty;
      else state.items.push({ id, nombre, precio, qty, img });
      saveState(state);
    },
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
      saveState(state);
    },
    updateQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const it = state.items.find((i) => i.id === action.payload.id);
      if (it) it.qty = Math.max(1, action.payload.qty);
      saveState(state);
    },
    clearCart: (state) => {
      state.items = [];
      saveState(state);
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer; // ⬅️ export default para montar fácil en el store

/* Selectores */
export const selectCartItems = (s: { cart: CartState }) => s.cart.items;
export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((acc, it) => acc + it.qty, 0)
);
export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((acc, it) => acc + it.precio * it.qty, 0)
);

/* Middleware de persistencia (opcional si ya guardas en reducers) */
export const cartPersistence = (storeAPI: any) => (next: any) => (action: any) => {
  const result = next(action);
  const state: { cart: CartState } = storeAPI.getState?.() ?? { cart: { items: [] } };
  saveState(state.cart);
  return result;
};
