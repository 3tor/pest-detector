export interface HistoryItem {
  id: string;
  date: string;
  crop_name: string;
  disease_name: string;
  status: string;
  severity: string;
  provider: string;
}

const STORAGE_KEY = 'pest_detector_history';

export const saveToHistory = (summary: any, provider: string) => {
  if (typeof window === 'undefined') return;

  const newItem: HistoryItem = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    crop_name: summary.crop_name,
    disease_name: summary.disease_name,
    status: summary.status,
    severity: summary.severity,
    provider: provider,
  };

  const existingHistory = getHistory();
  const updatedHistory = [newItem, ...existingHistory]; 
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};