import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ContractState } from '../types/contract';

export interface PDFExportOptions {
  fileName?: string;
  isUnlocked?: boolean;
}

/**
 * Exports the contract document element to a formal, high-resolution A4 multi-page PDF.
 * Captures all textual clauses, captured digital signatures, and the eIDAS digital evidence seal.
 */
export async function exportContractToPDF(
  elementId: string,
  contract: ContractState,
  options: PDFExportOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`No se encontró el elemento con identificador #${elementId}`);
  }

  // 1. Ensure all images (signatures) inside the element are fully loaded
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        })
    )
  );

  // Small delay to allow any pending DOM paint
  await new Promise((resolve) => setTimeout(resolve, 150));

  // 2. Capture element using html2canvas at scale 2 for crisp 300 DPI clarity
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: 1024, // Standard desktop layout width
    onclone: (_clonedDoc, clonedElement) => {
      // Ensure cloned element is clean and has white background
      clonedElement.style.backgroundColor = '#ffffff';
      clonedElement.style.boxShadow = 'none';
      clonedElement.style.borderRadius = '0';
    }
  });

  // 3. Initialize jsPDF in A4 Portrait mode (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pdfWidth = 210;
  const pdfHeight = 297;
  const marginX = 8;
  const marginTop = 10;
  const marginBottom = 12;
  const printableWidth = pdfWidth - marginX * 2; // 194 mm
  const printableHeight = pdfHeight - marginTop - marginBottom; // 275 mm

  // Calculate slice height in canvas pixels
  const canvasWidth = canvas.width;
  const sliceHeightPx = Math.floor(canvasWidth * (printableHeight / printableWidth));
  const totalPages = Math.ceil(canvas.height / sliceHeightPx);

  for (let page = 0; page < totalPages; page++) {
    const yOffset = page * sliceHeightPx;
    const currentSliceHeight = Math.min(sliceHeightPx, canvas.height - yOffset);

    // Create a temporary canvas for this page slice
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvasWidth;
    pageCanvas.height = currentSliceHeight;

    const ctx = pageCanvas.getContext('2d');
    if (ctx) {
      // White background for page
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      // Draw slice of original canvas
      ctx.drawImage(
        canvas,
        0,
        yOffset,
        canvasWidth,
        currentSliceHeight,
        0,
        0,
        canvasWidth,
        currentSliceHeight
      );
    }

    // Convert slice to image
    const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
    const renderedHeightMm = (currentSliceHeight * printableWidth) / canvasWidth;

    if (page > 0) {
      pdf.addPage();
    }

    // Add running subtle header
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139); // slate-500
    pdf.text(
      `CONTRATO OFICIAL • CSV: ${contract.evidence.verificationCode} • ${contract.clauses.startDate}`,
      marginX,
      marginTop - 3
    );
    pdf.text(
      contract.isUnlocked ? 'EJEMPLAR OFICIAL SELLADO' : 'BORRADOR NO VINCULANTE',
      pdfWidth - marginX,
      marginTop - 3,
      { align: 'right' }
    );

    // Add page content
    pdf.addImage(imgData, 'JPEG', marginX, marginTop, printableWidth, renderedHeightMm, undefined, 'FAST');

    // Add running legal footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      `Sellado telemático eIDAS (Reglamento UE 910/2014) • Huella SHA-256: ${contract.evidence.documentHash.substring(0, 18)}...`,
      marginX,
      pdfHeight - 5
    );
    pdf.text(
      `Página ${page + 1} de ${totalPages}`,
      pdfWidth - marginX,
      pdfHeight - 5,
      { align: 'right' }
    );
  }

  // 4. Determine file name and download
  const safeName1 = (contract.party1.name || 'Parte1').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_');
  const safeName2 = (contract.party2.name || 'Parte2').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_');
  const defaultFileName = `Contrato_${contract.contractType}_${safeName1}_${safeName2}.pdf`;
  const fileName = options.fileName || defaultFileName;

  pdf.save(fileName);
}
