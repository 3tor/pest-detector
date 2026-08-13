import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export const exportResultsToPdf = async (elementId: string, fileName: string = 'crop-analysis-report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID '${elementId}' not found.`);
    return;
  }

  try {
    // 1. Capture the targeted DOM node as a high-resolution canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Improves image and text sharpness
      useCORS: true, // Allows cross-origin image rendering
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    
    // 2. Initialize jsPDF in A4 format
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // 3. Add image data to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // 4. Download the file
    pdf.save(fileName);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
};