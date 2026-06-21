import { useState } from "react";
import { MdClose, MdEmail, MdLock, MdPerson, MdPhone, MdCheckCircle, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { RiMedicineBottleLine } from "react-icons/ri";
import { ImSpinner2 } from "react-icons/im";
import { useAuth } from "../context/AuthContext";

// ── reusable input ────────────────────────────────────────────────────────────
function Field({ icon, label, name, type = "text", value, onChange, placeholder, extra }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">{icon}</span>
        <input
          type={isPassword && show ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm
                     outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                     hover:border-gray-300 bg-gray-50 hover:bg-white transition-all"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        )}
      </div>
      {extra}
    </div>
  );
}

// ── Login tab ─────────────────────────────────────────────────────────────────
function LoginTab({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      // Gunakan dummyjson — username: emilys / password: emilys123
      const res = await fetch("https://dummyjson.com/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.email, password: form.password }),
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3 flex items-start gap-2">
          <span className="text-base flex-shrink-0">⚠️</span> {error}
        </div>
      )}

      <Field icon={<MdPerson />}  label="Username" name="email"    value={form.email}
        onChange={handleChange} placeholder="emilys" />
      <Field icon={<MdLock />}    label="Password" name="password" value={form.password}
        onChange={handleChange} placeholder="••••••••" type="password"
        extra={
          <div className="flex justify-end mt-1">
            <button type="button" className="text-xs text-teal-600 hover:underline font-medium">
              Lupa password?
            </button>
          </div>
        }
      />

      <button type="submit" disabled={loading}
        className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50
                   text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
        {loading ? <><ImSpinner2 className="animate-spin" /> Sedang masuk...</> : "Masuk ke Akun"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Belum punya akun?{" "}
        <button type="button" onClick={onSwitch}
          className="text-teal-600 font-semibold hover:underline">
          Daftar sekarang
        </button>
      </p>

      {/* Demo hint */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-600">
        <b>Demo:</b> username <code className="bg-blue-100 px-1 rounded">emilys</code> · password <code className="bg-blue-100 px-1 rounded">emilys123</code>
      </div>
    </form>
  );
}

// ── Register tab ──────────────────────────────────────────────────────────────
function RegisterTab({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm]       = useState({ name: "", phone: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Password tidak cocok"); return; }
    if (form.password.length < 6)        { setError("Password minimal 6 karakter"); return; }
    setLoading(true); setError("");

    // Simulasi register — langsung login dengan data lokal
    await new Promise(r => setTimeout(r, 1200));
    setSuccess(true);
    await new Promise(r => setTimeout(r, 800));
    login({
      id:       Date.now(),
      name:     form.name,
      email:    form.email,
      phone:    form.phone,
      username: form.email.split("@")[0],
      avatar:   `https://i.pravatar.cc/80?u=${form.email}`,
      token:    "local-" + Date.now(),
    });
    setLoading(false);
  };

  if (success) return (
    <div className="text-center py-6 space-y-3">
      <MdCheckCircle className="text-green-500 text-5xl mx-auto" />
      <p className="font-extrabold text-gray-800 text-lg">Akun berhasil dibuat!</p>
      <p className="text-sm text-gray-500">Sedang masuk ke akun Anda...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3 flex items-start gap-2">
          <span className="text-base flex-shrink-0">⚠️</span> {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field icon={<MdPerson />} label="Nama Lengkap" name="name"  value={form.name}
          onChange={handleChange} placeholder="Nama kamu" />
        <Field icon={<MdPhone />}  label="Nomor WhatsApp" name="phone" value={form.phone}
          onChange={handleChange} placeholder="08xxxxxxxxxx" />
      </div>
      <Field icon={<MdEmail />} label="Email Address" name="email" type="email" value={form.email}
        onChange={handleChange} placeholder="email@example.com" />
      <div className="grid grid-cols-2 gap-3">
        <Field icon={<MdLock />} label="Password" name="password" type="password" value={form.password}
          onChange={handleChange} placeholder="Min. 6 karakter" />
        <Field icon={<MdLock />} label="Konfirmasi" name="confirm" type="password" value={form.confirm}
          onChange={handleChange} placeholder="Ulangi password" />
      </div>

      <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer">
        <input type="checkbox" required className="mt-0.5 accent-teal-600" />
        Saya setuju dengan{" "}
        <a href="#" className="text-teal-600 hover:underline font-medium">syarat &amp; ketentuan</a>{" "}
        dan{" "}
        <a href="#" className="text-teal-600 hover:underline font-medium">kebijakan privasi</a>
      </label>

      <button type="submit" disabled={loading}
        className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50
                   text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
        {loading ? <><ImSpinner2 className="animate-spin" /> Membuat akun...</> : "Buat Akun Gratis"}
      </button>

      <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-xs text-teal-700">
        ✓ Daftar gratis &nbsp;·&nbsp; ✓ Bonus 50 poin &nbsp;·&nbsp; ✓ Akses promo eksklusif
      </div>

      <p className="text-xs text-gray-400 text-center">
        Sudah punya akun?{" "}
        <button type="button" onClick={onSwitch}
          className="text-teal-600 font-semibold hover:underline">
          Masuk di sini
        </button>
      </p>
    </form>
  );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
export default function AuthModal() {
  const { showAuthModal, setShowAuthModal } = useAuth();
  const [tab, setTab] = useState("login");

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-xl p-1.5">
                <RiMedicineBottleLine className="text-white text-xl" />
              </div>
              <div>
                <p className="font-extrabold text-white text-base leading-none">Outlet Pharmacy</p>
                <p className="text-teal-200 text-xs mt-0.5">صيدلية أوتليت</p>
              </div>
            </div>
            <button onClick={() => setShowAuthModal(false)}
              className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all">
              <MdClose className="text-xl" />
            </button>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 mt-4 bg-teal-700/50 rounded-xl p-1">
            {[["login","Masuk"], ["register","Daftar"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
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

        {/* Body */}
        <div className="px-6 py-5">
          {/* Prompt teks */}
          <div className="mb-4">
            {tab === "login" ? (
              <>
                <h3 className="font-extrabold text-gray-800 text-base">Selamat datang kembali! 👋</h3>
                <p className="text-xs text-gray-400 mt-0.5">Masuk untuk melanjutkan pembelian</p>
              </>
            ) : (
              <>
                <h3 className="font-extrabold text-gray-800 text-base">Buat akun gratis 🎉</h3>
                <p className="text-xs text-gray-400 mt-0.5">Daftar dan dapatkan bonus 50 poin pertama</p>
              </>
            )}
          </div>

          {tab === "login"
            ? <LoginTab    onSwitch={() => setTab("register")} />
            : <RegisterTab onSwitch={() => setTab("login")}    />
          }
        </div>
      </div>
    </div>
  );
}
