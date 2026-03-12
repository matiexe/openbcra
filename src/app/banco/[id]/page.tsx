import { getPlazosFijos, getCajasAhorros, getTarjetasCredito, getPaquetesProductos, getPrestamosPersonales, getPrestamosPrendarios, getPrestamosHipotecarios, getEntidadNombre } from '@/services/bcraApi';
import { Landmark, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getBankLogo } from '@/data/logos';
import BancoDetailClient from '@/components/BancoDetailClient';

export default async function BancoPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const codigoEntidad = parseInt(id, 10);
  
  const nombreEntidad = await getEntidadNombre(codigoEntidad);
  const logo = getBankLogo(codigoEntidad);

  const [rawPlazos, rawCajas, rawTarjetas, rawPaquetes, rawPersonales, rawPrendarios, rawHipotecarios] = await Promise.all([
    getPlazosFijos(codigoEntidad),
    getCajasAhorros(codigoEntidad),
    getTarjetasCredito(codigoEntidad),
    getPaquetesProductos(codigoEntidad),
    getPrestamosPersonales(codigoEntidad),
    getPrestamosPrendarios(codigoEntidad),
    getPrestamosHipotecarios(codigoEntidad)
  ]);

  // Lógica de Deduplicación
  const deduplicate = (arr: any[], keys: string[]) => {
    return Array.from(new Map(arr.map(item => [
      keys.map(k => item[k]).join('-'), item
    ])).values());
  };

  const data = {
    plazosFijos: deduplicate(rawPlazos, ['tasaEfectivaAnualMinima', 'montoMinimoInvertir', 'plazoMinimoInvertirDias']),
    tarjetasCredito: deduplicate(rawTarjetas, ['comisionMaximaRenovacion', 'comisionMaximaAdministracionMantenimiento', 'tasaEfectivaAnualMaximaFinanciacion', 'segmento']),
    paquetesProductos: deduplicate(rawPaquetes, ['comisionMaximaMantenimiento', 'segmento']),
    prestamosPersonales: deduplicate(rawPersonales, ['tasaEfectivaAnualMaxima', 'montoMaximoOtorgable', 'plazoMaximoOtorgable']),
    prestamosPrendarios: deduplicate(rawPrendarios, ['tasaEfectivaAnualMaxima', 'montoMaximoOtorgable', 'plazoMaximoOtorgable']),
    prestamosHipotecarios: deduplicate(rawHipotecarios, ['tasaEfectivaAnualMaxima', 'montoMaximoOtorgable', 'plazoMaximoOtorgable']),
    cajasAhorros: deduplicate(rawCajas, ['procesoSimplificadoDebidaDiligencia', 'nombreCorto']),
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition-colors group">
         <ArrowLeft size={16} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" /> Volver
      </Link>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-8 rounded-ux border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
           <Landmark size={200} />
        </div>
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 p-3 shadow-inner">
               {logo ? <img src={logo} alt={nombreEntidad} className="w-full h-full object-contain" /> : <Landmark size={32} className="text-slate-300" />}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-wider mb-1">
                Entidad Financiera
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-black text-slate-900 tracking-tighter leading-tight">
                {nombreEntidad}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 relative z-10">
           <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
              <Landmark size={20} />
           </div>
           <div>
             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Código BCRA</p>
             <p className="text-2xl font-display font-bold text-slate-900 tabular-nums">{codigoEntidad.toString().padStart(3, '0')}</p>
           </div>
        </div>
      </header>

      <BancoDetailClient data={data} />
    </div>
  );
}