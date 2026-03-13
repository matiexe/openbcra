import { getCotizaciones } from '@/services/bcraApi';
import { ArrowRightLeft, Info } from 'lucide-react';
import CambiariasClient from '@/components/CambiariasClient';

export default async function CambiariasPage() {
  const res = await getCotizaciones();
  const cotizaciones = res?.detalle || [];
  const fechaActualizacion = res?.fecha || '';

  return (
    <div className="space-y-10 animate-fadeIn max-w-[1600px] mx-auto pb-20">
      <header className="space-y-4 px-4 md:px-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
          Mercado de Divisas
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 leading-tight">
          Estadísticas Cambiarias.
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl">
          Cotizaciones oficiales de divisas y tipos de cambio reportados por el Banco Central de la República Argentina.
        </p>
      </header>

      <div className="px-4 md:px-0">
        <CambiariasClient initialData={cotizaciones} fecha={fechaActualizacion} />
      </div>

      <div className="px-4 md:px-0">
        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-ux shadow-2xl relative overflow-hidden group">
           <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <ArrowRightLeft size={240} />
           </div>
           <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex items-center gap-3 text-blue-400">
                 <Info size={24} />
                 <h3 className="text-xl md:text-2xl font-display font-black">Referencia de Cotización</h3>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed italic text-sm md:text-base">
                "Las cotizaciones se expresan en pesos argentinos por unidad de moneda extranjera. Estos valores son referenciales y corresponden al cierre del Mercado Libre de Cambios."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
