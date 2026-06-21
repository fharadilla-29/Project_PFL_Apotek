import { FaBell } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">

            {/* Left: empty (title comes from page) */}
            <div />

            {/* Right: shift badge + icons + avatar */}
            <div className="flex items-center gap-3">
                {/* Shift indicator */}
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full">
                    Morning Shift · 08:00–14:00
                </span>

                {/* Notification bell */}
                <div className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-500">
                    <FaBell className="text-base" />
                </div>

                {/* Settings */}
                <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-500">
                    <SlSettings className="text-base" />
                </div>

                {/* Avatar */}
                <img
                    src="https://i.pravatar.cc/100?img=47"
                    alt="avatar"
                    className="w-9 h-9 rounded-full border-2 border-teal-200 cursor-pointer"
                />
            </div>
        </header>
    );
}
