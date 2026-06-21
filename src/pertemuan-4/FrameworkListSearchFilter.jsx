import { useState } from "react";
import frameworkData from "./framework.json";

export default function FrameworkListSearchFilter() {
  /** 1. Deklarasi State menggunakan Object **/
  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    selectedTag: "",
  });

  /* Handle perubahan nilai input form */
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  /* Fungsi Reset untuk tombol "Clear all filters" */
  const handleReset = () => {
    setDataForm({
      searchTerm: "",
      selectedTag: "",
    });
  };

  // /** 2. Deklarasi pengambilan unique tags **/
  // const allTags = [
  //   ...new Set(frameworkData.flatMap((framework) => framework.tags)),
  // ];




  /** 3. Deklarasi Logic Search & Filter **/
  const _searchTerm = dataForm.searchTerm.toLowerCase();
  
  const filteredFrameworks = frameworkData.filter((framework) => {
    const matchesSearch =
      framework.name.toLowerCase().includes(_searchTerm) ||
      framework.description.toLowerCase().includes(_searchTerm) ||
      framework.details.developer.toLowerCase().includes(_searchTerm);

    // PERBAIKAN DI SINI: Gunakan dataForm.selectedTag
    const matchesTag = dataForm.selectedTag 
      ? framework.tags.includes(dataForm.selectedTag) 
      : true;

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Explore <span className="text-purple-600">Frameworks</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search framework, description, or developer..."
                name="searchTerm"
                value={dataForm.searchTerm} // Ditambah value agar sinkron
                onChange={handleChange}
                className="w-full p-4 pl-12 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              name="selectedTag"
              value={dataForm.selectedTag} // PERBAIKAN: Gunakan dataForm.selectedTag
              onChange={handleChange}
              className="w-full md:w-64 p-4 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white transition-all cursor-pointer text-gray-600 font-medium"
            >
              <option value="">All Categories</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFrameworks.length > 0 ? (
            filteredFrameworks.map((item) => (
              <div key={item.id} className="group flex flex-col bg-white border border-gray-100 rounded-3xl shadow-sm transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:border-purple-200 overflow-hidden">
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors">{item.name}</h2>
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-lg border border-purple-100">
                      {item.details.developer}
                    </span>
                  </div>
                  <p className="text-gray-500 leading-relaxed mb-6">{item.description}</p>
                  <a href={item.details.officialWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800">
                    View Documentation
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-50 flex flex-wrap gap-2 group-hover:bg-purple-50/50 transition-colors">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="bg-white border border-gray-200 text-gray-500 px-3 py-1 text-[11px] font-semibold rounded-full shadow-sm group-hover:border-purple-200 group-hover:text-purple-700 transition-all">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-xl font-medium">
                No results found for "{dataForm.searchTerm}"
              </p>
              <button 
                onClick={handleReset} // Menggunakan fungsi reset yang baru
                className="mt-4 text-purple-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}