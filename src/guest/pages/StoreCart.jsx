import { useState, useMemo } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  MdShoppingCart, MdArrowBack, MdAdd, MdRemove,
  MdDeleteOutline, MdLocalShipping, MdStorefront,
  MdCheck, MdChevronRight, MdConfirmationNumber, MdClose,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LangContext";

function fmtRp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

// Daftar voucher demo
const VOUCHERS = [
  { code: "HEMAT10",  type: "percent", value: 10,    min: 0,      label: { id: "Diskon 10%",         en: "10% Off" },        desc: { id: "Potongan 10% tanpa minimum", en: "10% off, no minimum" } },
  { code: "POTONG50", type: "fixed",   value: 50000, min: 200000, label: { id: "Potongan Rp 50.000", en: "Rp 50,000 Off" }, desc: { id: "Min. belanja Rp 200.000",  en: "Min. spend Rp 200,000" } },
  { code: "NEWUSER",  type: "fixed",   value: 25000, min: 100000, label: { id: "Diskon Rp 25.000",   en: "Rp 25,000 Off" }, desc: { id: "Min. belanja Rp 100.000",  en: "Min. spend Rp 100,000" } },
];

// Hitung potongan voucher; 0 kalau tak memenuhi minimum
function computeVoucher(voucher, subtotal) {
  if (!voucher || subtotal < voucher.min) return 0;
  if (voucher.type === "percent") return Math.round(subtotal * voucher.value / 100);
  return Math.min(voucher.value, subtotal);
}

// Checkbox kotak ala marketplace
function CheckBox({ checked, onChange, className = "" }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
        ${checked
          ? "bg-teal-600 border-teal-600 text-white"
          : "bg-white border-gray-300 hover:border-teal-400"} ${className}`}
      aria-pressed={checked}
    >
      {checked && <MdCheck className="text-sm" />}
    </button>
  );
}

export default function StoreCart() {
  const { user, memberData } = useAuth();
  const { items, setQty, removeItem } = useCart();
  const { t, lang } = useLang();
  const id = lang === "id";
  const navigate = useNavigate();

  // ID item yang dicentang — default semua tercentang
  const [selected, setSelected] = useState(() => new Set(items.map(i => i.id)));

  // Voucher
  const [voucher, setVoucher]         = useState(null);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [codeInput, setCodeInput]     = useState("");
  const [voucherErr, setVoucherErr]   = useState("");

  // Kelompokkan item per brand (brand = "toko")
  const groups = useMemo(() => {
    const map = {};
    items.forEach(item => {
      (map[item.brand] = map[item.brand] || []).push(item);
    });
    return Object.entries(map).map(([brand, list]) => ({ brand, list }));
  }, [items]);

  // Belum login → arahkan ke login
  if (!user) {
    return <Navigate to="/store/login" state={{ from: "/store/cart" }} replace />;
  }

  const toggle = (itemId) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });
  };

  const toggleGroup = (list) => {
    const allOn = list.every(i => selected.has(i.id));
    setSelected(prev => {
      const next = new Set(prev);
      list.forEach(i => allOn ? next.delete(i.id) : next.add(i.id));
      return next;
    });
  };

  const allSelected = items.length > 0 && items.every(i => selected.has(i.id));
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(items.map(i => i.id)));

  const handleRemove = (itemId) => {
    removeItem(itemId);
    setSelected(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  // Hitungan hanya untuk item tercentang
  const chosen = items.filter(i => selected.has(i.id));
  const subtotal = chosen.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = chosen.reduce((s, i) => s + i.qty, 0);
  const memberRate = memberData?.tier === "Platinum" ? 0.1
    : memberData?.tier === "Gold" ? 0.05 : 0;
  const memberDiscount = Math.round(subtotal * memberRate);
  const voucherDiscount = computeVoucher(voucher, subtotal);
  const total = Math.max(0, subtotal - memberDiscount - voucherDiscount);

  const applyCode = (code) => {
    const found = VOUCHERS.find(v => v.code === code.trim().toUpperCase());
    if (!found) {
      setVoucherErr(id ? "Kode voucher tidak valid." : "Invalid voucher code.");
      return;
    }
    if (subtotal < found.min) {
      setVoucherErr(id
        ? `Minimum belanja ${fmtRp(found.min)} belum tercapai.`
        : `Minimum spend ${fmtRp(found.min)} not reached.`);
      return;
    }
    setVoucher(found);
    setVoucherErr("");
    setCodeInput("");
    setVoucherOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6 pb-28">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link to="/store/products"
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition">
          <MdArrowBack className="text-lg" />
        </Link>
        <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <MdShoppingCart className="text-teal-600" /> {t.cartTitle}
          {items.length > 0 && (
            <span className="text-sm font-bold text-gray-400">({items.length})</span>
          )}
        </h1>
      </div>

      {/* Keranjang kosong */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-gray-700 font-bold text-lg">{t.cartEmpty}</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">{t.cartEmptyDesc}</p>
          <Link to="/store/products"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition">
            <MdShoppingCart /> {t.shopNow}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">

          {/* Banner voucher gratis ongkir */}
          <div className="flex items-center gap-2.5 bg-teal-50 border border-teal-100 rounded-xl px-4 py-2.5">
            <MdLocalShipping className="text-teal-600 text-lg flex-shrink-0" />
            <p className="text-xs text-teal-700 font-medium">
              {id ? "Pilih voucher Gratis Ongkir untuk menikmati Gratis Ongkir."
                  : "Select a Free Shipping voucher to enjoy free delivery."}
            </p>
          </div>

          {/* Grup per toko/brand */}
          {groups.map(({ brand, list }) => {
            const groupOn = list.every(i => selected.has(i.id));
            return (
              <div key={brand} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

                {/* Header toko */}
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-50">
                  <CheckBox checked={groupOn} onChange={() => toggleGroup(list)} />
                  <MdStorefront className="text-teal-600 text-base" />
                  <span className="text-sm font-bold text-gray-800">{brand}</span>
                  <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded">
                    {id ? "Toko Resmi" : "Official Store"}
                  </span>
                  <MdChevronRight className="text-gray-300 ml-auto" />
                </div>

                {/* Item dalam toko */}
                {list.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                    <CheckBox checked={selected.has(item.id)} onChange={() => toggle(item.id)} />

                    <img src={item.image} alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-50" />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{item.name}</p>

                      {item.discount > 0 && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-red-500 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded">
                          -{item.discount}%
                        </span>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        {item.originalPrice > item.price && (
                          <span className="text-[11px] text-gray-400 line-through">{fmtRp(item.originalPrice)}</span>
                        )}
                        <span className="text-sm font-extrabold text-teal-700">{fmtRp(item.price)}</span>
                      </div>

                      {/* Qty + hapus */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => setQty(item.id, item.qty - 1)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 transition" aria-label="kurang">
                            <MdRemove className="text-sm" />
                          </button>
                          <span className="w-9 text-center text-sm font-bold text-gray-800">{item.qty}</span>
                          <button onClick={() => setQty(item.id, item.qty + 1)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 transition" aria-label="tambah">
                            <MdAdd className="text-sm" />
                          </button>
                        </div>
                        <button onClick={() => handleRemove(item.id)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold transition">
                          <MdDeleteOutline className="text-sm" /> {t.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Baris voucher */}
          <button
            onClick={() => { setVoucherOpen(true); setVoucherErr(""); }}
            className="w-full flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3.5 hover:border-teal-200 transition">
            <MdConfirmationNumber className="text-teal-600 text-lg" />
            <span className="text-sm font-semibold text-gray-700">
              {id ? "Voucher Toko" : "Store Voucher"}
            </span>
            {voucher ? (
              <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-1 rounded-lg">
                {voucher.code} · -{fmtRp(voucherDiscount)}
              </span>
            ) : (
              <span className="text-xs text-gray-400 ml-auto">
                {id ? "Gunakan / masukkan kode" : "Use / enter code"}
              </span>
            )}
            <MdChevronRight className="text-gray-300" />
          </button>

          <Link to="/store/products"
            className="inline-flex items-center gap-2 text-sm text-teal-600 font-semibold hover:underline mt-1">
            <MdArrowBack /> {t.continueShopping}
          </Link>
        </div>
      )}

      {/* Bottom bar checkout — sticky */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] z-40">
          <div className="max-w-3xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">

            <button onClick={toggleAll} className="flex items-center gap-2 flex-shrink-0">
              <CheckBox checked={allSelected} onChange={toggleAll} />
              <span className="text-sm text-gray-600">{id ? "Semua" : "All"}</span>
            </button>

            <div className="ml-auto text-right">
              {memberDiscount > 0 && (
                <p className="text-[11px] text-green-600 font-semibold leading-none mb-0.5">
                  {t.discount}: -{fmtRp(memberDiscount)}
                </p>
              )}
              {voucherDiscount > 0 && (
                <p className="text-[11px] text-green-600 font-semibold leading-none mb-0.5">
                  {voucher.code}: -{fmtRp(voucherDiscount)}
                </p>
              )}
              <p className="text-xs text-gray-400 leading-none">{t.total}</p>
              <p className="text-lg font-extrabold text-teal-700 leading-tight">{fmtRp(total)}</p>
            </div>

            <button
              disabled={chosen.length === 0}
              onClick={() => navigate("/store/checkout", { state: { selectedIds: chosen.map(i => i.id) } })}
              className={`flex-shrink-0 font-bold py-2.5 px-5 rounded-xl text-sm transition
                ${chosen.length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white"}`}>
              {t.checkout} {totalQty > 0 && `(${totalQty})`}
            </button>
          </div>
        </div>
      )}

      {/* Modal voucher */}
      {voucherOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
                <MdConfirmationNumber className="text-teal-600" /> {id ? "Voucher Toko" : "Store Voucher"}
              </h3>
              <button onClick={() => setVoucherOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <MdClose className="text-lg" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Input kode manual */}
              <div>
                <div className="flex gap-2">
                  <input value={codeInput}
                    onChange={e => { setCodeInput(e.target.value); setVoucherErr(""); }}
                    placeholder={id ? "Masukkan kode voucher" : "Enter voucher code"}
                    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-teal-400" />
                  <button onClick={() => applyCode(codeInput)}
                    disabled={!codeInput.trim()}
                    className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold px-4 rounded-xl text-sm transition">
                    {id ? "Pakai" : "Apply"}
                  </button>
                </div>
                {voucherErr && <p className="text-xs text-red-500 mt-1.5">{voucherErr}</p>}
              </div>

              {/* Daftar voucher tersedia */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  {id ? "Voucher Tersedia" : "Available Vouchers"}
                </p>
                {VOUCHERS.map(v => {
                  const eligible = subtotal >= v.min;
                  const active = voucher?.code === v.code;
                  return (
                    <div key={v.code}
                      className={`flex items-center gap-3 border rounded-xl p-3 transition
                        ${active ? "border-teal-400 bg-teal-50" : "border-gray-200"}`}>
                      <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                        <MdConfirmationNumber className="text-xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">{v.label[lang] ?? v.label.en}</p>
                        <p className="text-[11px] text-gray-400">{v.desc[lang] ?? v.desc.en}</p>
                        <span className="inline-block mt-1 text-[10px] font-mono font-bold text-teal-700 bg-white border border-teal-200 px-1.5 py-0.5 rounded">{v.code}</span>
                      </div>
                      {active ? (
                        <button onClick={() => setVoucher(null)}
                          className="text-xs font-semibold text-red-500 hover:text-red-600">
                          {id ? "Lepas" : "Remove"}
                        </button>
                      ) : (
                        <button onClick={() => applyCode(v.code)} disabled={!eligible}
                          className="text-xs font-bold text-teal-600 hover:text-teal-700 disabled:text-gray-300 disabled:cursor-not-allowed">
                          {id ? "Pakai" : "Apply"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}