'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart2, Home, ArrowRight, Menu } from 'lucide-react';
import { entidadesBancarias } from '../data/entidades';

export default function Navigation() {
  const [selectedBank, setSelectedBank] = useState('');
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBank) {
      router.push(`/banco/${selectedBank}`);
    }
  };

  const navItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Comparar', path: '/comparar', icon: BarChart2 },
  ];

  return (
    <nav className="sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl border border-white/40 shadow-xl overflow-hidden px-6 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg group-hover:bg-accent transition-colors duration-300">
              <span className="font-display font-bold text-xs uppercase tracking-tighter">B</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-primary hidden sm:block">
              Transparencia<span className="text-accent italic">BCRA</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
                onMouseEnter={() => setIsHovered(item.path)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <span className={`relative z-10 flex items-center gap-2 ${pathname === item.path ? 'text-primary' : 'text-text-muted hover:text-primary'}`}>
                  <item.icon size={16} />
                  {item.name}
                </span>
                {isHovered === item.path && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-primary/5 rounded-xl border border-primary/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                {pathname === item.path && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-1 left-4 right-4 h-0.5 bg-accent rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-sm">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
                <Search size={16} strokeWidth={2.5} />
              </div>
              <select 
                className="w-full bg-slate-100/50 border border-slate-200 text-sm py-2.5 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent appearance-none transition-all cursor-pointer font-medium"
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                <option value="">Seleccioná una entidad...</option>
                {entidadesBancarias.map((banco) => (
                  <option key={banco.codigo} value={banco.codigo}>
                    {banco.nombre}
                  </option>
                ))}
              </select>
              <button 
                type="submit" 
                className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-primary text-white rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-50"
                disabled={!selectedBank}
              >
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden text-primary">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
