
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "@napi-rs/canvas";
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";
import os from "os";

// ==========================================
// PDF.JS CANVAS FACTORY
// ==========================================

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    return {
      canvas,
      context,
    };
  }

  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 1;
    canvasAndContext.canvas.height = 1;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

// ==========================================
// EXTRACT RESUME TEXT
// ==========================================

export async function extractResumeText(pdfBuffer) {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "resume-")
  );

  try {
    // ==========================================
    // 1. TRY NORMAL PDF TEXT EXTRACTION
    // ==========================================

    console.log("📄 Trying normal PDF text extraction...");

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
    }).promise;

    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str || "")
        .join(" ");

      extractedText += pageText + "\n";
    }

    // ==========================================
    // NORMAL PDF SUCCESS
    // ==========================================

    if (extractedText.trim().length > 50) {
      console.log("✅ Resume text extracted using PDF.js");

      return extractedText.trim();
    }

    // ==========================================
    // 2. OCR FALLBACK
    // ==========================================

    console.log(
      "⚠️ PDF has little/no text. Switching to OCR..."
    );

    const canvasFactory = new NodeCanvasFactory();

    let ocrText = "";

    // ==========================================
    // RENDER EACH PDF PAGE
    // ==========================================

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      console.log(
        `🖼️ Rendering PDF page ${pageNumber}/${pdf.numPages}...`
      );

      const page = await pdf.getPage(pageNumber);

      // Higher scale = better OCR quality
      const scale = 2;

      const viewport = page.getViewport({
        scale,
      });

      const canvasAndContext = canvasFactory.create(
        Math.ceil(viewport.width),
        Math.ceil(viewport.height)
      );

      // ==========================================
      // RENDER PDF PAGE TO CANVAS
      // ==========================================

      await page.render({
        canvasContext: canvasAndContext.context,
        viewport,
        canvasFactory,
      }).promise;

      // Convert canvas to PNG buffer
      const imageBuffer =
        canvasAndContext.canvas.toBuffer("image/png");

      console.log(
        `🔍 Running OCR on page ${pageNumber}...`
      );

      // ==========================================
      // TESSERACT OCR
      // ==========================================

      const {
        data: { text },
      } = await Tesseract.recognize(
        imageBuffer,
        "eng",
        {
          logger: (info) => {
            if (info.status === "recognizing text") {
              console.log(
                `Page ${pageNumber}: ${Math.round(
                  info.progress * 100
                )}%`
              );
            }
          },
        }
      );

      ocrText += text + "\n";

      // Cleanup canvas
      canvasFactory.destroy(canvasAndContext);
    }

    // ==========================================
    // OCR RESULT
    // ==========================================

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
    // CLEAN TEMP DIRECTORY
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

