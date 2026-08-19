import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

const upcomingInterviews = [
  {
    id: 1,
    company: "InnovateX Solutions",
    role: "Frontend Developer",
    date: "22 Aug 2026",
    day: "Friday",
    time: "02:00 PM",
    duration: "60 min",
    type: "Technical Interview",
    status: "Scheduled",
    initials: "IN",
  },
  {
    id: 2,
    company: "CloudStack Technologies",
    role: "Full Stack Developer",
    date: "25 Aug 2026",
    day: "Monday",
    time: "11:30 AM",
    duration: "30 min",
    type: "HR Interview",
    status: "Scheduled",
    initials: "CL",
  },
  {
    id: 3,
    company: "WebCraft Solutions",
    role: "Software Engineer",
    date: "28 Aug 2026",
    day: "Thursday",
    time: "04:00 PM",
    duration: "45 min",
    type: "Technical Interview",
    status: "Confirmed",
    initials: "WO",
  },
];

const pastInterviews = [
  {
    id: "1",
    company: "WebEra Technologies",
    role: "React Developer",
    date: "15 Aug 2026",
    day: "Friday",
    time: "03:00 PM",
    duration: "45 min",
    status: "Shortlisted",
    initials: "WE",
  },
  {
    id: "2",
    company: "DataCore Systems",
    role: "Software Engineer",
    date: "10 Aug 2026",
    day: "Sunday",
    time: "11:00 AM",
    duration: "30 min",
    status: "Under Review",
    initials: "DC",
  },
  {
    id: "3",
    company: "InnovateX Solutions",
    role: "Backend Developer",
    date: "05 Aug 2026",
    day: "Tuesday",
    time: "02:00 PM",
    duration: "45 min",
    status: "Not Selected",
    initials: "IN",
  },
];

const Interviews = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  const openDialog = (title) => {
    setDialogTitle(title);
    setDialogOpen(true);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          bgcolor: "#052e1b",
          color: "#4ade80",
        };

      case "Scheduled":
        return {
          bgcolor: "#172554",
          color: "#60a5fa",
        };

      case "Shortlisted":
        return {
          bgcolor: "#052e2b",
          color: "#34d399",
        };

      case "Under Review":
        return {
          bgcolor: "#422006",
          color: "#fbbf24",
        };

      case "Not Selected":
        return {
          bgcolor: "#3f1111",
          color: "#f87171",
        };

      default:
        return {
          bgcolor: "#1e293b",
          color: "#cbd5e1",
        };
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#07111f",
        color: "#f8fafc",
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
              color: "#f8fafc",
              letterSpacing: "-0.8px",
            }}
          >
            My Interviews
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "#94a3b8",
              fontSize: 15,
            }}
          >
            Track your upcoming and completed interviews in one place.
          </Typography>
        </Box>

        <Button
          onClick={() => navigate("/applicant/interviews/calendar")}
          startIcon={<CalendarMonthRoundedIcon />}
          variant="outlined"
          sx={{
            color: "#e2e8f0",
            borderColor: "#334155",
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            py: 1,
            "&:hover": {
              borderColor: "#6366f1",
              backgroundColor: "#111c31",
            },
          }}
        >
          My Calendar
        </Button>
      </Box>

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
          value="3"
          subtitle="Interviews scheduled"
          iconBg="#2e1065"
          iconColor="#a78bfa"
          lineColor="#8b5cf6"
        />

        <StatCard
          icon={<AccessTimeRoundedIcon />}
          title="This Week"
          value="2"
          subtitle="Interviews remaining"
          iconBg="#082f49"
          iconColor="#38bdf8"
          lineColor="#3b82f6"
        />

        <StatCard
          icon={<CheckCircleRoundedIcon />}
          title="Completed"
          value="5"
          subtitle="Interviews completed"
          iconBg="#052e1b"
          iconColor="#4ade80"
          lineColor="#22c55e"
          green
        />

        <StatCard
          icon={<StarRoundedIcon />}
          title="Shortlisted"
          value="2"
          subtitle="Waiting for feedback"
          iconBg="#422006"
          iconColor="#fbbf24"
          lineColor="#f59e0b"
        />
      </Box>

      {/* =====================================================
          NEXT INTERVIEW
      ===================================================== */}

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
          border: "1px solid #293752",
          background:
            "radial-gradient(circle at 90% 10%, rgba(124,58,237,0.20), transparent 35%), linear-gradient(135deg,#111a30,#0c1728)",
        }}
      >
        {/* Glow */}
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.08)",
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
                  bgcolor: "#312e81",
                  color: "#c4b5fd",
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
                }}
              >
                Backend Developer
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 0.8,
                  color: "#94a3b8",
                }}
              >
                <BusinessRoundedIcon sx={{ fontSize: 18 }} />

                <Typography sx={{ fontSize: 14 }}>
                  TechNova Pvt. Ltd.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                width: 76,
                height: 76,
                borderRadius: 3,
                bgcolor: "#f8fafc",
                color: "#111827",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 22,
              }}
            >
              TN
            </Box>
          </Box>

          {/* Details */}
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
              borderTop: "1px solid #27344b",
            }}
          >
            <InterviewDetail
              icon={<CalendarMonthRoundedIcon />}
              label="Date"
              value="20 Aug 2026"
              sub="Tomorrow"
            />

            <InterviewDetail
              icon={<AccessTimeRoundedIcon />}
              label="Time"
              value="10:30 AM"
              sub="45 min"
            />

            <InterviewDetail
              icon={<VideoCameraFrontRoundedIcon />}
              label="Interview Type"
              value="Technical Interview"
              sub="Google Meet"
            />
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mt: 3,
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={() => openDialog("Join Interview")}
              startIcon={<VideoCameraFrontRoundedIcon />}
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 2.5,
                py: 1.1,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                boxShadow: "none",
                "&:hover": {
                  background: "linear-gradient(135deg,#5859e8,#7c3aed)",
                  boxShadow: "none",
                },
              }}
            >
              Join Interview
            </Button>

            <Button
              onClick={() =>
                navigate(`/applicant/interviews/details/${interview.id}`)
              }
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                color: "#c4b5fd",
                borderColor: "#6366f1",
                "&:hover": {
                  borderColor: "#8b5cf6",
                  backgroundColor: "#171b35",
                },
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </Box>

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
          border: "1px solid #2d285e",
          background: "linear-gradient(110deg,#171938,#11162d)",
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
              bgcolor: "#312e81",
              color: "#a78bfa",
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
              }}
            >
              AI Interview Coach
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              Practice before your real interview with an AI interviewer.
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={() => navigate("/applicant/interviews/coach")}
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            bgcolor: "#6366f1",
            color: "#fff",
            textTransform: "none",
            borderRadius: 2,
            px: 2.2,
            py: 1,
            fontWeight: 600,
            flexShrink: 0,
            "&:hover": {
              bgcolor: "#4f46e5",
            },
          }}
        >
          Start Practicing
        </Button>
      </Box>

      {/* =====================================================
          UPCOMING INTERVIEWS
      ===================================================== */}

      <InterviewList
        title="Upcoming Interviews"
        subtitle="Your scheduled interviews."
        interviews={upcomingInterviews}
        upcoming
        onView={(item) => openDialog(`${item.role} — Interview Details`)}
      />

      {/* =====================================================
          PAST INTERVIEWS
      ===================================================== */}

      <InterviewList
        title="Past Interviews"
        subtitle="Your completed interview history."
        interviews={pastInterviews}
        onView={(item) => openDialog(`${item.role} — Feedback`)}
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
          {/* Success Rate */}
          <InsightCard
            title="Success Rate"
            value="72%"
            subtitle="Great job! Keep it up"
            icon={<TrendingUpRoundedIcon />}
            color="#22c55e"
          />

          {/* Rating */}
          <InsightCard
            title="Average Rating"
            value="4.2/5"
            subtitle="Based on 5 interviews"
            icon={<StarRoundedIcon />}
            color="#f59e0b"
          />

          {/* Strong Areas */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "#0e1a2b",
              border: "1px solid #24334a",
            }}
          >
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 13,
                mb: 2,
              }}
            >
              Strong Areas
            </Typography>

            {["Data Structures", "Problem Solving", "Communication"].map(
              (item) => (
                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.2,
                  }}
                >
                  <CheckCircleRoundedIcon
                    sx={{
                      fontSize: 17,
                      color: "#22c55e",
                    }}
                  />

                  <Typography sx={{ fontSize: 13 }}>{item}</Typography>
                </Box>
              ),
            )}
          </Box>

          {/* Improve */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "#0e1a2b",
              border: "1px solid #24334a",
            }}
          >
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 13,
                mb: 2,
              }}
            >
              Areas to Improve
            </Typography>

            {["System Design", "Behavioral Answers", "Confidence"].map(
              (item) => (
                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.2,
                  }}
                >
                  <Box
                    sx={{
                      width: 17,
                      height: 17,
                      borderRadius: "50%",
                      bgcolor: "#422006",
                      color: "#f59e0b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    !
                  </Box>

                  <Typography sx={{ fontSize: 13 }}>{item}</Typography>
                </Box>
              ),
            )}
          </Box>
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
          border: "1px solid #30275c",
          background: "linear-gradient(100deg,#171936,#11162b)",
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
              bgcolor: "#422006",
              color: "#fbbf24",
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
              }}
            >
              Preparation Tip
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              Consistent practice is the key to success. Use AI Interview Coach
              to improve your skills.
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={() => navigate("/applicant/interviews/coach")}
          endIcon={<ArrowForwardRoundedIcon />}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            color: "#c4b5fd",
            borderColor: "#6366f1",
            px: 2,
            flexShrink: 0,
            "&:hover": {
              borderColor: "#8b5cf6",
              backgroundColor: "#171b35",
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
            bgcolor: "#111827",
            color: "#f8fafc",
            border: "1px solid #334155",
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
          }}
        >
          {dialogTitle}
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            This feature is ready for backend integration. For now, the frontend
            interaction is working correctly.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              color: "#a5b4fc",
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
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
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        p: 2.5,
        minHeight: 125,
        borderRadius: 3,
        bgcolor: "#0e1a2b",
        border: "1px solid #24334a",
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
            color: "#cbd5e1",
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
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          color: green ? "#4ade80" : "#94a3b8",
          fontSize: 12,
        }}
      >
        {subtitle}
      </Typography>

      {/* Decorative graph */}
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
        <svg width="70" height="28" viewBox="0 0 70 28">
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

const InterviewDetail = ({ icon, label, value, sub }) => {
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
          color: "#a5b4fc",
          display: "flex",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color: "#64748b",
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
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
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

const InterviewList = ({ title, subtitle, interviews, upcoming, onView }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        mb: 3,
        borderRadius: 3,
        bgcolor: "#0e1a2b",
        border: "1px solid #24334a",
        overflow: "hidden",
      }}
    >
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
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 13,
              mt: 0.4,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Button
          sx={{
            color: "#a78bfa",
            textTransform: "none",
            fontSize: 13,
          }}
        >
          View All
        </Button>
      </Box>

      {interviews.map((interview, index) => (
        <Box
          key={`${interview.company}-${interview.date}`}
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
            borderTop: "1px solid #1e2b40",

            "&:hover": {
              bgcolor: "#111f33",
            },
          }}
        >
          {/* Company */}
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
                    ? "#312e81"
                    : index % 3 === 1
                      ? "#172554"
                      : "#422006",
                color:
                  index % 3 === 0
                    ? "#c4b5fd"
                    : index % 3 === 1
                      ? "#60a5fa"
                      : "#fbbf24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {interview.initials}
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {interview.role}
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 12,
                  mt: 0.3,
                }}
              >
                {interview.company}
              </Typography>
            </Box>
          </Box>

          {/* Date */}
          <Box>
            <Typography
              sx={{
                fontSize: 13,
              }}
            >
              {interview.date}
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 12,
                mt: 0.3,
              }}
            >
              {interview.day}
            </Typography>
          </Box>

          {/* Time */}
          <Box>
            <Typography
              sx={{
                fontSize: 13,
              }}
            >
              {interview.time}
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 12,
                mt: 0.3,
              }}
            >
              ({interview.duration})
            </Typography>
          </Box>

          {/* Action */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: {
                xs: "flex-start",
                md: "flex-end",
              },
            }}
          >
            <Box
              sx={{
                px: 1.2,
                py: 0.55,
                borderRadius: 1.5,
                fontSize: 11,
                fontWeight: 600,
                ...getStatusStyleStatic(interview.status),
              }}
            >
              {interview.status}
            </Box>

            <Button
              onClick={() => {
                if (upcoming) {
                  navigate(`/applicant/interviews/details/${interview.id}`);
                } else {
                  navigate(`/applicant/interviews/feedback/${interview.id}`);
                }
              }}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                color: "#a78bfa",
                textTransform: "none",
                fontSize: 12,
                minWidth: "auto",
              }}
            >
              {upcoming ? "View" : "View Feedback"}
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const getStatusStyleStatic = (status) => {
  switch (status) {
    case "Confirmed":
      return {
        bgcolor: "#052e1b",
        color: "#4ade80",
      };

    case "Scheduled":
      return {
        bgcolor: "#172554",
        color: "#60a5fa",
      };

    case "Shortlisted":
      return {
        bgcolor: "#052e2b",
        color: "#34d399",
      };

    case "Under Review":
      return {
        bgcolor: "#422006",
        color: "#fbbf24",
      };

    case "Not Selected":
      return {
        bgcolor: "#3f1111",
        color: "#f87171",
      };

    default:
      return {
        bgcolor: "#1e293b",
        color: "#cbd5e1",
      };
  }
};

/* =========================================================
   INSIGHT CARD
========================================================= */

const InsightCard = ({ title, value, subtitle, icon, color }) => {
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
        }}
      >
        <Typography
          sx={{
            color: "#94a3b8",
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

export default Interviews;
