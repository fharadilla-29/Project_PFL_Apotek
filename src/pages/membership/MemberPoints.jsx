import { useState } from "react";
import { MdSave, MdAdd, MdDelete, MdInfo } from "react-icons/md";
import { BsStarFill } from "react-icons/bs";
import { TIER_CFG, EXCLUDED_PRODUCTS, fmtRp } from "./membershipConfig";

const TIER_ORDER = ["Silver", "Gold", "Platinum"];

export default function MemberPoints() {
  const [config, setConfig] = useState({
    pointPer: 10000,       // Rp per 1 poin
    pointValue: 100,       // 1 poin = Rp
    expiryDate: "12-31",   // MM-DD tiap tahun
    birthdayMultiplier: 2,
    multipliers: { Silver: 1.0, Gold: 1.5, Platinum: 2.0 },
  });

  const [excluded, setExcluded] = useState([...EXCLUDED_PRODUCTS]);
  const [newExclude, setNewExclude] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addExclude = () => {
    if (newExclude.trim() && !excluded.includes(newExclude.trim())) {
      setExcluded(p => [...p, newExclude.trim()]);
      setNewExclude("");
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Pengaturan Sistem Poin</h1>
          <p className="text-xs text-gray-400 mt-0.5">Konfigurasi konversi poin, multiplier tier, dan kedaluwarsa</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg shadow transition-all text-white ${saved ? "bg-green-500" : "bg-teal-600 hover:bg-teal-700"}`}>
          <MdSave /> {saved ? "Tersimpan!" : "Simpan Pengaturan"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Konversi Dasar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-800">Konversi Poin Dasar</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Belanja kelipatan <span className="text-teal-600">Rp X</span> mendapat <span className="text-teal-600">1 poin</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Rp</span>
                <input type="number" value={config.pointPer}
                  onChange={e => setConfig(p => ({ ...p, pointPer: +e.target.value }))}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Nilai tukar: <span className="text-teal-600">1 poin = Rp X</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Rp</span>
                <input type="number" value={config.pointValue}
                  onChange={e => setConfig(p => ({ ...p, pointValue: +e.target.value }))}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            </div>

            {/* Simulasi */}
            <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
              <p className="text-xs font-bold text-teal-700 mb-1">Simulasi</p>
              <p className="text-xs text-teal-600">
                Belanja <b>Rp 100.000</b> → <b>{Math.floor(100000 / config.pointPer)} poin dasar</b>
              </p>
              <p className="text-xs text-teal-600 mt-0.5">
                100 poin setara <b>{fmtRp(100 * config.pointValue)}</b> diskon
              </p>
            </div>
          </div>
        </div>

        {/* Multiplier per Tier */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-800">Multiplier Poin per Tier</h2>
          <div className="space-y-3">
            {TIER_ORDER.map(tier => {
              const cfg = TIER_CFG[tier];
              const base = Math.floor(100000 / config.pointPer);
              const earned = Math.round(base * config.multipliers[tier]);
              return (
                <div key={tier} className={`rounded-lg border ${cfg.border} ${cfg.bg} p-3`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`flex items-center gap-1.5 text-sm font-bold ${cfg.text}`}>
                      <span>{cfg.icon}</span> {tier}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input type="number" step="0.5" min="1" max="5"
                        value={config.multipliers[tier]}
                        onChange={e => setConfig(p => ({ ...p, multipliers: { ...p.multipliers, [tier]: +e.target.value } }))}
                        className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white" />
                      <span className={`text-sm font-bold ${cfg.text}`}>×</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Belanja Rp 100.000 → <b>{earned} poin</b> (vs Silver {base} poin)
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kedaluwarsa Poin */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-800">Kedaluwarsa Poin</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Poin hangus setiap tanggal</label>
              <div className="flex items-center gap-2">
                <input type="text" placeholder="MM-DD" value={config.expiryDate}
                  onChange={e => setConfig(p => ({ ...p, expiryDate: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400 w-28" />
                <span className="text-sm text-gray-500">setiap tahun</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Contoh: 12-31 artinya hangus tiap 31 Desember</p>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <MdInfo className="text-orange-500 text-base flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-orange-700">Notifikasi Otomatis</p>
                  <p className="text-xs text-orange-600 mt-0.5">
                    Sistem akan mengirim WhatsApp reminder H-30 dan H-7 sebelum poin kedaluwarsa untuk mendorong penukaran.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Multiplier Birthday</label>
            <div className="flex items-center gap-2">
              <input type="number" min="1" max="5" value={config.birthdayMultiplier}
                onChange={e => setConfig(p => ({ ...p, birthdayMultiplier: +e.target.value }))}
                className="w-16 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400 text-center" />
              <span className="text-sm text-gray-500">× poin saat berbelanja di bulan ulang tahun</span>
            </div>
          </div>
        </div>

        {/* Pengecualian Produk */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-800">Produk Tidak Mendapat Poin</h2>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{excluded.length}</span>
          </div>

          <div className="space-y-2">
            {excluded.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <span className="text-xs text-red-700 font-medium">{item}</span>
                <button onClick={() => setExcluded(p => p.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 transition-colors">
                  <MdDelete className="text-sm" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input type="text" value={newExclude} onChange={e => setNewExclude(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addExclude()}
              placeholder="Tambah kategori pengecualian..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-400" />
            <button onClick={addExclude}
              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg transition-all">
              <MdAdd className="text-base" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400">Produk dalam kategori ini tidak mendapat poin dan tidak bisa dibayar dengan poin.</p>
        </div>
      </div>
    </div>
  );
}
