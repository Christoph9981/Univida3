
export type UserRole = 'PATIENT' | 'ADMIN';

export type AdminPermission = 'MANAGE_PATIENTS' | 'MANAGE_APPOINTMENTS' | 'MANAGE_ANALYTICS' | 'MANAGE_SERVICES' | 'MANAGE_SYSTEM' | 'VIEW_DASHBOARD' | 'MANAGE_WEB_CONTENT';

export interface User {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  seguro: string;
  password?: string;
  role: UserRole;
  position?: string;
  fechaRegistro: string;
  permissions?: AdminPermission[]; // For ADMIN role
}

export type AppointmentStatus = 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  cedula: string;
  area: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  seguro: string;
  telefono: string;
  reason?: string;
  createdAt: string;
}

export type LabResultStatus = 'En proceso' | 'Disponible' | 'Entregado';

export interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  cedula: string;
  code: string;
  date: string;
  type: string;
  status: LabResultStatus;
  fileUrl?: string;
  observaciones?: string;
  createdAt: string;
}

export interface ServicePrice {
  ars: string;
  precio: number;
  cubierto: boolean;
}

export interface MedicalService {
  id: string;
  title: string;
  description: string;
  active: boolean;
  icon?: string;
  prices?: ServicePrice[];
}

export interface CotizacionItem {
  serviceId: string;
  title: string;
  precio: number;
  cubierto: boolean;
}

export interface Cotizacion {
  id: string;
  patientName: string;
  cedula: string;
  ars: string;
  items: CotizacionItem[];
  subtotal: number;
  descuentoARS: number;
  total: number;
  createdAt: string;
}

export interface AppConfig {
  nombreCentro: string;
  telefono: string;
  direccion: string;
  horarios: {
    semana: string;
    sabado: string;
  };
  institucional: string;
  // Dynamic Web Content
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  aboutText?: string;
  aboutImage?: string;
}

export interface Doctor {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  cedula: string;
  consultorio?: string;
  activo: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  fromRole: string;
  toId: string; // Recipient UID
  participants: string[]; // [fromId, toId]
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
}
