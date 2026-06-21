import { useState } from "react";
import { MdShoppingCart, MdFavoriteBorder, MdFavorite, MdStar } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product }) {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [fav, setFav]     = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!user) {
      // Belum login — redirect ke halaman login, simpan tujuan kembali
      navigate("/store/login", { state: { from: window.location.pathname } });
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleFav = () => {
    if (!user) {
      navigate("/store/login", { state: { from: window.location.pathname } });
      return;
    }
    setFav(f => !f);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden">

      {/* Image */}
      <div className="relative bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            {product.badge}
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
            -{product.discount}%
          </span>
        )}

        {/* Fav button */}
        <button onClick={handleFav}
          className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-md
                     flex items-center justify-center
                     opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
                     transition-all duration-200 hover:bg-red-50">
          {fav
            ? <MdFavorite className="text-red-500 text-base" />
            : <MdFavoriteBorder className="text-gray-400 text-base" />
          }
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[11px] text-teal-600 font-semibold uppercase tracking-wide mb-0.5">{product.brand}</p>
        <p className="text-sm font-semibold text-gray-800 leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <MdStar key={s} className={`text-xs ${s <= Math.round(product.rating) ? "text-yellow-400" : "text-gray-200"}`} />
            ))}
          </div>
          <span className="text-[11px] text-gray-400">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="font-extrabold text-gray-900 text-base">
              ${(product.price / 10000).toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through ml-1.5">
                ${(product.originalPrice / 10000).toFixed(2)}
              </span>
            )}
          </div>
          {product.discount > 0 && (
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
              Hemat {product.discount}%
            </span>
          )}
        </div>

        {/* Add to Cart — tampilan sama, behavior beda */}
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                      flex items-center justify-center gap-2 active:scale-[0.97]
                      ${added
                        ? "bg-green-500 text-white"
                        : "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white"
                      }`}
        >
          {added
            ? <>✓ Ditambahkan!</>
            : <><MdShoppingCart className="text-base" /> Add to Cart</>
          }
        </button>
      </div>
    </div>
  );
}
