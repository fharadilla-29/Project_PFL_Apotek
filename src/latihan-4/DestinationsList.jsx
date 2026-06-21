import React from "react";
import destinationsData from "./destinations.json";

export default function DestinationsList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Jelajahi <span className="text-blue-600">Destinasi Menakjubkan Indonesia</span>
          </h1>
          <p className="text-gray-600 text-lg">Temukan keindahan, budaya, dan petualangan yang menanti Anda</p>
        </header>

        {/* Grid Layout untuk Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinationsData.map((destination) => (
            <div
              key={destination.id}
              className="group flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:border-blue-300 border border-gray-200"
            >
              {/* Image Section with Overlay */}
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

              {/* Content Section */}
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
                    <p className="font-semibold">{destination.location.city}, {destination.location.province}</p>
                    <p className="text-xs text-gray-500">{destination.location.country}</p>
                  </div>
                </div>

                {/* Facilities Preview */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">FASILITAS</p>
                  <div className="flex flex-wrap gap-2">
                    {destination.facilities.activities.slice(0, 2).map((activity, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {activity}
                      </span>
                    ))}
                    {destination.facilities.activities.length > 2 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        +{destination.facilities.activities.length - 2} lainnya
                      </span>
                    )}
                  </div>
                </div>

                {/* Visit Info */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600">Tiket Masuk</p>
                    <p className="font-bold text-gray-900">{destination.visitInfo.entryFee}</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600">Jam Buka</p>
                    <p className="font-bold text-gray-900 text-xs">{destination.visitInfo.openingHours}</p>
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

                {/* Call Button */}
                <a
                  href={`tel:${destination.visitInfo.contact}`}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-center transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  📞 Hubungi: {destination.visitInfo.contact}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
