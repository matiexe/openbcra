import { getPlazosFijos, getEntidades } from '@/services/bcraApi';
import { Landmark, ShieldCheck, Activity, TrendingUp } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import PlazosFijosClient from '@/components/PlazosFijosClient';

export default async function Home() {
  const [plazosFijos, entidades] = await Promise.all([
    getPlazosFijos(),
    getEntidades()
  ]);

  return (
    <div className="space-y-12 animate-fadeIn">
      <header className="space-y-6 w-full">
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 leading-tight">
          Régimen de Transparencia
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
          Portal OPEN BCRA: Acceda al informe consolidado de productos y tasas reportadas por las entidades financieras.
        </p>
        
        <div className="pt-4 w-full">
          <SearchBar entidades={entidades} />
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-blue-600 text-white p-8 rounded-ux shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform text-white">
               <Landmark size={80} fill="currentColor" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Entidades Habilitadas</p>
            <h3 className="text-4xl font-display font-black tracking-tighter">{entidades.length}</h3>
            <p className="text-xs font-medium mt-2 opacity-80 italic">Normativa BCRA vigente</p>
         </div>
         <div className="bg-white border border-slate-200 p-8 rounded-ux shadow-sm group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Activity size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Última Actualización</p>
            <h3 className="text-xl font-display font-bold text-slate-900">{new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</h3>
         </div>
         <div className="bg-white border border-slate-200 p-8 rounded-ux shadow-sm group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <ShieldCheck size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Datos Verificados</p>
            <h3 className="text-xl font-display font-bold text-slate-900">100% Oficial</h3>
         </div>
      </div>

      <section className="space-y-8 pt-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
           <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={20} /> Comparativa de Plazos Fijos (TEA)
           </h2>
        </div>

        <PlazosFijosClient initialData={plazosFijos} />
      </section>
    </div>
  );
}