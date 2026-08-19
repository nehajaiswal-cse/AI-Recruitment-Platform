import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  LinearProgress,
} from "@mui/material";

import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const AIInterviewCoach = () => {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [role, setRole] = useState("Frontend Developer");
  const [type, setType] = useState("Technical");
  const [answer, setAnswer] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);

  // Store all answers
  const [answers, setAnswers] = useState([]);

  const questions = [
    "Tell me about yourself and your technical background.",
    "What is the difference between let, var and const in JavaScript?",
    "Explain how React components work.",
    "What is REST API and how have you used it?",
    "How would you handle a difficult bug in production?",
  ];

  const currentQuestion = questions[questionNumber - 1];

  const startPractice = () => {
    setStarted(true);
  };

  const submitAnswer = () => {
    if (!answer.trim()) return;

    // Save current answer
    const newAnswer = {
      question: currentQuestion,
      answer: answer.trim(),
    };

    const allAnswers = [...answers, newAnswer];

    // If this is the last question
    if (questionNumber === questions.length) {
      // Navigate to feedback page
      navigate("/applicant/interviews/feedback", {
        state: {
          role,
          type,
          questions,
          answers: allAnswers,
        },
      });

      return;
    }

    // Move to next question
    setAnswers(allAnswers);
    setAnswer("");
    setQuestionNumber((prev) => prev + 1);
  };

  // =========================================================
  // START SCREEN
  // =========================================================

  if (!started) {
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
          <Typography
            sx={{
              fontSize: { xs: 30, md: 36 },
              fontWeight: 700,
            }}
          >
            AI Interview Coach
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "#94a3b8",
              fontSize: 15,
            }}
          >
            Practice with an AI interviewer and improve your interview
            performance.
          </Typography>
        </Box>

        {/* Main Card */}
        <Box
          sx={{
            maxWidth: 850,
            mx: "auto",
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid #293752",
            background:
              "radial-gradient(circle at 90% 10%, rgba(124,58,237,0.18), transparent 35%), #0e1a2b",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              bgcolor: "#312e81",
              color: "#a78bfa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <SmartToyRoundedIcon sx={{ fontSize: 36 }} />
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: 25,
              fontWeight: 700,
            }}
          >
            Start Your AI Interview
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#94a3b8",
              mt: 1,
              mb: 4,
            }}
          >
            Configure your interview and start practicing.
          </Typography>

          {/* Selectors */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              select
              label="Interview Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              sx={inputStyle}
            >
              <MenuItem value="Frontend Developer">
                Frontend Developer
              </MenuItem>

              <MenuItem value="Backend Developer">
                Backend Developer
              </MenuItem>

              <MenuItem value="Full Stack Developer">
                Full Stack Developer
              </MenuItem>

              <MenuItem value="Software Engineer">
                Software Engineer
              </MenuItem>
            </TextField>

            <TextField
              select
              label="Interview Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
              sx={inputStyle}
            >
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="HR">HR / Behavioral</MenuItem>
              <MenuItem value="Mixed">Mixed Interview</MenuItem>
            </TextField>
          </Box>

          {/* Info */}
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              bgcolor: "#111c31",
              border: "1px solid #24334a",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>
              🎯 Role:{" "}
              <strong style={{ color: "#e2e8f0" }}>{role}</strong>
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "#94a3b8",
                mt: 0.7,
              }}
            >
              💡 Type:{" "}
              <strong style={{ color: "#e2e8f0" }}>{type}</strong>
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "#94a3b8",
                mt: 0.7,
              }}
            >
              ⏱️ Questions:{" "}
              <strong style={{ color: "#e2e8f0" }}>
                {questions.length}
              </strong>
            </Typography>
          </Box>

          <Button
            fullWidth
            onClick={startPractice}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              py: 1.4,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 15,
              color: "#fff",
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#5859e8,#7c3aed)",
              },
            }}
          >
            Start Practice
          </Button>
        </Box>
      </Box>
    );
  }

  // =========================================================
  // INTERVIEW PRACTICE SCREEN
  // =========================================================

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
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          AI Interview Practice
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            mt: 0.5,
          }}
        >
          {role} • {type} Interview
        </Typography>
      </Box>

      {/* Progress */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
            Question {questionNumber} of {questions.length}
          </Typography>

          <Typography sx={{ color: "#a78bfa", fontSize: 13 }}>
            {Math.round((questionNumber / questions.length) * 100)}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={(questionNumber / questions.length) * 100}
          sx={{
            height: 7,
            borderRadius: 5,
            bgcolor: "#1e293b",
            "& .MuiLinearProgress-bar": {
              background:
                "linear-gradient(90deg,#6366f1,#8b5cf6)",
            },
          }}
        />
      </Box>

      {/* AI Question */}
      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 3,
          borderRadius: 3,
          border: "1px solid #2d285e",
          background:
            "linear-gradient(110deg,#171938,#11162d)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              bgcolor: "#312e81",
              color: "#a78bfa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SmartToyRoundedIcon />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700 }}>
              AI Interviewer
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 12,
              }}
            >
              Question {questionNumber}
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: { xs: 18, md: 21 },
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          {currentQuestion}
        </Typography>
      </Box>

      {/* Answer */}
      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "#0e1a2b",
          border: "1px solid #24334a",
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          Your Answer
        </Typography>

        <TextField
          multiline
          minRows={7}
          fullWidth
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          sx={answerStyle}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Button
            onClick={submitAnswer}
            disabled={!answer.trim()}
            endIcon={<SendRoundedIcon />}
            sx={{
              textTransform: "none",
              color: "#fff",
              px: 2.5,
              py: 1,
              borderRadius: 2,
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#5859e8,#7c3aed)",
              },
              "&.Mui-disabled": {
                color: "#64748b",
                background: "#1e293b",
              },
            }}
          >
            {questionNumber === questions.length
              ? "Finish Interview"
              : "Submit Answer"}
          </Button>
        </Box>
      </Box>

      {/* Tip */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: "#111c31",
          border: "1px solid #24334a",
          display: "flex",
          gap: 1.2,
          alignItems: "center",
        }}
      >
        <CheckCircleRoundedIcon sx={{ color: "#4ade80" }} />

        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          Take your time. Think clearly and answer as if you're in a real
          interview.
        </Typography>
      </Box>
    </Box>
  );
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#e2e8f0",
    bgcolor: "#111c31",
    borderRadius: 2,

    "& fieldset": {
      borderColor: "#334155",
    },

    "&:hover fieldset": {
      borderColor: "#475569",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#6366f1",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#94a3b8",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#a78bfa",
  },
};

const answerStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#e2e8f0",
    bgcolor: "#111c31",
    borderRadius: 2,

    "& fieldset": {
      borderColor: "#334155",
    },

    "&:hover fieldset": {
      borderColor: "#475569",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#6366f1",
    },
  },

  "& textarea::placeholder": {
    color: "#64748b",
    opacity: 1,
  },
};

export default AIInterviewCoach;