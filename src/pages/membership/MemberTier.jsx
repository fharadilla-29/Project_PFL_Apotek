import { useState } from "react";
import { MdCheckCircle, MdEdit, MdSave, MdClose, MdTrendingDown, MdTrendingUp } from "react-icons/md";
import { TIER_CFG, fmtRp } from "./membershipConfig";
import membershipData from "../../data/membership.json";

const TIER_ORDER = ["Platinum", "Gold", "Silver"];

const BENEFITS = {
  Platinum: [
    "Diskon 20% semua pembelian",
    "Prioritas antrean resep",
    "Konsultasi apoteker gratis tak terbatas",
    "Gratis pengiriman tanpa minimum",
    "Early access produk & promo baru",
    "Poin 2× untuk setiap transaksi",
    "Birthday voucher Rp 100.000",
    "Gratis cek kesehatan bulanan",
  ],
  Gold: [
    "Diskon 10% semua pembelian",
    "Konsultasi apoteker 2×/bulan",
    "Gratis pengiriman min. Rp 100.000",
    "Poin 1,5× untuk setiap transaksi",
    "Birthday voucher Rp 50.000",
    "Gratis cek gula darah/tensi bulanan",
  ],
  Silver: [
    "Diskon 5% semua pembelian",
    "Akumulasi poin setiap transaksi",
    "Akses program loyalitas",
    "Birthday voucher Rp 25.000",
    "Newsletter promo eksklusif",
  ],
};

export default function MemberTier() {
  const [tiers, setTiers] = useState({
    Platinum: { minSpend: 5000000, multiplier: 2.0, discount: 20, validMonths: 12 },
    Gold:     { minSpend: 1500000, multiplier: 1.5, discount: 10, validMonths: 12 },
    Silver:   { minSpend: 0,       multiplier: 1.0, discount: 5,  validMonths: 12 },
  });
  const [editing, setEditing] = useState(null);
  const [editBuf, setEditBuf] = useState({});

  const counts = { Platinum: 0, Gold: 0, Silver: 0 };
  membershipData.forEach(m => { if (counts[m.tier] !== undefined) counts[m.tier]++; });

  const atRisk = membershipData.filter(m => {
    const days = Math.ceil((new Date(m.tierExpiry) - new Date()) / 86400000);
    return days > 0 && days <= 90 && m.tier !== "Silver";
  });

  const startEdit = (tier) => { setEditing(tier); setEditBuf({ ...tiers[tier] }); };
  const saveEdit  = (tier) => { setTiers(p => ({ ...p, [tier]: editBuf })); setEditing(null); };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Manajemen Tier Membership</h1>
        <p className="text-xs text-gray-400 mt-0.5">Atur syarat, benefit, dan periode setiap tingkat keanggotaan</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {TIER_ORDER.map(tier => {
          const cfg = TIER_CFG[tier];
          return (
            <div key={tier} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4 flex items-center gap-3`}>
              <span className="text-3xl">{cfg.icon}</span>
              <div>
                <p className={`text-2xl font-extrabold ${cfg.text}`}>{counts[tier]}</p>
                <p className="text-xs text-gray-500">member {tier}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {TIER_ORDER.map((tier, idx) => {
          const cfg = TIER_CFG[tier];
          const t   = tiers[tier];
          const isEdit = editing === tier;
          return (
            <div key={tier} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Card header */}
              <div className={`${cfg.darkBg} px-5 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">{cfg.icon}</span>
                  <div>
                    <p className="font-extrabold text-base">{tier}</p>
                    <p className="text-[11px] opacity-80">
                      {tier === "Silver" ? "Otomatis saat daftar" : `Min. ${fmtRp(t.minSpend)} / tahun`}
                    </p>
                  </div>
                </div>
                {!isEdit ? (
                  <button onClick={() => startEdit(tier)}
                    className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition-all">
                    <MdEdit className="text-base" />
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button onClick={() => saveEdit(tier)}
                      className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition-all">
                      <MdSave className="text-base" />
                    </button>
                    <button onClick={() => setEditing(null)}
                      className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition-all">
                      <MdClose className="text-base" />
                    </button>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="p-5 space-y-3 border-b border-gray-100">
                {[
                  { label: "Min. Belanja / Tahun", key: "minSpend", prefix: "Rp", disabled: tier === "Silver" },
                  { label: "Multiplier Poin",      key: "multiplier", suffix: "×" },
                  { label: "Diskon Pembelian",     key: "discount", suffix: "%" },
                  { label: "Masa Berlaku",         key: "validMonths", suffix: "bulan" },
                ].map(f => (
                  <div key={f.key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{f.label}</span>
                    {isEdit && !f.disabled ? (
                      <input
                        type="number"
                        value={editBuf[f.key]}
                        onChange={e => setEditBuf(p => ({ ...p, [f.key]: parseFloat(e.target.value) }))}
                        className="w-28 text-right border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    ) : (
                      <span className={`text-sm font-bold ${cfg.text}`}>
                        {f.prefix}{f.key === "minSpend" && tier === "Silver" ? "0" : f.key === "minSpend" ? t[f.key].toLocaleString("id-ID") : t[f.key]}{f.suffix}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Benefit</p>
                <ul className="space-y-1.5">
                  {BENEFITS[tier].map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <MdCheckCircle className={`text-sm flex-shrink-0 mt-0.5 ${cfg.text}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upgrade path */}
              {idx < TIER_ORDER.length - 1 && (
                <div className="px-5 pb-4">
                  <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
                    <MdTrendingUp className={`text-base ${cfg.text}`} />
                    <span className="text-xs text-gray-500">
                      Naik ke <b>{TIER_ORDER[idx]}</b> dengan belanja min. <b>{fmtRp(tiers[TIER_ORDER[idx]].minSpend)}/tahun</b>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Downgrade warning */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <MdTrendingDown className="text-orange-500 text-lg" />
          <h2 className="text-sm font-bold text-gray-800">Member Berisiko Downgrade (90 hari ke depan)</h2>
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">{atRisk.length}</span>
        </div>
        {atRisk.length === 0 ? (
          <p className="text-sm text-gray-400">Tidak ada member berisiko downgrade saat ini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {["Member","Tier","Belanja Tahun Ini","Kekurangan","Tier Expiry"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {atRisk.map(m => {
                  const cfg = TIER_CFG[m.tier];
                  const need = tiers[m.tier].minSpend - m.annualSpend;
                  return (
                    <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={`https://i.pravatar.cc/32?u=${m.email}`} className="w-7 h-7 rounded-full" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                            <p className="text-[11px] text-gray-400">{m.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          {cfg.icon} {m.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-700">{fmtRp(m.annualSpend)}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-orange-600">{need > 0 ? fmtRp(need) : "✓ Terpenuhi"}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{m.tierExpiry}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
