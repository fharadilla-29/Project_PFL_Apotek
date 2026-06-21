import axios from "axios";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { RiMedicineBottleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataForm, setDataForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        axios.post("https://dummyjson.com/auth/login", {
            username: dataForm.email,
            password: dataForm.password,
        })
        .then(res => {
            if (res.status === 200) {
                localStorage.setItem("accessToken", res.data.accessToken);
                navigate("/");
            }
        })
        .catch(err => setError(err.response?.data?.message || err.message || "Login gagal"))
        .finally(() => setLoading(false));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="bg-teal-600 rounded-xl p-2">
                        <RiMedicineBottleLine className="text-white text-2xl" />
                    </div>
                    <div className="leading-tight">
                        <span className="font-extrabold text-gray-900 text-xl">RxFlow</span>
                        <span className="text-gray-400 font-normal text-xl">/Pharmacy</span>
                    </div>
                </div>

                <h2 className="text-lg font-extrabold text-gray-800 mb-1 text-center">Selamat Datang 👋</h2>
                <p className="text-xs text-gray-400 text-center mb-6">Masuk ke dashboard apotek Anda</p>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-lg p-3 mb-4">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="bg-teal-50 border border-teal-100 text-teal-600 text-xs font-medium rounded-lg p-3 mb-4 flex items-center gap-2">
                        <ImSpinner2 className="animate-spin" /> Sedang masuk...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
                        <input type="text" name="email" onChange={handleChange} value={dataForm.email}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50"
                            placeholder="emilys" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" onChange={handleChange} value={dataForm.password}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50"
                            placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-sm transition-all mt-2">
                        {loading ? "Mohon Tunggu..." : "Masuk"}
                    </button>
                </form>

                <p className="text-center text-[11px] text-gray-400 mt-6">
                    © 2026 RxFlow Admin. All rights reserved.
                </p>
            </div>
        </div>
    );
}
