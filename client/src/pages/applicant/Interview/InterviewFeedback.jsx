import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAiInterviewById } from "../../../api/aiInterviewApi";

import {
  Box,
  Button,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const getPerformanceTitle = (score) => {
  if (score >= 85) return "Excellent Performance! 🎉";
  if (score >= 70) return "Good Performance 👍";
  return "Keep Improving 💪";
};

const getPerformanceDescription = (score) => {
  if (score >= 85)
    return "You demonstrated strong knowledge, good problem-solving ability and clear communication during the interview.";
  if (score >= 70)
    return "You showed good understanding and problem-solving skills. With more structured answers, your performance can improve further.";
  return "You have a good foundation, but there are some areas that need more practice before your next interview.";
};

const InterviewFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();
const [interview, setInterview] = useState(location.state?.interview || null);
const [loading, setLoading] = useState(!location.state?.interview && !!id);
const [fetchError, setFetchError] = useState("");

useEffect(() => {
  // Already have data from navigation state — no need to fetch
  if (interview || !id) return;

  const fetchInterview = async () => {
    try {
      setLoading(true);
      const data = await getAiInterviewById(id);
      setInterview(data.interview);
    } catch (err) {
      setFetchError("Could not load this interview report");
    } finally {
      setLoading(false);
    }
  };

  fetchInterview();
}, [id, interview]);

if (loading) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#07111f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{ color: "#a78bfa" }} />
    </Box>
  );
}

  // No data passed in (e.g. page refreshed directly) — nothing to show
  if (!interview || !interview.evaluation) {
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
          <Typography sx={{ fontSize: 28, fontWeight: 700, mb: 1 }}>
            Feedback Not Found
          </Typography>

          <Typography sx={{ color: "#94a3b8", mb: 3 }}>
            This feedback isn't available. It may have expired, or you
            navigated here directly instead of completing an interview.
          </Typography>

          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/applicant/interviews")}
            sx={{ color: "#a78bfa", textTransform: "none" }}
          >
            Back to Interviews
          </Button>
        </Box>
      </Box>
    );
  }

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
    ? new Date(interview.updatedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

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
          onClick={() => navigate("/applicant/interviews")}
          sx={{ color: "#a78bfa", textTransform: "none", mb: 2 }}
        >
          Back to Interviews
        </Button>

        <Typography sx={{ fontSize: { xs: 30, md: 36 }, fontWeight: 700 }}>
          AI Interview Feedback
        </Typography>

        <Typography sx={{ color: "#94a3b8", mt: 0.7, fontSize: 15 }}>
          {interview.role} • {interview.type} Interview
        </Typography>

        {completedDate && (
          <Typography sx={{ color: "#64748b", mt: 0.4, fontSize: 13 }}>
            Completed on {completedDate}
          </Typography>
        )}
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
        <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 3 }}>
          Overall Performance
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
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
            <Typography sx={{ fontSize: 30, fontWeight: 700 }}>{score}%</Typography>
            <Typography sx={{ color: "#a78bfa", fontSize: 11 }}>Score</Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 0.5 }}>
              {getPerformanceTitle(score)}
            </Typography>

            <Typography sx={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
              {getPerformanceDescription(score)}
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
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
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
        />

        <ScoreCard
          title="Problem Solving"
          score={`${problemSolving}%`}
          value={problemSolving}
          icon={<CheckCircleRoundedIcon />}
          color="#22c55e"
        />

        <ScoreCard
          title="Communication"
          score={`${communication}%`}
          value={communication}
          icon={<StarRoundedIcon />}
          color="#f59e0b"
        />

        <ScoreCard
          title="Relevance to Role"
          score={`${relevance}%`}
          value={relevance}
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
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ p: 3, borderRadius: 3, bgcolor: "#0e1a2b", border: "1px solid #24334a" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 2 }}>
            💪 Your Strengths
          </Typography>

          {strengths.length === 0 && (
            <Typography sx={{ color: "#64748b", fontSize: 14 }}>
              No specific strengths identified.
            </Typography>
          )}

          {strengths.map((item, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
              <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "#22c55e" }} />
              <Typography sx={{ color: "#cbd5e1", fontSize: 14 }}>{item}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ p: 3, borderRadius: 3, bgcolor: "#0e1a2b", border: "1px solid #24334a" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 2 }}>
            🎯 Areas to Improve
          </Typography>

          {improvements.length === 0 && (
            <Typography sx={{ color: "#64748b", fontSize: 14 }}>
              No specific improvement areas identified.
            </Typography>
          )}

          {improvements.map((item, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
              <LightbulbRoundedIcon sx={{ fontSize: 18, color: "#fbbf24" }} />
              <Typography sx={{ color: "#cbd5e1", fontSize: 14 }}>{item}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* AI Recommendations */}
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
        <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 2 }}>
          Interview Summary
        </Typography>

        <Typography sx={{ color: "#94a3b8", fontSize: 14, mb: 2 }}>
          Interview Type:{" "}
          <strong style={{ color: "#e2e8f0" }}>{interview.type}</strong>
        </Typography>

        <Typography sx={{ color: "#94a3b8", fontSize: 14, mb: 2 }}>
          Role Practiced:{" "}
          <strong style={{ color: "#e2e8f0" }}>{interview.role}</strong>
        </Typography>

        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#111c31", border: "1px solid #24334a" }}>
          <Typography sx={{ color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>
            AI Recommendations
          </Typography>

          {recommendations.length === 0 ? (
            <Typography sx={{ color: "#cbd5e1", fontSize: 14, mt: 0.7 }}>
              No recommendations available.
            </Typography>
          ) : (
            recommendations.map((rec, i) => (
              <Typography
                key={i}
                sx={{ color: "#cbd5e1", fontSize: 14, mt: 0.7, lineHeight: 1.6 }}
              >
                • {rec}
              </Typography>
            ))
          )}
        </Box>
      </Box>

      {/* Bottom Actions */}
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
          onClick={() => navigate("/applicant/interviews")}
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
          onClick={() => navigate("/applicant/interviews/coach")}
          sx={{
            color: "#fff",
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            "&:hover": { background: "linear-gradient(135deg,#5859e8,#7c3aed)" },
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

const ScoreCard = ({ title, score, value, icon, color }) => {
  return (
    <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: "#0e1a2b", border: "1px solid #24334a" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography sx={{ color: "#cbd5e1", fontSize: 14, fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ color }}>{icon}</Box>
      </Box>

      <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 1 }}>{score}</Typography>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 6,
          borderRadius: 5,
          bgcolor: "#1e293b",
          "& .MuiLinearProgress-bar": { background: color },
        }}
      />
    </Box>
  );
};

export default InterviewFeedback;