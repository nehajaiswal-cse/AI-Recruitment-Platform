import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function extractResumeText(pdfBuffer) {
  try {
    const uint8Array = new Uint8Array(pdfBuffer);

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
    });

    const pdfDocument = await loadingTask.promise;

    let extractedText = "";

    for (
      let pageNum = 1;
      pageNum <= pdfDocument.numPages;
      pageNum++
    ) {
      const page = await pdfDocument.getPage(pageNum);

      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => item.str)
        .join(" ");

      extractedText += pageText + " ";
    }

    extractedText = extractedText.trim();

    if (!extractedText) {
      throw new Error(
        "Resume text extraction failed: PDF appears to be scanned/image-based."
      );
    }

    return extractedText;
  } catch (error) {
    console.error("Resume extraction error:", error);
    throw error;
  }
}
