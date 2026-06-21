import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import customerData from "../data/customers.json";

const LOYALTY_CFG = {
  Gold:   { bg: "bg-yellow-100", text: "text-yellow-700" },
  Silver: { bg: "bg-gray-100",   text: "text-gray-600"   },
  Bronze: { bg: "bg-orange-100", text: "text-orange-600" },
};

export default function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterLoyalty, setFilterLoyalty] = useState("all");

  const gold   = customerData.filter(c => c.loyalty === "Gold").length;
  const silver = customerData.filter(c => c.loyalty === "Silver").length;
  const bronze = customerData.filter(c => c.loyalty === "Bronze").length;

  const filtered = customerData.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    const matchL = filterLoyalty === "all" || c.loyalty === filterLoyalty;
    return matchQ && matchL;
  });

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Patients</h1>
          <p className="text-xs text-gray-400 mt-0.5">{customerData.length} total pasien terdaftar</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow transition-all"
        >
          <MdAdd /> + Add Patient
        </button>
      </div>

      {/* Loyalty stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Gold",   val: gold,   color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
          { label: "Silver", val: silver, color: "text-gray-600",   bg: "bg-gray-50 border-gray-100"    },
          { label: "Bronze", val: bronze, color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 border ${s.bg} text-center`}>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-400">pasien</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-800">Daftar Pasien</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama, email, ID..."
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-teal-400 w-52"
              />
            </div>
            <div className="flex gap-1">
              {["all","Gold","Silver","Bronze"].map(l => (
                <button key={l} onClick={() => setFilterLoyalty(l)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${filterLoyalty === l ? "bg-teal-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {l === "all" ? "Semua" : l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pasien</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loyalty</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-sm text-gray-400">Tidak ada data</td></tr>
              )}
              {filtered.map(c => {
                const lc = LOYALTY_CFG[c.loyalty] ?? LOYALTY_CFG.Bronze;
                return (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={`https://i.pravatar.cc/32?u=${c.email}`} alt="" className="w-8 h-8 rounded-full" />
                        <span className="text-sm font-semibold text-gray-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-teal-600">{c.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${lc.bg} ${lc.text}`}>{c.loyalty}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-lg font-semibold">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Menampilkan {filtered.length} dari {customerData.length} pasien</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <h2 className="text-lg font-extrabold text-gray-800 mb-5">Add New Patient</h2>
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Full Name</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Email Address</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Phone</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="08xxxxxxxxxx" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Loyalty</label>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                  <option>Bronze</option><option>Silver</option><option>Gold</option>
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
