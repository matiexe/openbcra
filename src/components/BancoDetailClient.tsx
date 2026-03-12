'use client';

import { useState } from 'react';
import { 
  CreditCard, PiggyBank, HandCoins, DollarSign, Percent, 
  Wallet, Car, Home, Info, UserCheck, Briefcase, Clock, 
  Ban, Box, CheckCircle2, ShieldCheck, Filter, Calendar,
  ShieldAlert, Landmark, Zap, MapPin, HelpCircle
} from 'lucide-react';
import { PlazoFijo, CajaAhorro, TarjetaCredito, Prestamo, PaqueteProducto } from '@/types/bcra';

interface BancoDetailClientProps {
  data: {
    plazosFijos: PlazoFijo[];
    cajasAhorros: CajaAhorro[];
    tarjetasCredito: TarjetaCredito[];
    paquetesProductos: PaqueteProducto[];
    prestamosPersonales: Prestamo[];
    prestamosPrendarios: Prestamo[];
    prestamosHipotecarios: Prestamo[];
  }
}

type FilterType = 'todos' | 'cuentas' | 'paquetes' | 'tarjetas' | 'prestamos' | 'plazos';

export default function BancoDetailClient({ data }: BancoDetailClientProps) {
  const [filter, setFilter] = useState<FilterType>('todos');

  const safeLocale = (val: any) => val != null ? val.toLocaleString('es-AR') : '0';

  const FilterButton = ({ type, label, icon: Icon }: { type: FilterType, label: string, icon: any }) => (
    <button
      onClick={() => setFilter(type)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
        filter === type 
          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
          : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );

  const CategoryContainer = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <section className="bg-white rounded-ux border border-slate-200 p-8 shadow-sm group animate-fadeIn mb-12">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
          <Icon size={20} strokeWidth={3} />
        </div>
        <h2 className="text-xl font-display font-bold text-slate-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  );

  // --- CARDS DETALLADAS ---

  const PrestamoCard = ({ p, icon: Icon, type }: { p: Prestamo, icon: any, type: string }) => (
    <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all shadow-sm group/item flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm">
              <Icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{type}</p>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{p.nombreCorto || p.denominacion || 'Préstamo'}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-display font-black text-slate-900 leading-none">{p.tasaEfectivaAnualMaxima?.toFixed(2)}%</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">TEA Máx</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-slate-400">Monto Máx</p>
            <p className="text-sm font-bold text-slate-800">${safeLocale(p.montoMaximoOtorgable)}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-black uppercase text-slate-400">Plazo Máx</p>
            <p className="text-sm font-bold text-slate-800">{p.plazoMaximoOtorgable} meses</p>
          </div>
          {p.costoFinancieroEfectivoTotalMaximo !== undefined && (
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-red-400">CFT Máximo</p>
              <p className="text-sm font-bold text-red-600">{p.costoFinancieroEfectivoTotalMaximo?.toFixed(2)}%</p>
            </div>
          )}
          {p.tipoTasa && (
            <div className="space-y-1 text-right">
              <p className="text-[9px] font-black uppercase text-slate-400">Tipo Tasa</p>
              <p className="text-sm font-bold text-slate-700">{p.tipoTasa}</p>
            </div>
          )}
        </div>

        {(p.ingresoMinimoMensual || p.antiguedadLaboralMinimaMeses || p.relacionCuotaIngreso) && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-slate-400">Ingreso</p>
              <p className="text-[10px] font-bold text-slate-700">${safeLocale(p.ingresoMinimoMensual)}</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-slate-400">Antig.</p>
              <p className="text-[10px] font-bold text-slate-700">{p.antiguedadLaboralMinimaMeses}m</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-slate-400">Cuota/Ing</p>
              <p className="text-[10px] font-bold text-slate-700">{p.relacionCuotaIngreso}%</p>
            </div>
          </div>
        )}
      </div>

      {p.cargoMaximoCancelacionAnticipada > 0 && (
        <div className="mt-6 flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100">
          <Ban size={12} className="text-amber-600" />
          <p className="text-[9px] font-bold text-amber-700 uppercase tracking-tight">
            Cancelación: {p.cargoMaximoCancelacionAnticipada}%
          </p>
        </div>
      )}
    </div>
  );

  const PlazoFijoCard = ({ pf }: { pf: PlazoFijo }) => (
    <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all shadow-sm flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm">
              <PiggyBank size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{pf.denominacion || 'Pesos'}</p>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{pf.nombreCorto || pf.nombreCompleto || 'Plazo Fijo'}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-display font-black text-slate-900 leading-none">{pf.tasaEfectivaAnualMinima?.toFixed(2)}%</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">TEA</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-slate-400">Inversión Mín</p>
            <p className="text-sm font-bold text-slate-800">${safeLocale(pf.montoMinimoInvertir)}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-black uppercase text-slate-400">Plazo Mín</p>
            <p className="text-sm font-bold text-slate-800">{pf.plazoMinimoInvertirDias} días</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Zap size={14} className={pf.canalConstitucion?.toLowerCase().includes('electr') ? 'text-green-500' : 'text-blue-500'} />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{pf.canalConstitucion || 'Sucursal'}</p>
           </div>
           {pf.territorioValidez && (
             <div className="flex items-center gap-1 text-slate-400">
               <MapPin size={12} />
               <p className="text-[9px] font-medium italic">{pf.territorioValidez}</p>
             </div>
           )}
        </div>
      </div>
      {pf.masInformacion && (
        <p className="mt-4 text-[9px] text-slate-400 leading-relaxed line-clamp-2 italic border-l-2 border-slate-200 pl-2">
          {pf.masInformacion}
        </p>
      )}
    </div>
  );

  const TarjetaCard = ({ tc }: { tc: TarjetaCredito }) => (
    <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all shadow-sm flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{tc.segmento || 'Crédito'}</p>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{tc.nombreCorto || tc.nombreCompleto || 'Tarjeta'}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-display font-black text-slate-900 leading-none">{tc.tasaEfectivaAnualMaximaFinanciacion?.toFixed(2)}%</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">TEA Finan.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-slate-400">Mantenimiento</p>
            <p className="text-sm font-bold text-slate-800">${safeLocale(tc.comisionMaximaAdministracionMantenimiento)}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-black uppercase text-slate-400">Renovación</p>
            <p className="text-sm font-bold text-slate-800">${safeLocale(tc.comisionMaximaRenovacion)}</p>
          </div>
          {tc.tasaEfectivaAnualMaximaAdelantoEfectivo > 0 && (
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-slate-400">Adelanto TEA</p>
              <p className="text-sm font-bold text-slate-700">{tc.tasaEfectivaAnualMaximaAdelantoEfectivo?.toFixed(2)}%</p>
            </div>
          )}
          {tc.ingresoMinimoMensual > 0 && (
            <div className="space-y-1 text-right">
              <p className="text-[9px] font-black uppercase text-slate-400">Ingreso Mín</p>
              <p className="text-sm font-bold text-slate-800">${safeLocale(tc.ingresoMinimoMensual)}</p>
            </div>
          )}
        </div>
      </div>
      {(tc.antiguedadLaboralMinimaMeses || tc.edadMaximaSolicitada) && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-around text-center">
          {tc.antiguedadLaboralMinimaMeses > 0 && (
            <div>
              <p className="text-[8px] font-black uppercase text-slate-400">Antigüedad</p>
              <p className="text-[10px] font-bold text-slate-700">{tc.antiguedadLaboralMinimaMeses}m</p>
            </div>
          )}
          {tc.edadMaximaSolicitada > 0 && (
            <div>
              <p className="text-[8px] font-black uppercase text-slate-400">Edad Máx</p>
              <p className="text-[10px] font-bold text-slate-700">{tc.edadMaximaSolicitada}a</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const PaqueteCard = ({ pq }: { pq: PaqueteProducto }) => (
    <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all shadow-sm flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm">
              <Box size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{pq.segmento || 'Paquete'}</p>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{pq.nombreCorto || pq.nombreCompleto || 'Combo'}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-display font-black text-slate-900 leading-none">${safeLocale(pq.comisionMaximaMantenimiento)}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Mensual</p>
          </div>
        </div>

        <div className="bg-white/50 p-3 rounded-lg border border-slate-100">
           <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Integrantes</p>
           <p className="text-[10px] text-slate-600 italic leading-snug line-clamp-3">{pq.productosIntegrantes || 'No especificados'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {pq.ingresoMinimoMensual > 0 && (
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-slate-400">Ingreso</p>
              <p className="text-sm font-bold text-slate-800">${safeLocale(pq.ingresoMinimoMensual)}</p>
            </div>
          )}
          {pq.beneficiarios && (
            <div className="space-y-1 text-right">
              <p className="text-[9px] font-black uppercase text-slate-400">Público</p>
              <p className="text-[10px] font-bold text-slate-700 truncate">{pq.beneficiarios}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CajaAhorroCard = ({ ca }: { ca: CajaAhorro }) => (
    <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm">
          <Wallet size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{ca.nombreCorto || 'Caja de Ahorro'}</p>
          <h3 className="text-lg font-black text-slate-900 leading-none mb-2">{ca.moneda || 'Pesos'}</h3>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-green-500" />
                <p className="text-[10px] font-bold text-slate-500">{ca.procesoSimplificadoDebidaDiligencia === 'SI' ? 'Simplificada' : 'Tradicional'}</p>
             </div>
             {ca.costoMantenimiento === 0 && (
               <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded">Gratis</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Botones de Filtro */}
      <div className="flex flex-wrap items-center gap-3 py-4 sticky top-0 bg-slate-50/80 backdrop-blur-md z-30">
        <FilterButton type="todos" label="Todos" icon={Filter} />
        <FilterButton type="cuentas" label="Cuentas" icon={Wallet} />
        <FilterButton type="paquetes" label="Paquetes" icon={Box} />
        <FilterButton type="tarjetas" label="Tarjetas" icon={CreditCard} />
        <FilterButton type="prestamos" label="Préstamos" icon={HandCoins} />
        <FilterButton type="plazos" label="Plazos Fijos" icon={PiggyBank} />
      </div>

      <div className="space-y-12">
        {/* Cuentas */}
        {(filter === 'todos' || filter === 'cuentas') && data.cajasAhorros.length > 0 && (
          <CategoryContainer title="Cuentas y Cajas de Ahorro" icon={Wallet}>
            {data.cajasAhorros.map((ca, idx) => <CajaAhorroCard key={`ca-${idx}`} ca={ca} />)}
          </CategoryContainer>
        )}

        {/* Paquetes */}
        {(filter === 'todos' || filter === 'paquetes') && data.paquetesProductos.length > 0 && (
          <CategoryContainer title="Paquetes de Productos" icon={Box}>
            {data.paquetesProductos.map((pq, idx) => <PaqueteCard key={`pq-${idx}`} pq={pq} />)}
          </CategoryContainer>
        )}

        {/* Tarjetas */}
        {(filter === 'todos' || filter === 'tarjetas') && data.tarjetasCredito.length > 0 && (
          <CategoryContainer title="Tarjetas de Crédito" icon={CreditCard}>
            {data.tarjetasCredito.map((tc, idx) => <TarjetaCard key={`tc-${idx}`} tc={tc} />)}
          </CategoryContainer>
        )}

        {/* Préstamos */}
        {(filter === 'todos' || filter === 'prestamos') && (data.prestamosPersonales.length > 0 || data.prestamosPrendarios.length > 0 || data.prestamosHipotecarios.length > 0) && (
          <CategoryContainer title="Oferta de Préstamos" icon={HandCoins}>
            {data.prestamosPersonales.map((p, idx) => <PrestamoCard key={`pers-${idx}`} p={p} icon={HandCoins} type="Personal" />)}
            {data.prestamosPrendarios.map((p, idx) => <PrestamoCard key={`prend-${idx}`} p={p} icon={Car} type="Prendario" />)}
            {data.prestamosHipotecarios.map((p, idx) => <PrestamoCard key={`hipo-${idx}`} p={p} icon={Home} type="Hipotecario" />)}
          </CategoryContainer>
        )}

        {/* Plazos Fijos */}
        {(filter === 'todos' || filter === 'plazos') && data.plazosFijos.length > 0 && (
          <CategoryContainer title="Plazos Fijos" icon={PiggyBank}>
            {data.plazosFijos.map((pf, idx) => <PlazoFijoCard key={`pf-${idx}`} pf={pf} />)}
          </CategoryContainer>
        )}
      </div>
    </div>
  );
}