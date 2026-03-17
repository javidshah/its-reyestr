import React, { useState, useMemo } from 'react';
import services from './data.json';
import { Search, ChevronRight, ActivitySquare, Zap, Hash, Copy, Check } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Hamısı");
  const [copiedId, setCopiedId] = useState(null);

  // 1. Dynamic Category Generation from all 6000+ items
  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s["Xidmət qrupu"]));
    return ["Hamısı", ...Array.from(cats).filter(Boolean).sort()];
  }, []);

  // 2. UNLIMITED Search Logic (Optimized for speed)
  const results = useMemo(() => {
    let filtered = services;
    if (activeTab !== "Hamısı") {
      filtered = filtered.filter(s => s["Xidmət qrupu"] === activeTab);
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(s => 
        (s["Tibbi xidmətin adı"]?.toLowerCase().includes(q)) || 
        (s["Sıra №"]?.toString().includes(q))
      );
    }
    return filtered; // No .slice() here, showing all matches
  }, [query, activeTab]);

  const formatPrice = (price) => {
    const p = price?.toString() || "";
    return p.includes("Hər") || p.includes("təhkim") ? "Müqaviləli" : p;
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-20 text-slate-900">
      {/* Premium Sticky Header */}
      <header className="bg-white/95 border-b border-slate-100 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-100 text-white">
                <ActivitySquare size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none">İTS Portal</h1>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5 font-mono">Mərkəzi Reyestr</p>
              </div>
            </div>
            {/* Real-time Total Count */}
            <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
              {services.length} XİDMƏT
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-all" />
            </div>
            <input 
              type="text"
              placeholder="Sıra № və ya ad ilə axtar..."
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[22px] py-4.5 pl-12 pr-4 focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all outline-none text-md font-semibold shadow-inner"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="max-w-xl mx-auto px-6 pb-6 overflow-x-auto flex gap-3 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all duration-300 uppercase tracking-widest border-2 ${
                activeTab === cat 
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-200 scale-105' 
                : 'bg-white text-slate-400 border-slate-50 hover:border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main List Body */}
      <main className="max-w-xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-2">
          <span>Tapılan: {results.length}</span>
          <span className="flex items-center gap-1.5 text-green-500"><Zap size={12} fill="currentColor" /> Live Data</span>
        </div>

        <div className="grid gap-6">
          {results.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-[40px] p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 border-l-[8px] border-l-blue-600 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] px-1 mb-1 font-mono">Sıra №</p>
                  <button 
                    onClick={() => copyToClipboard(item["Sıra №"], idx)}
                    className="flex items-center gap-2 text-blue-600 px-1 hover:opacity-70 transition-opacity active:scale-95"
                  >
                    <Hash size={24} className="opacity-30 shrink-0" />
                    <span className="text-3xl font-black tracking-tighter leading-none">
                      {item["Sıra №"] || "N/A"}
                    </span>
                    {copiedId === idx ? <Check size={16} className="text-green-500" /> : <Copy size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />}
                  </button>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                  <ChevronRight size={20} />
                </div>
              </div>

              <div className="px-1 mb-6 relative z-10">
                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest bg-blue-50/50 px-2 py-1 rounded-md mb-3 inline-block">
                  {item["Xidmət qrupu"]}
                </span>
                <h3 className="text-slate-900 font-bold text-xl leading-[1.35] tracking-tight">
                  {item["Tibbi xidmətin adı"]}
                </h3>
              </div>

              <div className="flex items-end justify-between border-t border-slate-50 pt-6 relative z-10">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] px-1 mb-1 font-mono">Xidmət Tarifi</p>
                  <div className="flex items-baseline gap-2 px-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                      {formatPrice(item["Tibbi xidmətin tarifi *"])}
                    </span>
                    {!formatPrice(item["Tibbi xidmətin tarifi *"]).includes("Müqavilə") && (
                      <span className="text-xs font-black text-slate-400 italic tracking-tighter uppercase font-mono">AZN</span>
                    )}
                  </div>
                </div>
                <button className="bg-slate-900 text-white px-7 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-slate-200">
                  MƏLUMAT
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State View */}
        {results.length === 0 && (
          <div className="text-center py-32 px-10">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-100">
              <Search size={48} />
            </div>
            <h2 className="text-slate-900 font-black text-2xl tracking-tight leading-none">Nəticə Tapılmadı</h2>
            <p className="text-slate-400 text-sm mt-3 font-medium">Lütfən kodu və ya adı dəqiqləşdirin.</p>
          </div>
        )}
      </main>
    </div>
  );
}
