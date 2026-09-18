import ResumeBuilder from "../models/ResumeBuilder.js";
import PDFDocument from "pdfkit";
import {
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";

// GET /api/resume-builder/me
export const getMyBuilderResume = async (req, res) => {
  try {
    const resume = await ResumeBuilder.findOne({
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.status(200).json(resume);
  } catch (error) {
    console.error("Get builder resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load resume.",
      error: error.message,
    });
  }
};


// POST /api/resume-builder
export const createBuilderResume = async (req, res) => {
  try {
    const existingResume = await ResumeBuilder.findOne({
      user: req.user.id,
    });

    if (existingResume) {
      return res.status(409).json({
        success: false,
        message: "Resume already exists. Please update your existing resume.",
      });
    }

    const resume = await ResumeBuilder.create({
      ...req.body,
      user: req.user.id,
    });

    return res.status(201).json(resume);
  } catch (error) {
    console.error("Create builder resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save resume.",
      error: error.message,
    });
  }
};


// PUT /api/resume-builder/:id
export const updateBuilderResume = async (req, res) => {
  try {
    const resume = await ResumeBuilder.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    Object.assign(resume, req.body);

    // User ko change hone se protect karna
    resume.user = req.user.id;

    const updatedResume = await resume.save();

    return res.status(200).json(updatedResume);
  } catch (error) {
    console.error("Update builder resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save resume.",
      error: error.message,
    });
  }
};

// POST /api/resume-builder/export
export const exportBuilderResume = async (req, res) => {
  try {
    const data = req.body;

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    const pdfBuffer = await new Promise((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const personal = data.personal || {};

      // Name
      doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .text(personal.fullName || "Your Name", {
          align: "center",
        });

      // Contact
      const contact = [
        personal.email,
        personal.phone,
        personal.location,
      ]
        .filter(Boolean)
        .join(" | ");

      if (contact) {
        doc
          .moveDown(0.5)
          .fontSize(10)
          .font("Helvetica")
          .text(contact, { align: "center" });
      }

      doc.moveDown();

      // Summary
      if (data.summary) {
        doc.fontSize(14).font("Helvetica-Bold").text("Professional Summary");
        doc
          .moveDown(0.3)
          .fontSize(10)
          .font("Helvetica")
          .text(data.summary);
        doc.moveDown();
      }

      // Education
      if (data.education?.length) {
        doc.fontSize(14).font("Helvetica-Bold").text("Education");

        data.education.forEach((edu) => {
          doc
            .moveDown(0.3)
            .fontSize(11)
            .font("Helvetica-Bold")
            .text(edu.degree || edu.field || "Education");

          doc
            .fontSize(10)
            .font("Helvetica")
            .text(
              [
                edu.institution,
                edu.startYear && edu.endYear
                  ? `${edu.startYear} - ${edu.endYear}`
                  : edu.startYear || edu.endYear,
                edu.grade,
              ]
                .filter(Boolean)
                .join(" | ")
            );
        });

        doc.moveDown();
      }

      // Experience
      if (data.experience?.length) {
        doc.fontSize(14).font("Helvetica-Bold").text("Experience");

        data.experience.forEach((exp) => {
          doc
            .moveDown(0.3)
            .fontSize(11)
            .font("Helvetica-Bold")
            .text(exp.role || "Experience");

          doc
            .fontSize(10)
            .font("Helvetica")
            .text(
              [exp.company, exp.startDate, exp.endDate]
                .filter(Boolean)
                .join(" | ")
            );

          if (exp.description) {
            doc.moveDown(0.2).text(exp.description);
          }
        });

        doc.moveDown();
      }

      // Projects
      if (data.projects?.length) {
        doc.fontSize(14).font("Helvetica-Bold").text("Projects");

        data.projects.forEach((project) => {
          doc
            .moveDown(0.3)
            .fontSize(11)
            .font("Helvetica-Bold")
            .text(project.name || "Project");

          if (project.tech) {
            doc
              .fontSize(10)
              .font("Helvetica")
              .text(`Technologies: ${project.tech}`);
          }

          if (project.link) {
            doc.text(`Link: ${project.link}`);
          }

          if (project.description) {
            doc.moveDown(0.2).text(project.description);
          }
        });

        doc.moveDown();
      }

      // Skills
      if (data.skills?.length) {
        doc.fontSize(14).font("Helvetica-Bold").text("Skills");
        doc
          .moveDown(0.3)
          .fontSize(10)
          .font("Helvetica")
          .text(data.skills.filter(Boolean).join(", "));
        doc.moveDown();
      }

      // Certifications
      if (data.certifications?.length) {
        doc.fontSize(14).font("Helvetica-Bold").text("Certifications");

        data.certifications.forEach((cert) => {
          doc
            .moveDown(0.3)
            .fontSize(10)
            .font("Helvetica-Bold")
            .text(cert.name || "Certification");

          doc
            .fontSize(10)
            .font("Helvetica")
            .text([cert.issuer, cert.year].filter(Boolean).join(" | "));
        });

        doc.moveDown();
      }

      // Achievements
      if (data.achievements?.length) {
        doc.fontSize(14).font("Helvetica-Bold").text("Achievements");

        data.achievements.forEach((achievement) => {
          if (achievement) {
            doc
              .moveDown(0.2)
              .fontSize(10)
              .font("Helvetica")
              .text(`• ${achievement}`);
          }
        });
      }

      doc.end();
    });

    // S3 file name
    const fileName = `resume-builder/${req.user.id}-${Date.now()}.pdf`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    });

    await s3.send(command);

    const getCommand = new GetObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  Key: fileName,
});

const url = await getSignedUrl(s3, getCommand, {
  expiresIn: 3600,
});

    return res.status(200).json({
      success: true,
      url,
    });
  } catch (error) {
    console.error("Export builder resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export resume.",
      error: error.message,
    });
  }
};
