import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdSearch, MdFavoriteBorder, MdShoppingCart, MdPerson,
  MdMenu, MdClose, MdLocalOffer,
  MdKeyboardArrowDown, MdLogout, MdAccountCircle,
  MdCardMembership, MdReceipt, MdLanguage, MdCheck,
} from "react-icons/md";
import { BsStarFill } from "react-icons/bs";
import { RiMedicineBottleLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

const TIER_COLOR = {
  Platinum: "text-purple-600 bg-purple-100",
  Gold:     "text-yellow-600 bg-yellow-100",
  Silver:   "text-gray-600  bg-gray-100",
};

const LANG_OPTIONS = [
  { code: "en", label: "English",   flag: "🇺🇸" },
  { code: "id", label: "Indonesia", flag: "🇮🇩" },
];

export default function GuestNavbar() {
  const { user, logout, memberData }  = useAuth();
  const { lang, switchLang, t }       = useLang();
  const [search, setSearch]           = useState("");
  const [mobileOpen, setOpen]         = useState(false);
  const [userOpen, setUser]           = useState(false);
  const [langOpen, setLangOpen]       = useState(false);
  const navigate                      = useNavigate();
  const userRef                       = useRef(null);
  const langRef                       = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUser(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/store/products?q=${encodeURIComponent(search.trim())}`);
  };

  const goLogin = (from) =>
    navigate("/store/login", { state: { from: from ?? window.location.pathname } });

  const handleLogout = () => {
    logout();
    setUser(false);
    navigate("/store");
  };

  const currentLang = LANG_OPTIONS.find(l => l.code === lang) ?? LANG_OPTIONS[0];

  // Cart count (mock)
  const cartCount = user ? 3 : 0;

  return (
    <header className="w-full sticky top-0 z-50">

      {/* ── Promo bar ── */}
      <div className="bg-teal-600 text-white text-center py-1.5 text-xs font-semibold tracking-wide">
        {t.promoBar}
      </div>

      {/* ── Main bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">

          {/* Logo — ApotekSehat */}
          <Link to="/store" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="bg-teal-600 group-hover:bg-teal-700 rounded-lg p-1.5 transition-colors">
              <RiMedicineBottleLine className="text-white text-xl" />
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-gray-900 text-base leading-none group-hover:text-teal-700 transition-colors">
                ApotekSehat
              </p>
              <p className="text-[10px] text-teal-600 font-semibold leading-none">
                {lang === "id" ? "Apotek & Kesehatan" : "Pharmacy & Health"}
              </p>
            </div>
          </Link>

          {/* ── Language Switcher ── */}
          <div className="hidden md:block relative flex-shrink-0" ref={langRef}>
            <button
              onClick={() => setLangOpen(o => !o)}
              className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5
                         hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all font-medium"
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.label}</span>
              <MdKeyboardArrowDown className={`text-sm transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <div className="absolute left-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl w-40 overflow-hidden z-50">
                {LANG_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    onClick={() => { switchLang(opt.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors
                      ${lang === opt.code
                        ? "bg-teal-50 text-teal-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-base">{opt.flag}</span>
                    <span className="flex-1 text-left">{opt.label}</span>
                    {lang === opt.code && <MdCheck className="text-teal-500 text-sm" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Search ── */}
          <form onSubmit={handleSearch} className="flex-1 relative max-w-xl">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-20 py-2 border border-gray-200 rounded-xl text-sm outline-none
                         focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                         hover:border-teal-300 bg-gray-50 hover:bg-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-700
                         text-white rounded-lg px-2.5 py-1 text-xs font-semibold transition-all"
            >
              {t.searchBtn}
            </button>
          </form>

          {/* ── Right icons ── */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Belum login */}
            {!user && (
              <button
                onClick={() => goLogin("/store")}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600
                           hover:text-teal-600 hover:bg-teal-50 active:bg-teal-100 transition-all font-medium"
              >
                <MdPerson className="text-lg" />
                <span className="text-xs">{t.loginSignup}</span>
              </button>
            )}

            {/* Sudah login: avatar + dropdown */}
            {user && (
              <div className="relative hidden md:block" ref={userRef}>
                <button
                  onClick={() => setUser(o => !o)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl
                             hover:bg-teal-50 active:bg-teal-100 transition-all
                             border border-transparent hover:border-teal-200"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-teal-200 flex-shrink-0"
                  />
                  <div className="text-left min-w-0 max-w-[100px]">
                    <p className="text-xs font-bold text-gray-800 truncate leading-tight">
                      {lang === "id" ? "Halo" : "Hi"}, {user.name.split(" ")[0]}
                    </p>
                    {memberData && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TIER_COLOR[memberData.tier] ?? "text-gray-500 bg-gray-100"}`}>
                        {memberData.tier}
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowDown className={`text-sm text-gray-400 transition-transform flex-shrink-0 ${userOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl w-60 overflow-hidden z-50">
                    {/* Header profil */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white/40" alt="" />
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate">{user.name}</p>
                          <p className="text-teal-200 text-xs truncate">{user.email || user.username}</p>
                        </div>
                      </div>
                      {memberData && (
                        <div className="mt-3 bg-white/15 rounded-xl px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <BsStarFill className="text-yellow-300 text-xs" />
                            <span className="text-white text-xs font-bold">
                              {memberData.points.toLocaleString()} {lang === "id" ? "poin" : "points"}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                            {memberData.tier}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      {[
                        { icon: <MdAccountCircle className="text-teal-600" />,   label: t.myProfile,    to: "/store/profile"      },
                        { icon: <MdCardMembership className="text-purple-500" />, label: t.membership,   to: "/store/membership"   },
                        { icon: <MdReceipt className="text-blue-500" />,          label: t.transactions, to: "/store/transactions" },
                        { icon: <MdShoppingCart className="text-orange-500" />,   label: t.myOrders,     to: "/store/orders"       },
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setUser(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                     hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                          <span className="text-base">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500
                                   hover:bg-red-50 transition-colors"
                      >
                        <MdLogout className="text-base" /> {t.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Favourites */}
            <button
              onClick={() => !user && goLogin()}
              className="relative p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition-all"
              title={lang === "id" ? "Favorit" : "Favourites"}
            >
              <MdFavoriteBorder className="text-xl" />
            </button>

            {/* ── Keranjang → /store/cart ── */}
            <Link
              to={user ? "/store/cart" : "/store/login"}
              className="relative p-2 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-teal-50 active:bg-teal-100 transition-all"
              title={t.myCart}
            >
              <MdShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-teal-500 text-white text-[10px] font-bold
                                  w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-all"
            >
              {mobileOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-md">
          {/* Mobile user info */}
          {user && (
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-teal-50">
              <img src={user.avatar} className="w-9 h-9 rounded-full border-2 border-teal-200" alt="" />
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {lang === "id" ? "Halo" : "Hi"}, {user.name.split(" ")[0]}
                </p>
                {memberData && (
                  <p className="text-xs text-teal-600">
                    {memberData.points.toLocaleString()} {lang === "id" ? "poin" : "pts"} · {memberData.tier}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="px-4 py-2">
            {/* Language toggle mobile */}
            <div className="flex items-center gap-2 py-2.5 border-b border-gray-50 mb-1">
              <MdLanguage className="text-teal-500" />
              <span className="text-xs text-gray-500 font-semibold mr-auto">
                {lang === "id" ? "Bahasa" : "Language"}
              </span>
              {LANG_OPTIONS.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => switchLang(opt.code)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${
                    lang === opt.code
                      ? "bg-teal-600 text-white border-teal-600"
                      : "border-gray-200 text-gray-500 hover:border-teal-300"
                  }`}
                >
                  {opt.flag} {opt.label}
                </button>
              ))}
            </div>

            {user && (
              <>
                <Link to="/store/profile"      onClick={() => setOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50 hover:text-teal-600"><MdAccountCircle className="text-teal-500" /> {t.myProfile}</Link>
                <Link to="/store/membership"   onClick={() => setOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50 hover:text-teal-600"><MdCardMembership className="text-purple-500" /> {t.membership}</Link>
                <Link to="/store/transactions" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50 hover:text-teal-600"><MdReceipt className="text-blue-500" /> {t.transactions}</Link>
                <Link to="/store/orders"       onClick={() => setOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50 hover:text-teal-600"><MdShoppingCart className="text-orange-500" /> {t.myOrders}</Link>
                <Link to="/store/cart"         onClick={() => setOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50 hover:text-teal-600"><MdShoppingCart className="text-teal-500" /> {t.myCart}</Link>
              </>
            )}

            {t.categories.map((cat, i) => (
              <Link
                key={i}
                to={`/store/category/${cat.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "and")}`}
                onClick={() => setOpen(false)}
                className="flex items-center py-2.5 text-sm text-gray-700 border-b border-gray-50 last:border-0 hover:text-teal-600 transition-colors"
              >
                {cat}
              </Link>
            ))}

            <Link to="/store/offers" onClick={() => setOpen(false)}
              className="flex items-center gap-2 py-2.5 text-sm font-bold text-red-500 hover:text-red-600">
              <MdLocalOffer /> {t.offers}
            </Link>

            {!user
              ? <button onClick={() => { setOpen(false); goLogin(); }}
                  className="w-full mt-2 bg-teal-600 text-white font-bold py-2.5 rounded-xl text-sm">
                  {t.loginSignup}
                </button>
              : <button onClick={() => { setOpen(false); handleLogout(); }}
                  className="w-full mt-2 border border-red-200 text-red-500 font-semibold py-2.5 rounded-xl text-sm hover:bg-red-50">
                  {t.logout}
                </button>
            }
          </div>
        </div>
      )}
    </header>
  );
}
