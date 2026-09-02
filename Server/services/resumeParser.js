import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfPoppler from 'pdf-poppler';
import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';

export async function extractResumeText(pdfBuffer) {
  // 1. Try standard pdfjs text extraction first
  const uint8Array = new Uint8Array(pdfBuffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdfDocument = await loadingTask.promise;

  let extractedText = '';
  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    extractedText += textContent.items.map(item => item.str).join(' ') + ' ';
  }

  extractedText = extractedText.trim();

  // 2. Fall back to OCR with pdf-poppler if standard text length is 0
  if (!extractedText) {
    console.log('⚠️ PDF text empty. Converting to images via pdf-poppler for OCR...');

    const tempPdfPath = path.join(process.cwd(), `temp_${Date.now()}.pdf`);
    fs.writeFileSync(tempPdfPath, pdfBuffer);

    const options = {
      format: 'png',
      out_dir: process.cwd(),
      out_prefix: `ocr_temp_${Date.now()}`,
      page: null
    };

    try {
      await pdfPoppler.convert(tempPdfPath, options);

      // Find output images
      const files = fs.readdirSync(process.cwd())
        .filter(f => f.startsWith(options.out_prefix) && f.endsWith('.png'));

      for (const file of files) {
        const imagePath = path.join(process.cwd(), file);
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
        extractedText += text + ' ';
        fs.unlinkSync(imagePath); // Clean up PNG
      }
    } finally {
      if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath); // Clean up temp PDF
    }

    extractedText = extractedText.trim();
  }

  if (!extractedText) {
    throw new Error('Resume text extraction failed: PDF contains no extractable text');
  }

  return extractedText;
}