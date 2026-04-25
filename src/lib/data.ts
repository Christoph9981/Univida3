/**
 * Mock data for UNIVIDA simulation
 */

export interface Appointment {
  id: string;
  patientId: string;
  area: string;
  date: string;
  time: string;
  status: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';
  reason?: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  cedula: string;
  code: string;
  date: string;
  type: string;
  status: 'Disponible' | 'En proceso' | 'Entregado';
}

export const APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientId: '12345678901',
    area: 'Medicina General',
    date: '2026-05-15',
    time: '09:00 AM',
    status: 'Pendiente',
    reason: 'Chequeo rutinario'
  },
  {
    id: '2',
    patientId: '12345678901',
    area: 'Pediatría',
    date: '2026-04-10',
    time: '02:30 PM',
    status: 'Completada'
  }
];

export const LAB_RESULTS: LabResult[] = [
  {
    id: 'R001',
    patientId: '12345678901',
    patientName: 'Juan Pérez',
    cedula: '123-XXXXX-1',
    code: 'ANA-9922',
    date: '2026-04-20',
    type: 'Hemograma Completo',
    status: 'Disponible'
  },
  {
    id: 'R002',
    patientId: '12345678901',
    patientName: 'Juan Pérez',
    cedula: '123-XXXXX-1',
    code: 'ANA-1155',
    date: '2026-04-22',
    type: 'Perfil Lipídico',
    status: 'En proceso'
  }
];

export const SERVICES = [
  { title: 'Medicina General', description: 'Atención integral para toda la familia.' },
  { title: 'Pediatría', description: 'Cuidamos el crecimiento y salud de los más pequeños.' },
  { title: 'Ginecología', description: 'Salud integral y especializada para la mujer.' },
  { title: 'Laboratorio', description: 'Analíticas precisas con tecnología de punta.' },
  { title: 'Vacunación', description: 'Protección para todas las etapas de la vida.' }
];
