'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ entidades = [] }: { entidades?: any[] }) {
  const [query, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const filteredEntities = useMemo(() => {
    if (!query) return entidades;
    return entidades.filter(e => 
      e.nombre.toLowerCase().includes(query.toLowerCase()) || 
      e.codigo.toString().includes(query)
    );
  }, [query, entidades]);

  return (
    <div className="relative w-full">
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <Search size={24} />
        </div>
        <input 
          type="text"
          placeholder="Busque cualquier entidad bancaria por nombre o código..."
          className="w-full bg-white border border-slate-200 text-slate-900 py-5 pl-16 pr-14 rounded-ux focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-500 transition-all font-bold text-lg shadow-xl shadow-slate-200/50"
          value={query}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-ux shadow-2xl z-20 max-h-[32rem] overflow-y-auto"
            >
              {filteredEntities.length > 0 ? (
                filteredEntities.map((entidad) => (
                  <button
                    key={entidad.codigo}
                    className="w-full text-left px-8 py-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between group"
                    onClick={() => {
                      router.push(`/banco/${entidad.codigo}`);
                      setIsOpen(false);
                    }}
                  >
                    <div>
                      <span className="block font-black text-slate-900 group-hover:text-blue-600 transition-colors text-lg tracking-tight">{entidad.nombre}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">Cód: {entidad.codigo}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-blue-500/20">
                       <ArrowRight size={18} strokeWidth={3} />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-12 text-center text-slate-500 italic font-medium">No se encontraron resultados para "{query}"</div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
