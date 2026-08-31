import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const extractResumeText = async (fileBuffer, fileType) => {
  try {
    if (fileType === "PDF") {
      const parser = new PDFParse({
        data: fileBuffer,
      });

      const result = await parser.getText();

      await parser.destroy();

      return result.text;
    }

    if (fileType === "DOCX") {
      const result = await mammoth.extractRawText({
        buffer: fileBuffer,
      });

      return result.value;
    }

    throw new Error("Unsupported resume format");
  } catch (error) {
    throw new Error(`Resume text extraction failed: ${error.message}`);
  }
};