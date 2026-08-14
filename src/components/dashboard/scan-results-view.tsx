'use client';

import React, { useState } from 'react';
import { exportResultsToPdf } from '@/lib/utils/export-pdf';
import { ConsultationModal } from './consultation-modal';

interface ScanResultsProps {
  imagePreviewUrl: string;
  file: File;
  summary: any;
  provider: string | null;
  onReset: () => void;
}

export const ScanResultsView = ({ imagePreviewUrl, file, summary, provider, onReset }: ScanResultsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
  
  const badgeColor = summary.status === 'Healthy' 
    ? 'bg-green-500' 
    : (summary.severity === 'High' ? 'bg-red-500' : 'bg-orange-500');

  const providerNames: Record<string, string> = {
    gemini: 'Google Gemini',
    huggingface: 'Hugging Face',
    plantid: 'Plant.id',
    groq: 'Groq (Llama 3.2 Vision)',
  };

  const displayProvider = (provider && providerNames[provider]) || 'Google Gemini';

  const handleExport = async () => {
    setIsExporting(true);
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `${summary.crop_name.toLowerCase().replace(/\s+/g, '-')}-analysis-${dateStr}.pdf`;
    
    await exportResultsToPdf('scan-results-container', fileName);
    setIsExporting(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col lg:flex-row gap-8">
      
      {/* 1. Image Preview Block */}
      <div className="relative w-full lg:w-3/5 rounded-xl overflow-hidden bg-gray-100 h-[340px]">
        <img 
          src={imagePreviewUrl} 
          alt="Scanned crop" 
          className="w-full h-full object-cover"
        />
        
        <div className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full ${badgeColor}`}>
          {summary.badge}
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-gray-700 shadow-sm truncate max-w-[150px]">
            {file.name}
          </div>
          <div className="bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-gray-700 shadow-sm">
            {fileSizeMB} MB
          </div>
        </div>
      </div>

      {/* 2. Summary Text Block */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Detected Disease: {summary.disease_name}</h2>
        <p className="text-sm font-medium text-[#2563EB] mb-4">Detected Crop: {summary.crop_name}</p>
        <div className="h-px w-full bg-gray-100 mb-6"></div>
        
        <div className="space-y-3 mb-8 text-sm">
          <p><span className="text-gray-500 mr-2">Health Status:</span> <span className="font-medium text-gray-900">{summary.status}</span></p>
          <p><span className="text-gray-500 mr-2">Severity Level:</span> <span className="font-medium text-gray-900">{summary.severity}</span></p>
          <p><span className="text-gray-500 mr-2">AI Confidence:</span> <span className="font-medium text-gray-900">{summary.confidence}</span></p>
          <p><span className="text-gray-500 mr-2">Vision Engine:</span> <span className="font-medium text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">{displayProvider}</span></p>
        </div>

        {/* 3. Action Buttons (Hidden from PDF export via data attribute) */}
        <div className="flex flex-wrap gap-3 mt-auto" data-html2canvas-ignore="true">
          <button 
            onClick={onReset}
            className="px-5 py-2 border border-gray-200 text-[#2563EB] font-medium text-sm rounded-full hover:bg-gray-50 transition-colors"
          >
            Scan another
          </button>
          
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-full transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </>
            )}
          </button>

          {/* Conditionally render the Consultation Button only if NOT healthy */}
          {summary.status !== 'Healthy' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-sm rounded-full transition-colors shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Talk to Expert
            </button>
          )}
        </div>
      </div>

      {/* 4. The Consultation Modal */}
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        summary={summary}
      />
    </div>
  );
};