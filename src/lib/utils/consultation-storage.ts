export interface ConsultationRequest {
  id: string;
  scanCrop: string;
  scanDisease: string;
  agronomistName: string;
  contactInfo: string;
  notes: string;
  date: string;
  status: string;
}

const STORAGE_KEY = 'pest_detector_consultations';

export const saveConsultation = (request: Omit) => {
  if (typeof window === 'undefined') return;

  const newConsultation: ConsultationRequest = {
    ...request,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    status: 'Pending Review',
  };

  const existing = getConsultations();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newConsultation, ...existing]));
};

export const getConsultations = (): ConsultationRequest[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};