
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onSnapshot, collection, doc, setDoc, updateDoc, deleteDoc, 
  query, where, addDoc, getDoc, getDocs, or 
} from 'firebase/firestore';
import { 
  onAuthStateChanged, signOut, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, updateProfile 
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { User, Appointment, LabResult, MedicalService, AppConfig, Doctor, Message } from '../types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  appointments: Appointment[];
  labResults: LabResult[];
  services: MedicalService[];
  doctors: Doctor[];
  messages: Message[];
  config: AppConfig;
  isOffline: boolean;
  loading: boolean;
  
  // Actions
  loginWithGoogle: () => Promise<User | null>;
  login: (cedula: string, pass: string) => Promise<User | null>;
  logout: () => void;
  registerPatient: (userData: Partial<User>) => Promise<User>;
  registerAdmin: (userData: Partial<User>) => Promise<User>;
  
  addAppointment: (apt: Partial<Appointment>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  addLabResult: (result: Partial<LabResult>) => Promise<void>;
  deleteLabResult: (id: string) => Promise<void>;
  updateConfig: (newConfig: Partial<AppConfig>) => Promise<void>;
  toggleService: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  updateLabResult: (id: string, updates: Partial<LabResult>) => Promise<void>;
  addService: (service: Partial<MedicalService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addDoctor: (dr: Partial<Doctor>) => Promise<void>;
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  sendMessage: (msg: Partial<Message>) => Promise<void>;
  markMessageAsRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    nombreCentro: 'UNIVIDA',
    telefono: '809-555-0199',
    direccion: 'Calle Srta. Ana, Herrera. Santo Domingo, R.D.',
    horarios: { semana: '8:00 AM - 6:00 PM', sabado: '8:00 AM - 12:00 PM' },
    institucional: 'UNIVIDA es un Centro de Atención Primaria...',
  });

  // Auth synchronization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as User);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore listeners
  useEffect(() => {
    if (!currentUser) return;

    // Users (Admins see all, patients see themselves AND admins)
    const usersQuery = currentUser.role === 'ADMIN' 
      ? collection(db, 'users')
      : query(collection(db, 'users'), or(where('role', '==', 'ADMIN'), where('cedula', '==', currentUser.cedula)));

    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as User)));
    });

    // Appointments
    const aptQuery = currentUser.role === 'ADMIN'
      ? collection(db, 'appointments')
      : query(collection(db, 'appointments'), where('patientId', '==', currentUser.id));
    
    const unsubApts = onSnapshot(aptQuery, (snapshot) => {
      setAppointments(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)));
    });

    // Lab Results
    const labQuery = currentUser.role === 'ADMIN'
      ? collection(db, 'labResults')
      : query(collection(db, 'labResults'), where('patientId', '==', currentUser.id));

    const unsubLabs = onSnapshot(labQuery, (snapshot) => {
      setLabResults(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as LabResult)));
    });

    // Messages (Admins see all messages, patients see messages TO them OR FROM them)
    const msgQuery = currentUser.role === 'ADMIN'
      ? collection(db, 'messages')
      : query(collection(db, 'messages'), where('participants', 'array-contains', currentUser.id));

    const unsubMsgs = onSnapshot(msgQuery, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
    });

    return () => {
      unsubUsers();
      unsubApts();
      unsubLabs();
      unsubMsgs();
    };
  }, [currentUser]);

  // Public listeners (Doctors, Services, Config)
  useEffect(() => {
    const unsubDoctors = onSnapshot(collection(db, 'doctors'), (snapshot) => {
      setDoctors(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Doctor)));
    });
    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      setServices(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MedicalService)));
    });
    const unsubConfig = onSnapshot(doc(db, 'config', 'main'), (snapshot) => {
      if (snapshot.exists()) setConfig(snapshot.data() as AppConfig);
    });

    return () => {
      unsubDoctors();
      unsubServices();
      unsubConfig();
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auth actions
  const loginWithGoogle = async () => {
    try {
      const { signInWithGoogle } = await import('../lib/firebase');
      const userCredential = await signInWithGoogle();
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user profile for Google login
        const isDev = firebaseUser.email === 'christopherluis000@gmail.com';
        const newUser: User = {
          id: firebaseUser.uid,
          cedula: firebaseUser.email?.split('@')[0] || 'google-user',
          nombre: firebaseUser.displayName?.split(' ')[0] || 'Usuario',
          apellido: firebaseUser.displayName?.split(' ').slice(1).join(' ') || 'Google',
          telefono: '',
          seguro: 'N/A',
          role: isDev ? 'ADMIN' : 'PATIENT',
          fechaRegistro: new Date().toISOString().split('T')[0],
          position: isDev ? 'Director General (Dev)' : undefined,
          permissions: isDev ? ['VIEW_DASHBOARD', 'MANAGE_PATIENTS', 'MANAGE_APPOINTMENTS', 'MANAGE_ANALYTICS', 'MANAGE_SERVICES', 'MANAGE_SYSTEM', 'MANAGE_WEB_CONTENT'] : undefined
        };
        await setDoc(userDocRef, newUser);
        setCurrentUser(newUser);
        return newUser;
      } else {
        const userData = userDoc.data() as User;
        // Auto-upgrade developer email if they are not admin yet
        if (firebaseUser.email === 'christopherluis000@gmail.com' && userData.role !== 'ADMIN') {
          const updates = { 
            role: 'ADMIN' as const, 
            position: 'Director General (Dev)',
            permissions: ['VIEW_DASHBOARD', 'MANAGE_PATIENTS', 'MANAGE_APPOINTMENTS', 'MANAGE_ANALYTICS', 'MANAGE_SERVICES', 'MANAGE_SYSTEM', 'MANAGE_WEB_CONTENT']
          };
          await updateDoc(userDocRef, updates);
          const updatedUser = { ...userData, ...updates };
          setCurrentUser(updatedUser);
          return updatedUser;
        }
        setCurrentUser(userData);
        return userData;
      }
    } catch (error) {
      console.error("Google Login error:", error);
      throw error;
    }
  };

  const login = async (cedula: string, pass: string) => {
    try {
      const email = `${cedula.trim().toLowerCase()}@univida.app`;
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setCurrentUser(userData);
        return userData;
      }
      return null;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error; // Rethrow to allow UI to handle specific codes
    }
  };

  const logout = () => signOut(auth);

  const registerPatient = async (userData: Partial<User>) => {
    const email = `${userData.cedula}@univida.app`;
    const password = userData.password || '123456';
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser: User = {
      id: userCredential.user.uid,
      cedula: userData.cedula || '',
      nombre: userData.nombre || '',
      apellido: userData.apellido || '',
      telefono: userData.telefono || '',
      seguro: userData.seguro || '',
      role: 'PATIENT',
      fechaRegistro: new Date().toISOString().split('T')[0],
    };
    
    await setDoc(doc(db, 'users', newUser.id), newUser);
    return newUser;
  };

  const registerAdmin = async (userData: Partial<User>) => {
    const email = `${userData.cedula}@univida.app`;
    const password = userData.password || 'admin123';
    
    // Check if user already exists in Auth to avoid failure if bootstrapping twice
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        // Just try to sign in to get the UID if it already exists
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        throw err;
      }
    }
    
    const newUser: User = {
      id: userCredential.user.uid,
      cedula: userData.cedula || '',
      nombre: userData.nombre || '',
      apellido: userData.apellido || '',
      telefono: userData.telefono || '',
      seguro: 'N/A',
      role: 'ADMIN',
      position: userData.position || 'Personal Administrativo',
      fechaRegistro: new Date().toISOString().split('T')[0],
      permissions: userData.permissions || ['VIEW_DASHBOARD', 'MANAGE_PATIENTS', 'MANAGE_APPOINTMENTS', 'MANAGE_ANALYTICS', 'MANAGE_SERVICES', 'MANAGE_SYSTEM', 'MANAGE_WEB_CONTENT']
    };
    
    await setDoc(doc(db, 'users', newUser.id), newUser);
    return newUser;
  };

  const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
    // Notes: Real Firebase Auth user deletion requires admin SDK or separate logic
  };
  
  const updateUser = async (id: string, updates: Partial<User>) => {
    await updateDoc(doc(db, 'users', id), updates);
  };

  const addAppointment = async (apt: Partial<Appointment>) => {
    const newDocRef = doc(collection(db, 'appointments'));
    await setDoc(newDocRef, {
      ...apt,
      id: newDocRef.id,
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
    });
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    await updateDoc(doc(db, 'appointments', id), { status });
  };

  const addLabResult = async (result: Partial<LabResult>) => {
    const newDocRef = doc(collection(db, 'labResults'));
    await setDoc(newDocRef, {
      ...result,
      id: newDocRef.id,
      code: result.code || `ANA-${Math.floor(Math.random()*9000)+1000}`,
      status: result.status || 'En proceso',
      createdAt: new Date().toISOString(),
    });
  };

  const deleteLabResult = async (id: string) => {
    await deleteDoc(doc(db, 'labResults', id));
  };

  const updateLabResult = async (id: string, updates: Partial<LabResult>) => {
    await updateDoc(doc(db, 'labResults', id), updates);
  };
  
  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    await setDoc(doc(db, 'config', 'main'), newConfig, { merge: true });
  };

  const toggleService = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (service) {
      await updateDoc(doc(db, 'services', id), { active: !service.active });
    }
  };

  const addService = async (service: Partial<MedicalService>) => {
    const newDocRef = doc(collection(db, 'services'));
    await setDoc(newDocRef, {
      ...service,
      id: newDocRef.id,
      active: service.active ?? true
    });
  };

  const deleteService = async (id: string) => {
    await deleteDoc(doc(db, 'services', id));
  };

  const addDoctor = async (dr: Partial<Doctor>) => {
    const newDocRef = doc(collection(db, 'doctors'));
    await setDoc(newDocRef, {
      ...dr,
      id: newDocRef.id,
      activo: dr.activo ?? true,
      createdAt: new Date().toISOString(),
    });
  };

  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    await updateDoc(doc(db, 'doctors', id), updates);
  };

  const deleteDoctor = async (id: string) => {
    await deleteDoc(doc(db, 'doctors', id));
  };

  const sendMessage = async (msg: Partial<Message>) => {
    const newDocRef = doc(collection(db, 'messages'));
    await setDoc(newDocRef, {
      ...msg,
      id: newDocRef.id,
      read: false,
      participants: [msg.fromId, msg.toId], // Added for easier querying
      createdAt: new Date().toISOString(),
    });
  };

  const markMessageAsRead = async (id: string) => {
    await updateDoc(doc(db, 'messages', id), { read: true });
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      users, appointments, labResults, services, doctors, messages, config, isOffline, loading,
      login, loginWithGoogle, logout, registerPatient, registerAdmin,
      addAppointment, updateAppointmentStatus,
      addLabResult, deleteLabResult, updateConfig, toggleService, deleteUser,
      updateUser, updateLabResult, addService, deleteService,
      addDoctor, updateDoctor, deleteDoctor,
      sendMessage, markMessageAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
