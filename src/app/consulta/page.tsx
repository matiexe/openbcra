'use client';

import { useState } from 'react';
import { getDeuda, getChequesRechazados, getDeudaHistorica } from '@/services/bcraApi';
import { DeudorResponse, DeudaHistoricaResponse } from '@/types/bcra';
import { getBankLogoByName } from '@/data/logos';
import { 
  Search, 
  ShieldAlert, 
  AlertCircle, 
  User, 
  Landmark, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Info, 
  Clock, 
  History 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ApiStatusAlert from '@/components/ApiStatusAlert';

export default function ConsultaPage() {
  const [identificacion, setIdentificacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultDeuda, setResultDeuda] = useState<DeudorResponse | null>(null);
  const [resultCheques, setResultCheques] = useState<any[] | null>(null);
  const [resultHistorico, setResultHistorico] = useState<DeudaHistoricaResponse | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'deuda' | 'cheques' | 'historico'>('deuda');
  
  // Estados para filtros de historial
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (identificacion.length < 11) return;
    
    setLoading(true);
    setError('');
    setResultDeuda(null);
    setResultCheques(null);
    setResultHistorico(null);
    
    try {
      const [deuda, cheques, historico] = await Promise.all([
        getDeuda(identificacion),
        getChequesRechazados(identificacion),
        getDeudaHistorica(identificacion)
      ]);

      if (deuda) setResultDeuda(deuda);
      if (cheques) setResultCheques(cheques);
      if (historico) {
        setResultHistorico(historico);
        // Si no hay deuda actual pero sí hay historial, usamos la denominación del historial para el header
        if (!deuda && historico.denominacion) {
          setResultDeuda({
            identificacion: identificacion,
            denominacion: historico.denominacion,
            periodos: []
          });
        }
      }

      if (!deuda && !cheques && !historico) {
        setError('No se encontraron registros para la identificación ingresada.');
      }
    } catch (err) {
      setError('Error al consultar los servicios del BCRA.');
    } finally {
      setLoading(false);
    }
  };

  const getSituacionLabel = (s: number) => {
    const labels: Record<number, string> = {
      1: 'Normal', 2: 'Seguimiento Especial', 3: 'Problemas', 4: 'Alto Riesgo Insolvencia', 5: 'Irrecuperable', 6: 'Irrecuperable por Disp. Técnica'
    };
    return labels[s] || 'Desconocido';
  };

  const getSituacionColor = (s: number) => {
    if (s === 1) return 'bg-green-50 text-green-600 border-green-100';
    if (s === 2) return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-red-50 text-red-600 border-red-100';
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto pb-20">
      <header className="space-y-4 px-4 md:px-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
          Transparencia Central
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 leading-tight">
          Central de Deudores.
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl">
          Consulte la situación crediticia y cheques rechazados informados por las entidades del sistema financiero.
        </p>
      </header>

      <div className="px-4 md:px-0">
        <ApiStatusAlert serviceName="Central de Deudores" />
      </div>

      <section className="px-4 md:px-0">
        <div className="bg-white p-6 md:p-8 rounded-ux border border-slate-200 shadow-xl shadow-slate-200/40">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <User size={20} />
              </div>
              <input 
                type="text" 
                placeholder="CUIT / CUIL (11 dígitos)"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 py-4 pl-14 pr-6 rounded-ux focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-500 transition-all font-bold text-lg"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={11}
              />
            </div>
            <button 
              type="submit"
              disabled={loading || identificacion.length < 11}
              className="bg-blue-600 text-white px-10 py-4 rounded-ux font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search size={18} strokeWidth={3} />}
              Consultar
            </button>
          </form>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-4 md:mx-0 bg-red-50 border border-red-100 p-6 rounded-ux text-red-700 font-bold flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </motion.div>
        )}

        {(resultDeuda || resultCheques || resultHistorico) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 px-4 md:px-0">
            {/* Header del Informe */}
            <div className="bg-slate-900 text-white p-8 md:p-10 rounded-ux shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <Landmark size={240} />
               </div>
               <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Informe Consolidado BCRA</p>
                    <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight leading-tight">{resultDeuda?.denominacion || 'Denominación no disponible'}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-2 text-slate-400">
                       <FileText size={16} />
                       <span className="font-bold text-sm">CUIT: {identificacion}</span>
                    </div>
                    {resultDeuda?.periodos && resultDeuda.periodos.length > 0 && (
                      <div className="flex items-center gap-2 text-slate-400">
                         <Calendar size={16} />
                         <span className="font-bold text-sm uppercase">Periodo: {resultDeuda.periodos[0].periodo}</span>
                      </div>
                    )}
                  </div>
               </div>
            </div>

            {/* Tabs Responsivos */}
            <div className="flex gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar scroll-smooth">
               <button 
                 onClick={() => setTab('deuda')} 
                 className={`px-6 py-4 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${tab === 'deuda' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
               >
                 Situación de Deuda
               </button>
               <button 
                 onClick={() => setTab('historico')} 
                 className={`px-6 py-4 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${tab === 'historico' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
               >
                 Historial de Deuda
               </button>
               <button 
                 onClick={() => setTab('cheques')} 
                 className={`px-6 py-4 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${tab === 'cheques' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
               >
                 Cheques Rechazados
               </button>
            </div>

            {/* Contenido de Deuda */}
            {tab === 'deuda' && (
              <div className="space-y-6">
                {resultDeuda?.periodos && resultDeuda.periodos.length > 0 ? (
                  <div className="bg-white border border-slate-200 rounded-ux shadow-sm overflow-hidden">
                    {/* Desktop Table */}
                    <table className="w-full text-left hidden md:table">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Entidad</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Situación</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {resultDeuda.periodos[0].entidades.map((d, i) => {
                          const logo = getBankLogoByName(d.entidad);
                          return (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center p-1.5 shadow-sm group-hover:border-blue-100 transition-all">
                                       {logo ? (
                                         <img src={logo} alt={d.entidad} className="w-full h-full object-contain" />
                                       ) : (
                                         <Landmark size={20} className="text-slate-300" />
                                       )}
                                    </div>
                                    <span className="font-bold text-slate-900">{d.entidad}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`px-3 py-1 rounded-full border font-black text-[9px] uppercase tracking-wider ${getSituacionColor(d.situacion)}`}>
                                   {d.situacion} - {getSituacionLabel(d.situacion)}
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-right font-display font-black text-slate-900 text-xl">${d.monto.toLocaleString('es-AR')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Mobile List */}
                    <div className="md:hidden divide-y divide-slate-100">
                       {resultDeuda.periodos[0].entidades.map((d, i) => {
                         const logo = getBankLogoByName(d.entidad);
                         return (
                           <div key={i} className="p-6 space-y-4">
                              <div className="flex justify-between items-start gap-4">
                                 <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center p-1.5 shadow-sm shrink-0">
                                       {logo ? (
                                         <img src={logo} alt={d.entidad} className="w-full h-full object-contain" />
                                       ) : (
                                         <Landmark size={20} className="text-slate-300" />
                                       )}
                                    </div>
                                    <div className="min-w-0">
                                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Entidad</p>
                                       <p className="font-bold text-slate-900 leading-tight truncate">{d.entidad}</p>
                                    </div>
                                 </div>
                                 <div className="text-right shrink-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Monto</p>
                                    <p className="font-display font-black text-slate-900">${d.monto.toLocaleString('es-AR')}</p>
                                 </div>
                              </div>
                              <div className={`p-3 rounded-lg border text-center font-black text-[10px] uppercase tracking-widest ${getSituacionColor(d.situacion)}`}>
                                 Situación {d.situacion}: {getSituacionLabel(d.situacion)}
                              </div>
                           </div>
                         );
                       })}
                    </div>
                  </div>
                ) : (
                  <div className="p-16 text-center bg-white border-2 border-dashed border-slate-100 rounded-ux space-y-4">
                     <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 size={32} />
                     </div>
                     <div>
                        <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Sin Deudas Informadas</p>
                        <p className="text-slate-400 text-xs font-medium">No se registran saldos deudores asociados para el periodo consultado.</p>
                     </div>
                  </div>
                )}
              </div>
            )}

            {/* Contenido de Histórico */}
            {tab === 'historico' && (
              <div className="space-y-10">
                {resultHistorico?.periodos && resultHistorico.periodos.length > 0 ? (
                  <>
                    {/* Filtros */}
                    <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-ux border border-slate-200">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Año</label>
                        <select 
                          value={filterYear}
                          onChange={(e) => setFilterYear(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          <option value="all">Todos los años</option>
                          {Array.from(new Set(resultHistorico.periodos.map(p => p.periodo.substring(0, 4)))).map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Mes</label>
                        <select 
                          value={filterMonth}
                          onChange={(e) => setFilterMonth(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          <option value="all">Todos los meses</option>
                          {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {resultHistorico.periodos
                      .filter(p => (filterYear === 'all' || p.periodo.startsWith(filterYear)) && (filterMonth === 'all' || p.periodo.endsWith(filterMonth)))
                      .map((p, i) => {
                        // Formatear periodo de 202601 a 2026 01
                        const year = p.periodo.substring(0, 4);
                        const month = p.periodo.substring(4, 6);
                        const formattedPeriod = `${year} ${month}`;

                        return (
                          <div key={i} className="space-y-4">
                            <div className="flex items-center gap-3 px-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm border border-blue-200/50">
                                 <Calendar size={14} strokeWidth={3} />
                              </div>
                              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Periodo: {formattedPeriod}</h3>
                            </div>
                            
                            <div className="bg-white border border-slate-200 rounded-ux shadow-sm overflow-hidden">
                              {/* Desktop */}
                              <table className="w-full text-left hidden md:table">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Entidad</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Situación</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Monto</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {p.entidades.map((ent, j) => {
                                    const logo = getBankLogoByName(ent.entidad);
                                    return (
                                      <tr key={j} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                           <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 bg-white border border-slate-100 rounded flex items-center justify-center p-1 shadow-sm shrink-0">
                                                 {logo ? (
                                                   <img src={logo} alt={ent.entidad} className="w-full h-full object-contain" />
                                                 ) : (
                                                   <Landmark size={14} className="text-slate-300" />
                                                 )}
                                              </div>
                                              <span className="font-bold text-slate-900 text-sm">{ent.entidad}</span>
                                           </div>
                                        </td>
                                        <td className="px-8 py-5">
                                          <span className={`px-2.5 py-1 rounded-full border font-black text-[9px] uppercase tracking-wider ${getSituacionColor(ent.situacion)}`}>
                                            {ent.situacion} - {getSituacionLabel(ent.situacion)}
                                          </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-display font-black text-slate-900">${ent.monto.toLocaleString('es-AR')}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>

                              {/* Mobile */}
                              <div className="md:hidden divide-y divide-slate-100">
                                 {p.entidades.map((ent, j) => {
                                   const logo = getBankLogoByName(ent.entidad);
                                   return (
                                     <div key={j} className="p-5 space-y-3">
                                        <div className="flex justify-between items-start">
                                           <div className="flex items-center gap-3 min-w-0">
                                              <div className="w-8 h-8 bg-white border border-slate-100 rounded flex items-center justify-center p-1 shadow-sm shrink-0">
                                                 {logo ? (
                                                   <img src={logo} alt={ent.entidad} className="w-full h-full object-contain" />
                                                 ) : (
                                                   <Landmark size={14} className="text-slate-300" />
                                                 )}
                                              </div>
                                              <span className="font-bold text-slate-900 text-sm leading-tight truncate">{ent.entidad}</span>
                                           </div>
                                           <span className="font-display font-black text-slate-900 shrink-0 ml-2">${ent.monto.toLocaleString('es-AR')}</span>
                                        </div>
                                        <div className={`p-2 rounded-lg border text-center font-black text-[9px] uppercase tracking-widest ${getSituacionColor(ent.situacion)}`}>
                                           {ent.situacion} - {getSituacionLabel(ent.situacion)}
                                        </div>
                                     </div>
                                   );
                                 })}
                              </div>
                            </div>
                          </div>
                        );
                    })}
                    
                    {resultHistorico.periodos.filter(p => (filterYear === 'all' || p.periodo.startsWith(filterYear)) && (filterMonth === 'all' || p.periodo.endsWith(filterMonth))).length === 0 && (
                      <div className="p-16 text-center bg-white border-2 border-dashed border-slate-100 rounded-ux space-y-4">
                         <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                            <History size={32} />
                         </div>
                         <p className="text-slate-400 text-xs font-medium italic">No se encontraron periodos que coincidan con los filtros seleccionados.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-16 text-center bg-white border-2 border-dashed border-slate-100 rounded-ux space-y-4">
                     <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                        <History size={32} />
                     </div>
                     <div>
                        <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Sin Historial Disponible</p>
                        <p className="text-slate-400 text-xs font-medium">No se registran datos históricos asociados para esta identificación.</p>
                     </div>
                  </div>
                )}
              </div>
            )}

            {/* Contenido de Cheques */}
            {tab === 'cheques' && (
              <div className="space-y-6">
                {resultCheques && resultCheques.length > 0 ? (
                   <div className="bg-white border border-slate-200 rounded-ux shadow-sm overflow-hidden">
                      <table className="w-full text-left hidden md:table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Nro Cheque</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Fecha Rechazo</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Causal</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Monto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {resultCheques.map((ch: { numeroCheque: string; fechaRechazo: string; causal: string; monto: number }, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6 font-black text-slate-900">{ch.numeroCheque}</td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-2 text-slate-500 text-sm">
                                  <Clock size={14} />
                                  {ch.fechaRechazo}
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-md text-[10px] font-black uppercase tracking-wider">
                                  <ShieldAlert size={12} />
                                  {ch.causal}
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right font-display font-black text-slate-900 text-xl">${ch.monto.toLocaleString('es-AR')}</td>
                          </tr>
                        ))}
                        </tbody>
                        </table>

                        {/* Mobile Cheques List */}
                        <div className="md:hidden divide-y divide-slate-100">
                        {resultCheques.map((ch: { numeroCheque: string; fechaRechazo: string; causal: string; monto: number }, i: number) => (
                         <div key={i} className="p-6 space-y-4">

                              <div className="flex justify-between items-start">
                                 <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nro Cheque</p>
                                    <p className="font-black text-slate-900">{ch.numeroCheque}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monto</p>
                                    <p className="font-display font-black text-slate-900">${ch.monto.toLocaleString('es-AR')}</p>
                                 </div>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                 <div className="flex items-center gap-1.5 text-slate-500">
                                    <Clock size={14} />
                                    <span className="text-[10px] font-bold">{ch.fechaRechazo}</span>
                                 </div>
                                 <div className="px-2 py-1 bg-red-50 text-red-600 border border-red-100 rounded text-[9px] font-black uppercase tracking-tighter">
                                    {ch.causal}
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                ) : (
                  <div className="p-16 text-center bg-white border-2 border-dashed border-slate-100 rounded-ux space-y-4">
                     <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 size={32} />
                     </div>
                     <div>
                        <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Sin Cheques Rechazados</p>
                        <p className="text-slate-400 text-xs font-medium">No se registran incidentes de cheques rechazados para este CUIT.</p>
                     </div>
                  </div>
                )}
              </div>
            )}

            {/* Disclaimer Footer */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4">
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shrink-0 border border-slate-100 shadow-sm">
                  <Info size={20} />
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Nota Legal</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
                    La información visualizada es provista directamente por el Banco Central de la República Argentina. 
                    Este portal actúa únicamente como visualizador de datos abiertos y no almacena información crediticia privada.
                  </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
