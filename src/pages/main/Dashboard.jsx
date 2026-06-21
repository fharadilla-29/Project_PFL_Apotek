import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";

export default function Dashboard() {
    return (
        <div id="dashboard-container" className="bg-gray-50 min-h-screen">
            <PageHeader 
                title="Dashboard" 
                breadcrumb="Statistics" 
                buttonText="+ Filter Data" 
            />
            <div id="dashboard-grid" className="p-8">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Pesanan Masuk */}
                    <div id="dashboard-orders" className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div id="orders-icon" className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-full p-5 text-3xl text-white shadow-lg">
                                <FaShoppingCart />
                            </div>
                            <span className="bg-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Hari Ini</span>
                        </div>
                        <div id="orders-info" className="flex flex-col">
                            <span id="orders-count" className="font-bold text-4xl text-amber-900">12</span>
                            <span id="orders-text" className="text-amber-600 font-medium mt-1">Pesanan Masuk</span>
                        </div>
                    </div>

                    {/* Menu Terlaris */}
                    <div id="dashboard-delivered" className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div id="delivered-icon" className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full p-5 text-3xl text-white shadow-lg">
                                <FaTruck />
                            </div>
                            <span className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Top</span>
                        </div>
                        <div id="delivered-info" className="flex flex-col">
                            <span id="delivered-count" className="font-bold text-2xl text-yellow-900">Cappuccino</span>
                            <span id="delivered-text" className="text-yellow-600 font-medium mt-1">Menu Terlaris</span>
                        </div>
                    </div>

                    {/* Stok Menipis */}
                    <div id="dashboard-canceled" className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div id="canceled-icon" className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-full p-5 text-3xl text-white shadow-lg">
                                <FaBan />
                            </div>
                            <span className="bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Peringatan</span>
                        </div>
                        <div id="canceled-info" className="flex flex-col">
                            <span id="canceled-count" className="font-bold text-4xl text-orange-900">5</span>
                            <span id="canceled-text" className="text-orange-600 font-medium mt-1">Item Stok Menipis</span>
                        </div>
                    </div>

                    {/* Pesanan Selesai */}
                    <div id="dashboard-revenue" className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div id="revenue-icon" className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-full p-5 text-3xl text-white shadow-lg">
                                <FaDollarSign />
                            </div>
                            <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Sukses</span>
                        </div>
                        <div id="revenue-info" className="flex flex-col">
                            <span id="revenue-amount" className="font-bold text-4xl text-amber-900">28</span>
                            <span id="revenue-text" className="text-amber-600 font-medium mt-1">Pesanan Selesai</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}