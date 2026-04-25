
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, FileText, User as UserIcon, LogOut, 
  Clock, CheckCircle, Activity, Download, Printer,
  ChevronRight, ArrowLeft, Home, XCircle, MessageSquare
} from 'lucide-react';
import { LabResult, User } from '../types';
import { Branding } from './Branding';

const MessageItem = ({ msg, currentUser, users, handleReply, markMessageAsRead }: { msg: any, currentUser: User, users: User[], handleReply: (msg: any) => void, markMessageAsRead: (id: string) => void, key?: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFromMe = msg.fromId === currentUser.id;
  const otherParty = isFromMe 
    ? users.find(u => u.id === msg.toId)
    : users.find(u => u.id === msg.fromId);

  return (
    <motion.div 
      layout
      className={`p-6 rounded-3xl border transition-all cursor-pointer ${
        msg.read ? 'bg-white border-slate-100 shadow-sm' : 'bg-green-50/50 border-univida-green/20 shadow-xl'
      }`}
      onClick={() => {
        setIsExpanded(!isExpanded);
        if (!msg.read && msg.toId === currentUser.id) {
          markMessageAsRead(msg.id);
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${msg.read ? 'bg-slate-50 text-slate-400' : 'bg-univida-green text-white shadow-lg'}`}>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className={`text-sm font-black ${msg.read ? 'text-slate-700' : 'text-univida-dark'}`}>{msg.title}</h4>
              {isFromMe && (
                <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">Enviado</span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {isFromMe 
                ? `Para: ${otherParty?.nombre || 'Admin'}` 
                : `DE: ${msg.fromName.split(' ')[0]} [${msg.fromRole}]`
              } • {new Date(msg.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          {!isFromMe && (
            <button 
              onClick={() => handleReply(msg)}
              className="px-4 py-1.5 border border-slate-100 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Responder
            </button>
          )}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
             <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 pl-14 border-t border-slate-50 mt-4">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const PatientDashboard = () => {
  const { 
    currentUser, 
    appointments, 
    labResults, 
    messages, 
    markMessageAsRead, 
    logout, 
    updateUser, 
    updateAppointmentStatus, 
    sendMessage, 
    users 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'resumen' | 'citas' | 'analiticas' | 'mensajes' | 'perfil'>('resumen');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    seguro: ''
  });

  const [showNew, setShowNew] = useState(false);
  const [newMessage, setNewMessage] = useState({ toId: '', title: '', content: '' });
  
  const admins = users.filter(u => u.role === 'ADMIN');
  const unreadMessagesCount = messages.filter(m => m.toId === currentUser.id && !m.read).length;

  const healthTips = [
    "Mantente hidratado: Bebe al menos 2 litros de agua al día para el buen funcionamiento de tus riñones.",
    "Actividad física: Caminar 30 minutos al día reduce el riesgo de enfermedades cardiovasculares.",
    "Sueño reparador: Duerme entre 7 y 8 horas diarias para regenerar tu sistema inmunológico.",
    "Alimentación balanceada: Prioriza las frutas y vegetales frescos en cada comida.",
    "Salud mental: Dedica al menos 10 minutos al día a la meditación o respiración profunda."
  ];

  const [currentTip] = useState(healthTips[Math.floor(Math.random() * healthTips.length)]);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        nombre: currentUser.nombre,
        apellido: currentUser.apellido,
        telefono: currentUser.telefono,
        seguro: currentUser.seguro
      });
    }
  }, [currentUser]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUser(currentUser.id, {
      ...currentUser,
      ...profileForm
    });
    setIsEditingProfile(false);
  };

  const handleCancelAppointment = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      updateAppointmentStatus(id, 'Cancelada');
    }
  };

  const handleViewReport = (res: LabResult) => {
    if (res.fileUrl) {
      try {
        const link = document.createElement('a');
        link.href = res.fileUrl;
        link.download = `Resultado_${res.type.replace(/\s+/g, '_')}_${res.code}.pdf`;
        if (res.fileUrl.startsWith('data:image')) {
            link.download = `Resultado_${res.type.replace(/\s+/g, '_')}_${res.code}.png`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
          window.open(res.fileUrl, '_blank');
      }
    } else {
      alert(`Visualizando informe para: ${res.type}\nCódigo: ${res.code}\nEstado: ${res.status}\nObservaciones: ${res.observaciones || 'No hay observaciones adicionales.'}`);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!newMessage.toId) {
      alert('Por favor selecciona un destinatario');
      return;
    }

    try {
      await sendMessage({
        fromId: currentUser.id,
        fromName: `${currentUser.nombre} ${currentUser.apellido}`,
        fromRole: 'Paciente',
        toId: newMessage.toId,
        title: newMessage.title,
        content: newMessage.content,
      });
      
      setShowNew(false);
      setNewMessage({ toId: '', title: '', content: '' });
      alert('Mensaje enviado al centro médico');
    } catch (error) {
      console.error("Error sending message:", error);
      alert('Error al enviar el mensaje. Por favor intenta de nuevo.');
    }
  };

  const handleReply = (msg: any) => {
    setNewMessage({
      toId: msg.fromId,
      title: `Re: ${msg.title}`,
      content: ''
    });
    setShowNew(true);
  };

  if (!currentUser) return null;

  const patientAppointments = appointments.filter(a => a.cedula === currentUser.cedula);
  const patientResults = labResults.filter(r => r.cedula === currentUser.cedula);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             <div className="scale-75 md:scale-100 origin-left">
              <Branding />
             </div>
             <div className="w-px h-8 bg-slate-100 mx-1 hidden sm:block"></div>
             <div className="hidden sm:block">
                <p className="text-[9px] font-black text-univida-green uppercase tracking-[0.2em] leading-none mb-0.5">Portal</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Digital</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-xs md:text-sm font-black text-slate-800">{currentUser.nombre}</p>
              <p className="text-[9px] md:text-[10px] font-bold text-univida-green uppercase tracking-widest">{currentUser.seguro}</p>
            </div>
            <button 
              onClick={logout}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs / Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-16 md:top-20 z-30 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-4 md:gap-8">
          {[
            { id: 'resumen', label: 'Inicio', icon: Home },
            { id: 'citas', label: 'Citas', icon: Calendar },
            { id: 'analiticas', label: 'Analíticas', icon: FileText },
            { id: 'mensajes', label: 'Chat', icon: MessageSquare, badge: unreadMessagesCount },
            { id: 'perfil', label: 'Perfil', icon: UserIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 md:py-5 border-b-2 transition-all whitespace-nowrap relative min-w-fit px-2 ${
                activeTab === tab.id 
                  ? 'border-univida-green text-univida-green translate-y-[1px]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
              {(tab as any).badge > 0 && (
                <span className="absolute top-2 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-univida-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-univida-green text-white text-[8px] font-black items-center justify-center">{ (tab as any).badge }</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 w-full">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === 'resumen' && (
            <div className="space-y-6 md:space-y-8">
              <div className="bg-univida-dark rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-univida-green/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-univida-green/5 rounded-full blur-3xl -ml-10 -mb-10"></div>
                
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="text-univida-green text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-4 block">Panel de Salud Digital</span>
                    <h1 className="text-2xl md:text-4xl font-black mb-2 md:mb-4 tracking-tight">Hola, {currentUser.nombre}</h1>
                    <p className="text-white/60 text-sm md:text-lg leading-relaxed">Tu bienestar es nuestra prioridad. Gestiona tus servicios desde aquí.</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 md:p-6 rounded-2xl md:rounded-3xl">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 bg-univida-green/20 text-univida-green rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/80">Consejo del Día</p>
                    </div>
                    <p className="text-xs md:text-sm font-medium italic text-white/70 leading-relaxed">
                      "{currentTip}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                <button 
                  onClick={() => setActiveTab('citas')}
                  className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-slate-100 shadow-sm text-left hover:border-univida-green transition-all active:scale-[0.98]"
                >
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 md:mb-6">Próxima Cita</h3>
                  {patientAppointments.find(a => a.status === 'Confirmada') ? (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-univida-green rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-black text-slate-900 leading-tight">{patientAppointments.find(a => a.status === 'Confirmada')?.area}</p>
                        <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-tight mt-0.5">{patientAppointments.find(a => a.status === 'Confirmada')?.date} • {patientAppointments.find(a => a.status === 'Confirmada')?.time}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No tienes citas confirmadas.</p>
                  )}
                </button>
                
                <button 
                  onClick={() => setActiveTab('analiticas')}
                  className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-slate-100 shadow-sm text-left hover:border-univida-green transition-all active:scale-[0.98]"
                >
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 md:mb-6">Resultados</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-black text-slate-900 leading-none">{patientResults.filter(r => r.status === 'Disponible').length}</p>
                      <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Nuevas Analíticas</p>
                    </div>
                  </div>
                </button>

                <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 md:mb-6">Mi Cobertura</h3>
                  <div className="flex justify-between items-center text-xs md:text-sm font-bold text-slate-600 mb-3">
                    <span className="opacity-60">Seguro Médico:</span>
                    <span className="text-univida-green uppercase text-[10px] font-black tracking-tight">{currentUser.seguro}</span>
                  </div>
                  <div className="h-px bg-slate-50 my-3"></div>
                  <div className="flex justify-between items-center text-xs md:text-sm font-bold text-slate-600">
                    <span className="opacity-60">Consultas Totales:</span>
                    <span className="text-slate-900">{patientAppointments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'citas' && (
             <div className="space-y-6">
               <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4 md:mb-8 gap-4">
                 <div>
                   <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Mis Citas</h2>
                   <p className="text-slate-500 text-xs md:text-sm">Consulta el historial de tus consultas médicas.</p>
                 </div>
                 <button 
                  onClick={() => setActiveTab('resumen')}
                  className="w-full md:w-auto px-6 py-4 bg-univida-green text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-univida-green/20 active:scale-95 transition-all"
                 >
                   + Nueva Cita
                 </button>
               </div>

               <div className="grid gap-4">
                 {patientAppointments.map(apt => (
                   <div key={apt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-univida-green shrink-0 group-hover:bg-univida-green group-hover:text-white transition-colors">
                           <Calendar className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-base font-bold text-slate-900 tracking-tight truncate">{apt.area}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{apt.date} • {apt.time}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                           apt.status === 'Confirmada' ? 'bg-green-50 text-univida-green border-green-100' : 
                           apt.status === 'Pendiente' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                           apt.status === 'Completada' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                           'bg-red-50 text-red-600 border-red-100'
                        }`}>
                           {apt.status}
                        </span>
                        <div className="flex items-center gap-2">
                           <div className="text-right hidden xs:block">
                              <p className="text-[8px] font-black text-slate-400 uppercase leading-none">ARS</p>
                              <p className="text-[10px] font-bold text-slate-600 leading-none mt-1">{apt.seguro}</p>
                           </div>
                           {['Pendiente', 'Confirmada'].includes(apt.status) && (
                             <button 
                               onClick={() => handleCancelAppointment(apt.id)}
                               className="p-2 text-slate-300 hover:text-red-500 transition-all shrink-0 active:scale-90"
                             >
                               <XCircle className="w-5 h-5" />
                             </button>
                           )}
                        </div>
                     </div>
                   </div>
                 ))}
                 {patientAppointments.length === 0 && (
                   <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                     <Calendar className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No hay citas registradas</p>
                   </div>
                 )}
               </div>
             </div>
          )}

          {activeTab === 'analiticas' && (
            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Mis Analíticas</h2>
                <p className="text-slate-500 text-xs md:text-sm">Resultados de laboratorio disponibles para descarga.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {patientResults.map((res, index) => (
                  <motion.div 
                    key={res.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-slate-100 shadow-sm group hover:border-univida-green transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 text-univida-green rounded-xl flex items-center justify-center group-hover:bg-univida-green group-hover:text-white transition-all shadow-inner shrink-0">
                          <Activity className="w-5 h-5 md:w-6 md:h-6" />
                       </div>
                       <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                         res.status === 'Disponible' 
                           ? 'bg-green-50 text-univida-green border-green-100' 
                           : 'bg-blue-50 text-blue-600 border-blue-100'
                       }`}>
                         {res.status}
                       </span>
                    </div>
                    <div className="space-y-1 mb-6">
                      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.code}</p>
                      <h4 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight">{res.type}</h4>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6 p-2.5 bg-slate-50/50 rounded-xl border border-slate-100/50">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fecha: {res.date}</p>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleViewReport(res)} 
                         className="flex-1 py-4 bg-univida-green text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-univida-dark transition-all shadow-lg shadow-univida-green/10 active:scale-95"
                       >
                         {res.fileUrl ? 'Descargar' : 'Ver Detalles'}
                       </button>
                    </div>
                  </motion.div>
                ))}
                
                {patientResults.length === 0 && (
                  <div className="sm:col-span-2 lg:col-span-3 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <FileText className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No hay resultados disponibles</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'mensajes' && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Mensajería</h2>
                  <p className="text-slate-500 text-xs md:text-sm">Comunícate directamente con el centro.</p>
                </div>
                <button 
                  onClick={() => {
                    setNewMessage({ toId: admins[0]?.id || '', title: 'Consulta', content: '' });
                    setShowNew(true);
                  }}
                  className="w-full sm:w-auto px-6 py-4 bg-univida-green text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-univida-green/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" /> Nuevo Mensaje
                </button>
              </div>

              {showNew && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-slate-200 shadow-2xl">
                  <form onSubmit={handleSend} className="space-y-4 md:space-y-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-[10px] font-black text-univida-dark uppercase tracking-widest">Redactar</h3>
                      <button type="button" onClick={() => setShowNew(false)} className="text-slate-400 hover:text-red-500 transition-all p-2"><XCircle className="w-6 h-6" /></button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Destinatario</label>
                        <select 
                          required 
                          value={newMessage.toId} 
                          onChange={e => setNewMessage({...newMessage, toId: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green appearance-none cursor-pointer"
                        >
                          <option value="">Seleccionar...</option>
                          {admins.map(a => (
                            <option key={a.id} value={a.id}>{a.nombre} - {a.position || 'Admin'}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Asunto</label>
                        <input 
                          required
                          type="text"
                          value={newMessage.title}
                          onChange={e => setNewMessage({...newMessage, title: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green"
                          placeholder="Título del mensaje"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Contenido</label>
                      <textarea 
                        required 
                        value={newMessage.content} 
                        onChange={e => setNewMessage({...newMessage, content: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green min-h-[120px] md:min-h-[150px]" 
                        placeholder="Escribe aquí tu duda o solicitud..."
                      />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                      <button type="button" onClick={() => setShowNew(false)} className="w-full sm:w-auto px-8 py-4 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancelar</button>
                      <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-univida-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-univida-green/20 active:scale-95 transition-all">
                        Enviar Mensaje
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="grid gap-3">
                {messages.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(msg => (
                    <MessageItem 
                      key={msg.id} 
                      msg={msg} 
                      currentUser={currentUser} 
                      users={users} 
                      handleReply={handleReply} 
                      markMessageAsRead={markMessageAsRead} 
                    />
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <MessageSquare className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Bandeja vacía</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'perfil' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-univida-green"></div>
                
                {isEditingProfile ? (
                   <form onSubmit={handleUpdateProfile} className="space-y-6 md:space-y-8">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-[10px] font-black text-univida-dark uppercase tracking-widest">Editar Perfil</h3>
                         <button type="button" onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-600 transition-all font-bold text-[10px] uppercase p-2">Cerrar</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre</label>
                            <input value={profileForm.nombre} onChange={e => setProfileForm({...profileForm, nombre: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Apellido</label>
                            <input value={profileForm.apellido} onChange={e => setProfileForm({...profileForm, apellido: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">ARS</label>
                            <input value={profileForm.seguro} onChange={e => setProfileForm({...profileForm, seguro: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">WhatsApp</label>
                            <input value={profileForm.telefono} onChange={e => setProfileForm({...profileForm, telefono: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
                         </div>
                      </div>
                      <div className="flex pt-4">
                         <button type="submit" className="w-full py-5 bg-univida-green text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-univida-green/20 active:scale-95 transition-all">
                            Guardar Cambios
                         </button>
                      </div>
                   </form>
                ) : (
                  <>
                    <div className="flex items-center gap-6 md:gap-8 mb-10 md:mb-12">
                       <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-univida-green border border-slate-100 text-2xl md:text-4xl font-black italic shadow-inner shrink-0">
                          {currentUser.nombre.charAt(0)}
                       </div>
                       <div className="min-w-0">
                          <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight truncate mb-1">{currentUser.nombre}</h2>
                          <p className="text-slate-400 text-[9px] md:text-xs font-bold uppercase tracking-widest truncate">Paciente #{currentUser.id}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-4">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Documento Cédula</p>
                            <p className="text-sm font-bold text-slate-800 font-mono tracking-tighter">{currentUser.cedula}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">WhatsApp Registrado</p>
                            <p className="text-sm font-bold text-slate-800">{currentUser.telefono}</p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Seguro Médico (ARS)</p>
                            <p className="text-[10px] md:text-xs font-black text-univida-green uppercase tracking-wide bg-green-50 px-3 py-1 rounded-full w-fit">{currentUser.seguro}</p>
                         </div>
                         <div className="hidden sm:block">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Miembro desde</p>
                            <p className="text-sm font-bold text-slate-800 uppercase text-[10px]">{currentUser.fechaRegistro}</p>
                         </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-50 my-10 md:my-12"></div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                       <button type="button" onClick={() => alert('Próximamente')} className="text-slate-300 hover:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                          Seguridad y Acceso
                       </button>
                       <button onClick={() => setIsEditingProfile(true)} className="w-full sm:w-auto px-10 py-4 bg-univida-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-univida-green/20 active:scale-95 transition-all">
                          Editar Perfil
                       </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};
