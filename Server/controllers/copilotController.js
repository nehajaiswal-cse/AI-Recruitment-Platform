import Application from "../models/applications.js";
import Candidate from "../models/candidate.js";
import Job from "../models/job.js";
import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const askCandidateCopilot = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { message } = req.body;

    console.log("========== COPILOT ==========");
    console.log("Application ID:", applicationId);
    console.log("Message:", message);

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // 1. Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // 2. Find candidate
    const candidate = await Candidate.findOne({
      applicationId: applicationId,
    });

    // 3. Find job
    const job = await Job.findById(application.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 4. Prepare candidate context
    const candidateContext = {
      name:
        candidate?.name ||
        application?.applicantName ||
        "Candidate",

      skills: candidate?.skills || [],

      experience:
        candidate?.experience ||
        "Not specified",

      aiScore: candidate?.aiScore ?? null,

      aiAnalysis: candidate?.aiAnalysis || {},

      status:
        candidate?.status ||
        application?.status ||
        "applied",
    };

    const jobContext = {
      title: job.title,

      description: job.description,

      requiredSkills:
        job.requiredSkills ||
        job.skills ||
        [],

      experience:
        job.experience ||
        "Not specified",
    };

    // 5. AI prompt
    const systemPrompt = `
You are Talvyn AI Candidate Copilot.

You help recruiters evaluate candidates.

CANDIDATE:
${JSON.stringify(candidateContext, null, 2)}

JOB:
${JSON.stringify(jobContext, null, 2)}

RULES:
1. Use only the information provided above.
2. Never invent candidate information.
3. Clearly mention when information is unavailable.
4. Compare candidate skills with job requirements.
5. Give concise and recruiter-friendly answers.
6. You may recommend areas to investigate.
7. Do not make decisions based on protected characteristics.
8. Do not make the final hiring decision.
9. The recruiter makes the final decision.

Answer the recruiter's question.
`;

    // 6. OpenRouter request
    console.log("Sending request to OpenRouter...");

    const response =
      await openrouter.chat.completions.create({
        model: "deepseek/deepseek-chat",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],

        temperature: 0.3,
        max_tokens: 1000,
      });

    console.log("AI response received");

    // 7. Get AI reply
    const reply =
      response.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("No response received from AI");
    }

    return res.status(200).json({
      success: true,
      reply,
      candidate: candidateContext,
    });

  } catch (error) {
    console.error(
      "========== COPILOT ERROR =========="
    );

    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.error("Response:", error.response?.data);

    return res.status(500).json({
      success: false,
      message: "AI Copilot failed",
      error:
        error.response?.data?.error?.message ||
        error.message,
    });
  }
};