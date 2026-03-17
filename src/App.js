import React, { useState, useMemo } from 'react';
import services from './data.json';
import { Search, Stethoscope, ChevronRight, ActivitySquare, Zap, Hash } from 'lucide-react';

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
      <header className="bg-white/80 border-b border-slate-100 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-xl mx-auto px-5 py-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-100 text-white">
                <ActivitySquare size={24} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">İTS Portal</h1>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Tarif Reyestri</p>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-blue-100">
              2026 Update
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input 
              type="text"
              placeholder="Kod və ya xidmət adı..."
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-md font-medium placeholder:text-slate-400"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-xl mx-auto px-5 pb-5 overflow-x-auto flex gap-2.5 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all duration-300 uppercase tracking-wider border ${
                activeTab === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-200 scale-105' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-xl mx-auto p-5 space-y-5">
        <div className="flex items-center justify-between text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] px-1">
          <span>Nəticələr: {results.length}</span>
          <span className="flex items-center gap-1.5 text-blue-400"><Zap size={12} /> Live Sync</span>
        </div>

        {results.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 border-l-[6px] border-l-blue-600 flex flex-col gap-4 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                {/* BLUE TAG: CODE NOW AT TOP */}
                <div className="flex items-center gap-1.5 self-start bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-100">
                  <Hash size={12} />
                  <span className="text-[11px] font-black uppercase leading-none">
                    {item["Prosedur / xəstəlik kodu"] || "Tətbiq Edilmir"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-1">
                  {item["Xidmət qrupu"]}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-2xl text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ChevronRight size={18} />
              </div>
            </div>

            <h3 className="text-slate-800 font-bold text-lg leading-[1.3] px-1">
              {item["Tibbi xidmətin adı"]}
            </h3>

            <div className="flex items-end justify-between border-t border-slate-50 pt-5 mt-2">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] px-1">Xidmət Tarifi</p>
                <div className="flex items-baseline gap-1.5">
                  {/* PRICE: BIG FOCUS AT BOTTOM */}
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">
                    {formatPrice(item["Tibbi xidmətin tarifi *"])}
                  </span>
                  {!formatPrice(item["Tibbi xidmətin tarifi *"]).includes("Müqavilə") && (
                    <span className="text-xs font-black text-slate-400 italic">AZN</span>
                  )}
                </div>
              </div>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-100">
                Detallar
              </button>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center py-24 px-10">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Search size={40} />
            </div>
            <h2 className="text-slate-900 font-black text-xl">Məlumat Tapılmadı</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Fərqli açar söz və ya kod yoxlayın.</p>
          </div>
        )}
      </main>
    </div>
  );
}
