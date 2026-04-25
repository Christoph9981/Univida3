
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Users, Calendar, FileText, Settings, 
  LogOut, Bell, Shield, Menu, MessageSquare, Database,
  ChevronDown, ChevronUp, WifiOff, Globe, Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Branding } from './Branding';

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
  external?: boolean;
  href?: string;
  isCollapsible?: boolean;
  isOpen?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick, external, href, isCollapsible, isOpen }) => {
  if (external) {
    return (
      <a 
        href={href}
        target="_blank"
        rel="noreferrer"
        className="w-full flex items-center gap-4 px-6 py-3 transition-all text-slate-500 hover:text-univida-green hover:bg-univida-green/5"
      >
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</span>
      </a>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-3 transition-all relative ${
        active 
          ? 'text-univida-green bg-univida-green/5' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-4">
        {active && <div className="absolute left-0 top-0 w-1 h-full bg-univida-green"></div>}
        <Icon className={`w-4 h-4 ${active ? 'text-univida-green' : 'text-slate-400'}`} />
        <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
      </div>
      {isCollapsible && (
        isOpen ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />
      )}
    </button>
  );
};

export const AdminLayout: React.FC<{ 
  children: React.ReactNode, 
  activeView: string, 
  setActiveView: (v: string) => void 
}> = ({ children, activeView, setActiveView }) => {
  const { currentUser, logout, isOffline } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    gestion: true,
    config: true,
    externo: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sections = [
    {
      id: 'gestion',
      label: 'Gestión de Salud',
      icon: LayoutDashboard,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'patients', label: 'Pacientes', icon: Users },
        { id: 'doctors', label: 'Doctores', icon: Stethoscope },
        { id: 'appointments', label: 'Citas', icon: Calendar },
        { id: 'analytics', label: 'Analíticas', icon: FileText },
        { id: 'messages', label: 'Mensajes', icon: MessageSquare },
      ]
    },
    {
      id: 'config',
      label: 'Configuración',
      icon: Settings,
      items: [
        { id: 'services', label: 'Servicios', icon: Stethoscope },
        { id: 'config', label: 'Sistema', icon: Settings },
      ]
    },
    {
      id: 'externo',
      label: 'Servicios Externos',
      icon: Globe,
      items: [
        { id: 'odoo', label: 'Panel Odoo', icon: Database, external: true, href: 'https://odoo.com' },
      ]
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex flex-col gap-1">
        <Branding />
        <div className="flex items-center gap-2 ml-[52px]">
          <p className="text-[9px] font-black text-univida-green uppercase tracking-widest">Backoffice</p>
          {isOffline && (
            <span className="flex items-center gap-1 text-[8px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter shadow-sm animate-pulse">
              <WifiOff className="w-2.5 h-2.5" /> Offline
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {sections.map(section => (
          <div key={section.id} className="mb-2">
            <SidebarItem 
              icon={section.icon} 
              label={section.label} 
              isCollapsible 
              isOpen={openSections[section.id]} 
              onClick={() => toggleSection(section.id)}
            />
            <AnimatePresence initial={false}>
              {openSections[section.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {section.items.map(item => (
                    <div key={item.id} className="pl-4">
                      <SidebarItem 
                        icon={item.icon}
                        label={item.label}
                        active={activeView === item.id}
                        onClick={() => {
                          setActiveView(item.id);
                          if (window.innerWidth < 1024) setIsSidebarOpen(false);
                        }}
                        external={item.external}
                        href={item.href}
                      />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-univida-dark font-black shadow-sm border border-slate-100">
              {currentUser?.nombre.charAt(0)}
           </div>
           <div className="overflow-hidden">
              <p className="text-xs font-black text-slate-800 truncate">{currentUser?.nombre}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Administrador</p>
           </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center border border-slate-100 justify-center gap-3 py-3 bg-white text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
        >
          <LogOut className="w-4 h-4" /> Finalizar Jornada
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-univida-dark/30 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col h-screen sticky top-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white/95 backdrop-blur-xl z-[60] lg:hidden border-r border-slate-200 shadow-2xl overflow-hidden"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 -ml-2 text-slate-400 hover:text-univida-green lg:hidden transition-colors"
             >
                <Menu className="w-6 h-6" />
             </button>
             <div className="hidden sm:block">
                <span className="text-[10px] font-black text-univida-green uppercase tracking-[0.2em] mb-0.5 block">Backoffice Activo</span>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Gestionando: {currentUser?.nombre}</p>
             </div>
             <div className="sm:hidden">
                <Branding />
             </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
             <button className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 hover:text-univida-green transition-all shadow-sm relative active:scale-95">
                <Bell className="w-5 h-5" />
                <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
             </button>
             <div className="w-10 h-10 md:w-12 md:h-12 bg-univida-green/10 rounded-xl flex items-center justify-center text-univida-green border border-univida-green/10 font-black">
                {currentUser?.nombre.charAt(0)}
             </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 overflow-y-auto w-full max-w-7xl mx-auto">
          <motion.div
             key={activeView}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
