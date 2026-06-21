import { useState } from "react";
import { MdAdd, MdSearch, MdExpandMore } from "react-icons/md";
import orderData from "../data/orders.json";

const STATUS_CFG = {
  Completed: { bg: "bg-green-100",  text: "text-green-700"  },
  Pending:   { bg: "bg-yellow-100", text: "text-yellow-700" },
  Cancelled: { bg: "bg-red-100",    text: "text-red-600"    },
};

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.Pending;
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {status}
    </span>
  );
}

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const completed = orderData.filter(o => o.status === "Completed").length;
  const pending   = orderData.filter(o => o.status === "Pending").length;
  const cancelled = orderData.filter(o => o.status === "Cancelled").length;

  const filtered = orderData.filter(o => {
    const q = search.toLowerCase();
    const matchQ = !q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q);
    const matchF = filter === "all" || o.status === filter;
    return matchQ && matchF;
  });

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Prescriptions</h1>
          <p className="text-xs text-gray-400 mt-0.5">{orderData.length} total orders · {pending} pending</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow transition-all"
        >
          <MdAdd /> + Add Order
        </button>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Completed", val: completed, color: "text-green-600", bg: "bg-green-50 border-green-100" },
          { label: "Pending",   val: pending,   color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
          { label: "Cancelled", val: cancelled, color: "text-red-500",   bg: "bg-red-50 border-red-100"   },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 border ${s.bg} text-center`}>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-800">Order List</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari order atau pelanggan..."
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-teal-400 w-52"
              />
            </div>
            <div className="relative">
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer">
                <option value="all">All status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <MdExpandMore className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pelanggan</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-sm text-gray-400">Tidak ada data</td></tr>
              )}
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-teal-600">{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={`https://i.pravatar.cc/32?u=${order.customerName}`} alt="" className="w-7 h-7 rounded-full" />
                      <span className="text-sm text-gray-800 font-medium">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700">{order.totalPrice}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{order.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3">
                    <button className="text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-lg font-semibold">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Menampilkan {filtered.length} dari {orderData.length} orders</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <h2 className="text-lg font-extrabold text-gray-800 mb-5">Add New Order</h2>
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Order ID</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="#ORD-XXX" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Nama Pelanggan</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Status</label>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-500 font-semibold">Cancel</button>
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-lg text-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
