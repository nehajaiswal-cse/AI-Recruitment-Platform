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
import { useTheme, alpha } from "@mui/material/styles";

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
import CandidateCopilot from "../../components/copilot/CandidateCopilto";

import { useCandidate } from "../../hooks/useCandidate";
import { getResumeUrl } from "../../api/resumeApi";

/* ---------------------------------------------------------
 * STYLES & SUB-COMPONENTS
 * These take `theme` as an argument so they stay reactive to
 * light/dark mode instead of hardcoding a palette.
 * --------------------------------------------------------- */

const brandGradient = (theme) =>
  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;

const selectStyle = (theme) => ({
  bgcolor: theme.palette.background.paper,
  borderRadius: 1.5,
  color: theme.palette.text.primary,
  height: 40,
  minWidth: 130,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.text.secondary,
  },
});

const paginationButton = (theme) => ({
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 1.5,
  p: 0.8,
  "&:hover": {
    bgcolor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
});

const pageNumber = (theme) => ({
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 1.5,
  bgcolor: theme.palette.primary.main,
  color: theme.palette.getContrastText(theme.palette.primary.main),
  fontSize: 13,
  fontWeight: 600,
});

const pageText = (theme) => ({
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 1.5,
  color: theme.palette.text.secondary,
  fontSize: 13,
  cursor: "pointer",
  "&:hover": {
    color: theme.palette.text.primary,
    bgcolor: theme.palette.action.hover,
  },
});

const DetailCard = ({ children, sx = {} }) => {
  const theme = useTheme();
  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2.5,
        mb: 2,
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

const CandidateRow = ({ candidate, rank, selected, onClick }) => {
  const theme = useTheme();
  const applicant = candidate?.applicantId;
  const job = candidate?.jobId;
  const score = Number(candidate?.aiScore || 0);

  const getScoreColor = (val) => {
    if (val >= 80) return theme.palette.success.main;
    if (val >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        bgcolor: selected
          ? alpha(theme.palette.primary.main, 0.08)
          : theme.palette.background.paper,
        border: "1px solid",
        borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
        borderRadius: 2,
        p: 2,
        mb: 1.5,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          bgcolor: alpha(theme.palette.primary.main, 0.06),
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
              color: theme.palette.text.secondary,
              width: 24,
            }}
          >
            #{rank}
          </Typography>

          <Avatar
            src={applicant?.profileImage || applicant?.avatar}
            sx={{
              width: 44,
              height: 44,
              bgcolor: alpha(theme.palette.primary.main, 0.16),
              color: theme.palette.primary.main,
              fontWeight: 700,
            }}
          >
            {(applicant?.name || applicant?.fullName || "C").charAt(0).toUpperCase()}
          </Avatar>

          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 15, color: theme.palette.text.primary }}>
              {applicant?.name || applicant?.fullName || "Unknown Candidate"}
            </Typography>
            <Typography sx={{ fontSize: 13, color: theme.palette.text.secondary, mt: 0.2 }}>
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
              bgcolor: theme.palette.action.selected,
              color: theme.palette.text.primary,
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
  const theme = useTheme();
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


      const skills =
        candidate?.aiAnalysis?.matchingSkills ||
        applicant?.skills ||
        [];

      const matchesSkill =
        skillFilter === "all" ||
        skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()));

      let matchesExperience = true;
      const experience =
        Number(
          applicant?.experience ||
          candidate?.aiAnalysis?.experienceYears ||
          candidate?.aiAnalysis?.experience ||
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
        matchesSkill &&
        matchesExperience
      );
    });
  }, [
    candidates,
    search,
    statusFilter,
    jobFilter,
    scoreFilter,
    skillFilter,
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
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
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
          bgcolor: theme.palette.background.default,
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
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default, color: theme.palette.text.primary }}>
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
            bgcolor: theme.palette.background.default,
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
                    sx={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}
                  >
                    Candidates
                  </Typography>
                  <Typography
                    sx={{ mt: 0.5, color: theme.palette.text.secondary, fontSize: 14 }}
                  >
                    Review and rank candidates using AI-powered resume analysis
                  </Typography>
                </Box>

                <Button
                  startIcon={<DownloadRoundedIcon />}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    textTransform: "none",
                    color: theme.palette.getContrastText(theme.palette.primary.main),
                    px: 2.5,
                    py: 1.1,
                    borderRadius: 1.5,
                    background: brandGradient(theme),
                    "&:hover": {
                      background: brandGradient(theme),
                      filter: "brightness(0.92)",
                    },
                  }}
                >
                  Download Report
                </Button>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3, mb: 2 }}
              >
                <Typography sx={{ fontSize: 19, fontWeight: 600 }}>
                  Candidate Ranking
                </Typography>
                <AutoAwesomeRoundedIcon
                  sx={{ fontSize: 19, color: theme.palette.secondary.main }}
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
                        sx={{ mr: 1, color: theme.palette.text.secondary, fontSize: 20 }}
                      />
                    ),
                  }}
                  sx={{
                    width: { xs: "100%", md: 260 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: theme.palette.background.paper,
                      borderRadius: 1.5,
                      color: theme.palette.text.primary,
                      "& fieldset": { borderColor: theme.palette.divider },
                    },
                  }}
                />

                <FormControl size="small">
                  <Select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    displayEmpty
                    sx={selectStyle(theme)}
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
                    sx={selectStyle(theme)}
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
                    sx={selectStyle(theme)}
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
                    sx={selectStyle(theme)}
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
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider,
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
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              {/* LEFT COLUMN: CANDIDATE LIST */}
              <Box
                sx={{
                  minWidth: 0,
                  overflowY: "auto",
                  px: { xs: 2, md: 3 },
                  py: 2,
                  borderRight: { lg: `1px solid ${theme.palette.divider}` },
                  display: {
                    xs: selectedCandidate ? "none" : "block",
                    lg: "block",
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
                >
                  <Typography sx={{ fontSize: 13, color: theme.palette.text.secondary }}>
                    Total {filteredCandidates.length} candidates found
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: theme.palette.text.secondary }}>
                    Sort by:{" "}
                    <b style={{ color: theme.palette.text.primary }}>Highest Match</b>
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
                  <IconButton sx={paginationButton(theme)}>
                    <ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  <Box sx={pageNumber(theme)}>1</Box>
                  <Typography sx={pageText(theme)}>2</Typography>
                  <Typography sx={pageText(theme)}>3</Typography>
                  <IconButton sx={paginationButton(theme)}>
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
                    display: { xs: "block", lg: "block" },
                  }}
                >
                  {/* MOBILE BACK BUTTON */}
                  <Button
                    startIcon={<ArrowBackIosNewRoundedIcon />}
                    onClick={() => setSelectedCandidate(null)}
                    sx={{
                      display: { xs: "flex", lg: "none" },
                      color: theme.palette.text.secondary,
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
                        src={selectedApplicant?.profileImage || selectedApplicant?.avatar}
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: alpha(theme.palette.primary.main, 0.16),
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          fontSize: 24,
                        }}
                      >
                        {(selectedApplicant?.name || selectedApplicant?.fullName || "C")
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
                              bgcolor: theme.palette.success.main,
                            }}
                          />
                        </Box>

                        <Typography
                          sx={{ color: theme.palette.text.secondary, fontSize: 13, mt: 0.3 }}
                        >
                          {selectedJob?.title || "Full Stack Developer"}
                        </Typography>

                        <Typography
                          sx={{ color: theme.palette.text.secondary, fontSize: 12, mt: 1 }}
                        >
                          {selectedApplicant?.email || "No email available"}
                        </Typography>

                        <Typography
                          sx={{ color: theme.palette.text.secondary, fontSize: 12, mt: 0.4 }}
                        >
                          <LocationOnOutlinedIcon
                            sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.3 }}
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
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
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
                          sx={{ color: theme.palette.text.primary, fontSize: 13, mb: 1 }}
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
                          sx={{ mt: 1, fontSize: 13, color: theme.palette.text.primary }}
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
                          background: brandGradient(theme),
                          "&:hover": {
                            background: brandGradient(theme),
                            filter: "brightness(0.92)",
                          },
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
                          bgcolor: theme.palette.divider,
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
                        sx={{ fontSize: 16, color: theme.palette.secondary.main }}
                      />
                      AI Analysis Summary
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedAnalysis?.summary ||
                        selectedCandidate?.aiSummary ||
                        "No analysis generated yet. Click 'Run AI Analysis' to extract candidate insights, key strengths, and matching parameters."}
                    </Typography>
                  </DetailCard>
                  {/* AI CANDIDATE COPILOT */}
                  {selectedCandidate?.applicationId && (
                    <CandidateCopilot
                      applicationId={
                        typeof selectedCandidate.applicationId === "object"
                          ? selectedCandidate.applicationId._id
                          : selectedCandidate.applicationId
                      }
                    />
                  )}

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
                          color: theme.palette.success.main,
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
                            color: theme.palette.text.secondary,
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
                          color: theme.palette.error.main,
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
                            color: theme.palette.text.secondary,
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
                            bgcolor: theme.palette.action.selected,
                            color: theme.palette.text.primary,
                            fontSize: 12,
                            border: `1px solid ${theme.palette.divider}`,
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
                      color="primary"
                      startIcon={<EventRoundedIcon />}
                      onClick={() =>
                        handleScheduleInterview(selectedCandidate)
                      }
                      sx={{
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 600,
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
