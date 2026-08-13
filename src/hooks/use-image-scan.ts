import { useState, useEffect } from 'react';
import { scanImageApi } from '@/lib/services/scan-service';

export const useImageScan = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File, provider: string = 'gemini') => {
    if (!file) return;

    setSelectedFile(file);
    
    // Generate a temporary local URL for the preview image
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    
    setIsScanning(true);
    setError(null);

    try {
      const result = await scanImageApi(file, provider);
      setScanResults(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image.");
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setSelectedFile(null);
    setScanResults(null);
    setError(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
  };

  // Cleanup the object URL to prevent memory leaks when unmounting
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  return {
    selectedFile,
    imagePreviewUrl,
    isScanning,
    scanResults,
    error,
    handleFileSelect,
    resetScan
  };
};