import { useState, useMemo } from "react";
import { MdSearch, MdExpandMore, MdAdd, MdClose, MdPhone, MdEmail, MdLocationOn, MdCake } from "react-icons/md";
import { BsWhatsapp } from "react-icons/bs";
import { TIER_CFG, STATUS_CFG, ALL_TAGS, fmtRp, getSpendToNextTier, getNextTier } from "./membershipConfig";
import membershipData from "../../data/membership.json";

const TAG_COLORS = {
  "Diabetes":       "bg-red-100 text-red-600 border-red-200",
  "Hipertensi":     "bg-blue-100 text-blue-600 border-blue-200",
  "Vitamin Bulanan":"bg-green-100 text-green-700 border-green-200",
  "Ibu & Anak":     "bg-pink-100 text-pink-600 border-pink-200",
};

export default function MemberDatabase() {
  const [search, setSearch]       = useState("");
  const [tierFilter, setTier]     = useState("all");
  const [statusFilter, setStatus] = useState("all");
  const [tagFilter, setTag]       = useState("all");
  const [selected, setSelected]   = useState(null);
  const [showReg, setShowReg]     = useState(false);
  const [regForm, setRegForm]     = useState({ name: "", whatsapp: "", birthdate: "" });
  const [regDone, setRegDone]     = useState(false);

  const filtered = useMemo(() => membershipData.filter(m => {
    const q = search.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.id.toLowerCase().includes(q);
    const matchT = tierFilter === "all" || m.tier === tierFilter;
    const matchS = statusFilter === "all" || m.status === statusFilter;
    const matchG = tagFilter === "all" || m.tags.includes(tagFilter);
    return matchQ && matchT && matchS && matchG;
  }), [search, tierFilter, statusFilter, tagFilter]);

  const handleRegister = (e) => {
    e.preventDefault();
    setRegDone(true);
    setTimeout(() => { setRegDone(false); setShowReg(false); setRegForm({ name:"", whatsapp:"", birthdate:"" }); }, 2500);
  };

  return (
    <div className="flex gap-0 min-h-full">
      {/* ── List panel ── */}
      <div className="flex-1 min-w-0 p-6 space-y-4 overflow-auto">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Database Member (CRM)</h1>
            <p className="text-xs text-gray-400 mt-0.5">{membershipData.length} member terdaftar</p>
          </div>
          <button onClick={() => setShowReg(true)}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow transition-all">
            <MdAdd /> Daftarkan Member
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nama, nomor HP, ID..."
              className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-teal-400 w-full" />
          </div>
          {[
            { val: tierFilter,   set: setTier,   opts: [["all","Semua Tier"],["Silver","Silver"],["Gold","Gold"],["Platinum","Platinum"]] },
            { val: statusFilter, set: setStatus, opts: [["all","Semua Status"],["Active","Active"],["Expiring","Expiring"],["Expired","Expired"]] },
            { val: tagFilter,    set: setTag,    opts: [["all","Semua Tag"], ...ALL_TAGS.map(t => [t,t])] },
          ].map((f, i) => (
            <div key={i} className="relative">
              <select value={f.val} onChange={e => f.set(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer">
                {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <MdExpandMore className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
            </div>
          ))}
          <span className="text-xs text-gray-400">{filtered.length} hasil</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {["Member","Tier","Status","Poin","Belanja/Tahun","Transaksi Terakhir","Tag",""].map(h => (
                    <th key={h} className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-10 text-sm text-gray-400">Tidak ada data</td></tr>
                )}
                {filtered.map(m => {
                  const tc = TIER_CFG[m.tier];
                  const sc = STATUS_CFG[m.status];
                  return (
                    <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelected(m)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={`https://i.pravatar.cc/32?u=${m.email}`} className="w-8 h-8 rounded-full flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                            <p className="text-[11px] text-gray-400">{m.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${tc.bg} ${tc.text} ${tc.border}`}>
                          {tc.icon} {m.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-teal-600">{m.points.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{fmtRp(m.annualSpend)}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{m.lastTransaction}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {m.tags.map(tag => (
                            <span key={tag} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${TAG_COLORS[tag] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-lg font-semibold">Detail</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Detail panel ── */}
      {selected && (
        <div className="w-72 flex-shrink-0 border-l border-gray-100 bg-white overflow-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">Profil Member</span>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><MdClose /></button>
          </div>

          <div className="p-4 space-y-4">
            {/* Avatar & tier */}
            <div className="text-center">
              <img src={`https://i.pravatar.cc/80?u=${selected.email}`} className="w-16 h-16 rounded-full mx-auto border-4 border-white shadow mb-2" />
              <p className="font-extrabold text-gray-800">{selected.name}</p>
              <p className="text-xs text-gray-400">{selected.id}</p>
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                {(() => { const tc = TIER_CFG[selected.tier]; return (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${tc.bg} ${tc.text} ${tc.border}`}>
                    {tc.icon} {selected.tier}
                  </span>
                ); })()}
                {(() => { const sc = STATUS_CFG[selected.status]; return (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{selected.status}
                  </span>
                ); })()}
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2 text-xs">
              {[
                { icon: <BsWhatsapp className="text-green-500" />, val: selected.whatsapp },
                { icon: <MdEmail className="text-blue-400" />, val: selected.email },
                { icon: <MdCake className="text-pink-400" />, val: selected.birthdate },
                { icon: <MdLocationOn className="text-red-400" />, val: selected.address },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-gray-600">
                  <span className="text-sm flex-shrink-0 mt-0.5">{c.icon}</span>
                  <span>{c.val}</span>
                </div>
              ))}
            </div>

            {/* Poin & Spend */}
            <div className="bg-teal-50 rounded-xl p-3 border border-teal-100 grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-xl font-extrabold text-teal-600">{selected.points.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Sisa Poin</p>
              </div>
              <div>
                <p className="text-base font-extrabold text-gray-700">{selected.totalOrders}</p>
                <p className="text-[10px] text-gray-400">Total Order</p>
              </div>
              <div className="col-span-2 border-t border-teal-100 pt-2">
                <p className="text-sm font-bold text-gray-700">{fmtRp(selected.annualSpend)}</p>
                <p className="text-[10px] text-gray-400">Belanja tahun ini</p>
              </div>
            </div>

            {/* Progress ke tier berikutnya */}
            {getNextTier(selected.tier) && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Progress ke {getNextTier(selected.tier)}</p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${TIER_CFG[selected.tier].bar}`}
                    style={{ width: `${Math.min((selected.annualSpend / TIER_CFG[getNextTier(selected.tier)].minSpend) * 100, 100)}%` }} />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Kurang <b className="text-orange-500">{fmtRp(getSpendToNextTier(selected.tier, selected.annualSpend))}</b> lagi
                </p>
              </div>
            )}

            {/* Tags */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Health Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.length === 0 && <span className="text-xs text-gray-400">Belum ada tag</span>}
                {selected.tags.map(tag => (
                  <span key={tag} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${TAG_COLORS[tag] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Riwayat poin */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Riwayat Poin Terakhir</p>
              {selected.pointHistory.length === 0 ? (
                <p className="text-xs text-gray-400">Belum ada riwayat</p>
              ) : (
                <div className="space-y-1.5">
                  {selected.pointHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-2 py-1.5">
                      <div>
                        <p className="font-medium text-gray-700 truncate max-w-[130px]">{h.desc}</p>
                        <p className="text-gray-400">{h.date}</p>
                      </div>
                      <span className={`font-bold ${h.earned > 0 ? "text-green-600" : "text-red-500"}`}>
                        {h.earned > 0 ? `+${h.earned}` : `-${h.used}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* WA broadcast */}
            <button className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg text-xs transition-all">
              <BsWhatsapp /> Kirim Info Poin via WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Registrasi modal */}
      {showReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-gray-800">Daftarkan Member Baru</h2>
                <p className="text-xs text-gray-400">Cukup 3 data — cepat & paperless</p>
              </div>
              <button onClick={() => setShowReg(false)} className="text-gray-400 hover:text-gray-600"><MdClose /></button>
            </div>

            {regDone ? (
              <div className="text-center py-6">
                <p className="text-4xl mb-3">🎉</p>
                <p className="font-bold text-gray-800">Berhasil Terdaftar!</p>
                <p className="text-xs text-gray-400 mt-1">WhatsApp sambutan + 50 poin bonus dikirimkan ke {regForm.whatsapp}</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                {[
                  { label: "Nama Lengkap", key: "name", type: "text", placeholder: "Nama pasien", icon: <MdSearch /> },
                  { label: "Nomor WhatsApp", key: "whatsapp", type: "text", placeholder: "08xxxxxxxxxx", icon: <BsWhatsapp /> },
                  { label: "Tanggal Lahir", key: "birthdate", type: "date", icon: <MdCake /> },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{f.label}</label>
                    <input type={f.type} value={regForm[f.key]} placeholder={f.placeholder} required
                      onChange={e => setRegForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
                  </div>
                ))}
                <div className="bg-teal-50 rounded-lg p-3 border border-teal-100 text-xs text-teal-700">
                  ✓ Otomatis Silver tier &nbsp;·&nbsp; ✓ Bonus 50 poin &nbsp;·&nbsp; ✓ WhatsApp sambutan
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowReg(false)} className="flex-1 py-2 text-sm text-gray-500 font-semibold border border-gray-200 rounded-lg hover:bg-gray-50">Batal</button>
                  <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg text-sm">Daftarkan</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
