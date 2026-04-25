
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, User, Lock, ArrowRight, CheckCircle2, ChevronLeft, AlertCircle, Heart } from 'lucide-react';
import { User as UserType } from '../types';

import { Branding, Logo } from './Branding';
import { DOMINICAN_INSURANCES } from '../constants';


export const PatientWelcomeCinematic = ({ user, onComplete }: { user: UserType, onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center text-center px-8 overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8 flex justify-center"
        >
          <div className="bg-univida-green/10 p-6 rounded-full">
            <Heart className="w-20 h-20 text-univida-green fill-univida-green" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-black text-slate-800 mb-4 tracking-tight"
        >
          Bienvenido, {user.nombre} <span className="inline-block text-univida-green">💚</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-500 text-xl md:text-2xl font-medium max-w-lg mx-auto leading-relaxed"
        >
          Salud que crece contigo
        </motion.p>
      </motion.div>

      {/* Decorative blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-univida-green/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-univida-green/5 rounded-full blur-3xl pointer-events-none"
      />
    </motion.div>
  );
};

export const AuthView = ({ setView }: { setView: (v: any) => void }) => {
  const { login, loginWithGoogle, registerPatient, registerAdmin, currentUser } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    cedula: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    seguro: 'Senasa (Contributivo)'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cedulaClean = formData.cedula.trim().replace(/-/g, '').toLowerCase();
      setError('');
      setSuccess('');
      if (isRegister) {
        await registerPatient({
          nombre: formData.nombre,
          apellido: formData.apellido,
          cedula: cedulaClean,
          telefono: formData.telefono,
          seguro: formData.seguro,
          password: formData.password
        });
        const user = await login(cedulaClean, formData.password);
        if (user) setView('Dashboard');
      } else {
        let user = await login(cedulaClean, formData.password);
        
        // Bootstrapping admin/admin
        if (!user && cedulaClean === 'admin' && formData.password === 'admin') {
          try {
            await registerAdmin({
              cedula: 'admin',
              nombre: 'Admin',
              apellido: 'Sistema',
              position: 'Director General'
            });
            user = await login('admin', 'admin');
          } catch (bootErr: any) {
            console.error("Bootstrap error:", bootErr);
            if (bootErr.code === 'auth/operation-not-allowed') {
              throw new Error('DEBES HABILITAR "Email/Password" en la consola de Firebase -> Authentication -> Sign-in method.');
            }
          }
        }

        if (user) {
           setView(user.role === 'ADMIN' ? 'Admin' : 'Dashboard');
        } else {
           setError('Credenciales inválidas. Por favor verifique su cédula y contraseña.');
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('DEBES HABILITAR "Email/Password" en la consola de Firebase (Sección Authentication).');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Esta cédula ya está registrada.');
      } else {
        if (err.code === 'auth/invalid-credential') {
          setError('Cédula o contraseña incorrecta. Si es su primer acceso como administrador, pruebe con "admin" y "admin".');
        } else {
          setError(err.message || 'Error de autenticación. Intente de nuevo.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle();
      if (user) setView(user.role === 'ADMIN' ? 'Admin' : 'Dashboard');
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError('El navegador bloqueó la ventana emergente. Por favor, permítala.');
      } else {
        setError(err.message || 'Error al iniciar sesión con Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyAdmin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await registerAdmin({
        cedula: 'admin',
        nombre: 'Administrador',
        apellido: 'Sistema',
        position: 'Emergencia',
        password: 'admin'
      });
      setSuccess('¡Cuenta de emergencia creada! Use usuario "admin" y contraseña "admin".');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('El administrador "admin" ya existe. Intente iniciar sesión.');
      } else {
        setError(err.message || 'Error al crear cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-8 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-univida-green/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="p-12 pb-0 text-center">
             <div className="flex justify-center mb-10">
                <Logo className="w-20 h-20" />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {isAdminLogin ? 'Acceso Admin' : isRegister ? 'Registro Paciente' : 'Acceso Pacientes'}
             </h2>
             <p className="text-slate-500 text-sm font-medium">Gestiona tu salud en UNIVIDA.</p>
          </div>

          {/* Form */}
          <div className="p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-500">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none text-center flex-1">{success}</p>
                </motion.div>
              )}

              <div className="space-y-5">
                {isRegister && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Nombre</label>
                      <input 
                        required 
                        value={formData.nombre}
                        onChange={e => setFormData({...formData, nombre: e.target.value})}
                        type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:border-univida-green outline-none text-sm transition-all" placeholder="Juan" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Apellido</label>
                      <input 
                        required 
                        value={formData.apellido}
                        onChange={e => setFormData({...formData, apellido: e.target.value})}
                        type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:border-univida-green outline-none text-sm transition-all" placeholder="Pérez" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                    Cédula
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required 
                      value={formData.cedula}
                      onChange={e => setFormData({...formData, cedula: e.target.value})}
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 focus:border-univida-green outline-none font-mono text-sm transition-all" 
                      placeholder={isAdminLogin ? "admin" : "000-0000000-0"} />
                  </div>
                </div>

                {isRegister && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">WhatsApp</label>
                      <input 
                        required 
                        value={formData.telefono}
                        onChange={e => setFormData({...formData, telefono: e.target.value})}
                        type="tel" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:border-univida-green outline-none text-sm transition-all" placeholder="809-XXX-XXXX" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Seguro Médico</label>
                      <select 
                        value={formData.seguro}
                        onChange={e => setFormData({...formData, seguro: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:border-univida-green outline-none text-sm font-bold text-slate-600 appearance-none">
                        {DOMINICAN_INSURANCES.map(ins => (
                          <option key={ins} value={ins}>{ins}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required 
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      type="password" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 focus:border-univida-green outline-none font-mono text-sm transition-all" 
                      placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-univida-green text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:bg-univida-dark transition-all shadow-xl shadow-univida-green/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Procesando...' : isRegister ? 'Confirmar Registro' : 'Iniciar Sesión'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                  <span className="bg-white px-4 text-slate-400">O continuar con</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border border-slate-200 text-slate-600 rounded-[1.25rem] py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar con Google
              </button>
            </form>

            <div className="mt-12 flex flex-col items-center gap-4">
               {!isAdminLogin && (
                 <button 
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-[10px] font-black text-slate-400 hover:text-univida-green transition-all uppercase tracking-[0.2em]"
                  >
                    {isRegister ? '¿Ya tienes cuenta? Ingresa aquí' : '¿Eres un paciente nuevo? Regístrate'}
                  </button>
               )}
               

               
               <button 
                  onClick={() => {
                    setIsAdminLogin(!isAdminLogin);
                    setIsRegister(false);
                    setError('');
                  }}
                  className="flex items-center gap-2 text-[10px] font-black text-slate-300 hover:text-univida-dark transition-all uppercase tracking-widest"
                >
                  {isAdminLogin ? <ChevronLeft className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  {isAdminLogin ? 'Volver a Acceso Pacientes' : 'Acceso Personal Administrativo'}
                </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
           <button onClick={() => setView('Home')} className="text-xs font-black text-slate-300 hover:text-slate-800 transition-all uppercase tracking-widest">
              ← Volver al sitio público
           </button>
        </div>
      </motion.div>
    </section>
  );
};
