'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  ArrowRightLeft, 
  FileSearch,
  LayoutDashboard,
  SearchCheck,
  Zap
} from 'lucide-react';

const menuItems = [
  { name: 'Estadísticas Monetarias', icon: BarChart3, path: '/monetarias' },
  { name: 'Estadísticas Cambiarias', icon: ArrowRightLeft, path: '/cambiarias' },
  { name: 'Régimen Transparencia', icon: FileSearch, path: '/' },
  { name: 'Comparador de Tasas', icon: LayoutDashboard, path: '/comparar' },
  { name: 'Consulta Crediticia', icon: SearchCheck, path: '/consulta' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 shadow-sm z-50">
      <div className="p-8 mb-4">
        <Link href="/" className="flex flex-col items-center text-center group">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
             <Zap size={28} fill="currentColor" />
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

      <div className="p-8 border-t border-slate-100">
         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            OPEN BCRA © 2026
         </div>
      </div>
    </aside>
  );
}
