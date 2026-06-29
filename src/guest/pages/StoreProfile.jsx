import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  MdPerson, MdArrowBack, MdEdit, MdSave, MdClose,
  MdEmail, MdPhone, MdLocationOn, MdCake,
  MdShoppingCart, MdReceipt, MdCardMembership,
} from "react-icons/md";
import { BsStarFill } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import {
  TIER_CFG,
} from "../../pages/membership/membershipConfig";

export default function StoreProfile() {
  const { user, memberData } = useAuth();
  const [editing, setEditing]   = useState(false);
  const [toast, setToast]       = useState("");
  const [form, setForm]         = useState({
    name:      user?.name  ?? "",
    email:     user?.email ?? user?.username ?? "",
    phone:     "081234567890",
    birthdate: "1995-06-15",
    address:   "Jl. Merdeka No. 10, Jakarta Pusat",
    gender:    "Perempuan",
  });

  if (!user) {
    return <Navigate to="/store/login" state={{ from: "/store/profile" }} replace />;
  }

  const member = memberData;
  const cfg    = member ? (TIER_CFG[member.tier] ?? TIER_CFG.Silver) : TIER_CFG.Silver;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleSave = () => {
    setEditing(false);
    showToast("✅ Profil berhasil disimpan!");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/store" className="hover:text-teal-600 transition">Beranda</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Profil Saya</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/store/membership"
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition">
          <MdArrowBack className="text-lg" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <MdPerson className="text-teal-600" /> Profil Saya
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Kelola informasi akun kamu</p>
        </div>
      </div>

      {/* Profile card hero */}
      <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg mb-6 ${cfg.darkBg}`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar ?? `https://i.pravatar.cc/80?u=${user.name}`}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white/30 object-cover"
            />
            <span className="absolute -bottom-1 -right-1 text-xl">{cfg.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-extrabold leading-tight">{user.name}</p>
            <p className="text-sm opacity-80">{user.email ?? user.username}</p>
            {member && (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold">
                  {cfg.label} Member
                </span>
                <span className="flex items-center gap-1 text-xs font-bold">
                  <BsStarFill className="text-yellow-300 text-xs" />
                  {member.points?.toLocaleString("id-ID")} poin
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info form */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Informasi Pribadi</h2>
          {editing ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(false)}
                className="text-xs text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-100 font-semibold transition flex items-center gap-1">
                <MdClose /> Batal
              </button>
              <button onClick={handleSave}
                className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1">
                <MdSave /> Simpan
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)}
              className="text-xs text-teal-600 border border-teal-200 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1">
              <MdEdit /> Edit Profil
            </button>
          )}
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Nama Lengkap",  field: "name",      icon: <MdPerson />,      type: "text"   },
            { label: "Email",         field: "email",     icon: <MdEmail />,       type: "email"  },
            { label: "No. Telepon",   field: "phone",     icon: <MdPhone />,       type: "tel"    },
            { label: "Tanggal Lahir", field: "birthdate", icon: <MdCake />,        type: "date"   },
            { label: "Jenis Kelamin", field: "gender",    icon: <MdPerson />,      type: "select" },
            { label: "Alamat",        field: "address",   icon: <MdLocationOn />,  type: "text"   },
          ].map(({ label, field, icon, type }) => (
            <div key={field} className={field === "address" ? "sm:col-span-2" : ""}>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1.5">
                <span className="text-teal-500">{icon}</span> {label}
              </label>
              {editing ? (
                type === "select" ? (
                  <select
                    value={form[field]}
                    onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                  >
                    <option>Perempuan</option>
                    <option>Laki-laki</option>
                  </select>
                ) : (
                  <input
                    type={type}
                    value={form[field]}
                    onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                  />
                )
              ) : (
                <p className="text-sm text-gray-700 font-semibold bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  {form[field] || <span className="text-gray-300 italic">Belum diisi</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Membership summary */}
      {member && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-6">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Ringkasan Membership</h2>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Tier",           val: cfg.label,                           color: cfg.textColor  },
              { label: "Poin",           val: `${member.points?.toLocaleString("id-ID")} ⭐`, color: "text-yellow-600" },
              { label: "Total Pesanan",  val: `${member.totalOrders ?? 0}x`,       color: "text-blue-600"   },
              { label: "Bergabung",      val: member.joinDate?.slice(0, 7) ?? "-", color: "text-gray-600"   },
            ].map(s => (
              <div key={s.label} className="text-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">{s.label}</p>
                <p className={`text-sm font-extrabold ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick nav */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { to: "/store/orders",       icon: <MdShoppingCart />, label: "Pesanan Saya",     color: "from-teal-500 to-teal-600"     },
          { to: "/store/transactions", icon: <MdReceipt />,      label: "Riwayat Transaksi", color: "from-blue-500 to-blue-600"    },
          { to: "/store/membership",   icon: <MdCardMembership />,label: "Membership",       color: "from-purple-500 to-purple-600" },
        ].map(nav => (
          <Link key={nav.to} to={nav.to}
            className={`flex flex-col items-center gap-2 bg-gradient-to-br ${nav.color} text-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}>
            <span className="text-2xl">{nav.icon}</span>
            <span className="text-xs font-bold text-center leading-tight">{nav.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
