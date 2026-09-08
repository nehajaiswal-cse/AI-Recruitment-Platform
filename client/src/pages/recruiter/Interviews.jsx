import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useInterviewContext } from "../../context/InterviewContext";
import { updateInterviewStatus } from "../../api/interviewApi";

import { useCandidate } from "../../hooks/useCandidate";

import RNavbar from "../../components/layout/recruiter/Navbar";
import RSidebar from "../../components/layout/recruiter/Sidebar";

const Interviews = () => {
  const theme = useTheme();

  const {
    interviews = [],
    loading,
    error,
    fetchRecruiterInterviews,
    createInterview,
    recruiterRescheduleInterview,
    deleteInterview,
    clearError,
  } = useInterviewContext();

  const {
    candidates = [],
    loading: candidatesLoading,
    error: candidatesError,
    fetchCandidates,
  } = useCandidate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const [viewMode, setViewMode] = useState("list");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [openSchedule, setOpenSchedule] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);

  const [selectedInterview, setSelectedInterview] = useState(null);

  const emptyForm = {
    candidate: "",
    job: "",
    date: "",
    time: "",
    type: "Technical Interview",
    interviewer: "",
    meetingLink: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {
    fetchRecruiterInterviews();
    fetchCandidates();
  }, [fetchRecruiterInterviews, fetchCandidates]);

  /* =====================================================
     HELPERS
  ===================================================== */

  const getCandidateUser = (candidate) => {
    return candidate?.applicantId || {};
  };

  const getCandidateName = (candidate) => {
    const applicant = getCandidateUser(candidate);

    return (
      applicant.name ||
      applicant.fullName ||
      candidate?.name ||
      "Unknown Candidate"
    );
  };

  const getCandidateEmail = (candidate) => {
    const applicant = getCandidateUser(candidate);

    return applicant.email || candidate?.email || "";
  };

  const getCandidateId = (candidate) => {
    return candidate?._id || "";
  };

  const getJobId = (candidate) => {
    return candidate?.jobId?._id || candidate?.jobId || "";
  };

  const getJobTitle = (candidate) => {
    return (
      candidate?.jobId?.title || candidate?.jobId?.jobTitle || "Unknown Job"
    );
  };

  const getInterviewCandidateName = (interview) => {
    return (
      interview?.candidate?.name ||
      interview?.candidate?.fullName ||
      interview?.applicant?.name ||
      interview?.applicant?.fullName ||
      interview?.name ||
      "Unknown Candidate"
    );
  };

  const getInterviewCandidateEmail = (interview) => {
    return (
      interview?.candidate?.email ||
      interview?.applicant?.email ||
      interview?.email ||
      ""
    );
  };

  const getInterviewJobTitle = (interview) => {
    return (
      interview?.job?.title ||
      interview?.job?.jobTitle ||
      interview?.role ||
      "Unknown Job"
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* =====================================================
     FORM
  ===================================================== */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCandidateChange = (event) => {
    const candidateId = event.target.value;

    const selectedCandidate = candidates.find(
      (candidate) => String(getCandidateId(candidate)) === String(candidateId),
    );

    if (!selectedCandidate) {
      setFormData((prev) => ({
        ...prev,
        candidate: "",
        job: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      candidate: candidateId,
      job: getJobId(selectedCandidate),
    }));
  };

  /* =====================================================
     OPEN SCHEDULE
  ===================================================== */

  const handleOpenSchedule = () => {
    clearError();

    setFormData({
      ...emptyForm,
    });

    setOpenSchedule(true);
  };

  const handleCloseSchedule = () => {
    clearError();

    setFormData({
      ...emptyForm,
    });

    setOpenSchedule(false);
  };

  /* =====================================================
     SCHEDULE
  ===================================================== */

  const handleSchedule = async () => {
    if (
      !formData.candidate ||
      !formData.job ||
      !formData.date ||
      !formData.time ||
      !formData.type ||
      !formData.interviewer.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await createInterview({
        candidate: formData.candidate,
        job: formData.job,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        interviewer: formData.interviewer.trim(),
        meetingLink: formData.meetingLink.trim(),
      });

      alert("Interview scheduled successfully.");

      setFormData(emptyForm);
      setOpenSchedule(false);

      await fetchRecruiterInterviews();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to schedule interview",
      );
    }
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredInterviews = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return interviews.filter((interview) => {
      const candidateName = getInterviewCandidateName(interview).toLowerCase();

      const candidateEmail =
        getInterviewCandidateEmail(interview).toLowerCase();

      const jobTitle = getInterviewJobTitle(interview).toLowerCase();

      const interviewer = String(interview?.interviewer || "").toLowerCase();

      const type = String(interview?.type || "");

      const status = String(interview?.status || "");

      const matchesSearch =
        !searchValue ||
        candidateName.includes(searchValue) ||
        candidateEmail.includes(searchValue) ||
        jobTitle.includes(searchValue) ||
        interviewer.includes(searchValue);

      const matchesStatus = statusFilter === "All" || status === statusFilter;

      const matchesType = typeFilter === "All" || type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [interviews, search, statusFilter, typeFilter]);

  /* =====================================================
     STATS
  ===================================================== */

  const upcomingCount = interviews.filter(
    (item) => item.status === "Scheduled" || item.status === "Confirmed",
  ).length;

  const confirmedCount = interviews.filter(
    (item) => item.status === "Confirmed",
  ).length;

  const completedCount = interviews.filter(
    (item) => item.status === "Completed",
  ).length;

  const pendingCount = interviews.filter(
    (item) => item.status === "Pending",
  ).length;

  /* =====================================================
     NEXT INTERVIEW
  ===================================================== */

  const nextInterview = useMemo(() => {
    const upcoming = interviews.filter(
      (item) => item.status === "Scheduled" || item.status === "Confirmed",
    );

    return (
      [...upcoming].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )[0] || null
    );
  }, [interviews]);

  /* =====================================================
     CALENDAR
  ===================================================== */

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startingDay = firstDay === 0 ? 6 : firstDay - 1;

  const selectedInterviews = interviews.filter((interview) => {
    const date = new Date(interview.date);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === selectedDate
    );
  });

  const hasInterview = (date) => {
    return interviews.some((interview) => {
      const interviewDate = new Date(interview.date);

      return (
        interviewDate.getFullYear() === year &&
        interviewDate.getMonth() === month &&
        interviewDate.getDate() === date
      );
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(1);
  };

  /* =====================================================
     DETAILS
  ===================================================== */

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
    setOpenDetails(true);
  };

  /* =====================================================
     RESCHEDULE
  ===================================================== */

  const handleOpenReschedule = (interview) => {
    setSelectedInterview(interview);

    const date = new Date(interview.date);

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setFormData({
      candidate: interview?.candidate?._id || interview?.candidate || "",

      job: interview?.job?._id || interview?.job || "",

      date: formattedDate,

      time: interview?.time || "",

      type: interview?.type || "Technical Interview",

      interviewer: interview?.interviewer || "",

      meetingLink: interview?.meetingLink || "",
    });

    setOpenReschedule(true);
  };

  const handleReschedule = async () => {
    if (!selectedInterview) return;

    if (!formData.date || !formData.time) {
      alert("Please select date and time.");
      return;
    }

    try {
      await recruiterRescheduleInterview(
        selectedInterview._id || selectedInterview.id,
        {
          date: formData.date,
          time: formData.time,
          type: formData.type,
          interviewer: formData.interviewer,
          meetingLink: formData.meetingLink,
        },
      );

      alert("Interview rescheduled successfully.");

      setOpenReschedule(false);
      setSelectedInterview(null);
      setFormData(emptyForm);

      await fetchRecruiterInterviews();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reschedule interview",
      );
    }
  };

  const handleCancelInterview = async (interview) => {
    if (!interview) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this interview?",
    );

    if (!confirmed) return;

    try {
      await updateInterviewStatus(interview._id || interview.id, "Cancelled");

      alert("Interview cancelled successfully.");

      await fetchRecruiterInterviews();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to cancel interview",
      );
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (interviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?",
    );

    if (!confirmed) return;

    try {
      await deleteInterview(interviewId);

      alert("Interview deleted successfully.");

      setOpenDetails(false);
      setSelectedInterview(null);

      await fetchRecruiterInterviews();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete interview",
      );
    }
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "success";

      case "Scheduled":
        return "info";

      case "Pending":
        return "warning";

      case "Completed":
        return "success";

      case "Cancelled":
        return "error";

      default:
        return "default";
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading && interviews.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <RNavbar />
      </Box>

      <Box sx={{ display: "flex" }}>
        <RSidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >
          {/* HEADER */}

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
                }}
              >
                Interviews
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Schedule and manage candidate interviews.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleOpenSchedule}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 2.5,
                py: 1.2,
                background: `linear-gradient(
                  135deg,
                  ${theme.palette.primary.main},
                  ${theme.palette.secondary.main}
                )`,
              }}
            >
              Schedule Interview
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* STATS */}

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
            {[
              ["Upcoming", upcomingCount],
              ["Confirmed", confirmedCount],
              ["Completed", completedCount],
              ["Needs Action", pendingCount],
            ].map(([title, value]) => (
              <Box
                key={title}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography color="text.secondary" fontSize={14}>
                  {title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 30,
                    fontWeight: 700,
                    mt: 0.5,
                  }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* SEARCH */}

          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <TextField
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate, job or interviewer..."
              sx={{
                flex: 1,
                minWidth: 260,
              }}
              InputProps={{
                startAdornment: (
                  <SearchRoundedIcon
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                    }}
                  />
                ),
              }}
            />

            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Technical Interview">Technical</MenuItem>
              <MenuItem value="HR Interview">HR</MenuItem>
              <MenuItem value="Managerial Interview">Managerial</MenuItem>
            </TextField>

            <Box
              sx={{
                display: "flex",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Button
                startIcon={<ViewListRoundedIcon />}
                onClick={() => setViewMode("list")}
                sx={{
                  textTransform: "none",
                  bgcolor: viewMode === "list" ? "primary.main" : "transparent",
                  color: viewMode === "list" ? "white" : "text.secondary",
                }}
              >
                List
              </Button>

              <Button
                startIcon={<CalendarMonthRoundedIcon />}
                onClick={() => setViewMode("calendar")}
                sx={{
                  textTransform: "none",
                  bgcolor:
                    viewMode === "calendar" ? "primary.main" : "transparent",
                  color: viewMode === "calendar" ? "white" : "text.secondary",
                }}
              >
                Calendar
              </Button>
            </Box>
          </Box>

          {/* NEXT INTERVIEW */}

          {nextInterview && (
            <Box
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography fontSize={20} fontWeight={700} mb={2}>
                Next Interview
              </Typography>

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
                }}
              >
                <Box>
                  <Typography fontSize={18} fontWeight={600}>
                    {getInterviewCandidateName(nextInterview)}
                  </Typography>

                  <Typography color="primary.main">
                    {getInterviewJobTitle(nextInterview)}
                  </Typography>

                  <Typography color="text.secondary" mt={1}>
                    📅 {formatDate(nextInterview.date)}
                    {"  "}
                    🕐 {nextInterview.time}
                  </Typography>
                </Box>

                {nextInterview.meetingLink && (
                  <Button
                    variant="contained"
                    startIcon={<VideoCameraFrontRoundedIcon />}
                    onClick={() =>
                      window.open(
                        nextInterview.meetingLink,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    Join Interview
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {/* LIST */}

          {viewMode === "list" && (
            <Box
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography fontSize={20} fontWeight={700} mb={2}>
                Scheduled Interviews
              </Typography>

              {filteredInterviews.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                  }}
                >
                  <Typography color="text.secondary">
                    No interviews found.
                  </Typography>
                </Box>
              ) : (
                filteredInterviews.map((interview) => (
                  <Box
                    key={interview._id || interview.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "1.5fr 1fr 1fr auto",
                      },
                      gap: 2,
                      alignItems: "center",
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      bgcolor: "background.default",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box>
                      <Typography fontWeight={600}>
                        {getInterviewCandidateName(interview)}
                      </Typography>

                      <Typography fontSize={13} color="text.secondary">
                        {getInterviewCandidateEmail(interview)}
                      </Typography>

                      <Typography fontSize={13} color="primary.main">
                        {getInterviewJobTitle(interview)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography fontSize={14}>
                        📅 {formatDate(interview.date)}
                      </Typography>

                      <Typography fontSize={13} color="text.secondary">
                        🕐 {interview.time}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography fontSize={14}>{interview.type}</Typography>

                      <Typography fontSize={13} color="text.secondary">
                        👤 {interview.interviewer}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        label={interview.status}
                        size="small"
                        color={getStatusColor(interview.status)}
                      />

                      <Button
                        size="small"
                        onClick={() => handleViewDetails(interview)}
                        sx={{
                          textTransform: "none",
                        }}
                      >
                        View
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenReschedule(interview)}
                        sx={{
                          textTransform: "none",
                        }}
                      >
                        Reschedule
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleCancelInterview(interview)}
                        sx={{
                          textTransform: "none",
                          visibility:
                            interview.status === "Cancelled"
                              ? "hidden"
                              : "visible",
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          )}

          {/* CALENDAR */}

          {viewMode === "calendar" && (
            <Box
              sx={{
                mt: 3,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "1.3fr 1fr",
                },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography fontSize={20} fontWeight={700}>
                    {currentMonth.toLocaleString("default", {
                      month: "long",
                    })}{" "}
                    {year}
                  </Typography>

                  <Box>
                    <Button
                      onClick={handlePreviousMonth}
                      sx={{
                        minWidth: 40,
                      }}
                    >
                      <ChevronLeftRoundedIcon />
                    </Button>

                    <Button
                      onClick={handleNextMonth}
                      sx={{
                        minWidth: 40,
                      }}
                    >
                      <ChevronRightRoundedIcon />
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7,1fr)",
                    gap: 0.5,
                  }}
                >
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <Typography
                        key={day}
                        textAlign="center"
                        fontSize={12}
                        color="text.secondary"
                        py={1}
                      >
                        {day}
                      </Typography>
                    ),
                  )}

                  {Array.from(
                    {
                      length: startingDay + daysInMonth,
                    },
                    (_, index) => {
                      const date = index - startingDay + 1;

                      if (date < 1) {
                        return (
                          <Box
                            key={index}
                            sx={{
                              height: 42,
                            }}
                          />
                        );
                      }

                      const selected = selectedDate === date;

                      return (
                        <Box
                          key={index}
                          onClick={() => setSelectedDate(date)}
                          sx={{
                            height: 42,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              bgcolor: selected
                                ? "primary.main"
                                : "transparent",
                              color: selected ? "white" : "text.primary",
                            }}
                          >
                            {date}
                          </Box>

                          {hasInterview(date) && !selected && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 1,
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                              }}
                            />
                          )}
                        </Box>
                      );
                    },
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography fontSize={19} fontWeight={700} mb={2}>
                  Interviews on {selectedDate}{" "}
                  {currentMonth.toLocaleString("default", {
                    month: "short",
                  })}{" "}
                  {year}
                </Typography>

                {selectedInterviews.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" py={5}>
                    No interviews scheduled.
                  </Typography>
                ) : (
                  selectedInterviews.map((interview) => (
                    <Box
                      key={interview._id}
                      onClick={() => handleViewDetails(interview)}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 2,
                        bgcolor: "background.default",
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography color="primary.main" fontWeight={600}>
                        {interview.time}
                      </Typography>

                      <Typography fontWeight={600} mt={0.5}>
                        {getInterviewCandidateName(interview)}
                      </Typography>

                      <Typography fontSize={13} color="text.secondary">
                        {getInterviewJobTitle(interview)}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* =====================================================
          SCHEDULE DIALOG
      ===================================================== */}

      <Dialog
        open={openSchedule}
        onClose={handleCloseSchedule}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontWeight={700}>Schedule Interview</DialogTitle>

        <DialogContent>
          <Typography fontSize={13} color="text.secondary" mb={1}>
            Select a candidate. The candidate ID and job are automatically
            linked.
          </Typography>

          {/* CANDIDATE SELECT */}

          <TextField
            fullWidth
            required
            select
            label="Select Candidate"
            name="candidate"
            value={formData.candidate}
            onChange={handleCandidateChange}
            margin="normal"
          >
            {candidatesLoading ? (
              <MenuItem disabled>Loading candidates...</MenuItem>
            ) : candidates.length === 0 ? (
              <MenuItem disabled>No candidates available</MenuItem>
            ) : (
              candidates.map((candidate) => (
                <MenuItem key={candidate._id} value={getCandidateId(candidate)}>
                  <Box>
                    <Typography fontWeight={600}>
                      {getCandidateName(candidate)}
                    </Typography>

                    <Typography fontSize={12} color="text.secondary">
                      {getCandidateEmail(candidate)}
                      {" • "}
                      {getJobTitle(candidate)}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </TextField>

          {/* SELECTED JOB */}

          <TextField
            fullWidth
            label="Job"
            value={
              candidates.find(
                (candidate) =>
                  String(getCandidateId(candidate)) ===
                  String(formData.candidate),
              )
                ? getJobTitle(
                    candidates.find(
                      (candidate) =>
                        String(getCandidateId(candidate)) ===
                        String(formData.candidate),
                    ),
                  )
                : ""
            }
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            fullWidth
            required
            type="date"
            label="Interview Date"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
            margin="normal"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            fullWidth
            required
            type="time"
            label="Interview Time"
            name="time"
            value={formData.time}
            onChange={handleFormChange}
            margin="normal"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            fullWidth
            required
            select
            label="Interview Type"
            name="type"
            value={formData.type}
            onChange={handleFormChange}
            margin="normal"
          >
            <MenuItem value="Technical Interview">Technical Interview</MenuItem>

            <MenuItem value="HR Interview">HR Interview</MenuItem>

            <MenuItem value="Managerial Interview">
              Managerial Interview
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            required
            label="Interviewer"
            name="interviewer"
            value={formData.interviewer}
            onChange={handleFormChange}
            margin="normal"
            placeholder="John Doe"
          />

          <TextField
            fullWidth
            label="Meeting Link"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleFormChange}
            margin="normal"
            placeholder="https://meet.google.com/..."
          />

          {candidatesError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {candidatesError}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseSchedule}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={loading || !formData.candidate}
            onClick={handleSchedule}
            sx={{
              textTransform: "none",
              background: `linear-gradient(
                135deg,
                ${theme.palette.primary.main},
                ${theme.palette.secondary.main}
              )`,
            }}
          >
            {loading ? "Scheduling..." : "Schedule Interview"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          DETAILS
      ===================================================== */}

      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Interview Details
          <Button onClick={() => setOpenDetails(false)}>
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>

        {selectedInterview && (
          <DialogContent>
            <Typography fontSize={23} fontWeight={700}>
              {getInterviewCandidateName(selectedInterview)}
            </Typography>

            <Typography color="text.secondary" mb={3}>
              {getInterviewCandidateEmail(selectedInterview)}
            </Typography>

            <Typography mb={1}>
              💼 {getInterviewJobTitle(selectedInterview)}
            </Typography>

            <Typography mb={1}>
              📅 {formatDate(selectedInterview.date)}
            </Typography>

            <Typography mb={1}>🕐 {selectedInterview.time}</Typography>

            <Typography mb={1}>🎯 {selectedInterview.type}</Typography>

            <Typography mb={1}>👤 {selectedInterview.interviewer}</Typography>

            <Typography mb={1}>📌 {selectedInterview.status}</Typography>

            {selectedInterview.meetingLink && (
              <Typography
                sx={{
                  wordBreak: "break-all",
                }}
              >
                🔗 {selectedInterview.meetingLink}
              </Typography>
            )}
          </DialogContent>
        )}

        <DialogActions>
          {selectedInterview && (
            <>
              <Button
                color="error"
                onClick={() => handleDelete(selectedInterview._id)}
              >
                Delete
              </Button>

              <Button
                onClick={() => {
                  setOpenDetails(false);
                  handleOpenReschedule(selectedInterview);
                }}
              >
                Reschedule
              </Button>

              <Button onClick={() => setOpenDetails(false)}>Close</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* =====================================================
          RESCHEDULE
      ===================================================== */}

      <Dialog
        open={openReschedule}
        onClose={() => setOpenReschedule(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Reschedule Interview</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            type="date"
            label="New Date"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
            margin="normal"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            fullWidth
            type="time"
            label="New Time"
            name="time"
            value={formData.time}
            onChange={handleFormChange}
            margin="normal"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            fullWidth
            select
            label="Interview Type"
            name="type"
            value={formData.type}
            onChange={handleFormChange}
            margin="normal"
          >
            <MenuItem value="Technical Interview">Technical Interview</MenuItem>

            <MenuItem value="HR Interview">HR Interview</MenuItem>

            <MenuItem value="Managerial Interview">
              Managerial Interview
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Interviewer"
            name="interviewer"
            value={formData.interviewer}
            onChange={handleFormChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Meeting Link"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleFormChange}
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenReschedule(false)}>Cancel</Button>

          <Button
            variant="contained"
            disabled={loading}
            onClick={handleReschedule}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Interviews;
