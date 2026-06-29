// Konteks keranjang belanja untuk halaman toko (Guest/Store)
import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "store_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  const persist = useCallback((next) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  // Tambah produk ke keranjang (atau naikkan qty kalau sudah ada)
  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const next = existing
        ? prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { ...product, qty }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Set qty langsung; kalau <= 0 hapus item
  const setQty = useCallback((id, qty) => {
    setItems((prev) => {
      const next = qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => persist([]), [persist]);

  // Turunan: jumlah item & subtotal
  const count    = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQty, clearCart, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);