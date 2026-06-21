import {
    MdSpaceDashboard,
    MdListAlt,
    MdPeople,
    MdInventory,
    MdBarChart,
    MdSettings,
    MdCardMembership,
} from "react-icons/md";
import { RiMedicineBottleLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import membershipData from "../data/membership.json";

const expiring = membershipData.filter(m => m.status === "Expiring").length;

const menuItems = [
    { to: "/",           icon: <MdSpaceDashboard />,  label: "Dashboard"                                     },
    { to: "/orders",     icon: <MdListAlt />,          label: "Prescriptions", badge: 47                      },
    { to: "/inventory",  icon: <MdInventory />,        label: "Inventory",     badge: 8, badgeColor: "bg-red-500" },
    { to: "/customers",  icon: <MdPeople />,           label: "Patients"                                      },
    { to: "/membership", icon: <MdCardMembership />,   label: "Membership",    badge: expiring || null, badgeColor: "bg-orange-400" },
    { to: "/products",   icon: <MdBarChart />,         label: "Reports"                                       },
];

export default function Sidebar() {
    const menuClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
            isActive
                ? "bg-teal-50 text-teal-700 font-semibold"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        }`;

    return (
        <div className="flex flex-col w-52 min-h-screen bg-white border-r border-gray-100 py-5 px-4 flex-shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Logo */}
            <div className="flex items-center gap-2 px-2 mb-6">
                <div className="bg-teal-600 rounded-lg p-1.5 flex items-center justify-center">
                    <RiMedicineBottleLine className="text-white text-lg" />
                </div>
                <div className="leading-tight">
                    <span className="font-extrabold text-gray-900 text-base">RxFlow</span>
                    <span className="text-gray-400 font-normal text-base">/Pharmacy</span>
                </div>
            </div>

            {/* Menu label */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>

            {/* Nav */}
            <nav className="flex flex-col gap-0.5 flex-1">
                {menuItems.map((item) => (
                    <NavLink key={item.to} to={item.to} end={item.to === "/"} className={menuClass}>
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                            <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${item.badgeColor ?? "bg-orange-400"}`}>
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom: Settings + User */}
            <div className="mt-auto flex flex-col gap-2">
                <NavLink to="/components" className={menuClass}>
                    <MdSettings className="text-lg flex-shrink-0" />
                    <span>Settings</span>
                </NavLink>
                <a href="/store" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-teal-600 hover:bg-teal-50 font-semibold transition-all">
                    <span className="text-lg">🏪</span>
                    <span>Lihat Toko</span>
                </a>

                {/* User card */}
                <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 mt-1">
                    <img
                        src="https://i.pravatar.cc/100?img=47"
                        alt="avatar"
                        className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">Aria Devani</p>
                        <p className="text-[10px] text-gray-400 truncate">Senior Pharmacist · 89%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
