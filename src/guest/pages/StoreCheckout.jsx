import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdLocationOn, MdLocalShipping, MdCheckCircle,
  MdCreditCard, MdAccountBalanceWallet, MdMoney, MdStorefront,
} from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LangContext";
import { ordersAPI } from "../../services/ordersAPI";

function fmtRp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

// Hitung ID order berikutnya dari daftar yang ada (format ORD-XXX)
function nextOrderId(orders) {
  const maxNum = orders.reduce((max, o) => {
    const m = /^ORD-(\d+)$/.exec(o.id || "");
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);
  return `ORD-${String(maxNum + 1).padStart(3, "0")}`;
}

const PAY_METHODS = [
  { id: "transfer", icon: <MdAccountBalanceWallet />, en: "Bank Transfer",   id_: "Transfer Bank" },
  { id: "card",     icon: <MdCreditCard />,          en: "Credit/Debit Card", id_: "Kartu Kredit/Debit" },
  { id: "cod",      icon: <MdMoney />,               en: "Cash on Delivery", id_: "Bayar di Tempat (COD)" },
];

export default function StoreCheckout() {
  const { user, memberData } = useAuth();
  const { items, removeItem } = useCart();
  const { t, lang } = useLang();
  const id = lang === "id";
  const navigate = useNavigate();
  const location = useLocation();

  // Item terpilih dikirim dari halaman keranjang; fallback ke semua item
  const selectedIds = location.state?.selectedIds ?? items.map(i => i.id);
  const chosen = items.filter(i => selectedIds.includes(i.id));

  const [address, setAddress] = useState({ name: user?.name || "", phone: "", full: "" });
  const [payMethod, setPayMethod] = useState("transfer");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // { orderId }

  // Belum login → ke halaman login
  if (!user) {
    return <Navigate to="/store/login" state={{ from: "/store/checkout" }} replace />;
  }

  // Hitungan
  const subtotal = chosen.reduce((s, i) => s + i.price * i.qty, 0);
  const memberRate = memberData?.tier === "Platinum" ? 0.1
    : memberData?.tier === "Gold" ? 0.05 : 0;
  const memberDiscount = Math.round(subtotal * memberRate);
  const shipping = subtotal > 0 && subtotal < 200000 ? 15000 : 0;
  const total = subtotal - memberDiscount + shipping;

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true); setError("");
    try {
      // Ambil daftar order untuk menentukan ID berikutnya
      let orderId;
      try {
        const existing = await ordersAPI.fetchOrders();
        orderId = nextOrderId(existing);
      } catch {
        orderId = `ORD-${String(Date.now()).slice(-3)}`;
      }

      // Buat order baru → otomatis tampil di halaman admin
      await ordersAPI.createOrder({
        id: orderId,
        customerName: address.name || user.name,
        status: "Pending",
        totalPrice: total,
        date: new Date().toISOString().slice(0, 10),
      });

      // Kosongkan item yang sudah dibayar dari keranjang
      chosen.forEach(i => removeItem(i.id));
      setDone({ orderId });
    } catch (err) {
      const msg = err.response?.data?.message || err.message ||
        (id ? "Gagal memproses pembayaran" : "Failed to process payment");
      setError(msg);
    } finally {
      setProcessing(false);
    }
  };

  // ── Halaman sukses ──
  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <MdCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-xl font-extrabold text-gray-900 mb-2">
            {id ? "Pembayaran Berhasil!" : "Payment Successful!"}
          </h1>
          <p className="text-sm text-gray-500 mb-1">
            {id ? "Pesananmu sedang diproses." : "Your order is being processed."}
          </p>
          <p className="text-xs text-gray-400 mb-6">
            {id ? "No. Pesanan" : "Order No."}: <b className="text-teal-700">{done.orderId}</b>
          </p>
          <div className="flex flex-col gap-2">
            <Link to="/store/orders"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition">
              {id ? "Lihat Pesanan Saya" : "View My Orders"}
            </Link>
            <Link to="/store/products"
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl text-sm transition">
              {t.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Keranjang kosong / tidak ada item terpilih
  if (chosen.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-gray-700 font-bold text-lg">{t.cartEmpty}</p>
        <Link to="/store/products"
          className="mt-4 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition">
          {t.shopNow}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link to="/store/cart"
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition">
          <MdArrowBack className="text-lg" />
        </Link>
        <h1 className="text-xl font-extrabold text-gray-900">
          {id ? "Pembayaran" : "Checkout"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handlePay} className="space-y-4">

        {/* Alamat pengiriman */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
            <MdLocationOn className="text-teal-600" /> {id ? "Alamat Pengiriman" : "Shipping Address"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required value={address.name}
              onChange={e => setAddress(a => ({ ...a, name: e.target.value }))}
              placeholder={id ? "Nama penerima" : "Recipient name"}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400" />
            <input required value={address.phone}
              onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
              placeholder={id ? "No. telepon" : "Phone number"}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <textarea required value={address.full}
            onChange={e => setAddress(a => ({ ...a, full: e.target.value }))}
            placeholder={id ? "Alamat lengkap (jalan, no. rumah, kota, kode pos)" : "Full address"}
            rows={2}
            className="w-full mt-3 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
        </div>

        {/* Ringkasan item */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
            <MdStorefront className="text-teal-600" /> {id ? "Produk Dipesan" : "Items"}
            <span className="text-xs text-gray-400">({chosen.length})</span>
          </h2>
          <div className="space-y-3">
            {chosen.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.qty} × {fmtRp(item.price)}</p>
                </div>
                <p className="text-sm font-bold text-gray-700">{fmtRp(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Metode pembayaran */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
            <MdCreditCard className="text-teal-600" /> {id ? "Metode Pembayaran" : "Payment Method"}
          </h2>
          <div className="space-y-2">
            {PAY_METHODS.map(m => (
              <label key={m.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
                  ${payMethod === m.id
                    ? "border-teal-400 bg-teal-50 ring-1 ring-teal-300"
                    : "border-gray-200 hover:border-teal-300"}`}>
                <input type="radio" name="pay" value={m.id}
                  checked={payMethod === m.id}
                  onChange={() => setPayMethod(m.id)}
                  className="accent-teal-600" />
                <span className="text-teal-600 text-lg">{m.icon}</span>
                <span className="text-sm font-semibold text-gray-700">{id ? m.id_ : m.en}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rincian biaya */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-3">{t.cartSummary}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{t.subtotal}</span>
              <span className="font-semibold text-gray-800">{fmtRp(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t.shipping}</span>
              <span className="font-semibold text-gray-800">{shipping === 0 ? t.freeShipping : fmtRp(shipping)}</span>
            </div>
            {memberDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t.discount} ({memberData.tier})</span>
                <span className="font-semibold">- {fmtRp(memberDiscount)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">{t.total}</span>
            <span className="text-xl font-extrabold text-teal-700">{fmtRp(total)}</span>
          </div>
        </div>

        <button type="submit" disabled={processing}
          className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50
                     text-white font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
          {processing
            ? <><ImSpinner2 className="animate-spin" /> {id ? "Memproses..." : "Processing..."}</>
            : <><MdLocalShipping /> {id ? `Bayar ${fmtRp(total)}` : `Pay ${fmtRp(total)}`}</>}
        </button>
      </form>
    </div>
  );
}