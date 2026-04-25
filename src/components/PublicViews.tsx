
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Phone, Search, Calendar, User, MessageSquare,
  Droplet, Shield, Stethoscope, ChevronRight, Clock,
  CheckCircle2, AlertCircle, Download, Printer, FileText,
  MapPin, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LabResult } from '../types';
import { Branding } from './Branding';
import { DOMINICAN_INSURANCES, TIME_SLOTS } from '../constants';
import { WifiOff, Send, Database, Calendar as CalendarIcon, CheckCircle, Smartphone, ChevronDown, Monitor } from 'lucide-react';

export const Navbar = ({ setView, currentView }: { setView: (v: any) => void, currentView?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout, config } = useApp();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Inicio', id: 'Home' },
    { label: 'Servicios', id: 'Services' },
    { label: 'Citas', id: 'Appointment' },
    { label: 'Analíticas', id: 'Analytics' },
    { label: 'Contacto', id: 'Contact' },
  ];

  const isHomeTop = currentView === 'Home' && !scrolled;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 flex items-center px-4 md:px-8 ${scrolled ? 'bg-white shadow-xl' : isHomeTop ? 'bg-transparent' : 'bg-white/80 backdrop-blur-lg'} ${scrolled ? 'h-16' : 'h-20'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setView('Home')}
          >
            <Branding light={isHomeTop} />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`text-sm font-black uppercase tracking-widest transition-all ${isHomeTop ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-univida-green'}`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex gap-4 ml-6">
              {currentUser ? (
                 <button 
                  onClick={() => setView(currentUser.role === 'ADMIN' ? 'Admin' : 'Dashboard')}
                  className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${isHomeTop ? 'bg-white text-univida-green hover:bg-univida-dark hover:text-white shadow-white/5' : 'bg-univida-green text-white hover:bg-univida-dark shadow-univida-green/20'}`}
                >
                  Mi Portal
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setView('Login')}
                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border transition-all rounded-xl ${isHomeTop ? 'border-white/30 text-white hover:bg-white/10' : 'border-univida-green text-univida-green hover:bg-univida-green/5'}`}
                  >
                    Registrarse
                  </button>
                  <button 
                    onClick={() => setView('Login')}
                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${isHomeTop ? 'bg-white text-univida-green hover:bg-univida-dark hover:text-white shadow-white/5' : 'bg-univida-green text-white hover:bg-univida-dark shadow-univida-green/20'}`}
                  >
                    Iniciar Sesión
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-2">
            {!currentUser && (
               <button 
                onClick={() => setView('Login')}
                className={`p-2 transition-colors ${isHomeTop ? 'text-white' : 'text-univida-green'}`}
              >
                <User className="w-6 h-6" />
              </button>
            )}
            <button 
              className={`p-2.5 rounded-2xl transition-all ${isOpen ? 'bg-slate-100 text-univida-green' : isHomeTop ? 'bg-white/10 text-white' : 'text-slate-600 hover:bg-slate-50'}`} 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[60] shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-center mb-12">
                   <Branding />
                   <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 bg-slate-50 rounded-xl text-slate-400"
                   >
                     <X className="w-5 h-5" />
                   </button>
                </div>

                <div className="flex flex-col gap-2 mb-auto">
                   {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setView(item.id); setIsOpen(false); }}
                      className="flex items-center justify-between p-4 rounded-2xl text-left text-sm font-black uppercase tracking-widest text-slate-600 hover:bg-univida-green hover:text-white transition-all group"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                <div className="mt-12 space-y-4">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">¿Necesitas ayuda?</p>
                    <a href={`tel:${config.telefono.replace(/-/g, '')}`} className="flex items-center gap-4 text-univida-dark font-black tracking-tight mb-2">
                       <div className="w-10 h-10 bg-univida-green/10 text-univida-green rounded-xl flex items-center justify-center">
                          <Phone className="w-4 h-4" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase">Llámanos ahora</span>
                          <span className="text-sm">{config.telefono}</span>
                       </div>
                    </a>
                  </div>

                  <button 
                    onClick={() => {
                      if (currentUser) {
                        setView(currentUser.role === 'ADMIN' ? 'Admin' : 'Dashboard');
                      } else {
                        setView('Login');
                      }
                      setIsOpen(false);
                    }}
                    className="w-full py-4 bg-univida-green text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-univida-green/20"
                  >
                    {currentUser ? 'Ir a mi Portal' : 'Acceso Pacientes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const Hero = ({ setView }: { setView: (v: any) => void }) => {
  const { config } = useApp();
  return (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-univida-green">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-univida-dark/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-0 items-stretch relative z-10 w-full py-10 lg:min-h-[600px]">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-center py-8 lg:py-12 lg:pr-12 lg:border-r border-white/10"
      >
        <span className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-4 w-fit backdrop-blur-sm border border-white/20">
          Centro de Atención Primaria
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-[1.1] mb-5 tracking-tighter drop-shadow-sm">
          {config.heroTitle || 'Cuidamos tu salud con atención cercana y confiable.'}
        </h1>
        <p className="text-base sm:text-lg text-white/80 mb-7 max-w-md leading-relaxed font-medium">
          {config.heroSubtitle || 'Tu bienestar es nuestra prioridad. Accede a servicios médicos de calidad en el corazón de Herrera.'}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-7">
          <div className="p-4 border border-white/20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center gap-3 transition-all hover:bg-white/20 active:scale-95 group cursor-pointer" onClick={() => setView('Appointment')}>
            <div className="p-2.5 bg-white rounded-xl text-univida-green shadow-lg shrink-0 group-hover:rotate-12 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-white text-[11px] tracking-tight uppercase mb-0.5 truncate">Agendar Cita</h4>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">Online 24/7</p>
            </div>
          </div>
          <div className="p-4 border border-white/20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center gap-3 transition-all hover:bg-white/20 active:scale-95 group cursor-pointer" onClick={() => setView('Analytics')}>
            <div className="p-2.5 bg-white rounded-xl text-univida-green shadow-lg shrink-0 group-hover:rotate-12 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-white text-[11px] tracking-tight uppercase mb-0.5 truncate">Analíticas</h4>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">Resultados</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Llámanos</span>
            <span className="text-xl sm:text-2xl font-black text-white tracking-tighter drop-shadow-sm">{config.telefono}</span>
          </div>
          <div className="w-px h-10 bg-white/20 hidden sm:block"></div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Ubicación</span>
            <span className="text-sm font-bold text-white/80 truncate max-w-[180px]">{config.direccion}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="p-4 sm:p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden"
      >
         <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl border border-slate-100 p-6 sm:p-8 lg:p-10 relative z-10 group transition-all duration-700 hover:shadow-univida-green/30 overflow-hidden">
            {config.heroImage && (
              <img src={config.heroImage} alt="Feature" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:scale-110 transition-transform duration-1000" />
            )}
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-14 h-14 sm:w-20 sm:h-20 bg-univida-green/10 rounded-2xl lg:rounded-3xl flex items-center justify-center text-univida-green transition-transform group-hover:scale-110">
                    <Shield className="w-7 h-7 sm:w-10 sm:h-10" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Centro Médico</p>
                    <p className="text-[10px] sm:text-xs font-black text-univida-green flex items-center gap-2 justify-end mt-1">
                       <span className="w-2 h-2 bg-univida-green rounded-full animate-pulse"></span>
                       ESTADO: OPERATIVO
                    </p>
                 </div>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-tight italic">Excelencia Médica con Rostro Humano.</h3>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                 En UNIVIDA el paciente es lo primero. Contamos con especialistas de primer nivel y la tecnología más avanzada del país.
              </p>
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[1,2,3,4,5].map(i => (
                       <div key={i} className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-xl">
                          <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Paciente" />
                       </div>
                    ))}
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-0.5">Confianza Total</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">+10k pacientes atendidos</p>
                 </div>
              </div>
            </div>
         </div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
      </motion.div>
    </div>
  </section>
  );
};

export const ServicesSection = () => {
   const { services } = useApp();
   const activeServices = services.filter(s => s.active);

   return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 sm:mb-20 gap-4 sm:gap-8">
            <div className="max-w-xl">
            <span className="text-[10px] font-black text-univida-green uppercase tracking-[0.2em] mb-4 block">Nuestras Especialidades</span>
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-tight">Servicios médicos diseñados para <span className="text-slate-400">tu bienestar.</span></h3>
            </div>
            <div className="h-px flex-1 bg-slate-100 mb-6 hidden lg:block"></div>
            <p className="text-sm font-bold text-slate-500 max-w-xs mb-3 uppercase tracking-tighter hidden md:block">Calidad y calidez humana en cada consulta local.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {activeServices.map((service, idx) => (
            <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-slate-50 p-5 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:border-univida-green overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-univida-green/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-univida-green mb-8 group-hover:bg-univida-green group-hover:text-white transition-all transform group-hover:scale-110">
                   {idx % 4 === 0 && <Stethoscope className="w-7 h-7" />}
                   {idx % 4 === 1 && <User className="w-7 h-7" />}
                   {idx % 4 === 2 && <Shield className="w-7 h-7" />}
                   {idx % 4 === 3 && <Droplet className="w-7 h-7" />}
                </div>
                <h4 className="font-black text-slate-800 text-lg mb-4 tracking-tight group-hover:text-univida-dark">{service.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {service.description}
                </p>
                <div className="mt-8 flex items-center gap-2 text-univida-green font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                   Conoce más <ChevronRight className="w-3 h-3" />
                </div>
            </motion.div>
            ))}
        </div>
        </div>
    </section>
   );
};

export const AppointmentFormSection = () => {
  const { addAppointment, users, registerPatient, services } = useApp();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
     nombre: '', apellido: '', cedula: '', seguro: DOMINICAN_INSURANCES[0],
     telefono: '', area: services[0]?.title || '', fecha: new Date().toISOString().split('T')[0], hora: TIME_SLOTS[0], motivo: ''
  });

  const isTimeSlotPassed = (slot: string, selectedDate: string) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    if (selectedDate > todayStr) return false;
    if (selectedDate < todayStr) return true;

    const [time, period] = slot.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0, 0);
    
    return slotDate < now;
  };

  useEffect(() => {
    if (isTimeSlotPassed(formData.hora, formData.fecha)) {
      const firstAvailable = TIME_SLOTS.find(slot => !isTimeSlotPassed(slot, formData.fecha));
      if (firstAvailable) {
        setFormData(prev => ({ ...prev, hora: firstAvailable }));
      }
    }
  }, [formData.fecha]);

  useEffect(() => {
    if (services.length > 0 && !formData.area) {
      setFormData(prev => ({ ...prev, area: services[0].title }));
    }
  }, [services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user exists, otherwise register
    const existingUser = users.find(u => u.cedula === formData.cedula);
    if (!existingUser) {
       await registerPatient({
          nombre: formData.nombre,
          apellido: formData.apellido,
          cedula: formData.cedula,
          telefono: formData.telefono,
          seguro: formData.seguro
       });
    }

    addAppointment({
       patientName: `${formData.nombre} ${formData.apellido}`,
       cedula: formData.cedula,
       area: formData.area,
       date: formData.fecha,
       time: formData.hora,
       seguro: formData.seguro,
       telefono: formData.telefono,
       reason: formData.motivo
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
    setFormData({
       nombre: '', apellido: '', cedula: '', seguro: DOMINICAN_INSURANCES[0],
       telefono: '', area: services[0]?.title || '', fecha: new Date().toISOString().split('T')[0], hora: TIME_SLOTS[0], motivo: ''
    });
  };

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
         <div className="grid lg:grid-cols-3 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="lg:col-span-1 bg-univida-dark p-8 sm:p-12 text-white flex flex-col justify-between">
               <div>
                  <span className="text-univida-green text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Agenda ahora</span>
                  <h2 className="text-3xl font-black mb-8 tracking-tight leading-tight">Tu cita médica en segundos.</h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-8">Completa el formulario y nuestro equipo procesará tu solicitud inmediatamente.</p>
                  
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-univida-green">
                           <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider">Confirmación Instantánea</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-univida-green">
                           <Clock className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider">Mínimo tiempo de espera</p>
                     </div>
                  </div>
               </div>

               <div className="mt-12 pt-8 border-t border-white/10">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Soporte</p>
                  <p className="text-lg font-black text-univida-green">809-555-0199</p>
               </div>
            </div>

            <div className="lg:col-span-2 p-6 sm:p-12">
               <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-8">
                  <div className="grid grid-cols-2 gap-4 sm:gap-8">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Nombre</label>
                        <input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4 focus:border-univida-green outline-none text-sm transition-all" placeholder="Juan" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Apellido</label>
                        <input required value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4 focus:border-univida-green outline-none text-sm transition-all" placeholder="Pérez" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Cédula</label>
                        <input required value={formData.cedula} onChange={e => setFormData({...formData, cedula: e.target.value})} type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4 focus:border-univida-green outline-none text-sm font-mono" placeholder="000-0000000-0" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Teléfono / WhatsApp</label>
                        <input required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} type="tel" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-4 focus:border-univida-green outline-none text-sm" placeholder="809-555-0199" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Seguro Médico</label>
                        <select 
                           value={formData.seguro}
                           onChange={e => setFormData({...formData, seguro: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:border-univida-green outline-none text-sm font-bold text-slate-600 appearance-none cursor-pointer">
                           <option value="">Selecciona tu ARS</option>
                           {DOMINICAN_INSURANCES.map(ins => (
                              <option key={ins} value={ins}>{ins}</option>
                           ))}
                        </select>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Especialidad</label>
                        <select 
                           value={formData.area}
                           onChange={e => setFormData({...formData, area: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:border-univida-green outline-none text-sm font-bold text-slate-600">
                           {services.filter(s => s.active).map(s => <option key={s.id}>{s.title}</option>)}
                        </select>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Fecha</label>
                        <input 
                           required 
                           value={formData.fecha}
                           min={new Date().toISOString().split('T')[0]}
                           onChange={e => setFormData({...formData, fecha: e.target.value})}
                           type="date" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:border-univida-green outline-none text-sm font-bold text-slate-600" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Hora Tentativa</label>
                        <select 
                           required 
                           value={formData.hora}
                           onChange={e => setFormData({...formData, hora: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:border-univida-green outline-none text-sm font-bold text-slate-600 appearance-none cursor-pointer">
                           {TIME_SLOTS.map(slot => (
                              <option key={slot} value={slot} disabled={isTimeSlotPassed(slot, formData.fecha)}>
                                 {slot} {isTimeSlotPassed(slot, formData.fecha) ? '(No disponible)' : ''}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-univida-green text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-univida-dark shadow-xl shadow-univida-green/20 transition-all">Confirmar mi Cita</button>
                  
                  {success && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4 text-univida-dark">
                       <CheckCircle2 className="w-6 h-6 shrink-0" />
                       <div className="text-xs font-bold uppercase tracking-widest">¡Cita registrada! Nos pondremos en contacto pronto por WhatsApp.</div>
                    </motion.div>
                  )}
               </form>
            </div>
         </div>
      </div>
    </section>
  );
};

export const AnalyticsSearch = () => {
    const { labResults, users } = useApp();
    const [cedula, setCedula] = useState('');
    const [code, setCode] = useState('');
    const [results, setResults] = useState<(LabResult & { patientSeguro?: string })[]>([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
        
        let found: (LabResult & { patientSeguro?: string })[] = [];
        
        // Priority 1: Search by Code
        if (code.trim()) {
           found = labResults.filter(r => r.code.toLowerCase() === code.toLowerCase().trim());
        }
        
        // Priority 2: Search by Cedula if no results found by code or code not provided
        if (found.length === 0 && cedula.trim()) {
           const cleanCedula = cedula.replace(/-/g, '').trim();
           found = labResults.filter(r => r.cedula.replace(/-/g, '') === cleanCedula);
        }

        // Enrich with patient info (especially seguro) if we found something
        const enriched = found.map(res => {
           const patient = users.find(u => u.cedula.replace(/-/g, '') === res.cedula.replace(/-/g, ''));
           return {
              ...res,
              patientSeguro: patient?.seguro
           };
        });

        setResults(enriched);
    };

    return (
        <section className="py-32 bg-white">
            <div className="max-w-4xl mx-auto px-8">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-black text-univida-green uppercase tracking-[0.3em] mb-4 block">Portal de Resultados</span>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Consulta tus Analíticas Online</h2>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl mb-12">
                   <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-6 items-end">
                      <div className="md:col-span-1">
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cédula</label>
                         <input 
                           value={cedula}
                           onChange={(e) => setCedula(e.target.value)}
                           type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:border-univida-green outline-none text-sm font-mono" placeholder="000-0000000-0" />
                      </div>
                      <div className="md:col-span-1">
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Código Analítica</label>
                         <input 
                           value={code}
                           onChange={(e) => setCode(e.target.value)}
                           type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:border-univida-green outline-none text-sm font-mono" placeholder="ANA-0000" />
                      </div>
                      <button type="submit" className="w-full py-4 bg-univida-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all">Buscar Resultados</button>
                   </form>
                </div>

                {searched && (
                   <div className="space-y-6">
                      {results.length > 0 ? (
                         results.map(res => (
                           <motion.div key={res.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-univida-green transition-all">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-univida-green shadow-sm group-hover:bg-univida-green group-hover:text-white transition-all">
                                    <Activity className="w-7 h-7" />
                                 </div>
                                 <div className="max-w-md">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.code}</p>
                                    <h4 className="text-xl font-black text-slate-800 tracking-tight mb-1">{res.type}</h4>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase">
                                       Paciente: <span className="text-slate-900">{res.patientName}</span>
                                    </p>
                                    {res.patientSeguro && (
                                       <p className="text-[10px] font-black text-univida-green uppercase mt-1 tracking-tight">
                                          Seguro: {res.patientSeguro}
                                       </p>
                                    )}
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">
                                       Sincronizado el {new Date(res.createdAt).toLocaleDateString()}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-6">
                                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    res.status === 'Disponible' ? 'bg-green-100 text-univida-dark' : 
                                    res.status === 'Entregado' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                                 }`}>
                                    {res.status}
                                 </span>
                                 <div className="flex gap-2">
                                    <button onClick={() => window.print()} className="p-3 bg-white text-slate-400 hover:text-univida-green rounded-xl border border-slate-100 shadow-sm transition-all"><Printer className="w-4 h-4" /></button>
                                    <button onClick={() => alert(`Visualizando resultado ${res.code} para ${res.patientName}`)} className="px-6 py-3 bg-univida-green text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-univida-green/10 transition-all hover:bg-univida-dark">Ver</button>
                                 </div>
                              </div>
                           </motion.div>
                         ))
                      ) : (
                         <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-slate-100 border-dashed">
                            <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-slate-800">No se encontraron resultados</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Verifica los datos e intenta de nuevo.</p>
                         </div>
                      )}
                   </div>
                )}
            </div>
        </section>
    );
};

export const ContactSection = () => {
    const { config } = useApp();
    return (
    <section className="py-16 sm:py-24 lg:py-32 bg-green-50/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-10 sm:gap-20 relative z-10">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="text-[10px] font-black text-univida-green uppercase tracking-[0.2em] mb-4 block">Ubícanos</span>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-8 sm:mb-12">Estamos en el corazón de <span className="text-slate-400">Herrera.</span></h2>
                
                <div className="space-y-12">
                   <div className="flex items-start gap-8 group">
                      <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-univida-green shadow-sm group-hover:bg-univida-green group-hover:text-white transition-all shrink-0">
                         <MapPin className="w-8 h-8" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dirección Física</p>
                         <p className="text-xl font-bold text-slate-800 leading-tight">{config.direccion}</p>
                         <p className="text-sm text-slate-500 mt-2 font-medium italic">Llegando a la Esquina Caliente, al lado de la ferretería.</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-8 group">
                      <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-univida-green shadow-sm group-hover:bg-univida-green group-hover:text-white transition-all shrink-0">
                         <Phone className="w-8 h-8" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Línea Salud</p>
                         <p className="text-3xl font-black text-univida-dark tracking-tighter whitespace-nowrap">{config.telefono}</p>
                         <div className="flex items-center gap-2 mt-2 text-univida-green">
                            <span className="w-2 h-2 bg-univida-green rounded-full animate-pulse"></span>
                            <p className="text-[10px] font-black uppercase tracking-widest">Soporte WhatsApp Activo</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-start gap-8 group">
                      <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-univida-green shadow-sm group-hover:bg-univida-green group-hover:text-white transition-all shrink-0">
                         <Clock className="w-8 h-8" />
                      </div>
                      <div className="grid grid-cols-2 gap-12 mt-1">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lunes a Viernes</p>
                            <p className="text-lg font-black text-slate-800 tracking-tight">{config.horarios.semana}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sábados</p>
                            <p className="text-lg font-black text-slate-800 tracking-tight">{config.horarios.sabado}</p>
                         </div>
                      </div>
                   </div>
                </div>
            </motion.div>

            <div className="bg-white p-6 rounded-[3.5rem] shadow-2xl border border-slate-100 min-h-[500px] flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-slate-50 opacity-50 group-hover:opacity-30 transition-opacity"></div>
               <div className="relative text-center p-12 bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 transform group-hover:scale-[1.02] transition-all duration-500">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-univida-green shadow-inner">
                     <MapPin className="w-10 h-10" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Interactive Maps</p>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.direccion)}`, '_blank')}
                    className="px-12 py-5 bg-univida-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-univida-green transition-all shadow-xl shadow-univida-dark/10"
                  >
                    Ver Cómo Llegar
                  </button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-univida-green/5 rounded-full -mr-16 -mt-16"></div>
            </div>
        </div>
    </section>
    );
};

export const HealthTipsSection = ({ setView }: { setView: (v: any) => void }) => {
  const tips = [
    { icon: '💧', title: 'Hidratación', desc: 'Bebe al menos 8 vasos de agua al día para mantener tus riñones sanos y tu energía alta.' },
    { icon: '🏃', title: 'Ejercicio', desc: 'Solo 30 minutos de caminata diaria reduce el riesgo cardiovascular hasta un 35%.' },
    { icon: '😴', title: 'Descanso', desc: 'Dormir 7-8 horas fortalece tu sistema inmune y mejora tu estado de ánimo.' },
    { icon: '🥗', title: 'Nutrición', desc: 'Incluye 5 porciones de frutas y verduras al día para prevenir enfermedades crónicas.' },
    { icon: '🧠', title: 'Salud Mental', desc: '10 minutos de meditación o respiración profunda reducen el estrés significativamente.' },
    { icon: '🩺', title: 'Chequeos', desc: 'Un chequeo médico anual detecta problemas a tiempo. Agenda el tuyo hoy en UNIVIDA.' },
  ];
  const [active, setActive] = useState(0);
  return (
    <section className="py-16 sm:py-24 bg-univida-dark overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-univida-green/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[10px] font-black text-univida-green uppercase tracking-[0.3em] mb-4 block">Vive Mejor</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">Consejos de Salud <span className="text-univida-green">para ti.</span></h2>
          <p className="text-white/50 text-sm mt-4 font-medium max-w-md mx-auto">Pequeños hábitos que marcan una gran diferencia en tu bienestar diario.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {tips.map((tip, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-2xl border text-center transition-all ${
                active === i
                  ? 'bg-univida-green border-univida-green text-white shadow-xl shadow-univida-green/20'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl block mb-2">{tip.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{tip.title}</span>
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto"
          >
            <span className="text-5xl sm:text-6xl block mb-6">{tips[active].icon}</span>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-4 tracking-tight">{tips[active].title}</h3>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed font-medium">{tips[active].desc}</p>
            <button
              onClick={() => setView('Appointment')}
              className="mt-8 px-8 py-4 bg-univida-green text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl shadow-univida-green/20 hover:bg-univida-dark transition-all active:scale-95"
            >
              Agendar Consulta
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export const AboutSection = () => {
  const { config } = useApp();
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#fafbfc] overflow-hidden relative">
        {/* Abstract background blobs - refined for light mode */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-univida-green opacity-[0.05] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-200 opacity-[0.3] rounded-full blur-[120px] translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row gap-10 sm:gap-24 items-center relative z-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="w-full md:w-1/2 relative group">
                <div className="rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative z-10 border-[12px] border-white transition-transform group-hover:scale-[1.02] duration-700">
                    <img 
                        src={config.aboutImage || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"} 
                        alt="UNIVIDA Medical Team" 
                        className="w-full h-[450px] md:h-[650px] object-cover contrast-[1.02] saturate-[1.05]"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                </div>
                
                {/* Floating Stats Card - Refined for light mode */}
                <div className="absolute -bottom-8 -left-8 bg-univida-green p-8 rounded-[2.5rem] shadow-2xl z-20 border-8 border-[#fafbfc] group-hover:-translate-y-2 transition-transform">
                   <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1 italic">Experiencia</p>
                   <p className="text-4xl font-black text-white tracking-tighter">15+ Años</p>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="w-full md:w-1/2">
                <span className="inline-block px-4 py-1.5 bg-green-50 text-univida-green text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8 border border-green-100">Nuestra Identidad</span>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 tracking-tighter leading-[1.1]">Atención que nace desde el <span className="text-univida-green italic underline decoration-univida-green/10 underline-offset-8">corazón humano.</span></h2>
                
                <div className="space-y-8 text-slate-500 text-lg leading-relaxed font-medium">
                    <p>{config.aboutText || 'UNIVIDA surge con el firme propósito de democratizar el acceso a salud de calidad. Somos un Centro de Atención Primaria que cree en la prevención y en el seguimiento cercano de cada paciente.'}</p>
                    
                    <div className="grid grid-cols-2 gap-10 pt-10 border-t border-slate-200">
                        <div className="space-y-3 font-sans">
                           <div className="w-12 h-1.5 bg-univida-green rounded-full"></div>
                           <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest italic">Personalización</h4>
                           <p className="text-xs leading-relaxed text-slate-400">Cada paciente es único y recibe un trato adaptado a sus necesidades reales.</p>
                        </div>
                        <div className="space-y-3 font-sans">
                           <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                           <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest italic">Profesionalismo</h4>
                           <p className="text-xs leading-relaxed text-slate-400">Expertos comprometidos con los más altos estándares médicos y éticos.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
  );
};

export const Footer = ({ setView }: { setView: (v: any) => void }) => {
  const { config } = useApp();
  return (
  <footer className="bg-univida-dark text-white pt-16 sm:pt-24 pb-12 overflow-hidden relative">
    <div className="absolute top-0 right-0 w-96 h-96 bg-univida-green opacity-[0.03] rounded-full -mr-48 -mt-48 blur-3xl"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-20 mb-12 sm:mb-20">
        <div className="md:col-span-1">
          <div className="mb-8">
             <Branding light />
          </div>
          <p className="text-white/40 text-sm leading-relaxed font-bold uppercase tracking-tighter">
            {config.institucional || 'Cuidamos tu salud con atención cercana y confiable. El centro de salud para toda tu familia en Herrera.'}
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-univida-green">Explorar</h4>
          <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-white/50">
            <li><button onClick={() => setView('Home')} className="hover:text-univida-green transition-all">Inicio</button></li>
            <li><button onClick={() => setView('Services')} className="hover:text-univida-green transition-all">Servicios</button></li>
            <li><button onClick={() => setView('Appointment')} className="hover:text-univida-green transition-all">Agenda Cita</button></li>
            <li><button onClick={() => setView('Analytics')} className="hover:text-univida-green transition-all">Resultados</button></li>
          </ul>
        </div>

        <div>
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-univida-green">Compañía</h4>
           <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-white/50">
            <li><a href="#" className="hover:text-univida-green transition-all">Sobre Nosotros</a></li>
            <li><a href="#" className="hover:text-univida-green transition-all">Equipo Médico</a></li>
            <li><a href="#" className="hover:text-univida-green transition-all">Preguntas Frecuentes</a></li>
            <li><a href="#" className="hover:text-univida-green transition-all">Blog de Salud</a></li>
          </ul>
        </div>

        <div>
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-univida-green">Contacto</h4>
           <ul className="space-y-6 text-xs font-black uppercase tracking-widest text-white/70">
            <li className="flex gap-4">
              <MapPin className="w-5 h-5 text-univida-green shrink-0" />
              <span className="leading-relaxed">{config.direccion}</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-univida-green shrink-0" />
              <span className="text-lg tracking-tight whitespace-nowrap">{config.telefono}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 sm:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] text-center md:text-left">
        <p>© 2026 {config.nombreCentro} Centro de Atención Primaria</p>
        <div className="flex gap-6 sm:gap-8">
           <a href="#" className="hover:text-univida-green transition-all">Privacidad</a>
           <a href="#" className="hover:text-univida-green transition-all">Términos</a>
           <a href="#" className="hover:text-univida-green transition-all">Seguridad</a>
        </div>
        <p>Hecho en República Dominicana</p>
      </div>
    </div>
  </footer>
  );
};
