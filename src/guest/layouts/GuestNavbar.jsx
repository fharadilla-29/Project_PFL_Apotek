import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  MdSearch, MdFavoriteBorder, MdShoppingCart, MdPerson,
  MdExpandMore, MdMenu, MdClose, MdLocalOffer,
  MdKeyboardArrowDown, MdLogout, MdAccountCircle,
  MdCardMembership, MdReceipt, MdSettings,
} from "react-icons/md";
import { BsStarFill } from "react-icons/bs";
import { RiMedicineBottleLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Vitamins & Supplements", "Beauty", "Skin Care",
  "Hair Care", "Personal Care", "Mother & Baby", "Medical Supplies",
];

const TIER_COLOR = {
  Platinum: "text-purple-600 bg-purple-100",
  Gold:     "text-yellow-600 bg-yellow-100",
  Silver:   "text-gray-600  bg-gray-100",
};

const catClass = ({ isActive }) =>
  `relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-all select-none
   after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-all
   ${isActive
     ? "text-teal-600 font-semibold after:bg-teal-600"
     : "text-gray-600 hover:text-teal-600 after:bg-transparent hover:after:bg-teal-300 hover:bg-teal-50/60"}`;

export default function GuestNavbar() {
  const { user, logout, memberData } = useAuth();
  const [search, setSearch]   = useState("");
  const [mobileOpen, setOpen] = useState(false);
  const [allCatOpen, setCat]  = useState(false);
  const [userOpen, setUser]   = useState(false);
  const navigate              = useNavigate();
  const userRef               = useRef(null);
  const catRef                = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUser(false);
      if (catRef.current  && !catRef.current.contains(e.target))  setCat(false);
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

  return (
    <header className="w-full sticky top-0 z-50">

      {/* Promo bar */}
      <div className="bg-teal-600 text-white text-center py-1.5 text-xs font-semibold tracking-wide">
        Get Free Home Delivery with Flat Discount Up To 25% 🎉
      </div>

      {/* Main bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">

          {/* Logo */}
          <Link to="/store" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="bg-teal-600 group-hover:bg-teal-700 rounded-lg p-1.5 transition-colors">
              <RiMedicineBottleLine className="text-white text-xl" />
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-gray-900 text-base leading-none group-hover:text-teal-700 transition-colors">Outlet</p>
              <p className="text-[10px] text-teal-600 font-semibold leading-none">Pharmacy — صيدلية</p>
            </div>
          </Link>

          {/* Language */}
          <button className="hidden md:flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600 transition-all flex-shrink-0">
            English <MdKeyboardArrowDown className="text-sm" />
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 relative max-w-xl">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search cosmetics products..."
              className="w-full pl-10 pr-20 py-2 border border-gray-200 rounded-xl text-sm outline-none
                         focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                         hover:border-teal-300 bg-gray-50 hover:bg-white transition-all" />
            <button type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-700
                         text-white rounded-lg px-2.5 py-1 text-xs font-semibold transition-all">
              Search
            </button>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* ── BELUM LOGIN ── */}
            {!user && (
              <button onClick={() => goLogin("/store")}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600
                           hover:text-teal-600 hover:bg-teal-50 active:bg-teal-100 transition-all font-medium">
                <MdPerson className="text-lg" />
                <span className="text-xs">Login / Sign Up</span>
              </button>
            )}

            {/* ── SUDAH LOGIN: avatar + dropdown ── */}
            {user && (
              <div className="relative hidden md:block" ref={userRef}>
                <button onClick={() => setUser(o => !o)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl
                             hover:bg-teal-50 active:bg-teal-100 transition-all
                             border border-transparent hover:border-teal-200">
                  <img src={user.avatar} alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-teal-200 flex-shrink-0" />
                  <div className="text-left min-w-0 max-w-[100px]">
                    <p className="text-xs font-bold text-gray-800 truncate leading-tight">
                      Halo, {user.name.split(" ")[0]}
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
                      {/* Poin & tier */}
                      {memberData && (
                        <div className="mt-3 bg-white/15 rounded-xl px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <BsStarFill className="text-yellow-300 text-xs" />
                            <span className="text-white text-xs font-bold">{memberData.points.toLocaleString()} poin</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white`}>
                            {memberData.tier}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      {[
                        { icon: <MdAccountCircle className="text-teal-600" />, label: "Profil Saya",         to: "/store/profile"      },
                        { icon: <MdCardMembership className="text-purple-500"/>, label: "Kartu Membership",  to: "/store/membership"   },
                        { icon: <MdReceipt className="text-blue-500" />,       label: "Riwayat Transaksi",   to: "/store/transactions" },
                        { icon: <MdShoppingCart className="text-orange-500" />,label: "Pesanan Saya",        to: "/store/orders"       },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setUser(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                     hover:bg-teal-50 hover:text-teal-700 transition-colors">
                          <span className="text-base">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500
                                   hover:bg-red-50 transition-colors">
                        <MdLogout className="text-base" /> Keluar dari Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Favourites */}
            <button onClick={() => !user && goLogin()}
              className="relative p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition-all">
              <MdFavoriteBorder className="text-xl" />
            </button>

            {/* Cart */}
            <button
              onClick={() => user ? navigate("/store/cart") : goLogin()}
              className="relative p-2 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-teal-50 active:bg-teal-100 transition-all">
              <MdShoppingCart className="text-xl" />
              {user && (
                <span className="absolute -top-0.5 -right-0.5 bg-teal-500 text-white text-[10px] font-bold
                                  w-4 h-4 rounded-full flex items-center justify-center">3</span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-all">
              {mobileOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="bg-white border-b border-gray-100 hidden md:block" ref={catRef}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-stretch overflow-x-auto scrollbar-hide">
            <div className="relative flex-shrink-0">
              <button onClick={() => setCat(o => !o)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-r border-gray-100 transition-all
                  ${allCatOpen ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:text-teal-600 hover:bg-teal-50/60"}`}>
                <MdMenu className="text-base" /> All Categories
                <MdExpandMore className={`text-sm transition-transform ${allCatOpen ? "rotate-180" : ""}`} />
              </button>
              {allCatOpen && (
                <div className="absolute top-full left-0 bg-white border border-gray-100 rounded-b-xl shadow-lg w-52 py-1 z-50">
                  {CATEGORIES.map(cat => (
                    <Link key={cat} to={`/store/category/${cat.toLowerCase().replace(/\s+/g,"-")}`}
                      onClick={() => setCat(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-700 active:bg-teal-100 transition-colors">
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {CATEGORIES.map(cat => (
              <NavLink key={cat} to={`/store/category/${cat.toLowerCase().replace(/\s+/g,"-")}`} className={catClass}>{cat}</NavLink>
            ))}
            <NavLink to="/store/offers"
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-4 py-3 text-sm font-bold whitespace-nowrap transition-all
                 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-all
                 ${isActive ? "text-red-600 after:bg-red-500 bg-red-50/60" : "text-red-500 hover:text-red-600 hover:bg-red-50/60 after:bg-transparent hover:after:bg-red-300"}`}>
              <MdLocalOffer /> Offers &amp; Discounts
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-md">
          {/* Mobile user info */}
          {user && (
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-teal-50">
              <img src={user.avatar} className="w-9 h-9 rounded-full border-2 border-teal-200" alt="" />
              <div>
                <p className="text-sm font-bold text-gray-800">Halo, {user.name.split(" ")[0]}</p>
                {memberData && <p className="text-xs text-teal-600">{memberData.points.toLocaleString()} poin · {memberData.tier}</p>}
              </div>
            </div>
          )}
          <div className="px-4 py-2">
            {user && (
              <>
                <Link to="/store/profile"      onClick={() => setOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50 hover:text-teal-600"><MdAccountCircle className="text-teal-500" /> Profil Saya</Link>
                <Link to="/store/membership"   onClick={() => setOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50 hover:text-teal-600"><MdCardMembership className="text-purple-500" /> Kartu Membership</Link>
                <Link to="/store/transactions" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50 hover:text-teal-600"><MdReceipt className="text-blue-500" /> Riwayat Transaksi</Link>
              </>
            )}
            {CATEGORIES.map(cat => (
              <Link key={cat} to={`/store/category/${cat.toLowerCase().replace(/\s+/g,"-")}`}
                onClick={() => setOpen(false)}
                className="flex items-center py-2.5 text-sm text-gray-700 border-b border-gray-50 last:border-0 hover:text-teal-600 transition-colors">
                {cat}
              </Link>
            ))}
            <Link to="/store/offers" onClick={() => setOpen(false)}
              className="flex items-center gap-2 py-2.5 text-sm font-bold text-red-500 hover:text-red-600">
              <MdLocalOffer /> Offers &amp; Discounts
            </Link>
            {!user
              ? <button onClick={() => { setOpen(false); goLogin(); }}
                  className="w-full mt-2 bg-teal-600 text-white font-bold py-2.5 rounded-xl text-sm">Login / Sign Up</button>
              : <button onClick={() => { setOpen(false); handleLogout(); }}
                  className="w-full mt-2 border border-red-200 text-red-500 font-semibold py-2.5 rounded-xl text-sm hover:bg-red-50">Keluar</button>
            }
          </div>
        </div>
      )}
    </header>
  );
}
