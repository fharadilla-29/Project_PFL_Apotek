import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  MdReceipt, MdArrowBack, MdSearch, MdClose,
  MdCheckCircle, MdVisibility, MdDownload,
  MdLocalPharmacy, MdShoppingCart,
} from "react-icons/md";
import { BsStarFill } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function fmtRp(n) {
  const num = Number(String(n).replace(/[^\d]/g, "")) || 0;
  return "Rp " + num.toLocaleString("id-ID");
}

// ── Tipe transaksi ─────────────────────────────────────────────────────────────
const TYPE_CFG = {
  Pembelian:    { bg: "bg-teal-50",  text: "text-teal-700",   border: "border-teal-100",   dot: "bg-teal-500",   icon: "🛒" },
  "Tukar Poin": { bg: "bg-purple-50",text: "text-purple-700", border: "border-purple-100", dot: "bg-purple-500", icon: "⭐" },
  Refund:       { bg: "bg-orange-50",text: "text-orange-700", border: "border-orange-100", dot: "bg-orange-400", icon: "↩️" },
  Bonus:        { bg: "bg-yellow-50",text: "text-yellow-700", border: "border-yellow-100", dot: "bg-yellow-400", icon: "🎁" },
};

function TypeBadge({ type }) {
  const c = TYPE_CFG[type] ?? TYPE_CFG.Pembelian;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {type}
    </span>
  );
}

// ── Mock data transaksi ───────────────────────────────────────────────────────
const mockTransactions = [
  {
    id: "TRX-20240610-001", date: "2024-06-10", type: "Pembelian",
    desc: "Pembelian Obat & Vitamin", items: 3,
    amount: 185000, poin: +18, method: "Transfer Bank",
    invoice: "INV-2024-0610-001",
  },
  {
    id: "TRX-20240522-002", date: "2024-05-22", type: "Pembelian",
    desc: "Pembelian Suplemen", items: 3,
    amount: 320000, poin: +32, method: "QRIS",
    invoice: "INV-2024-0522-002",
  },
  {
    id: "TRX-20240501-003", date: "2024-05-01", type: "Tukar Poin",
    desc: "Penukaran 200 poin → voucher Rp 20.000", items: 0,
    amount: -20000, poin: -200, method: "-",
    invoice: "INV-2024-0501-003",
  },
  {
    id: "TRX-20240403-004", date: "2024-04-03", type: "Bonus",
    desc: "Birthday Bonus Poin", items: 0,
    amount: 0, poin: +500, method: "-",
    invoice: "-",
  },
  {
    id: "TRX-20240315-005", date: "2024-03-15", type: "Refund",
    desc: "Refund pesanan dibatalkan", items: 3,
    amount: +215000, poin: 0, method: "Refund ke Rekening",
    invoice: "INV-2024-0315-005",
  },
  {
    id: "TRX-20240301-006", date: "2024-03-01", type: "Pembelian",
    desc: "Pembelian Obat Resep Dokter", items: 5,
    amount: 620000, poin: +62, method: "Kartu Kredit",
    invoice: "INV-2024-0301-006",
  },
  {
    id: "TRX-20240115-007", date: "2024-01-15", type: "Pembelian",
    desc: "Pembelian Perawatan Kulit", items: 4,
    amount: 250000, poin: +25, method: "GoPay",
    invoice: "INV-2024-0115-007",
  },
  {
    id: "TRX-20231210-008", date: "2023-12-10", type: "Pembelian",
    desc: "Pembelian Vitamin Anak", items: 2,
    amount: 140000, poin: +14, method: "OVO",
    invoice: "INV-2023-1210-008",
  },
];

const FILTER_TABS = ["Semua", "Pembelian", "Tukar Poin", "Bonus", "Refund"];

export default function StoreTransactions() {
  const { user, memberData } = useAuth();
  const [activeTab, setActiveTab] = useState("Semua");
  const [search, setSearch]       = useState("");
  const [detail, setDetail]       = useState(null);

  if (!user) {
    return <Navigate to="/store/login" state={{ from: "/store/transactions" }} replace />;
  }

  const filtered = mockTransactions.filter(t => {
    const matchTab = activeTab === "Semua" || t.type === activeTab;
    const q        = search.toLowerCase();
    const matchQ   = !q || t.id.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    return matchTab && matchQ;
  });

  // Ringkasan keuangan
  const totalBelanja = mockTransactions
    .filter(t => t.type === "Pembelian")
    .reduce((s, t) => s + t.amount, 0);
  const totalPoinEarned = mockTransactions
    .filter(t => t.poin > 0)
    .reduce((s, t) => s + t.poin, 0);
  const totalTransaksi = mockTransactions.filter(t => t.type === "Pembelian").length;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/store" className="hover:text-teal-600 transition">Beranda</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Riwayat Transaksi</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/store/membership"
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition">
          <MdArrowBack className="text-lg" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <MdReceipt className="text-teal-600" /> Riwayat Transaksi
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {mockTransactions.length} transaksi tercatat · Akun: <b>{user.name}</b>
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Belanja",     val: fmtRp(totalBelanja),   icon: "💰", color: "bg-teal-50 border-teal-100 text-teal-700" },
          { label: "Total Transaksi",   val: `${totalTransaksi}x`,  icon: "🧾", color: "bg-blue-50 border-blue-100 text-blue-700" },
          { label: "Poin Didapat",      val: `+${totalPoinEarned}`, icon: "⭐", color: "bg-yellow-50 border-yellow-100 text-yellow-700" },
        ].map(s => (
          <div key={s.label}
            className={`rounded-2xl border p-4 text-center ${s.color}`}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{s.label}</p>
            <p className="text-lg font-extrabold leading-tight">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Tab filter */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-4">
        {FILTER_TABS.map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              activeTab === tab
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari ID transaksi atau keterangan..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        />
      </div>

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">🧾</p>
          <p className="text-gray-500 font-semibold">Tidak ada transaksi ditemukan</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            {["Transaksi", "Tipe", "Jumlah", "Poin", "Aksi"].map(h => (
              <p key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map(trx => (
              <div key={trx.id}
                className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors">

                {/* Transaksi info */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${TYPE_CFG[trx.type]?.bg ?? "bg-gray-50"}`}>
                    {TYPE_CFG[trx.type]?.icon ?? "📄"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{trx.desc}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{trx.id}</p>
                    <p className="text-[10px] text-gray-400">{trx.date} · {trx.method}</p>
                  </div>
                </div>

                {/* Type */}
                <div className="flex md:items-center">
                  <TypeBadge type={trx.type} />
                </div>

                {/* Amount */}
                <div className="flex md:items-center">
                  <p className={`text-sm font-bold ${
                    trx.amount > 0 && trx.type !== "Refund" ? "text-gray-800" :
                    trx.type === "Refund" ? "text-green-600" :
                    trx.amount < 0 ? "text-red-500" :
                    "text-gray-400"
                  }`}>
                    {trx.amount === 0 ? "-" : trx.type === "Refund" ? `+${fmtRp(trx.amount)}` : fmtRp(Math.abs(trx.amount))}
                  </p>
                </div>

                {/* Poin */}
                <div className="flex md:items-center">
                  {trx.poin !== 0 ? (
                    <span className={`text-xs font-bold flex items-center gap-1 ${trx.poin > 0 ? "text-yellow-600" : "text-red-400"}`}>
                      <BsStarFill className="text-[10px]" />
                      {trx.poin > 0 ? `+${trx.poin}` : trx.poin}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">-</span>
                  )}
                </div>

                {/* Aksi */}
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setDetail(trx)}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-teal-600 transition"
                    title="Lihat detail">
                    <MdVisibility className="text-base" />
                  </button>
                  {trx.invoice !== "-" && (
                    <button onClick={() => alert(`Download invoice ${trx.invoice}`)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                      title="Download invoice">
                      <MdDownload className="text-base" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link to="/store/orders"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-teal-200 hover:shadow-sm transition group">
          <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600 group-hover:bg-teal-100 transition">
            <MdShoppingCart className="text-xl" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Pesanan Saya</p>
            <p className="text-xs text-gray-400">Lacak status pesanan</p>
          </div>
        </Link>
        <Link to="/store/membership"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-purple-200 hover:shadow-sm transition group">
          <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-100 transition">
            <MdLocalPharmacy className="text-xl" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Kartu Membership</p>
            <p className="text-xs text-gray-400">Poin & keuntungan member</p>
          </div>
        </Link>
      </div>

      {/* ── Detail Modal ── */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400">Detail Transaksi</p>
                <h3 className="text-base font-extrabold text-gray-800 font-mono">{detail.id}</h3>
              </div>
              <button onClick={() => setDetail(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition">
                <MdClose className="text-lg" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <TypeBadge type={detail.type} />
                <span className="text-xs text-gray-400">{detail.date}</span>
              </div>

              {[
                { label: "Keterangan",      val: detail.desc },
                { label: "Metode Bayar",    val: detail.method },
                { label: "No. Invoice",     val: detail.invoice },
                { label: "Jumlah Item",     val: detail.items > 0 ? `${detail.items} produk` : "-" },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                  <span className="text-gray-400 text-xs">{label}</span>
                  <span className="font-semibold text-gray-700 text-xs text-right max-w-[60%]">{val}</span>
                </div>
              ))}

              {/* Amount & poin summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {detail.amount !== 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Jumlah</span>
                    <span className={`font-extrabold ${detail.type === "Refund" ? "text-green-600" : "text-gray-800"}`}>
                      {detail.type === "Refund" ? "+" : ""}{fmtRp(Math.abs(detail.amount))}
                    </span>
                  </div>
                )}
                {detail.poin !== 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Poin</span>
                    <span className={`font-bold flex items-center gap-1 ${detail.poin > 0 ? "text-yellow-600" : "text-red-500"}`}>
                      <BsStarFill className="text-xs" />
                      {detail.poin > 0 ? `+${detail.poin}` : detail.poin} poin
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 pb-5 flex gap-2">
              {detail.invoice !== "-" && (
                <button onClick={() => alert(`Download invoice ${detail.invoice}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl text-sm transition">
                  <MdDownload /> Invoice
                </button>
              )}
              <button onClick={() => setDetail(null)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
