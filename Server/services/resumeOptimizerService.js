import OpenAI from "openai";

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL = process.env.AI_INTERVIEW_MODEL || "openai/gpt-oss-120b";

const cleanJson = (content) =>
  content.replace(/```json/gi, "").replace(/```/g, "").trim();

export const generateResumeOptimization = async ({
  resumeText,
  jobDescription,
}) => {
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 1500,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS (Applicant Tracking System) resume reviewer and career coach. Always respond with ONLY valid, complete JSON. No markdown, no extra text.",
        },
        {
          role: "user",
          content: `
Analyze this candidate's RESUME against the JOB DESCRIPTION for ATS compatibility and provide optimization suggestions.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return EXACTLY this JSON shape:
{
  "overallScore": 0,
  "skillsMatch": { "score": 0, "matchingSkills": [], "missingSkills": [] },
  "keywordMatch": { "score": 0, "missingKeywords": [] },
  "experienceMatch": { "score": 0, "note": "" },
  "educationMatch": { "score": 0, "note": "" },
  "formattingScore": { "score": 0, "note": "" },
  "suggestions": []
}

Rules:
- All scores are 0-100 integers.
- "suggestions" should be 4-6 specific, actionable improvement tips (e.g. rewritten bullet point ideas, keywords to add, sections to strengthen). Do not just repeat generic advice.
- Base everything strictly on the actual resume text and job description given, no invented information.
`,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    try {
      return JSON.parse(cleanJson(content));
    } catch (parseErr) {
      console.error("RAW AI CONTENT (resume optimization):", content);
      throw new Error("AI returned malformed JSON");
    }
  } catch (error) {
    console.error("generateResumeOptimization error:", error.message);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
};