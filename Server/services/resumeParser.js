import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfPoppler from "pdf-poppler";
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";
import os from "os";

export async function extractResumeText(pdfBuffer) {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "resume-")
  );

  const pdfPath = path.join(tempDir, "resume.pdf");

  try {
    // Save PDF temporarily
    fs.writeFileSync(pdfPath, pdfBuffer);

    // ==========================================
    // 1. TRY NORMAL PDF TEXT EXTRACTION
    // ==========================================

    const pdf = await pdfjsLib.getDocument({
      data:  new Uint8Array(pdfBuffer),
    }).promise;

    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .join(" ");

      extractedText += pageText + "\n";
    }

    // If enough text was extracted, return it
    if (extractedText.trim().length > 50) {
      console.log("✅ Resume text extracted using PDF.js");

      return extractedText.trim();
    }

    console.log(
      "⚠️ PDF has little/no text. Switching to OCR..."
    );

    // ==========================================
    // 2. OCR FALLBACK FOR SCANNED PDF
    // ==========================================

    const outputPrefix = path.join(tempDir, "page");

    await pdfPoppler.convert(pdfPath, {
      format: "png",
      out_dir: tempDir,
      out_prefix: "page",
      page: null,
      scale: 1500,
    });

    const files = fs
      .readdirSync(tempDir)
      .filter(
        (file) =>
          file.startsWith("page-") &&
          file.endsWith(".png")
      )
      .sort();

    if (files.length === 0) {
      throw new Error(
        "Could not convert PDF pages to images."
      );
    }

    let ocrText = "";

    for (const file of files) {
      const imagePath = path.join(tempDir, file);

      console.log(`🔍 Running OCR on ${file}...`);

      const {
        data: { text },
      } = await Tesseract.recognize(
        imagePath,
        "eng",
        {
          logger: (info) => {
            if (info.status === "recognizing text") {
              console.log(
                `${file}: ${Math.round(
                  info.progress * 100
                )}%`
              );
            }
          },
        }
      );

      ocrText += text + "\n";
    }

    if (!ocrText.trim()) {
      throw new Error(
        "OCR could not extract any text from the resume."
      );
    }

    console.log("✅ Resume text extracted using OCR");

    return ocrText.trim();

  } catch (error) {
    console.error(
      "❌ Resume extraction error:",
      error
    );

    throw new Error(
      `Resume text extraction failed: ${error.message}`
    );

  } finally {
    // ==========================================
    // CLEAN TEMP FILES
    // ==========================================

    try {
      fs.rmSync(tempDir, {
        recursive: true,
        force: true,
      });
    } catch (cleanupError) {
      console.error(
        "Cleanup error:",
        cleanupError.message
      );
    }
  }
}