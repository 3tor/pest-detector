import React, { useRef, useState } from 'react';

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  isScanning: boolean;
}

export const UploadDropzone = ({ onFileSelected, isScanning }: UploadDropzoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center min-h-[320px] transition-all ${
        isDragOver ? 'border-[#2563EB] bg-blue-50/20 scale-[1.005]' : ''
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*"
        className="hidden"
      />
      <div className="w-20 h-20 mb-6 flex items-center justify-center text-blue-200 relative">
        <svg className="w-16 h-16 text-blue-200 stroke-current" fill="none" strokeWidth="1.5" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-blue-100 shadow-xs">
          <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Select image to inspect</h2>
      <p className="text-sm text-gray-500 mb-6">Or drag and drop to check AI + watermark.</p>
      <button
        disabled={isScanning}
        onClick={() => fileInputRef.current?.click()}
        className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50"
      >
        {isScanning ? 'Analyzing...' : 'Select image'}
      </button>
    </div>
  );
};