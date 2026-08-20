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
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const API_URL = "http://localhost:5000";

const Interviews = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [typeFilter, setTypeFilter] = useState("All");

  const [openSchedule, setOpenSchedule] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);

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
    duration: "45 min",
  };

  const [formData, setFormData] = useState(emptyForm);

  /* =====================================================
     GET TOKEN
  ===================================================== */

  const getToken = () => {
    return localStorage.getItem("token");
  };

  /* =====================================================
     FETCH RECRUITER INTERVIEWS
  ===================================================== */

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/interviews/recruiter`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Recruiter interviews:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch interviews"
        );
      }

      setInterviews(data.interviews || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD INTERVIEWS
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
     SCHEDULE INTERVIEW
  ===================================================== */

  const handleSchedule = async () => {
    if (
      !formData.candidate ||
      !formData.job ||
      !formData.date ||
      !formData.time ||
      !formData.type ||
      !formData.interviewer
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/interviews`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            candidate: formData.candidate,
            job: formData.job,
            date: formData.date,
            time: formData.time,
            type: formData.type,
            interviewer: formData.interviewer,
            meetingLink:
              formData.meetingLink ||
              "https://meet.google.com/example",
            duration: formData.duration,
          }),
        }
      );

      const data = await response.json();

      console.log("Schedule response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to schedule interview"
        );
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
     FILTER
  ===================================================== */

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const candidateName =
        interview.candidate?.name || "";

      const candidateEmail =
        interview.candidate?.email || "";

      const jobTitle =
        interview.job?.title || "";

      const interviewer =
        interview.interviewer || "";

      const searchValue = search.toLowerCase();

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
        interview.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        interview.type === typeFilter;

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

  /* =====================================================
     STATS
  ===================================================== */

  const upcomingCount = interviews.filter(
    (item) =>
      item.status === "Scheduled" ||
      item.status === "Confirmed"
  ).length;

  const confirmedCount = interviews.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const completedCount = interviews.filter(
    (item) => item.status === "Completed"
  ).length;

  const pendingCount = interviews.filter(
    (item) =>
      item.status === "Pending"
  ).length;

  /* =====================================================
     NEXT INTERVIEW
  ===================================================== */

  const nextInterview = useMemo(() => {
    return [...interviews]
      .filter(
        (interview) =>
          interview.status === "Scheduled" ||
          interview.status === "Confirmed"
      )
      .sort(
        (a, b) =>
          new Date(a.date) - new Date(b.date)
      )[0];
  }, [interviews]);

  /* =====================================================
     FORMAT DATE
  ===================================================== */

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

  /* =====================================================
     VIEW DETAILS
  ===================================================== */

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
    setOpenDetails(true);
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
     UI
  ===================================================== */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
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
              color: "#f8fafc",
            }}
          >
            Interviews
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#94a3b8",
              fontSize: 15,
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
            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            boxShadow: "none",
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
            backgroundColor: "#450a0a",
            border: "1px solid #7f1d1d",
          }}
        >
          <Typography
            sx={{
              color: "#fca5a5",
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
          mb: 3,
        }}
      >
        <StatCard
          title="Upcoming"
          value={upcomingCount}
          subtitle="Scheduled / Confirmed"
          color="#60a5fa"
        />

        <StatCard
          title="Confirmed"
          value={confirmedCount}
          subtitle="Confirmed interviews"
          color="#34d399"
        />

        <StatCard
          title="Completed"
          value={completedCount}
          subtitle="Completed interviews"
          color="#a78bfa"
        />

        <StatCard
          title="Needs Action"
          value={pendingCount}
          subtitle="Pending interviews"
          color="#f59e0b"
        />
      </Box>

      {/* =================================================
          SEARCH
      ================================================= */}

      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          backgroundColor: "#172033",
          border: "1px solid #334155",
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          alignItems: "center",
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
              color: "#f8fafc",
              backgroundColor: "#111827",
              borderRadius: 2,

              "& fieldset": {
                borderColor: "#334155",
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
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          sx={{
            minWidth: 150,

            "& .MuiOutlinedInput-root": {
              color: "#e2e8f0",
              backgroundColor: "#111827",
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
        </TextField>

        <TextField
          select
          size="small"
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
          sx={{
            minWidth: 170,

            "& .MuiOutlinedInput-root": {
              color: "#e2e8f0",
              backgroundColor: "#111827",
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
      </Box>

      {/* =================================================
          NEXT INTERVIEW
      ================================================= */}

      <Box
        sx={{
          mb: 3,
          p: {
            xs: 2,
            md: 3,
          },
          borderRadius: 3,
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            mb: 3,
          }}
        >
          Next Interview ⭐
        </Typography>

        {nextInterview ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1.3fr 1fr auto",
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
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {(nextInterview.candidate?.name ||
                  "NA")
                  .substring(0, 2)
                  .toUpperCase()}
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  {nextInterview.candidate?.name ||
                    "Unknown Candidate"}
                </Typography>

                <Typography
                  sx={{
                    color: "#a5b4fc",
                    fontSize: 14,
                  }}
                >
                  {nextInterview.job?.title ||
                    "Unknown Job"}
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

            {/* Date */}

            <Box>
              <Typography sx={{ fontSize: 14 }}>
                📅 {formatDate(nextInterview.date)}
              </Typography>

              <Typography sx={{ fontSize: 14 }}>
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

            {/* Action */}

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                href={nextInterview.meetingLink}
                target="_blank"
                rel="noreferrer"
                startIcon={
                  <VideoCameraFrontRoundedIcon />
                }
                sx={{
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  textTransform: "none",
                  boxShadow: "none",
                }}
              >
                Join Interview
              </Button>

              <Button
                variant="outlined"
                onClick={() =>
                  handleViewDetails(nextInterview)
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
        ) : (
          <Typography
            sx={{
              color: "#94a3b8",
            }}
          >
            No upcoming interviews.
          </Typography>
        )}
      </Box>

      {/* =================================================
          INTERVIEW LIST
      ================================================= */}

      <Box
        sx={{
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
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Upcoming Interviews
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#94a3b8",
                fontSize: 14,
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

        {loading ? (
          <Typography
            sx={{
              color: "#94a3b8",
              textAlign: "center",
              py: 5,
            }}
          >
            Loading interviews...
          </Typography>
        ) : filteredInterviews.length === 0 ? (
          <Typography
            sx={{
              color: "#94a3b8",
              textAlign: "center",
              py: 5,
            }}
          >
            No interviews found.
          </Typography>
        ) : (
          filteredInterviews.map((interview) => (
            <Box
              key={interview._id}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1.5fr 1.2fr 1.2fr auto",
                },
                gap: 2,
                alignItems: "center",
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
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  {interview.candidate?.name ||
                    "Unknown Candidate"}
                </Typography>

                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: 13,
                  }}
                >
                  {interview.candidate?.email ||
                    ""}
                </Typography>

                <Typography
                  sx={{
                    color: "#a5b4fc",
                    fontSize: 13,
                  }}
                >
                  {interview.job?.title ||
                    "Unknown Job"}
                </Typography>
              </Box>

              {/* Date */}

              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                  }}
                >
                  📅 {formatDate(interview.date)}
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
                    fontSize: 13,
                    color: "#cbd5e1",
                  }}
                >
                  {interview.type}
                </Typography>

                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: 12,
                  }}
                >
                  👤 {interview.interviewer}
                </Typography>
              </Box>

              {/* Actions */}

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
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
                    handleViewDetails(interview)
                  }
                  sx={{
                    color: "#cbd5e1",
                    border: "1px solid #475569",
                    textTransform: "none",
                  }}
                >
                  View
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* =================================================
          SCHEDULE DIALOG
      ================================================= */}

      <Dialog
        open={openSchedule}
        onClose={() =>
          !submitting &&
          setOpenSchedule(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
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
            Enter the Candidate ID and Job ID from
            MongoDB/Postman.
          </Typography>

          <TextField
            fullWidth
            required
            label="Candidate ID"
            name="candidate"
            value={formData.candidate}
            onChange={handleFormChange}
            margin="normal"
            placeholder="e.g. 6a8158798be1a5ce140c2355"
          />

          <TextField
            fullWidth
            required
            label="Job ID"
            name="job"
            value={formData.job}
            onChange={handleFormChange}
            margin="normal"
            placeholder="e.g. 6a873283a6f8c70918405caf"
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
            placeholder="https://meet.google.com/..."
          />

          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleFormChange}
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button
            disabled={submitting}
            onClick={() => {
              setFormData(emptyForm);
              setOpenSchedule(false);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={submitting}
            onClick={handleSchedule}
            sx={{
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
            }}
          >
            {submitting
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
            justifyContent: "space-between",
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
              }}
            >
              {selectedInterview.candidate?.name ||
                "Unknown Candidate"}
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                mb: 3,
              }}
            >
              {selectedInterview.job?.title ||
                "Unknown Job"}
            </Typography>

            <Typography>
              📅 {formatDate(selectedInterview.date)}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              🕐 {selectedInterview.time}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              💼 {selectedInterview.type}
            </Typography>

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
              🔗{" "}
              {selectedInterview.meetingLink ||
                "No meeting link"}
            </Typography>
          </DialogContent>
        )}

        <DialogActions>
          <Button
            onClick={() =>
              setOpenDetails(false)
            }
          >
            Close
          </Button>

          {selectedInterview?.meetingLink && (
            <Button
              variant="contained"
              href={selectedInterview.meetingLink}
              target="_blank"
              rel="noreferrer"
              startIcon={
                <VideoCameraFrontRoundedIcon />
              }
            >
              Join Interview
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  title,
  value,
  subtitle,
  color,
}) => {
  return (
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
        {value}
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
  );
};

export default Interviews;