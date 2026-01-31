import type { PDFDocumentProxy, PDFPageProxy, PageViewport } from 'pdfjs-dist';

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function loadPdfJs(): Promise<typeof import('pdfjs-dist')> {
  if (typeof window === 'undefined') {
    throw new Error('PDF conversion can only be done in the browser');
  }
  
  if (pdfjsLib) return pdfjsLib;
  
  const pdf = await import('pdfjs-dist');
  pdfjsLib = pdf;
  pdf.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs";
  
  return pdf;
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
  try {
    if (typeof window === 'undefined') {
      return {
        imageUrl: "",
        file: null,
        error: "PDF conversion requires browser environment",
      };
    }

    const pdf = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc: PDFDocumentProxy = await pdf.getDocument({ data: arrayBuffer }).promise;
    const page: PDFPageProxy = await pdfDoc.getPage(1);
    const viewport: PageViewport = page.getViewport({ scale: 4 });
    
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    }

    await page.render({
      canvasContext: context!,
      viewport,
      canvas
    } as any).promise;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const originalName = file.name.replace(/\.pdf$/i, "");
          const imageFile = new File([blob], `${originalName}.png`, {
            type: "image/png",
          });
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              imageUrl: reader.result as string,
              file: imageFile,
            });
          };
          reader.readAsDataURL(blob);
        } else {
          resolve({ imageUrl: "", file: null, error: "Failed to create blob" });
        }
      }, "image/png", 1.0);
    });
  } catch (err) {
    return {
      imageUrl: "",
      file: null,
      error: err instanceof Error ? err.message : "Conversion failed",
    };
  }
}