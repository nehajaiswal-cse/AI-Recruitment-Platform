import { GetObjectCommand } from "@aws-sdk/client-s3";

import s3 from "../config/s3.js";

import Application from "../models/applications.js";
import Candidate from "../models/candidate.js";
import Job from "../models/job.js";

import { extractResumeText } from "../services/resumeParser.js";
import { analyzeResumeWithAI } from "../services/aiAnalysisService.js";

export const analyzeResume = async (req, res) => {
  try {
    console.log("🔥 AI ANALYSIS CONTROLLER HIT");

    const { applicationId } = req.body;

    console.log("Application ID:", applicationId);

    if (!applicationId) {
      return res.status(400).json({
        message: "Application ID is required",
      });
    }

    // ==========================================
    // 1. FIND APPLICATION
    // ==========================================

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    console.log("Application found:", application._id);

    // ==========================================
    // 2. GET RESUME FROM APPLICATION
    // ==========================================

    if (!application.resume?.fileUrl) {
      return res.status(404).json({
        message: "Resume not found in application",
      });
    }

    console.log("Resume URL:", application.resume.fileUrl);

    // ==========================================
    // 3. GET JOB
    // ==========================================

    const job = await Job.findById(application.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    console.log("Job found:", job.title);

    // ==========================================
    // 4. GET S3 KEY FROM FILE URL
    // ==========================================

    const resumeUrl = application.resume.fileUrl;

    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const bucketUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

    let fileKey;

    if (resumeUrl.startsWith(bucketUrl)) {
      fileKey = decodeURIComponent(
        resumeUrl.replace(bucketUrl, "")
      );
    } else {
      return res.status(400).json({
        message: "Invalid resume S3 URL",
      });
    }

    console.log("S3 File Key:", fileKey);

    // ==========================================
    // 5. DOWNLOAD RESUME FROM S3
    // ==========================================

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    const s3Response = await s3.send(command);

    const chunks = [];

    for await (const chunk of s3Response.Body) {
      chunks.push(chunk);
    }

    const fileBuffer = Buffer.concat(chunks);

    console.log(
      "Resume buffer size:",
      fileBuffer.length
    );

    // ==========================================
    // 6. DETERMINE FILE TYPE
    // ==========================================

    const fileName = application.resume.fileName || "";

    const extension =
      fileName.split(".").pop()?.toLowerCase();

    let fileType = "application/pdf";

    if (extension === "pdf") {
      fileType = "application/pdf";
    } else if (extension === "docx") {
      fileType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (extension === "doc") {
      fileType = "application/msword";
    }

    console.log("Resume file type:", fileType);

    // ==========================================
    // 7. EXTRACT RESUME TEXT
    // ==========================================

    const resumeText = await extractResumeText(
      fileBuffer,
      fileType
    );

    console.log(
      "Resume text length:",
      resumeText?.length
    );

    console.log(
      "Resume preview:",
      resumeText?.substring(0, 1000)
    );

    if (
      !resumeText ||
      resumeText.trim().length < 100
    ) {
      return res.status(400).json({
        message:
          "Could not extract readable text from resume",
      });
    }

    // ==========================================
    // 8. GET JOB DESCRIPTION
    // ===========c===============================

    const jobDescription =
      job.description ||"";

    if (!jobDescription.trim()) {
      return res.status(400).json({
        message: "Job description not found",
      });
    }

    console.log(
      "Job description length:",
      jobDescription.length
    );

    // ==========================================
    // 9. AI ANALYSIS
    // ==========================================

    const analysis =
      await analyzeResumeWithAI({
        resumeText,
        jobDescription,
      });

    console.log(
      "AI analysis completed:",
      analysis
    );

    // ==========================================
    // 10. FIND / UPDATE CANDIDATE
    // ==========================================

    const candidate =
      await Candidate.findOneAndUpdate(
        {
          applicationId: application._id,
        },
        {
          applicationId: application._id,

          applicantId:
            application.applicantId,

          jobId:
            application.jobId,

          recruiterId:
            job.recruiterId,

          aiScore:
            analysis.matchScore || 0,

          aiAnalysis: {
            matchingSkills:
              analysis.matchingSkills || [],

            missingSkills:
              analysis.missingSkills || [],

            experienceAnalysis:
              analysis.experienceAnalysis || "",

            educationAnalysis:
              analysis.educationAnalysis || "",

            strengths:
              analysis.strengths || [],

            weaknesses:
              analysis.weaknesses || [],

            summary:
              analysis.summary || "",

            recommendation:
              analysis.recommendation ||
              "Consider",
          },

          skills:
            analysis.matchingSkills || [],
        },
        {
          new: true,
          upsert: true,
        }
      );

    console.log(
      "Candidate AI data saved:",
      candidate._id
    );

    // ==========================================
    // 11. RETURN RESULT
    // ==========================================

    return res.status(200).json({
      message:
        "AI resume analysis successful",

      analysis,

      candidate,
    });

  } catch (error) {
    console.error(
      "========== ATS ERROR =========="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "================================"
    );

    return res.status(500).json({
      message:
        "Failed to analyze resume",

      error: error.message,
    });
  }
};