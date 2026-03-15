'use client';

import { useState, useEffect } from 'react';
import { getApiHealthStatus, EndpointStatus } from '@/services/monitorService';
import { AlertCircle, Clock, Database, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiStatusAlertProps {
  serviceName: string;
}

export default function ApiStatusAlert({ serviceName }: ApiStatusAlertProps) {
  const [status, setStatus] = useState<EndpointStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const statuses = await getApiHealthStatus();
        const currentService = statuses.find(s => s.name.includes(serviceName) || serviceName.includes(s.name));
        setStatus(currentService || null);
      } catch (error) {
        console.error('Error checking service status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
    // Re-check cada 5 minutos
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [serviceName]);

  if (loading || !status || status.status === 'online') return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="mb-8"
    >
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">
              Servicio {status.name} con Interrupciones
            </h4>
            <p className="text-xs font-medium text-amber-700 leading-relaxed mt-0.5">
              La API oficial del BCRA no responde (Error {status.error?.includes('503') ? '503' : 'de Conexión'}). 
              Se están visualizando <strong>datos cacheados</strong> para garantizar la disponibilidad.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/50 px-4 py-2 rounded-lg border border-amber-100 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Origen de Datos</span>
            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1.5 uppercase">
              <Database size={10} /> Memoria de Sistema
            </span>
          </div>
          <div className="w-px h-8 bg-amber-200" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Estado</span>
            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1.5 uppercase">
              <Clock size={10} /> Modo Resiliencia
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
