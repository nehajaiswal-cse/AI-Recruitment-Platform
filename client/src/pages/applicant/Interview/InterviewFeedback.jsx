import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Typography,
  LinearProgress,
  CircularProgress,
  useTheme,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import { getAiInterviewById } from "../../../api/aiInterviewApi";

// =========================================================
// PERFORMANCE TITLE
// =========================================================

const getPerformanceTitle = (score) => {
  if (score >= 85) return "Excellent Performance! 🎉";
  if (score >= 70) return "Good Performance 👍";

  return "Keep Improving 💪";
};

// =========================================================
// PERFORMANCE DESCRIPTION
// =========================================================

const getPerformanceDescription = (score) => {
  if (score >= 85) {
    return "You demonstrated strong knowledge, good problem-solving ability and clear communication during the interview.";
  }

  if (score >= 70) {
    return "You showed good understanding and problem-solving skills. With more structured answers, your performance can improve further.";
  }

  return "You have a good foundation, but there are some areas that need more practice before your next interview.";
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const InterviewFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // =========================================================
  // THEME
  // =========================================================

  const colors = {
    page: isDark ? "#07111f" : "#f8fafc",
    card: isDark ? "#0e1a2b" : "#ffffff",
    cardSoft: isDark ? "#111c31" : "#f8fafc",

    border: isDark ? "#293752" : "#e2e8f0",
    inputBorder: isDark ? "#334155" : "#cbd5e1",

    text: isDark ? "#f8fafc" : "#0f172a",
    muted: isDark ? "#94a3b8" : "#64748b",
    softText: isDark ? "#cbd5e1" : "#475569",

    purple: isDark ? "#a78bfa" : "#7c3aed",
    purpleBg: isDark ? "#312e81" : "#ede9fe",

    progressTrack: isDark ? "#1e293b" : "#e2e8f0",

    success: isDark ? "#4ade80" : "#16a34a",
    warning: isDark ? "#fbbf24" : "#d97706",
    error: isDark ? "#f87171" : "#dc2626",

    button:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",

    buttonHover:
      "linear-gradient(135deg,#5859e8,#7c3aed)",
  };

  // =========================================================
  // INTERVIEW DATA
  // =========================================================

  const { id } = useParams();

  const [interview, setInterview] = useState(
    location.state?.interview || null
  );

  const [loading, setLoading] = useState(
    !location.state?.interview && !!id
  );

  const [fetchError, setFetchError] = useState("");

  // =========================================================
  // FETCH OLD INTERVIEW
  // =========================================================

  useEffect(() => {
    if (interview || !id) return;

    const fetchInterview = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const data = await getAiInterviewById(id);

        setInterview(data?.interview || null);
      } catch (err) {
        setFetchError(
          err.response?.data?.message ||
            "Could not load this interview report"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, interview]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: colors.page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          sx={{
            color: colors.purple,
          }}
        />
      </Box>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!interview || !interview.evaluation) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: colors.page,
          color: colors.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            p: 4,
            textAlign: "center",
            borderRadius: 4,
            bgcolor: colors.card,
            border: "1px solid",
            borderColor: colors.border,
          }}
        >
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              mb: 1,
            }}
          >
            Feedback Not Found
          </Typography>

          <Typography
            sx={{
              color: colors.muted,
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {fetchError ||
              "This feedback isn't available. It may have expired, or the interview report could not be loaded."}
          </Typography>

          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() =>
              navigate("/applicant/interviews")
            }
            sx={{
              color: colors.purple,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Back to Interviews
          </Button>
        </Box>
      </Box>
    );
  }

  // =========================================================
  // EVALUATION DATA
  // =========================================================

  const evaluation = interview.evaluation;

  const score = evaluation.overallScore ?? 0;
  const technical = evaluation.technicalKnowledge ?? 0;
  const problemSolving = evaluation.problemSolving ?? 0;
  const communication = evaluation.communication ?? 0;
  const relevance = evaluation.relevance ?? 0;

  const strengths = evaluation.strengths || [];
  const improvements = evaluation.areasToImprove || [];
  const recommendations = evaluation.recommendations || [];

  const completedDate = interview.updatedAt
    ? new Date(
        interview.updatedAt
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  // =========================================================
  // PAGE
  // =========================================================

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
          maxWidth: 1000,
          mx: "auto",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() =>
              navigate("/applicant/interviews")
            }
            sx={{
              color: colors.purple,
              textTransform: "none",
              mb: 2,
            }}
          >
            Back to Interviews
          </Button>

          <Typography
            sx={{
              fontSize: { xs: 30, md: 36 },
              fontWeight: 800,
              color: colors.text,
            }}
          >
            AI Interview Feedback
          </Typography>

          <Typography
            sx={{
              color: colors.muted,
              mt: 0.7,
              fontSize: 15,
            }}
          >
            {interview.role} • {interview.type} Interview
          </Typography>

          {completedDate && (
            <Typography
              sx={{
                color: colors.muted,
                mt: 0.4,
                fontSize: 13,
              }}
            >
              Completed on {completedDate}
            </Typography>
          )}
        </Box>

        {/* =================================================
            OVERALL SCORE
        ================================================= */}

        <Box
          sx={{
            p: { xs: 3, md: 4 },
            mb: 3,
            borderRadius: 3,
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
              ? "0 18px 45px rgba(0,0,0,0.16)"
              : "0 18px 45px rgba(15,23,42,0.06)",
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
            {/* Score Circle */}
            <Box
              sx={{
                width: 110,
                height: 110,
                borderRadius: "50%",

                bgcolor: colors.purpleBg,
                border: "6px solid #6366f1",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: colors.text,
                }}
              >
                {score}%
              </Typography>

              <Typography
                sx={{
                  color: colors.purple,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                Score
              </Typography>
            </Box>

            {/* Description */}
            <Box
              sx={{
                flex: 1,
                minWidth: 250,
              }}
            >
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                {getPerformanceTitle(score)}
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {getPerformanceDescription(score)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* =================================================
            SKILLS
        ================================================= */}

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
          <ScoreCard
            title="Technical Knowledge"
            score={`${technical}%`}
            value={technical}
            icon={<TrendingUpRoundedIcon />}
            color="#6366f1"
            colors={colors}
          />

          <ScoreCard
            title="Problem Solving"
            score={`${problemSolving}%`}
            value={problemSolving}
            icon={<CheckCircleRoundedIcon />}
            color="#22c55e"
            colors={colors}
          />

          <ScoreCard
            title="Communication"
            score={`${communication}%`}
            value={communication}
            icon={<StarRoundedIcon />}
            color="#f59e0b"
            colors={colors}
          />

          <ScoreCard
            title="Relevance to Role"
            score={`${relevance}%`}
            value={relevance}
            icon={<TrendingUpRoundedIcon />}
            color="#8b5cf6"
            colors={colors}
          />
        </Box>

        {/* =================================================
            STRENGTHS + IMPROVEMENTS
        ================================================= */}

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
          {/* Strengths */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: colors.card,
              border: "1px solid",
              borderColor: colors.border,
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

            {strengths.length === 0 && (
              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: 14,
                }}
              >
                No specific strengths identified.
              </Typography>
            )}

            {strengths.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-start",
                  mb: 1.5,
                }}
              >
                <CheckCircleRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: colors.success,
                    mt: 0.15,
                  }}
                />

                <Typography
                  sx={{
                    color: colors.softText,
                    fontSize: 14,
                    lineHeight: 1.5,
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
              bgcolor: colors.card,
              border: "1px solid",
              borderColor: colors.border,
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

            {improvements.length === 0 && (
              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: 14,
                }}
              >
                No specific improvement areas identified.
              </Typography>
            )}

            {improvements.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-start",
                  mb: 1.5,
                }}
              >
                <LightbulbRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: colors.warning,
                    mt: 0.15,
                  }}
                />

                <Typography
                  sx={{
                    color: colors.softText,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* =================================================
            INTERVIEW SUMMARY
        ================================================= */}

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: colors.card,
            border: "1px solid",
            borderColor: colors.border,
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
              color: colors.muted,
              fontSize: 14,
              mb: 1.5,
            }}
          >
            Interview Type:{" "}
            <Box
              component="span"
              sx={{
                color: colors.text,
                fontWeight: 700,
              }}
            >
              {interview.type}
            </Box>
          </Typography>

          <Typography
            sx={{
              color: colors.muted,
              fontSize: 14,
              mb: 2,
            }}
          >
            Role Practiced:{" "}
            <Box
              component="span"
              sx={{
                color: colors.text,
                fontWeight: 700,
              }}
            >
              {interview.role}
            </Box>
          </Typography>

          {/* AI Recommendations */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: colors.cardSoft,
              border: "1px solid",
              borderColor: colors.border,
            }}
          >
            <Typography
              sx={{
                color: colors.purple,
                fontSize: 13,
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              AI Recommendations
            </Typography>

            {recommendations.length === 0 ? (
              <Typography
                sx={{
                  color: colors.softText,
                  fontSize: 14,
                  mt: 0.7,
                }}
              >
                No recommendations available.
              </Typography>
            ) : (
              recommendations.map((rec, index) => (
                <Typography
                  key={index}
                  sx={{
                    color: colors.softText,
                    fontSize: 14,
                    mt: 0.7,
                    lineHeight: 1.6,
                  }}
                >
                  • {rec}
                </Typography>
              ))
            )}
          </Box>
        </Box>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <Box
          sx={{
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
              color: colors.purple,
              borderColor: colors.purple,
              textTransform: "none",
              borderRadius: 2,
              px: 3,

              "&:hover": {
                borderColor: colors.purple,
                bgcolor: colors.purpleBg,
              },
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
              background: colors.button,

              "&:hover": {
                background: colors.buttonHover,
              },
            }}
          >
            Practice Again
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// =========================================================
// SCORE CARD
// =========================================================

const ScoreCard = ({
  title,
  score,
  value,
  icon,
  color,
  colors,
}) => {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: colors.card,
        border: "1px solid",
        borderColor: colors.border,
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
            color: colors.softText,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ color }}>
          {icon}
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 800,
          mb: 1,
          color: colors.text,
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
          bgcolor: colors.progressTrack,

          "& .MuiLinearProgress-bar": {
            background: color,
          },
        }}
      />
    </Box>
  );
};

export default InterviewFeedback;