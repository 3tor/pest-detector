'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { getHistory, clearHistory, HistoryItem } from '@/lib/utils/history-storage';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from local storage on component mount
  useEffect(() => {
    setHistory(getHistory());
    setIsLoaded(true);
  }, []);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire scan history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const providerNames: Record<string, string> = {
    gemini: 'Google Gemini',
    huggingface: 'Hugging Face',
    plantid: 'Plant.id',
    groq: 'Groq (Llama 3.2 Vision)',
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-100 py-5 px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Scan History</h2>
            <p className="text-sm text-gray-500 mt-1">Review your previous crop diagnoses</p>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              Clear History
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {!isLoaded ? (
              <div className="text-center text-gray-500 py-12">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No analysis yet</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Your analysis history will appear here once you upload your first crop image.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Crop</th>
                        <th className="px-6 py-4">Diagnosis</th>
                        <th className="px-6 py-4">Severity</th>
                        <th className="px-6 py-4">Engine</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {history.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {new Date(item.date).toLocaleDateString(undefined, { 
                              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.crop_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {item.disease_name}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'Healthy' 
                                ? 'bg-green-50 text-green-700' 
                                : (item.severity === 'High' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700')
                            }`}>
                              {item.severity === 'None' ? 'Healthy' : item.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {providerNames[item.provider] || item.provider}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}