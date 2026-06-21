import { useState, useEffect } from "react";
import { MdArrowForward, MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    id: 1,
    tag:      "New Collection 2026",
    title:    "Your Daily Wellness,\nDelivered Smarter",
    subtitle: "Authentic pharmacy, beauty and wellness products all in one trusted place.",
    cta:      "Shop Now",
    ctaLink:  "/store/products",
    cta2:     "Explore Categories",
    bg:       "from-teal-600 to-teal-800",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=180&h=220&fit=crop",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=180&h=220&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=180&h=220&fit=crop",
    ],
  },
  {
    id: 2,
    tag:      "Featured Deals",
    title:    "Up To 25% Off\nSelected Products",
    subtitle: "Limited time offers on your favourite pharmacy & wellness brands.",
    cta:      "View Offers",
    ctaLink:  "/store/offers",
    cta2:     "All Products",
    bg:       "from-purple-600 to-purple-800",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=180&h=220&fit=crop",
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=180&h=220&fit=crop",
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=180&h=220&fit=crop",
    ],
  },
];

export default function HeroBanner() {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${slide.bg} rounded-2xl mx-4 lg:mx-8 mt-4`}
      style={{ minHeight: 280 }}>

      {/* Content */}
      <div className="flex items-center justify-between px-8 py-8 relative z-10">
        <div className="max-w-xs">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {slide.tag}
          </span>
          <h1 className="text-white font-extrabold leading-tight mb-3" style={{ fontSize: "1.75rem" }}>
            {slide.title.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>
          <p className="text-white/80 text-sm mb-5 leading-relaxed">{slide.subtitle}</p>
          <div className="flex gap-3">
            <Link to={slide.ctaLink}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
              {slide.cta}
            </Link>
            <Link to="/store"
              className="border-2 border-white/50 hover:border-white text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
              {slide.cta2}
            </Link>
          </div>
        </div>

        {/* Product images */}
        <div className="hidden md:flex items-end gap-3 flex-shrink-0">
          {slide.images.map((img, i) => (
            <img key={i} src={img} alt=""
              className={`object-cover rounded-xl shadow-lg transition-all duration-500 ${
                i === 1 ? "h-52 w-32" : "h-40 w-28"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-8 flex gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full transition-all ${i === idx ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`} />
        ))}
      </div>

      {/* Arrows */}
      <button onClick={() => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white z-10">
        <MdArrowBack className="text-base" />
      </button>
      <button onClick={() => setIdx(i => (i + 1) % SLIDES.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white z-10">
        <MdArrowForward className="text-base" />
      </button>
    </div>
  );
}
