'use client';

import { useState, useMemo } from 'react';
import { Search, Calendar, Landmark, X, TrendingUp, Star, Activity } from 'lucide-react';
import { getFlagUrl } from '@/data/flags';
import { motion, AnimatePresence } from 'framer-motion';

export default function CambiariasClient({ initialData, fecha }: { initialData: any[], fecha: string }) {
  const [query, setQuery] = useState('');

  // Divisas destacadas (Códigos BCRA comunes)
  const featuredCodes = ['DOL', 'EUR', 'BRL', 'CNY'];
  
  const featured = useMemo(() => 
    initialData.filter(c => featuredCodes.includes(c.codigoMoneda)),
  [initialData]);

  const filtered = useMemo(() => {
    if (!query) return initialData;
    const q = query.toLowerCase();
    return initialData.filter(c => 
      c.descripcion.toLowerCase().includes(q) || 
      c.codigoMoneda.toLowerCase().includes(q)
    );
  }, [query, initialData]);

  const DivisaCard = ({ c, isFeatured = false }: { c: any, isFeatured?: boolean }) => {
    const flag = getFlagUrl(c.codigoMoneda);
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`p-6 md:p-8 rounded-ux border transition-all group flex flex-col justify-between h-full ${
          isFeatured 
            ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' 
            : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md'
        }`}
      >
        <div>
          <div className="flex justify-between items-start mb-6">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border shadow-inner ${isFeatured ? 'bg-white/20 border-white/10' : 'bg-blue-50 border-slate-100 text-blue-600'}`}>
                {flag ? (
                  <img src={flag} alt={c.codigoMoneda} className="w-full h-full object-cover" />
                ) : (
                  <Activity size={20} />
                )}
             </div>
             <div className={`text-[9px] font-black uppercase px-2 py-1 rounded tracking-widest ${isFeatured ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {c.codigoMoneda}
             </div>
          </div>
          
          <h3 className={`font-black text-sm md:text-base leading-tight mb-4 min-h-[2.5rem] ${isFeatured ? 'text-white' : 'text-slate-900'}`}>
            {c.descripcion}
          </h3>
        </div>
        
        <div className={`space-y-4 pt-4 border-t ${isFeatured ? 'border-white/10' : 'border-slate-50'}`}>
           <div className="flex flex-col">
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isFeatured ? 'text-blue-100' : 'text-slate-400'}`}>
                Cotización Oficial
              </p>
              <p className={`text-2xl md:text-3xl font-display font-black tracking-tighter tabular-nums ${isFeatured ? 'text-white' : 'text-slate-900'}`}>
                ${c.tipoCotizacion.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </p>
           </div>
           <div className={`flex items-center justify-between text-[9px] font-black uppercase tracking-widest p-2 rounded-lg ${isFeatured ? 'bg-black/10 text-blue-100' : 'bg-slate-50 text-slate-400'}`}>
              <span className="flex items-center gap-1"><Calendar size={12} /> {fecha}</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded">BCRA</span>
           </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Featured Section */}
      {!query && featured.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-slate-400 px-1">
             <TrendingUp size={16} />
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Divisas Principales</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(c => <DivisaCard key={`feat-${c.codigoMoneda}`} c={c} isFeatured />)}
          </div>
        </section>
      )}

      {/* Search Section */}
      <div className="relative w-full mx-auto md:mx-0">
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text"
            placeholder="Buscar por moneda o descripción..."
            className="w-full bg-white border border-slate-200 text-slate-900 py-4 pl-14 pr-12 rounded-ux focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-500 transition-all font-bold shadow-xl shadow-slate-200/30"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-6">
        {query && (
          <div className="flex items-center gap-2 text-slate-400 px-2">
             <Search size={14} />
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Resultados de búsqueda</h2>
          </div>
        )}
        
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map(c => <DivisaCard key={c.codigoMoneda} c={c} />)}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-ux text-slate-400 font-bold italic">
             No se encontraron divisas para "{query}".
          </div>
        )}
      </div>
    </div>
  );
}
