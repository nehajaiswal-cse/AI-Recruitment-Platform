import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import Resume from "../models/Resume.js";
import User from "../models/user.js";
import { extractResumeText } from "../services/resumeParser.js";
import {
  calculateSkillsMatch,
  calculateKeywordMatch,
  calculateExperienceMatch,
  calculateEducationMatch,
  calculateFormattingScore,
  calculateOverallATSScore,
  generateSuggestions,
} from "../services/atsAnalyzer.js";

export const analyzeResume = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        message: "Resume and job description are required",
      });
    }

    // Find user's resume
    const resume = await Resume.findOne({
      _id: resumeId,
      user: userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Get resume from S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: resume.fileKey,
    });

    const s3Response = await s3.send(command);

    // Convert S3 stream to Buffer
    const chunks = [];

    for await (const chunk of s3Response.Body) {
      chunks.push(chunk);
    }

    const fileBuffer = Buffer.concat(chunks);

    // Extract resume text

    console.log("Resume fileType:", resume.fileType);
    const resumeText = await extractResumeText(fileBuffer, resume.fileType);

    const skillsResult = calculateSkillsMatch(resumeText, jobDescription);
    const keywordResult = calculateKeywordMatch(resumeText, jobDescription);
    const experienceResult = calculateExperienceMatch(
      req.user.profile?.experience,
      jobDescription,
    );
    const educationResult = calculateEducationMatch(
      user.profile?.education,
      jobDescription,
    );
    const formattingResult = calculateFormattingScore(resumeText);
    const overallScore = calculateOverallATSScore({
      skillsScore: skillsResult.score,
      keywordScore: keywordResult.score,
      experienceScore: experienceResult.score,
      educationScore: educationResult.score,
      formattingScore: formattingResult.score,
    });

    const suggestions = generateSuggestions({
      skillsResult,
      keywordResult,
      experienceResult,
      educationResult,
      formattingResult,
    });

    console.log("Resume text extracted successfully");
    console.log(resumeText);

    res.status(200).json({
      message: "ATS analysis successful",

      overallScore,

      skillsMatch: skillsResult,

      keywordMatch: keywordResult,

      experienceMatch: experienceResult,

      educationMatch: educationResult,

      formattingScore: formattingResult,

      suggestions,

      jobDescription,
    });
  } catch (error) {
    console.error("ATS analysis error:", error);

    res.status(500).json({
      message: "Failed to analyze resume",
    });
  }
};
