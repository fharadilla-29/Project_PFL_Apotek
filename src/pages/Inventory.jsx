import { useState, useMemo } from "react";
import { MdAdd, MdSearch, MdExpandMore, MdChevronLeft, MdChevronRight, MdOpenInFull } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";
import { BsBoxSeam, BsClockHistory } from "react-icons/bs";
import { RiMedicineBottleLine } from "react-icons/ri";
import inventoryData from "../data/inventory.json";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  critical:      { label: "Critical",     dot: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50",    border: "border-red-200"   },
  low:           { label: "Low",          dot: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
  expiring:      { label: "Expiring",     dot: "bg-orange-400", text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  "out-of-stock":{ label: "Out of stock", dot: "bg-gray-400",   text: "text-gray-600",   bg: "bg-gray-100",  border: "border-gray-200"   },
  healthy:       { label: "Healthy",      dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50",  border: "border-green-200"  },
};

const ACTION_CFG = {
  critical:      { label: "Reorder",  cls: "bg-red-500 hover:bg-red-600 text-white"          },
  low:           { label: "Reorder",  cls: "bg-gray-900 hover:bg-black text-white"            },
  expiring:      { label: "Inspect",  cls: "bg-orange-400 hover:bg-orange-500 text-white"     },
  "out-of-stock":{ label: "Restock",  cls: "bg-gray-900 hover:bg-black text-white"            },
  healthy:       { label: "View",     cls: "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white" },
};

// ── Small reusable pieces ─────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.healthy;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} border ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function StockBar({ stock, maxStock, status }) {
  const pct = maxStock > 0 ? Math.min((stock / maxStock) * 100, 100) : 0;
  const bar = status === "critical" || status === "out-of-stock" ? "bg-red-500"
            : status === "low"      ? "bg-yellow-400"
            : status === "expiring" ? "bg-orange-400"
            : "bg-green-500";
  return (
    <div className="w-full min-w-[120px]">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span className="font-semibold text-gray-700">{stock} <span className="font-normal text-gray-400">/ {maxStock} tabs</span></span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Stat card (top 4) ─────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, label, value, sub, subColor }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-3">
      <div className={`p-2.5 rounded-xl text-lg flex-shrink-0 ${iconBg}`}>{icon}</div>
      <div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide leading-none mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800 leading-tight">{value}</p>
        <p className={`text-xs mt-0.5 font-medium ${subColor ?? "text-gray-400"}`}>{sub}</p>
      </div>
    </div>
  );
}

// ── Expiring Soon card (right panel) ─────────────────────────────────────────
function ExpiringSoonItem({ item }) {
  const d = item.expiryDays;
  const bg = d <= 7 ? "bg-red-500" : d <= 20 ? "bg-orange-400" : d <= 40 ? "bg-yellow-400" : "bg-blue-400";
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className={`${bg} text-white rounded-lg px-2 py-1 text-center min-w-[42px] flex-shrink-0`}>
        <div className="text-base font-extrabold leading-none">{d}</div>
        <div className="text-[9px] uppercase tracking-wide">days</div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
        <p className="text-[11px] text-gray-400 truncate">{item.sku}</p>
      </div>
    </div>
  );
}

// ── Low Stock Alerts card (right panel) ──────────────────────────────────────
function LowStockItem({ item }) {
  const pct = item.maxStock > 0 ? Math.round((item.stock / item.maxStock) * 100) : 0;
  const a = ACTION_CFG[item.status];
  return (
    <div className="py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <div className="min-w-0 mr-2">
          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
          <p className="text-[11px] text-gray-400">{item.id}</p>
        </div>
        <button className={`text-[11px] font-bold px-3 py-1 rounded-lg flex-shrink-0 ${a.cls}`}>{a.label}</button>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${pct < 15 ? "bg-red-500" : "bg-yellow-400"}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11px] text-gray-400 flex-shrink-0">{item.stock} / {item.maxStock} ({pct}%)</span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 12;

export default function Inventory() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("all");
  const [page, setPage]             = useState(1);
  const [showModal, setShowModal]   = useState(false);

  const lowStock     = inventoryData.filter(d => ["low","critical","out-of-stock"].includes(d.status));
  const expiringSoon = inventoryData.filter(d => d.expiryDays !== null && d.expiryDays <= 30)
                                    .sort((a, b) => a.expiryDays - b.expiryDays);
  const urgent       = inventoryData.filter(d => d.expiryDays !== null && d.expiryDays <= 7).length;
  const outOfStock   = inventoryData.filter(d => d.status === "out-of-stock").length;
  const alertCount   = inventoryData.filter(d => d.status !== "healthy").length;

  const filtered = useMemo(() => inventoryData.filter(item => {
    const q = search.toLowerCase();
    const matchQ = !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q) || item.batch.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || item.status === statusFilter;
    return matchQ && matchS;
  }), [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleSearch = e => { setSearch(e.target.value); setPage(1); };
  const handleStatus = e => { setStatus(e.target.value); setPage(1); };

  return (
    <div className="flex gap-0 h-full">

      {/* ── Centre column ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 p-6 overflow-auto">

        {/* Page header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Inventory</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {inventoryData.length} SKUs &nbsp;·&nbsp;
              <span className="text-red-500 font-semibold">{lowStock.length} below reorder</span>
              &nbsp;·&nbsp;
              <span className="text-orange-500 font-semibold">{expiringSoon.length} expiring within 30 days</span>
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow transition-all"
          >
            <MdAdd className="text-base" /> + Add Stock
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
          <StatCard icon={<RiMedicineBottleLine />} iconBg="bg-blue-100 text-blue-600"
            label="Total Prescriptions" value="1,247" sub="+18 new this week" subColor="text-green-500" />
          <StatCard icon={<FiAlertTriangle />} iconBg="bg-yellow-100 text-yellow-500"
            label="Low Stock" value={lowStock.length} sub="+2 below reorder point" subColor="text-yellow-500" />
          <StatCard icon={<BsClockHistory />} iconBg="bg-orange-100 text-orange-500"
            label="Expiring 300" value={expiringSoon.length} sub={`${urgent} urgent within 7 days`} subColor="text-red-500" />
          <StatCard icon={<BsBoxSeam />} iconBg="bg-red-100 text-red-500"
            label="Out of Stock" value={outOfStock} sub="-1 vs yesterday" subColor="text-red-400" />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col flex-1">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-800">Stock items</span>
              {alertCount > 0 && (
                <span className="bg-red-100 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {alertCount} alerts
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  value={search} onChange={handleSearch}
                  placeholder="Search drug, SKU, batch..."
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-teal-400 w-52"
                />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={handleStatus}
                  className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer">
                  <option value="all">All statuses</option>
                  <option value="healthy">Healthy</option>
                  <option value="low">Low</option>
                  <option value="critical">Critical</option>
                  <option value="expiring">Expiring</option>
                  <option value="out-of-stock">Out of stock</option>
                </select>
                <MdExpandMore className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
              </div>
              <div className="relative">
                <select className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer">
                  <option>All priority</option>
                  <option>High</option>
                  <option>Normal</option>
                </select>
                <MdExpandMore className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
              </div>
              <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                <MdOpenInFull className="text-gray-500 text-sm" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Drug</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Next Expiry</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-sm text-gray-400">No items found</td></tr>
                )}
                {rows.map(item => {
                  const a = ACTION_CFG[item.status];
                  const rowBg = item.status === "critical" ? "bg-red-50/50"
                              : item.status === "expiring" ? "bg-orange-50/40" : "";
                  return (
                    <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${rowBg}`}>
                      <td className="px-4 py-3 min-w-[170px]">
                        <p className={`text-sm font-semibold ${["critical","expiring"].includes(item.status) ? "text-red-600" : "text-gray-800"}`}>
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400">{item.id} · {item.batch}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{item.category}</td>
                      <td className="px-4 py-3 min-w-[140px]">
                        <StockBar stock={item.stock} maxStock={item.maxStock} status={item.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.nextExpiry ? (
                          <>
                            <p className="text-sm text-gray-800 font-medium">{item.nextExpiry}</p>
                            <p className={`text-[11px] font-semibold ${item.expiryDays <= 7 ? "text-red-500" : item.expiryDays <= 30 ? "text-orange-500" : "text-gray-400"}`}>
                              in {item.expiryDays} days
                            </p>
                          </>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-4 py-3">
                        <button className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap ${a.cls}`}>{a.label}</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} SKUs
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex items-center gap-1 text-xs text-gray-500 px-2 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">
                <MdChevronLeft /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold ${n === page ? "bg-teal-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex items-center gap-1 text-xs text-gray-500 px-2 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">
                Next <MdChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right sidebar panel ───────────────────────────────────── */}
      <div className="w-64 flex-shrink-0 border-l border-gray-100 bg-white flex flex-col gap-0 overflow-auto">

        {/* Expiring Soon */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-800">Expiring Soon</span>
            <span className="text-[11px] text-gray-400">{expiringSoon.length} within 30 days</span>
          </div>
          {expiringSoon.slice(0, 4).map(item => <ExpiringSoonItem key={item.id} item={item} />)}
          {expiringSoon.length > 4 && (
            <button className="mt-2 text-xs text-teal-600 font-semibold hover:underline">
              View all {expiringSoon.length} expiring →
            </button>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-800">Low Stock Alerts</span>
            <span className="text-[11px] text-gray-400">{lowStock.length} below reorder</span>
          </div>
          {lowStock.slice(0, 3).map(item => <LowStockItem key={item.id} item={item} />)}
          {lowStock.length > 3 && (
            <button className="mt-2 text-xs text-teal-600 font-semibold hover:underline">
              View all {lowStock.length} low stock →
            </button>
          )}
        </div>
      </div>

      {/* ── Add Stock Modal ───────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <h2 className="text-lg font-extrabold text-gray-800 mb-5">Add Stock</h2>
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); setShowModal(false); }}>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Drug Name</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="e.g. Metformin 500mg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">SKU / ID</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="MET-500-T" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">Batch No.</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="Batch XXXX" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">Category</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="Antibiotic" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">Stock Qty</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Expiry Date</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500 font-semibold hover:text-gray-700">Cancel</button>
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-lg text-sm">Add Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
