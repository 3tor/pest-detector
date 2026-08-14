'use client';

import React, { useState } from 'react';
import { saveConsultation } from '@/lib/utils/consultation-storage';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: any;
}

const MOCK_AGRONOMISTS = [
  { id: 'a1', name: 'Dr. Sarah Jenkins', specialty: 'Fungal Pathogens & Soil Health' },
  { id: 'a2', name: 'Dr. Kwame Osei', specialty: 'Tropical Crops & Pest Control' },
  { id: 'a3', name: 'Elena Rodriguez, MSc', specialty: 'Organic Treatments & Prevention' },
];

export const ConsultationModal = ({ isOpen, onClose, summary }: ConsultationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const requestData = {
      scanCrop: summary.crop_name,
      scanDisease: summary.disease_name,
      agronomistName: formData.get('agronomist') as string,
      contactInfo: formData.get('contact') as string,
      notes: formData.get('notes') as string,
    };

    setTimeout(() => {
      saveConsultation(requestData);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Auto-close after showing success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Request Expert Consultation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Request Sent!</h4>
              <p className="text-sm text-gray-500 mt-2">The expert has received your image and notes. They will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
                <p className="text-sm text-gray-600">
                  Attaching scan data: <span className="font-semibold text-gray-900">{summary.crop_name} - {summary.disease_name}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Agronomist</label>
                <select 
                  name="agronomist" 
                  required
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent block p-2.5 outline-none"
                >
                  <option value="">Choose an expert...</option>
                  {MOCK_AGRONOMISTS.map(a => (
                    <option key={a.id} value={a.name}>{a.name} — {a.specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Contact Email/Phone</label>
                <input 
                  type="text" 
                  name="contact" 
                  required
                  placeholder="e.g., farmer@example.com"
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent block p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Field Notes</label>
                <textarea 
                  name="notes" 
                  rows={3}
                  required
                  placeholder="When did you first notice this? Any recent weather changes?"
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent block p-2.5 outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-[#2563EB] text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};