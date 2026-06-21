import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import { useState } from "react";

export default function Header({ onSearchOpen }) {
    const [searchValue, setSearchValue] = useState("");

    const handleSearchClick = () => {
        onSearchOpen?.();
    };

    return (
    <header className="">
            <div className="flex items-center justify-between">

                {/* Search Bar */}
                <div className="relative w-full max-w-lg mx-8">
                    <input
                        className="border border-gray-100 p-2 pr-10 bg-white w-full rounded-md outline-none cursor-pointer hover:border-gray-200"
                        type="text"
                        placeholder="Search Here..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onClick={handleSearchClick}
                        readOnly
                    />
                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 cursor-pointer" onClick={handleSearchClick}/>
                </div>

                {/* Icon & Profile Section */}
                <div className="flex items-center space-x-4">
                    {/* Icons */}
                    <div className="relative p-3 bg-blue-100 rounded-2xl text-blue-500 cursor-pointer">
                        <FaBell />
                        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-200 rounded-full px-2 py-1 text-xs">50</span>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-2xl cursor-pointer">
                        <FcAreaChart />
                    </div>
                    <div className="p-3 bg-red-100 rounded-2xl text-red-500 cursor-pointer">
                        <SlSettings />
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center space-x-4 border-l pl-4 border-gray-300">
                        <span>
                            Hello, <b>Fhara Dilla</b>
                        </span>
                        <img
                            src="/img/fhara.jpeg"
                            className="w-10 h-10 rounded-full"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
