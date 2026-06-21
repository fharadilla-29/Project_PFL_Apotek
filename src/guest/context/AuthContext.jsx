import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("store_user") || "null")
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authIntent, setAuthIntent]       = useState(null); // callback setelah login

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("store_user", JSON.stringify(userData));
    setShowAuthModal(false);
    if (authIntent) { authIntent(); setAuthIntent(null); }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("store_user");
  };

  // Panggil ini saat mau beli — jika belum login, buka modal dulu
  const requireLogin = (callback) => {
    if (user) { callback(); }
    else { setAuthIntent(() => callback); setShowAuthModal(true); }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuthModal, setShowAuthModal, requireLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
