import React, { useState, useMemo } from 'react';
import services from './data.json';
import { Search, Stethoscope, ChevronRight, Hash, Zap, ActivitySquare } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Hamısı");

  // 1. Generate categories
  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s["Xidmət qrupu"]));
    return ["Hamısı", ...Array.from(cats).filter(Boolean).sort()];
  }, []);

  // 2. Search & Filter Logic
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
    return filtered.slice(0, 150);
  }, [query, activeTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl shadow-blue-200 shadow-lg text-white">
                <ActivitySquare size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-none">İTS Portal</h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Xidmətlər Zərfi 2026</p>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-100 uppercase">
              Reyestr
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text"
              placeholder="Xəstəlik kodu və ya ad yazın..."
              className="w-full bg-slate-100 border border-transparent rounded-2xl py-3.5 pl-11 pr-4 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-md"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-xl mx-auto px-4 pb-4 overflow-x-auto flex gap-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                activeTab === cat 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105' 
                : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
          <span>Nəticə: {results.length}</span>
          <span className="flex items-center gap-1 text-blue-500"><Zap size={10} /> Avtomatik Filtrləmə</span>
        </div>

        {results.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all border-l-4 border-l-blue-600 group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col gap-1">
                {/* Price is now a small tag at the top */}
                <span className="text-[10px] font-black text-green-600 bg-green-50 self-start px-2 py-0.5 rounded-lg uppercase tracking-tight border border-green-100">
                  Tarif: {item["Tibbi xidmətin tarifi *"]?.toString().includes("Hər") ? "Müqaviləli" : `${item["Tibbi xidmətin tarifi *"]} AZN`}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">{item["Xidmət qrupu"]}</span>
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
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Prosedur / Xəstəlik Kodu</p>
                <div className="flex items-baseline gap-1">
                   {/* CODE is now the big focus at the bottom */}
                  <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                    {item["Prosedur / xəstəlik kodu"] || "KODSUZ"}
                  </span>
                  <Hash size={14} className="text-blue-500 opacity-50" />
                </div>
              </div>
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[11px] font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
                Detallar
              </button>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center py-24 px-10">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <h2 className="text-slate-900 font-bold">Məlumat tapılmadı</h2>
            <p className="text-slate-400 text-sm mt-1">Kod və ya adı yenidən yoxlayın.</p>
          </div>
        )}
      </main>
    </div>
  );
}
