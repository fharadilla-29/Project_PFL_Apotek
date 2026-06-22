import { Link, Navigate } from "react-router-dom";
import {
  MdCardMembership, MdStars, MdLocalOffer, MdRedeem,
  MdTrendingUp, MdCheckCircle, MdArrowForward,
} from "react-icons/md";
import { BsStarFill } from "react-icons/bs";
import { RiMedicineBottleLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import {
  TIER_CFG, fmtRp, getNextTier, getSpendToNextTier,
} from "../../pages/membership/membershipConfig";

// Fallback membership kalau user belum punya data member
const defaultMember = (user) => ({
  name: user?.name ?? "Member",
  tier: "Silver",
  points: 320,
  joinDate: "2024-01-01",
  annualSpend: 400000,
  totalSpend: 750000,
  totalOrders: 4,
  pointHistory: [
    { date: "2024-04-22", desc: "Pembelian OTC", earned: 12, used: 0, balance: 320 },
    { date: "2024-03-07", desc: "Bonus Daftar Baru", earned: 50, used: 0, balance: 308 },
  ],
});

export default function StoreMembership() {
  const { user, memberData } = useAuth();

  // Belum login → arahkan ke login store
  if (!user) {
    return <Navigate to="/store/login" state={{ from: "/store/membership" }} replace />;
  }

  const member = memberData ?? defaultMember(user);
  const cfg = TIER_CFG[member.tier] ?? TIER_CFG.Silver;
  const nextTier = getNextTier(member.tier);
  const toNext = getSpendToNextTier(member.tier, member.annualSpend);
  const progress = nextTier
    ? Math.min(100, Math.round((member.annualSpend / TIER_CFG[nextTier].minSpend) * 100))
    : 100;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/store" className="hover:text-teal-600">Beranda</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">Kartu Membership</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Kartu member (kiri) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Membership card */}
          <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${cfg.darkBg}`}>
            <div className="absolute -right-8 -top-8 opacity-10">
              <RiMedicineBottleLine className="text-[160px]" />
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <MdCardMembership className="text-2xl" />
                  <span className="font-bold tracking-wide">Outlet Pharmacy</span>
                </div>
                <span className="text-2xl">{cfg.icon}</span>
              </div>
              <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Member {cfg.label}</p>
              <p className="text-2xl font-extrabold mb-6">{member.name}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs opacity-80">Total Poin</p>
                  <p className="text-3xl font-extrabold flex items-center gap-2">
                    <BsStarFill className="text-yellow-300 text-xl" />
                    {member.points.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80">Member sejak</p>
                  <p className="font-semibold">{new Date(member.joinDate).getFullYear()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress tier */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MdTrendingUp className="text-teal-600 text-xl" />
              <h2 className="font-bold text-gray-800">Progress Tier</h2>
            </div>
            {nextTier ? (
              <>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">{cfg.label}</span>
                  <span className="font-semibold text-gray-700">{TIER_CFG[nextTier].label}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${cfg.bar}`} style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Belanja <span className="font-bold text-teal-600">{fmtRp(toNext)}</span> lagi
                  untuk naik ke tier <span className="font-semibold">{TIER_CFG[nextTier].label}</span>.
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                🎉 Selamat! Kamu sudah di tier tertinggi <span className="font-bold text-purple-600">Platinum</span>.
              </p>
            )}
          </div>

          {/* Riwayat poin */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Riwayat Poin Terakhir</h2>
            {member.pointHistory?.length ? (
              <div className="divide-y divide-gray-50">
                {member.pointHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{h.desc}</p>
                      <p className="text-xs text-gray-400">{h.date}</p>
                    </div>
                    <span className={`text-sm font-bold ${h.earned ? "text-green-600" : "text-red-500"}`}>
                      {h.earned ? `+${h.earned}` : `-${h.used}`} poin
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Belum ada riwayat poin.</p>
            )}
          </div>
        </div>

        {/* ── Benefit tier (kanan) ── */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MdStars className="text-yellow-500 text-xl" />
              <h2 className="font-bold text-gray-800">Benefit {cfg.label}</h2>
            </div>
            <ul className="space-y-3">
              {[
                `Diskon ${cfg.discount}% untuk semua produk`,
                `${cfg.multiplier}x poin di setiap transaksi`,
                "Gratis ongkir untuk pembelian tertentu",
                "Akses penawaran khusus member",
              ].map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <MdCheckCircle className="text-teal-500 text-base flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Statistik singkat */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800">Statistik Akun</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total Belanja</span>
              <span className="font-bold text-gray-800">{fmtRp(member.totalSpend)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total Transaksi</span>
              <span className="font-bold text-gray-800">{member.totalOrders}x</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Belanja Tahun Ini</span>
              <span className="font-bold text-gray-800">{fmtRp(member.annualSpend)}</span>
            </div>
          </div>

          {/* CTA tukar poin / belanja */}
          <Link to="/store/products"
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition-all">
            <MdRedeem className="text-lg" /> Belanja & Kumpulkan Poin
            <MdArrowForward />
          </Link>
        </div>
      </div>
    </div>
  );
}