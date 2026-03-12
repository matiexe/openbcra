'use client';

import { useState, useMemo } from 'react';
import { Search, Calendar, Landmark, DollarSign, X } from 'lucide-react';
import { getFlagUrl } from '@/data/flags';
import { motion, AnimatePresence } from 'framer-motion';

export default function CambiariasClient({ initialData, fecha }: { initialData: any[], fecha: string }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return initialData;
    const q = query.toLowerCase();
    return initialData.filter(c => 
      c.descripcion.toLowerCase().includes(q) || 
      c.codigoMoneda.toLowerCase().includes(q)
    );
  }, [query, initialData]);

  return (
    <div className="space-y-12">
      <div className="relative max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search size={22} />
          </div>
          <input 
            type="text"
            placeholder="Buscar por moneda o descripción (ej: Dólar, BRL)..."
            className="w-full bg-white border border-slate-200 text-slate-900 py-4 pl-14 pr-12 rounded-ux focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-500 transition-all font-bold shadow-xl shadow-slate-200/50"
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

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((c: any, i: number) => {
              const flag = getFlagUrl(c.codigoMoneda);
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={c.codigoMoneda} 
                  className="bg-white border border-slate-200 p-8 rounded-ux shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-14 h-10 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner">
                        {flag ? (
                          <img 
                            src={flag} 
                            alt={`Bandera ${c.codigoMoneda}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as any).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Landmark size={20} className="text-slate-300" />
                        )}
                     </div>
                     <div className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm">
                        {c.codigoMoneda}
                     </div>
                  </div>
                  
                  <h3 className="text-slate-900 font-black text-xl leading-tight mb-4 min-h-[3rem]">
                    {c.descripcion}
                  </h3>
                  
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                     <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cotización</p>
                        <p className="text-4xl font-display font-black text-slate-900 tracking-tighter tabular-nums">
                          ${c.tipoCotizacion.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </p>
                     </div>
                     <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 p-2 rounded-lg">
                        <Calendar size={12} /> Fecha: {fecha}
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-ux text-slate-400 font-medium italic">
           No se encontraron monedas que coincidan con su búsqueda.
        </div>
      )}
    </div>
  );
}
