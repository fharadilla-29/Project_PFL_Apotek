import React, { useState } from "react";
import destinationsData from "./destinations.json";

export default function DestinationsApp() {
  // State untuk Form Search & Filter
  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    selectedCategory: "",
    selectedRating: "",
  });

  // State untuk toggle view (Guest/Admin)
  const [viewMode, setViewMode] = useState("guest");

  // Handle perubahan input
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  // Handle reset filter
  const handleReset = () => {
    setDataForm({
      searchTerm: "",
      selectedCategory: "",
      selectedRating: "",
    });
  };

  // Get unique categories
  const allCategories = [...new Set(destinationsData.map((d) => d.category))];

  // Filter Logic
  const _searchTerm = dataForm.searchTerm.toLowerCase();

  const filteredDestinations = destinationsData.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(_searchTerm) ||
      destination.description.toLowerCase().includes(_searchTerm) ||
      destination.location.city.toLowerCase().includes(_searchTerm);

    const matchesCategory = dataForm.selectedCategory
      ? destination.category === dataForm.selectedCategory
      : true;

    const matchesRating = dataForm.selectedRating
      ? destination.rating >= parseFloat(dataForm.selectedRating)
      : true;

    return matchesSearch && matchesCategory && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
                Panduan Destinasi
              </h1>
              <p className="text-blue-100 text-lg">Temukan Atraksi Terbaik Indonesia</p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-3 bg-blue-700 bg-opacity-50 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("guest")}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  viewMode === "guest"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-white hover:bg-blue-600"
                }`}
              >
                👥 Pengunjung
              </button>
              <button
                onClick={() => setViewMode("admin")}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  viewMode === "admin"
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-white hover:bg-blue-600"
                }`}
              >
                ⚙️ Admin
              </button>
            </div>
          </div>

          {/* Search & Filter Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search Bar */}
              <div className="lg:col-span-2 relative">
                <input
                  type="text"
                  placeholder="Cari destinasi, kota, atau lokasi..."
                  name="searchTerm"
                  value={dataForm.searchTerm}
                  onChange={handleChange}
                  className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-4 top-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Filter 1: Category */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Kategori</label>
                <select
                  name="selectedCategory"
                  value={dataForm.selectedCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-white focus:border-transparent outline-none bg-white text-gray-900 font-medium cursor-pointer transition-all"
                >
                  <option value="">Semua Kategori</option>
                  {allCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 2: Rating */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Rating Min</label>
                <select
                  name="selectedRating"
                  value={dataForm.selectedRating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-white focus:border-transparent outline-none bg-white text-gray-900 font-medium cursor-pointer transition-all"
                >
                  <option value="">Semua Rating</option>
                  <option value="4.5">★ 4.5+</option>
                  <option value="4.7">★ 4.7+</option>
                  <option value="4.8">★ 4.8+</option>
                  <option value="4.9">★ 4.9+</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center">
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all duration-300"
              >
                Hapus Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {filteredDestinations.length > 0 ? (
            <>
              {viewMode === "guest" ? (
                // GUEST VIEW - Cards
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDestinations.map((destination) => (
                    <div
                      key={destination.id}
                      className="group flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl border border-gray-200"
                    >
                      {/* Image Section */}
                      <div className="relative overflow-hidden h-56 bg-gray-200">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
                          <span className="text-yellow-400 text-lg">★</span>
                          <span className="font-bold text-gray-800">{destination.rating}</span>
                        </div>
                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {destination.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {destination.name}
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                          {destination.description}
                        </p>

                        {/* Location */}
                        <div className="flex items-start gap-2 mb-4 text-gray-700">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="font-semibold">{destination.location.city}</p>
                            <p className="text-xs text-gray-500">{destination.location.province}</p>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-gray-600">Tiket Masuk</p>
                            <p className="font-bold text-gray-900">{destination.visitInfo.entryFee}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-gray-600">Pengunjung</p>
                            <p className="font-bold text-gray-900">{(destination.visitorsPerYear / 1000).toFixed(0)}K+</p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {destination.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Button */}
                        <a
                          href={`tel:${destination.visitInfo.contact}`}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-center transition-all duration-300 hover:shadow-lg text-sm md:text-base"
                        >
                          📞 {destination.visitInfo.contact}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // ADMIN VIEW - Table
                <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase">ID</th>
                        <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase">Nama</th>
                        <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase">Kategori</th>
                        <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase">Lokasi</th>
                        <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase">Rating</th>
                        <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase">Tiket</th>
                        <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase">Pengunjung</th>
                        <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase">Aktivitas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredDestinations.map((destination, index) => (
                        <tr
                          key={destination.id}
                          className={`transition-all duration-300 hover:bg-blue-50 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-4 md:px-6 py-4">
                            <span className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                              #{destination.id}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <img
                                src={destination.image}
                                alt={destination.name}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover"
                              />
                              <span className="font-bold text-gray-900 text-sm md:text-base">{destination.name}</span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                            <span className="bg-indigo-100 text-indigo-800 px-2 md:px-3 py-1 rounded-lg font-semibold">
                              {destination.category}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-700">
                            <div>
                              <p className="font-semibold">{destination.location.city}</p>
                              <p className="text-xs text-gray-500">{destination.location.province}</p>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              <span className="font-bold text-gray-900">{destination.rating}</span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 font-semibold text-gray-900 text-xs md:text-sm">
                            {destination.visitInfo.entryFee}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                            <span className="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-lg font-semibold">
                              {(destination.visitorsPerYear / 1000).toFixed(0)}K
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-xs">
                            <div className="flex flex-wrap gap-1">
                              {destination.facilities.activities.map((activity, idx) => (
                                <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] md:text-xs whitespace-nowrap">
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            // No Results
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-lg">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 text-xl font-semibold mb-2">
                Tidak ada hasil untuk "{dataForm.searchTerm}"
              </p>
              <p className="text-gray-500 mb-4">Coba sesuaikan filter Anda</p>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-300"
              >
                Hapus Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
