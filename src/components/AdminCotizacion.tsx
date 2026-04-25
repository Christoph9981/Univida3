import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Search, Plus, Trash2, Printer, Calculator, User as UserIcon, Shield, FileText } from 'lucide-react';
import { User, MedicalService, Cotizacion, CotizacionItem } from '../types';

export const AdminCotizacion = () => {
  const { users, services } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  
  // Cotizacion State
  const [patientName, setPatientName] = useState('');
  const [cedula, setCedula] = useState('');
  const [ars, setArs] = useState('Privado');
  
  const [items, setItems] = useState<CotizacionItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');

  const activeServices = services.filter(s => s.active);

  const handleSearchPatient = () => {
    const found = users.find(u => 
      u.role === 'PATIENT' && 
      (u.cedula === searchTerm || u.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (found) {
      setSelectedPatient(found);
      setPatientName(`${found.nombre} ${found.apellido}`);
      setCedula(found.cedula);
      setArs(found.seguro || 'Privado');
    } else {
      alert("Paciente no encontrado. Ingrese los datos manualmente.");
    }
  };

  const handleAddItem = () => {
    if (!selectedServiceId) return;
    const service = services.find(s => s.id === selectedServiceId);
    if (!service) return;

    // Find price for selected ARS or fallback to 'Privado'
    const defaultPrices = [
      { ars: 'SENASA', precio: 0, cubierto: true },
      { ars: 'Privado', precio: 0, cubierto: false }
    ];
    const pricesList = service.prices || defaultPrices;
    
    let priceInfo = pricesList.find(p => p.ars.toLowerCase() === ars.toLowerCase());
    if (!priceInfo) {
       priceInfo = pricesList.find(p => p.ars === 'Privado') || { ars: 'Privado', precio: 0, cubierto: false };
    }

    const newItem: CotizacionItem = {
      serviceId: service.id,
      title: service.title,
      precio: priceInfo.precio,
      cubierto: priceInfo.cubierto
    };

    setItems([...items, newItem]);
    setSelectedServiceId('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.precio, 0);
  const descuentoARS = items.filter(item => item.cubierto).reduce((sum, item) => sum + item.precio, 0) * 0.8; // Example: ARS covers 80% if "cubierto"
  const total = subtotal - descuentoARS;

  const handlePrint = () => {
    window.print();
  };

  const handleClear = () => {
    setSelectedPatient(null);
    setPatientName('');
    setCedula('');
    setArs('Privado');
    setItems([]);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 print:hidden">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Módulo de Cotización</h1>
          <p className="text-slate-500 text-xs md:text-sm">Genera cotizaciones de servicios médicos según ARS.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={handleClear} className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
            Limpiar
          </button>
          <button onClick={handlePrint} className="px-4 py-3 bg-univida-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-univida-green/20 hover:scale-[1.02] transition-all flex items-center gap-2">
            <Printer className="w-4 h-4" /> Imprimir Cotización
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Izquierdo - Controles */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          
          {/* Búsqueda de Paciente */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
             <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] flex items-center gap-2 mb-4">
               <UserIcon className="w-4 h-4 text-univida-green" /> Buscar Paciente (Opcional)
             </h3>
             <div className="flex gap-2">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Cédula o Nombre..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-univida-green text-sm w-full"
                 />
               </div>
               <button onClick={handleSearchPatient} className="px-4 bg-univida-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all">Buscar</button>
             </div>
          </div>

          {/* Datos Generales */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
             <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] flex items-center gap-2 mb-4">
               <FileText className="w-4 h-4 text-univida-green" /> Datos de Cotización
             </h3>
             <div className="space-y-4">
               <div>
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre Completo</label>
                 <input value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-univida-green mt-1" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Cédula</label>
                    <input value={cedula} onChange={e => setCedula(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-univida-green mt-1" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Seguro Médico (ARS)</label>
                    <select value={ars} onChange={e => setArs(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-univida-green mt-1 font-black text-slate-700">
                      <option value="Privado">Privado / Sin Seguro</option>
                      <option value="SENASA">SENASA</option>
                      <option value="Humano">Primera ARS Humano</option>
                      <option value="Mapfre">Mapfre Salud</option>
                      <option value="Universal">ARS Universal</option>
                      <option value="Monumental">ARS Monumental</option>
                    </select>
                  </div>
               </div>
             </div>
          </div>

          {/* Agregar Servicios */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 border-t-4 border-t-univida-green">
             <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] flex items-center gap-2 mb-4">
               <Calculator className="w-4 h-4 text-univida-green" /> Agregar Servicios
             </h3>
             <div className="flex gap-2">
               <select 
                 value={selectedServiceId} 
                 onChange={e => setSelectedServiceId(e.target.value)}
                 className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-univida-green"
               >
                 <option value="">Seleccione un servicio...</option>
                 {activeServices.map(s => (
                   <option key={s.id} value={s.id}>{s.title}</option>
                 ))}
               </select>
               <button onClick={handleAddItem} className="px-4 bg-univida-green text-white rounded-xl font-black shadow-lg shadow-univida-green/20 hover:scale-105 active:scale-95 transition-all">
                 <Plus className="w-5 h-5" />
               </button>
             </div>
          </div>

        </div>

        {/* Panel Derecho - Vista de Cotización (Imprimible) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0">
            
            {/* Header Cotización */}
            <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
              <div>
                 <h2 className="text-3xl font-black text-univida-dark tracking-tighter">COTIZACIÓN</h2>
                 <p className="text-univida-green font-black uppercase tracking-widest text-[10px] mt-1">Centro de Atención Primaria UNIVIDA</p>
                 <p className="text-slate-400 text-xs mt-2">Fecha: {new Date().toLocaleDateString('es-DO')}</p>
                 <p className="text-slate-400 text-xs mt-1">No. {Math.floor(Math.random() * 10000).toString().padStart(5, '0')}</p>
              </div>
              <div className="text-right">
                 <div className="w-16 h-16 bg-univida-green rounded-2xl flex items-center justify-center ml-auto mb-2">
                   <Shield className="w-8 h-8 text-white" />
                 </div>
              </div>
            </div>

            {/* Datos del Paciente */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-2xl print:bg-transparent print:p-0 print:border print:border-slate-200 print:p-4">
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Paciente</p>
                 <p className="font-bold text-slate-800 text-sm">{patientName || 'Cliente No Registrado'}</p>
                 <p className="text-xs text-slate-500 font-mono mt-0.5">Cédula: {cedula || 'N/A'}</p>
               </div>
               <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Seguro Médico (ARS)</p>
                 <p className="font-black text-univida-green uppercase tracking-tight">{ars}</p>
               </div>
            </div>

            {/* Tabla de Servicios */}
            <div className="mb-12">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b-2 border-slate-800 font-black text-[10px] uppercase tracking-widest text-slate-400">
                     <th className="py-3">Descripción del Servicio</th>
                     <th className="py-3 text-center">Cobertura</th>
                     <th className="py-3 text-right">Monto (RD$)</th>
                     <th className="py-3 w-10 print:hidden"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {items.map((item, idx) => (
                     <tr key={idx} className="group">
                       <td className="py-4 text-sm font-bold text-slate-800">{item.title}</td>
                       <td className="py-4 text-center">
                         {item.cubierto ? (
                           <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[9px] font-black uppercase tracking-widest">Aplica</span>
                         ) : (
                           <span className="text-slate-300 text-xs font-medium">-</span>
                         )}
                       </td>
                       <td className="py-4 text-right font-mono font-bold text-slate-600">
                         {item.precio.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                       </td>
                       <td className="py-4 text-right print:hidden">
                         <button onClick={() => removeItem(idx)} className="text-red-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </td>
                     </tr>
                   ))}
                   {items.length === 0 && (
                     <tr>
                       <td colSpan={4} className="py-12 text-center text-slate-400 text-xs italic">
                         No se han agregado servicios a la cotización.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
            </div>

            {/* Totales */}
            <div className="flex justify-end">
               <div className="w-full md:w-64 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Subtotal</span>
                    <span className="font-mono font-bold text-slate-700">RD$ {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {ars !== 'Privado' && descuentoARS > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-green-600">Cobertura ARS (Aprox)</span>
                      <span className="font-mono font-bold text-green-600">-RD$ {descuentoARS.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-slate-800">
                    <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Total a Pagar</span>
                    <span className="font-black text-xl text-univida-dark font-mono">RD$ {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
               </div>
            </div>

            {/* Footer Impresión */}
            <div className="mt-16 pt-8 border-t border-slate-100 text-center print:block text-[9px] text-slate-400 font-medium">
              <p>Esta cotización es válida por 30 días a partir de la fecha de emisión.</p>
              <p>Los valores de cobertura ARS son aproximados y sujetos a validación en el sistema físico del seguro.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
