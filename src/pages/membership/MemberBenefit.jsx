import { useState } from "react";
import { MdAdd, MdDelete, MdEdit, MdSave, MdClose, MdCake, MdCardGiftcard, MdDiscount } from "react-icons/md";
import { BsGift } from "react-icons/bs";
import { TIER_CFG } from "./membershipConfig";

const initVouchers = [
  { id: 1, name: "Diskon 10% Pembelian",       type: "discount",  points: 100, value: "10%",            tier: "Silver",   active: true  },
  { id: 2, name: "Diskon 20% Pembelian",       type: "discount",  points: 200, value: "20%",            tier: "Gold",     active: true  },
  { id: 3, name: "Gratis Hand Sanitizer",      type: "product",   points: 50,  value: "1 botol 100ml",  tier: "Silver",   active: true  },
  { id: 4, name: "Gratis Cek Kolesterol",      type: "service",   points: 150, value: "1x layanan",     tier: "Gold",     active: true  },
  { id: 5, name: "Gratis Cek Lengkap",         type: "service",   points: 300, value: "Gula+Kolesterol",tier: "Platinum", active: true  },
  { id: 6, name: "Voucher Rp 25.000",          type: "cashback",  points: 250, value: "Rp 25.000",      tier: "Silver",   active: true  },
  { id: 7, name: "Voucher Rp 75.000",          type: "cashback",  points: 600, value: "Rp 75.000",      tier: "Gold",     active: true  },
  { id: 8, name: "Gratis Multivitamin Premium",type: "product",   points: 400, value: "30 kapsul",      tier: "Platinum", active: false },
];

const TYPE_CFG = {
  discount: { label: "Diskon %",   bg: "bg-blue-100",   text: "text-blue-700",   icon: <MdDiscount />    },
  product:  { label: "Produk",     bg: "bg-green-100",  text: "text-green-700",  icon: <BsGift />        },
  service:  { label: "Layanan",    bg: "bg-purple-100", text: "text-purple-700", icon: <MdCardGiftcard />},
  cashback: { label: "Cashback",   bg: "bg-orange-100", text: "text-orange-600", icon: <MdDiscount />    },
};

const BIRTHDAY_REWARDS = [
  { tier: "Silver",   voucherRp: 25000,  doublePoint: false },
  { tier: "Gold",     voucherRp: 50000,  doublePoint: true  },
  { tier: "Platinum", voucherRp: 100000, doublePoint: true  },
];

export default function MemberBenefit() {
  const [vouchers, setVouchers] = useState(initVouchers);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", type: "discount", points: 100, value: "", tier: "Silver", active: true });

  const openNew   = ()  => { setForm({ name:"", type:"discount", points:100, value:"", tier:"Silver", active:true }); setEditId(null); setShowModal(true); };
  const openEdit  = (v) => { setForm({ ...v }); setEditId(v.id); setShowModal(true); };
  const saveForm  = ()  => {
    if (!form.name || !form.value) return;
    if (editId) setVouchers(p => p.map(v => v.id === editId ? { ...form, id: editId } : v));
    else setVouchers(p => [...p, { ...form, id: Date.now() }]);
    setShowModal(false);
  };
  const toggleActive = (id) => setVouchers(p => p.map(v => v.id === id ? { ...v, active: !v.active } : v));
  const deleteVoucher= (id) => setVouchers(p => p.filter(v => v.id !== id));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Benefit & Voucher Reward</h1>
          <p className="text-xs text-gray-400 mt-0.5">Kelola reward yang bisa ditukar member dengan poin</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow transition-all">
          <MdAdd /> Tambah Reward
        </button>
      </div>

      {/* Voucher grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vouchers.map(v => {
          const tc  = TIER_CFG[v.tier];
          const typ = TYPE_CFG[v.type];
          return (
            <div key={v.id} className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-opacity ${!v.active ? "opacity-50" : ""}`}>
              {/* Top stripe */}
              <div className={`h-1.5 w-full ${tc.darkBg}`} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${typ.bg} ${typ.text} text-base`}>{typ.icon}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{v.name}</p>
                      <p className="text-[11px] text-gray-400">{v.value}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(v)} className="text-gray-400 hover:text-gray-600 p-1"><MdEdit className="text-sm" /></button>
                    <button onClick={() => deleteVoucher(v.id)} className="text-gray-400 hover:text-red-500 p-1"><MdDelete className="text-sm" /></button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${tc.bg} ${tc.text} ${tc.border}`}>
                      {tc.icon} {v.tier}+
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${typ.bg} ${typ.text}`}>
                      {typ.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-teal-600">{v.points}</p>
                    <p className="text-[10px] text-gray-400">poin</p>
                  </div>
                </div>

                {/* Toggle active */}
                <button onClick={() => toggleActive(v.id)}
                  className={`mt-3 w-full text-xs font-semibold py-1.5 rounded-lg transition-all border ${v.active ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-100" : "border-gray-200 text-gray-500 bg-gray-50 hover:bg-gray-100"}`}>
                  {v.active ? "✓ Aktif" : "Nonaktif — Klik untuk aktifkan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Birthday rewards */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <MdCake className="text-pink-500 text-xl" />
          <h2 className="text-sm font-bold text-gray-800">Birthday Reward (Otomatis)</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Sistem otomatis memberi reward saat member berbelanja di <b>bulan ulang tahunnya</b>.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {BIRTHDAY_REWARDS.map(br => {
            const cfg = TIER_CFG[br.tier];
            return (
              <div key={br.tier} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{cfg.icon}</span>
                  <span className={`text-sm font-bold ${cfg.text}`}>{br.tier}</span>
                </div>
                <ul className="space-y-1.5">
                  <li className="text-xs text-gray-600 flex items-center gap-1.5">
                    <MdCardGiftcard className={`${cfg.text} flex-shrink-0`} />
                    Voucher <b>Rp {br.voucherRp.toLocaleString("id-ID")}</b>
                  </li>
                  {br.doublePoint && (
                    <li className="text-xs text-gray-600 flex items-center gap-1.5">
                      <MdCardGiftcard className={`${cfg.text} flex-shrink-0`} />
                      <b>Double poin</b> sepanjang bulan lahir
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-gray-800">{editId ? "Edit Reward" : "Tambah Reward"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><MdClose /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Nama Reward", key: "name", type: "text", placeholder: "e.g. Gratis Hand Sanitizer" },
                { label: "Nilai / Keterangan", key: "value", type: "text", placeholder: "e.g. 1 botol 100ml" },
                { label: "Poin Dibutuhkan", key: "points", type: "number" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: f.type === "number" ? +e.target.value : e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tipe Reward</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                    {Object.entries(TYPE_CFG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Min. Tier</label>
                  <select value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                    {["Silver","Gold","Platinum"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500 font-semibold">Batal</button>
                <button onClick={saveForm} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-lg text-sm">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
