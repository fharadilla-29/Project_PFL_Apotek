import React from "react";
import destinationsData from "./destinations.json";

export default function DestinationsAdmin() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Admin <span className="text-blue-600">Manajemen Destinasi</span>
          </h1>
          <p className="text-gray-600">Total Destinasi: <span className="font-bold text-blue-600">{destinationsData.length}</span></p>
        </header>

        {/* Responsive Table Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">Nama</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">Kategori</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">Lokasi</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">Tiket</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">Pengunjung</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">Kontak</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">Aktivitas</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {destinationsData.map((destination, index) => (
                <tr
                  key={destination.id}
                  className={`transition-all duration-300 hover:bg-blue-50 hover:shadow-md ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* ID */}
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                      #{destination.id}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-bold text-gray-900">{destination.name}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-semibold">
                      {destination.category}
                    </span>
                  </td>

                  {/* Lokasi */}
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    <div>
                      <p className="font-semibold">{destination.location.city}</p>
                      <p className="text-xs text-gray-500">{destination.location.province}</p>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="font-bold text-gray-900">{destination.rating}</span>
                    </div>
                  </td>

                  {/* Tiket Masuk */}
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {destination.visitInfo.entryFee}
                  </td>

                  {/* Pengunjung */}
                  <td className="px-6 py-4 text-gray-700">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold">
                      {destination.visitorsPerYear.toLocaleString()}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <a 
                      href={`tel:${destination.visitInfo.contact}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold underline text-sm"
                    >
                      {destination.visitInfo.contact}
                    </a>
                  </td>

                  {/* Aktivitas */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {destination.facilities.activities.map((activity, idx) => (
                        <span key={idx} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Destinasi</p>
            <p className="text-3xl font-bold text-gray-900">{destinationsData.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-semibold mb-2">Rating Rata-rata</p>
            <p className="text-3xl font-bold text-gray-900">
              {(destinationsData.reduce((acc, d) => acc + d.rating, 0) / destinationsData.length).toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Pengunjung</p>
            <p className="text-3xl font-bold text-gray-900">
              {(destinationsData.reduce((acc, d) => acc + d.visitorsPerYear, 0) / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-600">
            <p className="text-gray-600 text-sm font-semibold mb-2">Kategori</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Set(destinationsData.map(d => d.category)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
