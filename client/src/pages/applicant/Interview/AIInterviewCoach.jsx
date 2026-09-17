import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  LinearProgress,
  CircularProgress,
  useTheme,
} from "@mui/material";

import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { AuthContext } from "../../../context/AuthContext";

import {
  startAiInterview,
  submitAiAnswer,
  completeAiInterview,
} from "../../../api/aiInterviewApi";

const FREE_LIMIT = 5;

const AIInterviewCoach = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // =========================================================
  // THEME COLORS
  // =========================================================

  const colors = {
    page: isDark ? "#07111f" : "#f8fafc",
    card: isDark ? "#0e1a2b" : "#ffffff",
    cardSoft: isDark ? "#111c31" : "#f8fafc",

    border: isDark ? "#293752" : "#e2e8f0",
    inputBorder: isDark ? "#334155" : "#cbd5e1",

    text: isDark ? "#f8fafc" : "#0f172a",
    muted: isDark ? "#94a3b8" : "#64748b",

    purple: isDark ? "#a78bfa" : "#7c3aed",
    purpleBg: isDark ? "#312e81" : "#ede9fe",

    progressTrack: isDark ? "#1e293b" : "#e2e8f0",

    success: isDark ? "#4ade80" : "#16a34a",
    error: isDark ? "#f87171" : "#dc2626",

    button: isDark
      ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
      : "linear-gradient(135deg,#6366f1,#8b5cf6)",

    buttonHover: "linear-gradient(135deg,#5859e8,#7c3aed)",
  };

  // =========================================================
  // ACCESS
  // =========================================================

  const isPro = user?.plan === "pro";

  const [usedCount, setUsedCount] = useState(
    user?.freeUsage?.aiInterviewCount || 0,
  );
  const remaining = Math.max(0, FREE_LIMIT - usedCount);

  const hasAccess = isPro || remaining > 0;

  // =========================================================
  // STATE
  // =========================================================

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [role, setRole] = useState("Frontend Developer");
  const [type, setType] = useState("Technical");

  const [answer, setAnswer] = useState("");

  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const currentQuestion = questions[questionIndex];

  // =========================================================
  // INPUT STYLE
  // =========================================================

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      color: colors.text,
      bgcolor: colors.cardSoft,
      borderRadius: 2.5,

      "& fieldset": {
        borderColor: colors.inputBorder,
      },

      "&:hover fieldset": {
        borderColor: colors.purple,
      },

      "&.Mui-focused fieldset": {
        borderColor: colors.purple,
      },
    },

    "& .MuiInputBase-input": {
      color: colors.text,
    },

    "& .MuiSelect-icon": {
      color: colors.muted,
    },

    "& .MuiInputLabel-root": {
      color: colors.muted,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.purple,
    },
  };

  // =========================================================
  // ANSWER STYLE
  // =========================================================

  const answerStyle = {
    "& .MuiOutlinedInput-root": {
      color: colors.text,
      bgcolor: colors.cardSoft,
      borderRadius: 2.5,

      "& fieldset": {
        borderColor: colors.inputBorder,
      },

      "&:hover fieldset": {
        borderColor: colors.purple,
      },

      "&.Mui-focused fieldset": {
        borderColor: colors.purple,
      },
    },

    "& textarea": {
      color: colors.text,
    },

    "& textarea::placeholder": {
      color: colors.muted,
      opacity: 1,
    },
  };

  // =========================================================
  // FREE USER — LOCKED SCREEN
  // =========================================================

  if (!hasAccess) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: colors.page,
          color: colors.text,
          px: { xs: 2, sm: 3, md: 4 },
          py: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            p: { xs: 3, md: 4 },
            textAlign: "center",
            borderRadius: 4,
            border: "1px solid",
            borderColor: colors.border,

            background: isDark
              ? `
                radial-gradient(
                  circle at 90% 10%,
                  rgba(124,58,237,0.18),
                  transparent 35%
                ),
                ${colors.card}
              `
              : `
                radial-gradient(
                  circle at 90% 10%,
                  rgba(124,58,237,0.08),
                  transparent 35%
                ),
                ${colors.card}
              `,

            boxShadow: isDark
              ? "0 20px 60px rgba(0,0,0,0.25)"
              : "0 20px 60px rgba(15,23,42,0.08)",
          }}
        >
          <Typography sx={{ fontSize: 42, mb: 1 }}>🔒</Typography>

          <Typography
            sx={{
              fontSize: { xs: 22, md: 24 },
              fontWeight: 800,
              mb: 1,
              color: colors.text,
            }}
          >
            AI Interview Coach is a Pro Feature
          </Typography>

          <Typography
            sx={{
              color: colors.muted,
              mb: 3,
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            You've used all {FREE_LIMIT} free AI interview practices. Upgrade to
            Pro for unlimited access to a personalized AI interviewer tailored
            to your resume and target role.
          </Typography>

          <Button
            fullWidth
            onClick={() => navigate("/applicant/settings")}
            sx={{
              py: 1.3,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              color: "#fff",
              background: colors.button,
              boxShadow: "0 10px 28px rgba(99,102,241,0.22)",

              "&:hover": {
                background: colors.buttonHover,
              },
            }}
          >
            Upgrade to Pro
          </Button>
        </Box>
      </Box>
    );
  }

  // =========================================================
  // START INTERVIEW
  // =========================================================

  const startPractice = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await startAiInterview({
        role,
        type,
      });

      const interview = data?.interview;
      const generatedQuestions = interview?.questions || [];

      if (!interview?._id || generatedQuestions.length === 0) {
        throw new Error("Interview questions could not be generated");
      }

      // Update free usage count from backend
      if (data?.featureUsage) {
        setUsedCount(data.featureUsage.used);
      }

      setInterviewId(interview._id);
      setQuestions(generatedQuestions.map((q) => q.question));
      setQuestionIndex(0);
      setAnswer("");
      setStarted(true);
    } catch (err) {
      // Backend says free limit is reached
      if (
        err.response?.status === 403 &&
        err.response?.data?.code === "PREMIUM_FEATURE_REQUIRED"
      ) {
        setUsedCount(FREE_LIMIT);
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to start interview",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SUBMIT ANSWER
  // =========================================================

  const submitCurrentAnswer = async () => {
    if (!answer.trim() || !interviewId) return;

    try {
      setLoading(true);
      setError("");

      await submitAiAnswer(interviewId, questionIndex, answer.trim());

      // Last question
      if (questionIndex === questions.length - 1) {
        const result = await completeAiInterview(interviewId);

        navigate("/applicant/interviews/feedback", {
          state: {
            interview: result.interview,
          },
        });

        return;
      }

      setAnswer("");
      setQuestionIndex((prev) => prev + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // START SCREEN
  // =========================================================

  if (!started) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: colors.page,
          color: colors.text,
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 3, md: 5 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <Box
          sx={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            right: -180,
            top: -180,
            background: isDark
              ? "rgba(124,58,237,0.12)"
              : "rgba(124,58,237,0.06)",
            filter: "blur(25px)",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            maxWidth: 1050,
            mx: "auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              onClick={() => navigate("/applicant/interviews")}
              sx={{
                mb: 2,
                px: 0,
                textTransform: "none",
                color: colors.muted,

                "&:hover": {
                  bgcolor: "transparent",
                  color: colors.purple,
                },
              }}
            >
              ← Back to Interviews
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 28, md: 38 },
                  fontWeight: 800,
                  letterSpacing: "-0.8px",
                  color: colors.text,
                }}
              >
                AI Interview Coach
              </Typography>

              <Box
                sx={{
                  px: 1.1,
                  py: 0.4,
                  borderRadius: 5,
                  color: colors.purple,
                  bgcolor: colors.purpleBg,
                  border: "1px solid",
                  borderColor: colors.border,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 0.6,
                }}
              >
                PREMIUM
              </Box>
            </Box>

            <Typography
              sx={{
                mt: 0.8,
                color: colors.muted,
                fontSize: 15,
                maxWidth: 650,
              }}
            >
              Practice with an AI interviewer and build confidence before your
              real interview.
            </Typography>
          </Box>

          {/* Main Card */}
          <Box
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: colors.border,

              background: isDark
                ? `
                  radial-gradient(
                    circle at 90% 5%,
                    rgba(124,58,237,0.20),
                    transparent 32%
                  ),
                  ${colors.card}
                `
                : `
                  radial-gradient(
                    circle at 90% 5%,
                    rgba(124,58,237,0.10),
                    transparent 32%
                  ),
                  ${colors.card}
                `,

              p: { xs: 2.5, md: 5 },

              boxShadow: isDark
                ? "0 20px 60px rgba(0,0,0,0.20)"
                : "0 20px 60px rgba(15,23,42,0.07)",
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                mb: 4,
              }}
            >
              {/* AI ICON */}
              <Box
                sx={{
                  width: 76,
                  height: 76,
                  mx: "auto",
                  mb: 2,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark
                    ? "linear-gradient(135deg, #4c1d95, #6d28d9)"
                    : "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                  border: "1px solid rgba(124,58,237,0.45)",
                  boxShadow: isDark
                    ? "0 0 28px rgba(124,58,237,0.35)"
                    : "0 8px 25px rgba(124,58,237,0.15)",
                }}
              >
                <Typography sx={{ fontSize: 34 }}>🤖</Typography>
              </Box>

              {/* TITLE */}
              <Typography
                sx={{
                  fontSize: { xs: 25, md: 28 },
                  fontWeight: 800,
                  color: colors.text,
                  mb: 0.8,
                }}
              >
                Start Your AI Interview
              </Typography>

              {/* REAL FREE COUNT */}
              <Typography
                sx={{
                  fontSize: { xs: 14, md: 16 },
                  fontWeight: 500,
                  color: colors.muted,
                  mb: 1.2,
                }}
              >
                You have{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#8b5cf6",
                    fontWeight: 800,
                  }}
                >
                  {remaining} of {FREE_LIMIT}
                </Box>{" "}
                free AI interview practices remaining.
              </Typography>

              {/* DESCRIPTION */}
              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: 14,
                  lineHeight: 1.6,
                  maxWidth: 700,
                  mx: "auto",
                }}
              >
                Choose your target role and interview type. Our AI interviewer
                will generate questions for your practice.
              </Typography>
            </Box>
            {/* Features */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3,1fr)",
                },
                gap: 1.5,
                mt: 3,
                mb: 3,
              }}
            >
              {[
                ["Real-time Questions", "AI-generated questions"],
                ["Instant Feedback", "Review your performance"],
                ["Skill Improvement", "Practice with confidence"],
              ].map(([title, subtitle]) => (
                <Box
                  key={title}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: colors.border,
                    bgcolor: colors.cardSoft,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.4,
                      fontSize: 11.5,
                      color: colors.muted,
                    }}
                  >
                    {subtitle}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Form */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                select
                fullWidth
                label="Target Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={inputStyle}
              >
                <MenuItem value="Frontend Developer">
                  Frontend Developer
                </MenuItem>

                <MenuItem value="Backend Developer">Backend Developer</MenuItem>

                <MenuItem value="Full Stack Developer">
                  Full Stack Developer
                </MenuItem>

                <MenuItem value="Software Engineer">Software Engineer</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                label="Interview Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                sx={inputStyle}
              >
                <MenuItem value="Technical">Technical</MenuItem>

                <MenuItem value="Behavioral">Behavioral</MenuItem>

                <MenuItem value="Mixed">Mixed</MenuItem>
              </TextField>
            </Box>

            {/* Error */}
            {error && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: isDark ? "rgba(239,68,68,0.10)" : "#fef2f2",
                  border: "1px solid",
                  borderColor: "error.main",
                }}
              >
                <Typography
                  sx={{
                    color: colors.error,
                    fontSize: 13,
                  }}
                >
                  {error}
                </Typography>
              </Box>
            )}

            {/* Start Button */}
            <Button
              fullWidth
              onClick={startPractice}
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={17} sx={{ color: "#fff" }} />
                ) : (
                  <ArrowForwardRoundedIcon />
                )
              }
              sx={{
                mt: 3,
                py: 1.35,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
                background: colors.button,
                boxShadow: "0 10px 28px rgba(99,102,241,0.22)",

                "&:hover": {
                  background: colors.buttonHover,
                },

                "&.Mui-disabled": {
                  color: "#fff",
                  opacity: 0.65,
                },
              }}
            >
              {loading ? "Preparing Interview..." : "Start Practice"}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // =========================================================
  // INTERVIEW PRACTICE SCREEN
  // =========================================================

  const progress =
    questions.length > 0 ? ((questionIndex + 1) / questions.length) * 100 : 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.page,
        color: colors.text,
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, md: 32 },
              fontWeight: 800,
              color: colors.text,
            }}
          >
            AI Interview Practice
          </Typography>

          <Typography
            sx={{
              color: colors.muted,
              mt: 0.5,
              fontSize: 14,
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
            <Typography
              sx={{
                color: colors.muted,
                fontSize: 13,
              }}
            >
              Question {questionIndex + 1} of {questions.length}
            </Typography>

            <Typography
              sx={{
                color: colors.purple,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 7,
              borderRadius: 5,
              bgcolor: colors.progressTrack,

              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              },
            }}
          />
        </Box>

        {/* AI Interviewer Card */}
        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: isDark ? "rgba(139,92,246,0.30)" : "#ddd6fe",

            background: isDark
              ? "linear-gradient(110deg,#171938,#11162d)"
              : "linear-gradient(110deg,#ffffff,#f8f7ff)",

            boxShadow: isDark
              ? "0 16px 40px rgba(0,0,0,0.18)"
              : "0 16px 40px rgba(15,23,42,0.06)",
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
                bgcolor: isDark ? "#312e81" : "#ede9fe",
                color: isDark ? "#a78bfa" : "#6d28d9",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <SmartToyRoundedIcon />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: colors.text,
                }}
              >
                AI Interviewer
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: 12,
                }}
              >
                Question {questionIndex + 1}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: 18, md: 21 },
              fontWeight: 600,
              lineHeight: 1.5,
              color: colors.text,
            }}
          >
            {currentQuestion}
          </Typography>
        </Box>

        {/* Answer Card */}
        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            bgcolor: colors.card,
            border: "1px solid",
            borderColor: colors.border,
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 700,
              mb: 1.5,
              color: colors.text,
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

          {error && (
            <Typography
              sx={{
                color: colors.error,
                fontSize: 13,
                mt: 1.5,
              }}
            >
              {error}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Button
              onClick={submitCurrentAnswer}
              disabled={!answer.trim() || loading}
              endIcon={
                loading ? (
                  <CircularProgress size={16} sx={{ color: "#fff" }} />
                ) : (
                  <SendRoundedIcon />
                )
              }
              sx={{
                textTransform: "none",
                color: "#fff",
                px: 2.5,
                py: 1,
                borderRadius: 2,
                background: colors.button,

                "&:hover": {
                  background: colors.buttonHover,
                },

                "&.Mui-disabled": {
                  color: colors.muted,
                  background: colors.progressTrack,
                },
              }}
            >
              {loading
                ? "Submitting..."
                : questionIndex === questions.length - 1
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
            bgcolor: colors.cardSoft,
            border: "1px solid",
            borderColor: colors.border,
            display: "flex",
            gap: 1.2,
            alignItems: "center",
          }}
        >
          <CheckCircleRoundedIcon
            sx={{
              color: colors.success,
              flexShrink: 0,
            }}
          />

          <Typography
            sx={{
              color: colors.muted,
              fontSize: 13,
            }}
          >
            Take your time. Think clearly and answer as if you're in a real
            interview.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AIInterviewCoach;
