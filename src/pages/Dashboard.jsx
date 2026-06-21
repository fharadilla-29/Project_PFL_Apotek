import { RiMedicineBottleLine } from "react-icons/ri";
import { MdPeople, MdInventory, MdTrendingUp, MdTrendingDown, MdArrowForward } from "react-icons/md";
import { BsClockHistory, BsBoxSeam } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { Link } from "react-router-dom";
import ordersData    from "../data/orders.json";
import customersData from "../data/customers.json";
import inventoryData from "../data/inventory.json";

// ── helpers ───────────────────────────────────────────────────────────────────
const totalRevenue = ordersData
  .filter(o => o.status === "Completed")
  .reduce((sum, o) => {
    const num = parseInt(o.totalPrice.replace(/[^0-9]/g, ""), 10);
    return sum + num;
  }, 0);

const fmtRp = n =>
  "Rp " + n.toLocaleString("id-ID").replace(/,/g, ".");

const STATUS_ORDER = {
  Completed: { bg: "bg-green-100",  text: "text-green-700",  label: "Completed"  },
  Pending:   { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending"    },
  Cancelled: { bg: "bg-red-100",    text: "text-red-600",    label: "Cancelled"  },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, label, value, sub, trend, trendUp }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-3">
      <div className={`p-2.5 rounded-xl text-lg flex-shrink-0 ${iconBg}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800 leading-tight">{value}</p>
        {trend && (
          <p className={`text-xs mt-0.5 font-medium flex items-center gap-0.5 ${trendUp ? "text-green-500" : "text-red-400"}`}>
            {trendUp ? <MdTrendingUp /> : <MdTrendingDown />} {trend}
          </p>
        )}
        {sub && !trend && <p className="text-xs mt-0.5 text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }) {
  const c = STATUS_ORDER[status] ?? STATUS_ORDER.Pending;
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const completed  = ordersData.filter(o => o.status === "Completed").length;
  const pending    = ordersData.filter(o => o.status === "Pending").length;
  const cancelled  = ordersData.filter(o => o.status === "Cancelled").length;
  const lowStock   = inventoryData.filter(d => ["low","critical","out-of-stock"].includes(d.status));
  const expiring   = inventoryData.filter(d => d.expiryDays !== null && d.expiryDays <= 30);
  const recentOrders = ordersData.slice(0, 8);

  return (
    <div className="flex gap-0 min-h-full">

      {/* ── Centre ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 p-6 overflow-auto">

        {/* Page heading */}
        <div className="mb-5">
          <h1 className="text-xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Selamat datang kembali, <span className="font-semibold text-gray-600">Aria Devani</span> — Ringkasan operasional apotek hari ini.
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
          <StatCard
            icon={<RiMedicineBottleLine />} iconBg="bg-teal-100 text-teal-600"
            label="Total Prescriptions" value="1,247"
            trend="+18 minggu ini" trendUp
          />
          <StatCard
            icon={<MdPeople />} iconBg="bg-blue-100 text-blue-600"
            label="Total Patients" value={customersData.length}
            trend="+5 bulan ini" trendUp
          />
          <StatCard
            icon={<BsBoxSeam />} iconBg="bg-orange-100 text-orange-500"
            label="Total Orders" value={ordersData.length}
            trend={`${cancelled} dibatalkan`} trendUp={false}
          />
          <StatCard
            icon={<MdTrendingUp />} iconBg="bg-green-100 text-green-600"
            label="Revenue Bulan Ini" value={fmtRp(totalRevenue)}
            trend="+12% vs bulan lalu" trendUp
          />
        </div>

        {/* ── Secondary stats row ── */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Completed</p>
            <p className="text-3xl font-extrabold text-green-600">{completed}</p>
            <p className="text-xs text-gray-400 mt-0.5">orders selesai</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Pending</p>
            <p className="text-3xl font-extrabold text-yellow-500">{pending}</p>
            <p className="text-xs text-gray-400 mt-0.5">menunggu proses</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Cancelled</p>
            <p className="text-3xl font-extrabold text-red-500">{cancelled}</p>
            <p className="text-xs text-gray-400 mt-0.5">dibatalkan</p>
          </div>
        </div>

        {/* ── Recent Orders table ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex-1">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">Recent Orders</span>
            <Link to="/orders" className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1">
              Lihat semua <MdArrowForward />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pelanggan</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-teal-600">{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://i.pravatar.cc/32?u=${order.customerName}`}
                          alt={order.customerName}
                          className="w-7 h-7 rounded-full flex-shrink-0"
                        />
                        <span className="text-sm text-gray-800 font-medium">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-semibold">{order.totalPrice}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{order.date}</td>
                    <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────────────── */}
      <div className="w-64 flex-shrink-0 border-l border-gray-100 bg-white flex flex-col overflow-auto">

        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800 mb-3">Quick Stats</p>

          <div className="space-y-3">
            {/* Inventory */}
            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
              <div className="p-2 bg-teal-100 rounded-lg text-teal-600 flex-shrink-0">
                <MdInventory className="text-base" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total SKU</p>
                <p className="text-sm font-extrabold text-gray-800">{inventoryData.length} items</p>
              </div>
            </div>
            {/* Low Stock */}
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 flex-shrink-0">
                <FiAlertTriangle className="text-base" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Stok Rendah</p>
                <p className="text-sm font-extrabold text-gray-800">{lowStock.length} obat</p>
              </div>
            </div>
            {/* Expiring */}
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-500 flex-shrink-0">
                <BsClockHistory className="text-base" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Hampir Kadaluarsa</p>
                <p className="text-sm font-extrabold text-gray-800">{expiring.length} obat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-800">Pasien Terbaru</p>
            <Link to="/customers" className="text-xs text-teal-600 font-semibold hover:underline">Lihat semua</Link>
          </div>
          <div className="space-y-2">
            {customersData.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center gap-2.5">
                <img
                  src={`https://i.pravatar.cc/32?u=${c.email}`}
                  alt={c.name}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-800 truncate">{c.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{c.email}</p>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  c.loyalty === "Gold"   ? "bg-yellow-100 text-yellow-700" :
                  c.loyalty === "Silver" ? "bg-gray-100 text-gray-600" :
                                           "bg-orange-100 text-orange-600"
                }`}>
                  {c.loyalty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert: low stock items */}
        <div className="p-4">
          <p className="text-sm font-bold text-gray-800 mb-3">Perlu Perhatian</p>
          <div className="space-y-2">
            {lowStock.slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{item.stock} / {item.maxStock} stok</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  item.status === "critical"      ? "bg-red-100 text-red-600" :
                  item.status === "out-of-stock"  ? "bg-gray-200 text-gray-600" :
                                                    "bg-yellow-100 text-yellow-700"
                }`}>
                  {item.status === "out-of-stock" ? "Habis" : item.status === "critical" ? "Kritis" : "Rendah"}
                </span>
              </div>
            ))}
          </div>
          <Link to="/inventory" className="mt-3 flex items-center gap-1 text-xs text-teal-600 font-semibold hover:underline">
            Lihat inventory <MdArrowForward />
          </Link>
        </div>
      </div>
    </div>
  );
}
