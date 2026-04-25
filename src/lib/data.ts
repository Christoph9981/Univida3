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
  { 
    title: 'Medicina General', 
    description: 'Atención integral para toda la familia. Evaluación inicial y referimiento médico.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 500, cubierto: true },
      { ars: 'Humano', precio: 800, cubierto: true },
      { ars: 'Mapfre', precio: 700, cubierto: true },
      { ars: 'Universal', precio: 750, cubierto: true },
      { ars: 'Privado', precio: 1500, cubierto: false }
    ]
  },
  { 
    title: 'Pediatría', 
    description: 'Cuidamos el crecimiento y salud de los más pequeños. Consultas de niño sano.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 600, cubierto: true },
      { ars: 'Humano', precio: 900, cubierto: true },
      { ars: 'Mapfre', precio: 800, cubierto: true },
      { ars: 'Universal', precio: 850, cubierto: true },
      { ars: 'Privado', precio: 2000, cubierto: false }
    ]
  },
  { 
    title: 'Ginecología', 
    description: 'Salud integral y especializada para la mujer. Papanicolaou y chequeos preventivos.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 700, cubierto: true },
      { ars: 'Humano', precio: 1000, cubierto: true },
      { ars: 'Mapfre', precio: 900, cubierto: true },
      { ars: 'Universal', precio: 950, cubierto: true },
      { ars: 'Privado', precio: 2500, cubierto: false }
    ]
  },
  { 
    title: 'Cardiología', 
    description: 'Prevención, diagnóstico y tratamiento de enfermedades cardiovasculares. ECG, Ecocardiogramas.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 1000, cubierto: true },
      { ars: 'Humano', precio: 1500, cubierto: true },
      { ars: 'Mapfre', precio: 1400, cubierto: true },
      { ars: 'Universal', precio: 1450, cubierto: true },
      { ars: 'Privado', precio: 3000, cubierto: false }
    ]
  },
  { 
    title: 'Dermatología', 
    description: 'Especialistas en el cuidado de la piel, cabello y uñas. Tratamiento de acné y manchas.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 800, cubierto: true },
      { ars: 'Humano', precio: 1200, cubierto: true },
      { ars: 'Mapfre', precio: 1100, cubierto: true },
      { ars: 'Universal', precio: 1150, cubierto: true },
      { ars: 'Privado', precio: 2500, cubierto: false }
    ]
  },
  { 
    title: 'Oftalmología', 
    description: 'Atención completa para la salud visual. Exámenes de la vista y diagnóstico de patologías.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 800, cubierto: true },
      { ars: 'Humano', precio: 1200, cubierto: true },
      { ars: 'Mapfre', precio: 1100, cubierto: true },
      { ars: 'Universal', precio: 1150, cubierto: true },
      { ars: 'Privado', precio: 2500, cubierto: false }
    ]
  },
  { 
    title: 'Odontología General', 
    description: 'Salud bucal preventiva y correctiva. Limpiezas, extracciones y empastes.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 300, cubierto: true },
      { ars: 'Humano', precio: 500, cubierto: true },
      { ars: 'Mapfre', precio: 450, cubierto: true },
      { ars: 'Universal', precio: 400, cubierto: true },
      { ars: 'Privado', precio: 1000, cubierto: false }
    ]
  },
  { 
    title: 'Nutrición y Dietética', 
    description: 'Asesoramiento nutricional para pérdida de peso o manejo de condiciones médicas.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 500, cubierto: false },
      { ars: 'Humano', precio: 500, cubierto: false },
      { ars: 'Mapfre', precio: 500, cubierto: false },
      { ars: 'Universal', precio: 500, cubierto: false },
      { ars: 'Privado', precio: 1500, cubierto: false }
    ]
  },
  { 
    title: 'Psicología Clínica', 
    description: 'Apoyo emocional y terapia para la salud mental. Ansiedad, depresión, parejas.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 600, cubierto: true },
      { ars: 'Humano', precio: 900, cubierto: true },
      { ars: 'Mapfre', precio: 850, cubierto: true },
      { ars: 'Universal', precio: 800, cubierto: true },
      { ars: 'Privado', precio: 2000, cubierto: false }
    ]
  },
  { 
    title: 'Ortopedia y Traumatología', 
    description: 'Atención a lesiones de huesos, articulaciones y músculos. Yesos y fisioterapia básica.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 900, cubierto: true },
      { ars: 'Humano', precio: 1300, cubierto: true },
      { ars: 'Mapfre', precio: 1200, cubierto: true },
      { ars: 'Universal', precio: 1250, cubierto: true },
      { ars: 'Privado', precio: 2800, cubierto: false }
    ]
  },
  { 
    title: 'Fisioterapia y Rehabilitación', 
    description: 'Recuperación de la movilidad post-lesiones o cirugías. Terapias de frío/calor.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 400, cubierto: true },
      { ars: 'Humano', precio: 600, cubierto: true },
      { ars: 'Mapfre', precio: 550, cubierto: true },
      { ars: 'Universal', precio: 500, cubierto: true },
      { ars: 'Privado', precio: 1200, cubierto: false }
    ]
  },
  { 
    title: 'Laboratorio Clínico', 
    description: 'Analíticas precisas con tecnología de punta. Hemogramas, perfiles lipídicos, orina.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 0, cubierto: true },
      { ars: 'Humano', precio: 0, cubierto: true },
      { ars: 'Mapfre', precio: 0, cubierto: true },
      { ars: 'Universal', precio: 0, cubierto: true },
      { ars: 'Privado', precio: 500, cubierto: false }
    ]
  },
  { 
    title: 'Imágenes y Sonografía', 
    description: 'Diagnósticos precisos mediante ultrasonido. Abdominal, pélvica, obstétrica.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 600, cubierto: true },
      { ars: 'Humano', precio: 800, cubierto: true },
      { ars: 'Mapfre', precio: 750, cubierto: true },
      { ars: 'Universal', precio: 700, cubierto: true },
      { ars: 'Privado', precio: 1800, cubierto: false }
    ]
  },
  { 
    title: 'Medicina Preventiva', 
    description: 'Chequeos ejecutivos y evaluaciones preventivas integrales para empresas.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 1000, cubierto: false },
      { ars: 'Humano', precio: 1000, cubierto: false },
      { ars: 'Mapfre', precio: 1000, cubierto: false },
      { ars: 'Universal', precio: 1000, cubierto: false },
      { ars: 'Privado', precio: 3500, cubierto: false }
    ]
  },
  { 
    title: 'Gastroenterología', 
    description: 'Especialistas en el sistema digestivo. Endoscopias y tratamiento de gastritis.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 900, cubierto: true },
      { ars: 'Humano', precio: 1400, cubierto: true },
      { ars: 'Mapfre', precio: 1300, cubierto: true },
      { ars: 'Universal', precio: 1350, cubierto: true },
      { ars: 'Privado', precio: 2800, cubierto: false }
    ]
  },
  { 
    title: 'Neurología', 
    description: 'Atención a trastornos del sistema nervioso, migrañas y epilepsia.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 1200, cubierto: true },
      { ars: 'Humano', precio: 1800, cubierto: true },
      { ars: 'Mapfre', precio: 1600, cubierto: true },
      { ars: 'Universal', precio: 1700, cubierto: true },
      { ars: 'Privado', precio: 3500, cubierto: false }
    ]
  },
  { 
    title: 'Endocrinología', 
    description: 'Manejo de diabetes, tiroides y trastornos hormonales.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 1000, cubierto: true },
      { ars: 'Humano', precio: 1500, cubierto: true },
      { ars: 'Mapfre', precio: 1400, cubierto: true },
      { ars: 'Universal', precio: 1450, cubierto: true },
      { ars: 'Privado', precio: 3000, cubierto: false }
    ]
  },
  { 
    title: 'Urología', 
    description: 'Salud del sistema urinario y aparato reproductor masculino. Chequeo de próstata.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 900, cubierto: true },
      { ars: 'Humano', precio: 1400, cubierto: true },
      { ars: 'Mapfre', precio: 1300, cubierto: true },
      { ars: 'Universal', precio: 1350, cubierto: true },
      { ars: 'Privado', precio: 2800, cubierto: false }
    ]
  },
  { 
    title: 'Otorrinolaringología', 
    description: 'Atención de oído, nariz y garganta. Tratamiento de sinusitis y pérdida auditiva.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 900, cubierto: true },
      { ars: 'Humano', precio: 1400, cubierto: true },
      { ars: 'Mapfre', precio: 1300, cubierto: true },
      { ars: 'Universal', precio: 1350, cubierto: true },
      { ars: 'Privado', precio: 2800, cubierto: false }
    ]
  },
  { 
    title: 'Vacunación', 
    description: 'Protección para todas las etapas de la vida. Esquema nacional PAI y vacunas extra.',
    active: true,
    prices: [
      { ars: 'SENASA', precio: 0, cubierto: true },
      { ars: 'Humano', precio: 0, cubierto: true },
      { ars: 'Mapfre', precio: 0, cubierto: true },
      { ars: 'Universal', precio: 0, cubierto: true },
      { ars: 'Privado', precio: 800, cubierto: false }
    ]
  }
];
