import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Card,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Avatar,
  LinearProgress,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import RNavbar from "../../components/layout/recruiter/Navbar";
import RSidebar from "../../components/layout/recruiter/Sidebar";

import { useCandidate } from "../../hooks/useCandidate";
import { getResumeUrl } from "../../api/resumeApi";

/* ---------------------------------------------------------
 * STYLES & SUB-COMPONENTS
 * --------------------------------------------------------- */

const selectStyle = {
  bgcolor: "#0b1425",
  borderRadius: 1.5,
  color: "white",
  height: 40,
  minWidth: 130,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#263249",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3b82f6",
  },
  "& .MuiSvgIcon-root": {
    color: "#738096",
  },
};

const paginationButton = {
  color: "#8c97ab",
  border: "1px solid #263249",
  borderRadius: 1.5,
  p: 0.8,
  "&:hover": {
    bgcolor: "#0b1425",
    color: "#fff",
  },
};

const pageNumber = {
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 1.5,
  bgcolor: "#6366f1",
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
};

const pageText = {
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 1.5,
  color: "#8c97ab",
  fontSize: 13,
  cursor: "pointer",
  "&:hover": {
    color: "#fff",
    bgcolor: "#0b1425",
  },
};

const DetailCard = ({ children, sx = {} }) => (
  <Card
    elevation={0}
    sx={{
      bgcolor: "#0b1425",
      border: "1px solid #1e293b",
      borderRadius: 2,
      p: 2.5,
      mb: 2,
      ...sx,
    }}
  >
    {children}
  </Card>
);

const CandidateRow = ({ candidate, rank, selected, onClick }) => {
  const applicant = candidate?.applicantId;
  const job = candidate?.jobId;
  const score = Number(candidate?.aiScore || 0);

  const getScoreColor = (val) => {
    if (val >= 80) return "#70d84a";
    if (val >= 60) return "#f4c542";
    return "#ff5d7d";
  };

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        bgcolor: selected ? "#0f172a" : "#060d1e",
        border: "1px solid",
        borderColor: selected ? "#6366f1" : "#172236",
        borderRadius: 2,
        p: 2,
        mb: 1.5,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#3b82f6",
          bgcolor: "#0f172a",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: "#64748b",
              width: 24,
            }}
          >
            #{rank}
          </Typography>

          <Avatar
            src={applicant?.profileImage || applicant?.avatar}
            sx={{ width: 44, height: 44, bgcolor: "#1e293b" }}
          >
            {(applicant?.name || applicant?.fullName || "C").charAt(0).toUpperCase()}
          </Avatar>

          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#f8fafc" }}>
              {applicant?.name || applicant?.fullName || "Unknown Candidate"}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#94a3b8", mt: 0.2 }}>
              {job?.title || "Role Not Specified"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 16,
              color: getScoreColor(score),
            }}
          >
            {score}%
          </Typography>

          <Chip
            label={candidate?.status || "Applied"}
            size="small"
            sx={{
              mt: 0.5,
              height: 20,
              fontSize: 11,
              bgcolor: "#1e293b",
              color: "#cbd5e1",
              textTransform: "capitalize",
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

/* ---------------------------------------------------------
 * MAIN COMPONENT
 * --------------------------------------------------------- */

function Candidate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const jobId = searchParams.get("jobId");
  const {
    candidates,
    loading,
    error,
    fetchCandidates,
    analyzeResume,
  } = useCandidate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  /* Filter Candidates Logic */
  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];

    return candidates.filter((candidate) => {
      const applicant = candidate.applicantId;
      const job = candidate.jobId;

      if (jobId && job?._id !== jobId) {
        return false;
      }

      const name = applicant?.name || applicant?.fullName || "";
      const email = applicant?.email || "";
      const jobTitle = job?.title || "";
      const searchText = search.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        jobTitle.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        candidate.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesJob = jobFilter === "all" || job?._id === jobFilter;

      const score = Number(candidate.aiScore || 0);
      let matchesScore = true;
      if (scoreFilter === "70") matchesScore = score >= 70;
      if (scoreFilter === "80") matchesScore = score >= 80;
      if (scoreFilter === "90") matchesScore = score >= 90;

      let matchesExperience = true;
      const experience =
        Number(
          applicant?.experience ||
            candidate.aiAnalysis?.experience ||
            0
        ) || 0;

      if (experienceFilter === "0-2") matchesExperience = experience <= 2;
      if (experienceFilter === "2-5")
        matchesExperience = experience > 2 && experience <= 5;
      if (experienceFilter === "5+") matchesExperience = experience > 5;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesJob &&
        matchesScore &&
        matchesExperience
      );
    });
  }, [
    candidates,
    search,
    statusFilter,
    jobFilter,
    scoreFilter,
    experienceFilter,
    jobId,
  ]);

  /* Unique Jobs for Filter */
  const jobs = useMemo(() => {
    if (!candidates) return [];

    const map = new Map();
    candidates.forEach((candidate) => {
      const job = candidate.jobId;
      if (job?._id && !map.has(job._id)) {
        map.set(job._id, job);
      }
    });

    return Array.from(map.values());
  }, [candidates]);

  /* Default select first candidate */
  useEffect(() => {
    if (filteredCandidates.length > 0 && !selectedCandidate) {
      setSelectedCandidate(filteredCandidates[0]);
    }
  }, [filteredCandidates, selectedCandidate]);

  /* Handlers */
  const handleAIAnalysis = async (candidate) => {
    try {
      if (!candidate?.applicationId) {
        console.error("Application ID missing");
        return;
      }

      const applicationId =
        typeof candidate.applicationId === "object"
          ? candidate.applicationId._id
          : candidate.applicationId;

      if (!applicationId) {
        console.error("Application ID not found");
        return;
      }

      setAnalyzingId(candidate._id);
      await analyzeResume(applicationId);
      await fetchCandidates();
    } catch (err) {
      console.error(
        "AI ANALYSIS ERROR:",
        err.response?.data || err.message
      );
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleScheduleInterview = (candidate) => {
    navigate("/recruiter/interviews", {
      state: { candidate },
    });
  };

  const handleViewResume = async (candidate) => {
    try {
      const applicationId =
        typeof candidate?.applicationId === "object"
          ? candidate.applicationId._id
          : candidate.applicationId;

      if (!applicationId) {
        alert("Application not found");
        return;
      }

      const data = await getResumeUrl(applicationId);

      if (!data?.url) {
        alert("Resume URL could not be generated");
        return;
      }

      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("VIEW RESUME ERROR:", err);
      alert(err.message || "Unable to open resume");
    }
  };

  /* Score Helpers */
  const getScoreColor = (score) => {
    if (score >= 80) return "#70d84a";
    if (score >= 60) return "#f4c542";
    return "#ff5d7d";
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Strong Match";
    if (score >= 70) return "Good Match";
    if (score >= 60) return "Moderate Match";
    return "Low Match";
  };

  const getExperience = (candidate) => {
    const applicant = candidate?.applicantId;
    return (
      applicant?.experience ||
      candidate?.aiAnalysis?.experienceYears ||
      candidate?.aiAnalysis?.experience ||
      "N/A"
    );
  };

  const selectedApplicant = selectedCandidate?.applicantId;
  const selectedJob = selectedCandidate?.jobId;
  const selectedAnalysis = selectedCandidate?.aiAnalysis || {};
  const selectedScore = Number(selectedCandidate?.aiScore || 0);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#020817",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#020817", color: "#f8fafc" }}>
      {/* NAVBAR */}
      <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 100 }}>
        <RNavbar />
      </Box>

      <Box sx={{ display: "flex", minWidth: 0 }}>
        {/* SIDEBAR */}
        <RSidebar />

        {/* MAIN CONTAINER */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            height: "calc(100vh - 68px)",
            overflow: "hidden",
            bgcolor: "#020817",
          }}
        >
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* TOP HEADER SECTION */}
            <Box sx={{ px: { xs: 2, md: 3 }, pt: 3, pb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 28,
                      fontWeight: 700,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Candidates
                  </Typography>
                  <Typography
                    sx={{ mt: 0.5, color: "#8c97ab", fontSize: 14 }}
                  >
                    Review and rank candidates using AI-powered resume analysis
                  </Typography>
                </Box>

                <Button
                  startIcon={<DownloadRoundedIcon />}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    textTransform: "none",
                    color: "white",
                    px: 2.5,
                    py: 1.1,
                    borderRadius: 1.5,
                    background:
                      "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#4f46e5,#7c3aed)",
                    },
                  }}
                >
                  Download Report
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 3,
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: 19, fontWeight: 600 }}>
                  Candidate Ranking
                </Typography>
                <AutoAwesomeRoundedIcon
                  sx={{ fontSize: 19, color: "#8b5cf6" }}
                />
              </Box>

              {/* FILTERS BAR */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search candidates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchRoundedIcon
                        sx={{ mr: 1, color: "#738096", fontSize: 20 }}
                      />
                    ),
                  }}
                  sx={{
                    width: { xs: "100%", md: 260 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#0b1425",
                      borderRadius: 1.5,
                      color: "white",
                      "& fieldset": { borderColor: "#263249" },
                    },
                  }}
                />

                <FormControl size="small">
                  <Select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    displayEmpty
                    sx={selectStyle}
                  >
                    <MenuItem value="all">All Jobs</MenuItem>
                    {jobs.map((job) => (
                      <MenuItem key={job._id} value={job._id}>
                        {job.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    value={scoreFilter}
                    onChange={(e) => setScoreFilter(e.target.value)}
                    displayEmpty
                    sx={selectStyle}
                  >
                    <MenuItem value="all">Match Score</MenuItem>
                    <MenuItem value="90">90 - 100</MenuItem>
                    <MenuItem value="80">80 - 100</MenuItem>
                    <MenuItem value="70">70 - 100</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    displayEmpty
                    sx={selectStyle}
                  >
                    <MenuItem value="all">Skills</MenuItem>
                    <MenuItem value="react">React</MenuItem>
                    <MenuItem value="node">Node.js</MenuItem>
                    <MenuItem value="mongodb">MongoDB</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    displayEmpty
                    sx={selectStyle}
                  >
                    <MenuItem value="all">Experience</MenuItem>
                    <MenuItem value="0-2">0 - 2 years</MenuItem>
                    <MenuItem value="2-5">2 - 5 years</MenuItem>
                    <MenuItem value="5+">5+ years</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  startIcon={<FilterAltOutlinedIcon />}
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    color: "#d4dbea",
                    borderColor: "#263249",
                    borderRadius: 1.5,
                    px: 2,
                  }}
                >
                  Filters
                </Button>
              </Box>
            </Box>

            {/* SPLIT VIEW MAIN CONTENT */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "minmax(500px, 1.1fr) minmax(420px, .9fr)",
                },
                gap: 0,
                borderTop: "1px solid #172236",
              }}
            >
              {/* LEFT COLUMN: CANDIDATE LIST */}
              <Box
                sx={{
                  minWidth: 0,
                  overflowY: "auto",
                  px: { xs: 2, md: 3 },
                  py: 2,
                  borderRight: { lg: "1px solid #172236" },
                  display: {
                    xs: selectedCandidate ? "none" : "block",
                    lg: "block",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: 13, color: "#8c97ab" }}>
                    Total {filteredCandidates.length} candidates found
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#8c97ab" }}>
                    Sort by:{" "}
                    <b style={{ color: "#e2e8f0" }}>Highest Match</b>
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {filteredCandidates.length === 0 ? (
                  <Box sx={{ py: 10, textAlign: "center" }}>
                    <Typography>No candidates found</Typography>
                  </Box>
                ) : (
                  filteredCandidates
                    .sort(
                      (a, b) =>
                        Number(b.aiScore || 0) - Number(a.aiScore || 0)
                    )
                    .map((candidate, index) => (
                      <CandidateRow
                        key={candidate._id}
                        candidate={candidate}
                        rank={index + 1}
                        selected={
                          selectedCandidate?._id === candidate._id
                        }
                        onClick={() => setSelectedCandidate(candidate)}
                      />
                    ))
                )}

                {/* PAGINATION */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    py: 3,
                  }}
                >
                  <IconButton sx={paginationButton}>
                    <ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  <Box sx={pageNumber}>1</Box>
                  <Typography sx={pageText}>2</Typography>
                  <Typography sx={pageText}>3</Typography>
                  <IconButton sx={paginationButton}>
                    <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              </Box>

              {/* RIGHT COLUMN: CANDIDATE DETAIL & AI ANALYSIS */}
              {selectedCandidate && (
                <Box
                  sx={{
                    minWidth: 0,
                    overflowY: "auto",
                    p: { xs: 2, md: 3 },
                    display: {
                      xs: "block",
                      lg: "block",
                    },
                  }}
                >
                  {/* MOBILE BACK BUTTON */}
                  <Button
                    startIcon={<ArrowBackIosNewRoundedIcon />}
                    onClick={() => setSelectedCandidate(null)}
                    sx={{
                      display: { xs: "flex", lg: "none" },
                      color: "#b7c0d1",
                      textTransform: "none",
                      mb: 2,
                    }}
                  >
                    Back to list
                  </Button>

                  {/* PROFILE HEADER */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar
                        src={
                          selectedApplicant?.profileImage ||
                          selectedApplicant?.avatar
                        }
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: "#1e293b",
                        }}
                      >
                        {(
                          selectedApplicant?.name ||
                          selectedApplicant?.fullName ||
                          "C"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </Avatar>

                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                            {selectedApplicant?.name ||
                              selectedApplicant?.fullName ||
                              "Unknown Candidate"}
                          </Typography>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "#70d84a",
                            }}
                          />
                        </Box>

                        <Typography
                          sx={{ color: "#a1aabd", fontSize: 13, mt: 0.3 }}
                        >
                          {selectedJob?.title || "Full Stack Developer"}
                        </Typography>

                        <Typography
                          sx={{ color: "#8c97ab", fontSize: 12, mt: 1 }}
                        >
                          {selectedApplicant?.email || "No email available"}
                        </Typography>

                        <Typography
                          sx={{ color: "#8c97ab", fontSize: 12, mt: 0.4 }}
                        >
                          <LocationOnOutlinedIcon
                            sx={{
                              fontSize: 14,
                              verticalAlign: "middle",
                              mr: 0.3,
                            }}
                          />
                          India
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="outlined"
                      startIcon={<DescriptionOutlinedIcon />}
                      onClick={() => handleViewResume(selectedCandidate)}
                      sx={{
                        textTransform: "none",
                        borderColor: "#263249",
                        color: "#dbe3f0",
                        height: 38,
                      }}
                    >
                      View Resume
                    </Button>
                  </Box>

                  {/* AI SCORE OVERVIEW CARD */}
                  <DetailCard>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{ color: "#dce3ef", fontSize: 13, mb: 1 }}
                        >
                          AI Match Score
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 43,
                            lineHeight: 1,
                            fontWeight: 800,
                            color: getScoreColor(selectedScore),
                          }}
                        >
                          {selectedScore}%
                        </Typography>

                        <Typography
                          sx={{ mt: 1, fontSize: 13, color: "#dce3ef" }}
                        >
                          {getScoreLabel(selectedScore)}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        startIcon={
                          analyzingId === selectedCandidate._id ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <AutoAwesomeRoundedIcon />
                          )
                        }
                        disabled={analyzingId === selectedCandidate._id}
                        onClick={() => handleAIAnalysis(selectedCandidate)}
                        sx={{
                          textTransform: "none",
                          background:
                            "linear-gradient(135deg, #8b5cf6, #6366f1)",
                          px: 2,
                          py: 1,
                          borderRadius: 1.5,
                          fontWeight: 600,
                        }}
                      >
                        {analyzingId === selectedCandidate._id
                          ? "Analyzing..."
                          : "Run AI Analysis"}
                      </Button>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={selectedScore}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "#172236",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getScoreColor(selectedScore),
                          },
                        }}
                      />
                    </Box>
                  </DetailCard>

                  {/* AI ANALYSIS SUMMARY */}
                  <DetailCard>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 600,
                        mb: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <AutoAwesomeRoundedIcon
                        sx={{ fontSize: 16, color: "#8b5cf6" }}
                      />
                      AI Analysis Summary
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#94a3b8",
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedAnalysis?.summary ||
                        selectedCandidate?.aiSummary ||
                        "No analysis generated yet. Click 'Run AI Analysis' to extract candidate insights, key strengths, and matching parameters."}
                    </Typography>
                  </DetailCard>

                  {/* KEY STRENGTHS & WEAKNESSES */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    {/* STRENGTHS */}
                    <DetailCard sx={{ mb: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#70d84a",
                          mb: 1.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                        }}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                        Key Strengths
                      </Typography>

                      {(
                        selectedAnalysis?.strengths || [
                          "Strong experience with React & Node.js",
                          "Good project track record",
                          "Relevant domain knowledge",
                        ]
                      ).map((strength, i) => (
                        <Typography
                          key={i}
                          sx={{
                            fontSize: 12,
                            color: "#cbd5e1",
                            mb: 0.8,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          • {strength}
                        </Typography>
                      ))}
                    </DetailCard>

                    {/* WEAKNESSES / GAPS */}
                    <DetailCard sx={{ mb: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#ff5d7d",
                          mb: 1.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                        }}
                      >
                        <CancelRoundedIcon sx={{ fontSize: 16 }} />
                        Skill Gaps
                      </Typography>

                      {(
                        selectedAnalysis?.weaknesses ||
                        selectedAnalysis?.gaps || [
                          "Limited experience in Cloud DevOps",
                          "Short tenure at recent position",
                        ]
                      ).map((gap, i) => (
                        <Typography
                          key={i}
                          sx={{
                            fontSize: 12,
                            color: "#cbd5e1",
                            mb: 0.8,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          • {gap}
                        </Typography>
                      ))}
                    </DetailCard>
                  </Box>

                  {/* SKILLS CHIPS */}
                  <DetailCard>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}
                    >
                      Identified Skills
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {(
                        selectedApplicant?.skills ||
                        selectedAnalysis?.skills || [
                          "React.js",
                          "Node.js",
                          "JavaScript",
                          "Express",
                          "MongoDB",
                          "Tailwind CSS",
                        ]
                      ).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{
                            bgcolor: "#172236",
                            color: "#e2e8f0",
                            fontSize: 12,
                            border: "1px solid #263249",
                          }}
                        />
                      ))}
                    </Box>
                  </DetailCard>

                  {/* ACTION BUTTONS */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 3,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<EventRoundedIcon />}
                      onClick={() =>
                        handleScheduleInterview(selectedCandidate)
                      }
                      sx={{
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: "#6366f1",
                        "&:hover": { bgcolor: "#4f46e5" },
                      }}
                    >
                      Schedule Interview
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Candidate;