import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import menuData from "../../data/menu.json";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function Menu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasError] = useState(false);

  return (
    <div className="p-4">
      <PageHeader title="Menu" breadcrumb="Menu Items">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-amber-800 transition-all"
        >
          <FiPlus /> Add New Menu
        </button>
      </PageHeader>

      {/* MODAL POP UP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Menu</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Menu Name</label>
                <input type="text" className="w-full border rounded-xl p-3" placeholder="Menu name" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select className="w-full border rounded-xl p-3 bg-white outline-none">
                  <option>Kopi</option>
                  <option>Minuman</option>
                  <option>Makanan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Price (Rp)</label>
                <input type="number" className="w-full border rounded-xl p-3" placeholder="Price" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-medium">Cancel</button>
                <button type="submit" className="bg-amber-700 text-white px-6 py-2 rounded-xl font-bold">Add Menu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="mt-6 p-8 bg-red-50 border-2 border-red-300 rounded-xl text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Menu Data Tidak Tersedia</h3>
          <p className="text-red-600 mb-4">Gagal memuat data menu dari server</p>
          <button className="bg-red-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-800 transition-all">
            Coba Lagi
          </button>
        </div>
      )}

      {/* Menu Grid */}
      {!hasError && (
      <div className="mt-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuData.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-4 text-center">{item.image}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{item.category}</p>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-amber-700">Rp {item.price.toLocaleString('id-ID')}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                item.available 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.available ? 'Tersedia' : 'Habis'}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                <FiEdit2 size={16} /> Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors">
                <FiTrash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
