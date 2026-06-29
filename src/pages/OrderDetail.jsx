import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MdArrowBack, MdEdit, MdDelete, MdPrint, MdCheckCircle,
  MdLocalPharmacy, MdPerson, MdCalendarToday, MdReceipt,
  MdMoreVert, MdClose, MdSave,
} from "react-icons/md";
import { FiPackage, FiAlertTriangle } from "react-icons/fi";
import { ordersAPI } from "../services/ordersAPI";
import ordersStatic from "../data/orders.json";

const STATUS_CFG = {
  Completed: {
    bg: "bg-green-100", text: "text-green-700", border: "border-green-200",
    dot: "bg-green-500", icon: <MdCheckCircle />,
  },
  Pending: {
    bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200",
    dot: "bg-yellow-400", icon: <FiAlertTriangle />,
  },
  Cancelled: {
    bg: "bg-red-100", text: "text-red-600", border: "border-red-200",
    dot: "bg-red-500", icon: <MdClose />,
  },
};

function fmtRp(n) {
  const num = Number(String(n).replace(/[^\d]/g, "")) || 0;
  return "Rp " + num.toLocaleString("id-ID");
}

// Mock prescription items for detail view
const mockItems = [
  { name: "Amoxicillin 500mg", qty: 10, unit: "tablet", price: 5000, total: 50000, category: "Antibiotik" },
  { name: "Paracetamol 500mg", qty: 20, unit: "tablet", price: 3000, total: 60000, category: "Analgesik" },
  { name: "Vitamin C 1000mg", qty: 30, unit: "tablet", price: 4500, total: 135000, category: "Vitamin" },
  { name: "Antasida Doen", qty: 5, unit: "tablet", price: 2000, total: 10000, category: "Antasida" },
];

const mockTimeline = [
  { time: "09:00", label: "Order diterima", desc: "Resep diserahkan ke apoteker", color: "bg-teal-500" },
  { time: "09:15", label: "Verifikasi resep", desc: "Resep telah diverifikasi dokter", color: "bg-blue-500" },
  { time: "09:30", label: "Persiapan obat", desc: "Obat sedang disiapkan", color: "bg-yellow-500" },
  { time: "10:00", label: "Selesai", desc: "Obat siap diserahkan ke pasien", color: "bg-green-500" },
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await ordersAPI.fetchOrders();
        const found = all.find(o => o.id === id);
        if (found) { setOrder(found); setEditStatus(found.status); }
        else {
          // fallback ke static
          const s = ordersStatic.find(o => o.id === id);
          if (s) {
            const mapped = { ...s, totalPrice: s.totalPrice };
            setOrder(mapped);
            setEditStatus(s.status);
          }
        }
      } catch {
        const s = ordersStatic.find(o => o.id === id);
        if (s) { setOrder({ ...s }); setEditStatus(s.status); }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handlePrint = () => {
    window.print();
    showToast("Mencetak resep...");
  };

  const handleSaveStatus = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setOrder(prev => ({ ...prev, status: editStatus }));
    setEditModal(false);
    setSaving(false);
    showToast("Status berhasil diperbarui!");
  };

  const handleDelete = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setDeleteModal(false);
    showToast("Order dihapus!");
    setTimeout(() => navigate("/orders"), 1200);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Memuat data order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Order tidak ditemukan</h2>
          <p className="text-sm text-gray-400 mb-4">ID "<b>{id}</b>" tidak ada di database.</p>
          <Link to="/orders" className="bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-700 transition">
            Kembali ke Prescriptions
          </Link>
        </div>
      </div>
    );
  }

  const sc = STATUS_CFG[order.status] ?? STATUS_CFG.Pending;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce-once">
          <MdCheckCircle className="text-green-400" /> {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <Link to="/" className="hover:text-teal-600 transition">Dashboard</Link>
        <span>/</span>
        <Link to="/orders" className="hover:text-teal-600 transition">Prescriptions</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">{order.id}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-500"
          >
            <MdArrowBack className="text-lg" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{order.id}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Detail Resep Pasien</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {order.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 font-semibold transition"
          >
            <MdPrint /> Print
          </button>
          <button
            onClick={() => setEditModal(true)}
            className="flex items-center gap-1.5 text-sm bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 font-semibold transition"
          >
            <MdEdit /> Edit Status
          </button>
          <button
            onClick={() => setDeleteModal(true)}
            className="flex items-center gap-1.5 text-sm bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-100 font-semibold transition"
          >
            <MdDelete /> Hapus
          </button>
        </div>
      </div>

      {/* Grid 2 col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Patient Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MdPerson className="text-teal-600 text-lg" />
            <h3 className="text-sm font-bold text-gray-800">Informasi Pasien</h3>
          </div>
          <div className="flex flex-col items-center text-center mb-4">
            <img
              src={`https://i.pravatar.cc/80?u=${order.customerName}`}
              alt={order.customerName}
              className="w-16 h-16 rounded-full border-2 border-teal-100 mb-2"
            />
            <p className="font-bold text-gray-800">{order.customerName}</p>
            <p className="text-xs text-gray-400">Pasien Tetap</p>
          </div>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>No. Pasien</span>
              <span className="font-semibold text-gray-700">
                P-{Math.abs(order.customerName.charCodeAt(0) * 31 + 1000).toString().slice(0,5)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal Lahir</span>
              <span className="font-semibold text-gray-700">15 Mar 1985</span>
            </div>
            <div className="flex justify-between">
              <span>Golongan Darah</span>
              <span className="font-semibold text-gray-700">O+</span>
            </div>
            <div className="flex justify-between">
              <span>Alergi</span>
              <span className="font-semibold text-orange-500">Penisilin</span>
            </div>
          </div>
          <Link to="/customers" className="mt-4 block text-center text-xs font-semibold text-teal-600 hover:underline">
            Lihat Semua Pasien →
          </Link>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MdReceipt className="text-teal-600 text-lg" />
            <h3 className="text-sm font-bold text-gray-800">Ringkasan Order</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Order ID",   val: order.id },
              { label: "Tanggal",   val: order.date },
              { label: "Apoteker",  val: "Aria Devani, S.Farm" },
              { label: "Dokter",    val: "dr. Siti Rahayu" },
              { label: "Total Bayar", val: fmtRp(order.totalPrice), bold: true },
              { label: "Metode",    val: "Tunai" },
            ].map(({ label, val, bold }) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-gray-400">{label}</span>
                <span className={`font-semibold ${bold ? "text-teal-600 text-sm" : "text-gray-700"}`}>{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${sc.bg} ${sc.text}`}>
              <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
              Status: <b>{order.status}</b>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MdCalendarToday className="text-teal-600 text-lg" />
            <h3 className="text-sm font-bold text-gray-800">Timeline Proses</h3>
          </div>
          <div className="relative space-y-4">
            {mockTimeline.map((t, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <span className={`w-3 h-3 rounded-full ${t.color} flex-shrink-0 mt-0.5`} />
                  {i < mockTimeline.length - 1 && <span className="w-0.5 flex-1 bg-gray-200 my-1" style={{ minHeight: 20 }} />}
                </div>
                <div className="pb-1">
                  <p className="text-xs font-bold text-gray-700">{t.time} – {t.label}</p>
                  <p className="text-[10px] text-gray-400">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MdLocalPharmacy className="text-teal-600" />
            <h3 className="text-sm font-bold text-gray-800">Daftar Obat / Item</h3>
          </div>
          <Link to="/inventory" className="text-xs text-teal-600 font-semibold hover:underline">
            Lihat Inventori →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {["No", "Nama Obat", "Kategori", "Qty", "Satuan", "Harga Satuan", "Subtotal"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockItems.map((item, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-teal-50 text-teal-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-teal-100">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-700">{item.qty}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{item.unit}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{fmtRp(item.price)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-teal-600">{fmtRp(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50/70">
                <td colSpan={6} className="px-4 py-3 text-xs font-bold text-gray-600 text-right">Total Keseluruhan</td>
                <td className="px-4 py-3 text-sm font-extrabold text-teal-700">
                  {fmtRp(mockItems.reduce((s, i) => s + i.total, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: "/orders", label: "Semua Prescriptions", icon: "📋", color: "from-teal-500 to-teal-600" },
          { to: "/inventory", label: "Inventori Obat", icon: "📦", color: "from-blue-500 to-blue-600" },
          { to: "/customers", label: "Data Pasien", icon: "👥", color: "from-purple-500 to-purple-600" },
          { to: "/", label: "Dashboard", icon: "🏠", color: "from-gray-700 to-gray-800" },
        ].map(nav => (
          <Link key={nav.to} to={nav.to}
            className={`bg-gradient-to-br ${nav.color} text-white rounded-xl p-3.5 flex items-center gap-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
          >
            <span className="text-xl">{nav.icon}</span>
            <span className="text-xs font-bold">{nav.label}</span>
          </Link>
        ))}
      </div>

      {/* Edit Status Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-gray-800">Edit Status Order</h2>
              <button onClick={() => setEditModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <MdClose />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Ubah status untuk order <b>{order.id}</b></p>
            <div className="space-y-2 mb-5">
              {["Pending", "Completed", "Cancelled"].map(s => {
                const c = STATUS_CFG[s];
                return (
                  <label key={s} className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${editStatus === s ? `${c.border} ${c.bg}` : "border-gray-100 hover:border-gray-200"}`}>
                    <input type="radio" name="status" value={s} checked={editStatus === s} onChange={() => setEditStatus(s)} className="hidden" />
                    <span className={`w-3 h-3 rounded-full ${c.dot}`} />
                    <span className={`text-sm font-semibold ${editStatus === s ? c.text : "text-gray-600"}`}>{s}</span>
                    {editStatus === s && <MdCheckCircle className={`ml-auto ${c.text}`} />}
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditModal(false)} disabled={saving} className="px-4 py-2 text-sm text-gray-500 font-semibold">Batal</button>
              <button onClick={handleSaveStatus} disabled={saving}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg text-sm transition">
                <MdSave /> {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <MdDelete className="text-red-600 text-xl" />
              </div>
              <h2 className="text-base font-extrabold text-gray-800">Hapus Order</h2>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Yakin ingin menghapus order <b className="text-gray-800">{order.id}</b> milik <b className="text-gray-800">{order.customerName}</b>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteModal(false)} disabled={saving} className="px-4 py-2 text-sm text-gray-500 font-semibold">Batal</button>
              <button onClick={handleDelete} disabled={saving}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg text-sm transition">
                {saving ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
