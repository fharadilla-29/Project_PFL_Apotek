import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  MdShoppingCart, MdSearch, MdExpandMore, MdClose,
  MdCheckCircle, MdArrowBack, MdLocalPharmacy,
  MdReceipt, MdVisibility,
} from "react-icons/md";
import { BsClockHistory, BsBoxSeam } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CFG = {
  Selesai: {
    bg: "bg-green-100", text: "text-green-700", border: "border-green-200",
    dot: "bg-green-500", icon: <MdCheckCircle />,
  },
  Diproses: {
    bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200",
    dot: "bg-blue-400", icon: <BsClockHistory />,
  },
  Dikirim: {
    bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200",
    dot: "bg-yellow-400", icon: <BsBoxSeam />,
  },
  Dibatalkan: {
    bg: "bg-red-100", text: "text-red-600", border: "border-red-200",
    dot: "bg-red-500", icon: <FiAlertTriangle />,
  },
};

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.Diproses;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

function fmtRp(n) {
  const num = Number(String(n).replace(/[^\d]/g, "")) || 0;
  return "Rp " + num.toLocaleString("id-ID");
}

// ── Mock order data per member ────────────────────────────────────────────────
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-06-10",
    status: "Selesai",
    total: 185000,
    items: [
      { name: "Paracetamol 500mg", qty: 20, price: 3000 },
      { name: "Amoxicillin 500mg", qty: 10, price: 7000 },
      { name: "Vitamin C 1000mg", qty: 15, price: 4000 },
    ],
    poin: 18,
    resi: "JNE-8821093",
    catatan: "Tolong masukkan bubble wrap ekstra.",
  },
  {
    id: "ORD-2024-002",
    date: "2024-05-22",
    status: "Selesai",
    total: 320000,
    items: [
      { name: "Antasida Doen", qty: 30, price: 2500 },
      { name: "OBH Combi Batuk", qty: 4, price: 15000 },
      { name: "Biotin 5000mcg", qty: 30, price: 5000 },
    ],
    poin: 32,
    resi: "SICEPAT-99231",
    catatan: "",
  },
  {
    id: "ORD-2024-003",
    date: "2024-06-25",
    status: "Dikirim",
    total: 540000,
    items: [
      { name: "Omega-3 Fish Oil", qty: 60, price: 6000 },
      { name: "Masker N95 (1 box)", qty: 2, price: 75000 },
    ],
    poin: 0,
    resi: "JNT-77120939",
    catatan: "Antar ke pagi hari saja.",
  },
  {
    id: "ORD-2024-004",
    date: "2024-04-03",
    status: "Diproses",
    total: 90000,
    items: [
      { name: "Betadine Gargle", qty: 1, price: 35000 },
      { name: "Plester Luka (roll)", qty: 1, price: 55000 },
    ],
    poin: 0,
    resi: "-",
    catatan: "",
  },
  {
    id: "ORD-2024-005",
    date: "2024-03-15",
    status: "Dibatalkan",
    total: 215000,
    items: [
      { name: "Loratadine 10mg", qty: 10, price: 5000 },
      { name: "Cetirizine 10mg", qty: 10, price: 4500 },
      { name: "Nasonex Nasal Spray", qty: 1, price: 120000 },
    ],
    poin: 0,
    resi: "-",
    catatan: "Dibatalkan karena stok habis.",
  },
];

const FILTER_TABS = ["Semua", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

export default function StoreOrders() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Semua");
  const [search, setSearch]       = useState("");
  const [detail, setDetail]       = useState(null);

  if (!user) {
    return <Navigate to="/store/login" state={{ from: "/store/orders" }} replace />;
  }

  const filtered = mockOrders.filter((o) => {
    const matchTab = activeTab === "Semua" || o.status === activeTab;
    const q        = search.toLowerCase();
    const matchQ   = !q || o.id.toLowerCase().includes(q) ||
      o.items.some(i => i.name.toLowerCase().includes(q));
    return matchTab && matchQ;
  });

  const countByTab = (tab) =>
    tab === "Semua" ? mockOrders.length : mockOrders.filter(o => o.status === tab).length;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/store" className="hover:text-teal-600 transition">Beranda</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Pesanan Saya</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/store/membership"
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition">
          <MdArrowBack className="text-lg" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <MdShoppingCart className="text-teal-600" /> Pesanan Saya
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {mockOrders.length} total pesanan · Akun: <b>{user.name}</b>
          </p>
        </div>
      </div>

      {/* Tab filter */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-4 scrollbar-hide">
        {FILTER_TABS.map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              activeTab === tab
                ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600"
            }`}
          >
            {tab}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab ? "bg-white/20" : "bg-gray-100"
            }`}>
              {countByTab(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari ID pesanan atau nama produk..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        />
      </div>

      {/* Order cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-500 font-semibold">Tidak ada pesanan ditemukan</p>
          <p className="text-xs text-gray-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
          <Link to="/store/products"
            className="mt-4 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition">
            <MdShoppingCart /> Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-lg">
                    {order.id}
                  </span>
                  <span className="text-xs text-gray-400">{order.date}</span>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Items */}
              <div className="px-5 py-4">
                <div className="space-y-2.5">
                  {order.items.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MdLocalPharmacy className="text-teal-500 text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.qty} pcs × {fmtRp(item.price)}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-700">{fmtRp(item.qty * item.price)}</p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-400 pl-13">
                      +{order.items.length - 2} produk lainnya
                    </p>
                  )}
                </div>
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50 bg-gray-50/40">
                <div>
                  <p className="text-xs text-gray-400">Total Pembayaran</p>
                  <p className="text-base font-extrabold text-teal-700">{fmtRp(order.total)}</p>
                  {order.poin > 0 && (
                    <p className="text-[10px] text-yellow-600 font-semibold mt-0.5">
                      ⭐ +{order.poin} poin didapat
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {order.status === "Dikirim" && (
                    <button
                      onClick={() => alert(`Lacak: ${order.resi}`)}
                      className="text-xs border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl font-semibold transition">
                      Lacak Paket
                    </button>
                  )}
                  {order.status === "Selesai" && (
                    <Link to="/store/products"
                      className="text-xs border border-teal-200 text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl font-semibold transition">
                      Beli Lagi
                    </Link>
                  )}
                  <button
                    onClick={() => setDetail(order)}
                    className="flex items-center gap-1.5 text-xs bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-xl font-semibold transition">
                    <MdVisibility className="text-sm" /> Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom nav links */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link to="/store/transactions"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-teal-200 hover:shadow-sm transition group">
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition">
            <MdReceipt className="text-xl" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Riwayat Transaksi</p>
            <p className="text-xs text-gray-400">Lihat semua riwayat pembayaran</p>
          </div>
        </Link>
        <Link to="/store/membership"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-teal-200 hover:shadow-sm transition group">
          <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-100 transition">
            <MdLocalPharmacy className="text-xl" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Kartu Membership</p>
            <p className="text-xs text-gray-400">Cek poin & tier kamu</p>
          </div>
        </Link>
      </div>

      {/* ── Detail Modal ── */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs text-gray-400">Detail Pesanan</p>
                <h3 className="text-base font-extrabold text-gray-800">{detail.id}</h3>
              </div>
              <button onClick={() => setDetail(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition">
                <MdClose className="text-lg" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status & date */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Tanggal Pesanan</p>
                  <p className="text-sm font-semibold text-gray-700">{detail.date}</p>
                </div>
                <StatusBadge status={detail.status} />
              </div>

              {/* Item list */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Daftar Produk</p>
                <div className="space-y-3">
                  {detail.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MdLocalPharmacy className="text-teal-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{item.qty} pcs × {fmtRp(item.price)}</p>
                      </div>
                      <p className="text-xs font-bold text-gray-700">{fmtRp(item.qty * item.price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rincian pembayaran */}
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-teal-700 mb-1">Rincian Pembayaran</p>
                {[
                  { label: "Subtotal",        val: fmtRp(detail.total * 0.9) },
                  { label: "Ongkos Kirim",    val: fmtRp(detail.total * 0.1) },
                  { label: "Diskon Member",   val: "- Rp 0" },
                  { label: "Total",           val: fmtRp(detail.total), bold: true },
                ].map(({ label, val, bold }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-teal-700">{label}</span>
                    <span className={bold ? "font-extrabold text-teal-800 text-sm" : "font-semibold text-teal-700"}>{val}</span>
                  </div>
                ))}
              </div>

              {/* No. resi & catatan */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-xs text-gray-500">No. Resi</span>
                  <span className="text-xs font-bold text-gray-700 font-mono">{detail.resi}</span>
                </div>
                {detail.catatan && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
                    <p className="text-[10px] text-yellow-600 font-bold uppercase mb-1">Catatan</p>
                    <p className="text-xs text-gray-600">{detail.catatan}</p>
                  </div>
                )}
                {detail.poin > 0 && (
                  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-xs text-yellow-700 font-semibold">
                      Kamu mendapatkan <b>{detail.poin} poin</b> dari pesanan ini
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-5 pb-5 flex gap-2">
              {detail.status === "Selesai" && (
                <Link to="/store/products"
                  className="flex-1 text-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm transition">
                  Beli Lagi
                </Link>
              )}
              <button onClick={() => setDetail(null)}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl text-sm transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
