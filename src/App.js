import React, { useState, useMemo } from 'react';
import services from './data.json';
import { Search, ChevronRight, ActivitySquare, Zap, Hash } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Hamısı");

  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s["Xidmət qrupu"]));
    return ["Hamısı", ...Array.from(cats).filter(Boolean).sort()];
  }, []);

  const results = useMemo(() => {
    let filtered = services;
    if (activeTab !== "Hamısı") {
      filtered = filtered.filter(s => s["Xidmət qrupu"] === activeTab);
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(s => 
        (s["Tibbi xidmətin adı"]?.toLowerCase().includes(q)) || 
        (s["Prosedur / xəstəlik kodu"]?.toString().includes(q))
      );
    }
    return filtered.slice(0, 100);
  }, [query, activeTab]);

  const formatPrice = (price) => {
    const p = price?.toString() || "";
    return p.includes("Hər") || p.includes("təhkim") ? "Müqaviləli" : p;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-20">
      <header className="bg-white/90 border-b border-slate-100 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-100 text-white">
                <ActivitySquare size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">İTS Portal</h1>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5">Mərkəzi Reyestr</p>
              </div>
            </div>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
              V2.5
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-all" />
            </div>
            <input 
              type="text"
              placeholder="Kod və ya xidmət adı ilə axtar..."
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[22px] py-4.5 pl-12 pr-4 focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all outline-none text-md font-semibold"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-xl mx-auto px-6 pb-6 overflow-x-auto flex gap-3 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all duration-300 uppercase tracking-widest border-2 ${
                activeTab === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-300 scale-105' 
                : 'bg-white text-slate-400 border-slate-50 hover:border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-2">
          <span>Bazada cəmi: {services.length} xidmət</span>
          <span className="flex items-center gap-1.5 text-blue-500"><Zap size={12} fill="currentColor" /> Live</span>
        </div>

        {results.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-[40px] p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 border-l-[8px] border-l-blue-600 group"
          >
            {/* TOP SECTION: KOD (REFINED FONT SIZE) */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] px-1 mb-1">Prosedur Kodu</p>
                <div className="flex items-center gap-2 text-blue-600 px-1">
                  <Hash size={24} className="opacity-30 shrink-0" />
                  <span className="text-3xl font-black tracking-tighter leading-none">
                    {item["Prosedur / xəstəlik kodu"] || "N/A"}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12 shadow-sm">
                <ChevronRight size={20} />
              </div>
            </div>

            <div className="px-1 mb-6">
               <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest bg-blue-50/50 px-2 py-1 rounded-md mb-3 inline-block">
                {item["Xidmət qrupu"]}
              </span>
              <h3 className="text-slate-900 font-bold text-xl leading-[1.35] tracking-tight">
                {item["Tibbi xidmətin adı"]}
              </h3>
            </div>

            {/* BOTTOM SECTION: TARIF (MATCHING FONT SIZE) */}
            <div className="flex items-end justify-between border-t border-slate-50 pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] px-1 mb-1">Xidmət Tarifi</p>
                <div className="flex items-baseline gap-2 px-1">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                    {formatPrice(item["Tibbi xidmətin tarifi *"])}
                  </span>
                  {!formatPrice(item["Tibbi xidmətin tarifi *"]).includes("Müqavilə") && (
                    <span className="text-xs font-black text-slate-400 italic tracking-tighter uppercase">AZN</span>
                  )}
                </div>
              </div>
              <button className="bg-slate-900 text-white px-7 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-slate-200">
                Detallar
              </button>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center py-32 px-10">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-100">
              <Search size={48} />
            </div>
            <h2 className="text-slate-900 font-black text-2xl tracking-tight">Tapılmadı</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Lütfən kodu və ya adı dəqiqləşdirin.</p>
          </div>
        )}
      </main>
    </div>
  );
}
