'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Percent, CreditCard, DollarSign, Search, ChevronDown, 
  PiggyBank, HandCoins, Box, Wallet, Car, Home, Info, 
  Briefcase, Clock, Ban, ShieldCheck, Zap, Calendar, UserCheck, Landmark
} from 'lucide-react';
import { 
  getPlazosFijos, getCajasAhorros, getTarjetasCredito, 
  getPaquetesProductos, getPrestamosPersonales, 
  getPrestamosPrendarios, getPrestamosHipotecarios, 
  getEntidades 
} from '@/services/bcraApi';
import { getBankLogo } from '@/data/logos';

type CategoryType = 'plazos' | 'tarjetas' | 'prestamos' | 'paquetes' | 'cuentas';

export default function ComparadorPage() {
  const [bank1, setBank1] = useState<number>(11);
  const [bank2, setBank2] = useState<number>(72);
  const [entidades, setEntidades] = useState<any[]>([]);
  const [data1, setData1] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('plazos');

  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  useEffect(() => {
    getEntidades().then(setEntidades);
  }, []);

  const filtered1 = useMemo(() => entidades.filter(e => e.nombre.toLowerCase().includes(search1.toLowerCase())), [search1, entidades]);
  const filtered2 = useMemo(() => entidades.filter(e => e.nombre.toLowerCase().includes(search2.toLowerCase())), [search2, entidades]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const fetchBankData = async (code: number) => {
          const [pf, ca, tc, pq, pp, pr, ph] = await Promise.all([
            getPlazosFijos(code),
            getCajasAhorros(code),
            getTarjetasCredito(code),
            getPaquetesProductos(code),
            getPrestamosPersonales(code),
            getPrestamosPrendarios(code),
            getPrestamosHipotecarios(code)
          ]);
          return { 
            pf: pf[0], 
            ca: ca[0], 
            tc: tc[0], 
            pq: pq[0], 
            pp: pp[0], 
            pr: pr[0], 
            ph: ph[0] 
          };
        };

        const [res1, res2] = await Promise.all([
          fetchBankData(bank1),
          fetchBankData(bank2)
        ]);
        setData1(res1);
        setData2(res2);
      } catch (error) { console.error(error); }
      setLoading(false);
    }
    fetchData();
  }, [bank1, bank2]);

  const Selector = ({ val, setVal, search, setSearch, open, setOpen, filtered, label }: any) => {
    const entidad = entidades.find(e => e.codigo === val);
    const logo = getBankLogo(val);
    
    return (
      <div className="relative flex-1 w-full">
        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">{label}</label>
        <button 
          onClick={() => setOpen(!open)}
          className="w-full bg-white border border-slate-200 rounded-ux p-4 flex items-center gap-4 font-bold text-slate-900 shadow-sm hover:border-blue-500/50 transition-all"
        >
          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center p-1.5 border border-slate-100 flex-shrink-0">
            {logo ? <img src={logo} alt="logo" className="w-full h-full object-contain" /> : <div className="text-slate-300"><Landmark size={20} /></div>}
          </div>
          <span className="truncate flex-1 text-left">{entidad?.nombre || 'Seleccionar entidad'}</span>
          <ChevronDown size={20} className={`text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <motion.div 
                initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-ux shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                  <Search size={16} className="text-slate-400" />
                  <input 
                    autoFocus
                    className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-900" 
                    placeholder="Buscar banco..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filtered.map((e: any) => (
                    <button
                      key={e.codigo}
                      className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors flex items-center gap-3 ${val === e.codigo ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                      onClick={() => { setVal(e.codigo); setOpen(false); setSearch(''); }}
                    >
                      <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[10px]">{e.codigo}</span>
                      {e.nombre}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const CategoryBtn = ({ id, label, icon: Icon }: { id: CategoryType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveCategory(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all border-2 flex-shrink-0 ${
        activeCategory === id 
          ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' 
          : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-20">
      <header className="space-y-4 px-4 md:px-0 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">Duelo de Entidades</div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 leading-tight">Comparador de Entidades.</h1>
      </header>

      <div className="px-4 md:px-0">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-end bg-slate-50/50 p-6 md:p-8 rounded-ux border border-slate-100">
          <Selector label="Entidad Principal" val={bank1} setVal={setBank1} search={search1} setSearch={setSearch1} open={open1} setOpen={setOpen1} filtered={filtered1} />
          <div className="h-12 flex items-center justify-center text-slate-300 font-black text-xl italic">VS</div>
          <Selector label="Entidad a Comparar" val={bank2} setVal={setBank2} search={search2} setSearch={setSearch2} open={open2} setOpen={setOpen2} filtered={filtered2} />
        </div>
      </div>

      <div className="sticky top-0 lg:top-0 bg-slate-50/80 backdrop-blur-md z-40 border-b border-slate-100 px-4 md:px-0">
        <div className="flex flex-nowrap overflow-x-auto gap-2 py-3 no-scrollbar">
          <CategoryBtn id="plazos" label="Plazos" icon={PiggyBank} />
          <CategoryBtn id="tarjetas" label="Tarjetas" icon={CreditCard} />
          <CategoryBtn id="prestamos" label="Préstamos" icon={HandCoins} />
          <CategoryBtn id="paquetes" label="Paquetes" icon={Box} />
          <CategoryBtn id="cuentas" label="Cuentas" icon={Wallet} />
        </div>
      </div>

      <div className="px-4 md:px-0">
        <div className="bg-white rounded-ux border border-slate-200 shadow-xl overflow-hidden relative mt-2">
          <AnimatePresence>
            {loading && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Consultando BCRA...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="divide-y divide-slate-100">
            {/* Header de la Tabla */}
            <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 sticky top-[65px] lg:top-[72px] z-30">
               <div className="col-span-4 p-6 hidden md:flex items-center font-black uppercase tracking-widest text-[10px] text-slate-400">Concepto</div>
               <div className="col-span-12 md:col-span-8 grid grid-cols-2">
                 <div className="p-4 md:p-6 flex items-center justify-center gap-3 border-r border-slate-200">
                    {getBankLogo(bank1) && <img src={getBankLogo(bank1)!} className="h-5 w-auto grayscale opacity-50" alt="logo" />}
                    <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px] text-slate-600 truncate">{entidades.find(e => e.codigo === bank1)?.nombre || 'Banco 1'}</span>
                 </div>
                 <div className="p-4 md:p-6 flex items-center justify-center gap-3">
                    {getBankLogo(bank2) && <img src={getBankLogo(bank2)!} className="h-5 w-auto grayscale opacity-50" alt="logo" />}
                    <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px] text-slate-600 truncate">{entidades.find(e => e.codigo === bank2)?.nombre || 'Banco 2'}</span>
                 </div>
               </div>
            </div>

            <div className="relative">
              {activeCategory === 'plazos' && (
                <>
                  <Row label="TEA (Tasa Efectiva Anual)" val1={data1?.pf?.tasaEfectivaAnualMinima} val2={data2?.pf?.tasaEfectivaAnualMinima} unit="%" icon={Percent} />
                  <Row label="Inversión Mínima" val1={data1?.pf?.montoMinimoInvertir} val2={data2?.pf?.montoMinimoInvertir} isPrice icon={DollarSign} isLowerBetter />
                  <Row label="Plazo Mínimo" val1={data1?.pf?.plazoMinimoInvertirDias} val2={data2?.pf?.plazoMinimoInvertirDias} unit=" días" icon={Clock} isLowerBetter />
                  <Row label="Canal de Constitución" val1={data1?.pf?.canalConstitucion} val2={data2?.pf?.canalConstitucion} icon={Zap} noBetter />
                </>
              )}

              {activeCategory === 'tarjetas' && (
                <>
                  <Row label="TEA Máx Financiación" val1={data1?.tc?.tasaEfectivaAnualMaximaFinanciacion} val2={data2?.tc?.tasaEfectivaAnualMaximaFinanciacion} unit="%" icon={Percent} isLowerBetter />
                  <Row label="TEA Adelanto Efectivo" val1={data1?.tc?.tasaEfectivaAnualMaximaAdelantoEfectivo} val2={data2?.tc?.tasaEfectivaAnualMaximaAdelantoEfectivo} unit="%" icon={Zap} isLowerBetter />
                  <Row label="Comisión Renovación" val1={data1?.tc?.comisionMaximaRenovacion} val2={data2?.tc?.comisionMaximaRenovacion} isPrice icon={CreditCard} isLowerBetter />
                  <Row label="Mantenimiento Mensual" val1={data1?.tc?.comisionMaximaAdministracionMantenimiento} val2={data2?.tc?.comisionMaximaAdministracionMantenimiento} isPrice icon={Wallet} isLowerBetter />
                  <Row label="Ingreso Mínimo Requerido" val1={data1?.tc?.ingresoMinimoMensual} val2={data2?.tc?.ingresoMinimoMensual} isPrice icon={Briefcase} isLowerBetter />
                </>
              )}

              {activeCategory === 'prestamos' && (
                <>
                  <div className="bg-slate-50/50 p-4 font-black uppercase text-[9px] tracking-[0.2em] text-blue-600 text-center">Línea de Préstamos Personales</div>
                  <Row label="TEA Máxima" val1={data1?.pp?.tasaEfectivaAnualMaxima} val2={data2?.pp?.tasaEfectivaAnualMaxima} unit="%" icon={Percent} isLowerBetter />
                  <Row label="Monto Máximo" val1={data1?.pp?.montoMaximoOtorgable} val2={data2?.pp?.montoMaximoOtorgable} isPrice icon={DollarSign} />
                  <Row label="Plazo Máximo" val1={data1?.pp?.plazoMaximoOtorgable} val2={data2?.pp?.plazoMaximoOtorgable} unit=" meses" icon={Calendar} />
                  <Row label="Cargo Cancelación" val1={data1?.pp?.cargoMaximoCancelacionAnticipada} val2={data2?.pp?.cargoMaximoCancelacionAnticipada} unit="%" icon={Ban} isLowerBetter />
                  <Row label="Relación Cuota/Ingreso" val1={data1?.pp?.relacionCuotaIngreso} val2={data2?.pp?.relacionCuotaIngreso} unit="%" icon={UserCheck} isLowerBetter />
                </>
              )}

              {activeCategory === 'paquetes' && (
                <>
                  <Row label="Mantenimiento Paquete" val1={data1?.pq?.comisionMaximaMantenimiento} val2={data2?.pq?.comisionMaximaMantenimiento} isPrice icon={Box} isLowerBetter />
                  <Row label="Ingreso Mínimo" val1={data1?.pq?.ingresoMinimoMensual} val2={data2?.pq?.ingresoMinimoMensual} isPrice icon={Briefcase} isLowerBetter />
                  <Row label="Antigüedad Laboral" val1={data1?.pq?.antiguedadLaboralMinimaMeses} val2={data2?.pq?.antiguedadLaboralMinimaMeses} unit=" meses" icon={Clock} isLowerBetter />
                  <Row label="Composición" val1={data1?.pq?.productosIntegrantes} val2={data2?.pq?.productosIntegrantes} icon={Info} noBetter isSmall />
                </>
              )}

              {activeCategory === 'cuentas' && (
                <>
                  <Row label="Moneda" val1={data1?.ca?.moneda} val2={data2?.ca?.moneda} icon={DollarSign} noBetter />
                  <Row label="Apertura Simplificada" val1={data1?.ca?.procesoSimplificadoDebidaDiligencia} val2={data2?.ca?.procesoSimplificadoDebidaDiligencia} icon={ShieldCheck} noBetter />
                  <Row label="Costo Mantenimiento" val1={data1?.ca?.costoMantenimiento} val2={data2?.ca?.costoMantenimiento} isPrice icon={Wallet} isLowerBetter />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, val1, val2, unit='', isPrice=false, isLowerBetter=false, icon:Icon, noBetter=false, isSmall=false }: any) => {
  const v1 = typeof val1 === 'number' ? val1 : parseFloat(val1) || 0;
  const v2 = typeof val2 === 'number' ? val2 : parseFloat(val2) || 0;
  
  const isV1Better = !noBetter && (isLowerBetter ? v1 < v2 : v1 > v2) && val1 !== undefined && val1 !== null && val2 !== undefined && val2 !== null;
  const isV2Better = !noBetter && (isLowerBetter ? v2 < v1 : v2 > v1) && val1 !== undefined && val1 !== null && val2 !== undefined && val2 !== null;
  
  const safeL = (v:any) => v != null && typeof v === 'number' ? v.toLocaleString('es-AR') : v;

  return (
    <div className="grid grid-cols-12 gap-0 items-stretch hover:bg-slate-50/50 transition-all group">
      <div className="col-span-12 md:col-span-4 p-4 md:p-6 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/30 md:bg-transparent">
        <div className="w-8 h-8 rounded-lg bg-white md:bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm md:shadow-none"><Icon size={16} /></div>
        <span className="font-display font-bold text-sm md:text-base text-slate-900 leading-tight">{label}</span>
      </div>
      
      <div className="col-span-12 md:col-span-8 grid grid-cols-2">
        <div className={`p-4 md:p-6 flex items-center justify-between border-r border-slate-100 transition-all ${isV1Better ? 'bg-blue-50/50' : ''}`}>
          <div className="flex flex-col min-w-0">
             <span className="text-[10px] md:hidden font-black uppercase text-slate-400 mb-1">Banco 1</span>
             <span className={`${isSmall ? 'text-[9px] md:text-[10px]' : 'text-sm md:text-xl'} font-display font-black text-slate-900 tabular-nums truncate`}>
               {val1 === undefined || val1 === null ? 'N/A' : (isPrice ? `$${safeL(val1)}` : `${safeL(val1)}${unit}`)}
             </span>
             {isV1Better && <span className="text-[7px] font-black uppercase text-blue-600 tracking-widest mt-1">Mejor</span>}
          </div>
          {isV1Better && <Check className="text-blue-600 flex-shrink-0" size={18} strokeWidth={3} />}
        </div>

        <div className={`p-4 md:p-6 flex items-center justify-between transition-all ${isV2Better ? 'bg-blue-50/50' : ''}`}>
          <div className="flex flex-col min-w-0">
             <span className="text-[10px] md:hidden font-black uppercase text-slate-400 mb-1">Banco 2</span>
             <span className={`${isSmall ? 'text-[9px] md:text-[10px]' : 'text-sm md:text-xl'} font-display font-black text-slate-900 tabular-nums truncate`}>
               {val2 === undefined || val2 === null ? 'N/A' : (isPrice ? `$${safeL(val2)}` : `${safeL(val2)}${unit}`)}
             </span>
             {isV2Better && <span className="text-[7px] font-black uppercase text-blue-600 tracking-widest mt-1">Mejor</span>}
          </div>
          {isV2Better && <Check className="text-blue-600 flex-shrink-0" size={18} strokeWidth={3} />}
        </div>
      </div>
    </div>
  );
};
