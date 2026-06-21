import { Link } from "react-router-dom";
import { MdLocalShipping, MdVerified, MdLoop, MdLock, MdArrowForward, MdStar } from "react-icons/md";
import HeroBanner from "../components/HeroBanner";
import ProductCard from "../components/ProductCard";
import products from "../../data/pharmacy-products.json";

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Skin Care",    color: "bg-blue-50",   img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop"   },
  { name: "Cosmetics",   color: "bg-pink-50",   img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop" },
  { name: "Baby Care",   color: "bg-yellow-50", img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=80&h=80&fit=crop" },
  { name: "Supplements", color: "bg-green-50",  img: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=80&h=80&fit=crop"  },
  { name: "Men's Care",  color: "bg-gray-100",  img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=80&h=80&fit=crop" },
  { name: "Hair Care",   color: "bg-purple-50", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&h=80&fit=crop" },
  { name: "Women's Care",color: "bg-red-50",    img: "https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=80&h=80&fit=crop" },
  { name: "Beauty Care", color: "bg-orange-50", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&h=80&fit=crop" },
];

const OFFERS = [
  { pct: 30, label: "On Selected\nSkin Products",   color: "bg-yellow-50 border-yellow-200",  textColor: "text-yellow-700", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=120&h=100&fit=crop" },
  { pct: 25, label: "On Skin Care\nProducts",        color: "bg-blue-50 border-blue-200",      textColor: "text-blue-700",   img: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=120&h=100&fit=crop" },
  { pct: 20, label: "On Beauty\nCare Products",      color: "bg-pink-50 border-pink-200",      textColor: "text-pink-700",   img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&h=100&fit=crop" },
  { pct: 15, label: "On Personal\nCare Products",    color: "bg-green-50 border-green-200",    textColor: "text-green-700",  img: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=120&h=100&fit=crop" },
];

const BRANDS = [
  { name: "Mixa",     color: "bg-teal-600",   img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=160&h=120&fit=crop" },
  { name: "Vaseline", color: "bg-blue-600",   img: "https://images.unsplash.com/photo-1567721913486-6585f069b3a5?w=160&h=120&fit=crop" },
  { name: "Comfort",  color: "bg-yellow-500", img: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=160&h=120&fit=crop" },
  { name: "Always",   color: "bg-purple-600", img: "https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=160&h=120&fit=crop" },
];

const WHY_US = [
  { icon: "✅", title: "Authentic Products",   desc: "All products sourced directly from certified distributors."       },
  { icon: "🚚", title: "Fast Delivery",        desc: "Same-day delivery available in major cities."                     },
  { icon: "🔒", title: "Secure Shopping",      desc: "Your data & payments are fully encrypted and protected."          },
  { icon: "💊", title: "Wide Selection",       desc: "10,000+ pharmacy, beauty, and wellness products available."       },
];

const TRUST_ITEMS = [
  { icon: <MdLocalShipping className="text-2xl text-teal-600" />, label: "Free Shipping",    sub: "Delivery" },
  { icon: <MdVerified       className="text-2xl text-teal-600" />, label: "100% Authentic", sub: "Products"  },
  { icon: <MdLoop           className="text-2xl text-teal-600" />, label: "Easy Returns",   sub: "30-day returns" },
  { icon: <MdLock           className="text-2xl text-teal-600" />, label: "Secure Payment", sub: "100% Protected"  },
];

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ tag, title, children, action }) {
  return (
    <section className="px-4 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        {tag && <p className="text-xs text-teal-600 font-bold uppercase tracking-widest mb-1">{tag}</p>}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
          {action && (
            <Link to={action.to} className="flex items-center gap-1 text-sm text-teal-600 font-semibold hover:underline">
              {action.label} <MdArrowForward />
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StoreFront() {
  const featured   = products.slice(0, 4);
  const topRated   = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const discounted = products.filter(p => p.discount >= 15).slice(0, 3);

  return (
    <div className="bg-gray-50 pb-8">

      {/* Hero */}
      <HeroBanner />

      {/* Trust bar */}
      <div className="px-4 lg:px-8 mt-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {TRUST_ITEMS.map((t, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4">
                {t.icon}
                <div>
                  <p className="text-sm font-bold text-gray-800">{t.label}</p>
                  <p className="text-xs text-gray-400">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <Section tag="Product Category" title="Popular Categories">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} to={`/store/category/${cat.name.toLowerCase().replace(/\s+/g,"-")}`}
              className="flex flex-col items-center gap-2 group">
              <div className={`w-full aspect-square ${cat.color} rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 group-hover:border-teal-300 group-hover:shadow-md transition-all`}>
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" />
              </div>
              <p className="text-xs font-semibold text-gray-700 text-center group-hover:text-teal-600 transition-colors">{cat.name}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Featured + Promo split */}
      <section className="px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-teal-600 font-bold uppercase tracking-widest mb-1">Featured</p>
          <h2 className="text-xl font-extrabold text-gray-900 mb-5">Explore Up To 25% Discount<br />on Selected Products</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big promo card */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">25% OFF</span>
                <h3 className="text-lg font-extrabold text-gray-900 mt-3 mb-1">BloodFlow Plus</h3>
                <p className="text-xl font-extrabold text-teal-600">$70.00 <span className="text-xs font-normal text-gray-400">Including tax</span></p>
              </div>
              <div className="mt-4">
                <Link to="/store/products" className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all">
                  Shop Now <MdArrowForward />
                </Link>
              </div>
              <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=160&h=160&fit=crop"
                className="absolute right-0 bottom-0 w-32 h-32 object-cover opacity-80 rounded-tl-2xl" alt="" />
            </div>

            {/* Medium promo card */}
            <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-5 flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">25% OFF</span>
                <h3 className="text-lg font-extrabold text-gray-900 mt-3 mb-1">Hand Sanitizer</h3>
                <p className="text-xl font-extrabold text-teal-600">$22.00 <span className="text-xs font-normal text-gray-400">Including tax</span></p>
              </div>
              <div className="mt-4">
                <Link to="/store/products" className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all">
                  Shop Now <MdArrowForward />
                </Link>
              </div>
              <img src="https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=140&h=140&fit=crop"
                className="absolute right-0 bottom-0 w-28 h-28 object-cover opacity-80 rounded-tl-2xl" alt="" />
            </div>

            {/* Small promo card */}
            <div className="bg-pink-50 rounded-2xl border border-pink-100 p-5 flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="bg-pink-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">20% OFF</span>
                <h3 className="text-lg font-extrabold text-gray-900 mt-3 mb-1">CeraVe Moisturizer</h3>
                <p className="text-xl font-extrabold text-teal-600">$18.00 <span className="text-xs font-normal text-gray-400">Including tax</span></p>
              </div>
              <div className="mt-4">
                <Link to="/store/products" className="inline-flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all">
                  Shop Now <MdArrowForward />
                </Link>
              </div>
              <img src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=120&h=120&fit=crop"
                className="absolute right-0 bottom-0 w-24 h-24 object-cover opacity-80 rounded-tl-2xl" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Products */}
      <Section tag="Best Sellers" title="Top Rated Products" action={{ to: "/store/products", label: "View All" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {topRated.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>

      {/* Featured Offers */}
      <Section tag="Offers & Discounts" title="Featured Offers">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {OFFERS.map((o, i) => (
            <div key={i} className={`rounded-2xl border ${o.color} p-4 flex items-center gap-3 overflow-hidden relative`}>
              <div>
                <p className={`text-3xl font-extrabold ${o.textColor} leading-none`}>
                  Up to<br /><span className="text-4xl">{o.pct}%</span><br />OFF
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {o.label.split("\n").map((l, li) => <span key={li}>{l}<br /></span>)}
                </p>
                <Link to="/store/offers" className={`inline-block mt-2 text-xs font-bold ${o.textColor} underline`}>Shop Now</Link>
              </div>
              <img src={o.img} alt="" className="w-20 h-20 object-cover rounded-xl flex-shrink-0 opacity-90" />
            </div>
          ))}
        </div>
      </Section>

      {/* Brand Products */}
      <Section tag="Brand Products" title="Shop with Brand Products">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BRANDS.map(b => (
            <Link key={b.name} to="/store/products"
              className="rounded-2xl overflow-hidden relative group h-36 block">
              <img src={b.img} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className={`absolute inset-0 ${b.color} opacity-70`} />
              <div className="absolute inset-0 flex items-end p-4">
                <p className="text-white font-extrabold text-xl">{b.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section tag="Grand Promises" title="Why Choose Us?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {WHY_US.map((w, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{w.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">{w.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonial Banner */}
      <section className="px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-8 py-8">
            <div className="max-w-sm">
              <p className="text-xs text-teal-200 font-semibold uppercase tracking-widest mb-2">Grand Promises</p>
              <h2 className="text-xl font-extrabold text-white mb-2">
                Clients Say About Our<br />Products and Services.
              </h2>
              <p className="text-sm text-teal-100 mb-5">
                Authentic pharmacy, beauty and wellness products all in one trusted place.
              </p>
              <div className="flex items-center gap-3 mb-5">
                {[1,2,3].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/40?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-white/50" alt="" />
                ))}
                <div>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <MdStar key={s} className="text-yellow-400 text-sm" />)}</div>
                  <p className="text-xs text-teal-200">4.9 / 5 — 2,400+ reviews</p>
                </div>
              </div>
              <Link to="/store/products"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
                Explore Products <MdArrowForward />
              </Link>
            </div>
            <div className="hidden md:flex gap-3">
              {[
                "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=140&h=180&fit=crop",
                "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=140&h=180&fit=crop",
              ].map((img, i) => (
                <img key={i} src={img} alt="" className="w-32 h-44 object-cover rounded-xl shadow-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
