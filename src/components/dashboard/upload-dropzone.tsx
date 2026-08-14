import React, { useRef, useState } from 'react';

interface UploadDropzoneProps {
  onFileSelected: (file: File, provider: string) => void;
  isScanning: boolean;
}

export const UploadDropzone = ({ onFileSelected, isScanning }: UploadDropzoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [provider, setProvider] = useState('gemini'); // Default to Gemini

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0], provider);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0], provider);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Provider Selection */}
      <div className="mb-6 w-full max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Select Vision Engine</label>
        <select 
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          disabled={isScanning}
          className="w-full bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:opacity-50"
        >
          <option value="gemini">Google Gemini 3.6 Flash</option>
          <option value="plantid">Plant.id (Kindwise)</option>
          <option value="groq">Groq (Llama 3.2 Vision)</option>
          <option value="huggingface">Hugging Face (MobileNet)</option>
        </select>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative w-full bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center min-h-[320px] transition-all ${
          isDragOver ? 'border-[#2563EB] bg-blue-50/20 scale-[1.005]' : ''
        }`}
      >
        <input type="file" ref={fileInputRef} onChange={handleInputChange} accept="image/*" className="hidden" />
        <div className="w-20 h-20 mb-6 flex items-center justify-center text-blue-200 relative">
          <svg className="w-16 h-16 text-blue-200 stroke-current" fill="none" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select image to inspect</h2>
        <p className="text-sm text-gray-500 mb-6">Or drag and drop a leaf photo.</p>
        <button
          disabled={isScanning}
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-all shadow-sm disabled:opacity-50"
        >
          {isScanning ? 'Analyzing...' : 'Select image'}
        </button>
      </div>
    </div>
  );
};