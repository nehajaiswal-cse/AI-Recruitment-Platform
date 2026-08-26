const TECH_SKILLS = [
  "javascript",
  "typescript",
  "react",
  "react.js",
  "node.js",
  "nodejs",
  "express",
  "express.js",
  "mongodb",
  "mysql",
  "postgresql",
  "python",
  "java",
  "c++",
  "c",
  "html",
  "css",
  "tailwind",
  "git",
  "github",
  "docker",
  "aws",
  "azure",
  "rest api",
  "graphql",
  "next.js",
  "angular",
  "vue",
  "redux",
  "sql",
];

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s.+#-]/g, " ");
};

export const extractSkills = (text) => {
  const normalizedText = normalizeText(text);

  return TECH_SKILLS.filter((skill) => {
    const normalizedSkill = skill.toLowerCase();

    return normalizedText.includes(normalizedSkill);
  });
};

export const calculateSkillsMatch = (resumeText, jobDescription) => {
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);

  if (jobSkills.length === 0) {
    return {
      score: 0,
      resumeSkills,
      jobSkills,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const matchedSkills = jobSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );

  const missingSkills = jobSkills.filter(
    (skill) => !resumeSkills.includes(skill)
  );

  const score = Math.round(
    (matchedSkills.length / jobSkills.length) * 100
  );

  return {
    score,
    resumeSkills,
    jobSkills,
    matchedSkills,
    missingSkills,
  };
};

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
  "from",
  "have",
  "has",
  "are",
  "was",
  "will",
  "you",
  "your",
  "our",
  "their",
  "they",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "is",
  "be",
  "as",
  "or",
  "at",
  "by",
  "we",
  "it",
]);

export const extractKeywords = (text) => {
  const words = normalizeText(text)
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(
      (word) => word.length >= 3 && !STOP_WORDS.has(word)
    );

  return [...new Set(words)];
};

export const calculateKeywordMatch = (
  resumeText,
  jobDescription
) => {
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobDescription);

  if (jobKeywords.length === 0) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
    };
  }

  const matchedKeywords = jobKeywords.filter((keyword) =>
    resumeKeywords.includes(keyword)
  );

  const missingKeywords = jobKeywords.filter(
    (keyword) => !resumeKeywords.includes(keyword)
  );

  const score = Math.round(
    (matchedKeywords.length / jobKeywords.length) * 100
  );

  return {
    score,
    matchedKeywords,
    missingKeywords,
  };
};

export const extractRequiredExperience = (jobDescription) => {
  const text = jobDescription.toLowerCase();

  const patterns = [
    /(\d+)\+?\s*(?:years|year|yrs|yr)\s*(?:of)?\s*experience/,
    /experience\s*(?:of)?\s*(\d+)\+?\s*(?:years|year|yrs|yr)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      return Number(match[1]);
    }
  }

  return 0;
};

export const calculateExperienceMatch = (
  userExperience,
  jobDescription
) => {
  const requiredExperience =
    extractRequiredExperience(jobDescription);

  const candidateExperience = Number(userExperience) || 0;

  // If JD doesn't mention experience requirement
  if (requiredExperience === 0) {
    return {
      score: 100,
      candidateExperience,
      requiredExperience: 0,
    };
  }

  const score = Math.min(
    100,
    Math.round(
      (candidateExperience / requiredExperience) * 100
    )
  );

  return {
    score,
    candidateExperience,
    requiredExperience,
  };
};

const EDUCATION_KEYWORDS = [
  "b.tech",
  "btech",
  "b.e",
  "be",
  "bachelor",
  "bachelors",
  "b.sc",
  "bsc",
  "bca",
  "m.tech",
  "mtech",
  "m.e",
  "master",
  "m.sc",
  "msc",
  "mca",
  "mba",
  "computer science",
  "information technology",
  "engineering",
];

export const calculateEducationMatch = (
  candidateEducation,
  jobDescription
) => {
  const candidateText = (candidateEducation || "").toLowerCase();
  const jdText = jobDescription.toLowerCase();

  const requiredEducation = EDUCATION_KEYWORDS.filter((keyword) =>
    jdText.includes(keyword)
  );

  // JD doesn't mention any education requirement
  if (requiredEducation.length === 0) {
    return {
      score: 100,
      candidateEducation,
      requiredEducation: [],
    };
  }

  const matchedEducation = requiredEducation.filter((keyword) =>
    candidateText.includes(keyword)
  );

  const score = Math.round(
    (matchedEducation.length / requiredEducation.length) * 100
  );

  return {
    score,
    candidateEducation,
    requiredEducation,
    matchedEducation,
  };
};

const REQUIRED_RESUME_SECTIONS = {
  experience: [
    "experience",
    "work experience",
    "employment",
    "professional experience",
  ],

  education: [
    "education",
    "academic",
    "qualification",
  ],

  skills: [
    "skills",
    "technical skills",
    "core skills",
  ],

  projects: [
    "projects",
    "personal projects",
    "academic projects",
  ],
};

export const calculateFormattingScore = (resumeText) => {
  const text = normalizeText(resumeText);

  const sections = {};

  for (const [section, keywords] of Object.entries(
    REQUIRED_RESUME_SECTIONS
  )) {
    sections[section] = keywords.some((keyword) =>
      text.includes(keyword)
    );
  }

  const totalSections = Object.keys(sections).length;

  const foundSections = Object.values(sections).filter(
    Boolean
  ).length;

  const score = Math.round(
    (foundSections / totalSections) * 100
  );

  return {
    score,
    sections,
  };
};

export const calculateOverallATSScore = ({
  skillsScore,
  keywordScore,
  experienceScore,
  educationScore,
  formattingScore,
}) => {
  const score =
    skillsScore * 0.30 +
    keywordScore * 0.20 +
    experienceScore * 0.20 +
    educationScore * 0.15 +
    formattingScore * 0.15;

  return Math.round(score);
};

export const generateSuggestions = ({
  skillsResult,
  keywordResult,
  experienceResult,
  educationResult,
  formattingResult,
}) => {
  const suggestions = [];

  // Missing skills
  if (skillsResult.missingSkills?.length > 0) {
    suggestions.push(
      `Add these skills to your resume if you have experience with them: ${skillsResult.missingSkills.join(
        ", "
      )}.`
    );
  }

  // Missing keywords
  if (keywordResult.missingKeywords?.length > 0) {
    const keywords = keywordResult.missingKeywords.slice(0, 10);

    suggestions.push(
      `Consider including relevant keywords from the job description: ${keywords.join(
        ", "
      )}.`
    );
  }

  // Experience
  if (
    experienceResult.requiredExperience > 0 &&
    experienceResult.candidateExperience <
      experienceResult.requiredExperience
  ) {
    const gap =
      experienceResult.requiredExperience -
      experienceResult.candidateExperience;

    suggestions.push(
      `The job requires ${experienceResult.requiredExperience} years of experience. Your profile shows ${experienceResult.candidateExperience} years, leaving a ${gap}-year gap.`
    );
  }

  // Education
  if (
    educationResult.requiredEducation?.length > 0 &&
    educationResult.matchedEducation?.length === 0
  ) {
    suggestions.push(
      "Your education does not clearly match the education requirements mentioned in the job description."
    );
  }

  // Formatting
  if (formattingResult.sections) {
    const missingSections = Object.entries(
      formattingResult.sections
    )
      .filter(([_, exists]) => !exists)
      .map(([section]) => section);

    if (missingSections.length > 0) {
      suggestions.push(
        `Consider adding these resume sections: ${missingSections.join(
          ", "
        )}.`
      );
    }
  }

  // Overall score
  if (suggestions.length === 0) {
    suggestions.push(
      "Your resume matches the job description well. Keep your resume concise and tailored to the role."
    );
  }

  return suggestions;
};