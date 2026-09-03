import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import Resume from "../models/Resume.js";
import Application from "../models/applications.js";

const getFileTypeFromMime = (mimetype) => {
  if (mimetype === "application/pdf") return "PDF";
  if (mimetype === "application/msword") return "DOC";
  return "DOCX";
};

// ==========================================
// UPLOAD RESUME
// ==========================================

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id || req.user._id;

    // If this is the user's first resume, make it default automatically
    const existingCount = await Resume.countDocuments({ user: userId });

    const resume = await Resume.create({
      user: userId,
      fileName: req.file.originalname,
      fileUrl: req.file.location,
      fileKey: req.file.key,
      fileType: getFileTypeFromMime(req.file.mimetype),
      size: req.file.size,
      label: req.body.label || "",
      isDefault: existingCount === 0,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error("Upload resume error:", error);
    res.status(500).json({ message: "Failed to upload resume" });
  }
};

// ==========================================
// GET MY RESUMES
// ==========================================

export const getMyResumes = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const resumes = await Resume.find({ user: userId }).sort({
      updatedAt: -1,
    });

    res.status(200).json({ resumes });
  } catch (error) {
    console.error("Get resumes error:", error);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};

// ==========================================
// GET SIGNED URL (for view / download)
// ==========================================


export const getResumeSignedUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (!application.resume?.fileUrl) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    // Convert full S3 URL into S3 object key
    const fileUrl = new URL(application.resume.fileUrl);
    const key = decodeURIComponent(fileUrl.pathname.substring(1));


    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 300,
    });

    console.log("Signed URL generated successfully");

    return res.status(200).json({ url });

  } catch (error) {
    console.error("Get signed url error:", error);

    return res.status(500).json({
      message: "Failed to generate resume link",
    });
  }
};


// ==========================================
// SET DEFAULT RESUME
// ==========================================

export const setDefaultResume = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const resume = await Resume.findOne({ _id: id, user: userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Unset previous default, set this one
    await Resume.updateMany({ user: userId }, { isDefault: false });
    resume.isDefault = true;
    await resume.save();

    res.status(200).json({ message: "Default resume updated", resume });
  } catch (error) {
    console.error("Set default resume error:", error);
    res.status(500).json({ message: "Failed to set default resume" });
  }
};

// ==========================================
// DELETE RESUME
// ==========================================

export const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const resume = await Resume.findOne({ _id: id, user: userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Delete file from S3
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: resume.fileKey,
        })
      );
    } catch (s3Error) {
      console.error("S3 delete error (continuing anyway):", s3Error);
    }

    const wasDefault = resume.isDefault;

    await resume.deleteOne();

    // If the deleted resume was default, promote the most recent remaining one
    if (wasDefault) {
      const nextResume = await Resume.findOne({ user: userId }).sort({
        updatedAt: -1,
      });

      if (nextResume) {
        nextResume.isDefault = true;
        await nextResume.save();
      }
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};