import AiInterview from "../models/aiInterview.js";
import {
  generateInterviewQuestions,
  evaluateInterview,
} from "../services/aiInterviewService.js";

// =====================================================
// START AI INTERVIEW
// =====================================================

export const startAiInterview = async (req, res) => {
  try {
    const { role, type } = req.body;

    if (!role || !type) {
      return res.status(400).json({
        success: false,
        message: "Role and interview type are required",
      });
    }

    const questions = await generateInterviewQuestions({ role, type });

    const aiInterview = await AiInterview.create({
      user: req.user.id,
      role,
      type,
      questions: questions.map((q) => ({ question: q, answer: "" })),
    });

    return res.status(201).json({
      success: true,
      message: "AI interview started",
      interview: aiInterview,
    });
  } catch (error) {
    console.error("startAiInterview error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to start AI interview",
    });
  }
};

// =====================================================
// SUBMIT ANSWER FOR A QUESTION
// =====================================================

export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionIndex, answer } = req.body;

    if (questionIndex === undefined || !answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "questionIndex and answer are required",
      });
    }

    const interview = await AiInterview.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    if (!interview.questions[questionIndex]) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    interview.questions[questionIndex].answer = answer.trim();
    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Answer saved",
      interview,
    });
  } catch (error) {
    console.error("submitAnswer error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save answer",
    });
  }
};

// =====================================================
// COMPLETE INTERVIEW → RUN AI EVALUATION
// =====================================================

export const completeAiInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await AiInterview.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    const evaluation = await evaluateInterview({
      role: interview.role,
      type: interview.type,
      qaList: interview.questions,
    });

    interview.evaluation = evaluation;
    interview.status = "completed";
    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview evaluated",
      interview,
    });
  } catch (error) {
    console.error("completeAiInterview error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to evaluate interview",
    });
  }
};

// =====================================================
// GET SINGLE / HISTORY
// =====================================================

export const getAiInterviewById = async (req, res) => {
  try {
    const interview = await AiInterview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    return res.status(200).json({ success: true, interview });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview",
    });
  }
};

export const getAiInterviewHistory = async (req, res) => {
  try {
    const interviews = await AiInterview.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, interviews });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview history",
    });
  }
};