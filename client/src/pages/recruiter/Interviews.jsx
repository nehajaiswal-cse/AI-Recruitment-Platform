import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
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
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded";

const API_URL = "http://localhost:5000";

const Interviews = () => {
  /* =====================================================
     CALENDAR
  ===================================================== */

  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1));
  const [selectedDate, setSelectedDate] = useState(20);

  /* =====================================================
     VIEW / FILTER
  ===================================================== */

  const [viewMode, setViewMode] = useState("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  /* =====================================================
     DATA
  ===================================================== */

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     DIALOG
  ===================================================== */

  const [openSchedule, setOpenSchedule] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);

  const [selectedInterview, setSelectedInterview] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  /* =====================================================
     FORM
  ===================================================== */

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
     TOKEN
  ===================================================== */

  const getToken = () => {
    return localStorage.getItem("token");
  };

  /* =====================================================
     FETCH INTERVIEWS
  ===================================================== */

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Recruiter token not found. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/api/interviews/recruiter`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Recruiter interviews:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recruiter interviews");
      }

      const formattedInterviews = (data.interviews || []).map((item) => {
        const interviewDate = new Date(item.date);

        return {
          id: item._id,

          fullDate: interviewDate,

          date: interviewDate.getDate(),

          name: item.candidate?.name || "Unknown Candidate",

          email: item.candidate?.email || "",

          candidateId: item.candidate?._id || item.candidate || "",

          role: item.job?.title || "Unknown Job",

          location: item.job?.location || "",

          jobId: item.job?._id || item.job || "",

          time: item.time || "",

          type: item.type || "",

          status: item.status || "Scheduled",

          interviewer: item.interviewer || "",

          meetingLink: item.meetingLink || "",
        };
      });

      setInterviews(formattedInterviews);

      /* Set calendar according to first interview */

      if (formattedInterviews.length > 0) {
        const firstInterview = formattedInterviews[0].fullDate;

        setCurrentMonth(
          new Date(firstInterview.getFullYear(), firstInterview.getMonth(), 1),
        );

        setSelectedDate(firstInterview.getDate());
      }
    } catch (err) {
      console.error("Fetch interviews error:", err);

      setError(err.message || "Failed to load recruiter interviews");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchInterviews();
  }, []);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     OPEN SCHEDULE DIALOG
  ===================================================== */

  const handleOpenSchedule = () => {
    setFormData(emptyForm);
    setError("");
    setOpenSchedule(true);
  };

  /* =====================================================
     CLOSE SCHEDULE DIALOG
  ===================================================== */

  const handleCloseSchedule = () => {
    if (submitting) return;

    setFormData(emptyForm);
    setOpenSchedule(false);
  };

  /* =====================================================
     SCHEDULE INTERVIEW
  ===================================================== */

  const handleSchedule = async () => {
    if (
      !formData.candidate.trim() ||
      !formData.job.trim() ||
      !formData.date ||
      !formData.time ||
      !formData.type ||
      !formData.interviewer.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const token = getToken();

      if (!token) {
        alert("Recruiter token not found. Please login again.");
        return;
      }

      const requestBody = {
        candidate: formData.candidate.trim(),

        job: formData.job.trim(),

        date: formData.date,

        time: formData.time,

        type: formData.type,

        interviewer: formData.interviewer.trim(),

        meetingLink:
          formData.meetingLink.trim() || "https://meet.google.com/example",
      };

      console.log("Scheduling interview:", requestBody);

      const response = await fetch(`${API_URL}/api/interviews`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      console.log("Schedule response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to schedule interview");
      }

      alert("Interview scheduled successfully!");

      setFormData(emptyForm);

      setOpenSchedule(false);

      await fetchInterviews();
    } catch (err) {
      console.error("Schedule interview error:", err);

      alert(err.message || "Failed to schedule interview");
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     FILTERED INTERVIEWS
  ===================================================== */

  const filteredInterviews = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return interviews.filter((interview) => {
      const matchesSearch =
        interview.name.toLowerCase().includes(searchValue) ||
        interview.email.toLowerCase().includes(searchValue) ||
        interview.role.toLowerCase().includes(searchValue) ||
        interview.interviewer.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || interview.status === statusFilter;

      const matchesType = typeFilter === "All" || interview.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [interviews, search, statusFilter, typeFilter]);

  /* =====================================================
     STATS
  ===================================================== */

  const upcomingCount = interviews.filter(
    (interview) =>
      interview.status === "Scheduled" || interview.status === "Confirmed",
  ).length;

  const confirmedCount = interviews.filter(
    (interview) => interview.status === "Confirmed",
  ).length;

  const completedCount = interviews.filter(
    (interview) => interview.status === "Completed",
  ).length;

  const pendingCount = interviews.filter(
    (interview) => interview.status === "Pending",
  ).length;

  /* =====================================================
     NEXT INTERVIEW
  ===================================================== */

  const nextInterview = useMemo(() => {
    const upcoming = interviews.filter(
      (interview) =>
        interview.status === "Scheduled" || interview.status === "Confirmed",
    );

    upcoming.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

    return upcoming[0] || null;
  }, [interviews]);

  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* =====================================================
     CALENDAR VALUES
  ===================================================== */

  const year = currentMonth.getFullYear();

  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startingDay = firstDay === 0 ? 6 : firstDay - 1;

  /* =====================================================
     SELECTED DATE INTERVIEWS
  ===================================================== */

  const selectedInterviews = interviews.filter((interview) => {
    const date = interview.fullDate;

    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === selectedDate
    );
  });

  /* =====================================================
     HAS INTERVIEW
  ===================================================== */

  const hasInterview = (date) => {
    return interviews.some((interview) => {
      const interviewDate = interview.fullDate;

      return (
        interviewDate.getFullYear() === year &&
        interviewDate.getMonth() === month &&
        interviewDate.getDate() === date
      );
    });
  };

  /* =====================================================
     CALENDAR NAVIGATION
  ===================================================== */

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));

    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));

    setSelectedDate(1);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  /* =====================================================
     VIEW DETAILS
  ===================================================== */

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);

    setOpenDetails(true);
  };

  /* =====================================================
     DELETE
     NOTE:
     This currently removes it only from UI.
     We will connect DELETE API after confirming
     your backend DELETE route.
  ===================================================== */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?",
    );

    if (!confirmed) return;

    setInterviews((prev) => prev.filter((interview) => interview.id !== id));

    setOpenDetails(false);
  };

  /* =====================================================
     OPEN RESCHEDULE
  ===================================================== */

  const handleOpenReschedule = (interview) => {
    setSelectedInterview(interview);

    const date = interview.fullDate;

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setFormData({
      candidate: interview.candidateId || "",

      job: interview.jobId || "",

      name: interview.name || "",

      role: interview.role || "",

      date: formattedDate,

      time: interview.time || "",

      type: interview.type || "Technical Interview",

      interviewer: interview.interviewer || "",

      meetingLink: interview.meetingLink || "",
    });

    setOpenReschedule(true);
  };

  /* =====================================================
     STATUS STYLE
  ===================================================== */

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          backgroundColor: "#064e3b",
          color: "#6ee7b7",
        };

      case "Scheduled":
        return {
          backgroundColor: "#172554",
          color: "#60a5fa",
        };

      case "Pending":
        return {
          backgroundColor: "#422006",
          color: "#fbbf24",
        };

      case "Completed":
        return {
          backgroundColor: "#052e16",
          color: "#4ade80",
        };

      case "Cancelled":
        return {
          backgroundColor: "#450a0a",
          color: "#f87171",
        };

      default:
        return {
          backgroundColor: "#334155",
          color: "#cbd5e1",
        };
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "#94a3b8",
          }}
        >
          Loading interviews...
        </Typography>
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
        bgcolor: "#0f172a",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
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
                md: 34,
              },
              fontWeight: 700,
              color: "#f8fafc",
            }}
          >
            Interviews
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 15,
              color: "#94a3b8",
            }}
          >
            Manage, schedule and track candidate interviews.
          </Typography>
        </Box>

        {/* IMPORTANT:
            This button now has a real handler */}
        <Button
          type="button"
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenSchedule}
          sx={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            boxShadow: "none",

            "&:hover": {
              background: "linear-gradient(135deg,#5859e8,#7c3aed)",
              boxShadow: "none",
            },
          }}
        >
          Schedule Interview
        </Button>
      </Box>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#3f1111",
            border: "1px solid #7f1d1d",
          }}
        >
          <Typography
            sx={{
              color: "#f87171",
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
            lg: "repeat(4,1fr)",
          },
          gap: 2,
        }}
      >
        {[
          ["Upcoming", upcomingCount, "Scheduled / Confirmed", "#60a5fa"],

          ["Confirmed", confirmedCount, "Confirmed interviews", "#34d399"],

          ["Completed", completedCount, "Completed interviews", "#a78bfa"],

          ["Needs Action", pendingCount, "Pending interviews", "#f59e0b"],
        ].map(([title, number, subtitle, color]) => (
          <Box
            key={title}
            sx={{
              p: 2.5,
              borderRadius: 3,
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
            }}
          >
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 14,
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                color: "#f8fafc",
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              {number}
            </Typography>

            <Typography
              sx={{
                color,
                fontSize: 13,
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}

      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 3,
          backgroundColor: "#172033",
          border: "1px solid #334155",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search candidate, job or interviewer..."
          size="small"
          sx={{
            flex: 1,
            minWidth: 260,

            "& .MuiOutlinedInput-root": {
              color: "#f8fafc",
              backgroundColor: "#111827",
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

            "& input::placeholder": {
              color: "#64748b",
              opacity: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchRoundedIcon
                sx={{
                  color: "#94a3b8",
                  mr: 1,
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
          sx={{
            minWidth: 145,

            "& .MuiOutlinedInput-root": {
              color: "#e2e8f0",
              backgroundColor: "#111827",
              borderRadius: 2,
            },
          }}
        >
          <MenuItem value="All">All Status</MenuItem>

          <MenuItem value="Scheduled">Scheduled</MenuItem>

          <MenuItem value="Confirmed">Confirmed</MenuItem>

          <MenuItem value="Pending">Pending</MenuItem>

          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{
            minWidth: 165,

            "& .MuiOutlinedInput-root": {
              color: "#e2e8f0",
              backgroundColor: "#111827",
              borderRadius: 2,
            },
          }}
        >
          <MenuItem value="All">All Types</MenuItem>

          <MenuItem value="Technical Interview">Technical</MenuItem>

          <MenuItem value="HR Interview">HR</MenuItem>

          <MenuItem value="Managerial Interview">Managerial</MenuItem>
        </TextField>

        {/* View Toggle */}

        <Box
          sx={{
            display: "flex",
            backgroundColor: "#111827",
            border: "1px solid #334155",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Button
            startIcon={<ViewListRoundedIcon />}
            onClick={() => setViewMode("list")}
            sx={{
              height: 40,
              color: viewMode === "list" ? "#fff" : "#94a3b8",
              backgroundColor: viewMode === "list" ? "#3730a3" : "transparent",
              textTransform: "none",
              borderRadius: 0,
            }}
          >
            List
          </Button>

          <Button
            startIcon={<CalendarMonthRoundedIcon />}
            onClick={() => setViewMode("calendar")}
            sx={{
              height: 40,
              color: viewMode === "calendar" ? "#fff" : "#94a3b8",
              backgroundColor:
                viewMode === "calendar" ? "#3730a3" : "transparent",
              textTransform: "none",
              borderRadius: 0,
            }}
          >
            Calendar
          </Button>
        </Box>
      </Box>

      {/* =====================================================
          NEXT INTERVIEW
      ===================================================== */}

      <Box
        sx={{
          mt: 3,
          p: {
            xs: 2,
            md: 3,
          },
          borderRadius: 3,
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 600,
              color: "#f8fafc",
            }}
          >
            Next Interview ⭐
          </Typography>

          {nextInterview && (
            <Box
              sx={{
                px: 1.5,
                py: 0.6,
                borderRadius: 2,
                ...getStatusStyle(nextInterview.status),
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {nextInterview.status}
            </Box>
          )}
        </Box>

        {nextInterview ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1.2fr 1.5fr auto",
              },
              gap: 3,
              alignItems: "center",
            }}
          >
            {/* Candidate */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {nextInterview.name
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#f8fafc",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {nextInterview.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#a5b4fc",
                    fontSize: 14,
                  }}
                >
                  {nextInterview.role}
                </Typography>

                <Box
                  sx={{
                    display: "inline-block",
                    mt: 1,
                    px: 1.2,
                    py: 0.5,
                    borderRadius: 1.5,
                    backgroundColor: "#312e81",
                    color: "#c4b5fd",
                    fontSize: 12,
                  }}
                >
                  {nextInterview.type}
                </Box>
              </Box>
            </Box>

            {/* Details */}

            <Box>
              <Typography
                sx={{
                  color: "#e2e8f0",
                  fontSize: 14,
                }}
              >
                📅 {formatDate(nextInterview.fullDate)}
              </Typography>

              <Typography
                sx={{
                  color: "#e2e8f0",
                  fontSize: 14,
                }}
              >
                🕐 {nextInterview.time}
              </Typography>

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 14,
                }}
              >
                👤 {nextInterview.interviewer}
              </Typography>
            </Box>

            {/* Actions */}

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
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
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    textTransform: "none",
                    boxShadow: "none",
                  }}
                >
                  Join Interview
                </Button>
              )}

              <Button
                variant="outlined"
                onClick={() => handleViewDetails(nextInterview)}
                sx={{
                  color: "#cbd5e1",
                  borderColor: "#475569",
                  textTransform: "none",
                }}
              >
                View Details
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            sx={{
              color: "#94a3b8",
              py: 2,
            }}
          >
            No upcoming interviews.
          </Typography>
        )}
      </Box>

      {/* =====================================================
          LIST VIEW
      ===================================================== */}

      {viewMode === "list" && (
        <Box
          sx={{
            mt: 4,
            p: {
              xs: 2,
              md: 3,
            },
            borderRadius: 3,
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#f8fafc",
                }}
              >
                Upcoming Interviews
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 14,
                  color: "#94a3b8",
                }}
              >
                Your scheduled candidate interviews.
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              {filteredInterviews.length} interviews
            </Typography>
          </Box>

          {filteredInterviews.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#94a3b8",
                }}
              >
                No interviews found.
              </Typography>
            </Box>
          ) : (
            filteredInterviews.map((interview) => (
              <Box
                key={interview.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1.4fr 1.2fr 1.2fr auto",
                  },
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "#182235",
                  border: "1px solid #334155",
                }}
              >
                {/* Candidate */}

                <Box>
                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {interview.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: 13,
                    }}
                  >
                    {interview.email}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#a5b4fc",
                      fontSize: 13,
                    }}
                  >
                    {interview.role}
                  </Typography>
                </Box>

                {/* Date */}

                <Box>
                  <Typography
                    sx={{
                      color: "#e2e8f0",
                      fontSize: 13,
                    }}
                  >
                    📅 {formatDate(interview.fullDate)}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: 13,
                    }}
                  >
                    🕐 {interview.time}
                  </Typography>
                </Box>

                {/* Type */}

                <Box>
                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 13,
                    }}
                  >
                    {interview.type}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: 12,
                      mt: 0.5,
                    }}
                  >
                    👤 {interview.interviewer}
                  </Typography>
                </Box>

                {/* Actions */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.6,
                      borderRadius: 2,
                      fontSize: 12,
                      fontWeight: 600,
                      ...getStatusStyle(interview.status),
                    }}
                  >
                    {interview.status}
                  </Box>

                  <Button
                    size="small"
                    onClick={() => handleViewDetails(interview)}
                    sx={{
                      color: "#cbd5e1",
                      border: "1px solid #475569",
                      textTransform: "none",
                    }}
                  >
                    View
                  </Button>

                  <Button
                    size="small"
                    onClick={() => handleOpenReschedule(interview)}
                    sx={{
                      color: "#fff",
                      backgroundColor: "#6366f1",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#4f46e5",
                      },
                    }}
                  >
                    Reschedule
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}

      {/* =====================================================
          CALENDAR VIEW
      ===================================================== */}

      {viewMode === "calendar" && (
        <Box
          sx={{
            mt: 4,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1.3fr 1fr",
            },
            gap: 2,
          }}
        >
          {/* Calendar */}

          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2.5,
              }}
            >
              <Typography
                sx={{
                  color: "#f8fafc",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {currentMonth.toLocaleString("default", {
                  month: "long",
                })}{" "}
                {year}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                }}
              >
                <Button
                  onClick={handlePreviousMonth}
                  sx={{
                    minWidth: 36,
                    width: 36,
                    height: 36,
                    color: "#94a3b8",
                  }}
                >
                  <ChevronLeftRoundedIcon />
                </Button>

                <Button
                  onClick={handleNextMonth}
                  sx={{
                    minWidth: 36,
                    width: 36,
                    height: 36,
                    color: "#94a3b8",
                  }}
                >
                  <ChevronRightRoundedIcon />
                </Button>
              </Box>
            </Box>

            {/* Weekdays */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                textAlign: "center",
              }}
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <Typography
                  key={day}
                  sx={{
                    color: "#64748b",
                    fontSize: 11,
                    fontWeight: 600,
                    py: 0.8,
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>

            {/* Dates */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 0.5,
              }}
            >
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
                          height: 38,
                        }}
                      />
                    );
                  }

                  const isSelected = selectedDate === date;

                  const interviewExists = hasInterview(date);

                  return (
                    <Box
                      key={index}
                      onClick={() => handleDateClick(date)}
                      sx={{
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          backgroundColor: isSelected
                            ? "#6366f1"
                            : "transparent",
                          color: isSelected ? "#fff" : "#e2e8f0",
                          fontSize: 13,
                          fontWeight: isSelected ? 700 : 400,

                          "&:hover": {
                            backgroundColor: isSelected ? "#6366f1" : "#182235",
                          },
                        }}
                      >
                        {date}
                      </Box>

                      {interviewExists && !isSelected && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 1,
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            backgroundColor: "#6366f1",
                          }}
                        />
                      )}
                    </Box>
                  );
                },
              )}
            </Box>
          </Box>

          {/* Selected Date */}

          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
            }}
          >
            <Typography
              sx={{
                color: "#f8fafc",
                fontSize: 18,
                fontWeight: 600,
                mb: 2,
              }}
            >
              Interviews on {selectedDate}{" "}
              {currentMonth.toLocaleString("default", {
                month: "short",
              })}{" "}
              {year}
            </Typography>

            {selectedInterviews.length === 0 ? (
              <Typography
                sx={{
                  color: "#64748b",
                  textAlign: "center",
                  py: 5,
                }}
              >
                No interviews scheduled for this date.
              </Typography>
            ) : (
              selectedInterviews.map((interview) => (
                <Box
                  key={interview.id}
                  sx={{
                    p: 1.5,
                    mb: 1.5,
                    borderRadius: 2,
                    backgroundColor: "#182235",
                    border: "1px solid #334155",
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewDetails(interview)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#818cf8",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {interview.time}
                    </Typography>

                    <Box
                      sx={{
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        fontSize: 10,
                        fontWeight: 600,
                        ...getStatusStyle(interview.status),
                      }}
                    >
                      {interview.status}
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontSize: 14,
                      fontWeight: 600,
                      mt: 1,
                    }}
                  >
                    {interview.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 12,
                    }}
                  >
                    {interview.role}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 12,
                    }}
                  >
                    {interview.type}
                  </Typography>
                </Box>
              ))
            )}

            <Button
              fullWidth
              startIcon={<AddRoundedIcon />}
              onClick={handleOpenSchedule}
              sx={{
                mt: 1,
                color: "#818cf8",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Schedule Interview
            </Button>
          </Box>
        </Box>
      )}

      {/* =====================================================
          SCHEDULE INTERVIEW DIALOG
      ===================================================== */}

      <Dialog
        open={openSchedule}
        onClose={handleCloseSchedule}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: "#1e293b",
            color: "#f8fafc",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Schedule Interview
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: 13,
              mb: 1,
            }}
          >
            Enter the Candidate ID and Job ID that you used in Postman/MongoDB.
          </Typography>

          {/* Candidate ID */}

          <TextField
            fullWidth
            required
            label="Candidate ID"
            name="candidate"
            value={formData.candidate}
            onChange={handleFormChange}
            margin="normal"
            placeholder="6a8158798be1a5ce140c2355"
          />

          {/* Job ID */}

          <TextField
            fullWidth
            required
            label="Job ID"
            name="job"
            value={formData.job}
            onChange={handleFormChange}
            margin="normal"
            placeholder="6a873283a6f8c70918405caf"
          />

          {/* Date */}

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

          {/* Time */}

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

          {/* Type */}

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

          {/* Interviewer */}

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

          {/* Meeting Link */}

          <TextField
            fullWidth
            label="Meeting Link"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleFormChange}
            margin="normal"
            placeholder="https://meet.google.com/example"
          />
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
          }}
        >
          <Button
            disabled={submitting}
            onClick={handleCloseSchedule}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={submitting}
            onClick={handleSchedule}
            sx={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              textTransform: "none",

              "&:hover": {
                background: "linear-gradient(135deg,#5859e8,#7c3aed)",
              },
            }}
          >
            {submitting ? "Scheduling..." : "Schedule Interview"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          DETAILS DIALOG
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
            alignItems: "center",
          }}
        >
          Interview Details
          <Button
            onClick={() => setOpenDetails(false)}
            sx={{
              minWidth: 40,
              color: "#64748b",
            }}
          >
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>

        {selectedInterview && (
          <DialogContent>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                mb: 1,
              }}
            >
              {selectedInterview.name}
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                mb: 3,
              }}
            >
              {selectedInterview.role}
            </Typography>

            <Typography>📅 {formatDate(selectedInterview.fullDate)}</Typography>

            <Typography
              sx={{
                mt: 1,
              }}
            >
              🕐 {selectedInterview.time}
            </Typography>

            <Typography
              sx={{
                mt: 1,
              }}
            >
              💼 {selectedInterview.type}
            </Typography>

            <Typography
              sx={{
                mt: 1,
              }}
            >
              👤 {selectedInterview.interviewer}
            </Typography>

            <Typography
              sx={{
                mt: 1,
              }}
            >
              📌 {selectedInterview.status}
            </Typography>

            {selectedInterview.email && (
              <Typography
                sx={{
                  mt: 1,
                }}
              >
                📧 {selectedInterview.email}
              </Typography>
            )}

            {selectedInterview.meetingLink && (
              <Typography
                sx={{
                  mt: 1,
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
                onClick={() => handleDelete(selectedInterview.id)}
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

              {selectedInterview.meetingLink && (
                <Button
                  variant="contained"
                  startIcon={<VideoCameraFrontRoundedIcon />}
                  onClick={() =>
                    window.open(
                      selectedInterview.meetingLink,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  Join
                </Button>
              )}

              <Button onClick={() => setOpenDetails(false)}>Close</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* =====================================================
          RESCHEDULE DIALOG
      ===================================================== */}

      <Dialog
        open={openReschedule}
        onClose={() => setOpenReschedule(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Reschedule Interview</DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: 13,
              mb: 1,
            }}
          >
            You can update the interview details here. Backend reschedule API
            will be connected separately.
          </Typography>

          <TextField
            fullWidth
            type="date"
            label="New Date"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
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
            InputLabelProps={{
              shrink: true,
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
            onClick={() => {
              alert("Reschedule API is not connected yet.");
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Interviews;
