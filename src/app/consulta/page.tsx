'use client';

import { useState, useEffect } from 'react';
import { getDeuda, getChequesRechazados } from '@/services/bcraApi';
import { DeudorResponse } from '@/types/bcra';
import { Search, Wallet, ShieldAlert, AlertCircle, User, Landmark, Calendar, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsultaPage() {
  const [identificacion, setIdentificacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultDeuda, setResultDeuda] = useState<DeudorResponse | null>(null);
  const [resultCheques, setResultCheques] = useState<any>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'deuda' | 'cheques'>('deuda');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (identificacion.length < 11) return;
    
    setLoading(true);
    setError('');
    setResultDeuda(null);
    setResultCheques(null);
    
    try {
      // Intentar traer ambos en paralelo
      const [deuda, cheques] = await Promise.all([
        getDeuda(identificacion),
        getChequesRechazados(identificacion)
      ]);

      if (deuda) setResultDeuda(deuda);
      if (cheques) setResultCheques(cheques);

      if (!deuda && !cheques) {
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

  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl">
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
          Servicios OPEN BCRA
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight text-slate-900 leading-tight">
          Consulta Crediticia.
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
          Consulte situación de deudores y cheques rechazados en tiempo real.
        </p>
      </header>

      <section className="bg-white p-8 rounded-ux border border-slate-200 shadow-xl shadow-slate-200/50">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
              <User size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Ingrese CUIT / CUIL (11 dígitos)"
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
      </section>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-100 p-6 rounded-ux text-red-700 font-bold flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </motion.div>
        )}

        {(resultDeuda || resultCheques) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-slate-900 text-white p-10 rounded-ux shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Informe Consolidado</p>
                  <h2 className="text-4xl font-display font-black tracking-tight">{resultDeuda?.denominacion || 'Denominación no disponible'}</h2>
                  <div className="flex items-center gap-6 mt-4">
                    <p className="text-slate-400 font-bold">CUIT: {identificacion}</p>
                    {resultDeuda?.periodo && <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-blue-500/30">Periodo: {resultDeuda.periodo}</div>}
                  </div>
               </div>
            </div>

            <div className="flex gap-4 border-b border-slate-200">
               <button onClick={() => setTab('deuda')} className={`px-6 py-4 font-black text-xs uppercase tracking-widest transition-all border-b-2 ${tab === 'deuda' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>Situación de Deuda</button>
               <button onClick={() => setTab('cheques')} className={`px-6 py-4 font-black text-xs uppercase tracking-widest transition-all border-b-2 ${tab === 'cheques' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>Cheques Rechazados</button>
            </div>

            {tab === 'deuda' && (
              <div className="space-y-6">
                {resultDeuda?.deudas && resultDeuda.deudas.length > 0 ? (
                  <div className="bg-white border border-slate-200 rounded-ux shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Entidad</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Situación</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Monto ($)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {resultDeuda.deudas.map((d, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="px-8 py-6 font-bold text-slate-900">{d.entidad}</td>
                            <td className="px-8 py-6">
                               <span className={`px-3 py-1 rounded-lg border font-black text-[10px] ${d.situacion === 1 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                 {d.situacion} - {getSituacionLabel(d.situacion)}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right font-display font-black text-slate-900 text-lg">${d.monto.toLocaleString('es-AR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <div className="p-12 text-center text-slate-400 font-medium italic border-2 border-dashed border-slate-100 rounded-ux">No se registran deudas informadas en el periodo.</div>}
              </div>
            )}

            {tab === 'cheques' && (
              <div className="space-y-6">
                {resultCheques && resultCheques.length > 0 ? (
                   <div className="bg-white border border-slate-200 rounded-ux shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Nro Cheque</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Fecha Rechazo</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Causal</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Monto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {resultCheques.map((ch: any, i: number) => (
                            <tr key={i}>
                              <td className="px-8 py-6 font-bold">{ch.numeroCheque}</td>
                              <td className="px-8 py-6 text-slate-500">{ch.fechaRechazo}</td>
                              <td className="px-8 py-6"><span className="text-red-600 font-bold">{ch.causal}</span></td>
                              <td className="px-8 py-6 text-right font-black">${ch.monto.toLocaleString('es-AR')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                ) : <div className="p-12 text-center text-slate-400 font-medium italic border-2 border-dashed border-slate-100 rounded-ux">No se registran cheques rechazados asociados a este CUIT.</div>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
