import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Search</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Cari order, produk, atau pelanggan..."
                        className="border border-gray-300 p-3 pr-10 w-full rounded-md outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200"
                        autoFocus
                    />
                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="space-y-2">
                    <div className="p-3 hover:bg-gray-100 rounded-md cursor-pointer">
                        <p className="text-sm font-semibold text-gray-700">Order #001</p>
                        <p className="text-xs text-gray-500">Total: Rp. 250.000</p>
                    </div>
                    <div className="p-3 hover:bg-gray-100 rounded-md cursor-pointer">
                        <p className="text-sm font-semibold text-gray-700">Product: Nasi Goreng</p>
                        <p className="text-xs text-gray-500">In Stock</p>
                    </div>
                    <div className="p-3 hover:bg-gray-100 rounded-md cursor-pointer">
                        <p className="text-sm font-semibold text-gray-700">Customer: John Doe</p>
                        <p className="text-xs text-gray-500">Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
