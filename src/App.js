import React, { useState, useMemo } from 'react';
import services from './data.json';
import { Search, Stethoscope, ChevronRight, Activity, Zap, ActivitySquare } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Hamısı");

  // 1. Automatically generate all categories from your 3000+ items
  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s["Xidmət qrupu"]));
    return ["Hamısı", ...Array.from(cats).filter(Boolean).sort()];
  }, []);

  // 2. High-performance search & category filtering
  const results = useMemo(() => {
    let filtered = services;
    
    // Filter by Category Tab
    if (activeTab !== "Hamısı") {
      filtered = filtered.filter(s => s["Xidmət qrupu"] === activeTab);
    }
    
    // Filter by Search Text (Name or Code)
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(s => 
        (s["Tibbi xidmətin adı"]?.toLowerCase().includes(q)) || 
        (s["Prosedur / xəstəlik kodu"]?.toString().includes(q))
      );
    }
    
    // Performance: Only render first 150 results to keep mobile fast
    return filtered.slice(0, 150);
  }, [query, activeTab]);

  // 3. Helper function to fix the "Hər" / Text price issue
  const formatPrice = (price) => {
    const p = price?.toString() || "";
    if (p.includes("Hər") || p.includes("təhkim")) return "Müqaviləli";
    return p;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      {/* Sticky Header Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl shadow-blue-200 shadow-lg text-white">
                <ActivitySquare size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-none">İTS Portal</h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1 italic">Vahid Tarif Reyestri</p>
              </div>
            </div>
            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold border border-green-100 uppercase animate-pulse">
              Canlı Data
            </div>
          </div>

          {/* Premium Search Bar */}
          <div className="group relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text"
              placeholder="Ad və ya kod ilə axtarış..."
              className="w-full bg-slate-100 border border-transparent rounded-2xl py-3.5 pl-11 pr-4 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-md"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Horizontal Category Scroller */}
        <div className="max-w-xl mx-auto px-4 pb-4 overflow-x-auto flex gap-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                activeTab === cat 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105' 
                : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Results List */}
      <main className="max-w-xl mx-auto p-4 space-y-4 mt-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
          <span>Siyahı: {results.length === 150 ? "150+" : results.length} xidmət</span>
          <span className="flex items-center gap-1 text-blue-500"><Zap size={10} /> Sürətli Axtarış</span>
        </div>

        {results.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all border-l-4 border-l-blue-600 group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 self-start px-2 py-0.5 rounded-lg uppercase tracking-tight">
                  {item["Prosedur / xəstəlik kodu"] || "KODSUZ"}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[200px]">
                   {item["Xidmət qrupu"]}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-full text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronRight size={16} />
              </div>
            </div>

            <h3 className="text-slate-800 font-semibold text-base leading-snug mb-4 pr-2">
              {item["Tibbi xidmətin adı"]}
            </h3>

            <div className="flex items-end justify-between border-t border-slate-50 pt-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Xidmət Tarifi</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                    {formatPrice(item["Tibbi xidmətin tarifi *"])}
                  </span>
                  {!formatPrice(item["Tibbi xidmətin tarifi *"]).includes("Müqavilə") && (
                    <span className="text-xs font-bold text-slate-500 italic uppercase">AZN</span>
                  )}
                </div>
              </div>
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[11px] font-bold shadow-lg shadow-slate-100 hover:bg-blue-600 transition-all active:scale-95">
                Məlumat
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {results.length === 0 && (
          <div className="text-center py-24 px-10">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <h2 className="text-slate-900 font-bold">Nəticə tapılmadı</h2>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">Başqa bir xəstəlik adı və ya kodu yoxlayın.</p>
          </div>
        )}
      </main>
    </div>
  );
}
