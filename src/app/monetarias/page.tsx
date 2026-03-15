'use client';

import { useState, useEffect, useMemo } from 'react';
import { getPrincipalesVariables } from '@/services/bcraApi';
import { BarChart3, Calendar, Info, Search, ChevronDown, Landmark, TrendingUp, X, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ApiStatusAlert from '@/components/ApiStatusAlert';

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

  // Variables Fijas (Indicadores Clave)
  const fixedIds = [1, 4, 5]; // Reservas (1), TCO Minorista (4), TCO Mayorista (5)
  const fixedVars = useMemo(() => 
    variables.filter(v => fixedIds.includes(v.idVariable)), 
  [variables]);

  const otherVars = useMemo(() => 
    variables.filter(v => !fixedIds.includes(v.idVariable)),
  [variables]);

  const filteredDropdown = useMemo(() => 
    otherVars.filter(v => v.descripcion.toLowerCase().includes(searchQuery.toLowerCase())),
  [otherVars, searchQuery]);

  const selectedVar = useMemo(() => 
    variables.find(v => v.idVariable === selectedId),
  [variables, selectedId]);

  const extraVars = useMemo(() => 
    otherVars
      .filter(v => v.idVariable !== selectedId)
      .slice(0, 6),
  [otherVars, selectedId]);

  const formatValue = (val: any, unit: string) => {
    const v = typeof val === 'number' ? val : parseFloat(val) || 0;
    const isPercent = unit.includes('%') || unit.toLowerCase().includes('tasa');
    const isPrice = unit.toLowerCase().includes('pesos') || unit.toLowerCase().includes('dolar');
    
    let formatted = v.toLocaleString('es-AR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });

    if (isPercent) return `${formatted}%`;
    if (isPrice) return `$${formatted}`;
    return formatted;
  };

  const VariableCard = ({ v, highlight = false }: { v: any, highlight?: boolean }) => (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 md:p-8 rounded-ux border transition-all group flex flex-col justify-between h-full ${
        highlight 
          ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md'
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-6">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <Activity size={20} />
           </div>
           <div className={`text-[9px] font-black uppercase px-2 py-1 rounded tracking-widest ${highlight ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
              ID: {v.idVariable}
           </div>
        </div>
        <h3 className={`font-black text-sm md:text-base leading-tight mb-4 min-h-[2.5rem] ${highlight ? 'text-white' : 'text-slate-900'}`}>
          {v.descripcion}
        </h3>
      </div>
      
      <div className={`space-y-4 pt-4 border-t ${highlight ? 'border-white/10' : 'border-slate-50'}`}>
         <div className="flex flex-col">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${highlight ? 'text-blue-100' : 'text-slate-400'}`}>
              {v.unidadExpresion || 'Valor Actual'}
            </p>
            <p className={`text-2xl md:text-3xl font-display font-black tracking-tighter tabular-nums ${highlight ? 'text-white' : 'text-slate-900'}`}>
              {formatValue(v.ultValorInformado, v.unidadExpresion || '')}
            </p>
         </div>
         <div className={`flex items-center justify-between text-[9px] font-black uppercase tracking-widest p-2 rounded-lg ${highlight ? 'bg-black/10 text-blue-100' : 'bg-slate-50 text-slate-400'}`}>
            <span className="flex items-center gap-1"><Calendar size={12} /> {v.ultFechaInformada}</span>
            <span className="bg-white/10 px-1.5 py-0.5 rounded">{v.periodicidad === 'D' ? 'Diaria' : 'Mensual'}</span>
         </div>
      </div>
    </motion.div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
       <p className="font-black text-xs uppercase tracking-widest text-slate-400">Consultando BCRA...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto pb-20">
      <header className="space-y-4 px-4 md:px-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
          Series Históricas
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 leading-tight">
          Variables del Sistema.
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl">
          Evolución de los principales indicadores monetarios y financieros reportados por la Gerencia de Estadísticas.
        </p>
      </header>

      <ApiStatusAlert serviceName="Estadísticas Monetarias" />

      {/* Indicadores Clave */}
      <section className="space-y-6 px-4 md:px-0">
        <div className="flex items-center gap-2 text-slate-400">
           <Zap size={16} />
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Indicadores Clave</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fixedVars.map((v, i) => (
            <VariableCard key={i} v={v} highlight={true} />
          ))}
        </div>
      </section>

      {/* Selector de Variables */}
      <section className="px-4 md:px-0">
        <div className="bg-slate-100/50 p-6 md:p-10 rounded-ux border border-slate-200">
          <div className="max-w-2xl mx-auto text-center space-y-6">
             <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-display font-black text-slate-900">Analizar otra variable</h3>
                <p className="text-sm text-slate-500 font-medium italic">Seleccione una métrica específica de la base de datos oficial.</p>
             </div>
             
             <div className="relative">
                <button 
                  onClick={() => setIsOpen(!isDropdownOpen)}
                  className="w-full bg-white border border-slate-200 p-5 rounded-ux flex items-center justify-between font-bold text-slate-900 shadow-xl shadow-slate-200/50 hover:border-blue-500/50 transition-all"
                >
                  <span className="flex items-center gap-3 truncate pr-4">
                     <Search size={18} className="text-blue-600 flex-shrink-0" />
                     {selectedVar ? selectedVar.descripcion : 'Seleccione una variable...'}
                  </span>
                  <ChevronDown size={20} className={`text-slate-400 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                      <motion.div 
                        initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}
                        className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-ux shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                           <Search size={16} className="text-slate-400" />
                           <input 
                             autoFocus
                             className="w-full text-sm font-bold outline-none bg-transparent" 
                             placeholder="Filtrar variables..."
                             value={searchQuery}
                             onChange={e => setSearchQuery(e.target.value)}
                           />
                        </div>
                        <div className="max-h-72 overflow-y-auto no-scrollbar">
                          {filteredDropdown.map((v) => (
                            <button
                              key={v.idVariable}
                              className={`w-full text-left px-6 py-4 text-sm font-bold transition-colors border-b border-slate-50 last:border-0 ${selectedId === v.idVariable ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                              onClick={() => { setSelectedId(v.idVariable); setIsOpen(false); setSearchQuery(''); }}
                            >
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] opacity-50 tabular-nums w-6">#{v.idVariable}</span>
                                 {v.descripcion}
                              </div>
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
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-md mx-auto pt-10">
               <VariableCard v={selectedVar} highlight={false} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Otras Estadísticas */}
      <section className="space-y-8 px-4 md:px-0">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
           <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={20} /> Series Adicionales
           </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {extraVars.map((v, i) => (
            <VariableCard key={i} v={v} />
          ))}
        </div>
      </section>

      {/* Info Footer */}
      <div className="px-4 md:px-0">
        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-ux shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
              <Landmark size={240} />
           </div>
           <div className="relative z-10 flex items-start gap-4">
              <Info size={24} className="text-blue-400 shrink-0 mt-1" />
              <p className="text-sm md:text-base font-medium leading-relaxed italic text-slate-400">
                "La información estadística monetaria es suministrada por el Banco Central de la República Argentina. 
                Los valores reflejan el último estado informado al cierre de las operaciones bancarias del día hábil anterior."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
