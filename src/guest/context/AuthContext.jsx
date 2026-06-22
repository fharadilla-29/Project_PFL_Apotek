import { createContext, useContext, useState } from "react";
import membershipData from "../../data/membership.json";

const AuthContext = createContext(null);

// Cari data member berdasarkan user yang login.
// Kalau tidak ada yang cocok, buat member default tier Silver.
function resolveMember(user) {
  if (!user) return null;
  const match = membershipData.find(
    (m) =>
      (user.email && m.email?.toLowerCase() === user.email.toLowerCase()) ||
      (user.name && m.name?.toLowerCase() === user.name.toLowerCase())
  );
  if (match) return match;

  const today = new Date().toISOString().slice(0, 10);
  return {
    id: "MEM-NEW",
    name: user.name ?? user.username ?? "Member",
    email: user.email ?? "",
    tier: "Silver",
    points: 50,
    joinDate: today,
    annualSpend: 0,
    totalSpend: 0,
    totalOrders: 0,
    status: "Active",
    pointHistory: [
      { date: today, desc: "Bonus Daftar Baru", earned: 50, used: 0, balance: 50 },
    ],
  };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("store_user") || "null")
  );
  const [memberData, setMemberData] = useState(
    () => resolveMember(JSON.parse(localStorage.getItem("store_user") || "null"))
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authIntent, setAuthIntent]       = useState(null); // callback setelah login

    const login = (userData) => {
    setUser(userData);
    setMemberData(resolveMember(userData));
    localStorage.setItem("store_user", JSON.stringify(userData));
    setShowAuthModal(false);
    if (authIntent) { authIntent(); setAuthIntent(null); }
  };

  const logout = () => {
    setUser(null);
    setMemberData(null);
    localStorage.removeItem("store_user");
  };

  // Panggil ini saat mau beli — jika belum login, buka modal dulu
  const requireLogin = (callback) => {
    if (user) { callback(); }
    else { setAuthIntent(() => callback); setShowAuthModal(true); }
  };

  return (
    <AuthContext.Provider value={{ user, memberData, login, logout, showAuthModal, setShowAuthModal, requireLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
