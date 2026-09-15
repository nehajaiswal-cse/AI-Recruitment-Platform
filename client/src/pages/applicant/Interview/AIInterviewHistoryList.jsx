import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";

import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { getAiInterviewHistory } from "../../../api/aiInterviewApi";

const AIInterviewHistoryList = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const colors = {
    card: isDark ? "#0e1a2b" : "#ffffff",
    cardSoft: isDark ? "#111c31" : "#f8fafc",
    border: isDark ? "#24334a" : "#e2e8f0",

    text: isDark ? "#f8fafc" : "#0f172a",
    muted: isDark ? "#94a3b8" : "#64748b",

    purple: isDark ? "#a78bfa" : "#7c3aed",
    purpleBg: isDark ? "#312e81" : "#ede9fe",

    hoverBorder: isDark ? "#6366f1" : "#8b5cf6",

    success: isDark ? "#4ade80" : "#16a34a",
    warning: isDark ? "#fbbf24" : "#d97706",

    error: isDark ? "#f87171" : "#dc2626",
  };

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAiInterviewHistory();

        setHistory(data?.interviews || []);
      } catch (err) {
        setError("Failed to load AI interview history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 4,
        }}
      >
        <CircularProgress
          size={24}
          sx={{
            color: colors.purple,
          }}
        />
      </Box>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <Typography
        sx={{
          color: colors.error,
          fontSize: 14,
          py: 2,
        }}
      >
        {error}
      </Typography>
    );
  }

  // =========================================================
  // COMPLETED ONLY
  // =========================================================

  const completedOnly = history.filter(
    (item) => item.status === "completed"
  );

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (completedOnly.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: colors.card,
          border: "1px solid",
          borderColor: colors.border,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            mx: "auto",
            mb: 1.5,
            borderRadius: "50%",
            bgcolor: colors.purpleBg,
            color: colors.purple,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SmartToyRoundedIcon />
        </Box>

        <Typography
          sx={{
            color: colors.muted,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          No AI interview history yet. Complete your first
          Pro AI interview to see it here.
        </Typography>
      </Box>
    );
  }

  // =========================================================
  // HISTORY LIST
  // =========================================================

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {completedOnly.map((item) => {
        const score = item.evaluation?.overallScore;

        const scoreColor =
          (score ?? 0) >= 70
            ? colors.success
            : colors.warning;

        return (
          <Box
            key={item._id}
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate(
                `/applicant/interviews/feedback/${item._id}`
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                navigate(
                  `/applicant/interviews/feedback/${item._id}`
                );
              }
            }}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,

              bgcolor: colors.card,
              border: "1px solid",
              borderColor: colors.border,

              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              cursor: "pointer",

              transition:
                "border-color 0.2s, transform 0.2s, box-shadow 0.2s",

              "&:hover": {
                borderColor: colors.hoverBorder,
                transform: "translateY(-1px)",
                boxShadow: isDark
                  ? "0 10px 28px rgba(0,0,0,0.16)"
                  : "0 10px 28px rgba(15,23,42,0.06)",
              },

              "&:focus-visible": {
                outline: `2px solid ${colors.purple}`,
                outlineOffset: 2,
              },
            }}
          >
            {/* Left */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",

                  bgcolor: colors.purpleBg,
                  color: colors.purple,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  flexShrink: 0,
                }}
              >
                <SmartToyRoundedIcon
                  sx={{ fontSize: 20 }}
                />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: colors.text,

                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.role || "AI Interview"}{" "}
                  • {item.type || "Interview"}
                </Typography>

                <Typography
                  sx={{
                    color: colors.muted,
                    fontSize: 12,
                    mt: 0.3,
                  }}
                >
                  {item.updatedAt
                    ? new Date(
                        item.updatedAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date unavailable"}
                </Typography>
              </Box>
            </Box>

            {/* Right */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                ml: 2,
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: scoreColor,
                }}
              >
                {score ?? "--"}%
              </Typography>

              <ChevronRightRoundedIcon
                sx={{
                  color: colors.muted,
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default AIInterviewHistoryList;