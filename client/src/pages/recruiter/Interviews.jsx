import { useNavigate } from "react-router-dom";

import { useMemo, useState } from "react";

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
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const Interviews = () => {
  const navigate = useNavigate();
  /* =========================
     CALENDAR STATE
  ========================= */

  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1));

  const [selectedDate, setSelectedDate] = useState(20);

  /* =========================
     VIEW / FILTER STATE
  ========================= */

  const [viewMode, setViewMode] = useState("list");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [typeFilter, setTypeFilter] = useState("All");

  const [dateFilter, setDateFilter] = useState("All");

  /* =========================
     DIALOG STATE
  ========================= */

  const [openSchedule, setOpenSchedule] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);

  const [openReschedule, setOpenReschedule] = useState(false);

  const [selectedInterview, setSelectedInterview] = useState(null);

  /* =========================
     FORM STATE
  ========================= */

  const emptyForm = {
    name: "",
    role: "",
    date: "",
    time: "",
    type: "",
    interviewer: "",
    meetingLink: "",
    status: "Scheduled",
  };

  const [formData, setFormData] = useState(emptyForm);

  /* =========================
     INTERVIEW DATA
  ========================= */

  const [interviews, setInterviews] = useState([
    {
      id: 1,
      date: 18,
      name: "Aarav Sharma",
      role: "Frontend Developer",
      time: "10:30 AM",
      type: "Technical Interview",
      status: "Scheduled",
      interviewer: "Neha Jaiswal",
      meetingLink: "https://meet.google.com/",
    },

    {
      id: 2,
      date: 20,
      name: "Rahul Sharma",
      role: "Backend Developer",
      time: "10:30 AM",
      type: "Technical Interview",
      status: "Confirmed",
      interviewer: "Samrat Ashwin",
      meetingLink: "https://meet.google.com/",
    },

    {
      id: 3,
      date: 20,
      name: "Priya Singh",
      role: "Frontend Developer",
      time: "12:00 PM",
      type: "HR Interview",
      status: "Pending",
      interviewer: "Neha Jaiswal",
      meetingLink: "https://meet.google.com/",
    },

    {
      id: 4,
      date: 21,
      name: "Amit Kumar",
      role: "Backend Developer",
      time: "03:30 PM",
      type: "Technical Interview",
      status: "Confirmed",
      interviewer: "Rahul Mehta",
      meetingLink: "https://meet.google.com/",
    },
  ]);

  /* =========================
     CALENDAR VALUES
  ========================= */

  const year = currentMonth.getFullYear();

  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startingDay = firstDay === 0 ? 6 : firstDay - 1;

  /* =========================
     FILTERED INTERVIEWS
  ========================= */

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        interview.name.toLowerCase().includes(searchValue) ||
        interview.role.toLowerCase().includes(searchValue) ||
        interview.interviewer.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || interview.status === statusFilter;

      const matchesType = typeFilter === "All" || interview.type === typeFilter;

      const matchesDate =
        dateFilter === "All" || interview.date === Number(dateFilter);

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [interviews, search, statusFilter, typeFilter, dateFilter]);

  /* =========================
     SELECTED DATE INTERVIEWS
  ========================= */

  const selectedInterviews = interviews.filter(
    (interview) => interview.date === selectedDate,
  );

  /* =========================
     CALENDAR HELPERS
  ========================= */

  const hasInterview = (date) => {
    return interviews.some((interview) => interview.date === date);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  /* =========================
     FORM HANDLERS
  ========================= */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSchedule = () => {
    if (
      !formData.name ||
      !formData.role ||
      !formData.date ||
      !formData.time ||
      !formData.type ||
      !formData.interviewer
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const dateObject = new Date(`${formData.date}T00:00:00`);

    const newInterview = {
      id: Date.now(),

      date: dateObject.getDate(),

      name: formData.name,

      role: formData.role,

      time: formData.time,

      type: formData.type,

      status: formData.status,

      interviewer: formData.interviewer,

      meetingLink: formData.meetingLink || "https://meet.google.com/",
    };

    setInterviews((prev) => [...prev, newInterview]);

    setSelectedDate(dateObject.getDate());

    setCurrentMonth(
      new Date(dateObject.getFullYear(), dateObject.getMonth(), 1),
    );

    setFormData(emptyForm);

    setOpenSchedule(false);
  };

  /* =========================
     DELETE INTERVIEW
  ========================= */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?",
    );

    if (!confirmed) return;

    setInterviews((prev) => prev.filter((interview) => interview.id !== id));

    setOpenDetails(false);
  };

  /* =========================
     OPEN DETAILS
  ========================= */

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);

    setOpenDetails(true);
  };

  /* =========================
     OPEN RESCHEDULE
  ========================= */

  const handleOpenReschedule = (interview) => {
    setSelectedInterview(interview);

    setFormData({
      name: interview.name,
      role: interview.role,
      date: `2026-08-${String(interview.date).padStart(2, "0")}`,
      time: interview.time,
      type: interview.type,
      interviewer: interview.interviewer,
      meetingLink: interview.meetingLink,
      status: interview.status,
    });

    setOpenReschedule(true);
  };

  /* =========================
     RESCHEDULE
  ========================= */

  const handleReschedule = () => {
    if (!selectedInterview) return;

    const dateObject = new Date(`${formData.date}T00:00:00`);

    setInterviews((prev) =>
      prev.map((interview) =>
        interview.id === selectedInterview.id
          ? {
              ...interview,

              date: dateObject.getDate(),

              time: formData.time,

              name: formData.name,

              role: formData.role,

              type: formData.type,

              interviewer: formData.interviewer,

              meetingLink: formData.meetingLink,
            }
          : interview,
      ),
    );

    setSelectedDate(dateObject.getDate());

    setCurrentMonth(
      new Date(dateObject.getFullYear(), dateObject.getMonth(), 1),
    );

    setOpenReschedule(false);

    setSelectedInterview(null);
  };

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
          PAGE HEADER
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
                xs: "30px",
                md: "34px",
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
              fontSize: "15px",
              color: "#94a3b8",
            }}
          >
            Manage, schedule and track candidate interviews.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setOpenSchedule(true)}
          sx={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            boxShadow: "none",

            "&:hover": {
              background: "linear-gradient(135deg, #5859e8, #7c4ee8)",
              boxShadow: "none",
            },
          }}
        >
          Schedule Interview
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
        }}
      >
        {[
          ["Upcoming", "12", "This week", "#60a5fa"],
          ["Today", "3", "Next: 10:30 AM", "#34d399"],
          ["Completed", "28", "This month", "#a78bfa"],
          ["Needs Action", "4", "Pending", "#f59e0b"],
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
                fontSize: "14px",
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                color: "#f8fafc",
                fontSize: "30px",
                fontWeight: 700,
              }}
            >
              {number}
            </Typography>

            <Typography
              sx={{
                color,
                fontSize: "13px",
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
            minWidth: 140,

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
        </TextField>

        <TextField
          select
          size="small"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{
            minWidth: 160,

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

        <TextField
          select
          size="small"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          sx={{
            minWidth: 130,

            "& .MuiOutlinedInput-root": {
              color: "#e2e8f0",
              backgroundColor: "#111827",
              borderRadius: 2,
            },
          }}
        >
          <MenuItem value="All">All Dates</MenuItem>

          {Array.from({ length: 31 }, (_, index) => index + 1).map((date) => (
            <MenuItem key={date} value={date}>
              Aug {date}
            </MenuItem>
          ))}
        </TextField>

        {/* View Toggle */}

        <Box
          sx={{
            display: "flex",
            backgroundColor: "#111827",
            border: "1px solid #334155",
            borderRadius: 2,
            overflow: "hidden",
            ml: {
              xs: 0,
              lg: "auto",
            },
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
            List View
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
              fontSize: "20px",
              fontWeight: 600,
              color: "#f8fafc",
            }}
          >
            Next Interview ⭐
          </Typography>

          <Box
            sx={{
              px: 1.5,
              py: 0.6,
              borderRadius: 2,
              backgroundColor: "#124e35",
              color: "#65e6a0",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Confirmed
          </Box>
        </Box>

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
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              RS
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#f8fafc",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                Rahul Sharma
              </Typography>

              <Typography
                sx={{
                  color: "#a5b4fc",
                  fontSize: "14px",
                }}
              >
                Backend Developer
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
                  fontSize: "12px",
                }}
              >
                Technical Interview
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#e2e8f0",
                fontSize: "14px",
              }}
            >
              📅 Today, 10:30 AM
            </Typography>

            <Typography
              sx={{
                color: "#e2e8f0",
                fontSize: "14px",
              }}
            >
              🎥 Google Meet
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              👥 Samrat Ashwin + 2 Interviewers
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Join Interview
            </Button>

            <Button
              variant="outlined"
              onClick={() =>
                navigate(`/applicant/interviews/details/${interviews[1].id}`)
              }
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
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#f8fafc",
                }}
              >
                Upcoming Interviews
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "14px",
                  color: "#94a3b8",
                }}
              >
                Your scheduled candidate interviews.
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "13px",
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
                      fontSize: "15px",
                      fontWeight: 600,
                    }}
                  >
                    {interview.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "13px",
                    }}
                  >
                    {interview.role}
                  </Typography>
                </Box>

                {/* Date / Time */}

                <Box>
                  <Typography
                    sx={{
                      color: "#e2e8f0",
                      fontSize: "13px",
                    }}
                  >
                    📅 {interview.date} Aug 2026
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "13px",
                    }}
                  >
                    🕐 {interview.time}
                  </Typography>
                </Box>

                {/* Type */}

                <Typography
                  sx={{
                    color: "#cbd5e1",
                    fontSize: "13px",
                  }}
                >
                  {interview.type}
                </Typography>

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
                      backgroundColor:
                        interview.status === "Pending" ? "#422006" : "#124e35",
                      color:
                        interview.status === "Pending" ? "#fbbf24" : "#65e6a0",
                      fontSize: "12px",
                      fontWeight: 600,
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
                  fontSize: "18px",
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

            {/* Week days */}

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
                    fontSize: "11px",
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
                          fontSize: "13px",
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

          {/* Selected day */}

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
                fontSize: "18px",
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
                  }}
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
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {interview.time}
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          interview.status === "Pending"
                            ? "#f59e0b"
                            : "#65e6a0",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {interview.status}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontSize: "14px",
                      fontWeight: 600,
                      mt: 1,
                    }}
                  >
                    {interview.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    {interview.type}
                  </Typography>
                </Box>
              ))
            )}

            <Button
              fullWidth
              onClick={() => setOpenSchedule(true)}
              sx={{
                mt: 1,
                color: "#818cf8",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              + Schedule Interview
            </Button>
          </Box>
        </Box>
      )}

      {/* =====================================================
          SCHEDULE INTERVIEW DIALOG
      ===================================================== */}

      <Dialog
        open={openSchedule}
        onClose={() => setOpenSchedule(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Schedule Interview</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            required
            label="Candidate Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            label="Job Role"
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            margin="normal"
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
            InputLabelProps={{
              shrink: true,
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
            InputLabelProps={{
              shrink: true,
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
          />

          <TextField
            fullWidth
            label="Meeting Link"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleFormChange}
            margin="normal"
          />

          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleFormChange}
            margin="normal"
          >
            <MenuItem value="Scheduled">Scheduled</MenuItem>

            <MenuItem value="Confirmed">Confirmed</MenuItem>

            <MenuItem value="Pending">Pending</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setFormData(emptyForm);
              setOpenSchedule(false);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSchedule}
            sx={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            }}
          >
            Schedule Interview
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          VIEW DETAILS DIALOG
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
                fontSize: "22px",
                fontWeight: 700,
                mb: 1,
              }}
            >
              {selectedInterview.name}
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                mb: 3,
              }}
            >
              {selectedInterview.role}
            </Typography>

            <Typography>📅 {selectedInterview.date} Aug 2026</Typography>

            <Typography sx={{ mt: 1 }}>🕐 {selectedInterview.time}</Typography>

            <Typography sx={{ mt: 1 }}>💼 {selectedInterview.type}</Typography>

            <Typography sx={{ mt: 1 }}>
              👤 {selectedInterview.interviewer}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              📌 {selectedInterview.status}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                wordBreak: "break-all",
              }}
            >
              🔗 {selectedInterview.meetingLink}
            </Typography>
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

              <Button variant="contained" onClick={() => setOpenDetails(false)}>
                Close
              </Button>
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
          <TextField
            fullWidth
            label="Candidate Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Job Role"
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            margin="normal"
          />

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
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenReschedule(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleReschedule}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Interviews;
