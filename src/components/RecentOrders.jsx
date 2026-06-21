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
        <div id="recent-orders" className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
            <div className="space-y-3">
                {orders.slice(0, 4).map((order, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                        <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{order.customer}</p>
                            <p className="text-xs text-gray-500">{order.id}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                            <p className="text-xs font-semibold text-gray-800">{order.amount}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
