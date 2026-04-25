
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, FileText, Activity, Search, Edit2, Trash2, 
  CheckCircle, XCircle, Clock, Plus, Upload, Filter, ChevronRight, Download,
  Shield, Lock, Key, Eye, UserPlus, Save, Stethoscope, Phone, MessageSquare,
  ShieldCheck, File
} from 'lucide-react';
import { Appointment, User, LabResult, AdminPermission, Doctor, Message } from '../types';
import { ADMIN_PERMISSIONS_LIST } from '../constants';
import { Logo } from './Branding';

export const AdminConfig = () => {
  const { users, currentUser, config, updateConfig, registerAdmin, deleteUser, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState<'usuarios' | 'centro' | 'web'>('usuarios');
  const [showAdd, setShowAdd] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [newAdmin, setNewAdmin] = useState({
    nombre: '', apellido: '', cedula: '', password: '', telefono: '', 
    position: '', permissions: [] as AdminPermission[]
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [tempConfig, setTempConfig] = useState(config);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerAdmin(newAdmin);
    setShowAdd(false);
    setNewAdmin({ nombre: '', apellido: '', cedula: '', password: '', telefono: '', position: '', permissions: [] });
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    updateUser(editingAdmin.id, editingAdmin);
    setEditingAdmin(null);
  };

  const handleSaveConfig = () => {
    updateConfig(tempConfig);
    alert('Configuración guardada exitosamente');
  };

  const admins = users.filter(u => u.role === 'ADMIN');

  const togglePermission = (perm: AdminPermission, isAdminEdit: boolean = false) => {
    if (isAdminEdit && editingAdmin) {
      setEditingAdmin({
        ...editingAdmin,
        permissions: (editingAdmin.permissions || []).includes(perm)
          ? (editingAdmin.permissions || []).filter(p => p !== perm)
          : [...(editingAdmin.permissions || []), perm]
      });
    } else {
      setNewAdmin(prev => ({
        ...prev,
        permissions: prev.permissions.includes(perm)
          ? prev.permissions.filter(p => p !== perm)
          : [...prev.permissions, perm]
      }));
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Configuración del Sistema</h1>
          <p className="text-slate-500 text-xs md:text-sm">Gestiona usuarios admin y parámetros globales del centro.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto scrollbar-hide">
           <button onClick={() => setActiveTab('usuarios')} className={`flex-1 min-w-fit px-3 md:px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'usuarios' ? 'bg-white text-univida-dark shadow-sm' : 'text-slate-400'}`}>Personal Admin</button>
           <button onClick={() => setActiveTab('centro')} className={`flex-1 min-w-fit px-3 md:px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'centro' ? 'bg-white text-univida-dark shadow-sm' : 'text-slate-400'}`}>Identidad Centro</button>
           {currentUser?.permissions?.includes('MANAGE_WEB_CONTENT') && (
             <button onClick={() => setActiveTab('web')} className={`flex-1 min-w-fit px-3 md:px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'web' ? 'bg-white text-univida-dark shadow-sm' : 'text-slate-400'}`}>Editor Web</button>
           )}
        </div>
      </div>

      {activeTab === 'usuarios' && (
        <>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowAdd(!showAdd)}
              className="w-full md:w-auto px-6 py-4 bg-univida-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <UserPlus className="w-4 h-4" /> Crear Nuevo Administrador
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse hidden md:table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4">Administrador</th>
                    <th className="px-6 py-4">Cédula</th>
                    <th className="px-6 py-4">Rol/Permisos</th>
                    <th className="px-6 py-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {admins.map(admin => (
                    <tr key={admin.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-univida-dark text-white flex items-center justify-center font-black text-[10px] uppercase">
                             {admin.nombre.charAt(0)}{admin.apellido.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{admin.nombre} {admin.apellido}</p>
                            <p className="text-[10px] text-univida-green font-black uppercase tracking-tight">{admin.position || 'Personal'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-univida-green">{admin.cedula}</td>
                      <td className="px-6 py-4">
                         <div className="flex flex-wrap gap-1">
                            {admin.permissions?.map(p => (
                              <span key={p} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase tracking-tighter">
                                {ADMIN_PERMISSIONS_LIST.find(pl => pl.id === p)?.label || p}
                              </span>
                            ))}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setEditingAdmin(admin)} className="p-2 text-slate-400 hover:text-univida-green transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                          {admin.id !== 'admin-1' && (
                            deleteConfirmId === admin.id ? (
                              <div className="flex gap-1 items-center bg-red-50 p-1 rounded-lg">
                                <button onClick={() => { deleteUser(admin.id); setDeleteConfirmId(null); }} className="px-2 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded-md hover:bg-red-600 transition-all">Confirmar</button>
                                <button onClick={() => setDeleteConfirmId(null)} className="p-1 text-slate-400 hover:text-slate-600"><XCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirmId(admin.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card List */}
              <div className="md:hidden divide-y divide-slate-50">
                {admins.map(admin => (
                  <div key={admin.id} className="p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-univida-dark text-white flex items-center justify-center font-black text-xs uppercase">
                          {admin.nombre.charAt(0)}{admin.apellido.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{admin.nombre} {admin.apellido}</p>
                          <p className="text-[9px] text-univida-green font-black uppercase tracking-widest">{admin.position || 'Administrador'}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingAdmin(admin)} className="p-2 text-slate-400 hover:text-univida-green transition-all"><Edit2 className="w-4 h-4" /></button>
                        {admin.id !== 'admin-1' && (
                          deleteConfirmId === admin.id ? (
                            <div className="flex gap-1 items-center bg-red-50 p-1 rounded-lg">
                              <button onClick={() => { deleteUser(admin.id); setDeleteConfirmId(null); }} className="px-2 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded-md">Confirmar</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="p-1 text-slate-400 hover:text-slate-600"><XCircle className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirmId(admin.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Cédula</p>
                      <p className="text-xs font-mono font-bold text-univida-green tracking-tight">{admin.cedula}</p>
                    </div>
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Permisos</p>
                       <div className="flex flex-wrap gap-1.5">
                          {admin.permissions?.map(p => (
                            <span key={p} className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[7px] font-black uppercase tracking-tighter border border-slate-100">
                              {ADMIN_PERMISSIONS_LIST.find(pl => pl.id === p)?.label || p}
                            </span>
                          ))}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'centro' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10 md:space-y-12">
          <div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-6 md:mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-univida-green rounded-full"></span>
              Información Institucional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre del Centro</label>
                <input value={tempConfig.nombreCentro} onChange={e => setTempConfig({...tempConfig, nombreCentro: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Teléfono Principal</label>
                <input value={tempConfig.telefono} onChange={e => setTempConfig({...tempConfig, telefono: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Dirección Física</label>
                <input value={tempConfig.direccion} onChange={e => setTempConfig({...tempConfig, direccion: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-6 md:mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-univida-green rounded-full"></span>
              Horarios de Atención
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Lunes a Viernes</label>
                <input value={tempConfig.horarios.semana} onChange={e => setTempConfig({...tempConfig, horarios: {...tempConfig.horarios, semana: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Sábados</label>
                <input value={tempConfig.horarios.sabado} onChange={e => setTempConfig({...tempConfig, horarios: {...tempConfig.horarios, sabado: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
            </div>
          </div>

          <div className="flex pt-4">
             <button onClick={handleSaveConfig} className="w-full bg-univida-green text-white py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-univida-green/20 hover:scale-[1.01] active:scale-95 transition-all">
                Guardar Cambios Institucionales
             </button>
          </div>
        </motion.div>
      )}

      {activeTab === 'web' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10 md:space-y-12">
          <div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-univida-green rounded-full"></span>
              Sección Principal (Hero)
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Título de Inicio</label>
                <input value={tempConfig.heroTitle} onChange={e => setTempConfig({...tempConfig, heroTitle: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Subtítulo de Inicio</label>
                <textarea value={tempConfig.heroSubtitle} onChange={e => setTempConfig({...tempConfig, heroSubtitle: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 text-sm outline-none focus:border-univida-green min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">URL Imagen Hero</label>
                <input value={tempConfig.heroImage} onChange={e => setTempConfig({...tempConfig, heroImage: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 text-sm outline-none focus:border-univida-green" placeholder="URL de la imagen" />
              </div>
            </div>
          </div>

          <div>
             <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-univida-green rounded-full"></span>
              Sección "Quiénes Somos"
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Descripción Institucional</label>
                <textarea value={tempConfig.aboutText} onChange={e => setTempConfig({...tempConfig, aboutText: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 text-sm outline-none focus:border-univida-green min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">URL Imagen Sección</label>
                <input value={tempConfig.aboutImage} onChange={e => setTempConfig({...tempConfig, aboutImage: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 text-sm outline-none focus:border-univida-green" placeholder="URL de la imagen" />
              </div>
            </div>
          </div>

          <div className="flex pt-4">
             <button onClick={handleSaveConfig} className="w-full bg-univida-green text-white py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-univida-green/20 hover:scale-[1.01] active:scale-95 transition-all text-center">
                Publicar Cambios Web
             </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const AdminWelcomeCinematic = ({ user, onComplete }: { user: User, onComplete: () => void }) => {
  const [scene] = useState(() => Math.random() > 0.5 ? 'kids' : 'mother');

  useEffect(() => {
    const timer = setTimeout(onComplete, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-univida-green flex flex-col items-center justify-center text-center px-8 overflow-hidden"
    >
      {/* Siluetas en una esquina */}
      <div className="absolute right-[-20px] bottom-[-20px] pointer-events-none opacity-40 select-none scale-75 md:scale-100 origin-bottom-right drop-shadow-2xl">
        {scene === 'kids' && (
          <div className="relative w-[320px] h-[320px]">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="absolute left-10 bottom-10"
            >
              <motion.svg 
                animate={{ y: [0, -25, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                viewBox="0 0 100 150" className="w-24 h-36 fill-white"
              >
                <circle cx="50" cy="25" r="15" />
                <path d="M50 45 L50 90 L30 130 M50 90 L70 130 M50 55 L20 40 M50 55 L80 40" stroke="white" strokeWidth="12" strokeLinecap="round" />
              </motion.svg>
            </motion.div>

            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="absolute right-10 bottom-10"
            >
              <motion.svg 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                viewBox="0 0 100 150" className="w-24 h-36 fill-white"
              >
                <circle cx="50" cy="25" r="15" />
                <path d="M50 45 L50 95 L35 140 M50 95 L65 140 M50 55 L25 80 M50 55 L75 30" stroke="white" strokeWidth="12" strokeLinecap="round" />
              </motion.svg>
            </motion.div>

            <motion.div
              animate={{ 
                x: [-120, 120, -120],
                y: [0, -120, 0],
                rotate: 360
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-[40%] bottom-1/2 w-10 h-10 bg-white rounded-full opacity-80"
            />
          </div>
        )}

        {scene === 'mother' && (
          <div className="relative w-[320px] h-[320px] flex items-end justify-end p-12">
             <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <motion.svg 
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                viewBox="0 0 200 250" className="w-56 h-72 fill-white"
              >
                <circle cx="80" cy="40" r="18" />
                <path d="M80 65 Q110 100 80 200 L60 250 M80 200 L100 250 M80 80 Q40 100 65 120" stroke="white" strokeWidth="15" strokeLinecap="round" fill="none" />
                <circle cx="100" cy="90" r="10" />
                <path d="M100 105 Q120 130 95 150" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />
              </motion.svg>
            </motion.div>
          </div>
        )}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="mb-12 relative z-10"
      >
        <div className="w-40 h-40 flex items-center justify-center p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                <ellipse 
                  key={deg} 
                  cx="50" cy="30" rx="6" ry="25" 
                  transform={`rotate(${deg} 50 50)`} 
                />
              ))}
              <path d="M50 58 C44 52 40 46 50 42 C60 46 56 52 50 58" />
            </svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10"
      >
        <h2 className="text-5xl font-black text-white tracking-tighter mb-4 drop-shadow-lg">
          ¡Bienvenid@ {user.nombre}! 👋
        </h2>
        <p className="text-white font-black uppercase tracking-[0.3em] opacity-80">
          Iniciando Portal de {user.position || 'Administrador'}
        </p>
      </motion.div>

      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-[800px] h-[800px] bg-white rounded-full blur-[160px] -z-10 opacity-30"
      />
    </motion.div>
  );
};

export const AdminDashboard = () => {
  const { users, appointments, labResults } = useApp();
  
  const stats = [
    { label: 'Pacientes', value: users.filter(u => u.role === 'PATIENT').length, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Citas Totales', value: appointments.length, icon: Calendar, color: 'bg-green-50 text-univida-green' },
    { label: 'Citas Pendientes Hoy', value: appointments.filter(a => a.status === 'Pendiente').length, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Analíticas Subidas', value: labResults.length, icon: FileText, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
        <p className="text-slate-500 text-xs md:text-sm">Resumen general de las operaciones del centro.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl md:text-2xl font-black text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-6">Citas Recientes</h3>
          <div className="space-y-4">
            {appointments.slice(0, 5).map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 group hover:border-univida-green/30 transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-univida-green shadow-sm text-xs font-black italic border border-slate-100">
                    {apt.patientName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{apt.patientName}</p>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase truncate">{apt.area} • {apt.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest whitespace-nowrap ${
                  apt.status === 'Confirmada' ? 'bg-green-100 text-univida-dark' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
            {appointments.length === 0 && <p className="text-center py-12 text-slate-400 text-xs italic">No hay citas registradas.</p>}
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-6">Analíticas Pendientes</h3>
          <div className="space-y-4">
            {labResults.filter(r => r.status === 'En proceso').slice(0, 5).map(res => (
              <div key={res.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 group hover:border-univida-green/30 transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-slate-100">
                    <Activity className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{res.patientName}</p>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase truncate">{res.type} • {res.code}</p>
                  </div>
                </div>
                <button className="p-2 text-univida-green hover:bg-univida-green/10 rounded-xl transition-all active:scale-90">
                  <Upload className="w-5 h-5 md:w-5 md:h-5" />
                </button>
              </div>
            ))}
            {labResults.filter(r => r.status === 'En proceso').length === 0 && <p className="text-center py-12 text-slate-400 text-xs italic">Todo al día.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminPatients = () => {
  const { users, deleteUser, updateUser } = useApp();
  const patients = users.filter(u => u.role === 'PATIENT');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPatient, setEditingPatient] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = patients.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cedula.includes(searchTerm)
  );

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;
    updateUser(editingPatient.id, editingPatient);
    setEditingPatient(null);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Gestión de Pacientes</h1>
          <p className="text-slate-500 text-xs md:text-sm">Listado completo de usuarios registrados.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por cédula o nombre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-univida-green text-sm w-full md:w-80 shadow-sm"
          />
        </div>
      </div>
      
      {editingPatient && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-univida-green shadow-xl mb-8">
          <div className="flex justify-between items-center mb-6 md:mb-8">
             <h3 className="text-[10px] md:text-sm font-black text-univida-dark uppercase tracking-widest px-2">Información del Paciente</h3>
             <button onClick={() => setEditingPatient(null)} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600 active:scale-90"><XCircle className="w-6 h-6" /></button>
          </div>
          
          <form onSubmit={handleUpdate} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre</label>
                <input required value={editingPatient.nombre} onChange={e => setEditingPatient({...editingPatient, nombre: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Apellido</label>
                <input required value={editingPatient.apellido} onChange={e => setEditingPatient({...editingPatient, apellido: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Seguro</label>
                <input required value={editingPatient.seguro} onChange={e => setEditingPatient({...editingPatient, seguro: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">WhatsApp</label>
                <input required value={editingPatient.telefono} onChange={e => setEditingPatient({...editingPatient, telefono: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
               <button type="submit" className="w-full sm:w-auto px-12 py-5 bg-univida-green text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-univida-green/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Guardar Cambios
               </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Cédula</th>
                <th className="px-6 py-4">Seguro</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">F. Registro</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-univida-green/10 text-univida-green flex items-center justify-center font-bold text-xs uppercase italic">
                        {p.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{p.nombre} {p.apellido}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Digital User</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{p.cedula}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">{p.seguro}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{p.telefono}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">{p.fechaRegistro}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setEditingPatient(p)} className="p-2 text-slate-400 hover:text-univida-green hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"><Edit2 className="w-3.5 h-3.5" /></button>
                      {deleteConfirmId === p.id ? (
                        <div className="flex gap-1 items-center bg-red-50 p-1 rounded-lg">
                          <button onClick={() => { deleteUser(p.id); setDeleteConfirmId(null); }} className="px-2 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded-md hover:bg-red-600 transition-all">Confirmar</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="p-1 text-slate-400 hover:text-slate-600"><XCircle className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(p.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"><Trash2 className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-50">
            {filtered.map(p => (
              <div key={p.id} className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-univida-green/5 text-univida-green flex items-center justify-center font-black text-xs uppercase italic overflow-hidden shadow-sm border border-univida-green/10">
                      {p.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{p.nombre} {p.apellido}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Paciente Digital</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingPatient(p)} className="p-3 bg-slate-50 text-slate-400 rounded-xl active:bg-univida-green/10 active:text-univida-green transition-all"><Edit2 className="w-4 h-4" /></button>
                    {deleteConfirmId === p.id ? (
                      <div className="flex gap-1 items-center bg-red-50 p-1 rounded-xl">
                        <button onClick={() => { deleteUser(p.id); setDeleteConfirmId(null); }} className="px-3 py-2 bg-red-500 text-white text-[9px] font-black uppercase rounded-lg">Sí</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="p-2 text-slate-400"><XCircle className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(p.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl active:bg-red-50 active:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Cédula</p>
                    <p className="text-[11px] font-bold text-slate-700 font-mono">{p.cedula}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Seguro</p>
                    <p className="text-[11px] font-bold text-univida-green font-black uppercase">{p.seguro}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-1">
                   <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-slate-300" />
                      <span className="text-[10px] font-black text-slate-500 font-mono tracking-tight">{p.telefono}</span>
                   </div>
                   <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic tracking-tighter">Reg: {p.fechaRegistro}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center px-6">
            <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-bold">No se encontraron pacientes registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const AdminAppointments = () => {
  const { appointments, updateAppointmentStatus } = useApp();
  const [filter, setFilter] = useState('Todas');

  const filtered = filter === 'Todas' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Control de Citas</h1>
          <p className="text-slate-500 text-xs md:text-sm">Gestiona solicitudes, confirma y finaliza consultas.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto scrollbar-hide">
          {['Todas', 'Pendiente', 'Confirmada', 'Completada'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-white text-univida-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {/* Desktop Table View */}
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Detalles Cita</th>
                <th className="px-6 py-4">Seguro</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(apt => (
                <tr key={apt.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs uppercase">
                        {apt.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{apt.patientName}</p>
                        <p className="text-[10px] text-slate-400 font-mono font-bold tracking-tighter">{apt.cedula}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-black text-slate-700 tracking-tight">{apt.area}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{apt.date} • {apt.time}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">{apt.seguro}</td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        apt.status === 'Confirmada' ? 'bg-green-100 text-univida-dark' : 
                        apt.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        apt.status === 'Completada' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                     }`}>
                        {apt.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {apt.status === 'Pendiente' && (
                        <button onClick={() => updateAppointmentStatus(apt.id, 'Confirmada')} className="p-2 text-univida-green hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"><CheckCircle className="w-3.5 h-3.5" /></button>
                      )}
                      {apt.status === 'Confirmada' && (
                        <button onClick={() => updateAppointmentStatus(apt.id, 'Completada')} className="p-2 text-blue-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"><CheckCircle className="w-3.5 h-3.5" /></button>
                      )}
                      <button onClick={() => updateAppointmentStatus(apt.id, 'Cancelada')} className="p-2 text-red-400 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"><XCircle className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-50">
             {filtered.map(apt => (
               <div key={apt.id} className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{apt.patientName}</p>
                      <p className="text-[9px] text-univida-green font-black uppercase tracking-widest mt-1 italic">{apt.area}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${
                        apt.status === 'Confirmada' ? 'bg-green-100 text-univida-dark' : 
                        apt.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        apt.status === 'Completada' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                     } shadow-sm`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha</p>
                        <p className="text-xs font-bold text-slate-700">{apt.date}</p>
                     </div>
                     <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Horario</p>
                        <p className="text-xs font-bold text-univida-green">{apt.time}</p>
                     </div>
                  </div>
                  <div className="flex items-center justify-between px-1">
                     <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{apt.seguro || 'Sin Seguro'}</span>
                     </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {apt.status === 'Pendiente' && (
                      <button onClick={() => updateAppointmentStatus(apt.id, 'Confirmada')} className="flex-1 py-3 bg-univida-green text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-univida-green/20 active:scale-95 transition-all text-center">Confirmar</button>
                    )}
                    {apt.status === 'Confirmada' && (
                      <button onClick={() => updateAppointmentStatus(apt.id, 'Completada')} className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-center">Completar</button>
                    )}
                    <button onClick={() => updateAppointmentStatus(apt.id, 'Cancelada')} className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all text-center">Cancelar</button>
                  </div>
               </div>
             ))}
             {filtered.length === 0 && (
               <div className="py-20 text-center px-6">
                 <p className="text-slate-400 text-xs italic">No se encontraron citas que coincidan con el filtro.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminAnalytics = () => {
  const { labResults, addLabResult, users, deleteLabResult, updateLabResult } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editingResult, setEditingResult] = useState<LabResult | null>(null);
  const [newResult, setNewResult] = useState({ patientId: '', type: '', status: 'En proceso' as any, fileUrl: '' });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("El archivo es muy pesado. Máximo 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditing && editingResult) {
          setEditingResult({ ...editingResult, fileUrl: base64String });
        } else {
          setNewResult({ ...newResult, fileUrl: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const patientOptions = users.filter(u => u.role === 'PATIENT');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;
    updateLabResult(editingResult.id, editingResult);
    setEditingResult(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = users.find(u => u.id === newResult.patientId);
    if (!patient) return;

    addLabResult({
      ...newResult,
      patientName: `${patient.nombre} ${patient.apellido}`,
      cedula: patient.cedula,
    });
    setShowAdd(false);
    setNewResult({ patientId: '', type: '', status: 'En proceso' as any, fileUrl: '' });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Archivo de Analíticas</h1>
          <p className="text-slate-500 text-xs md:text-sm">Gestiona la carga de resultados médicos para pacientes.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="w-full lg:w-auto px-6 py-4 bg-univida-green text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-univida-green/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Nueva Analítica
        </button>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 bg-white rounded-[2rem] md:rounded-3xl border border-slate-200 shadow-xl border-t-4 border-t-univida-green">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-6 px-2 italic">Subir Nuevo Resultado</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Paciente</label>
              <select 
                required
                value={newResult.patientId}
                onChange={(e) => setNewResult({...newResult, patientId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-univida-green outline-none text-sm cursor-pointer"
              >
                <option value="">Seleccionar paciente...</option>
                {patientOptions.map(p => <option key={p.id} value={p.id}>{p.cedula} - {p.nombre} {p.apellido}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Estudio</label>
              <input 
                required
                value={newResult.type}
                onChange={(e) => setNewResult({...newResult, type: e.target.value})}
                type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-univida-green outline-none text-sm" placeholder="Ej. Hemograma" />
            </div>
            <div className="space-y-2">
              <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Archivo (PDF/IMG)</label>
              <input 
                type="file" 
                required
                onChange={(e) => handleFileUpload(e, false)}
                accept=".pdf,image/*"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-univida-green outline-none text-[10px]" 
              />
            </div>
            <button type="submit" className="w-full py-5 bg-univida-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-univida-green/20 active:scale-95">Registrar Analítica</button>
          </form>
        </motion.div>
      )}

      {editingResult && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 md:p-8 bg-white rounded-[2rem] md:rounded-3xl border border-univida-green/30 shadow-2xl mb-8 relative">
          <button onClick={() => setEditingResult(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-all active:scale-90"><XCircle className="w-6 h-6" /></button>
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-8 px-2">Actualizar Resultado</h3>
          <form onSubmit={handleUpdate} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Paciente</label>
                <input disabled value={editingResult.patientName} className="w-full bg-slate-100 border border-slate-200 rounded-xl p-4 cursor-not-allowed text-sm text-slate-500 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Estudio</label>
                <input required value={editingResult.type} onChange={e => setEditingResult({...editingResult, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-univida-green outline-none text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Estado</label>
                <select 
                  value={editingResult.status} 
                  onChange={e => setEditingResult({...editingResult, status: e.target.value as any})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-univida-green outline-none text-sm font-bold"
                >
                  <option value="En proceso">En proceso</option>
                  <option value="Disponible">Disponible</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Observaciones / Resultados</label>
                  <textarea 
                    value={editingResult.observaciones || ''} 
                    onChange={e => setEditingResult({...editingResult, observaciones: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-univida-green outline-none text-sm min-h-[120px] font-medium"
                    placeholder="Escribe los resultados o notas aquí..."
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Archivo Digital</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col items-center justify-center gap-4 group hover:border-univida-green transition-all">
                    <input 
                      type="file" 
                      onChange={(e) => handleFileUpload(e, true)}
                      accept=".pdf,image/*"
                      className="text-[10px] w-full cursor-pointer"
                    />
                    {editingResult.fileUrl ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-univida-green/10 rounded-lg">
                        <CheckCircle className="w-3 h-3 text-univida-green" />
                        <span className="text-[8px] text-univida-green font-black uppercase">Archivo cargado correctamente</span>
                      </div>
                    ) : (
                      <p className="text-[8px] text-slate-400 font-black uppercase">Click para cambiar archivo (PDF/IMG, max 2MB)</p>
                    )}
                  </div>
              </div>
            </div>
            <div className="flex pt-2">
               <button type="submit" className="w-full py-5 bg-univida-green text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-univida-green/20 active:scale-[1.01] transition-all">
                  Confirmar Actualización de Resultado
               </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {/* Desktop Table View */}
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Estudio / Referencia</th>
                <th className="px-6 py-4">Fecha Carga</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {labResults.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black italic">
                        {res.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{res.patientName}</p>
                        <p className="text-[10px] text-slate-400 font-mono font-bold tracking-tight">{res.cedula}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-black text-slate-700 tracking-tight">{res.type}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">{res.code}</p>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.date}</td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1 items-start">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            res.status === 'Disponible' ? 'bg-green-100 text-univida-dark' : 
                            res.status === 'En proceso' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                            {res.status}
                        </span>
                        {res.fileUrl && <div className="flex items-center gap-1 mt-1 text-[7px] text-univida-green font-black uppercase tracking-widest"><File className="w-2.5 h-2.5" /> Archivo Listo</div>}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {res.fileUrl && (
                          <button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = res.fileUrl!;
                              link.download = `Resultado_${res.type}.pdf`;
                              link.click();
                            }}
                            className="p-2 text-univida-green hover:bg-univida-green hover:text-white rounded-lg transition-all border border-univida-green/20"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-univida-green hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100" onClick={() => setEditingResult(res)}><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100" onClick={() => deleteLabResult(res.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-50">
             {labResults.map(res => (
               <div key={res.id} className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black italic">
                        {res.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{res.patientName}</p>
                        <p className="text-[9px] text-univida-green font-black uppercase tracking-widest mt-0.5">{res.type}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm ${
                        res.status === 'Disponible' ? 'bg-green-100 text-univida-dark' : 
                        res.status === 'En proceso' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono tracking-tighter">Código Ref</p>
                        <p className="text-[11px] font-bold text-slate-700 font-mono italic">{res.code}</p>
                     </div>
                     <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono tracking-tighter">Fecha Carga</p>
                        <p className="text-[11px] font-bold text-slate-700 font-mono italic">{res.date}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                    {res.fileUrl && (
                      <button 
                         onClick={() => {
                           const link = document.createElement('a');
                           link.href = res.fileUrl!;
                           link.download = `Resultado_${res.type}.pdf`;
                           link.click();
                         }}
                         className="flex-1 py-3 bg-univida-green text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-univida-green/10 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                      >
                         <Download className="w-3 h-3" /> Descargar PDF
                      </button>
                    )}
                    <button className="flex-1 py-3 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl font-black text-[9px] uppercase tracking-widest active:bg-slate-100 active:text-slate-600 transition-all text-center flex items-center justify-center gap-2" onClick={() => setEditingResult(res)}>
                      <Edit2 className="w-3 h-3" /> Editar
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl active:bg-red-50 active:text-red-500 transition-all" onClick={() => deleteLabResult(res.id)}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
               </div>
             ))}
             {labResults.length === 0 && (
               <div className="py-20 text-center px-6">
                 <p className="text-slate-400 text-xs italic">No hay analíticas registradas aún.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminDoctors = () => {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    nombre: '', apellido: '', especialidad: '', telefono: '', cedula: '', consultorio: ''
  });

  const filtered = doctors.filter(d => 
    d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.cedula.includes(searchTerm)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctor(newDoctor);
    setShowAdd(false);
    setNewDoctor({ nombre: '', apellido: '', especialidad: '', telefono: '', cedula: '', consultorio: '' });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      updateDoctor(editingDoctor.id, editingDoctor);
      setEditingDoctor(null);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Cuerpo Médico</h1>
          <p className="text-slate-500 text-xs md:text-sm">Gestiona los doctores, sus especialidades y consultorios.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar doctor o especialidad..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-univida-green text-sm w-full md:w-80 shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="w-full sm:w-auto px-6 py-4 bg-univida-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-univida-green shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Registrar Doctor
          </button>
        </div>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 bg-white rounded-[2rem] md:rounded-3xl border border-slate-200 shadow-xl border-t-4 border-t-univida-green">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-8 px-2">Información del Nuevo Doctor</h3>
          <form onSubmit={handleAdd} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre</label>
                <input required value={newDoctor.nombre} onChange={e => setNewDoctor({...newDoctor, nombre: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" placeholder="Ej: Juan" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Apellido</label>
                <input required value={newDoctor.apellido} onChange={e => setNewDoctor({...newDoctor, apellido: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" placeholder="Ej: Pérez" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Cédula</label>
                <input required value={newDoctor.cedula} onChange={e => setNewDoctor({...newDoctor, cedula: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" placeholder="000-0000000-0" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Especialidad</label>
                <input required value={newDoctor.especialidad} onChange={e => setNewDoctor({...newDoctor, especialidad: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" placeholder="Ej: Cardiología" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">WhatsApp</label>
                <input required value={newDoctor.telefono} onChange={e => setNewDoctor({...newDoctor, telefono: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" placeholder="809-000-0000" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Consultorio</label>
                <input value={newDoctor.consultorio} onChange={e => setNewDoctor({...newDoctor, consultorio: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" placeholder="Ej: Edif. B, local 201" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all">Cancelar</button>
              <button type="submit" className="px-12 py-4 bg-univida-green text-white rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl shadow-univida-green/20 hover:scale-[1.01] active:scale-95 transition-all">Guardar Doctor</button>
            </div>
          </form>
        </motion.div>
      )}

      {editingDoctor && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 md:p-8 bg-white rounded-[2rem] md:rounded-3xl border border-univida-green shadow-xl relative">
          <button onClick={() => setEditingDoctor(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-all active:scale-90"><XCircle className="w-6 h-6" /></button>
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-8 px-2">Editar Información del Doctor</h3>
          <form onSubmit={handleUpdate} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre</label>
                <input required value={editingDoctor.nombre} onChange={e => setEditingDoctor({...editingDoctor, nombre: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Apellido</label>
                <input required value={editingDoctor.apellido} onChange={e => setEditingDoctor({...editingDoctor, apellido: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Cédula</label>
                <input required value={editingDoctor.cedula} onChange={e => setEditingDoctor({...editingDoctor, cedula: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Especialidad</label>
                <input required value={editingDoctor.especialidad} onChange={e => setEditingDoctor({...editingDoctor, especialidad: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Teléfono</label>
                <input required value={editingDoctor.telefono} onChange={e => setEditingDoctor({...editingDoctor, telefono: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Consultorio</label>
                <input value={editingDoctor.consultorio || ''} onChange={e => setEditingDoctor({...editingDoctor, consultorio: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="flex items-center gap-2 px-2 h-full pt-4">
                 <button 
                  type="button"
                  onClick={() => setEditingDoctor({...editingDoctor, activo: !editingDoctor.activo})}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${editingDoctor.activo ? 'bg-green-50 border-green-200 text-univida-green' : 'bg-red-50 border-red-200 text-red-500'}`}
                 >
                   {editingDoctor.activo ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                   {editingDoctor.activo ? 'Activo' : 'Inactivo'}
                 </button>
              </div>
            </div>
            <div className="flex pt-4">
               <button type="submit" className="w-full py-5 bg-univida-green text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-univida-green/20 hover:scale-[1.01] active:scale-95 transition-all">
                  Actualizar Datos del Profesional
               </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {/* Desktop View */}
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Profesional</th>
                <th className="px-6 py-4">Especialidad</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(dr => (
                <tr key={dr.id} className={`hover:bg-slate-50/50 transition-all group ${!dr.activo ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-univida-dark text-white flex items-center justify-center font-black text-xs shadow-lg">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Dr. {dr.nombre} {dr.apellido}</p>
                        <p className="text-[10px] text-slate-400 font-mono font-bold">{dr.cedula}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-univida-green/10 text-univida-green rounded-full text-[9px] font-black uppercase tracking-widest">
                      {dr.especialidad}
                    </span>
                    {dr.consultorio && (
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 italic">{dr.consultorio}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs font-semibold">{dr.telefono}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${dr.activo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {dr.activo ? 'En servicio' : 'Fuera de servicio'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setEditingDoctor(dr)} className="p-2 text-slate-400 hover:text-univida-green hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteDoctor(dr.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-slate-50">
            {filtered.map(dr => (
              <div key={dr.id} className={`p-5 space-y-4 ${!dr.activo ? 'bg-slate-50/50' : ''}`}>
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl bg-univida-dark text-white flex items-center justify-center font-black text-sm shadow-xl">
                          {dr.nombre.charAt(0)}{dr.apellido.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">Dr. {dr.nombre} {dr.apellido}</p>
                          <p className="text-[9px] text-univida-green font-black uppercase tracking-widest mt-1">{dr.especialidad}</p>
                       </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm ${dr.activo ? 'bg-green-100 text-univida-dark' : 'bg-red-50 text-red-500'}`}>
                       {dr.activo ? 'En Servicio' : 'Fuera'}
                    </span>
                  </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Consultorio</p>
                       <p className="text-[10px] font-bold text-slate-700 tracking-tight">{dr.consultorio || 'Por asignar'}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">WhatsApp</p>
                       <p className="text-[10px] font-bold text-slate-700 font-mono italic tracking-tighter">{dr.telefono}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => setEditingDoctor(dr)} className="flex-1 py-4 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl font-black text-[9px] uppercase tracking-widest active:bg-univida-green/10 active:text-univida-green transition-all text-center flex items-center justify-center gap-2">
                      <Edit2 className="w-3.5 h-3.5" /> Editar Datos
                    </button>
                    <button onClick={() => deleteDoctor(dr.id)} className="p-4 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl active:bg-red-50 active:text-red-500 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            ))}
             {filtered.length === 0 && (
               <div className="py-20 text-center px-6">
                 <p className="text-slate-400 text-xs italic tracking-widest uppercase">No se encontraron médicos registrados.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminMessageRow = ({ msg, currentUser, users, patients, handleReply, markMessageAsRead }: { 
  msg: Message, 
  currentUser: User, 
  users: User[], 
  patients: User[], 
  handleReply: (msg: Message) => void, 
  markMessageAsRead: (id: string) => void,
  key?: any
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFromMe = msg.fromId === currentUser?.id;
  const otherParty = isFromMe 
    ? patients.find(p => p.id === msg.toId)
    : (users.find(u => u.id === msg.fromId) || patients.find(p => p.id === msg.fromId));

  return (
    <>
      {/* Desktop Message Row */}
      <tr 
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!msg.read && msg.toId === currentUser.id) {
            markMessageAsRead(msg.id);
          }
        }}
        className={`hidden md:table-row hover:bg-slate-50/50 transition-all cursor-pointer group ${!msg.read && msg.toId === currentUser?.id ? 'bg-green-50/30' : ''}`}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${isFromMe ? 'bg-slate-100 text-slate-400' : 'bg-univida-green text-white shadow-sm'}`}>
              {isFromMe ? 'Tú' : (otherParty?.nombre.charAt(0) || '?')}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {isFromMe ? `Para: ${otherParty?.nombre || '...'}` : `DE: ${msg.fromName.split(' ')[0]} [${msg.fromRole}]`}
              </p>
              <p className="text-[10px] text-slate-400 font-mono font-bold tracking-tighter">
                {otherParty?.cedula || msg.fromRole}
              </p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <p className="text-xs font-black text-slate-700 tracking-tight">{msg.title}</p>
            {!msg.read && msg.toId === currentUser?.id && (
              <span className="w-2 h-2 bg-univida-green rounded-full animate-pulse"></span>
            )}
          </div>
          {!isExpanded && <p className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">{msg.content}</p>}
        </td>
        <td className="px-6 py-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString()} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
              msg.read ? 'bg-slate-100 text-slate-400 border border-slate-100' : 'bg-green-50 text-univida-dark border border-green-100'
            }`}>
              {msg.toId === currentUser?.id ? (msg.read ? 'Leído' : 'Nuevo') : (msg.read ? 'Visto' : 'Enviado')}
            </span>
            {!isFromMe && (
              <button 
                onClick={() => handleReply(msg)}
                className="p-2 text-slate-300 hover:text-univida-green transition-all"
                title="Responder"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Mobile Message Card */}
      <div 
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!msg.read && msg.toId === currentUser.id) {
            markMessageAsRead(msg.id);
          }
        }}
        className={`md:hidden p-5 space-y-4 cursor-pointer active:bg-slate-50 transition-all ${!msg.read && msg.toId === currentUser?.id ? 'bg-green-50/30' : ''}`}
      >
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs uppercase ${isFromMe ? 'bg-slate-100 text-slate-400' : 'bg-univida-green text-white shadow-lg shadow-univida-green/20'}`}>
                {isFromMe ? 'Tú' : (otherParty?.nombre.charAt(0) || '?')}
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">
                   {isFromMe ? 'Mensaje Enviado' : 'Mensaje Recibido'}
                </p>
                <p className="text-sm font-bold text-slate-800">
                   {isFromMe ? `Para: ${otherParty?.nombre || '...'}` : `De: ${msg.fromName}`}
                </p>
              </div>
           </div>
           <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
              msg.read ? 'text-slate-300 border border-slate-100' : 'text-univida-green border border-univida-green bg-univida-green/5'
            }`}>
              {msg.toId === currentUser?.id ? (msg.read ? 'Leído' : 'Nuevo') : (msg.read ? 'Visto' : 'Enviado')}
           </span>
        </div>
        <div>
           <div className="flex items-center gap-2 mb-1">
             {!msg.read && msg.toId === currentUser?.id && <div className="w-1.5 h-1.5 bg-univida-green rounded-full"></div>}
             <p className="text-sm font-bold text-slate-700 tracking-tight">{msg.title}</p>
           </div>
           {!isExpanded && <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed">{msg.content}</p>}
        </div>
        <div className="flex justify-between items-center text-[8px] font-black text-slate-300 uppercase tracking-widest italic pt-1">
           <span>{new Date(msg.createdAt).toLocaleDateString()} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
           {!isFromMe && <span className="bg-slate-100 px-2 py-1 rounded text-slate-400">Click para responder</span>}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <tr className="border-none w-full block md:table-row">
            <td colSpan={4} className="px-6 py-0 border-none bg-slate-50/30 block md:table-cell">
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="py-6 px-4 md:pl-14 border-t border-slate-100">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-4">
                     <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {!isFromMe && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleReply(msg); }}
                      className="w-full md:w-auto px-8 py-3 bg-univida-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                       <ChevronRight className="w-4 h-4" /> Redactar Respuesta
                    </button>
                  )}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

export const AdminMessages = () => {
  const { messages, sendMessage, users, currentUser, markMessageAsRead } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newMessage, setNewMessage] = useState({ toId: '', title: '', content: '' });
  
  const patients = users.filter(u => u.role === 'PATIENT');
  
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
        fromName: currentUser.nombre,
        fromRole: currentUser.position || 'Admin',
        toId: newMessage.toId,
        title: newMessage.title || `[${currentUser.nombre}, ${currentUser.position || 'Admin'}] Te a mandado un mensaje!`,
        content: newMessage.content,
      });
      
      setShowNew(false);
      setNewMessage({ toId: '', title: '', content: '' });
      alert('Mensaje enviado exitosamente');
    } catch (error) {
      console.error("Error sending message:", error);
      alert('Error al enviar el mensaje. Verifica los permisos.');
    }
  };

  const handleReply = (msg: Message) => {
    setNewMessage({
      toId: msg.fromId,
      title: `Re: ${msg.title}`,
      content: ''
    });
    setShowNew(true);
  };

  const filteredMessages = messages.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.fromName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Centro de Mensajería</h1>
          <p className="text-slate-500 text-xs md:text-sm">Bandeja de entrada y comunicación directa con pacientes.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar mensajes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-univida-green text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowNew(!showNew)}
            className="w-full sm:w-auto px-6 py-4 bg-univida-green text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-univida-green/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Nuevo Mensaje
          </button>
        </div>
      </div>

      {showNew && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 bg-white rounded-[2rem] md:rounded-3xl border border-univida-green/30 shadow-2xl">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs mb-8 px-2 italic text-univida-green">Redactar Mensaje Digital</h3>
          <form onSubmit={handleSend} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Destinatario (Paciente)</label>
                <select 
                  required
                  value={newMessage.toId}
                  onChange={e => setNewMessage({...newMessage, toId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green font-bold"
                >
                  <option value="">Seleccionar destinatario...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido} - {p.cedula}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Asunto / Título</label>
                <input required value={newMessage.title} onChange={e => setNewMessage({...newMessage, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green font-bold" placeholder="Importante: Resultado de Analíticas..." />
              </div>
            </div>
            <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Contenido del Mensaje</label>
                <textarea required value={newMessage.content} onChange={e => setNewMessage({...newMessage, content: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green min-h-[160px] font-medium leading-relaxed" placeholder="Escribe el cuerpo del mensaje aquí..." />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
               <button type="button" onClick={() => setShowNew(false)} className="px-8 py-4 bg-slate-50 text-slate-400 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest active:scale-95 transition-all">Cancelar</button>
               <button type="submit" className="px-12 py-4 bg-univida-green text-white rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl shadow-univida-green/10 active:scale-95 transition-all">Enviar Mensaje Seguro</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {/* Desktop Table Header */}
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Remitente / Destino</th>
                <th className="px-6 py-4">Asunto / Previsualización</th>
                <th className="px-6 py-4">Fecha / Hora</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMessages.map(msg => (
                <AdminMessageRow 
                  key={msg.id} 
                  msg={msg} 
                  currentUser={currentUser!} 
                  users={users} 
                  patients={patients}
                  handleReply={handleReply}
                  markMessageAsRead={markMessageAsRead}
                />
              ))}
            </tbody>
          </table>

          {/* Mobile Card List View Container */}
          <div className="md:hidden divide-y divide-slate-50">
            {filteredMessages.map(msg => (
               <AdminMessageRow 
                  key={msg.id} 
                  msg={msg} 
                  currentUser={currentUser!} 
                  users={users} 
                  patients={patients}
                  handleReply={handleReply}
                  markMessageAsRead={markMessageAsRead}
                />
            ))}
            {filteredMessages.length === 0 && (
              <div className="py-20 text-center px-6">
                <p className="text-slate-400 text-xs italic tracking-widest uppercase">Bandeja de entrada vacía.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
