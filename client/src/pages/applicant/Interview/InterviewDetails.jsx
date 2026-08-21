import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import useInterview from "../../../hooks/useInterview";


const InterviewDetails = () => {
  console.log("🔥🔥 INTERVIEW DETAILS MOUNTED 🔥🔥");

  const { id:interviewId } = useParams();

  console.log("🔥 interviewId:", interviewId);
  const{fetchInterviewById} = useInterview();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [copied, setCopied] = useState(false);

  // =====================================================
  // FETCH INTERVIEW
  // =====================================================

  useEffect(() => {
  console.log("🔥 EFFECT RUNNING");
  console.log("🔥 interviewId:", interviewId);
  console.log("🔥 fetchInterviewById:", fetchInterviewById);

  const fetchInterview = async () => {
    try {
      console.log("🔥 FETCH START");

      setLoading(true);
      setError("");

      const data = await fetchInterviewById(interviewId);

      console.log("🔥 API DATA:", data);
      console.log("🔥 INTERVIEW:", data?.interview);

      setInterview(data?.interview);

    } catch (err) {
      console.error("🔥 FETCH ERROR:", err);

      setError(
        err?.response?.data?.message ||
        "Failed to load interview details."
      );
    } finally {
      console.log("🔥 FINALLY - LOADING FALSE");
      setLoading(false);
    }
  };

  if (interviewId) {
    fetchInterview();
  } else {
    console.log("❌ interviewId is undefined");
    setLoading(false);
    setError("Interview ID is missing.");
  }
}, [interviewId]);

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const formatDay = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
    });
  };


  const formatTime = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  // =====================================================
  // COPY MEETING LINK
  // =====================================================

  const handleCopyLink = async () => {
    if (!interview?.meetingLink) return;

    try {
      await navigator.clipboard.writeText(
        interview.meetingLink
      );

      setCopied(true);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };


  // =====================================================
  // JOIN MEETING
  // =====================================================

  const handleJoinMeeting = () => {
    if (!interview?.meetingLink) {
      setError("Meeting link is not available.");
      return;
    }

    setJoined(true);

    window.open(
      interview.meetingLink,
      "_blank",
      "noopener,noreferrer"
    );
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#07111f",
          color: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <CircularProgress
            sx={{
              color: "#8b5cf6",
            }}
          />

          <Typography
            sx={{
              mt: 2,
              color: "#94a3b8",
            }}
          >
            Loading interview details...
          </Typography>
        </Box>
      </Box>
    );
  }


  // =====================================================
  // INTERVIEW NOT FOUND
  // =====================================================

   if (!interviewId) {
    console.log("❌ interviewId is undefined");

    setError("Interview ID is missing.");
    setInterview(null);
    setLoading(false);

    return;
  }
  // =====================================================
  // DATA FROM BACKEND
  // =====================================================

  const company =
  interview?.job?.company ||
  interview?.job?.companyName ||
  interview?.company ||
  "Company";

const role =
  interview?.job?.title ||
  interview?.job?.jobTitle ||
  interview?.role ||
  "Job Position";

  const interviewer =
    interview?.recruiter?.name ||
    interview?.recruiter?.fullName ||
    "Recruiter";

  const interviewerEmail =
    interview?.recruiter?.email ||
    "";

  const interviewerRole =
    interview?.recruiter?.role ||
    "Recruiter";

  const interviewDate = interview?.date;

  const meetingLink =
    interview?.meetingLink || "";


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
          TOP HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          justifyContent: "space-between",
          gap: 2,
          flexDirection: {
            xs: "column",
            md: "row",
          },
          mb: 3,
        }}
      >
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            color: "#a5b4fc",
            textTransform: "none",
            fontSize: 14,
            px: 0,
            "&:hover": {
              backgroundColor: "transparent",
              color: "#c4b5fd",
            },
          }}
          onClick={() => window.history.back()}
        >
          Back to Interviews
        </Button>

        <Chip
          label={
            interview?.status
              ? interview.status.charAt(0).toUpperCase() +
                interview.status.slice(1)
              : "Scheduled"
          }
          icon={
            <CheckCircleRoundedIcon
              sx={{
                color: "#4ade80 !important",
              }}
            />
          }
          sx={{
            bgcolor: "#052e1b",
            color: "#4ade80",
            borderRadius: 2,
            fontWeight: 600,
            border: "1px solid #14532d",
          }}
        />
      </Box>


      {/* =====================================================
          MAIN INTERVIEW CARD
      ===================================================== */}

      <Box
        sx={{
          p: {
            xs: 2.5,
            md: 4,
          },
          borderRadius: 3,
          border: "1px solid #293752",
          background:
            "radial-gradient(circle at 90% 0%, rgba(99,102,241,0.16), transparent 35%), linear-gradient(135deg,#111a30,#0c1728)",
        }}
      >

        {/* Company Header */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: "#f8fafc",
              color: "#111827",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {company
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              {company}
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: 24,
                  md: 30,
                },
                fontWeight: 700,
                mt: 0.3,
              }}
            >
              {role}
            </Typography>

            <Typography
              sx={{
                color: "#a5b4fc",
                fontSize: 14,
                mt: 0.4,
              }}
            >
              {interview?.type || "Interview"}
            </Typography>
          </Box>
        </Box>


        {/* Interview Information */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
            mt: 4,
          }}
        >
          <InfoCard
            icon={<CalendarMonthRoundedIcon />}
            title="Interview Date"
            value={formatDate(interviewDate)}
            subtitle={formatDay(interviewDate)}
          />

          <InfoCard
            icon={<AccessTimeRoundedIcon />}
            title="Interview Time"
            value={formatTime(interviewDate)}
            subtitle={
              interview?.duration
                ? `${interview.duration} min`
                : "Duration not specified"
            }
          />

          <InfoCard
            icon={<VideoCameraFrontRoundedIcon />}
            title="Interview Mode"
            value={interview?.mode || "Online"}
            subtitle="Online Interview"
          />

          <InfoCard
            icon={<LocationOnRoundedIcon />}
            title="Location"
            value={
              interview?.location ||
              "Online"
            }
            subtitle="Join remotely"
          />
        </Box>


        {/* Main Action */}

        <Box
          sx={{
            mt: 3,
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Button
            onClick={handleJoinMeeting}
            startIcon={
              <VideoCameraFrontRoundedIcon />
            }
            variant="contained"
            sx={{
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 2.5,
              py: 1.1,
              boxShadow: "none",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#5859e8,#7c3aed)",
                boxShadow: "none",
              },
            }}
          >
            {joined
              ? "Meeting Opened"
              : "Join Interview"}
          </Button>

          <Button
            onClick={handleCopyLink}
            startIcon={<LinkRoundedIcon />}
            variant="outlined"
            disabled={!meetingLink}
            sx={{
              color: "#c4b5fd",
              borderColor: "#6366f1",
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              "&:hover": {
                borderColor: "#8b5cf6",
                backgroundColor: "#171b35",
              },
            }}
          >
            {copied
              ? "Link Copied"
              : "Copy Meeting Link"}
          </Button>
        </Box>
      </Box>


      {/* =====================================================
          CONTENT GRID
      ===================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.6fr 1fr",
          },
          gap: 3,
          mt: 3,
          alignItems: "start",
        }}
      >

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <Box>

          {/* Interview Agenda */}

          <SectionCard
            title="Interview Agenda"
            subtitle="What to expect during your interview."
          >
            <AgendaItem
              number="01"
              title="Introduction"
              description="Brief introduction and discussion about your background."
            />

            <AgendaItem
              number="02"
              title="Technical Discussion"
              description={`Questions related to ${role}, APIs and databases.`}
            />

            <AgendaItem
              number="03"
              title="Problem Solving"
              description="You may be asked to solve a coding or logical problem."
            />

            <AgendaItem
              number="04"
              title="Candidate Questions"
              description="Time for you to ask questions about the role and company."
            />
          </SectionCard>


          {/* Preparation */}

          <SectionCard
            title="How to Prepare"
            subtitle="A few things you should do before joining."
          >
            <PreparationItem
              title="Review the Job Description"
              description="Understand the responsibilities and requirements of the role."
            />

            <PreparationItem
              title="Revise Technical Concepts"
              description="Focus on APIs, databases, Node.js, Express and system fundamentals."
            />

            <PreparationItem
              title="Prepare Your Projects"
              description="Be ready to explain your projects, decisions and challenges."
            />

            <PreparationItem
              title="Test Your Setup"
              description="Check your internet, microphone, camera and meeting link."
            />
          </SectionCard>


          {/* Requirements */}

          <SectionCard
            title="Interview Requirements"
            subtitle="Keep these things ready before the interview."
          >
            <RequirementItem text="Stable internet connection" />
            <RequirementItem text="Working microphone and camera" />
            <RequirementItem text="Updated resume" />
            <RequirementItem text="Laptop or desktop recommended" />
          </SectionCard>

        </Box>


        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <Box>

          {/* Interviewer */}

          <SectionCard
            title="Your Interviewer"
            subtitle="Person conducting your interview."
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
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 17,
                }}
              >
                {interviewer
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  {interviewer}
                </Typography>

                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: 12,
                    mt: 0.3,
                  }}
                >
                  {interviewerRole}
                </Typography>

                {interviewerEmail && (
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 12,
                      mt: 0.3,
                    }}
                  >
                    {interviewerEmail}
                  </Typography>
                )}
              </Box>
            </Box>
          </SectionCard>


          {/* Quick Info */}

          <SectionCard
            title="Quick Information"
            subtitle="Important details."
          >
            <QuickInfo
              icon={<CalendarMonthRoundedIcon />}
              label="Date"
              value={formatDate(interviewDate)}
            />

            <QuickInfo
              icon={<AccessTimeRoundedIcon />}
              label="Time"
              value={formatTime(interviewDate)}
            />

            <QuickInfo
              icon={<VideoCameraFrontRoundedIcon />}
              label="Platform"
              value={interview?.mode || "Online"}
            />

            <QuickInfo
              icon={<BusinessRoundedIcon />}
              label="Company"
              value={interview?.company || company}
            />
          </SectionCard>


          {/* Meeting Link */}

          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid #30275c",
              background:
                "linear-gradient(135deg,#171936,#11162b)",
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Ready for your interview?
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 13,
                mt: 0.7,
                lineHeight: 1.6,
              }}
            >
              Join a few minutes early and make sure
              everything is ready before the interviewer joins.
            </Typography>

            <Button
              onClick={handleJoinMeeting}
              fullWidth
              disabled={!meetingLink}
              startIcon={
                <VideoCameraFrontRoundedIcon />
              }
              sx={{
                mt: 2,
                background:
                  "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                py: 1.1,
                "&:hover": {
                  background:
                    "linear-gradient(135deg,#5859e8,#7c3aed)",
                },
              }}
            >
              {joined
                ? "Meeting Opened"
                : "Join Meeting"}
            </Button>
          </Box>

        </Box>
      </Box>


      {/* =====================================================
          BOTTOM NOTE
      ===================================================== */}

      <Box
        sx={{
          mt: 3,
          p: 2.5,
          borderRadius: 3,
          bgcolor: "#0e1a2b",
          border: "1px solid #24334a",
          display: "flex",
          gap: 1.5,
          alignItems: "flex-start",
        }}
      >
        <DescriptionRoundedIcon
          sx={{
            color: "#a78bfa",
            mt: 0.2,
          }}
        />

        <Box>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Interview Reminder
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 12,
              mt: 0.5,
              lineHeight: 1.6,
            }}
          >
            Please join the interview 5–10 minutes before the
            scheduled time. Keep your resume and portfolio ready.
          </Typography>
        </Box>
      </Box>


      {/* =====================================================
          SNACKBAR
      ===================================================== */}

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
      >
        <Alert
          severity="success"
          onClose={() => setCopied(false)}
        >
          Meeting link copied!
        </Alert>
      </Snackbar>

    </Box>
  );
};


/* =========================================================
   INFO CARD
========================================================= */

const InfoCard = ({
  icon,
  title,
  value,
  subtitle,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2.5,
        bgcolor: "rgba(15,23,42,0.65)",
        border: "1px solid #293752",
      }}
    >
      <Box
        sx={{
          color: "#a5b4fc",
          display: "flex",
          mb: 1,
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          color: "#64748b",
          fontSize: 11,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          mt: 0.3,
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          color: "#94a3b8",
          fontSize: 11,
          mt: 0.2,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};


/* =========================================================
   SECTION CARD
========================================================= */

const SectionCard = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 2.5,
        },
        mb: 3,
        borderRadius: 3,
        bgcolor: "#0e1a2b",
        border: "1px solid #24334a",
      }}
    >
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "#64748b",
          fontSize: 12,
          mt: 0.4,
          mb: 2.5,
        }}
      >
        {subtitle}
      </Typography>

      {children}
    </Box>
  );
};


/* =========================================================
   AGENDA ITEM
========================================================= */

const AgendaItem = ({
  number,
  title,
  description,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        mb: 2,
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          bgcolor: "#312e81",
          color: "#a5b4fc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {number}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontSize: 12,
            lineHeight: 1.6,
            mt: 0.3,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};


/* =========================================================
   PREPARATION ITEM
========================================================= */

const PreparationItem = ({
  title,
  description,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.2,
        mb: 2,
      }}
    >
      <CheckCircleRoundedIcon
        sx={{
          color: "#4ade80",
          fontSize: 19,
          mt: 0.2,
        }}
      />

      <Box>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontSize: 12,
            mt: 0.3,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};


/* =========================================================
   REQUIREMENT
========================================================= */

const RequirementItem = ({ text }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 1.3,
      }}
    >
      <CheckCircleRoundedIcon
        sx={{
          color: "#60a5fa",
          fontSize: 17,
        }}
      />

      <Typography
        sx={{
          color: "#cbd5e1",
          fontSize: 13,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};


/* =========================================================
   QUICK INFO
========================================================= */

const QuickInfo = ({
  icon,
  label,
  value,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        mb: 1.8,
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 1.5,
          bgcolor: "#172554",
          color: "#60a5fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color: "#64748b",
            fontSize: 11,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            mt: 0.2,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};


export default InterviewDetails;