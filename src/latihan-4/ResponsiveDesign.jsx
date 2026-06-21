import React from "react";

export default function ResponsiveDesign() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Panduan <span className="text-blue-600">Responsive Design</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Coba ubah ukuran jendela browser atau zoom in/out untuk melihat bagaimana layout menyesuaikan
          </p>
        </header>

        {/* 1. Responsive Typography */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            1️⃣ Typografi Responsif
          </h2>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed mb-4">
            Ukuran teks berubah berdasarkan ukuran layar: <strong>kecil di mobile, besar di desktop</strong>
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <code className="text-sm text-blue-900">
              className="text-sm md:text-base lg:text-lg xl:text-xl"
            </code>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            📱 Mobile (default): text-sm | 📲 Tablet (md): text-base | 💻 Desktop (lg): text-lg | 🖥️ Besar (xl): text-xl
          </p>
        </section>

        {/* 2. Responsive Flex Layout */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            2️⃣ Layout Flex Responsif
          </h2>
          <p className="text-gray-600 mb-4">
            Di bawah: 2 kolom menumpuk vertikal di mobile, berdampingan di tablet/desktop
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-red-400 to-red-600 p-8 rounded-xl text-white font-bold text-lg text-center">
              Kolom 1 (Kiri)
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 rounded-xl text-white font-bold text-lg text-center">
              Kolom 2 (Kanan)
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <code className="text-sm text-blue-900">
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            </code>
          </div>
        </section>

        {/* 3. Responsive Grid Layout */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            3️⃣ Layout Grid Responsif
          </h2>
          <p className="text-gray-600 mb-4">
            Grid yang berubah dari 1 kolom (mobile) → 2 (tablet) → 3 (desktop) → 4 (besar)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div 
                key={num}
                className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-xl text-white font-bold text-center hover:scale-110 transition-transform"
              >
                Kotak {num}
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <code className="text-sm text-blue-900">
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            </code>
          </div>
        </section>

        {/* 4. Responsive Padding & Margin */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            4️⃣ Padding & Margin Responsif
          </h2>
          <p className="text-gray-600 mb-4">
            Padding/margin yang menyesuaikan: kompak di mobile, luas di desktop
          </p>
          <div className="p-4 md:p-8 lg:p-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl mb-4">
            <p className="text-sm md:text-base lg:text-lg text-white font-semibold">
              Padding kotak ini: p-4 (mobile) → p-8 (tablet) → p-12 (desktop)
            </p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <code className="text-sm text-blue-900">
              className="p-4 md:p-8 lg:p-12"
            </code>
          </div>
        </section>

        {/* 5. Responsive Navigation */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            5️⃣ Element yang Tersembunyi Responsif
          </h2>
          <p className="text-gray-600 mb-4">
            Beberapa elemen tersembunyi di mobile (hidden) dan ditampilkan di tablet (md:block)
          </p>
          <div className="flex justify-between items-center bg-gray-100 p-6 rounded-xl">
            <span className="font-bold text-gray-900">Menu</span>
            <div className="hidden md:flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Beranda</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Tentang</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Kontak</button>
            </div>
            <button className="md:hidden text-2xl">☰</button>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mt-4">
            <code className="text-sm text-blue-900">
              className="hidden md:flex"
            </code>
          </div>
        </section>

        {/* 6. Breakpoints Reference */}
        <section className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            📏 Referensi Breakpoints Tailwind
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-xl border border-white border-opacity-30">
              <p className="text-yellow-300 font-bold text-sm">📱 Default</p>
              <p className="text-lg font-bold">0px - 639px</p>
              <p className="text-sm opacity-90">Ponsel kecil</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-xl border border-white border-opacity-30">
              <p className="text-yellow-300 font-bold text-sm">📲 sm (Kecil)</p>
              <p className="text-lg font-bold">640px+</p>
              <p className="text-sm opacity-90">Ponsel besar</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-xl border border-white border-opacity-30">
              <p className="text-yellow-300 font-bold text-sm">💻 md (Sedang)</p>
              <p className="text-lg font-bold">768px+</p>
              <p className="text-sm opacity-90">Tablet</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-xl border border-white border-opacity-30">
              <p className="text-yellow-300 font-bold text-sm">🖥️ lg (Besar)</p>
              <p className="text-lg font-bold">1024px+</p>
              <p className="text-sm opacity-90">Desktop</p>
            </div>
          </div>
          <div className="mt-6 bg-white bg-opacity-10 backdrop-blur p-4 rounded-xl border border-white border-opacity-30">
            <p className="font-semibold mb-2">💡 Tips Pro:</p>
            <p className="text-sm opacity-90">
              Gunakan pendekatan mobile-first! Atur gaya dasar untuk mobile, kemudian tambahkan prefix (sm:, md:, lg:) untuk layar lebih besar.
            </p>
          </div>
        </section>

        {/* Responsive Demo Indicator */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 text-center">
          <p className="text-gray-700 text-sm md:text-base">
            <span className="md:hidden">📱 Saat ini dilihat di: <strong>Mobile (0-639px)</strong></span>
            <span className="hidden md:inline lg:hidden">📲 Saat ini dilihat di: <strong>Tablet (640-1023px)</strong></span>
            <span className="hidden lg:inline">💻 Saat ini dilihat di: <strong>Desktop (1024px+)</strong></span>
          </p>
        </div>
      </div>
    </div>
  );
}