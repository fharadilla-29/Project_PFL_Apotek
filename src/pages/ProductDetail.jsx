import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`https://dummyjson.com/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => setError(err.message));
    }, [id]);

    if (error) return (
        <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 font-semibold text-sm mb-4">Gagal memuat: {error}</p>
                <button onClick={() => navigate("/produk")}
                    className="bg-teal-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-teal-700">
                    ← Kembali
                </button>
            </div>
        </div>
    );

    if (!product) return (
        <div className="p-6 flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate("/produk")}
                    className="text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-semibold transition-all">
                    ← Kembali
                </button>
                <div>
                    <h1 className="text-xl font-extrabold text-gray-900">{product.title}</h1>
                    <p className="text-xs text-gray-400">{product.category} · SKU: {product.sku}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Image */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <img src={product.thumbnail} alt={product.title}
                        className="w-full rounded-lg object-cover aspect-square" />
                    {product.images?.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto">
                            {product.images.slice(0,4).map((img, i) => (
                                <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="text-sm font-bold text-gray-800 mb-4">Informasi Produk</h2>
                        <p className="text-sm text-gray-500 mb-5 leading-relaxed">{product.description}</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Kategori",    val: product.category              },
                                { label: "Brand",       val: product.brand || "—"          },
                                { label: "Rating",      val: `⭐ ${product.rating}/5`       },
                                { label: "Diskon",      val: `${product.discountPercentage}% off` },
                            ].map(item => (
                                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{item.label}</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="text-sm font-bold text-gray-800 mb-4">Harga & Stok</h2>
                        <div className="flex items-end gap-4 mb-5">
                            <p className="text-3xl font-extrabold text-teal-600">
                                Rp {(product.price * 1000).toLocaleString("id-ID")}
                            </p>
                            <span className={`mb-1 inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                product.stock > 20 ? "bg-green-100 text-green-700" :
                                product.stock > 0  ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"
                            }`}>
                                {product.stock > 0 ? `${product.stock} tersedia` : "Habis"}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all">
                                Beli Sekarang
                            </button>
                            <button className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-2.5 rounded-lg text-sm transition-all">
                                Tambah Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
