
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";

import useInterview from "../../../hooks/useInterview";

import ANavbar from '../../../components/layout/applicant/Navbar';
import ASidebar from '../../../components/layout/applicant/Sidebar';

const Interviews = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    loading,
    error,

    upcomingInterviews,
    pastInterviews,
    nextInterview,

    upcomingCount,
    completedCount,
    confirmedCount,
    thisWeekCount,
  } = useInterview();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  // =====================================================
  // THEME
  // =====================================================

  const isDark = theme.palette.mode === "dark";

  // =====================================================
  // DIALOG
  // =====================================================

  const openDialog = (title) => {
    setDialogTitle(title);
    setDialogOpen(true);
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // DAY
  // =====================================================

  const getDay = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
    });
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");

    if (words.length >= 2) {
      return (
        words[0][0] + words[words.length - 1][0]
      ).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          bgcolor: isDark ? "#052e1b" : "#dcfce7",
          color: isDark ? "#4ade80" : "#15803d",
        };

      case "Scheduled":
        return {
          bgcolor: isDark ? "#172554" : "#dbeafe",
          color: isDark ? "#60a5fa" : "#2563eb",
        };

      case "Pending":
        return {
          bgcolor: isDark ? "#422006" : "#fef3c7",
          color: isDark ? "#fbbf24" : "#b45309",
        };

      case "Completed":
        return {
          bgcolor: isDark ? "#052e1b" : "#dcfce7",
          color: isDark ? "#4ade80" : "#15803d",
        };

      case "Cancelled":
        return {
          bgcolor: isDark ? "#3f1111" : "#fee2e2",
          color: isDark ? "#f87171" : "#dc2626",
        };

      default:
        return {
          bgcolor: isDark ? "#1e293b" : "#e2e8f0",
          color: isDark ? "#cbd5e1" : "#475569",
        };
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 15,
          }}
        >
          Loading interviews...
        </Typography>
      </Box>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
     <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
          }}
        >
          {/* Navbar */}
          <Box
            component="header"
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 50,
            }}
          >
            <ANavbar />
          </Box>
    
          {/* Sidebar + Main */}
          <Box
            sx={{
              display: 'flex',
              minWidth: 0,
            }}
          >
            {/* Sidebar */}
            <ASidebar />
    
            {/* Main */}
            <Box
              component="main"
              sx={{
                flex: 1,
                minWidth: 0,
                bgcolor: 'background.default',
                color: 'text.primary',
                pt: 1
              }}
            >
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 30,
                md: 36,
              },
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.8px",
            }}
          >
            My Interviews
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "text.secondary",
              fontSize: 15,
            }}
          >
            Track your upcoming and completed interviews in one place.
          </Typography>
        </Box>

        <Button
          onClick={() =>
            navigate("/applicant/interviews/calendar")
          }
          startIcon={<CalendarMonthRoundedIcon />}
          variant="outlined"
          sx={{
            color: "text.primary",
            borderColor: "divider",
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            py: 1,

            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          My Calendar
        </Button>
      </Box>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: isDark
              ? "rgba(239, 68, 68, 0.12)"
              : "rgba(239, 68, 68, 0.08)",
            border: "1px solid",
            borderColor: "error.main",
          }}
        >
          <Typography
            sx={{
              color: "error.main",
            }}
          >
            {error}
          </Typography>
        </Box>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          icon={<CalendarMonthRoundedIcon />}
          title="Upcoming"
          value={upcomingCount}
          subtitle="Interviews scheduled"
          iconBg={isDark ? "#2e1065" : "#ede9fe"}
          iconColor={isDark ? "#a78bfa" : "#7c3aed"}
          lineColor="#8b5cf6"
        />

        <StatCard
          icon={<AccessTimeRoundedIcon />}
          title="This Week"
          value={thisWeekCount}
          subtitle="Interviews this week"
          iconBg={isDark ? "#082f49" : "#e0f2fe"}
          iconColor={isDark ? "#38bdf8" : "#0284c7"}
          lineColor="#3b82f6"
        />

        <StatCard
          icon={<CheckCircleRoundedIcon />}
          title="Completed"
          value={completedCount}
          subtitle="Interviews completed"
          iconBg={isDark ? "#052e1b" : "#dcfce7"}
          iconColor={isDark ? "#4ade80" : "#16a34a"}
          lineColor="#22c55e"
          green
        />

        <StatCard
          icon={<StarRoundedIcon />}
          title="Confirmed"
          value={confirmedCount}
          subtitle="Confirmed interviews"
          iconBg={isDark ? "#422006" : "#fef3c7"}
          iconColor={isDark ? "#fbbf24" : "#d97706"}
          lineColor="#f59e0b"
        />
      </Box>

      {/* =====================================================
          NEXT INTERVIEW
      ===================================================== */}

      {nextInterview && (
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            p: {
              xs: 2.5,
              md: 3.5,
            },
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",

            background: isDark
              ? "radial-gradient(circle at 90% 10%, rgba(124,58,237,0.20), transparent 35%), linear-gradient(135deg,#111a30,#0c1728)"
              : "radial-gradient(circle at 90% 10%, rgba(124,58,237,0.12), transparent 35%), linear-gradient(135deg,#f5f3ff,#f8fafc)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: isDark
                ? "rgba(99,102,241,0.08)"
                : "rgba(99,102,241,0.05)",
              right: -100,
              top: -100,
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* TOP */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
                gap: 2,
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "inline-flex",
                    px: 1.4,
                    py: 0.6,
                    mb: 1.5,
                    borderRadius: 2,
                    bgcolor: isDark ? "#312e81" : "#ede9fe",
                    color: isDark ? "#c4b5fd" : "#6d28d9",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                  }}
                >
                  NEXT INTERVIEW
                </Box>

                <Typography
                  sx={{
                    fontSize: {
                      xs: 25,
                      md: 28,
                    },
                    fontWeight: 700,
                    color: "text.primary",
                  }}
                >
                  {nextInterview.job?.title ||
                    "Interview"}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.8,
                    color: "text.secondary",
                  }}
                >
                  <BusinessRoundedIcon
                    sx={{ fontSize: 18 }}
                  />

                  <Typography
                    sx={{
                      fontSize: 14,
                    }}
                  >
                    {nextInterview.recruiter?.name ||
                      "Recruiter"}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  width: 76,
                  height: 76,
                  borderRadius: 3,
                  bgcolor: isDark ? "#f8fafc" : "#1e293b",
                  color: isDark ? "#111827" : "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 22,
                }}
              >
                {getInitials(
                  nextInterview.recruiter?.name ||
                    nextInterview.job?.title ||
                    "IN"
                )}
              </Box>
            </Box>

            {/* DETAILS */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
                mt: 3,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <InterviewDetail
                icon={<CalendarMonthRoundedIcon />}
                label="Date"
                value={formatDate(
                  nextInterview.date
                )}
                sub={getDay(
                  nextInterview.date
                )}
              />

              <InterviewDetail
                icon={<AccessTimeRoundedIcon />}
                label="Time"
                value={nextInterview.time || "N/A"}
                sub={
                  nextInterview.duration || ""
                }
              />

              <InterviewDetail
                icon={
                  <VideoCameraFrontRoundedIcon />
                }
                label="Interview Type"
                value={
                  nextInterview.type ||
                  "Online"
                }
                sub={
                  nextInterview.meetingLink
                    ? "Google Meet"
                    : "Online"
                }
              />
            </Box>

            {/* ACTIONS */}

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mt: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={() => {
                  if (
                    nextInterview.meetingLink
                  ) {
                    window.open(
                      nextInterview.meetingLink,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  } else {
                    openDialog(
                      "Meeting link not available"
                    );
                  }
                }}
                startIcon={
                  <VideoCameraFrontRoundedIcon />
                }
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2.5,
                  py: 1.1,
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  boxShadow: "none",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#5859e8,#7c3aed)",
                    boxShadow: "none",
                  },
                }}
              >
                Join Interview
              </Button>

              <Button
                onClick={() =>
                  navigate(
                    `/applicant/interviews/details/${nextInterview._id}`
                  )
                }
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2.5,
                  color: isDark ? "#c4b5fd" : "#6d28d9",
                  borderColor: "primary.main",

                  "&:hover": {
                    borderColor: "secondary.main",
                    backgroundColor: "action.hover",
                  },
                }}
              >
                View Details
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* =====================================================
          NO UPCOMING INTERVIEW
      ===================================================== */}

      {!nextInterview && !error && (
        <Box
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            No upcoming interviews
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "text.secondary",
              fontSize: 13,
            }}
          >
            You don't have any upcoming interviews
            scheduled.
          </Typography>
        </Box>
      )}

      {/* =====================================================
          AI INTERVIEW COACH
      ===================================================== */}

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          p: {
            xs: 2,
            md: 2.5,
          },
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: isDark ? "#2d285e" : "#ddd6fe",

          background: isDark
            ? "linear-gradient(110deg,#171938,#11162d)"
            : "linear-gradient(110deg,#f5f3ff,#fafafa)",

          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.8,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: isDark ? "#312e81" : "#ede9fe",
              color: isDark ? "#a78bfa" : "#7c3aed",
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
                fontSize: 18,
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              AI Interview Coach
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              Practice before your real interview
              with an AI interviewer.
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={() =>
            navigate(
              "/applicant/interviews/coach"
            )
          }
          endIcon={
            <ArrowForwardRoundedIcon />
          }
          sx={{
            bgcolor: "primary.main",
            color: "#fff",
            textTransform: "none",
            borderRadius: 2,
            px: 2.2,
            py: 1,
            fontWeight: 600,
            flexShrink: 0,

            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Start Practicing
        </Button>
      </Box>

      {/* =====================================================
          UPCOMING
      ===================================================== */}

      <InterviewList
        title="Upcoming Interviews"
        subtitle="Your scheduled interviews."
        interviews={upcomingInterviews}
        upcoming
      />

      {/* =====================================================
          PAST
      ===================================================== */}

      <InterviewList
        title="Past Interviews"
        subtitle="Your completed interview history."
        interviews={pastInterviews}
      />

      {/* =====================================================
          INTERVIEW INSIGHTS
      ===================================================== */}

      <Box sx={{ mt: 4 }}>
        <Typography
          sx={{
            fontSize: 21,
            fontWeight: 700,
            mb: 2,
            color: "text.primary",
          }}
        >
          Interview Insights
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          <InsightCard
            title="Success Rate"
            value="72%"
            subtitle="Great job! Keep it up"
            icon={<TrendingUpRoundedIcon />}
            color="#22c55e"
          />

          <InsightCard
            title="Average Rating"
            value="4.2/5"
            subtitle="Based on interviews"
            icon={<StarRoundedIcon />}
            color="#f59e0b"
          />

          <InsightListCard
            title="Strong Areas"
            items={[
              "Data Structures",
              "Problem Solving",
              "Communication",
            ]}
            success
          />

          <InsightListCard
            title="Areas to Improve"
            items={[
              "System Design",
              "Behavioral Answers",
              "Confidence",
            ]}
          />
        </Box>
      </Box>

      {/* =====================================================
          PREPARATION TIP
      ===================================================== */}

      <Box
        sx={{
          mt: 3,
          mb: 2,
          p: {
            xs: 2,
            md: 2.5,
          },
          borderRadius: 3,
          border: "1px solid",
          borderColor: isDark ? "#30275c" : "#ddd6fe",

          background: isDark
            ? "linear-gradient(100deg,#171936,#11162b)"
            : "linear-gradient(100deg,#f5f3ff,#fafafa)",

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              bgcolor: isDark ? "#422006" : "#fef3c7",
              color: isDark ? "#fbbf24" : "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LightbulbRoundedIcon />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Preparation Tip
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              Consistent practice is the key to
              success. Use AI Interview Coach to
              improve your skills.
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={() =>
            navigate(
              "/applicant/interviews/coach"
            )
          }
          endIcon={
            <ArrowForwardRoundedIcon />
          }
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            color: isDark ? "#c4b5fd" : "#6d28d9",
            borderColor: "primary.main",
            px: 2,
            flexShrink: 0,

            "&:hover": {
              borderColor: "secondary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          Practice Now
        </Button>
      </Box>

      {/* =====================================================
          DIALOG
      ===================================================== */}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            minWidth: {
              xs: "90%",
              sm: 420,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          {dialogTitle}
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            The meeting link is not available
            for this interview yet.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              color: "primary.main",
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
    </Box>
    </Box>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  iconBg,
  iconColor,
  lineColor,
  green,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        p: 2.5,
        minHeight: 125,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 43,
            height: 43,
            borderRadius: "50%",
            bgcolor: iconBg,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 13,
          }}
        >
          {title}
        </Typography>
      </Box>

      <Typography
        sx={{
          mt: 1.5,
          fontSize: 29,
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          color: green
            ? theme.palette.success.main
            : theme.palette.text.secondary,
          fontSize: 12,
        }}
      >
        {subtitle}
      </Typography>

      <Box
        sx={{
          position: "absolute",
          right: 12,
          bottom: 12,
          width: 70,
          height: 28,
          opacity: 0.9,
        }}
      >
        <svg
          width="70"
          height="28"
          viewBox="0 0 70 28"
        >
          <polyline
            points="2,22 12,20 20,21 30,14 39,17 49,7 58,12 68,3"
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
          />
        </svg>
      </Box>
    </Box>
  );
};

/* =========================================================
   INTERVIEW DETAIL
========================================================= */

const InterviewDetail = ({
  icon,
  label,
  value,
  sub,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.3,
      }}
    >
      <Box
        sx={{
          color: "primary.main",
          display: "flex",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 12,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.2,
            fontSize: 14,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 12,
          }}
        >
          {sub}
        </Typography>
      </Box>
    </Box>
  );
};

/* =========================================================
   INTERVIEW LIST
========================================================= */

const InterviewList = ({
  title,
  subtitle,
  interviews,
  upcoming,
}) => {
  const navigate = useNavigate();

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const formatDateStatic = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getDayStatic = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
      }
    );
  };

  const getInitialsStatic = (name = "") => {
    const words = name.trim().split(" ");

    if (words.length >= 2) {
      return (
        words[0][0] +
        words[words.length - 1][0]
      ).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  const getStatusStyleStatic = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          bgcolor: isDark ? "#052e1b" : "#dcfce7",
          color: isDark ? "#4ade80" : "#15803d",
        };

      case "Scheduled":
        return {
          bgcolor: isDark ? "#172554" : "#dbeafe",
          color: isDark ? "#60a5fa" : "#2563eb",
        };

      case "Pending":
        return {
          bgcolor: isDark ? "#422006" : "#fef3c7",
          color: isDark ? "#fbbf24" : "#b45309",
        };

      case "Completed":
        return {
          bgcolor: isDark ? "#052e1b" : "#dcfce7",
          color: isDark ? "#4ade80" : "#15803d",
        };

      case "Cancelled":
        return {
          bgcolor: isDark ? "#3f1111" : "#fee2e2",
          color: isDark ? "#f87171" : "#dc2626",
        };

      default:
        return {
          bgcolor: isDark ? "#1e293b" : "#e2e8f0",
          color: isDark ? "#cbd5e1" : "#475569",
        };
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 19,
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 13,
              mt: 0.4,
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>

      {/* EMPTY */}

      {interviews.length === 0 ? (
        <Box
          sx={{
            px: 2.5,
            py: 3,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 13,
            }}
          >
            No interviews found.
          </Typography>
        </Box>
      ) : (
        interviews.map((interview, index) => {
          const jobTitle =
            interview.job?.title ||
            "Interview";

          const company =
            interview.recruiter?.name ||
            "Recruiter";

          return (
            <Box
              key={interview._id}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "2fr 1fr 1fr auto",
                },
                alignItems: "center",
                gap: 2,
                px: 2.5,
                py: 2,
                borderTop: "1px solid",
                borderColor: "divider",

                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              {/* JOB / COMPANY */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,

                    bgcolor:
                      index % 3 === 0
                        ? isDark
                          ? "#312e81"
                          : "#ede9fe"
                        : index % 3 === 1
                        ? isDark
                          ? "#172554"
                          : "#dbeafe"
                        : isDark
                        ? "#422006"
                        : "#fef3c7",

                    color:
                      index % 3 === 0
                        ? isDark
                          ? "#c4b5fd"
                          : "#7c3aed"
                        : index % 3 === 1
                        ? isDark
                          ? "#60a5fa"
                          : "#2563eb"
                        : isDark
                        ? "#fbbf24"
                        : "#d97706",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {getInitialsStatic(company)}
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {jobTitle}
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: 12,
                      mt: 0.3,
                    }}
                  >
                    {company}
                  </Typography>
                </Box>
              </Box>

              {/* DATE */}

              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "text.primary",
                  }}
                >
                  {formatDateStatic(
                    interview.date
                  )}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 12,
                    mt: 0.3,
                  }}
                >
                  {getDayStatic(
                    interview.date
                  )}
                </Typography>
              </Box>

              {/* TIME */}

              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "text.primary",
                  }}
                >
                  {interview.time || "N/A"}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 12,
                    mt: 0.3,
                  }}
                >
                  {interview.type ||
                    "Online"}
                </Typography>
              </Box>

              {/* ACTION */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: {
                    xs: "flex-start",
                    md: "flex-end",
                  },
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    px: 1.2,
                    py: 0.55,
                    borderRadius: 1.5,
                    fontSize: 11,
                    fontWeight: 600,
                    ...getStatusStyleStatic(
                      interview.status
                    ),
                  }}
                >
                  {interview.status ||
                    "Scheduled"}
                </Box>

                <Button
                  onClick={() => {
                    if (upcoming) {
                      navigate(
                        `/applicant/interviews/details/${interview._id}`
                      );
                    } else {
                      navigate(
                        `/applicant/interviews/feedback/${interview._id}`
                      );
                    }
                  }}
                  endIcon={
                    <ArrowForwardRoundedIcon />
                  }
                  sx={{
                    color: isDark
                      ? "#a78bfa"
                      : "#7c3aed",
                    textTransform: "none",
                    fontSize: 12,
                    minWidth: "auto",

                    "&:hover": {
                      backgroundColor:
                        "action.hover",
                    },
                  }}
                >
                  {upcoming
                    ? "View"
                    : "View Feedback"}
                </Button>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};

/* =========================================================
   INSIGHT CARD
========================================================= */

const InsightCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 13,
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            color,
            display: "flex",
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        sx={{
          mt: 2,
          fontSize: 30,
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          color,
          fontSize: 12,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

/* =========================================================
   INSIGHT LIST CARD
========================================================= */

const InsightListCard = ({
  title,
  items,
  success = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: 13,
          mb: 2,
        }}
      >
        {title}
      </Typography>

      {items.map((item) => (
        <Box
          key={item}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.2,
          }}
        >
          {success ? (
            <CheckCircleRoundedIcon
              sx={{
                fontSize: 17,
                color: "success.main",
              }}
            />
          ) : (
            <Box
              sx={{
                width: 17,
                height: 17,
                borderRadius: "50%",
                bgcolor: isDark
                  ? "#422006"
                  : "#fef3c7",
                color: isDark
                  ? "#f59e0b"
                  : "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              !
            </Box>
          )}

          <Typography
            sx={{
              fontSize: 13,
              color: "text.primary",
            }}
          >
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Interviews;