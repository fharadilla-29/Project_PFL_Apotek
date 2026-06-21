import { useState, useMemo } from "react";
import { MdSearch, MdExpandMore, MdFilterList } from "react-icons/md";
import ProductCard from "../components/ProductCard";
import products from "../../data/pharmacy-products.json";

const CATS = ["All", ...new Set(products.map(p => p.category))];
const SORTS = [
  { val: "popular",  label: "Most Popular"  },
  { val: "price-asc",label: "Price: Low→High"},
  { val: "price-desc",label:"Price: High→Low"},
  { val: "rating",   label: "Highest Rated" },
];

export default function StoreProducts() {
  const [search, setSearch] = useState("");
  const [cat, setCat]       = useState("All");
  const [sort, setSort]     = useState("popular");

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "All") list = list.filter(p => p.category === cat);
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "price-asc")  list.sort((a,b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a,b) => b.price - a.price);
    if (sort === "rating")     list.sort((a,b) => b.rating - a.rating);
    return list;
  }, [search, cat, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">All Products</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products or brands..."
            className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-teal-400" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${cat === c ? "bg-teal-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="relative ml-auto">
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer">
            {SORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
          </select>
          <MdExpandMore className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4">{filtered.length} products found</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        {filtered.length === 0 && (
          <div className="col-span-4 text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>Produk tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
