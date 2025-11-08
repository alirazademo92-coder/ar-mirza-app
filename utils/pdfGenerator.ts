import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePdf = async (element: HTMLElement, fileName: string): Promise<void> => {
  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jspdf({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // The key change: Force the image to fit the exact dimensions of an A4 page.
  // The original multi-page logic caused an issue where a paper slightly taller
  // than an A4 page would result in a second, mostly blank page. This new
  // logic ensures the captured content is scaled perfectly to a single page.
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
  pdf.save(`${fileName}.pdf`);
};

export const generateTextbookPdf = async (elements: HTMLElement[], fileName: string): Promise<void> => {
  const pdf = new jspdf({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff', // Ensure background is not transparent
    });

    const imgData = canvas.toDataURL('image/png');

    if (i > 0) {
      pdf.addPage();
    }
    
    // Add image scaled to fit the A4 page perfectly
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  }

  pdf.save(`${fileName}.pdf`);
};