
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, Hero, ServicesSection, AboutSection, ContactSection, AppointmentFormSection, AnalyticsSearch, Footer, HealthTipsSection } from './components/PublicViews';
import { AuthView, PatientWelcomeCinematic } from './components/AuthViews';
import { PatientDashboard } from './components/PatientViews';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard, AdminPatients, AdminDoctors, AdminAppointments, AdminAnalytics, AdminConfig, AdminWelcomeCinematic, AdminMessages } from './components/AdminViews';
import { AdminServices } from './components/AdminServices';
import { AdminCotizacion } from './components/AdminCotizacion';

const FloatingWhatsApp = () => (
  <motion.a
    href="https://wa.me/8095550199"
    target="_blank"
    rel="noreferrer"
    className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.1 }}
  >
    <MessageSquare className="w-6 h-6 fill-current" />
  </motion.a>
);

const MainLayout = () => {
  const { currentUser, loading } = useApp();
  const [view, setView] = useState<'Home' | 'Services' | 'Appointment' | 'Analytics' | 'Login' | 'Dashboard' | 'Contact' | 'Admin'>('Home');
  const [adminView, setAdminView] = useState('dashboard');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPatientWelcome, setShowPatientWelcome] = useState(false);
  const [lastUser, setLastUser] = useState<string | null>(null);

  // Handle auto-redirection if already logged in
  useEffect(() => {
    if (currentUser) {
       if (currentUser.id !== lastUser) {
          if (currentUser.role === 'ADMIN') {
             setShowWelcome(true);
          } else if (currentUser.role === 'PATIENT') {
             setShowPatientWelcome(true);
          }
          setLastUser(currentUser.id);
       }
       
       if (view === 'Login') {
          setView(currentUser.role === 'ADMIN' ? 'Admin' : 'Dashboard');
       }
    } else {
       setLastUser(null);
       if (view === 'Dashboard' || view === 'Admin') {
          setView('Home');
       }
    }
  }, [currentUser, view, lastUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-univida-green/20 border-t-univida-green rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Cargando Sistema UNIVIDA...</p>
      </div>
    );
  }

  // Admin View orchestration
  if (view === 'Admin' && currentUser?.role === 'ADMIN') {
    return (
      <>
        <AnimatePresence>
          {showWelcome && (
            <AdminWelcomeCinematic 
              user={currentUser} 
              onComplete={() => setShowWelcome(false)} 
            />
          )}
        </AnimatePresence>
        <AdminLayout activeView={adminView} setActiveView={setAdminView}>
        {adminView === 'dashboard' && <AdminDashboard />}
        {adminView === 'patients' && <AdminPatients />}
        {adminView === 'doctors' && <AdminDoctors />}
        {adminView === 'appointments' && <AdminAppointments />}
        {adminView === 'cotizacion' && <AdminCotizacion />}
        {adminView === 'analytics' && <AdminAnalytics />}
        {adminView === 'messages' && <AdminMessages />}
        {adminView === 'services' && <AdminServices />}
        {adminView === 'config' && <AdminConfig />}
      </AdminLayout>
    </>
    );
  }

  // Dashboard for Patient
  if (view === 'Dashboard' && currentUser?.role === 'PATIENT') {
    return (
      <>
        <AnimatePresence>
          {showPatientWelcome && (
            <PatientWelcomeCinematic 
              user={currentUser} 
              onComplete={() => setShowPatientWelcome(false)} 
            />
          )}
        </AnimatePresence>
        <PatientDashboard />
      </>
    );
  }

  // Auth View
  if (view === 'Login') {
    return <AuthView setView={setView} />;
  }

  // Public Views
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar setView={setView} currentView={view} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === 'Home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero setView={setView} />
              <AboutSection />
              <HealthTipsSection setView={setView} />
              <ServicesSection />
              <AppointmentFormSection />
              <ContactSection />
            </motion.div>
          )}
          {view === 'Services' && (
            <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ServicesSection />
            </motion.div>
          )}
          {view === 'Appointment' && (
            <motion.div key="appointment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AppointmentFormSection />
            </motion.div>
          )}
          {view === 'Analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AnalyticsSearch />
            </motion.div>
          )}
          {view === 'Contact' && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ContactSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer setView={setView} />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
