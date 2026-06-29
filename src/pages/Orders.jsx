import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MdAdd, MdSearch, MdExpandMore, MdError, MdCheckCircle,
  MdDelete, MdEdit, MdVisibility, MdRefresh, MdPrint,
  MdFilterList, MdMoreVert, MdClose, MdArrowUpward, MdArrowDownward,
  MdLocalPharmacy, MdPeople, MdInventory, MdBarChart, MdDownload,
} from "react-icons/md";
import { FiAlertTriangle, FiPackage } from "react-icons/fi";
import { BsClockHistory } from "react-icons/bs";
import { ordersAPI } from "../services/ordersAPI";

// ── Config ─────────────────────────────────────────────────────────────────────
const STATUS_CFG = {
  Pending: {
    bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200",
    dot: "bg-yellow-400", ring: "ring-yellow-400", label: "Pending",
  },
  Processing: {
    bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200",
    dot: "bg-blue-400", ring: "ring-blue-400", label: "Diproses",
  },
  Shipped: {
    bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200",
    dot: "bg-indigo-400", ring: "ring-indigo-400", label: "Dikirim",
  },
  Completed: {
    bg: "bg-green-100", text: "text-green-700", border: "border-green-200",
    dot: "bg-green-500", ring: "ring-green-400", label: "Selesai",
  },
  Cancelled: {
    bg: "bg-red-100", text: "text-red-600", border: "border-red-200",
    dot: "bg-red-500", ring: "ring-red-400", label: "Dibatalkan",
  },
};

// Alur status: Pending → Processing → Shipped → Completed
const STATUS_FLOW = ["Pending", "Processing", "Shipped", "Completed"];

// Label tombol untuk memajukan ke status berikutnya
const NEXT_ACTION = {
  Pending:    "Terima Pesanan",
  Processing: "Kirim Pesanan",
  Shipped:    "Selesaikan",
};

function nextStatus(status) {
  const i = STATUS_FLOW.indexOf(status);
  return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
}

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label ?? status}
    </span>
  );
}

function fmtRp(n) {
  const num = Number(String(n).replace(/[^\d]/g, "")) || 0;
  return "Rp " + num.toLocaleString("id-ID");
}

function nextOrderId(orders) {
  const maxNum = orders.reduce((max, o) => {
    const m = /^ORD-(\d+)$/.exec(o.id);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);
  return `ORD-${String(maxNum + 1).padStart(3, "0")}`;
}

const emptyForm = { id: "", customerName: "", totalPrice: "", status: "Pending" };
const PAGE_SIZE = 8;

// ── Quick Stat Links ───────────────────────────────────────────────────────────
const quickLinks = [
  { to: "/inventory",  icon: <MdInventory />,      label: "Inventori Obat",   color: "text-blue-600  bg-blue-50  border-blue-100"  },
  { to: "/customers",  icon: <MdPeople />,          label: "Data Pasien",      color: "text-purple-600 bg-purple-50 border-purple-100" },
  { to: "/",           icon: <MdBarChart />,        label: "Dashboard",        color: "text-teal-600  bg-teal-50  border-teal-100"  },
  { to: "/membership", icon: <MdLocalPharmacy />,   label: "Membership",       color: "text-orange-600 bg-orange-50 border-orange-100" },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Orders() {
  const navigate = useNavigate();

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [form,    setForm]    = useState(emptyForm);

  // UI state
  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [deleteModal,     setDeleteModal]     = useState(null);   // order obj
  const [detailDrawer,    setDetailDrawer]    = useState(null);   // order obj
  const [search,          setSearch]          = useState("");
  const [filter,          setFilter]          = useState("all");
  const [sortField,       setSortField]       = useState("date");
  const [sortDir,         setSortDir]         = useState("desc");
  const [page,            setPage]            = useState(1);
  const [toast,           setToast]           = useState("");
  const [selectedRows,    setSelectedRows]    = useState([]);
  const [showQuickLinks,  setShowQuickLinks]  = useState(true);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      setLoading(true); setError("");
      const data = await ordersAPI.fetchOrders();
      setOrders(data);
    } catch {
      setError("Gagal memuat data order. Cek koneksi atau konfigurasi Supabase.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true); setError(""); setSuccess("");
      await ordersAPI.createOrder({
        id: form.id.trim(),
        customerName: form.customerName.trim(),
        status: form.status,
        totalPrice: Number(String(form.totalPrice).replace(/[^\d]/g, "")) || 0,
        date: new Date().toISOString().slice(0, 10),
      });
      setSuccess("Order berhasil ditambahkan!");
      setForm(emptyForm);
      await loadOrders();
      showToast("✅ Order baru berhasil dibuat!");
      setTimeout(() => { setSuccess(""); setIsModalOpen(false); }, 800);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Gagal menyimpan order";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Majukan status order ke tahap berikutnya & simpan ke Supabase
  const handleAdvanceStatus = async (order) => {
    const next = nextStatus(order.status);
    if (!next) return;
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: next } : o));
    try {
      await ordersAPI.updateOrder(order.id, { status: next });
      showToast(`✅ ${order.id} → ${STATUS_CFG[next]?.label ?? next}`);
    } catch {
      // Rollback bila gagal
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: order.status } : o));
      showToast("⚠️ Gagal memperbarui status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setOrders(prev => prev.filter(o => o.id !== deleteModal.id));
    setSaving(false);
    setDeleteModal(null);
    showToast("🗑️ Order berhasil dihapus!");
  };

  const handleDeleteSelected = () => {
    setOrders(prev => prev.filter(o => !selectedRows.includes(o.id)));
    setSelectedRows([]);
    showToast(`🗑️ ${selectedRows.length} order dihapus!`);
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  const toggleRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filtered.length) setSelectedRows([]);
    else setSelectedRows(filtered.map(o => o.id));
  };

  // ── Derived data ───────────────────────────────────────────────────────────────
  const completed = orders.filter(o => o.status === "Completed").length;
  const pending   = orders.filter(o => o.status === "Pending").length;
  const cancelled = orders.filter(o => o.status === "Cancelled").length;

  const totalRevenue = orders
    .filter(o => o.status === "Completed")
    .reduce((sum, o) => sum + (Number(String(o.totalPrice).replace(/[^\d]/g, "")) || 0), 0);

  const filtered = (() => {
    const q = search.toLowerCase();
    let res = orders.filter(o => {
      const matchQ = !q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q);
      const matchF = filter === "all" || o.status === filter;
      return matchQ && matchF;
    });
    res.sort((a, b) => {
      let av = a[sortField] ?? ""; let bv = b[sortField] ?? "";
      if (sortField === "totalPrice") {
        av = Number(String(av).replace(/[^\d]/g, ""));
        bv = Number(String(bv).replace(/[^\d]/g, ""));
      }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return res;
  })();

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortIcon = ({ field }) =>
    sortField === field
      ? (sortDir === "asc" ? <MdArrowUpward className="text-teal-500 text-xs ml-0.5" /> : <MdArrowDownward className="text-teal-500 text-xs ml-0.5" />)
      : <span className="text-gray-300 text-xs ml-0.5">↕</span>;

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          {toast}
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <Link to="/" className="hover:text-teal-600 transition">Dashboard</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">Prescriptions</span>
      </div>

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Prescriptions</h1>
          <p className="text-xs text-gray-400 mt-0.5">{orders.length} total orders · {pending} pending</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadOrders}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 font-semibold transition"
          >
            <MdRefresh className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={() => showToast("📥 Export sedang diproses...")}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 font-semibold transition"
          >
            <MdDownload /> Export
          </button>
          <button
            onClick={() => {
              setForm({ ...emptyForm, id: nextOrderId(orders) });
              setError(""); setSuccess(""); setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow transition-all"
          >
            <MdAdd /> Add Order
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && !isModalOpen && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-lg p-3 mb-4">
          <MdError /> {error}
          <button onClick={() => setError("")} className="ml-auto"><MdClose /></button>
        </div>
      )}

      {/* ── Stat Cards (Clickable filter) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "Total Revenue", val: fmtRp(totalRevenue), icon: <MdBarChart />,
            iconBg: "bg-teal-100 text-teal-600", filterVal: null,
            sub: `dari ${completed} transaksi`,
          },
          {
            label: "Completed", val: completed, icon: <MdCheckCircle />,
            iconBg: "bg-green-100 text-green-600", filterVal: "Completed",
            sub: `${orders.length ? Math.round(completed / orders.length * 100) : 0}% dari total`,
          },
          {
            label: "Pending", val: pending, icon: <BsClockHistory />,
            iconBg: "bg-yellow-100 text-yellow-600", filterVal: "Pending",
            sub: "Menunggu proses",
          },
          {
            label: "Cancelled", val: cancelled, icon: <FiAlertTriangle />,
            iconBg: "bg-red-100 text-red-500", filterVal: "Cancelled",
            sub: "Dibatalkan",
          },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => {
              if (s.filterVal) {
                setFilter(prev => prev === s.filterVal ? "all" : s.filterVal);
                setPage(1);
              }
            }}
            className={`rounded-xl p-4 border bg-white text-left transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5
              ${s.filterVal && filter === s.filterVal
                ? "ring-2 ring-teal-400 border-teal-200"
                : "border-gray-100 hover:border-gray-200"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-2 rounded-lg text-base ${s.iconBg}`}>{s.icon}</span>
              {s.filterVal && filter === s.filterVal && (
                <span className="text-[10px] bg-teal-100 text-teal-700 font-bold px-1.5 py-0.5 rounded-full">Aktif</span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-extrabold text-gray-800 leading-tight">{s.val}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
          </button>
        ))}
      </div>

      {/* ── Quick Nav Links ── */}
      {showQuickLinks && (
        <div className="bg-gradient-to-r from-teal-50 to-teal-100/50 border border-teal-100 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-teal-700">Navigasi Cepat</p>
            <button onClick={() => setShowQuickLinks(false)} className="text-teal-400 hover:text-teal-600 transition">
              <MdClose className="text-sm" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all hover:shadow-sm hover:-translate-y-0.5 ${l.color}`}
              >
                <span className="text-base">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Table Card ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-gray-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">Order List</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded-full">{filtered.length}</span>
            {selectedRows.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg font-semibold hover:bg-red-100 transition"
              >
                <MdDelete /> Hapus {selectedRows.length} terpilih
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Cari order atau pelanggan..."
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-teal-400 w-52"
              />
            </div>
            <div className="relative">
              <select
                value={filter}
                onChange={e => { setFilter(e.target.value); setPage(1); }}
                className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                <option value="all">All status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <MdExpandMore className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
            </div>
            {(filter !== "all" || search) && (
              <button
                onClick={() => { setFilter("all"); setSearch(""); setPage(1); }}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
              >
                <MdClose className="text-xs" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded accent-teal-600"
                  />
                </th>
                {[
                  { label: "Order ID",   field: "id"         },
                  { label: "Pelanggan",  field: "customerName" },
                  { label: "Total",      field: "totalPrice"  },
                  { label: "Tanggal",    field: "date"        },
                  { label: "Status",     field: "status"      },
                ].map(col => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field)}
                    className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 transition select-none"
                  >
                    <span className="flex items-center">{col.label} <SortIcon field={col.field} /></span>
                  </th>
                ))}
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              )}
              {!loading && paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <p className="text-3xl mb-2">📭</p>
                    <p className="text-sm text-gray-400">Tidak ada data yang cocok</p>
                    {(search || filter !== "all") && (
                      <button
                        onClick={() => { setSearch(""); setFilter("all"); setPage(1); }}
                        className="mt-2 text-xs text-teal-600 font-semibold hover:underline"
                      >
                        Reset filter
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {!loading && paginated.map(order => (
                <tr
                  key={order.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedRows.includes(order.id) ? "bg-teal-50/50" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(order.id)}
                      onChange={() => toggleRow(order.id)}
                      className="rounded accent-teal-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-sm font-semibold text-teal-600 hover:text-teal-800 hover:underline transition"
                    >
                      {order.id}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://i.pravatar.cc/32?u=${order.customerName}`}
                        alt=""
                        className="w-7 h-7 rounded-full flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm text-gray-800 font-medium">{order.customerName}</p>
                        <p className="text-[10px] text-gray-400">Pasien</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700">{fmtRp(order.totalPrice)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{order.date}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        title="Lihat Detail"
                        className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 border border-transparent hover:border-teal-200 transition"
                      >
                        <MdVisibility className="text-base" />
                      </button>
                      <button
                        onClick={() => setDetailDrawer(order)}
                        title="Quick Preview"
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition"
                      >
                        <MdMoreVert className="text-base" />
                      </button>
                      <button
                        onClick={() => setDeleteModal(order)}
                        title="Hapus Order"
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                      >
                        <MdDelete className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} orders
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition font-semibold"
            >
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dot${i}`} className="px-2 text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-2.5 py-1 text-xs border rounded-lg font-semibold transition ${
                      page === p
                        ? "bg-teal-600 text-white border-teal-600"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition font-semibold"
            >
              Next ›
            </button>
          </div>
        </div>
      </div>

      {/* ── Add Order Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-gray-800">Add New Order</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <MdClose />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-lg p-3 mb-3">
                <MdError /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-lg p-3 mb-3">
                <MdCheckCircle /> {success}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Order ID</label>
                <input type="text" name="id" value={form.id} onChange={handleChange} required disabled={saving}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="ORD-XXX"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Nama Pelanggan</label>
                <input type="text" name="customerName" value={form.customerName} onChange={handleChange} required disabled={saving}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Total (Rp)</label>
                <input type="number" name="totalPrice" value={form.totalPrice} onChange={handleChange} required disabled={saving} min="0"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="1250000"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Status</label>
                <select name="status" value={form.status} onChange={handleChange} disabled={saving}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={saving} className="px-4 py-2 text-sm text-gray-500 font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Quick Preview Drawer ── */}
      {detailDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDetailDrawer(null)} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl overflow-y-auto z-10 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs text-gray-400">Quick Preview</p>
                <h3 className="text-base font-extrabold text-gray-800">{detailDrawer.id}</h3>
              </div>
              <button onClick={() => setDetailDrawer(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <MdClose />
              </button>
            </div>

            <div className="p-5 flex-1 space-y-5">
              {/* Patient */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <img
                  src={`https://i.pravatar.cc/60?u=${detailDrawer.customerName}`}
                  alt=""
                  className="w-12 h-12 rounded-full border-2 border-teal-100"
                />
                <div>
                  <p className="font-bold text-gray-800">{detailDrawer.customerName}</p>
                  <p className="text-xs text-gray-400">Pasien Tetap · Gold Member</p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                {[
                  { label: "Order ID",    val: detailDrawer.id },
                  { label: "Tanggal",     val: detailDrawer.date },
                  { label: "Total",       val: fmtRp(detailDrawer.totalPrice), bold: true },
                  { label: "Status",      val: <StatusBadge status={detailDrawer.status} /> },
                  { label: "Apoteker",    val: "Aria Devani, S.Farm" },
                ].map(({ label, val, bold }) => (
                  <div key={label} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-400 text-xs">{label}</span>
                    <span className={`${bold ? "font-extrabold text-teal-600" : "font-semibold text-gray-700"} text-xs`}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Catatan Apoteker</p>
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-xs text-gray-600">
                  Pasien perlu diberikan instruksi penggunaan antibiotik dengan lengkap. Minum sesuai jadwal dan jangan dihentikan sebelum habis.
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-5 border-t border-gray-100 space-y-2">
              <button
                onClick={() => { setDetailDrawer(null); navigate(`/orders/${detailDrawer.id}`); }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1.5"
              >
                <MdVisibility /> Lihat Detail Lengkap
              </button>
              <button
                onClick={() => { setDeleteModal(detailDrawer); setDetailDrawer(null); }}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold py-2 rounded-xl text-sm transition flex items-center justify-center gap-1.5"
              >
                <MdDelete /> Hapus Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <MdDelete className="text-red-600 text-xl" />
              </div>
              <h2 className="text-base font-extrabold text-gray-800">Hapus Order?</h2>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Yakin ingin menghapus order <b className="text-gray-800">{deleteModal.id}</b> milik{" "}
              <b className="text-gray-800">{deleteModal.customerName}</b>?
              <br /><span className="text-red-400 text-xs">Tindakan ini tidak dapat dibatalkan.</span>
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={saving}
                className="px-4 py-2 text-sm text-gray-500 font-semibold hover:text-gray-700 transition"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg text-sm transition"
              >
                {saving ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
