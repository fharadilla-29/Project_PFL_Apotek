import { FaEye } from "react-icons/fa";

export default function RecentOrders() {
    const orders = [
        { id: "#001", customer: "Fhara Dilla", amount: "Rp. 250.000", status: "Completed", date: "2025-01-10" },
        { id: "#002", customer: "Sarah Johnson", amount: "Rp. 175.000", status: "Pending", date: "2025-01-09" },
        { id: "#003", customer: "Michael Chen", amount: "Rp. 320.000", status: "Completed", date: "2025-01-08" },
        { id: "#004", customer: "Emma Davis", amount: "Rp. 145.000", status: "Cancelled", date: "2025-01-07" },
        { id: "#005", customer: "Alex Wilson", amount: "Rp. 280.000", status: "Completed", date: "2025-01-06" },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700";
            case "Pending":
                return "bg-yellow-100 text-yellow-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div id="recent-orders" className="mt-10 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                        <tr className="text-left text-gray-600">
                            <th className="pb-3 font-semibold">Order ID</th>
                            <th className="pb-3 font-semibold">Customer</th>
                            <th className="pb-3 font-semibold">Amount</th>
                            <th className="pb-3 font-semibold">Status</th>
                            <th className="pb-3 font-semibold">Date</th>
                            <th className="pb-3 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 font-medium text-gray-800">{order.id}</td>
                                <td className="py-3 text-gray-700">{order.customer}</td>
                                <td className="py-3 font-semibold text-gray-800">{order.amount}</td>
                                <td className="py-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-3 text-gray-600">{order.date}</td>
                                <td className="py-3 cursor-pointer hover:text-hijau">
                                    <FaEye className="text-gray-600 hover:text-green-500" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
