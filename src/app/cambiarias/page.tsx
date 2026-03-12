import { getCotizaciones } from '@/services/bcraApi';
import { ArrowRightLeft } from 'lucide-react';
import CambiariasClient from '@/components/CambiariasClient';

export default async function CambiariasPage() {
  const res = await getCotizaciones();
  const cotizaciones = res?.detalle || [];
  const fechaActualizacion = res?.fecha || '';

  return (
    <div className="space-y-12 animate-fadeIn">
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
          Mercado de Divisas
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 leading-tight">
          Estadísticas Cambiarias.
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
          Cotizaciones oficiales de divisas y tipos de cambio reportados por el Banco Central de la República Argentina.
        </p>
      </header>

      <CambiariasClient initialData={cotizaciones} fecha={fechaActualizacion} />

      <div className="bg-slate-900 text-white p-10 rounded-ux shadow-2xl relative overflow-hidden">
         <div className="absolute -right-10 -bottom-10 opacity-10">
            <ArrowRightLeft size={200} />
         </div>
         <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl font-display font-black mb-4">Referencia de Cotización</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              "Las cotizaciones se expresan en pesos argentinos por unidad de moneda extranjera. Estos valores son referenciales y corresponden al cierre del Mercado Libre de Cambios."
            </p>
         </div>
      </div>
    </div>
  );
}
