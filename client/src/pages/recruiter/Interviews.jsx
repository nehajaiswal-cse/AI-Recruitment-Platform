import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";

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

import { useInterviewContext } from "../../context/InterviewContext";

import RNavbar from '../../components/layout/recruiter/Navbar';
import RSidebar from '../../components/layout/recruiter/Sidebar';

const Interviews = () => {
  const theme = useTheme();
  // ===================================================
  // INTERVIEW CONTEXT
  // ===================================================

  const {
    interviews,
    loading,
    error,
    fetchRecruiterInterviews,
    createInterview,
    recruiterRescheduleInterview,
    deleteInterview,
    clearError,
  } = useInterviewContext();

  // ===================================================
  // CALENDAR
  // ===================================================

  const [currentMonth, setCurrentMonth] = useState(
    new Date()
  );

  const [selectedDate, setSelectedDate] = useState(
    new Date().getDate()
  );

  // ===================================================
  // VIEW / FILTER
  // ===================================================

  const [viewMode, setViewMode] = useState("list");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [typeFilter, setTypeFilter] = useState("All");

  // ===================================================
  // DIALOG
  // ===================================================

  const [openSchedule, setOpenSchedule] =
    useState(false);

  const [openDetails, setOpenDetails] =
    useState(false);

  const [openReschedule, setOpenReschedule] =
    useState(false);

  const [selectedInterview, setSelectedInterview] =
    useState(null);

  // ===================================================
  // FORM
  // ===================================================

  const emptyForm = {
    candidate: "",
    job: "",
    date: "",
    time: "",
    type: "Technical Interview",
    interviewer: "",
    meetingLink: "",
  };

  const [formData, setFormData] =
    useState(emptyForm);

  // ===================================================
  // FETCH RECRUITER INTERVIEWS
  // ===================================================

  useEffect(() => {
    fetchRecruiterInterviews();
  }, [fetchRecruiterInterviews]);

  // ===================================================
  // FORM CHANGE
  // ===================================================

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================================
  // OPEN SCHEDULE
  // ===================================================

  const handleOpenSchedule = () => {
    clearError();

    setFormData(emptyForm);

    setOpenSchedule(true);
  };

  // ===================================================
  // CLOSE SCHEDULE
  // ===================================================

  const handleCloseSchedule = () => {
    clearError();

    setFormData(emptyForm);

    setOpenSchedule(false);
  };

  // ===================================================
  // SCHEDULE INTERVIEW
  // ===================================================

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
      await createInterview({
        candidate: formData.candidate.trim(),

        job: formData.job.trim(),

        date: formData.date,

        time: formData.time,

        type: formData.type,

        interviewer:
          formData.interviewer.trim(),

        meetingLink:
          formData.meetingLink.trim(),
      });

      alert(
        "Interview scheduled successfully!"
      );

      setFormData(emptyForm);

      setOpenSchedule(false);
    } catch (error) {
      alert(
        error.message ||
          "Failed to schedule interview"
      );
    }
  };

  // ===================================================
  // FILTERED INTERVIEWS
  // ===================================================

  const filteredInterviews = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return interviews.filter((interview) => {
      const candidateName =
        interview.candidate?.name ||
        interview.applicant?.name ||
        interview.name ||
        "";

      const candidateEmail =
        interview.candidate?.email ||
        interview.applicant?.email ||
        interview.email ||
        "";

      const jobTitle =
        interview.job?.title ||
        interview.role ||
        "";

      const interviewer =
        interview.interviewer || "";

      const interviewType =
        interview.type || "";

      const status =
        interview.status || "";

      const matchesSearch =
        candidateName
          .toLowerCase()
          .includes(searchValue) ||
        candidateEmail
          .toLowerCase()
          .includes(searchValue) ||
        jobTitle
          .toLowerCase()
          .includes(searchValue) ||
        interviewer
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        interviewType === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    interviews,
    search,
    statusFilter,
    typeFilter,
  ]);

  // ===================================================
  // STATS
  // ===================================================

  const upcomingCount = interviews.filter(
    (interview) =>
      interview.status === "Scheduled" ||
      interview.status === "Confirmed"
  ).length;

  const confirmedCount = interviews.filter(
    (interview) =>
      interview.status === "Confirmed"
  ).length;

  const completedCount = interviews.filter(
    (interview) =>
      interview.status === "Completed"
  ).length;

  const pendingCount = interviews.filter(
    (interview) =>
      interview.status === "Pending"
  ).length;

  // ===================================================
  // NEXT INTERVIEW
  // ===================================================

  const nextInterview = useMemo(() => {
    const upcoming = interviews.filter(
      (interview) =>
        interview.status === "Scheduled" ||
        interview.status === "Confirmed"
    );

    const sorted = [...upcoming].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

    return sorted[0] || null;
  }, [interviews]);

  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ===================================================
  // GET CANDIDATE NAME
  // ===================================================

  const getCandidateName = (interview) => {
    return (
      interview.candidate?.name ||
      interview.applicant?.name ||
      interview.name ||
      "Unknown Candidate"
    );
  };

  // ===================================================
  // GET CANDIDATE EMAIL
  // ===================================================

  const getCandidateEmail = (interview) => {
    return (
      interview.candidate?.email ||
      interview.applicant?.email ||
      interview.email ||
      ""
    );
  };

  // ===================================================
  // GET JOB TITLE
  // ===================================================

  const getJobTitle = (interview) => {
    return (
      interview.job?.title ||
      interview.role ||
      "Unknown Job"
    );
  };

  // ===================================================
  // CALENDAR VALUES
  // ===================================================

  const year =
    currentMonth.getFullYear();

  const month =
    currentMonth.getMonth();

  const firstDay =
    new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const startingDay =
    firstDay === 0
      ? 6
      : firstDay - 1;

  // ===================================================
  // SELECTED DATE INTERVIEWS
  // ===================================================

  const selectedInterviews =
    interviews.filter((interview) => {
      const date = new Date(
        interview.date
      );

      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === selectedDate
      );
    });

  // ===================================================
  // HAS INTERVIEW
  // ===================================================

  const hasInterview = (date) => {
    return interviews.some(
      (interview) => {
        const interviewDate =
          new Date(interview.date);

        return (
          interviewDate.getFullYear() ===
            year &&
          interviewDate.getMonth() ===
            month &&
          interviewDate.getDate() === date
        );
      }
    );
  };

  // ===================================================
  // CALENDAR NAVIGATION
  // ===================================================

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );

    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );

    setSelectedDate(1);
  };

  // ===================================================
  // VIEW DETAILS
  // ===================================================

  const handleViewDetails = (
    interview
  ) => {
    setSelectedInterview(interview);

    setOpenDetails(true);
  };

  // ===================================================
  // OPEN RESCHEDULE
  // ===================================================

  const handleOpenReschedule = (
    interview
  ) => {
    setSelectedInterview(interview);

    const date = new Date(
      interview.date
    );

    const formattedDate =
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;

    setFormData({
      candidate:
        interview.candidate?._id ||
        interview.candidate ||
        interview.applicant?._id ||
        interview.applicant ||
        "",

      job:
        interview.job?._id ||
        interview.job ||
        "",

      date: formattedDate,

      time: interview.time || "",

      type:
        interview.type ||
        "Technical Interview",

      interviewer:
        interview.interviewer || "",

      meetingLink:
        interview.meetingLink || "",
    });

    setOpenReschedule(true);
  };

  // ===================================================
  // RESCHEDULE
  // ===================================================

  const handleReschedule = async () => {
    if (!selectedInterview) return;

    if (!formData.date || !formData.time) {
      alert(
        "Please select date and time."
      );
      return;
    }

    try {
      await recruiterRescheduleInterview(
        selectedInterview._id ||
          selectedInterview.id,
        {
          date: formData.date,

          time: formData.time,

          type: formData.type,

          interviewer:
            formData.interviewer,

          meetingLink:
            formData.meetingLink,
        }
      );

      alert(
        "Interview rescheduled successfully!"
      );

      setOpenReschedule(false);

      setSelectedInterview(null);

      setFormData(emptyForm);
    } catch (error) {
      alert(
        error.message ||
          "Failed to reschedule interview"
      );
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = async (
    interviewId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this interview?"
      );

    if (!confirmed) return;

    try {
      await deleteInterview(interviewId);

      alert(
        "Interview deleted successfully."
      );

      setOpenDetails(false);

      setSelectedInterview(null);
    } catch (error) {
      alert(
        error.message ||
          "Failed to delete interview"
      );
    }
  };

  // ===================================================
  // STATUS STYLE
  // ===================================================

  const getStatusStyle = (status) => {
    const isDark = theme.palette.mode === "dark";

    switch (status) {
      case "Confirmed":
        return {
          backgroundColor: isDark ? "#064e3b" : "#d1fae5",
          color: isDark ? "#6ee7b7" : "#047857",
        };

      case "Scheduled":
        return {
          backgroundColor: isDark ? "#172554" : "#dbeafe",
          color: isDark ? "#60a5fa" : "#1d4ed8",
        };

      case "Pending":
        return {
          backgroundColor: isDark ? "#422006" : "#fef3c7",
          color: isDark ? "#fbbf24" : "#b45309",
        };

      case "Completed":
        return {
          backgroundColor: isDark ? "#052e16" : "#dcfce7",
          color: isDark ? "#4ade80" : "#15803d",
        };

      case "Cancelled":
        return {
          backgroundColor: isDark ? "#450a0a" : "#fee2e2",
          color: isDark ? "#f87171" : "#dc2626",
        };

      default:
        return {
          backgroundColor: isDark ? "#334155" : "#e2e8f0",
          color: isDark ? "#cbd5e1" : "#475569",
        };
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading && interviews.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          Loading interviews...
        </Typography>
      </Box>
    );
  }

  // ===================================================
  // UI
  // ===================================================

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
            <RNavbar />
          </Box>
    
          {/* Sidebar + Main */}
          <Box
            sx={{
              display: 'flex',
              minWidth: 0,
            }}
          >
            {/* Sidebar */}
            <RSidebar />
    
            {/* Main */}
            <Box
              component="main"
              sx={{
                flex: 1,
                minWidth: 0,
                bgcolor: 'background.default',
                color: 'text.primary',
                pt: 5
              }}
            >
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

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
              color: "text.primary",
            }}
          >
            Interviews
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 15,
              color: "text.secondary",
            }}
          >
            Manage, schedule and track
            candidate interviews.
          </Typography>
        </Box>

        <Button
          type="button"
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenSchedule}
          sx={{
            background: "linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})",
            color: "common.white",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            boxShadow: "none",

            "&:hover": {
              background:
                "linear-gradient(135deg,#5859e8,#7c3aed)",
              boxShadow: "none",
            },
          }}
        >
          Schedule Interview
        </Button>
      </Box>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: "error.dark",
            border: "1px solid",
            borderColor: "error.main",
          }}
        >
          <Typography
            sx={{
              color: "error.light",
            }}
          >
            {error}
          </Typography>
        </Box>
      )}

      {/* =================================================
          STATS
      ================================================= */}

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
          [
            "Upcoming",
            upcomingCount,
            "Scheduled / Confirmed",
            "#60a5fa",
          ],
          [
            "Confirmed",
            confirmedCount,
            "Confirmed interviews",
            "#34d399",
          ],
          [
            "Completed",
            completedCount,
            "Completed interviews",
            "#a78bfa",
          ],
          [
            "Needs Action",
            pendingCount,
            "Pending interviews",
            "#f59e0b",
          ],
        ].map(
          ([
            title,
            number,
            subtitle,
            color,
          ]) => (
            <Box
              key={title}
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 14,
                  mb: 1,
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  color: "text.primary",
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
          )
        )}
      </Box>

      {/* =================================================
          SEARCH / FILTER
      ================================================= */}

      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 3,
          backgroundColor: "background.paper",
          border: "1px solid",
            borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <TextField
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search candidate, job or interviewer..."
          size="small"
          sx={{
            flex: 1,
            minWidth: 260,

            "& .MuiOutlinedInput-root": {
              color: "text.primary",
              backgroundColor: "background.default",
              borderRadius: 2,

              "& fieldset": {
                borderColor: "divider",
              },

              "&:hover fieldset": {
                borderColor: "text.secondary",
              },

              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },

            "& input::placeholder": {
              color: "text.secondary",
              opacity: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchRoundedIcon
                sx={{
                  color: "text.secondary",
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
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          sx={{
            minWidth: 145,

            "& .MuiOutlinedInput-root": {
              color: "text.primary",
              backgroundColor: "background.default",
              borderRadius: 2,
            },
          }}
        >
          <MenuItem value="All">
            All Status
          </MenuItem>

          <MenuItem value="Scheduled">
            Scheduled
          </MenuItem>

          <MenuItem value="Confirmed">
            Confirmed
          </MenuItem>

          <MenuItem value="Pending">
            Pending
          </MenuItem>

          <MenuItem value="Completed">
            Completed
          </MenuItem>

          <MenuItem value="Cancelled">
            Cancelled
          </MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(
              e.target.value
            )
          }
          sx={{
            minWidth: 165,

            "& .MuiOutlinedInput-root": {
              color: "text.primary",
              backgroundColor: "background.default",
              borderRadius: 2,
            },
          }}
        >
          <MenuItem value="All">
            All Types
          </MenuItem>

          <MenuItem value="Technical Interview">
            Technical
          </MenuItem>

          <MenuItem value="HR Interview">
            HR
          </MenuItem>

          <MenuItem value="Managerial Interview">
            Managerial
          </MenuItem>
        </TextField>

        {/* VIEW TOGGLE */}

        <Box
          sx={{
            display: "flex",
            backgroundColor: "background.default",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Button
            startIcon={
              <ViewListRoundedIcon />
            }
            onClick={() =>
              setViewMode("list")
            }
            sx={{
              height: 40,
              color:
                viewMode === "list"
                  ? "common.white"
                  : "text.secondary",
              backgroundColor:
                viewMode === "list"
                  ? "primary.dark"
                  : "transparent",
              textTransform: "none",
              borderRadius: 0,
            }}
          >
            List
          </Button>

          <Button
            startIcon={
              <CalendarMonthRoundedIcon />
            }
            onClick={() =>
              setViewMode("calendar")
            }
            sx={{
              height: 40,
              color:
                viewMode === "calendar"
                  ? "common.white"
                  : "text.secondary",
              backgroundColor:
                viewMode === "calendar"
                  ? "primary.dark"
                  : "transparent",
              textTransform: "none",
              borderRadius: 0,
            }}
          >
            Calendar
          </Button>
        </Box>
      </Box>

      {/* =================================================
          NEXT INTERVIEW
      ================================================= */}

      <Box
        sx={{
          mt: 3,
          p: {
            xs: 2,
            md: 3,
          },
          borderRadius: 3,
          backgroundColor: "background.paper",
          border: "1px solid",
            borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 600,
              color: "text.primary",
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
                ...getStatusStyle(
                  nextInterview.status
                ),
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

    background: `linear-gradient(
      135deg,
      ${theme.palette.primary.main},
      ${theme.palette.secondary.main}
    )`,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    color: "#ffffff",
    fontWeight: 700,
    fontSize: 16,

    // Makes the initials clearly visible in both modes
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",

    flexShrink: 0,
  }}
>
  {getCandidateName(nextInterview)
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()}
</Box>

              <Box>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {getCandidateName(
                    nextInterview
                  )}
                </Typography>

                <Typography
                  sx={{
                    color: "primary.light",
                    fontSize: 14,
                  }}
                >
                  {getJobTitle(
                    nextInterview
                  )}
                </Typography>

                <Box
                  sx={{
                    display:
                      "inline-block",
                    mt: 1,
                    px: 1.2,
                    py: 0.5,
                    borderRadius: 1.5,
                    backgroundColor: "secondary.dark",
                    color: "secondary.light",
                    fontSize: 12,
                  }}
                >
                  {nextInterview.type}
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: 14,
                }}
              >
                📅{" "}
                {formatDate(
                  nextInterview.date
                )}
              </Typography>

              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: 14,
                }}
              >
                🕐 {nextInterview.time}
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 14,
                }}
              >
                👤{" "}
                {nextInterview.interviewer}
              </Typography>
            </Box>

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
                  startIcon={
                    <VideoCameraFrontRoundedIcon />
                  }
                  onClick={() =>
                    window.open(
                      nextInterview.meetingLink,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  sx={{
                    background:
                      `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    textTransform:
                      "none",
                    boxShadow: "none",
                  }}
                >
                  Join Interview
                </Button>
              )}

              <Button
                variant="outlined"
                onClick={() =>
                  handleViewDetails(
                    nextInterview
                  )
                }
                sx={{
                  color: "text.primary",
                  borderColor: "text.secondary",
                  textTransform:
                    "none",
                }}
              >
                View Details
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            sx={{
              color: "text.secondary",
              py: 2,
            }}
          >
            No upcoming interviews.
          </Typography>
        )}
      </Box>

      {/* =================================================
          LIST VIEW
      ================================================= */}

      {viewMode === "list" && (
        <Box
          sx={{
            mt: 4,
            p: {
              xs: 2,
              md: 3,
            },
            borderRadius: 3,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                Upcoming Interviews
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 14,
                  color: "text.secondary",
                }}
              >
                Your scheduled candidate
                interviews.
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              {filteredInterviews.length}{" "}
              interviews
            </Typography>
          </Box>

          {filteredInterviews.length ===
          0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",
                }}
              >
                No interviews found.
              </Typography>
            </Box>
          ) : (
            filteredInterviews.map(
              (interview) => (
                <Box
                  key={
                    interview._id ||
                    interview.id
                  }
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "1.4fr 1.2fr 1.2fr auto",
                    },
                    alignItems:
                      "center",
                    gap: 2,
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: "background.surface",
                    border: "1px solid",
                      borderColor: "divider",
                  }}
                >
                  {/* Candidate */}

                  <Box>
                    <Typography
                      sx={{
                        color: "text.primary",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      {getCandidateName(
                        interview
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: 13,
                      }}
                    >
                      {getCandidateEmail(
                        interview
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        color: "primary.light",
                        fontSize: 13,
                      }}
                    >
                      {getJobTitle(
                        interview
                      )}
                    </Typography>
                  </Box>

                  {/* Date */}

                  <Box>
                    <Typography
                      sx={{
                        color: "text.primary",
                        fontSize: 13,
                      }}
                    >
                      📅{" "}
                      {formatDate(
                        interview.date
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: 13,
                      }}
                    >
                      🕐{" "}
                      {interview.time}
                    </Typography>
                  </Box>

                  {/* Type */}

                  <Box>
                    <Typography
                      sx={{
                        color: "text.primary",
                        fontSize: 13,
                      }}
                    >
                      {interview.type}
                    </Typography>

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: 12,
                        mt: 0.5,
                      }}
                    >
                      👤{" "}
                      {interview.interviewer}
                    </Typography>
                  </Box>

                  {/* Actions */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 1,
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.6,
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: 600,
                        ...getStatusStyle(
                          interview.status
                        ),
                      }}
                    >
                      {interview.status}
                    </Box>

                    <Button
                      size="small"
                      onClick={() =>
                        handleViewDetails(
                          interview
                        )
                      }
                      sx={{
                        color: "text.primary",
                        border: "1px solid",
                          borderColor: "text.secondary",
                        textTransform:
                          "none",
                      }}
                    >
                      View
                    </Button>

                    <Button
                      size="small"
                      onClick={() =>
                        handleOpenReschedule(
                          interview
                        )
                      }
                      sx={{
                        color: "common.white",
                        backgroundColor: "primary.main",
                        textTransform:
                          "none",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      Reschedule
                    </Button>
                  </Box>
                </Box>
              )
            )
          )}
        </Box>
      )}

      {/* =================================================
          CALENDAR VIEW
      ================================================= */}

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
              backgroundColor: "background.paper",
              border: "1px solid",
                borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                mb: 2.5,
              }}
            >
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {currentMonth.toLocaleString(
                  "default",
                  {
                    month: "long",
                  }
                )}{" "}
                {year}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                }}
              >
                <Button
                  onClick={
                    handlePreviousMonth
                  }
                  sx={{
                    minWidth: 36,
                    width: 36,
                    height: 36,
                    color: "text.secondary",
                  }}
                >
                  <ChevronLeftRoundedIcon />
                </Button>

                <Button
                  onClick={
                    handleNextMonth
                  }
                  sx={{
                    minWidth: 36,
                    width: 36,
                    height: 36,
                    color: "text.secondary",
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
                gridTemplateColumns:
                  "repeat(7, 1fr)",
                textAlign: "center",
              }}
            >
              {[
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ].map((day) => (
                <Typography
                  key={day}
                  sx={{
                    color: "text.secondary",
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
                gridTemplateColumns:
                  "repeat(7, 1fr)",
                gap: 0.5,
              }}
            >
              {Array.from(
                {
                  length:
                    startingDay +
                    daysInMonth,
                },
                (_, index) => {
                  const date =
                    index -
                    startingDay +
                    1;

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

                  const isSelected =
                    selectedDate ===
                    date;

                  const interviewExists =
                    hasInterview(
                      date
                    );

                  return (
                    <Box
                      key={index}
                      onClick={() =>
                        setSelectedDate(
                          date
                        )
                      }
                      sx={{
                        height: 38,
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        position:
                          "relative",
                        cursor:
                          "pointer",
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          borderRadius:
                            "50%",
                          backgroundColor: isSelected ? "primary.main" : "transparent",
                          color: isSelected ? "common.white" : "text.primary",
                          fontSize: 13,
                          fontWeight:
                            isSelected
                              ? 700
                              : 400,

                          "&:hover": {
                            backgroundColor: isSelected ? "primary.main" : "background.surface",
                          },
                        }}
                      >
                        {date}
                      </Box>

                      {interviewExists &&
                        !isSelected && (
                          <Box
                            sx={{
                              position:
                                "absolute",
                              bottom: 1,
                              width: 4,
                              height: 4,
                              borderRadius:
                                "50%",
                              backgroundColor: "primary.main",
                            }}
                          />
                        )}
                    </Box>
                  );
                }
              )}
            </Box>
          </Box>

          {/* Selected Date */}

          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              backgroundColor: "background.paper",
              border: "1px solid",
                borderColor: "divider",
            }}
          >
            <Typography
              sx={{
                color: "text.primary",
                fontSize: 18,
                fontWeight: 600,
                mb: 2,
              }}
            >
              Interviews on{" "}
              {selectedDate}{" "}
              {currentMonth.toLocaleString(
                "default",
                {
                  month: "short",
                }
              )}{" "}
              {year}
            </Typography>

            {selectedInterviews.length ===
            0 ? (
              <Typography
                sx={{
                  color: "text.secondary",
                  textAlign:
                    "center",
                  py: 5,
                }}
              >
                No interviews scheduled
                for this date.
              </Typography>
            ) : (
              selectedInterviews.map(
                (interview) => (
                  <Box
                    key={
                      interview._id ||
                      interview.id
                    }
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      borderRadius: 2,
                      backgroundColor: "background.surface",
                      border: "1px solid",
                        borderColor: "divider",
                      cursor:
                        "pointer",
                    }}
                    onClick={() =>
                      handleViewDetails(
                        interview
                      )
                    }
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            "#818cf8",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {
                          interview.time
                        }
                      </Typography>

                      <Box
                        sx={{
                          px: 1,
                          py: 0.3,
                          borderRadius:
                            1,
                          fontSize: 10,
                          fontWeight: 600,
                          ...getStatusStyle(
                            interview.status
                          ),
                        }}
                      >
                        {
                          interview.status
                        }
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        color: "text.primary",
                        fontSize: 14,
                        fontWeight: 600,
                        mt: 1,
                      }}
                    >
                      {getCandidateName(
                        interview
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: 12,
                      }}
                    >
                      {getJobTitle(
                        interview
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: 12,
                      }}
                    >
                      {interview.type}
                    </Typography>
                  </Box>
                )
              )
            )}

            <Button
              fullWidth
              startIcon={
                <AddRoundedIcon />
              }
              onClick={
                handleOpenSchedule
              }
              sx={{
                mt: 1,
                color: "primary.light",
                textTransform:
                  "none",
                fontWeight: 600,
              }}
            >
              Schedule Interview
            </Button>
          </Box>
        </Box>
      )}

      {/* =================================================
          SCHEDULE DIALOG
      ================================================= */}

      <Dialog
        open={openSchedule}
        onClose={
          handleCloseSchedule
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: "background.paper",
            color: "text.primary",
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
              color: "text.secondary",
              fontSize: 13,
              mb: 1,
            }}
          >
            Enter the Candidate ID and
            Job ID.
          </Typography>

          <TextField
            fullWidth
            required
            label="Candidate ID"
            name="candidate"
            value={
              formData.candidate
            }
            onChange={
              handleFormChange
            }
            margin="normal"
            placeholder="Candidate ObjectId"
          />

          <TextField
            fullWidth
            required
            label="Job ID"
            name="job"
            value={formData.job}
            onChange={
              handleFormChange
            }
            margin="normal"
            placeholder="Job ObjectId"
          />

          <TextField
            fullWidth
            required
            type="date"
            label="Interview Date"
            name="date"
            value={formData.date}
            onChange={
              handleFormChange
            }
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
            onChange={
              handleFormChange
            }
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
            onChange={
              handleFormChange
            }
            margin="normal"
          >
            <MenuItem value="Technical Interview">
              Technical Interview
            </MenuItem>

            <MenuItem value="HR Interview">
              HR Interview
            </MenuItem>

            <MenuItem value="Managerial Interview">
              Managerial Interview
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            required
            label="Interviewer"
            name="interviewer"
            value={
              formData.interviewer
            }
            onChange={
              handleFormChange
            }
            margin="normal"
            placeholder="John Doe"
          />

          <TextField
            fullWidth
            label="Meeting Link"
            name="meetingLink"
            value={
              formData.meetingLink
            }
            onChange={
              handleFormChange
            }
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
            onClick={
              handleCloseSchedule
            }
            sx={{
              textTransform:
                "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={loading}
            onClick={
              handleSchedule
            }
            sx={{
              background:
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              textTransform:
                "none",

              "&:hover": {
                background:
                  "linear-gradient(135deg,#5859e8,#7c3aed)",
              },
            }}
          >
            {loading
              ? "Scheduling..."
              : "Schedule Interview"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================
          DETAILS DIALOG
      ================================================= */}

      <Dialog
        open={openDetails}
        onClose={() =>
          setOpenDetails(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          Interview Details

          <Button
            onClick={() =>
              setOpenDetails(false)
            }
            sx={{
              minWidth: 40,
              color: "text.secondary",
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
              {getCandidateName(
                selectedInterview
              )}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                mb: 3,
              }}
            >
              {getJobTitle(
                selectedInterview
              )}
            </Typography>

            <Typography>
              📅{" "}
              {formatDate(
                selectedInterview.date
              )}
            </Typography>

            <Typography
              sx={{
                mt: 1,
              }}
            >
              🕐{" "}
              {selectedInterview.time}
            </Typography>

            <Typography
              sx={{
                mt: 1,
              }}
            >
              💼{" "}
              {selectedInterview.type}
            </Typography>

            <Typography
              sx={{
                mt: 1,
              }}
            >
              👤{" "}
              {
                selectedInterview.interviewer
              }
            </Typography>

            <Typography
              sx={{
                mt: 1,
              }}
            >
              📌{" "}
              {selectedInterview.status}
            </Typography>

            {getCandidateEmail(
              selectedInterview
            ) && (
              <Typography
                sx={{
                  mt: 1,
                }}
              >
                📧{" "}
                {getCandidateEmail(
                  selectedInterview
                )}
              </Typography>
            )}

            {selectedInterview.meetingLink && (
              <Typography
                sx={{
                  mt: 1,
                  wordBreak:
                    "break-all",
                }}
              >
                🔗{" "}
                {
                  selectedInterview.meetingLink
                }
              </Typography>
            )}
          </DialogContent>
        )}

        <DialogActions>
          {selectedInterview && (
            <>
              <Button
                color="error"
                onClick={() =>
                  handleDelete(
                    selectedInterview._id ||
                      selectedInterview.id
                  )
                }
              >
                Delete
              </Button>

              <Button
                onClick={() => {
                  setOpenDetails(
                    false
                  );

                  handleOpenReschedule(
                    selectedInterview
                  );
                }}
              >
                Reschedule
              </Button>

              {selectedInterview.meetingLink && (
                <Button
                  variant="contained"
                  startIcon={
                    <VideoCameraFrontRoundedIcon />
                  }
                  onClick={() =>
                    window.open(
                      selectedInterview.meetingLink,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  Join
                </Button>
              )}

              <Button
                onClick={() =>
                  setOpenDetails(false)
                }
              >
                Close
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* =================================================
          RESCHEDULE DIALOG
      ================================================= */}

      <Dialog
        open={openReschedule}
        onClose={() =>
          setOpenReschedule(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Reschedule Interview
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 13,
              mb: 1,
            }}
          >
            Update the interview date,
            time and other details.
          </Typography>

          <TextField
            fullWidth
            type="date"
            label="New Date"
            name="date"
            value={formData.date}
            onChange={
              handleFormChange
            }
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
            onChange={
              handleFormChange
            }
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
            onChange={
              handleFormChange
            }
            margin="normal"
          >
            <MenuItem value="Technical Interview">
              Technical Interview
            </MenuItem>

            <MenuItem value="HR Interview">
              HR Interview
            </MenuItem>

            <MenuItem value="Managerial Interview">
              Managerial Interview
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Interviewer"
            name="interviewer"
            value={
              formData.interviewer
            }
            onChange={
              handleFormChange
            }
            margin="normal"
          />

          <TextField
            fullWidth
            label="Meeting Link"
            name="meetingLink"
            value={
              formData.meetingLink
            }
            onChange={
              handleFormChange
            }
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpenReschedule(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={loading}
            onClick={
              handleReschedule
            }
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
    </Box>
    </Box>
  );
};

export default Interviews;













