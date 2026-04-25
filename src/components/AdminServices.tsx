import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Plus, Trash2, Activity, Save, AlertCircle, Search, Upload, Download, Edit2, XCircle, CheckCircle } from 'lucide-react';
import { MedicalService, ServicePrice } from '../types';

export const AdminServices = () => {
  const { services, addService, updateService, deleteService, toggleService } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState<MedicalService | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const defaultPrices: ServicePrice[] = [
    { ars: 'SENASA', precio: 0, cubierto: true },
    { ars: 'Humano', precio: 0, cubierto: true },
    { ars: 'Mapfre', precio: 0, cubierto: true },
    { ars: 'Universal', precio: 0, cubierto: true },
    { ars: 'Privado', precio: 0, cubierto: false }
  ];

  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: 'Activity',
    prices: [...defaultPrices]
  });

  const filtered = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addService({
      ...newService,
      active: true
    });
    setNewService({ title: '', description: '', icon: 'Activity', prices: [...defaultPrices] });
    setShowAdd(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService.id, editingService);
    setEditingService(null);
  };

  const updateNewServicePrice = (index: number, field: keyof ServicePrice, value: any) => {
    const updatedPrices = [...newService.prices];
    updatedPrices[index] = { ...updatedPrices[index], [field]: value };
    setNewService({ ...newService, prices: updatedPrices });
  };

  const updateEditingServicePrice = (index: number, field: keyof ServicePrice, value: any) => {
    if (!editingService) return;
    const updatedPrices = [...(editingService.prices || defaultPrices)];
    updatedPrices[index] = { ...updatedPrices[index], [field]: value };
    setEditingService({ ...editingService, prices: updatedPrices });
  };

  const handleExportCSV = () => {
    const header = "ID,Servicio,Descripcion,Activo\n";
    const csv = services.map(s => `"${s.id}","${s.title}","${s.description}",${s.active}`).join("\n");
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'servicios_univida.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Catálogo de Servicios y Precios</h1>
          <p className="text-slate-500 text-xs md:text-sm">Gestiona la oferta médica, especialidades y acuerdos tarifarios ARS.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Exportar
          </button>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-3 bg-univida-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-univida-green/20 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Agregar Especialidad
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar servicios o especialidades..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:border-univida-green text-sm w-full shadow-sm"
        />
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl border-t-4 border-t-univida-green max-w-4xl">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Nuevo Servicio Médico</h3>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nombre de la Especialidad / Area</label>
                <input required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" placeholder="Ej: Pediatría" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Descripción Corta</label>
                <textarea required value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green min-h-[100px]" placeholder="Breve descripción del servicio..." />
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Acuerdos Tarifarios (RD$)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {newService.prices.map((price, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-xs uppercase text-univida-dark">{price.ars}</span>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked={price.cubierto} onChange={e => updateNewServicePrice(i, 'cubierto', e.target.checked)} className="accent-univida-green" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Cubre</span>
                      </label>
                    </div>
                    <input 
                      type="number" 
                      value={price.precio} 
                      onChange={e => updateNewServicePrice(i, 'precio', Number(e.target.value))} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-univida-green font-mono" 
                      placeholder="Precio"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
               <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-4 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancelar</button>
               <button type="submit" className="px-8 py-4 bg-univida-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-univida-green/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                 <Save className="w-4 h-4" /> Crear Servicio
               </button>
            </div>
          </form>
        </motion.div>
      )}

      {editingService && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-univida-green shadow-xl mb-8">
          <div className="flex justify-between items-center mb-6 md:mb-8">
             <h3 className="text-[10px] md:text-sm font-black text-univida-dark uppercase tracking-widest px-2">Editar Servicio: {editingService.title}</h3>
             <button onClick={() => setEditingService(null)} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600 active:scale-90"><XCircle className="w-6 h-6" /></button>
          </div>
          
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Título</label>
                <input required value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Descripción</label>
                <textarea required value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-univida-green min-h-[100px]" />
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Acuerdos Tarifarios (RD$)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(editingService.prices || defaultPrices).map((price, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-xs uppercase text-univida-dark">{price.ars}</span>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked={price.cubierto} onChange={e => updateEditingServicePrice(i, 'cubierto', e.target.checked)} className="accent-univida-green" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Cubre</span>
                      </label>
                    </div>
                    <input 
                      type="number" 
                      value={price.precio} 
                      onChange={e => updateEditingServicePrice(i, 'precio', Number(e.target.value))} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-univida-green font-mono" 
                    />
                  </div>
                ))}
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => (
          <div key={s.id} className={`p-6 rounded-[2rem] border transition-all ${s.active ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60 grayscale'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.active ? 'bg-green-50 text-univida-green' : 'bg-slate-200 text-slate-400'}`}>
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={() => toggleService(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${s.active ? 'bg-slate-100 text-slate-500 hover:bg-univida-dark hover:text-white' : 'bg-univida-green text-white'}`}
                 >
                   {s.active ? 'Desactivar' : 'Activar'}
                 </button>
                 <button onClick={() => setEditingService(s)} className="p-1.5 text-slate-300 hover:text-univida-green transition-all">
                    <Edit2 className="w-4 h-4" />
                 </button>
                 {deleteConfirmId === s.id ? (
                    <div className="flex gap-1 items-center bg-red-50 p-1 rounded-lg">
                      <button onClick={() => { deleteService(s.id); setDeleteConfirmId(null); }} className="px-2 py-1 bg-red-500 text-white text-[8px] font-black uppercase rounded-md">Sí</button>
                      <button onClick={() => setDeleteConfirmId(null)} className="p-1 text-slate-400"><XCircle className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirmId(s.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                  )}
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">{s.title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{s.description}</p>
            
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-50">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tarifario Básico</p>
              <div className="flex flex-wrap gap-2">
                 {(s.prices || defaultPrices).filter(p => p.cubierto || p.ars === 'Privado').slice(0, 3).map((price, idx) => (
                   <span key={idx} className="px-2 py-1 bg-slate-50 rounded-md text-[9px] font-bold text-slate-600 border border-slate-100">
                     {price.ars}: <span className="text-univida-green font-mono">RD${price.precio}</span>
                   </span>
                 ))}
                 {(s.prices?.length || 0) > 3 && <span className="px-2 py-1 text-[9px] font-bold text-slate-400">+{s.prices!.length - 3} más</span>}
              </div>
            </div>

            {!s.active && (
              <div className="flex items-center gap-2 mt-4 text-[9px] font-bold text-amber-600 uppercase tracking-widest">
                <AlertCircle className="w-3.5 h-3.5" /> Inactivo en el Portal
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
           <div className="col-span-full py-12 text-center">
             <p className="text-slate-400 text-sm font-bold">No se encontraron servicios.</p>
           </div>
        )}
      </div>
    </div>
  );
};
