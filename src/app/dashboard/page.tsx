'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { UploadDropzone } from '@/components/dashboard/upload-dropzone';
import { ScanResultsView } from '@/components/dashboard/scan-results-view';
import { ScanBreakdownGrid } from '@/components/dashboard/scan-breakdown-grid';
import { useImageScan } from '@/hooks/use-image-scan';
import { AlertTriangle } from 'lucide-react'; 

export default function DashboardPage() {
  const { 
    selectedFile,
    imagePreviewUrl,
    isScanning, 
    scanResults, 
    error,   
    selectedProvider,        
    handleFileSelect, 
    resetScan 
  } = useImageScan();

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onNewScan={resetScan} />
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          
          {/* State 1: No file selected & No Errors */}
          {!selectedFile && !isScanning && !scanResults && !error && (
            <UploadDropzone 
              onFileSelected={handleFileSelect} 
              isScanning={false} 
            />
          )}

          {/* State 2: Loading / Analyzing */}
          {isScanning && !error && (
            <div className="w-full bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[400px] shadow-sm">
              <div className="w-14 h-14 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin mb-6"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing crop health...</h2>
              <p className="text-sm text-gray-500">Identifying diseases, pests, and generating a treatment plan.</p>
            </div>
          )}

          {/* State 3: Error Handling */}
          {error && !isScanning && (
            <div className="w-full bg-red-50 rounded-2xl border border-red-100 p-12 flex flex-col items-center justify-center min-h-[400px] shadow-sm text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
              <p className="text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
                {error}
              </p>
              <button 
                onClick={resetScan}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-all shadow-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* State 4: Results Display */}
          {scanResults && !isScanning && !error && selectedFile && imagePreviewUrl && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Wrap both the summary and treatment breakdown so the PDF includes the complete report */}
              <div id="scan-results-container" className="p-4 bg-white rounded-2xl space-y-6">
                <ScanResultsView 
                  imagePreviewUrl={imagePreviewUrl}
                  file={selectedFile}
                  summary={scanResults.summary}
                  provider={selectedProvider}
                  onReset={resetScan}
                />
                <ScanBreakdownGrid breakdown={scanResults.breakdown} />
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}