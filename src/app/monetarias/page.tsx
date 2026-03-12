'use client';

import { useState, useEffect, useMemo } from 'react';
import { getPrincipalesVariables } from '@/services/bcraApi';
import { BarChart3, Calendar, Info, Search, ChevronDown, Landmark, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MonetariasPage() {
  const [variables, setVariables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getPrincipalesVariables().then(data => {
      setVariables(data || []);
      setLoading(false);
    });
  }, []);

  // Variables Fijas
  const fixedIds = [1, 4, 5]; // Reservas (1), TCO Minorista (4), TCO Mayorista (5)
  const fixedVars = useMemo(() => 
    variables.filter(v => fixedIds.includes(v.idVariable)), 
  [variables]);

  // Variables para el dropdown (excluyendo fijas)
  const otherVars = useMemo(() => 
    variables.filter(v => !fixedIds.includes(v.idVariable)),
  [variables]);

  const filteredDropdown = useMemo(() => 
    otherVars.filter(v => v.descripcion.toLowerCase().includes(searchQuery.toLowerCase())),
  [otherVars, searchQuery]);

  // La variable seleccionada por el usuario
  const selectedVar = useMemo(() => 
    variables.find(v => v.idVariable === selectedId),
  [variables, selectedId]);

  // Mostrar 6 adicionales (que no sean la seleccionada ni las fijas)
  const extraVars = useMemo(() => 
    otherVars
      .filter(v => v.idVariable !== selectedId)
      .slice(0, 6),
  [otherVars, selectedId]);

  const VariableCard = ({ v, highlight = false }: { v: any, highlight?: boolean }) => (
    <div className={`p-8 rounded-ux border transition-all group flex flex-col justify-between h-full ${
      highlight 
        ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' 
        : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md'
    }`}>
      <div>
        <div className="flex justify-between items-start mb-6">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <BarChart3 size={20} />
           </div>
           {highlight && (
             <div className="bg-white/20 text-[10px] font-black uppercase px-2 py-1 rounded text-white tracking-widest">
                Destacado
             </div>
           )}
        </div>
        <h3 className={`font-bold text-sm leading-tight mb-4 min-h-[2.5rem] ${highlight ? 'text-white' : 'text-slate-900'}`}>
          {v.descripcion}
        </h3>
      </div>
      
      <div className={`space-y-3 pt-4 border-t ${highlight ? 'border-white/10' : 'border-slate-50'}`}>
         <div className="flex justify-between items-end">
            <p className={`text-[10px] font-black uppercase tracking-widest ${highlight ? 'text-blue-100' : 'text-slate-400'}`}>
              {v.unidadExpresion || 'Valor'}
            </p>
            <p className={`text-3xl font-display font-black tracking-tighter tabular-nums ${highlight ? 'text-white' : 'text-slate-900'}`}>
              {v.ultValorInformado}
            </p>
         </div>
         <div className={`flex items-center justify-between text-[10px] font-black uppercase tracking-widest p-2 rounded-lg ${highlight ? 'bg-black/10 text-blue-100' : 'bg-slate-50 text-slate-400'}`}>
            <span className="flex items-center gap-1"><Calendar size={12} /> {v.ultFechaInformada}</span>
            <span>{v.periodicidad === 'D' ? 'Diaria' : 'Mensual'}</span>
         </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
       <p className="font-black text-xs uppercase tracking-widest text-slate-400">Cargando Series Monetarias...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-fadeIn">
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
          Series Monetarias v4.0
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 leading-tight">
          Variables del Sistema.
        </h1>
      </header>

      {/* FIXED TOP SECTION */}
      <section className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Indicadores Clave</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fixedVars.map((v, i) => (
            <VariableCard key={i} v={v} highlight={true} />
          ))}
        </div>
      </section>

      {/* SELECTOR / DROPDOWN SECTION */}
      <section className="space-y-6 bg-slate-50 p-8 rounded-ux border border-slate-200 shadow-inner">
        <div className="max-w-2xl mx-auto text-center space-y-4">
           <h3 className="text-xl font-display font-bold text-slate-900">Analizar otra variable</h3>
           <p className="text-sm text-slate-500 font-medium">Seleccione una métrica específica de la base de datos del BCRA para revisar su estado actual.</p>
           
           <div className="relative pt-4">
              <button 
                onClick={() => setIsOpen(!isDropdownOpen)}
                className="w-full bg-white border border-slate-200 p-5 rounded-ux flex items-center justify-between font-bold text-slate-900 shadow-xl"
              >
                <span className="flex items-center gap-3">
                   <Search size={18} className="text-blue-600" />
                   {selectedVar ? selectedVar.descripcion : 'Seleccione una variable para revisar...'}
                </span>
                <ChevronDown size={20} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <motion.div 
                      initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-ux shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                         <Search size={16} className="text-slate-400" />
                         <input 
                           autoFocus
                           className="w-full text-sm font-bold outline-none" 
                           placeholder="Filtrar por nombre..."
                           value={searchQuery}
                           onChange={e => setSearchQuery(e.target.value)}
                         />
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {filteredDropdown.map((v) => (
                          <button
                            key={v.idVariable}
                            className={`w-full text-left px-6 py-4 text-sm font-bold transition-colors border-b border-slate-50 last:border-0 ${selectedId === v.idVariable ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                            onClick={() => { setSelectedId(v.idVariable); setIsOpen(false); setSearchQuery(''); }}
                          >
                            {v.descripcion}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
           </div>
        </div>

        {selectedVar && (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-md mx-auto pt-8">
             <VariableCard v={selectedVar} />
          </motion.div>
        )}
      </section>

      {/* OTHER VARIABLES SECTION */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
           <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={20} /> Más Estadísticas
           </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {extraVars.map((v, i) => (
            <VariableCard key={i} v={v} />
          ))}
        </div>
      </section>

      <div className="bg-slate-900 text-white p-10 rounded-ux shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
            <Landmark size={200} />
         </div>
         <p className="text-sm font-medium leading-relaxed italic text-slate-400">
           "La información estadística diaria es suministrada por la Gerencia de Estadísticas Monetarias. Los datos reflejan el último estado informado por las entidades al cierre del mercado."
         </p>
      </div>
    </div>
  );
}
