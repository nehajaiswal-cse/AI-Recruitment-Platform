import { useMemo, useState } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  Snackbar,
  Alert,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const Candidates = () => {
  /* ================= STATES ================= */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [jobFilter, setJobFilter] = useState("All Jobs");
  const [experienceFilter, setExperienceFilter] =
    useState("All Experience");

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 2;

  const [candidates, setCandidates] = useState([
    {
      name: "pawan Sharma",
      email: "pawan.sharma@email.com",
      role: "Backend Developer",
      skills: "Node.js, Express, MongoDB",
      experience: "3.2 Years",
      status: "Under Review",
      applied: "20 Aug 2026",
      initials: "RS",
    },
    {
      name: "Priya Singh",
      email: "priya.singh@email.com",
      role: "Frontend Developer",
      skills: "React, JavaScript, Tailwind",
      experience: "2.5 Years",
      status: "Shortlisted",
      applied: "19 Aug 2026",
      initials: "PS",
    },
    {
      name: "Amit Kumar",
      email: "amit.kumar@email.com",
      role: "Full Stack Developer",
      skills: "MERN Stack",
      experience: "4.1 Years",
      status: "Hired",
      applied: "18 Aug 2026",
      initials: "AK",
    },
    {
      name: "Sneha Sharma",
      email: "sneha.sharma@email.com",
      role: "UI/UX Designer",
      skills: "Figma, Adobe XD",
      experience: "2.0 Years",
      status: "Under Review",
      applied: "17 Aug 2026",
      initials: "SS",
    },
    {
      name: "Rohit Kumar",
      email: "rohit.kumar@email.com",
      role: "DevOps Engineer",
      skills: "AWS, Docker, Kubernetes",
      experience: "3.6 Years",
      status: "Shortlisted",
      applied: "16 Aug 2026",
      initials: "RK",
    },
    {
      name: "Vikram Joshi",
      email: "vikram.joshi@email.com",
      role: "Backend Developer",
      skills: "Python, Django, PostgreSQL",
      experience: "2.8 Years",
      status: "Rejected",
      applied: "15 Aug 2026",
      initials: "VK",
    },
  ]);

  /* ================= ADD CANDIDATE ================= */

  const [openAddCandidate, setOpenAddCandidate] = useState(false);

  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    role: "",
    skills: "",
    experience: "",
  });

  /* ================= VIEW CANDIDATE ================= */

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openView, setOpenView] = useState(false);

  /* ================= ACTION MENU ================= */

  const [actionAnchor, setActionAnchor] = useState(null);
  const [actionCandidate, setActionCandidate] = useState(null);

  /* ================= SNACKBAR ================= */

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ================= FILTER ================= */

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        candidate.name.toLowerCase().includes(searchValue) ||
        candidate.email.toLowerCase().includes(searchValue) ||
        candidate.role.toLowerCase().includes(searchValue) ||
        candidate.skills.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" ||
        candidate.status === statusFilter;

      const matchesJob =
        jobFilter === "All Jobs" ||
        candidate.role === jobFilter;

      const experience = parseFloat(candidate.experience);

      const matchesExperience =
        experienceFilter === "All Experience" ||
        (experienceFilter === "0-2" && experience <= 2) ||
        (experienceFilter === "2-4" &&
          experience > 2 &&
          experience <= 4) ||
        (experienceFilter === "4+" && experience > 4);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesJob &&
        matchesExperience
      );
    });
  }, [
    candidates,
    search,
    statusFilter,
    jobFilter,
    experienceFilter,
  ]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCandidates.length / candidatesPerPage)
  );

  const startIndex =
    (currentPage - 1) * candidatesPerPage;

  const paginatedCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + candidatesPerPage
  );

  /* ================= RESET PAGE ================= */

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleJobFilter = (value) => {
    setJobFilter(value);
    setCurrentPage(1);
  };

  const handleExperienceFilter = (value) => {
    setExperienceFilter(value);
    setCurrentPage(1);
  };

  /* ================= STATUS STYLE ================= */

  const getStatusStyle = (status) => {
    if (status === "Hired") {
      return {
        backgroundColor: "#124e35",
        color: "#65e6a0",
      };
    }

    if (status === "Shortlisted") {
      return {
        backgroundColor: "#312e81",
        color: "#a5b4fc",
      };
    }

    if (status === "Rejected") {
      return {
        backgroundColor: "#451a1a",
        color: "#f87171",
      };
    }

    return {
      backgroundColor: "#422006",
      color: "#fbbf24",
    };
  };

  /* ================= ADD CANDIDATE ================= */

  const handleAddCandidate = () => {
    if (
      !newCandidate.name ||
      !newCandidate.email ||
      !newCandidate.role
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields.",
        severity: "warning",
      });

      return;
    }

    const initials = newCandidate.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const candidate = {
      ...newCandidate,
      experience:
        newCandidate.experience || "0 Years",
      status: "Under Review",
      applied: "18 Aug 2026",
      initials,
    };

    setCandidates((prev) => [candidate, ...prev]);

    setNewCandidate({
      name: "",
      email: "",
      role: "",
      skills: "",
      experience: "",
    });

    setOpenAddCandidate(false);
    setCurrentPage(1);

    setSnackbar({
      open: true,
      message: "Candidate added successfully.",
      severity: "success",
    });
  };

  /* ================= VIEW ================= */

  const handleView = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenView(true);
  };

  /* ================= EMAIL ================= */

  const handleEmail = (candidate) => {
    setSnackbar({
      open: true,
      message: `Email action opened for ${candidate.name}.`,
      severity: "info",
    });
  };

  /* ================= MORE ACTION ================= */

  const handleMore = (event, candidate) => {
    setActionAnchor(event.currentTarget);
    setActionCandidate(candidate);
  };

  const closeActionMenu = () => {
    setActionAnchor(null);
    setActionCandidate(null);
  };

  const updateCandidateStatus = (status) => {
    if (!actionCandidate) return;

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.email === actionCandidate.email
          ? { ...candidate, status }
          : candidate
      )
    );

    setSnackbar({
      open: true,
      message: `${actionCandidate.name} marked as ${status}.`,
      severity: "success",
    });

    closeActionMenu();
  };

  /* ================= RETURN ================= */

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
      {/* ================= PAGE HEADER ================= */}

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
              letterSpacing: "-0.5px",
            }}
          >
            Candidates
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: "15px",
              color: "#94a3b8",
            }}
          >
            Manage and track candidates who applied for your jobs.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setOpenAddCandidate(true)}
          sx={{
            background:
              "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            boxShadow: "none",

            "&:hover": {
              background:
                "linear-gradient(135deg, #5859e8, #7c4ee8)",
              boxShadow: "none",
            },
          }}
        >
          Add Candidate
        </Button>
      </Box>

      {/* ================= STATS ================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(5, 1fr)",
          },
          gap: 2,
        }}
      >
        {/* TOTAL */}

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
              alignItems: "center",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#312e81",
                color: "#a5b4fc",
              }}
            >
              <PeopleAltOutlinedIcon />
            </Box>

            <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
              Total Candidates
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#f8fafc",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            256
          </Typography>

          <Typography
            sx={{
              color: "#34d399",
              fontSize: "13px",
              mt: 0.5,
            }}
          >
            +12 this week
          </Typography>
        </Box>

        {/* UNDER REVIEW */}

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
              alignItems: "center",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#172554",
                color: "#60a5fa",
              }}
            >
              <AccessTimeRoundedIcon />
            </Box>

            <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
              Under Review
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#f8fafc",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            64
          </Typography>

          <Typography
            sx={{
              color: "#60a5fa",
              fontSize: "13px",
              mt: 0.5,
            }}
          >
            25% of total
          </Typography>
        </Box>

        {/* SHORTLISTED */}

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
              alignItems: "center",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#312e81",
                color: "#a78bfa",
              }}
            >
              <PersonAddAltRoundedIcon />
            </Box>

            <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
              Shortlisted
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#f8fafc",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            38
          </Typography>

          <Typography
            sx={{
              color: "#a78bfa",
              fontSize: "13px",
              mt: 0.5,
            }}
          >
            15% of total
          </Typography>
        </Box>

        {/* HIRED */}

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
              alignItems: "center",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#124e35",
                color: "#65e6a0",
              }}
            >
              <CheckCircleOutlineRoundedIcon />
            </Box>

            <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
              Hired
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#f8fafc",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            18
          </Typography>

          <Typography
            sx={{
              color: "#34d399",
              fontSize: "13px",
              mt: 0.5,
            }}
          >
            7% of total
          </Typography>
        </Box>

        {/* REJECTED */}

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
              alignItems: "center",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#451a1a",
                color: "#f87171",
              }}
            >
              <CancelOutlinedIcon />
            </Box>

            <Typography sx={{ color: "#94a3b8", fontSize: "14px" }}>
              Rejected
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#f8fafc",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            136
          </Typography>

          <Typography
            sx={{
              color: "#f87171",
              fontSize: "13px",
              mt: 0.5,
            }}
          >
            53% of total
          </Typography>
        </Box>
      </Box>

      {/* ================= SEARCH & FILTERS ================= */}

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
        {/* SEARCH */}

        <TextField
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search candidate, email, skills..."
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

        {/* JOB */}

        <TextField
          select
          value={jobFilter}
          onChange={(e) => handleJobFilter(e.target.value)}
          size="small"
          sx={{
            minWidth: 145,

            "& .MuiOutlinedInput-root": {
              color: "#e2e8f0",
              backgroundColor: "#111827",
              borderRadius: 2,

              "& fieldset": {
                borderColor: "#334155",
              },
            },
          }}
        >
          <MenuItem value="All Jobs">All Jobs</MenuItem>
          <MenuItem value="Backend Developer">
            Backend Developer
          </MenuItem>
          <MenuItem value="Frontend Developer">
            Frontend Developer
          </MenuItem>
          <MenuItem value="Full Stack Developer">
            Full Stack Developer
          </MenuItem>
          <MenuItem value="UI/UX Designer">
            UI/UX Designer
          </MenuItem>
          <MenuItem value="DevOps Engineer">
            DevOps Engineer
          </MenuItem>
        </TextField>

        {/* STATUS */}

        <TextField
          select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          size="small"
          sx={{
            minWidth: 135,

            "& .MuiOutlinedInput-root": {
              color: "#e2e8f0",
              backgroundColor: "#111827",
              borderRadius: 2,

              "& fieldset": {
                borderColor: "#334155",
              },
            },
          }}
        >
          <MenuItem value="All Status">All Status</MenuItem>
          <MenuItem value="Under Review">Under Review</MenuItem>
          <MenuItem value="Shortlisted">Shortlisted</MenuItem>
          <MenuItem value="Hired">Hired</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </TextField>

        {/* EXPERIENCE */}

        <TextField
          select
          value={experienceFilter}
          onChange={(e) =>
            handleExperienceFilter(e.target.value)
          }
          size="small"
          sx={{
            minWidth: 145,

            "& .MuiOutlinedInput-root": {
              color: "#e2e8f0",
              backgroundColor: "#111827",
              borderRadius: 2,

              "& fieldset": {
                borderColor: "#334155",
              },
            },
          }}
        >
          <MenuItem value="All Experience">
            All Experience
          </MenuItem>
          <MenuItem value="0-2">0 - 2 Years</MenuItem>
          <MenuItem value="2-4">2 - 4 Years</MenuItem>
          <MenuItem value="4+">4+ Years</MenuItem>
        </TextField>

        {/* MORE FILTERS */}

        <Button
          variant="outlined"
          onClick={() =>
            setShowMoreFilters((prev) => !prev)
          }
          endIcon={
            <KeyboardArrowDownRoundedIcon
              sx={{
                transform: showMoreFilters
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            />
          }
          sx={{
            height: 40,
            color: "#e2e8f0",
            borderColor: "#334155",
            backgroundColor: "#111827",
            textTransform: "none",
            borderRadius: 2,

            "&:hover": {
              borderColor: "#6366f1",
              backgroundColor: "#182235",
            },
          }}
        >
          More Filters
        </Button>

        {/* EXTRA FILTERS */}

        {showMoreFilters && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              pt: 1,
              borderTop: "1px solid #334155",
            }}
          >
            <TextField
              select
              size="small"
              defaultValue="All Sources"
              sx={{
                minWidth: 150,
                "& .MuiOutlinedInput-root": {
                  color: "#e2e8f0",
                  backgroundColor: "#111827",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "#334155",
                  },
                },
              }}
            >
              <MenuItem value="All Sources">
                All Sources
              </MenuItem>
              <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              <MenuItem value="Referral">Referral</MenuItem>
              <MenuItem value="Website">Website</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              defaultValue="Any Date"
              sx={{
                minWidth: 150,
                "& .MuiOutlinedInput-root": {
                  color: "#e2e8f0",
                  backgroundColor: "#111827",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "#334155",
                  },
                },
              }}
            >
              <MenuItem value="Any Date">Any Date</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="This Week">This Week</MenuItem>
              <MenuItem value="This Month">This Month</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              onClick={() => {
                setSearch("");
                setStatusFilter("All Status");
                setJobFilter("All Jobs");
                setExperienceFilter("All Experience");
                setCurrentPage(1);
              }}
              sx={{
                color: "#f87171",
                borderColor: "#451a1a",
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Box>

      {/* ================= CANDIDATES LIST ================= */}

      <Box
        sx={{
          mt: 3,
          borderRadius: 3,
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            p: {
              xs: 2,
              md: 2.5,
            },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#f8fafc",
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              All Candidates
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "13px",
                mt: 0.4,
              }}
            >
              Review and manage candidate applications.
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#818cf8",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {filteredCandidates.length} Candidates
          </Typography>
        </Box>

        {/* TABLE HEADER */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "grid",
            },
            gridTemplateColumns:
              "1.7fr 1.5fr 1fr 1fr 1fr 0.8fr",
            px: 2.5,
            py: 1.5,
            backgroundColor: "#172033",
            borderTop: "1px solid #334155",
            borderBottom: "1px solid #334155",
          }}
        >
          {[
            "Candidate",
            "Job Applied",
            "Experience",
            "Status",
            "Applied On",
            "Actions",
          ].map((heading) => (
            <Typography
              key={heading}
              sx={{
                color: "#64748b",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {heading}
            </Typography>
          ))}
        </Box>

        {/* CANDIDATE ROWS */}

        {paginatedCandidates.map((candidate) => (
          <Box
            key={candidate.email}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1.7fr 1.5fr 1fr 1fr 1fr 0.8fr",
              },
              gap: {
                xs: 1.5,
                md: 0,
              },
              alignItems: "center",
              px: 2.5,
              py: 2,
              borderBottom: "1px solid #263449",

              "&:hover": {
                backgroundColor: "#182235",
              },
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
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {candidate.initials}
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#f8fafc",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {candidate.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "12px",
                    mt: 0.3,
                  }}
                >
                  {candidate.email}
                </Typography>
              </Box>
            </Box>

            {/* Job */}

            <Box>
              <Typography
                sx={{
                  color: "#e2e8f0",
                  fontSize: "13px",
                }}
              >
                {candidate.role}
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: "12px",
                  mt: 0.4,
                }}
              >
                {candidate.skills}
              </Typography>
            </Box>

            {/* Experience */}

            <Typography
              sx={{
                color: "#cbd5e1",
                fontSize: "13px",
              }}
            >
              {candidate.experience}
            </Typography>

            {/* Status */}

            <Box
              sx={{
                justifySelf: {
                  md: "start",
                },
                display: "inline-flex",
                width: "fit-content",
                px: 1.2,
                py: 0.6,
                borderRadius: 2,
                fontSize: "11px",
                fontWeight: 600,
                ...getStatusStyle(candidate.status),
              }}
            >
              {candidate.status}
            </Box>

            {/* Applied */}

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              {candidate.applied}
            </Typography>

            {/* ACTIONS */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {/* VIEW */}

              <Button
                size="small"
                onClick={() => handleView(candidate)}
                sx={{
                  minWidth: 32,
                  width: 32,
                  color: "#94a3b8",
                  p: 0.5,

                  "&:hover": {
                    color: "#818cf8",
                    backgroundColor: "#182235",
                  },
                }}
              >
                <VisibilityOutlinedIcon fontSize="small" />
              </Button>

              {/* EMAIL */}

              <Button
                size="small"
                onClick={() => handleEmail(candidate)}
                sx={{
                  minWidth: 32,
                  width: 32,
                  color: "#94a3b8",
                  p: 0.5,

                  "&:hover": {
                    color: "#818cf8",
                    backgroundColor: "#182235",
                  },
                }}
              >
                <MailOutlineRoundedIcon fontSize="small" />
              </Button>

              {/* MORE */}

              <Button
                size="small"
                onClick={(event) =>
                  handleMore(event, candidate)
                }
                sx={{
                  minWidth: 32,
                  width: 32,
                  color: "#94a3b8",
                  p: 0.5,

                  "&:hover": {
                    color: "#818cf8",
                    backgroundColor: "#182235",
                  },
                }}
              >
                <MoreVertRoundedIcon fontSize="small" />
              </Button>
            </Box>
          </Box>
        ))}

        {/* EMPTY */}

        {filteredCandidates.length === 0 && (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              No candidates found.
            </Typography>
          </Box>
        )}

        {/* ================= PAGINATION ================= */}

        {filteredCandidates.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              py: 2.5,
            }}
          >
            {/* PREVIOUS */}

            <Button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
              sx={{
                minWidth: 36,
                width: 36,
                height: 36,
                color:
                  currentPage === 1
                    ? "#334155"
                    : "#94a3b8",
              }}
            >
              <ArrowBackIosNewRoundedIcon
                sx={{ fontSize: 14 }}
              />
            </Button>

            {/* PAGE NUMBERS */}

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                sx={{
                  minWidth: 36,
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  color:
                    currentPage === page
                      ? "#fff"
                      : "#94a3b8",
                  backgroundColor:
                    currentPage === page
                      ? "#6366f1"
                      : "transparent",

                  "&:hover": {
                    backgroundColor:
                      currentPage === page
                        ? "#6366f1"
                        : "#182235",
                  },
                }}
              >
                {page}
              </Button>
            ))}

            {/* NEXT */}

            <Button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              sx={{
                minWidth: 36,
                width: 36,
                height: 36,
                color:
                  currentPage === totalPages
                    ? "#334155"
                    : "#94a3b8",
              }}
            >
              <ArrowForwardIosRoundedIcon
                sx={{ fontSize: 14 }}
              />
            </Button>
          </Box>
        )}
      </Box>

      {/* ================= ADD CANDIDATE DIALOG ================= */}

      <Dialog
        open={openAddCandidate}
        onClose={() => setOpenAddCandidate(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "#1e293b",
            color: "#fff",
            border: "1px solid #334155",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#f8fafc",
            fontWeight: 700,
          }}
        >
          Add Candidate
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Candidate Name *"
              value={newCandidate.name}
              onChange={(e) =>
                setNewCandidate({
                  ...newCandidate,
                  name: e.target.value,
                })
              }
              fullWidth
            />

            <TextField
              label="Email *"
              type="email"
              value={newCandidate.email}
              onChange={(e) =>
                setNewCandidate({
                  ...newCandidate,
                  email: e.target.value,
                })
              }
              fullWidth
            />

            <TextField
              select
              label="Job Role *"
              value={newCandidate.role}
              onChange={(e) =>
                setNewCandidate({
                  ...newCandidate,
                  role: e.target.value,
                })
              }
              fullWidth
            >
              <MenuItem value="Backend Developer">
                Backend Developer
              </MenuItem>
              <MenuItem value="Frontend Developer">
                Frontend Developer
              </MenuItem>
              <MenuItem value="Full Stack Developer">
                Full Stack Developer
              </MenuItem>
              <MenuItem value="UI/UX Designer">
                UI/UX Designer
              </MenuItem>
              <MenuItem value="DevOps Engineer">
                DevOps Engineer
              </MenuItem>
            </TextField>

            <TextField
              label="Skills"
              placeholder="React, Node.js, MongoDB..."
              value={newCandidate.skills}
              onChange={(e) =>
                setNewCandidate({
                  ...newCandidate,
                  skills: e.target.value,
                })
              }
              fullWidth
            />

            <TextField
              label="Experience"
              placeholder="3.5 Years"
              value={newCandidate.experience}
              onChange={(e) =>
                setNewCandidate({
                  ...newCandidate,
                  experience: e.target.value,
                })
              }
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setOpenAddCandidate(false)}
            sx={{
              color: "#94a3b8",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddCandidate}
            sx={{
              background:
                "linear-gradient(135deg, #6366f1, #8b5cf6)",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add Candidate
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= VIEW CANDIDATE ================= */}

      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "#1e293b",
            color: "#fff",
            border: "1px solid #334155",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#f8fafc",
            fontWeight: 700,
          }}
        >
          Candidate Details
        </DialogTitle>

        <DialogContent>
          {selectedCandidate && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {selectedCandidate.initials}
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {selectedCandidate.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: 13,
                    }}
                  >
                    {selectedCandidate.email}
                  </Typography>
                </Box>
              </Box>

              {[
                ["Job Role", selectedCandidate.role],
                ["Skills", selectedCandidate.skills],
                [
                  "Experience",
                  selectedCandidate.experience,
                ],
                ["Status", selectedCandidate.status],
                ["Applied On", selectedCandidate.applied],
              ].map(([label, value]) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    py: 1.2,
                    borderBottom:
                      "1px solid #334155",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 13,
                    }}
                  >
                    {label}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#e2e8f0",
                      fontSize: 13,
                      textAlign: "right",
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setOpenView(false)}
            sx={{
              color: "#818cf8",
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= ACTION MENU ================= */}

      <Menu
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={closeActionMenu}
        PaperProps={{
          sx: {
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            color: "#e2e8f0",
          },
        }}
      >
        <MenuItem
          onClick={() =>
            updateCandidateStatus("Shortlisted")
          }
        >
          Shortlist Candidate
        </MenuItem>

        <MenuItem
          onClick={() =>
            updateCandidateStatus("Hired")
          }
        >
          Mark as Hired
        </MenuItem>

        <MenuItem
          onClick={() =>
            updateCandidateStatus("Rejected")
          }
        >
          Reject Candidate
        </MenuItem>

        <MenuItem
          onClick={() =>
            updateCandidateStatus("Under Review")
          }
        >
          Move to Under Review
        </MenuItem>
      </Menu>

      {/* ================= SNACKBAR ================= */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar({
              ...snackbar,
              open: false,
            })
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Candidates;