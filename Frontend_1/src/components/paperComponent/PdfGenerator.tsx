import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PdfGeneratorProps {
  Component: React.ComponentType;
}

const PdfGenerator: React.FC<PdfGeneratorProps> = ({ Component }) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    const element = pdfRef.current;

    // Convert the element to a canvas
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    // Create PDF instance
    const pdf = new jsPDF();

    // Add image to PDF
    const imgWidth = 190; // PDF width
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    // Save the PDF
    pdf.save('form.pdf');
  };

  return (
    <div>
      {/* Render the component dynamically in a hidden div */}
      <div ref={pdfRef} style={{ display: 'none' }}>
        <Component />
      </div>

      {/* Button to generate the PDF */}
      <button onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default PdfGenerator;
