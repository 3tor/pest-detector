import React from 'react';

interface ScanResultsProps {
  imagePreviewUrl: string;
  file: File;
  summary: any;
  provider: string | null; 
  onReset: () => void;
}

export const ScanResultsView = ({ imagePreviewUrl, file, summary, provider, onReset }: ScanResultsProps) => {
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
  
  const badgeColor = summary.status === 'Healthy' 
    ? 'bg-green-500' 
    : (summary.severity === 'High' ? 'bg-red-500' : 'bg-orange-500');

  const providerNames: Record<string, string> = {
    gemini: 'Google Gemini',
    huggingface: 'Hugging Face',
    plantid: 'Plant.id',
  };

  // Format the provider name for display
  const displayProvider = (provider && providerNames[provider]) || 'Google Gemini';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col lg:flex-row gap-8">
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

        <div>
          <button 
            onClick={onReset}
            className="px-6 py-2 border border-gray-200 text-[#2563EB] font-medium text-sm rounded-full hover:bg-gray-50 transition-colors"
          >
            Scan another crop
          </button>
        </div>
      </div>
    </div>
  );
};