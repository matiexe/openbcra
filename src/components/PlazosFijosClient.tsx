'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Landmark, DollarSign, Zap } from 'lucide-react';
import { getBankLogo } from '@/data/logos';
import { PlazoFijo } from '@/types/bcra';

interface PlazosFijosClientProps {
  initialData: PlazoFijo[];
}

type PFTipo = 'PESOS' | 'UVA' | 'OTROS';

export default function PlazosFijosClient({ initialData }: PlazosFijosClientProps) {
  const [filter, setFilter] = useState<PFTipo>('PESOS');

  const filteredData = useMemo(() => {
    // 1. Filtrado inicial por tipo y moneda
    const baseFiltered = initialData.filter(pf => {
      const desc = (pf.nombreCompleto || pf.nombreCorto || '').toUpperCase();
      const denom = (pf.denominacion || '').toUpperCase();
      
      if (filter === 'PESOS') {
        return !desc.includes('UVA') && !denom.includes('DOLAR') && !denom.includes('USD');
      }
      if (filter === 'UVA') {
        return desc.includes('UVA');
      }
      if (filter === 'OTROS') {
        return denom.includes('DOLAR') || denom.includes('USD');
      }
      return true;
    }).filter(pf => (pf.montoMinimoInvertir ?? 0) <= 1000000);

    // 2. Deduplicación por Banco (Manteniendo la mejor TEA)
    const bankMap = new Map<number, PlazoFijo>();
    
    baseFiltered.forEach(pf => {
      const current = bankMap.get(pf.codigoEntidad);
      if (!current || (pf.tasaEfectivaAnualMinima ?? 0) > (current.tasaEfectivaAnualMinima ?? 0)) {
        bankMap.set(pf.codigoEntidad, pf);
      }
    });

    // 3. Convertir a array, ordenar por TEA descendente y limitar resultados
    return Array.from(bankMap.values())
      .sort((a, b) => (b.tasaEfectivaAnualMinima ?? 0) - (a.tasaEfectivaAnualMinima ?? 0))
      .slice(0, 16);
  }, [initialData, filter]);

  const FilterBtn = ({ tipo, label, icon: Icon }: { tipo: PFTipo, label: string, icon: any }) => (
    <button
      onClick={() => setFilter(tipo)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
        filter === tipo 
          ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
          : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        <FilterBtn tipo="PESOS" label="En Pesos" icon={DollarSign} />
        <FilterBtn tipo="UVA" label="Ajustables UVA" icon={Zap} />
        <FilterBtn tipo="OTROS" label="Dólares" icon={Landmark} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.length > 0 ? filteredData.map((pf, idx) => {
          const logo = getBankLogo(pf.codigoEntidad);
          return (
            <Link 
              key={idx} 
              href={`/banco/${pf.codigoEntidad}`}
              className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-500/50 p-7 rounded-ux transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white transition-all overflow-hidden border border-transparent group-hover:border-slate-100">
                      {logo ? (
                        <img src={logo} alt={pf.descripcionEntidad} className="w-10 h-10 object-contain" />
                      ) : (
                        <Landmark size={24} />
                      )}
                   </div>
                   <div className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase px-2 py-1 rounded-md border border-blue-100">
                      TEA
                   </div>
                </div>
                <h3 className="text-slate-900 font-bold text-sm leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                  {pf.descripcionEntidad}
                </h3>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-6">
                  {pf.nombreCorto || 'Plazo Fijo'}
                </p>
              </div>
              
              <div className="flex items-end justify-between border-t border-slate-100 pt-6">
                 <span className="text-3xl font-display font-black text-slate-900 tracking-tighter">
                   {((pf.tasaEfectivaAnualMinima ?? 0) * 1).toFixed(1)}%
                 </span>
                 <ArrowUpRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          );
        }) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-ux text-slate-400 font-bold italic">
            No se encontraron plazos fijos para esta categoría.
          </div>
        )}
      </div>
    </div>
  );
}