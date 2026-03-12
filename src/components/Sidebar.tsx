'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  ArrowRightLeft, 
  FileSearch,
  LayoutDashboard,
  SearchCheck,
  Zap,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { name: 'Régimen Transparencia', icon: FileSearch, path: '/' },
  { name: 'Comparador de Tasas', icon: LayoutDashboard, path: '/comparar' },
  { name: 'Consulta Crediticia', icon: SearchCheck, path: '/consulta' },
  { name: 'Estadísticas Cambiarias', icon: ArrowRightLeft, path: '/cambiarias' },
  { name: 'Estadísticas Monetarias', icon: BarChart3, path: '/monetarias' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar sidebar al cambiar de ruta en móvil
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      <div className="p-8 mb-4">
        <Link href="/" className="flex flex-col items-center text-center group">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-slate-200/50 group-hover:scale-105 transition-transform duration-300 overflow-hidden border border-slate-100">
             <img src="/icon.png" alt="Logo OPEN BCRA" className="w-12 h-12 object-contain" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">OPEN</h2>
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tighter">BCRA</h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/' && pathname.startsWith('/banco') && pathname !== '/consulta' && pathname !== '/comparar' && pathname !== '/monetarias' && pathname !== '/cambiarias');
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                relative flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
              `}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                />
              )}
              <item.icon size={18} strokeWidth={2.5} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-slate-100 mt-auto">
         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            OPEN BCRA © 2026
         </div>
         <div className="mt-2 flex items-center justify-center gap-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black rounded-full border border-slate-200 uppercase tracking-tighter">
              v{process.env.APP_VERSION}
            </span>
         </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header (Solo visible en móviles/tablets) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[60] flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
            <img src="/icon.png" alt="Logo OPEN BCRA" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-display font-black text-lg text-slate-900 tracking-tighter">OPEN BCRA</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar (Persistente) */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col h-screen sticky top-0 shrink-0 shadow-sm z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-white z-[80] shadow-2xl flex flex-col"
            >
              <div className="flex justify-end p-4 border-b border-slate-50">
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-900">
                  <X size={24} />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}