
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Plus, Trash2, Shield, Activity, Save, AlertCircle } from 'lucide-react';

export const AdminServices = () => {
  const { services, addService, deleteService, toggleService } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: 'Activity'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addService({
      ...newService,
      active: true
    });
    setNewService({ title: '', description: '', icon: 'Activity' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Catálogo de Servicios</h1>
          <p className="text-slate-500 text-sm">Gestiona la oferta médica disponible en el centro.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="px-6 py-3 bg-univida-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-univida-green/20 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Agregar Especialidad
        </button>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl border-t-4 border-t-univida-green max-w-2xl">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Nuevo Servicio Médico</h3>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre de la Especialidad / Area</label>
              <input required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" placeholder="Ej: Pediatría" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Descripción Corta</label>
              <textarea required value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green min-h-[100px]" placeholder="Breve descripción del servicio..." />
            </div>
            <div className="flex justify-end gap-4 pt-2">
               <button type="button" onClick={() => setShowAdd(false)} className="px-8 py-4 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancelar</button>
               <button type="submit" className="px-10 py-4 bg-univida-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-univida-green/20 transition-all flex items-center gap-2">
                 <Save className="w-4 h-4" /> Crear Servicio
               </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {services.map(s => (
          <div key={s.id} className={`p-8 rounded-[2.5rem] border transition-all ${s.active ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60 grayscale'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.active ? 'bg-green-50 text-univida-green' : 'bg-slate-200 text-slate-400'}`}>
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={() => toggleService(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${s.active ? 'bg-slate-100 text-slate-500 hover:bg-univida-dark hover:text-white' : 'bg-univida-green text-white'}`}
                 >
                   {s.active ? 'Desactivar' : 'Activar'}
                 </button>
                 <button onClick={() => deleteService(s.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{s.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">{s.description}</p>
            {!s.active && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                <AlertCircle className="w-4 h-4" /> Inactivo en el Portal
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
