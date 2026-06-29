import { Outlet } from "react-router-dom";
import GuestNavbar from "./GuestNavbar";
import GuestFooter from "./GuestFooter";
import AuthModal   from "../components/AuthModal";
import { AuthProvider } from "../context/AuthContext";
import { LangProvider } from "../context/LangContext";
import { CartProvider } from "../context/CartContext";

export default function GuestLayout() {
  return (
    <AuthProvider>
      <LangProvider>
        <CartProvider>
          <div className="min-h-screen bg-white flex flex-col">
            <GuestNavbar />
            <main className="flex-1 bg-gray-50">
              <Outlet />
            </main>
            <GuestFooter />

            {/* Modal auth — muncul di atas semua konten */}
            <AuthModal />
          </div>
        </CartProvider>
      </LangProvider>
    </AuthProvider>
  );
}
