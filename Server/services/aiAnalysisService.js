import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const analyzeResumeWithAI = async ({
  resumeText,
  jobDescription,
}) => {
  try {
    console.log("🤖 Calling OpenRouter...");

    const completion = await openrouter.chat.completions.create({
      model: "openai/gpt-4o-mini",
      max_tokens: 800,
      temperature: 0.2,

      messages: [
        {
          role: "system",
          content: `
You are an AI-powered Applicant Tracking System.

Analyze the candidate's RESUME against the JOB DESCRIPTION.

IMPORTANT:
- Use the resume text as the primary source of candidate information.
- Extract skills, experience, education and projects directly from the resume.
- Do NOT assume that experience or education is missing just because a separate profile field is unavailable.
- Do NOT invent information.
- Only use information explicitly present in the resume.
- Compare the candidate semantically with the job description.
- Return ONLY valid JSON.
`,
        },

        {
          role: "user",
          content: `
CANDIDATE RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze the candidate.

Return EXACTLY this JSON:

{
  "matchScore": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "experienceAnalysis": "",
  "educationAnalysis": "",
  "strengths": [],
  "weaknesses": [],
  "summary": "",
  "recommendation": ""
}

Rules:

1. matchScore:
   Give a score from 0 to 100 based on overall relevance.

2. matchingSkills:
   List important skills from the job description that are clearly present in the resume.

3. missingSkills:
   List important job skills that are required but not clearly present in the resume.

4. experienceAnalysis:
   Analyze the candidate's actual experience from the resume.

5. educationAnalysis:
   Analyze the candidate's education from the resume.

6. strengths:
   List 2-4 relevant strengths.

7. weaknesses:
   List 1-4 relevant weaknesses or gaps.

8. summary:
   Give a short explanation of the candidate's suitability.

9. recommendation:
   MUST be exactly one of:
   "Shortlist"
   "Consider"
   "Reject"
`,
        },
      ],
    });

    console.log("✅ OpenRouter response received");

    const content =
      completion.choices?.[0]?.message?.content;

    console.log("AI RAW RESPONSE:", content);

    if (!content) {
      throw new Error("OpenRouter returned an empty response");
    }

    const cleanedContent = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanedContent);

    console.log("✅ AI JSON parsed successfully");

    return result;
  } catch (error) {
    console.error("========== OPENROUTER ERROR ==========");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("======================================");

    throw new Error(
      `AI resume analysis failed: ${error.message}`
    );
  }
};