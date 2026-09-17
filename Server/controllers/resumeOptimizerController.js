import User from "../models/user.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import s3 from "../config/s3.js";
import Resume from "../models/Resume.js";

import { extractResumeText } from "../services/resumeParser.js";
import { generateResumeOptimization } from "../services/resumeOptimizerService.js";

const MIME_TYPES = {
  PDF: "application/pdf",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  DOC: "application/msword",
};

export const analyzeResumeForOptimization = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobDescription are required",
      });
    }

    // 1. Fetch resume — must belong to this user
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // 2. Download from S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: resume.fileKey,
    });

    const s3Response = await s3.send(command);

    if (!s3Response.Body) {
      return res.status(500).json({
        success: false,
        message: "Could not download resume",
      });
    }

    const chunks = [];

    for await (const chunk of s3Response.Body) {
      chunks.push(chunk);
    }

    const fileBuffer = Buffer.concat(chunks);

    // 3. Extract text
    const mimeType = MIME_TYPES[resume.fileType] || "application/pdf";

    const resumeText = await extractResumeText(
      fileBuffer,
      mimeType
    );

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message: "Could not extract readable text from this resume",
      });
    }

    // 4. AI analysis
    const analysis = await generateResumeOptimization({
      resumeText,
      jobDescription,
    });

    // 5. Increment free usage counter
    if (req.user.plan !== "pro") {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: {
          "freeUsage.aiResumeOptimizationCount": 1,
        },
      });
    }

    return res.status(200).json({
      success: true,
      ...analysis,
      featureUsage: req.featureUsage || null,
    });

  } catch (error) {
    console.error(
      "analyzeResumeForOptimization error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze resume",
    });
  }
};