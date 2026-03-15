'use client';

import { useState, useEffect, useCallback } from 'react';
import { getApiHealthStatus, EndpointStatus } from '@/services/monitorService';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  Server,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MonitorizacionPage() {
  const [statuses, setStatuses] = useState<EndpointStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getApiHealthStatus();
      setStatuses(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching API health status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const offlineCount = statuses.filter(s => s.status === 'offline').length;
  const onlineCount = statuses.filter(s => s.status === 'online').length;

  const StatusCard = ({ s }: { s: EndpointStatus }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-ux border transition-all flex flex-col justify-between h-full group ${
        s.status === 'online' 
          ? 'bg-white border-slate-200 hover:border-emerald-200 hover:shadow-emerald-500/5' 
          : 'bg-red-50/30 border-red-100 hover:border-red-200 shadow-sm'
      }`}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            s.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-100 text-red-600 animate-pulse'
          }`}>
            {s.status === 'online' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          </div>
          <div className={`text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest ${
            s.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}>
            {s.status}
          </div>
        </div>

        <div>
          <h3 className="font-black text-slate-900 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
            {s.name}
          </h3>
          <p className="text-[10px] font-mono text-slate-400 truncate max-w-full italic" title={s.url}>
            {s.url.replace('https://api.bcra.gob.ar', 'api.bcra.gob.ar')}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 space-y-3">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Clock size={12} /> Latencia
          </span>
          <span className={`tabular-nums ${
            s.latency < 500 ? 'text-emerald-600' : s.latency < 1000 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {s.latency}ms
          </span>
        </div>

        {s.error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="p-3 bg-red-100/50 rounded-lg border border-red-100"
          >
            <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1 flex items-center gap-1">
              <AlertTriangle size={10} /> Error Detectado
            </p>
            <p className="text-[11px] font-medium text-red-600 break-words italic">
              {s.error}
            </p>
          </motion.div>
        )}

        {!s.error && (
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
            <ShieldCheck size={12} /> Servicio Operativo
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
            Infraestructura
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 leading-tight">
            Monitor de API.
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Supervisión en tiempo real de la conectividad con los servicios del Banco Central de la República Argentina.
          </p>
        </div>
        
        <button 
          onClick={fetchStatus}
          disabled={loading}
          className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-4 rounded-ux font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group active:scale-95 shadow-xl shadow-slate-200"
        >
          <RefreshCw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          {loading ? 'Sincronizando...' : 'Refrescar Estado'}
        </button>
      </header>

      {/* Resumen de Estado */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-8 rounded-ux shadow-sm flex items-center gap-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${offlineCount === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <Activity size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado General</p>
            <h3 className="text-2xl font-display font-black text-slate-900">
              {offlineCount === 0 ? 'Sistemas Operativos' : `${offlineCount} Alertas`}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-ux shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Globe size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Endpoints</p>
            <h3 className="text-2xl font-display font-black text-slate-900">
              {onlineCount} / {statuses.length} <span className="text-sm font-bold text-slate-400 ml-1">Uptime</span>
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-ux shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Última Actualización</p>
            <h3 className="text-2xl font-display font-black text-slate-900 tabular-nums">
              {lastUpdated ? lastUpdated.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
            </h3>
          </div>
        </div>
      </section>

      {/* Alerta Crítica si hay servicios caídos */}
      <AnimatePresence>
        {offlineCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-600 text-white p-6 rounded-ux shadow-xl shadow-red-500/20 flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-black uppercase tracking-widest text-xs mb-1">Incidencia Detectada</h4>
              <p className="font-bold text-red-50">
                Se han detectado interrupciones en {offlineCount} endpoint{offlineCount > 1 ? 's' : ''}. 
                Esto puede afectar algunas funciones de consulta en tiempo real.
              </p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">
              Nivel de Alerta: Medio
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de Endpoints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && statuses.length === 0 ? (
          Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-ux animate-pulse" />
          ))
        ) : (
          statuses.map((s, i) => <StatusCard key={i} s={s} />)
        )}
      </div>

      {/* Documentación / Footer */}
      <div className="bg-slate-900 text-white p-10 rounded-ux shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
          <Server size={240} />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Info size={20} />
              </div>
              <h3 className="text-xl font-display font-black">Información de Red</h3>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed italic">
              "Este dashboard realiza solicitudes directas a la API del BCRA para validar la latencia y disponibilidad. 
              Si un servicio aparece como 'offline', puede deberse a mantenimiento del BCRA o límites de tasa de la API."
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-ux border border-white/10 flex flex-col justify-between">
            <p className="text-sm font-bold text-slate-300 mb-4">
              La infraestructura del BCRA utiliza diversos dominios para transparencia, deudores y estadísticas. 
              Este panel consolida el estado de todos ellos.
            </p>
            <a 
              href="https://www.bcra.gob.ar/BCRAyVos/Informacion_para_desarrolladores.asp" 
              target="_blank" 
              className="inline-flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-300 transition-colors"
            >
              Documentación Oficial <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
