import frameworkData from "./framework.json";

export default function FrameworkList() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Explore Frameworks
        </h1>
        
        {/* Menggunakan Grid agar responsif */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworkData.map((item) => (
            <div 
              key={item.id} 
              className="group flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:border-purple-300 overflow-hidden"
            >
              {/* Header Kartu */}
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-3">
                  {/* Judul berubah ungu saat hover */}
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                    {item.name}
                  </h2>
                  {/* Badge Developer dengan nuansa ungu */}
                  <span className="text-[10px] uppercase tracking-widest font-semibold bg-purple-50 text-purple-700 px-2 py-1 rounded">
                    {item.details.developer}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Link Website - default biru, ungu saat hover */}
                <a 
                  href={item.details.officialWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
                >
                  Visit Website 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Footer Kartu (Tags) */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2 group-hover:bg-purple-50 transition-colors">
                {item.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-white border border-gray-200 text-gray-600 px-3 py-1 text-[11px] font-medium rounded-full shadow-sm group-hover:border-purple-200 group-hover:text-purple-700 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}