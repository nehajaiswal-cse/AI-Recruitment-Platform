import OpenAI from "openai";

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.AI_INTERVIEW_MODEL || "openai/gpt-oss-120b";

const cleanJson = (content) =>
  content.replace(/```json/gi, "").replace(/```/g, "").trim();

// =====================================================
// GENERATE INTERVIEW QUESTIONS
// =====================================================

export const generateInterviewQuestions = async ({
  role,
  type,
  count = 5,
}) => {
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 1200,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an experienced technical/HR interviewer. Always respond with ONLY valid, complete JSON. No markdown, no extra text, no explanation.",
        },
        {
          role: "user",
          content: `
Generate ${count} interview questions for a candidate interviewing for a "${role}" role.
Interview type: ${type}.

Return EXACTLY this JSON shape:
{ "questions": ["question 1", "question 2", "question 3"] }
`,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    let parsed;
    try {
      parsed = JSON.parse(cleanJson(content));
    } catch (parseErr) {
      console.error("RAW AI CONTENT (questions):", content);
      throw new Error("AI returned malformed JSON");
    }

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("AI did not return valid questions");
    }

    return parsed.questions;
  } catch (error) {
    console.error("generateInterviewQuestions error:", error.message);
    throw new Error(`Failed to generate interview questions: ${error.message}`);
  }
};

// =====================================================
// EVALUATE COMPLETE INTERVIEW
// =====================================================

export const evaluateInterview = async ({ role, type, qaList }) => {
  try {
    const transcript = qaList
      .map(
        (qa, i) =>
          `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer || "(no answer given)"}`
      )
      .join("\n\n");

    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 1500,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert interview evaluator. Always respond with ONLY valid, complete JSON. No markdown, no extra text.",
        },
        {
          role: "user",
          content: `
Role: ${role}
Interview Type: ${type}

Transcript:
${transcript}

Evaluate the candidate. Return EXACTLY this JSON:
{
  "overallScore": 0,
  "technicalKnowledge": 0,
  "problemSolving": 0,
  "communication": 0,
  "relevance": 0,
  "strengths": [],
  "areasToImprove": [],
  "recommendations": []
}
All scores are 0-100.
`,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    try {
      return JSON.parse(cleanJson(content));
    } catch (parseErr) {
      console.error("RAW AI CONTENT (evaluation):", content);
      throw new Error("AI returned malformed JSON");
    }
  } catch (error) {
    console.error("evaluateInterview error:", error.message);
    throw new Error(`Failed to evaluate interview: ${error.message}`);
  }
};