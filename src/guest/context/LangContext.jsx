// Konteks bahasa global untuk halaman toko (Guest/Store)
import { createContext, useContext, useState } from "react";

const LangContext = createContext(null);

// ── Kamus terjemahan ──────────────────────────────────────────────────────────
export const T = {
  en: {
    // Navbar
    promoBar:        "Get Free Home Delivery with Flat Discount Up To 25% 🎉",
    searchPlaceholder: "Search pharmacy & health products...",
    searchBtn:       "Search",
    loginSignup:     "Login / Sign Up",
    langLabel:       "English",
    // Dropdown
    myProfile:       "My Profile",
    membership:      "Membership Card",
    transactions:    "Transaction History",
    myOrders:        "My Orders",
    myCart:          "My Cart",
    logout:          "Sign Out",
    // Mobile menu
    offers:          "Offers & Discounts",
    // Categories
    categories: [
      "Vitamins & Supplements", "Beauty", "Skin Care",
      "Hair Care", "Personal Care", "Mother & Baby", "Medical Supplies",
    ],
    // Footer
    footerDesc:      "Authentic pharmacy, beauty and wellness products all in one trusted place.",
    quickLinks:      "Quick Links",
    quickLinksItems: ["About Us", "Contact Us", "Careers", "Blog", "Press"],
    categoriesLabel: "Categories",
    contactUs:       "Contact Us",
    copyright:       "© 2026 ApotekSehat. All rights reserved.",
    privacyLinks:    ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    // Cart page
    cartTitle:       "My Cart",
    cartEmpty:       "Your cart is empty",
    cartEmptyDesc:   "Browse our products and add items to your cart.",
    shopNow:         "Shop Now",
    cartSummary:     "Order Summary",
    subtotal:        "Subtotal",
    shipping:        "Shipping",
    discount:        "Member Discount",
    total:           "Total",
    checkout:        "Proceed to Checkout",
    remove:          "Remove",
    qty:             "Qty",
    continueShopping:"Continue Shopping",
    freeShipping:    "Free Shipping",
    delivery:        "Delivery",
    authentic:       "100% Authentic",
    products:        "Products",
    easyReturns:     "Easy Returns",
    daysReturn:      "30-day returns",
    securePayment:   "Secure Payment",
    protected:       "100% Protected",
  },
  id: {
    // Navbar
    promoBar:        "Gratis Ongkir untuk semua pembelian dengan Diskon Flat Hingga 25% 🎉",
    searchPlaceholder: "Cari produk farmasi & kesehatan...",
    searchBtn:       "Cari",
    loginSignup:     "Masuk / Daftar",
    langLabel:       "Indonesia",
    // Dropdown
    myProfile:       "Profil Saya",
    membership:      "Kartu Membership",
    transactions:    "Riwayat Transaksi",
    myOrders:        "Pesanan Saya",
    myCart:          "Keranjang Saya",
    logout:          "Keluar dari Akun",
    // Mobile menu
    offers:          "Penawaran & Diskon",
    // Categories
    categories: [
      "Vitamin & Suplemen", "Kecantikan", "Perawatan Kulit",
      "Perawatan Rambut", "Perawatan Pribadi", "Ibu & Bayi", "Alat Kesehatan",
    ],
    // Footer
    footerDesc:      "Produk farmasi, kecantikan, dan kesehatan terpercaya, lengkap dalam satu tempat.",
    quickLinks:      "Tautan Cepat",
    quickLinksItems: ["Tentang Kami", "Hubungi Kami", "Karir", "Blog", "Pers"],
    categoriesLabel: "Kategori",
    contactUs:       "Hubungi Kami",
    copyright:       "© 2026 ApotekSehat. Seluruh hak cipta dilindungi.",
    privacyLinks:    ["Kebijakan Privasi", "Syarat & Ketentuan", "Kebijakan Cookie"],
    // Cart page
    cartTitle:       "Keranjang Saya",
    cartEmpty:       "Keranjang kamu masih kosong",
    cartEmptyDesc:   "Jelajahi produk kami dan tambahkan ke keranjang.",
    shopNow:         "Belanja Sekarang",
    cartSummary:     "Ringkasan Pesanan",
    subtotal:        "Subtotal",
    shipping:        "Ongkos Kirim",
    discount:        "Diskon Member",
    total:           "Total",
    checkout:        "Lanjut ke Pembayaran",
    remove:          "Hapus",
    qty:             "Jml",
    continueShopping:"Lanjut Belanja",
    freeShipping:    "Gratis Ongkir",
    delivery:        "Pengiriman",
    authentic:       "100% Asli",
    products:        "Produk",
    easyReturns:     "Pengembalian Mudah",
    daysReturn:      "30 hari pengembalian",
    securePayment:   "Pembayaran Aman",
    protected:       "100% Terlindungi",
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("store_lang") || "en"
  );

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem("store_lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, switchLang, t: T[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
