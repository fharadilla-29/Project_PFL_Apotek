import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdPerson, MdLock, MdVisibility, MdVisibilityOff, MdArrowBack } from "react-icons/md";
import { RiMedicineBottleLine } from "react-icons/ri";
import { ImSpinner2 } from "react-icons/im";
import { BsGoogle, BsFacebook } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";

export default function GuestLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Setelah login, kembali ke halaman sebelumnya atau ke store
  const from = location.state?.from || "/store";

  const [tab, setTab]         = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPass, setShow]   = useState(false);

  const [loginForm, setLoginForm]     = useState({ username: "", password: "" });
  const [registerForm, setRegForm]    = useState({ name: "", phone: "", email: "", password: "" });

  /* ── Login handler ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await fetch("https://dummyjson.com/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginForm.username, password: loginForm.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");
      login({
        id:       data.id,
        name:     `${data.firstName} ${data.lastName}`,
        email:    data.email,
        username: data.username,
        avatar:   data.image,
        token:    data.accessToken,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Register handler (simulasi) ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 1000));
    login({
      id:       Date.now(),
      name:     registerForm.name,
      email:    registerForm.email,
      phone:    registerForm.phone,
      username: registerForm.email.split("@")[0],
      avatar:   `https://i.pravatar.cc/80?u=${registerForm.email}`,
      token:    "local-" + Date.now(),
    });
    navigate(from, { replace: true });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Simple top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <Link to="/store" className="flex items-center gap-2 group">
          <div className="bg-teal-600 group-hover:bg-teal-700 rounded-lg p-1.5 transition-colors">
            <RiMedicineBottleLine className="text-white text-lg" />
          </div>
          <span className="font-extrabold text-gray-900 text-base">Outlet <span className="text-teal-600">Pharmacy</span></span>
        </Link>
        <Link to="/store"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 transition-colors">
          <MdArrowBack /> Kembali ke Toko
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Tab header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 pb-0">
              <h1 className="text-white font-extrabold text-xl mb-1">
                {tab === "login" ? "Selamat Datang Kembali 👋" : "Buat Akun Baru 🎉"}
              </h1>
              <p className="text-teal-200 text-sm mb-5">
                {tab === "login"
                  ? "Masuk untuk melanjutkan belanja"
                  : "Daftar gratis dan dapatkan bonus 50 poin"}
              </p>

              {/* Tab switcher */}
              <div className="flex gap-1 bg-teal-700/40 rounded-t-xl p-1">
                {[["login","Masuk"], ["register","Daftar"]].map(([id, label]) => (
                  <button key={id} onClick={() => { setTab(id); setError(""); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                      tab === id
                        ? "bg-white text-teal-700 shadow-sm"
                        : "text-white/70 hover:text-white"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form body */}
            <div className="p-6">

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4 flex items-start gap-2">
                  ⚠️ {error}
                </div>
              )}

              {/* ── LOGIN FORM ── */}
              {tab === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Username</label>
                    <div className="relative">
                      <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                      <input type="text" required value={loginForm.username}
                        onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                        placeholder="e.g. emilys"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm
                                   outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                                   hover:border-gray-300 bg-gray-50 hover:bg-white transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                    <div className="relative">
                      <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                      <input type={showPass ? "text" : "password"} required value={loginForm.password}
                        onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm
                                   outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                                   hover:border-gray-300 bg-gray-50 hover:bg-white transition-all" />
                      <button type="button" onClick={() => setShow(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                    <div className="flex justify-end mt-1">
                      <button type="button" className="text-xs text-teal-600 hover:underline">Lupa password?</button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50
                               text-white font-bold py-3 rounded-xl text-sm transition-all
                               flex items-center justify-center gap-2">
                    {loading ? <><ImSpinner2 className="animate-spin" /> Sedang masuk...</> : "Masuk"}
                  </button>

                  {/* Demo hint */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-600">
                    <b>Akun demo:</b> username <code className="bg-blue-100 px-1 rounded">emilys</code> ·
                    password <code className="bg-blue-100 px-1 rounded">emilys123</code>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">atau masuk dengan</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Social */}
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button"
                      className="flex items-center justify-center gap-2 border border-gray-200
                                 rounded-xl py-2.5 text-sm text-gray-600 font-medium
                                 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all">
                      <BsGoogle className="text-red-500" /> Google
                    </button>
                    <button type="button"
                      className="flex items-center justify-center gap-2 border border-gray-200
                                 rounded-xl py-2.5 text-sm text-gray-600 font-medium
                                 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all">
                      <BsFacebook className="text-blue-600" /> Facebook
                    </button>
                  </div>
                </form>
              )}

              {/* ── REGISTER FORM ── */}
              {tab === "register" && (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Lengkap</label>
                      <div className="relative">
                        <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                        <input type="text" required value={registerForm.name}
                          onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="Nama kamu"
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm
                                     outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50 hover:bg-white transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">No. WhatsApp</label>
                      <input type="text" required value={registerForm.phone}
                        onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="08xxxxxxxxxx"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                                   outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50 hover:bg-white transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input type="email" required value={registerForm.email}
                      onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="email@example.com"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                                 outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50 hover:bg-white transition-all" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                    <div className="relative">
                      <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                      <input type={showPass ? "text" : "password"} required minLength={6} value={registerForm.password}
                        onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                        placeholder="Min. 6 karakter"
                        className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm
                                   outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50 hover:bg-white transition-all" />
                      <button type="button" onClick={() => setShow(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer pt-1">
                    <input type="checkbox" required className="mt-0.5 accent-teal-600 flex-shrink-0" />
                    Saya setuju dengan{" "}
                    <span className="text-teal-600 font-medium">syarat &amp; ketentuan</span>{" "}
                    dan{" "}
                    <span className="text-teal-600 font-medium">kebijakan privasi</span>
                  </label>

                  <button type="submit" disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50
                               text-white font-bold py-3 rounded-xl text-sm transition-all
                               flex items-center justify-center gap-2">
                    {loading ? <><ImSpinner2 className="animate-spin" /> Membuat akun...</> : "Buat Akun Gratis"}
                  </button>

                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-xs text-teal-700 text-center">
                    ✓ Gratis selamanya &nbsp;·&nbsp; ✓ Bonus 50 poin &nbsp;·&nbsp; ✓ Promo eksklusif member
                  </div>
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            © 2026 Outlet Pharmacy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
