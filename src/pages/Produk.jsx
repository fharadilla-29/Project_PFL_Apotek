import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { MdAdd, MdSearch } from "react-icons/md";

export default function Produk() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("https://dummyjson.com/products?limit=30")
      .then(res => { setAllProducts(res.data.products); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const categories = ["All", ...new Set(allProducts.map(p => p.category))];
  const filtered = allProducts.filter(p => {
    const matchQ = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm);
    const matchC = selectedCategory === "All" || p.category === selectedCategory;
    return matchQ && matchC;
  });

  if (loading) return (
    <div className="p-6">
      <div className="mb-5"><h1 className="text-xl font-extrabold text-gray-900">Produk</h1></div>
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="mb-5"><h1 className="text-xl font-extrabold text-gray-900">Produk</h1></div>
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-semibold text-sm">Gagal memuat data: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Produk</h1>
          <p className="text-xs text-gray-400 mt-0.5">{filtered.length} dari {allProducts.length} produk</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow transition-all"
        >
          <MdAdd /> Add Product
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari produk atau ID..."
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400 w-full"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${selectedCategory === cat ? "bg-teal-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produk</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Brand</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Harga</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-sm text-gray-400">Tidak ada produk</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-teal-600">{p.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={p.thumbnail} alt={p.title} className="w-9 h-9 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                      <Link to={`/products/${p.id}`} className="text-sm font-semibold text-gray-800 hover:text-teal-600 transition-colors">
                        {p.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.brand || "—"}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    Rp {(p.price * 1000).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      p.stock > 20 ? "bg-green-100 text-green-700" :
                      p.stock > 10 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"
                    }`}>{p.stock} items</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-yellow-500">⭐ {p.rating}</td>
                  <td className="px-4 py-3">
                    <Link to={`/products/${p.id}`} className="text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-lg font-semibold">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <h2 className="text-lg font-extrabold text-gray-800 mb-5">Add New Product</h2>
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Product Title</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="Nama produk" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">Category</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">Brand</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">Price</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">Stock</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" placeholder="0" />
                </div>
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
