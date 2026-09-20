import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Chip, CircularProgress, Snackbar, Alert, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";

import useInterview from "../../../hooks/useInterview";
import ANavbar from "../../../components/layout/applicant/Navbar";
import ASidebar from "../../../components/layout/applicant/Sidebar";

const pad = (n) => String(n).padStart(2, "0");

const getDateKey = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const formatDate = (value) => {
  if (!value) return "Not specified";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "Not specified" : d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const formatDay = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { weekday: "long" });
};

const formatTime = (interview) => {
  // Interview model has a separate time field. Prefer it over date parsing.
  if (interview?.time) return interview.time;
  if (!interview?.date) return "Not specified";
  const d = new Date(interview.date);
  return Number.isNaN(d.getTime()) ? "Not specified" : d.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });
};

const initials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "IN";
  return words.length > 1
    ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
    : words[0].slice(0, 2).toUpperCase();
};

const statusColor = (theme, status) => {
  if (status === "Cancelled") return theme.palette.error.main;
  if (status === "Pending") return theme.palette.warning.main;
  if (status === "Completed" || status === "Confirmed") return theme.palette.success.main;
  return theme.palette.primary.main;
};

const googleCalendarUrl = (interview) => {
  if (!interview?.date) return "#";
  const key = getDateKey(interview.date);
  if (!key) return "#";
  const [y, m, d] = key.split("-").map(Number);
  let h = 9;
  let min = 0;
  const match = String(interview.time || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    h = Number(match[1]); min = Number(match[2]);
    const ap = match[3]?.toUpperCase();
    if (ap === "PM" && h !== 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
  } else {
    const source = new Date(interview.date);
    if (!Number.isNaN(source.getTime())) { h = source.getHours(); min = source.getMinutes(); }
  }
  const start = new Date(y, m - 1, d, h, min, 0);
  const duration = Number(String(interview.duration || 30).match(/\d+/)?.[0] || 30);
  const end = new Date(start.getTime() + duration * 60000);
  const g = (x) => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: interview.job?.title || "Interview",
    dates: `${g(start)}/${g(end)}`,
    details: `${interview.type || "Interview"}\nRecruiter: ${interview.recruiter?.name || "Recruiter"}`,
    location: interview.meetingLink || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const InfoCard = ({ icon, title, value, subtitle }) => (
  <Box sx={{ p: 1.7, borderRadius: 2.5, bgcolor: "background.default", border: "1px solid", borderColor: "divider", minWidth: 0 }}>
    <Box sx={{ color: "primary.main", display: "flex", mb: 0.8 }}>{icon}</Box>
    <Typography sx={{ color: "text.secondary", fontSize: 11 }}>{title}</Typography>
    <Typography sx={{ fontSize: 14, fontWeight: 600, mt: 0.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</Typography>
    <Typography sx={{ color: "text.secondary", fontSize: 11, mt: 0.2 }}>{subtitle}</Typography>
  </Box>
);

const SectionCard = ({ title, subtitle, children }) => (
  <Box sx={{ p: { xs: 2, md: 2.5 }, mb: 2.5, borderRadius: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
    <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{title}</Typography>
    <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 0.4, mb: 2.2 }}>{subtitle}</Typography>
    {children}
  </Box>
);

const AgendaItem = ({ number, title, description }) => (
  <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
    <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "action.hover", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{number}</Box>
    <Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{title}</Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 12, lineHeight: 1.6, mt: 0.3 }}>{description}</Typography>
    </Box>
  </Box>
);

const PreparationItem = ({ title, description }) => (
  <Box sx={{ display: "flex", gap: 1.2, mb: 2 }}>
    <CheckCircleRoundedIcon sx={{ color: "success.main", fontSize: 19, mt: 0.2, flexShrink: 0 }} />
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{title}</Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 0.3, lineHeight: 1.6 }}>{description}</Typography>
    </Box>
  </Box>
);

const RequirementItem = ({ text }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}>
    <CheckCircleRoundedIcon sx={{ color: "info.main", fontSize: 17 }} />
    <Typography sx={{ color: "text.secondary", fontSize: 13 }}>{text}</Typography>
  </Box>
);

const QuickInfo = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1.6 }}>
    <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: "action.hover", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ color: "text.secondary", fontSize: 11 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mt: 0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</Typography>
    </Box>
  </Box>
);

const InterviewDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: interviewId } = useParams();
  const { interviews, fetchInterviewById } = useInterview();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [copied, setCopied] = useState(false);

  // First use the already-fetched applicant interview list.
  // This makes the Details page work even if the context action does not
  // return the axios response object. Direct refresh is also supported.
  useEffect(() => {
    if (!interviewId) {
      setError("Interview ID is missing.");
      setLoading(false);
      return;
    }

    const existing = (interviews || []).find(
      (item) => String(item?._id) === String(interviewId)
    );

    if (existing) {
      setInterview(existing);
      setLoading(false);
    }
  }, [interviewId, interviews]);

  // If the list does not contain the interview yet, fetch it directly.
  // The result can be either { interview } or the interview object itself.
  useEffect(() => {
    let active = true;

    const loadInterview = async () => {
      if (!interviewId || (interviews || []).some(
        (item) => String(item?._id) === String(interviewId)
      )) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await fetchInterviewById(interviewId);
        if (!active) return;

        const item = data?.interview || data;

        if (item && item._id) {
          setInterview(item);
        } else {
          // Do not immediately show "not found" here. The context may have
          // updated its interview list asynchronously.
          setError("Interview details could not be loaded.");
        }
      } catch (err) {
        if (!active) return;

        console.error("Failed to fetch interview details:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load interview details."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInterview();

    return () => {
      active = false;
    };
  }, [interviewId, interviews, fetchInterviewById]);

  const company = useMemo(() => interview?.job?.company || interview?.job?.companyName || interview?.company || "Company", [interview]);
  const role = useMemo(() => interview?.job?.title || interview?.job?.jobTitle || interview?.role || "Job Position", [interview]);
  const interviewer = interview?.recruiter?.name || interview?.recruiter?.fullName || "Recruiter";
  const interviewerEmail = interview?.recruiter?.email || "";
  const interviewerRole = interview?.recruiter?.role || "Recruiter";
  const meetingLink = interview?.meetingLink || "";
  const interviewType = interview?.type || interview?.mode || "Interview";
  const location = interview?.location || interview?.job?.location || "Online";
  const status = interview?.status || "Scheduled";
  const statusMain = statusColor(theme, status);
  const time = formatTime(interview);

  const copyLink = async () => {
    if (!meetingLink) { setError("Meeting link is not available."); return; }
    try { await navigator.clipboard.writeText(meetingLink); setCopied(true); }
    catch { setError("Could not copy the meeting link."); }
  };

  const joinMeeting = () => {
    if (!meetingLink) { setError("Meeting link is not available."); return; }
    setJoined(true);
    window.open(meetingLink, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <ANavbar />
        <Box sx={{ display: "flex" }}>
          <ASidebar />
          <Box component="main" sx={{ flex: 1, minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress />
              <Typography sx={{ mt: 2, color: "text.secondary", fontSize: 14 }}>Loading interview details...</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (!interview) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <ANavbar />
        <Box sx={{ display: "flex" }}>
          <ASidebar />
          <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ maxWidth: 650, mx: "auto", mt: 5, p: 4, textAlign: "center", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
              <CalendarMonthRoundedIcon sx={{ fontSize: 48, color: "text.secondary" }} />
              <Typography sx={{ mt: 1.5, fontSize: 22, fontWeight: 700 }}>Interview not found</Typography>
              <Typography sx={{ mt: 0.8, color: "text.secondary", fontSize: 14 }}>{error || "The interview details are no longer available."}</Typography>
              <Button onClick={() => navigate("/applicant/interviews")} startIcon={<ArrowBackRoundedIcon />} variant="contained" sx={{ mt: 2.5, textTransform: "none", borderRadius: 2 }}>Back to Interviews</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const googleUrl = googleCalendarUrl(interview);
  const subtlePrimary = alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.14 : 0.07);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 50 }}><ANavbar /></Box>
      <Box sx={{ display: "flex", minWidth: 0 }}>
        <ASidebar />
        <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ maxWidth: 1450, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 2.5, flexWrap: "wrap" }}>
              <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate("/applicant/interviews")} sx={{ color: "primary.main", textTransform: "none", fontWeight: 600, px: 0, "&:hover": { bgcolor: "transparent" } }}>Back to Interviews</Button>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button onClick={() => navigate("/applicant/interviews/calendar")} startIcon={<CalendarMonthRoundedIcon />} variant="outlined" sx={{ textTransform: "none", borderRadius: 2, color: "text.primary", borderColor: "divider" }}>Calendar</Button>
                <Chip icon={<CheckCircleRoundedIcon sx={{ color: `${statusMain} !important` }} />} label={status} sx={{ bgcolor: alpha(statusMain, 0.12), color: statusMain, border: "1px solid", borderColor: alpha(statusMain, 0.3), fontWeight: 600, borderRadius: 2 }} />
              </Box>
            </Box>

            <Box sx={{ p: { xs: 2.2, sm: 3, md: 4 }, borderRadius: 3, border: "1px solid", borderColor: "divider", position: "relative", overflow: "hidden", background: `radial-gradient(circle at 92% 0%, ${alpha(theme.palette.primary.main, 0.16)}, transparent 35%), ${theme.palette.background.paper}` }}>
              <Box sx={{ position: "relative", display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: 68, height: 68, borderRadius: 3, bgcolor: theme.palette.mode === "dark" ? "#f8fafc" : subtlePrimary, color: theme.palette.mode === "dark" ? "#111827" : "primary.main", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, fontWeight: 800, flexShrink: 0 }}>{initials(company)}</Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: "text.secondary", fontSize: 13 }}>{company}</Typography>
                  <Typography sx={{ fontSize: { xs: 25, md: 31 }, fontWeight: 700, lineHeight: 1.15, mt: 0.3 }}>{role}</Typography>
                  <Typography sx={{ color: "primary.main", fontSize: 13, mt: 0.6 }}>{interviewType}</Typography>
                </Box>
              </Box>

              <Box sx={{ position: "relative", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" }, gap: 1.5, mt: 3 }}>
                <InfoCard icon={<CalendarMonthRoundedIcon />} title="Interview Date" value={formatDate(interview.date)} subtitle={formatDay(interview.date)} />
                <InfoCard icon={<AccessTimeRoundedIcon />} title="Interview Time" value={time} subtitle={interview.duration ? `${interview.duration} min` : "Duration not specified"} />
                <InfoCard icon={<VideoCameraFrontRoundedIcon />} title="Interview Type" value={interviewType} subtitle={meetingLink ? "Online Interview" : "Details available"} />
                <InfoCard icon={<LocationOnRoundedIcon />} title="Location" value={location} subtitle={meetingLink ? "Join remotely" : "Location information"} />
              </Box>

              <Box sx={{ display: "flex", gap: 1.2, mt: 2.2, flexWrap: "wrap" }}>
                <Button onClick={joinMeeting} disabled={!meetingLink} startIcon={<VideoCameraFrontRoundedIcon />} variant="contained" sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.3, py: 1 }}>{joined ? "Meeting Opened" : "Join Interview"}</Button>
                <Button onClick={copyLink} disabled={!meetingLink} startIcon={<LinkRoundedIcon />} variant="outlined" sx={{ textTransform: "none", borderRadius: 2, color: "text.primary", borderColor: "divider" }}>{copied ? "Link Copied" : "Copy Meeting Link"}</Button>
                <Button component="a" href={googleUrl} target="_blank" rel="noopener noreferrer" startIcon={<EventAvailableRoundedIcon />} variant="outlined" sx={{ textTransform: "none", borderRadius: 2, color: "primary.main", borderColor: "divider" }}>Add to Calendar</Button>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.55fr 1fr" }, gap: 2.5, mt: 2.5, alignItems: "start" }}>
              <Box>
                <SectionCard title="Interview Agenda" subtitle="What to expect during your interview.">
                  <AgendaItem number="01" title="Introduction" description="Brief introduction and discussion about your background." />
                  <AgendaItem number="02" title="Technical Discussion" description={`Questions related to ${role}, APIs and databases.`} />
                  <AgendaItem number="03" title="Problem Solving" description="You may be asked to solve a coding or logical problem." />
                  <AgendaItem number="04" title="Candidate Questions" description="Time for you to ask questions about the role and company." />
                </SectionCard>
                <SectionCard title="How to Prepare" subtitle="A few things you should do before joining.">
                  <PreparationItem title="Review the Job Description" description="Understand the responsibilities and requirements of the role." />
                  <PreparationItem title="Revise Technical Concepts" description="Focus on APIs, databases, Node.js, Express and system fundamentals." />
                  <PreparationItem title="Prepare Your Projects" description="Be ready to explain your projects, decisions and challenges." />
                  <PreparationItem title="Test Your Setup" description="Check your internet, microphone, camera and meeting link." />
                </SectionCard>
                <SectionCard title="Interview Requirements" subtitle="Keep these things ready before the interview.">
                  <RequirementItem text="Stable internet connection" />
                  <RequirementItem text="Working microphone and camera" />
                  <RequirementItem text="Updated resume" />
                  <RequirementItem text="Laptop or desktop recommended" />
                </SectionCard>
              </Box>

              <Box>
                <SectionCard title="Your Interviewer" subtitle="Person conducting your interview.">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 54, height: 54, borderRadius: "50%", bgcolor: subtlePrimary, color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 17, flexShrink: 0 }}>{initials(interviewer)}</Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{interviewer}</Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 0.3 }}>{interviewerRole}</Typography>
                      {interviewerEmail && <Typography sx={{ color: "text.secondary", fontSize: 11, mt: 0.3, wordBreak: "break-word" }}>{interviewerEmail}</Typography>}
                    </Box>
                  </Box>
                </SectionCard>

                <SectionCard title="Quick Information" subtitle="Important interview details.">
                  <QuickInfo icon={<CalendarMonthRoundedIcon />} label="Date" value={formatDate(interview.date)} />
                  <QuickInfo icon={<AccessTimeRoundedIcon />} label="Time" value={time} />
                  <QuickInfo icon={<VideoCameraFrontRoundedIcon />} label="Type" value={interviewType} />
                  <QuickInfo icon={<BusinessRoundedIcon />} label="Company" value={company} />
                  <QuickInfo icon={<PersonRoundedIcon />} label="Interviewer" value={interviewer} />
                </SectionCard>

                <Box sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "divider", background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.13)}, ${theme.palette.background.paper})` }}>
                  <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Ready for your interview?</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 13, mt: 0.7, lineHeight: 1.6 }}>Join a few minutes early and make sure everything is ready before the interviewer joins.</Typography>
                  <Button onClick={joinMeeting} fullWidth disabled={!meetingLink} startIcon={<VideoCameraFrontRoundedIcon />} variant="contained" sx={{ mt: 2, textTransform: "none", fontWeight: 600, borderRadius: 2, py: 1.1 }}>{joined ? "Meeting Opened" : "Join Meeting"}</Button>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 2.5, p: 2, borderRadius: 3, bgcolor: subtlePrimary, border: "1px solid", borderColor: alpha(theme.palette.primary.main, 0.2), display: "flex", gap: 1.3, alignItems: "flex-start" }}>
              <DescriptionRoundedIcon sx={{ color: "primary.main", mt: 0.2 }} />
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Interview Reminder</Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 0.4, lineHeight: 1.6 }}>Please join the interview 5–10 minutes before the scheduled time. Keep your resume and portfolio ready.</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)}>
        <Alert severity="success" onClose={() => setCopied(false)}>Meeting link copied!</Alert>
      </Snackbar>
      <Snackbar open={Boolean(error)} autoHideDuration={3500} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default InterviewDetails;
