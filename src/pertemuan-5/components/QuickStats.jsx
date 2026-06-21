import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function QuickStats() {
    const stats = [
        { label: "Revenue Growth", value: "+12.5%", change: "up", color: "text-green-500" },
        { label: "Order Rate", value: "+8.2%", change: "up", color: "text-green-500" },
        { label: "Cancellation Rate", value: "-3.1%", change: "down", color: "text-blue-500" },
        { label: "Avg Order Value", value: "+5.4%", change: "up", color: "text-green-500" },
    ];

    return (
        <div id="quick-stats" className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <div className="mt-3 flex items-end justify-between">
                        <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        <div className={`${stat.change === 'up' ? 'text-green-500' : 'text-blue-500'}`}>
                            {stat.change === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
