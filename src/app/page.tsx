'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { UploadDropzone } from '@/components/dashboard/upload-dropzone';
import { ScanResultsView } from '@/components/dashboard/scan-results-view';
import { ScanBreakdownGrid } from '@/components/dashboard/scan-breakdown-grid';
import { useImageScan } from '@/hooks/use-image-scan';

export default function DashboardPage() {
  const { 
    selectedFile,
    imagePreviewUrl,
    isScanning, 
    scanResults, 
    handleFileSelect, 
    resetScan 
  } = useImageScan();

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onNewScan={resetScan} />
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          
          {/* State 1: No file selected */}
          {!selectedFile && !isScanning && !scanResults && (
            <UploadDropzone 
              onFileSelected={handleFileSelect} 
              isScanning={false} 
            />
          )}

          {/* State 2: Loading / Analyzing */}
          {isScanning && (
            <div className="w-full bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[400px] shadow-sm">
              <div className="w-14 h-14 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin mb-6"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing crop health...</h2>
              <p className="text-sm text-gray-500">Identifying diseases, pests, and generating a treatment plan.</p>
            </div>
          )}

          {/* State 3: Results Display */}
          {scanResults && !isScanning && selectedFile && imagePreviewUrl && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ScanResultsView 
                imagePreviewUrl={imagePreviewUrl}
                file={selectedFile}
                summary={scanResults.summary}
                onReset={resetScan}
              />
              <ScanBreakdownGrid breakdown={scanResults.breakdown} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}