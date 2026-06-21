import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";

const productsData = [
  { id: "PRD-001", name: "Metformin 500mg",     category: "Antidiabetic",  price: "Rp 45.000",  status: "Active"   },
  { id: "PRD-002", name: "Atorvastatin 20mg",   category: "Statin",        price: "Rp 85.000",  status: "Active"   },
  { id: "PRD-003", name: "Amoxicillin 250mg",   category: "Antibiotic",    price: "Rp 35.000",  status: "Active"   },
  { id: "PRD-004", name: "Warfarin 5mg",         category: "Anticoagulant", price: "Rp 120.000", status: "Active"   },
  { id: "PRD-005", name: "Insulin Glargine",     category: "Hormone",       price: "Rp 250.000", status: "Active"   },
  { id: "PRD-006", name: "Lisinopril 10mg",      category: "ACE Inhibitor", price: "Rp 60.000",  status: "Active"   },
  { id: "PRD-007", name: "Sertraline 50mg",      category: "Antidepressant",price: "Rp 95.000",  status: "Active"   },
  { id: "PRD-008", name: "Donepezil 5mg",        category: "Cognitive",     price: "Rp 180.000", status: "Inactive" },
  { id: "PRD-009", name: "Omeprazole 20mg",      category: "Antacid",       price: "Rp 40.000",  status: "Active"   },
  { id: "PRD-010", name: "Pravastatin 40mg",     category: "Statin",        price: "Rp 75.000",  status: "Inactive" },
];

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = productsData.filter(p => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">{productsData.length} total produk terdaftar</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow transition-all"
        >
          <MdAdd /> + Add Product
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Active</p>
          <p className="text-3xl font-extrabold text-green-600">{productsData.filter(p => p.status === "Active").length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Inactive</p>
          <p className="text-3xl font-extrabold text-gray-400">{productsData.filter(p => p.status === "Inactive").length}</p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-800">Product List</span>
          <div className="relative">
            <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-teal-400 w-52"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product ID</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Produk</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-sm text-gray-400">Tidak ada produk</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-teal-600">{p.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.category}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700">{p.price}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-lg font-semibold">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Menampilkan {filtered.length} dari {productsData.length} produk</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <h2 className="text-lg font-extrabold text-gray-800 mb-5">Add New Product</h2>
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Nama Produk</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="e.g. Metformin 500mg" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Category</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="e.g. Antibiotic" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Harga</label>
                <input type="number" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="0" />
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
