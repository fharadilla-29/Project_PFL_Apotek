import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function ErrorLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-100 px-8 py-4">
                <Header />
            </div>
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}
