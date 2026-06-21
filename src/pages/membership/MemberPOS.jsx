import { useState } from "react";
import { MdSearch, MdQrCodeScanner, MdAdd, MdRemove, MdClose, MdCheckCircle, MdCake } from "react-icons/md";
import { BsStarFill, BsWhatsapp } from "react-icons/bs";
import { TIER_CFG, STATUS_CFG, fmtRp, EXCLUDED_PRODUCTS } from "./membershipConfig";
import membershipData from "../../data/membership.json";

const PRODUCTS = [
  { id: "P01", name: "Metformin 500mg",    price: 45000,  canPoint: true  },
  { id: "P02", name: "Paracetamol 500mg",  price: 12000,  canPoint: true  },
  { id: "P03", name: "Vitamin C 1000mg",   price: 35000,  canPoint: true  },
  { id: "P04", name: "Amoxicillin 500mg",  price: 38000,  canPoint: true  },
  { id: "P05", name: "Obat Program BPJS",  price: 0,      canPoint: false },
  { id: "P06", name: "Antasida Doen",      price: 8000,   canPoint: true  },
  { id: "P07", name: "Insulin (BPJS)",     price: 0,      canPoint: false },
  { id: "P08", name: "Ibuprofen 400mg",    price: 15000,  canPoint: true  },
];

export default function MemberPOS() {
  const [query, setQuery]       = useState("");
  const [member, setMember]     = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [cart, setCart]         = useState([]);
  const [usePoints, setUsePoints] = useState(false);
  const [paid, setPaid]         = useState(false);

  // Search member
  const searchMember = () => {
    const q = query.trim().toLowerCase();
    const found = membershipData.find(m =>
      m.phone.includes(q) || m.id.toLowerCase() === q || m.name.toLowerCase().includes(q)
    );
    if (found) { setMember(found); setNotFound(false); }
    else { setMember(null); setNotFound(true); }
  };

  // Cart ops
  const addItem = (p) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id);
      if (ex) return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...p, qty: 1 }];
    });
  };
  const changeQty = (id, delta) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter(c => c.qty > 0));
  };

  // Totals
  const subtotal       = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const pointableTotal = cart.filter(c => c.canPoint).reduce((s, c) => s + c.price * c.qty, 0);
  const tierMultiplier = member ? (TIER_CFG[member.tier].multiplier ?? 1) : 1;
  const earnedPoints   = member ? Math.floor((pointableTotal / 10000) * tierMultiplier) : 0;
  const maxDeductRp    = member ? Math.floor(member.points * 100) : 0;
  const deductRp       = usePoints ? Math.min(maxDeductRp, subtotal) : 0;
  const total          = Math.max(0, subtotal - deductRp);
  const usedPoints     = usePoints ? Math.ceil(deductRp / 100) : 0;

  const isBirthday = member && new Date(member.birthdate).getMonth() === new Date().getMonth();

  const handlePay = () => {
    if (cart.length === 0) return;
    setPaid(true);
  };

  const reset = () => {
    setQuery(""); setMember(null); setNotFound(false);
    setCart([]); setUsePoints(false); setPaid(false);
  };

  const tc = member ? TIER_CFG[member.tier] : null;
  const sc = member ? STATUS_CFG[member.status] : null;

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-gray-900">Kasir — POS Membership</h1>
        <p className="text-xs text-gray-400 mt-0.5">Cari member, tambah item, dan proses pembayaran dengan poin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left: Member lookup + cart ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Member search */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Cari Member</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input value={query} onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && searchMember()}
                  placeholder="Ketik nomor HP, nama, atau ID member..."
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <button onClick={searchMember}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all">Cari</button>
              <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 font-medium">
                <MdQrCodeScanner className="text-base" /> QR
              </button>
            </div>

            {notFound && <p className="text-xs text-red-500 mt-2">Member tidak ditemukan. <button className="underline" onClick={() => {}}>Daftarkan baru?</button></p>}

            {/* Member info pop-up */}
            {member && (
              <div className={`mt-3 rounded-xl border ${tc.border} ${tc.bg} p-4`}>
                {isBirthday && (
                  <div className="flex items-center gap-1.5 bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-lg mb-3">
                    <MdCake /> Selamat Ulang Tahun, {member.name.split(" ")[0]}! 🎂 Voucher birthday aktif
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <img src={`https://i.pravatar.cc/48?u=${member.email}`} className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-extrabold text-gray-800">{member.name}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${tc.bg} ${tc.text} ${tc.border}`}>
                        {tc.icon} {member.tier}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{member.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{member.phone} · {member.id}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-extrabold text-teal-600">{member.points.toLocaleString()}</p>
                    <p className="text-[11px] text-gray-400">poin tersedia</p>
                    <p className="text-xs text-gray-500 mt-0.5">≈ {fmtRp(member.points * 100)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product list */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Tambah Produk</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PRODUCTS.map(p => (
                <button key={p.id} onClick={() => p.price > 0 && addItem(p)}
                  className={`text-left rounded-lg border p-2.5 transition-all ${p.price === 0 ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50" : "border-gray-200 hover:border-teal-300 hover:bg-teal-50 bg-white"}`}>
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{p.name}</p>
                  {p.price > 0
                    ? <p className="text-xs text-teal-600 font-bold mt-1">{fmtRp(p.price)}</p>
                    : <p className="text-[10px] text-gray-400 mt-1">BPJS / Subsidi</p>
                  }
                  {!p.canPoint && <p className="text-[10px] text-red-400 mt-0.5">Tanpa poin</p>}
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Keranjang ({cart.length} item)</p>
            {cart.length === 0
              ? <p className="text-sm text-gray-400 text-center py-4">Belum ada produk ditambahkan</p>
              : (
                <div className="space-y-2">
                  {cart.map(c => (
                    <div key={c.id} className="flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400">{fmtRp(c.price)} / item {!c.canPoint && <span className="text-red-400">· tanpa poin</span>}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => changeQty(c.id, -1)} className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                          <MdRemove className="text-xs" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{c.qty}</span>
                        <button onClick={() => changeQty(c.id, 1)} className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                          <MdAdd className="text-xs" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-gray-700 w-20 text-right">{fmtRp(c.price * c.qty)}</p>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>

        {/* ── Right: Summary & Payment ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
            <p className="text-sm font-bold text-gray-800">Ringkasan Pembayaran</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">{fmtRp(subtotal)}</span></div>
              {member && (
                <div className="flex justify-between text-green-600 text-xs">
                  <span>Diskon {tc.discount}% ({member.tier})</span>
                  <span>— lihat kasir</span>
                </div>
              )}
              {deductRp > 0 && (
                <div className="flex justify-between text-teal-600 font-semibold">
                  <span>Potongan Poin ({usedPoints} pts)</span>
                  <span>- {fmtRp(deductRp)}</span>
                </div>
              )}
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between text-lg font-extrabold text-gray-800">
                <span>Total</span><span className="text-teal-600">{fmtRp(total)}</span>
              </div>
            </div>

            {/* Use points toggle */}
            {member && member.points > 0 && (
              <div className={`rounded-lg border p-3 transition-all ${usePoints ? "border-teal-300 bg-teal-50" : "border-gray-200 bg-gray-50"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Gunakan Poin</p>
                    <p className="text-[11px] text-gray-400">{member.points.toLocaleString()} poin ≈ {fmtRp(member.points * 100)}</p>
                  </div>
                  <button onClick={() => setUsePoints(p => !p)}
                    className={`relative w-10 h-5 rounded-full transition-all ${usePoints ? "bg-teal-500" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${usePoints ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
                {usePoints && (
                  <p className="text-xs text-teal-700 font-semibold mt-2">
                    Memotong {fmtRp(deductRp)} ({usedPoints} poin digunakan)
                  </p>
                )}
              </div>
            )}

            {/* Points earned */}
            {member && earnedPoints > 0 && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex items-center gap-2">
                <BsStarFill className="text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-yellow-700">+{earnedPoints} poin akan diterima</p>
                  <p className="text-[11px] text-gray-500">Multiplier {tierMultiplier}× ({member.tier}){isBirthday ? " + birthday 2×" : ""}</p>
                </div>
              </div>
            )}

            <button onClick={handlePay} disabled={cart.length === 0}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm transition-all">
              Bayar {cart.length > 0 ? fmtRp(total) : ""}
            </button>

            {cart.length > 0 && (
              <button onClick={reset} className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold py-2 rounded-xl text-sm transition-all">
                Reset Transaksi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment success modal */}
      {paid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center">
            <MdCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
            <h2 className="text-xl font-extrabold text-gray-800 mb-1">Pembayaran Berhasil!</h2>
            <p className="text-sm text-gray-500 mb-4">{fmtRp(total)} telah dibayar</p>
            {member && (
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-4 text-left space-y-1">
                <p className="text-xs text-gray-500">Member: <b className="text-gray-800">{member.name}</b></p>
                {usedPoints > 0 && <p className="text-xs text-red-500">Poin digunakan: <b>-{usedPoints} pts</b></p>}
                <p className="text-xs text-green-600">Poin diterima: <b>+{earnedPoints} pts</b></p>
                <p className="text-xs text-gray-500">Total poin baru: <b className="text-teal-600">{(member.points - usedPoints + earnedPoints).toLocaleString()}</b></p>
              </div>
            )}
            <div className="flex gap-2">
              {member && (
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                  <BsWhatsapp /> Kirim Struk WA
                </button>
              )}
              <button onClick={reset} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                Transaksi Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
