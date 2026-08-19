import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  LinearProgress,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const feedbackData = [
  {
    id: "1",
    company: "WebEra Technologies",
    role: "React Developer",
    date: "15 Aug 2026",
    day: "Friday",
    time: "03:00 PM",
    duration: "45 min",
    type: "Technical Interview",
    status: "Shortlisted",

    score: 88,
    performanceTitle: "Excellent Performance! 🎉",
    performanceDescription:
      "You demonstrated strong React knowledge, good problem-solving ability and clear communication during the interview.",

    technical: 90,
    problemSolving: 88,
    communication: 85,
    confidence: 89,

    strengths: [
      "Strong understanding of React concepts",
      "Good problem-solving approach",
      "Relevant project examples",
      "Clear technical communication",
    ],

    improvements: [
      "Improve advanced React patterns",
      "Give more detailed explanations",
      "Practice system design concepts",
      "Improve answer structure",
    ],

    recommendation:
      "Keep practicing React and frontend system design. Your technical foundation is strong, so focus on explaining your decisions clearly and confidently.",
  },

  {
    id: "2",
    company: "DataCore Systems",
    role: "Software Engineer",
    date: "10 Aug 2026",
    day: "Sunday",
    time: "11:00 AM",
    duration: "30 min",
    type: "Technical Interview",
    status: "Under Review",

    score: 76,
    performanceTitle: "Good Performance 👍",
    performanceDescription:
      "You showed good technical understanding and problem-solving skills. With more structured answers, your performance can improve further.",

    technical: 78,
    problemSolving: 80,
    communication: 72,
    confidence: 74,

    strengths: [
      "Good understanding of programming concepts",
      "Logical problem-solving approach",
      "Good knowledge of development fundamentals",
      "Willingness to explain your approach",
    ],

    improvements: [
      "Improve communication clarity",
      "Give more structured answers",
      "Practice behavioral questions",
      "Work on interview confidence",
    ],

    recommendation:
      "Focus on structuring your answers before speaking. Continue practicing technical questions and work on communicating your thought process clearly.",
  },

  {
    id: "3",
    company: "InnovateX Solutions",
    role: "Backend Developer",
    date: "05 Aug 2026",
    day: "Tuesday",
    time: "02:00 PM",
    duration: "45 min",
    type: "Technical Interview",
    status: "Not Selected",

    score: 64,
    performanceTitle: "Keep Improving 💪",
    performanceDescription:
      "You have a good foundation, but there are some technical and communication areas that need more practice before your next interview.",

    technical: 65,
    problemSolving: 68,
    communication: 60,
    confidence: 63,

    strengths: [
      "Basic backend concepts are clear",
      "Good effort in problem solving",
      "Understands core programming concepts",
      "Shows willingness to learn",
    ],

    improvements: [
      "Strengthen Node.js and Express concepts",
      "Practice backend interview questions",
      "Improve answer structure",
      "Build more confidence while answering",
    ],

    recommendation:
      "Spend more time revising Node.js, Express, APIs and databases. Practice mock interviews regularly and focus on giving concise, structured answers.",
  },
];

const InterviewFeedback = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const feedback = feedbackData.find(
  (item) => String(item.id) === String(id)
);

  // Invalid ID
  if (!feedback) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#07111f",
          color: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              mb: 1,
            }}
          >
            Feedback Not Found
          </Typography>

          <Typography
            sx={{
              color: "#94a3b8",
              mb: 3,
            }}
          >
            The feedback you are looking for does not exist.
          </Typography>

          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() =>
              navigate("/applicant/interviews")
            }
            sx={{
              color: "#a78bfa",
              textTransform: "none",
            }}
          >
            Back to Interviews
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#07111f",
        color: "#f8fafc",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() =>
            navigate("/applicant/interviews")
          }
          sx={{
            color: "#a78bfa",
            textTransform: "none",
            mb: 2,
          }}
        >
          Back to Interviews
        </Button>

        <Typography
          sx={{
            fontSize: { xs: 30, md: 36 },
            fontWeight: 700,
          }}
        >
          Interview Feedback
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            mt: 0.7,
            fontSize: 15,
          }}
        >
          {feedback.role} • {feedback.type}
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            mt: 0.4,
            fontSize: 13,
          }}
        >
          {feedback.company} • {feedback.date}
        </Typography>
      </Box>

      {/* Overall Score */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: { xs: 3, md: 4 },
          mb: 3,
          borderRadius: 3,
          border: "1px solid #293752",
          background:
            "radial-gradient(circle at 90% 10%, rgba(124,58,237,0.18), transparent 35%), #0e1a2b",
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            mb: 3,
          }}
        >
          Overall Performance
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              bgcolor: "#312e81",
              border: "6px solid #6366f1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              {feedback.score}%
            </Typography>

            <Typography
              sx={{
                color: "#a78bfa",
                fontSize: 11,
              }}
            >
              Score
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {feedback.performanceTitle}
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {feedback.performanceDescription}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Skills */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <ScoreCard
          title="Technical Knowledge"
          score={`${feedback.technical}%`}
          value={feedback.technical}
          icon={<TrendingUpRoundedIcon />}
          color="#6366f1"
        />

        <ScoreCard
          title="Problem Solving"
          score={`${feedback.problemSolving}%`}
          value={feedback.problemSolving}
          icon={<CheckCircleRoundedIcon />}
          color="#22c55e"
        />

        <ScoreCard
          title="Communication"
          score={`${feedback.communication}%`}
          value={feedback.communication}
          icon={<StarRoundedIcon />}
          color="#f59e0b"
        />

        <ScoreCard
          title="Confidence"
          score={`${feedback.confidence}%`}
          value={feedback.confidence}
          icon={<TrendingUpRoundedIcon />}
          color="#8b5cf6"
        />
      </Box>

      {/* Strengths & Improvements */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Strengths */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "#0e1a2b",
            border: "1px solid #24334a",
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              mb: 2,
            }}
          >
            💪 Your Strengths
          </Typography>

          {feedback.strengths.map((item) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 18,
                  color: "#22c55e",
                }}
              />

              <Typography
                sx={{
                  color: "#cbd5e1",
                  fontSize: 14,
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Improvements */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "#0e1a2b",
            border: "1px solid #24334a",
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              mb: 2,
            }}
          >
            🎯 Areas to Improve
          </Typography>

          {feedback.improvements.map((item) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <LightbulbRoundedIcon
                sx={{
                  fontSize: 18,
                  color: "#fbbf24",
                }}
              />

              <Typography
                sx={{
                  color: "#cbd5e1",
                  fontSize: 14,
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Interview Summary */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 3,
          borderRadius: 3,
          bgcolor: "#0e1a2b",
          border: "1px solid #24334a",
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            mb: 2,
          }}
        >
          Interview Summary
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: 14,
            mb: 2,
          }}
        >
          Interview Status:{" "}
          <strong style={{ color: "#e2e8f0" }}>
            {feedback.status}
          </strong>
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: 14,
            mb: 2,
          }}
        >
          Interview Date:{" "}
          <strong style={{ color: "#e2e8f0" }}>
            {feedback.date}
          </strong>
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#111c31",
            border: "1px solid #24334a",
          }}
        >
          <Typography
            sx={{
              color: "#a78bfa",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            AI Recommendation
          </Typography>

          <Typography
            sx={{
              color: "#cbd5e1",
              fontSize: 14,
              mt: 0.7,
              lineHeight: 1.6,
            }}
          >
            {feedback.recommendation}
          </Typography>
        </Box>
      </Box>

      {/* Bottom Action */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={() =>
            navigate("/applicant/interviews")
          }
          variant="outlined"
          sx={{
            color: "#c4b5fd",
            borderColor: "#6366f1",
            textTransform: "none",
            borderRadius: 2,
            px: 3,
          }}
        >
          Back to Interviews
        </Button>

        <Button
          onClick={() =>
            navigate("/applicant/interviews/coach")
          }
          sx={{
            color: "#fff",
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
            "&:hover": {
              background:
                "linear-gradient(135deg,#5859e8,#7c3aed)",
            },
          }}
        >
          Practice Again
        </Button>
      </Box>
    </Box>
  );
};

/* =========================================================
   SCORE CARD
========================================================= */

const ScoreCard = ({
  title,
  score,
  value,
  icon,
  color,
}) => {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "#0e1a2b",
        border: "1px solid #24334a",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            color: "#cbd5e1",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ color }}>{icon}</Box>
      </Box>

      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 700,
          mb: 1,
        }}
      >
        {score}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 6,
          borderRadius: 5,
          bgcolor: "#1e293b",

          "& .MuiLinearProgress-bar": {
            background: color,
          },
        }}
      />
    </Box>
  );
};

export default InterviewFeedback;