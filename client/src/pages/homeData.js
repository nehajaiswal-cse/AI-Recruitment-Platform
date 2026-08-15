import {
  Description,
  Psychology,
  TrendingUp,
  CheckCircle,
  Work,
  Groups,
  Insights,
} from "@mui/icons-material";

export const stats = [
  { number: "3.4x", title: "faster shortlist creation", label: "This week at Talvyn" },
  { number: "82%", title: "applications reviewed", label: "AI-assisted screening" },
  { number: "68%", title: "qualified candidate matches", label: "Better talent discovery" },
];

export const features = [
  {
    icon: Description,
    title: "Resume Intelligence",
    description: "Extract skills, experience, education and projects automatically.",
  },
  {
    icon: Psychology,
    title: "Semantic Matching",
    description: "Understand the relationship between candidate skills and job requirements.",
  },
  {
    icon: TrendingUp,
    title: "Smart Ranking",
    description: "Prioritize candidates based on relevance rather than keyword counts.",
  },
  {
    icon: Insights,
    title: "Clear Insights",
    description: "See exactly why a candidate matches and where their gaps are.",
  },
];

export const steps = [
  {
    number: "01",
    icon: Work,
    title: "Create a job",
    description: "Define the role, skills, experience and qualifications.",
  },
  {
    number: "02",
    icon: Description,
    title: "Analyze resumes",
    description: "Talvyn extracts meaningful candidate information automatically.",
  },
  {
    number: "03",
    icon: Psychology,
    title: "Match candidates",
    description: "AI compares candidate profiles against your actual requirements.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Make decisions",
    description: "Get scores, insights and recommendations you can understand.",
  },
];

export const explainableBullets = [
  "Matched skills identified automatically",
  "Relevant experience analyzed",
  "Missing skills highlighted",
  "AI-generated candidate explanation",
];

export const audiences = [
  {
    icon: Groups,
    title: "For Candidates",
    description:
      "Discover opportunities that match your skills, experience and career goals.",
    bullets: [
      "Discover relevant jobs",
      "Apply with your resume",
      "Track applications",
      "Build your professional profile",
    ],
    button: "Find jobs",
    path:"/applicant/login"
  },
  {
    icon: Work,
    title: "For Recruiters",
    description:
      "Find the right candidates faster with explainable AI-powered recruitment.",
    bullets: [
      "Create and manage jobs",
      "Analyze resumes automatically",
      "Rank candidates using AI",
      "Manage your hiring pipeline",
    ],
    button: "Start hiring",
    path:"/recruiter/login"
  },
];

export const matchRows = [
  { label: "Product strategy", value: 96 },
  { label: "Figma & prototyping", value: 92 },
  { label: "Team leadership", value: 88 },
];

export const insightRows = [
  { text: "8 of 9 required skills matched", success: true },
  { text: "3+ years relevant experience", success: true },
  { text: "AWS experience missing", success: false },
];
