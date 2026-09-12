import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  Divider,
  Avatar,
  LinearProgress,
  Menu,
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
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import RNavbar from "../../components/layout/recruiter/Navbar";
import RSidebar from "../../components/layout/recruiter/Sidebar";

import { useCandidate } from "../../hooks/useCandidate";
import {getResumeUrl} from "../../api/resumeApi";

function Candidate() {
  const navigate = useNavigate();

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

  const [recommendationAnchor, setRecommendationAnchor] =
    useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  /*
   * ---------------------------------------------------------
   * FILTER CANDIDATES
   * ---------------------------------------------------------
   */

  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];

    return candidates.filter((candidate) => {
      const applicant = candidate.applicantId;
      const job = candidate.jobId;

      const name =
        applicant?.name ||
        applicant?.fullName ||
        "";

      const email = applicant?.email || "";

      const jobTitle = job?.title || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        jobTitle.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        candidate.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesJob =
        jobFilter === "all" ||
        job?._id === jobFilter;

      const score = Number(candidate.aiScore || 0);

      let matchesScore = true;

      if (scoreFilter === "70") {
        matchesScore = score >= 70;
      }

      if (scoreFilter === "80") {
        matchesScore = score >= 80;
      }

      if (scoreFilter === "90") {
        matchesScore = score >= 90;
      }

      let matchesExperience = true;

      const experience =
        Number(
          applicant?.experience ||
            candidate.aiAnalysis?.experience ||
            0
        ) || 0;

      if (experienceFilter === "0-2") {
        matchesExperience = experience <= 2;
      }

      if (experienceFilter === "2-5") {
        matchesExperience =
          experience > 2 && experience <= 5;
      }

      if (experienceFilter === "5+") {
        matchesExperience = experience > 5;
      }

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
  ]);

  /*
   * ---------------------------------------------------------
   * JOB LIST
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * SELECT FIRST CANDIDATE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (
      filteredCandidates.length > 0 &&
      !selectedCandidate
    ) {
      setSelectedCandidate(filteredCandidates[0]);
    }
  }, [filteredCandidates, selectedCandidate]);

  /*
   * ---------------------------------------------------------
   * AI ANALYSIS
   * ---------------------------------------------------------
   */

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

      const response = await analyzeResume(applicationId);

      console.log("AI ANALYSIS RESPONSE:", response);

      /*
       * Refresh candidates so the new AI result
       * appears in the UI.
       */
      await fetchCandidates();

    } catch (error) {
      console.error(
        "AI ANALYSIS ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setAnalyzingId(null);
    }
  };

  /*
   * ---------------------------------------------------------
   * INTERVIEW
   * ---------------------------------------------------------
   */

  const handleScheduleInterview = (candidate) => {
    navigate("/recruiter/interviews", {
      state: {
        candidate,
      },
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

    console.log("Opening resume for application:", applicationId);

    const data = await getResumeUrl(applicationId);

    if (!data?.url) {
      alert("Resume URL could not be generated");
      return;
    }

    window.open(
      data.url,
      "_blank",
      "noopener,noreferrer"
    );
  } catch (error) {
    console.error("VIEW RESUME ERROR:", error);
    alert(error.message || "Unable to open resume");
  }
};
  /*
   * ---------------------------------------------------------
   * SCORE COLOR
   * ---------------------------------------------------------
   */

  const getScoreColor = (score) => {
    if (score >= 80) return "#70d84a";
    if (score >= 60) return "#f4c542";

    return "#ff5d7d";
  };

  /*
   * ---------------------------------------------------------
   * SCORE LABEL
   * ---------------------------------------------------------
   */

  const getScoreLabel = (score) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Strong Match";
    if (score >= 70) return "Good Match";
    if (score >= 60) return "Moderate Match";

    return "Low Match";
  };

  /*
   * ---------------------------------------------------------
   * EXPERIENCE
   * ---------------------------------------------------------
   */

  const getExperience = (candidate) => {
    const applicant = candidate?.applicantId;

    return (
      applicant?.experience ||
      candidate?.aiAnalysis?.experienceYears ||
      candidate?.aiAnalysis?.experience ||
      "N/A"
    );
  };

  /*
   * ---------------------------------------------------------
   * SELECTED CANDIDATE
   * ---------------------------------------------------------
   */

  const selectedApplicant =
    selectedCandidate?.applicantId;

  const selectedJob = selectedCandidate?.jobId;

  const selectedAnalysis =
    selectedCandidate?.aiAnalysis || {};

  const selectedScore =
    Number(selectedCandidate?.aiScore || 0);

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#020817",
        color: "#f8fafc",
      }}
    >
      {/* NAVBAR */}

      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <RNavbar />
      </Box>

      <Box
        sx={{
          display: "flex",
          minWidth: 0,
        }}
      >
        {/* SIDEBAR */}

        <RSidebar />

        {/* MAIN */}

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
          {/* PAGE HEADER */}

          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* TOP HEADER */}

            <Box
              sx={{
                px: { xs: 2, md: 3 },
                pt: 3,
                pb: 2,
              }}
            >
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
                    sx={{
                      mt: 0.5,
                      color: "#8c97ab",
                      fontSize: 14,
                    }}
                  >
                    Review and rank candidates using AI-powered
                    resume analysis
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

              {/* TITLE */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 3,
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 19,
                    fontWeight: 600,
                  }}
                >
                  Candidate Ranking
                </Typography>

                <AutoAwesomeRoundedIcon
                  sx={{
                    fontSize: 19,
                    color: "#8b5cf6",
                  }}
                />
              </Box>

              {/* FILTERS */}

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
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <SearchRoundedIcon
                        sx={{
                          mr: 1,
                          color: "#738096",
                          fontSize: 20,
                        }}
                      />
                    ),
                  }}
                  sx={{
                    width: { xs: "100%", md: 260 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#0b1425",
                      borderRadius: 1.5,
                      color: "white",
                      "& fieldset": {
                        borderColor: "#263249",
                      },
                    },
                  }}
                />

                <FormControl size="small">
                  <Select
                    value={jobFilter}
                    onChange={(e) =>
                      setJobFilter(e.target.value)
                    }
                    displayEmpty
                    sx={selectStyle}
                  >
                    <MenuItem value="all">
                      All Jobs
                    </MenuItem>

                    {jobs.map((job) => (
                      <MenuItem
                        key={job._id}
                        value={job._id}
                      >
                        {job.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    value={scoreFilter}
                    onChange={(e) =>
                      setScoreFilter(e.target.value)
                    }
                    displayEmpty
                    sx={selectStyle}
                  >
                    <MenuItem value="all">
                      Match Score
                    </MenuItem>
                    <MenuItem value="90">
                      90 - 100
                    </MenuItem>
                    <MenuItem value="80">
                      80 - 100
                    </MenuItem>
                    <MenuItem value="70">
                      70 - 100
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    value={skillFilter}
                    onChange={(e) =>
                      setSkillFilter(e.target.value)
                    }
                    displayEmpty
                    sx={selectStyle}
                  >
                    <MenuItem value="all">
                      Skills
                    </MenuItem>
                    <MenuItem value="react">
                      React
                    </MenuItem>
                    <MenuItem value="node">
                      Node.js
                    </MenuItem>
                    <MenuItem value="mongodb">
                      MongoDB
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    value={experienceFilter}
                    onChange={(e) =>
                      setExperienceFilter(e.target.value)
                    }
                    displayEmpty
                    sx={selectStyle}
                  >
                    <MenuItem value="all">
                      Experience
                    </MenuItem>
                    <MenuItem value="0-2">
                      0 - 2 years
                    </MenuItem>
                    <MenuItem value="2-5">
                      2 - 5 years
                    </MenuItem>
                    <MenuItem value="5+">
                      5+ years
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button
                  startIcon={
                    <FilterAltOutlinedIcon />
                  }
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

            {/* CONTENT */}

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
              {/* LEFT — RANKING */}

              <Box
                sx={{
                  minWidth: 0,
                  overflowY: "auto",
                  px: { xs: 2, md: 3 },
                  py: 2,
                  borderRight: {
                    lg: "1px solid #172236",
                  },
                  display: {
                    xs: selectedCandidate
                      ? "none"
                      : "block",
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
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#8c97ab",
                    }}
                  >
                    Total {filteredCandidates.length}{" "}
                    candidates found
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#8c97ab",
                    }}
                  >
                    Sort by:{" "}
                    <b style={{ color: "#e2e8f0" }}>
                      Highest Match
                    </b>
                  </Typography>
                </Box>

                {error && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                  >
                    {error}
                  </Alert>
                )}

                {filteredCandidates.length === 0 ? (
                  <Box
                    sx={{
                      py: 10,
                      textAlign: "center",
                    }}
                  >
                    <Typography>
                      No candidates found
                    </Typography>
                  </Box>
                ) : (
                  filteredCandidates
                    .sort(
                      (a, b) =>
                        Number(b.aiScore || 0) -
                        Number(a.aiScore || 0)
                    )
                    .map((candidate, index) => (
                      <CandidateRow
                        key={candidate._id}
                        candidate={candidate}
                        rank={index + 1}
                        selected={
                          selectedCandidate?._id ===
                          candidate._id
                        }
                        onClick={() =>
                          setSelectedCandidate(candidate)
                        }
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
                    <ArrowBackIosNewRoundedIcon
                      sx={{ fontSize: 14 }}
                    />
                  </IconButton>

                  <Box sx={pageNumber}>1</Box>

                  <Typography sx={pageText}>
                    2
                  </Typography>

                  <Typography sx={pageText}>
                    3
                  </Typography>

                  <IconButton sx={paginationButton}>
                    <ArrowForwardIosRoundedIcon
                      sx={{ fontSize: 14 }}
                    />
                  </IconButton>
                </Box>
              </Box>

              {/* RIGHT — DETAILS */}

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
                  {/* MOBILE BACK */}

                  <Button
                    startIcon={
                      <ArrowBackIosNewRoundedIcon />
                    }
                    onClick={() =>
                      setSelectedCandidate(null)
                    }
                    sx={{
                      display: {
                        xs: "flex",
                        lg: "none",
                      },
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
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                      }}
                    >
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
                          <Typography
                            sx={{
                              fontSize: 20,
                              fontWeight: 700,
                            }}
                          >
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
                          sx={{
                            color: "#a1aabd",
                            fontSize: 13,
                            mt: 0.3,
                          }}
                        >
                          {selectedJob?.title ||
                            "Full Stack Developer"}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#8c97ab",
                            fontSize: 12,
                            mt: 1,
                          }}
                        >
                          {selectedApplicant?.email ||
                            "No email available"}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#8c97ab",
                            fontSize: 12,
                            mt: 0.4,
                          }}
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
                      startIcon={
                        <DescriptionOutlinedIcon />
                      }
                      onClick={() =>handleViewResume(selectedCandidate)}
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

                  {/* AI SCORE */}

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
                          sx={{
                            color: "#dce3ef",
                            fontSize: 13,
                            mb: 1,
                          }}
                        >
                          AI Match Score
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 43,
                            lineHeight: 1,
                            fontWeight: 800,
                            color:
                              getScoreColor(
                                selectedScore
                              ),
                          }}
                        >
                          {selectedScore}%
                        </Typography>

                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: 13,
                            color: "#dce3ef",
                          }}
                        >
                          {getScoreLabel(
                            selectedScore
                          )}
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={selectedScore}
                          sx={{
                            mt: 1.5,
                            width: 190,
                            height: 6,
                            borderRadius: 5,
                            bgcolor: "#1d2a3c",
                            "& .MuiLinearProgress-bar": {
                              bgcolor:
                                getScoreColor(
                                  selectedScore
                                ),
                              borderRadius: 5,
                            },
                          }}
                        />
                      </Box>

                      {/* SCORE CIRCLE */}

                      <ScoreCircle
                        score={selectedScore}
                      />
                    </Box>
                  </DetailCard>

                  {/* SKILLS */}

                  <DetailCard>
                    <Typography sectionTitle>
                      Matching Skills
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 2.5,
                      }}
                    >
                      {(
                        selectedAnalysis.matchingSkills ||
                        []
                      ).map((skill, index) => (
                        <Chip
                          key={`${skill}-${index}`}
                          icon={
                            <CheckCircleRoundedIcon />
                          }
                          label={skill}
                          size="small"
                          sx={{
                            bgcolor: "#101d2d",
                            color: "#dbe5f4",
                            border:
                              "1px solid #26364e",
                            "& .MuiChip-icon": {
                              color: "#65d34f",
                              fontSize: 15,
                            },
                          }}
                        />
                      ))}
                    </Box>

                    <Typography
                      sectionTitle
                      sx={{ mb: 1 }}
                    >
                      Missing Skills
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {(
                        selectedAnalysis.missingSkills ||
                        []
                      ).map((skill, index) => (
                        <Chip
                          key={`${skill}-${index}`}
                          icon={
                            <CancelRoundedIcon />
                          }
                          label={skill}
                          size="small"
                          sx={{
                            bgcolor: "#241423",
                            color: "#dbe5f4",
                            border:
                              "1px solid #4b2339",
                            "& .MuiChip-icon": {
                              color: "#ff5477",
                              fontSize: 15,
                            },
                          }}
                        />
                      ))}
                    </Box>

                    {/* EXPERIENCE */}

                    <Box
                      sx={{
                        mt: 2.5,
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: "#0b1424",
                        border:
                          "1px solid #1e2c40",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        Experience Match
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#b5bfd0",
                          lineHeight: 1.6,
                        }}
                      >
                        {selectedAnalysis.experienceAnalysis ||
                          `Candidate has ${getExperience(
                            selectedCandidate
                          )} years of relevant experience.`}
                      </Typography>
                    </Box>
                  </DetailCard>

                  {/* STRENGTHS + WEAKNESSES */}

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1.5,
                      mt: 1.5,
                    }}
                  >
                    <DetailCard sx={{ mt: 0 }}>
                      <Typography
                        sectionTitle
                        sx={{ mb: 1 }}
                      >
                        Strengths
                      </Typography>

                      {(selectedAnalysis.strengths ||
                        []
                      ).map((item, index) => (
                        <Typography
                          key={index}
                          sx={{
                            fontSize: 12,
                            color: "#b8c3d4",
                            mb: 1,
                            lineHeight: 1.5,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              color: "#70d84a",
                              mr: 1,
                            }}
                          >
                            •
                          </Box>
                          {item}
                        </Typography>
                      ))}
                    </DetailCard>

                    <DetailCard sx={{ mt: 0 }}>
                      <Typography
                        sectionTitle
                        sx={{ mb: 1 }}
                      >
                        Weaknesses
                      </Typography>

                      {(selectedAnalysis.weaknesses ||
                        []
                      ).map((item, index) => (
                        <Typography
                          key={index}
                          sx={{
                            fontSize: 12,
                            color: "#b8c3d4",
                            mb: 1,
                            lineHeight: 1.5,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              color: "#ff5578",
                              mr: 1,
                            }}
                          >
                            •
                          </Box>
                          {item}
                        </Typography>
                      ))}
                    </DetailCard>
                  </Box>

                  {/* AI SUMMARY */}

                  <DetailCard>
                    <Typography
                      sectionTitle
                      sx={{ mb: 1 }}
                    >
                      AI Summary
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 12.5,
                        color: "#b8c3d4",
                        lineHeight: 1.7,
                      }}
                    >
                      {selectedAnalysis.summary ||
                        "No AI summary available. Analyze this resume to generate a detailed AI assessment."}
                    </Typography>
                  </DetailCard>

                  {/* RECOMMENDATION */}

                  <DetailCard>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sectionTitle
                          sx={{ mb: 0.5 }}
                        >
                          Recommendation
                        </Typography>

                        <Chip
                          label={
                            selectedAnalysis.recommendation ||
                            "Pending Analysis"
                          }
                          size="small"
                          sx={{
                            mt: 0.5,
                            bgcolor:
                              selectedAnalysis.recommendation ===
                              "Shortlist"
                                ? "#122d1c"
                                : "#271b14",
                            color:
                              selectedAnalysis.recommendation ===
                              "Shortlist"
                                ? "#70d84a"
                                : "#f3c44d",
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#aab5c7",
                            mt: 1,
                          }}
                        >
                          {selectedAnalysis.recommendation ===
                          "Shortlist"
                            ? "This candidate should be shortlisted for the next round."
                            : "Review the AI analysis before moving this candidate to the next stage."}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        endIcon={
                          <KeyboardArrowDownRoundedIcon />
                        }
                        onClick={(event) =>
                          setRecommendationAnchor(
                            event.currentTarget
                          )
                        }
                        sx={{
                          textTransform: "none",
                          whiteSpace: "nowrap",
                          background:
                            "linear-gradient(135deg,#6366f1,#8b5cf6)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg,#4f46e5,#7c3aed)",
                          },
                        }}
                      >
                        Move to Next Stage
                      </Button>
                    </Box>

                    <Menu
                      anchorEl={
                        recommendationAnchor
                      }
                      open={Boolean(
                        recommendationAnchor
                      )}
                      onClose={() =>
                        setRecommendationAnchor(
                          null
                        )
                      }
                    >
                      <MenuItem
                        onClick={() => {
                          setRecommendationAnchor(
                            null
                          );
                        }}
                      >
                        Shortlist
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          setRecommendationAnchor(
                            null
                          );
                          handleScheduleInterview(
                            selectedCandidate
                          );
                        }}
                      >
                        Schedule Interview
                      </MenuItem>

                      <MenuItem
                        onClick={() =>
                          setRecommendationAnchor(
                            null
                          )
                        }
                      >
                        Reject
                      </MenuItem>
                    </Menu>
                  </DetailCard>

                  {/* ANALYZE BUTTON */}

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={
                      analyzingId ===
                      selectedCandidate._id ? (
                        <CircularProgress
                          size={18}
                          color="inherit"
                        />
                      ) : (
                        <AutoAwesomeRoundedIcon />
                      )
                    }
                    disabled={
                      analyzingId ===
                      selectedCandidate._id
                    }
                    onClick={() =>
                      handleAIAnalysis(
                        selectedCandidate
                      )
                    }
                    sx={{
                      mt: 1,
                      py: 1.3,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 1.5,
                      background:
                        "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg,#4f46e5,#7c3aed)",
                      },
                    }}
                  >
                    {analyzingId ===
                    selectedCandidate._id
                      ? "Analyzing Resume..."
                      : selectedCandidate.aiScore !=
                        null
                      ? "Re-analyze Resume"
                      : "Analyze Resume"}
                  </Button>

                  {/* INTERVIEW */}

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<EventRoundedIcon />}
                    onClick={() =>
                      handleScheduleInterview(
                        selectedCandidate
                      )
                    }
                    sx={{
                      mt: 1,
                      py: 1.2,
                      textTransform: "none",
                      borderColor: "#293750",
                      color: "#dbe4f3",
                      borderRadius: 1.5,
                    }}
                  >
                    Schedule Interview
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/*
|--------------------------------------------------------------------------
| CANDIDATE ROW
|--------------------------------------------------------------------------
*/

function CandidateRow({
  candidate,
  rank,
  selected,
  onClick,
}) {
  const applicant = candidate.applicantId;
  const job = candidate.jobId;

  const name =
    applicant?.name ||
    applicant?.fullName ||
    "Unknown Candidate";

  const email =
    applicant?.email ||
    "No email";

  const score =
    Number(candidate.aiScore || 0);

  const skills =
    candidate.aiAnalysis?.matchingSkills ||
    [];

  const experience =
    applicant?.experience ||
    candidate.aiAnalysis?.experienceYears ||
    "";

  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 1.5,
        p: 2,
        cursor: "pointer",
        borderRadius: 1.5,
        bgcolor: selected
          ? "#0d172b"
          : "#091223",
        border: "1px solid",
        borderColor: selected
          ? "#7448ff"
          : "#17253a",
        boxShadow: selected
          ? "0 0 0 1px rgba(124,58,237,.2)"
          : "none",
        transition: "all .2s",
        "&:hover": {
          borderColor: "#5f4bd8",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {/* RANK */}

        <Typography
          sx={{
            width: 20,
            color: "#65728a",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          #{rank}
        </Typography>

        {/* AVATAR */}

        <Avatar
          src={
            applicant?.profileImage ||
            applicant?.avatar
          }
          sx={{
            width: 48,
            height: 48,
            bgcolor: "#1b2840",
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>

        {/* BASIC INFO */}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </Typography>

            {rank === 1 && (
              <Chip
                label="Top Match"
                size="small"
                sx={{
                  height: 21,
                  bgcolor: "#251c54",
                  color: "#a78bfa",
                  fontSize: 10,
                }}
              />
            )}
          </Box>

          <Typography
            sx={{
              fontSize: 11.5,
              color: "#a3aec0",
              mt: 0.3,
            }}
          >
            {job?.title ||
              "Full Stack Developer"}
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "#69768d",
              mt: 0.3,
            }}
          >
            {email}
          </Typography>
        </Box>

        {/* SKILLS */}

        <Box
          sx={{
            width: 190,
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              color: "#68758c",
              mb: 0.7,
            }}
          >
            Top Skills
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            {skills.slice(0, 3).map(
              (skill, index) => (
                <Chip
                  key={`${skill}-${index}`}
                  label={skill}
                  size="small"
                  sx={{
                    height: 22,
                    bgcolor: "#172238",
                    color: "#c7d1e0",
                    fontSize: 10,
                  }}
                />
              )
            )}

            {skills.length > 3 && (
              <Chip
                label={`+${skills.length - 3}`}
                size="small"
                sx={{
                  height: 22,
                  bgcolor: "#172238",
                  color: "#94a3b8",
                  fontSize: 10,
                }}
              />
            )}
          </Box>
        </Box>

        {/* SCORE */}

        <Box
          sx={{
            width: 60,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: `4px solid ${
                score >= 80
                  ? "#70d84a"
                  : score >= 60
                  ? "#f4c542"
                  : "#ff5d7d"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {score}%
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 9,
              color: "#68758c",
            }}
          >
            Match
          </Typography>
        </Box>

        <ArrowForwardIosRoundedIcon
          sx={{
            fontSize: 13,
            color: "#64748b",
          }}
        />
      </Box>
    </Card>
  );
}

/*
|--------------------------------------------------------------------------
| DETAIL CARD
|--------------------------------------------------------------------------
*/

function DetailCard({ children, sx = {} }) {
  return (
    <Card
      sx={{
        mt: 1.5,
        p: 2,
        borderRadius: 1.5,
        bgcolor: "#081221",
        border: "1px solid #1b293d",
        color: "#f8fafc",
        boxShadow: "none",
        ...sx,
      }}
    >
      {children}
    </Card>
  );
}

/*
|--------------------------------------------------------------------------
| SCORE CIRCLE
|--------------------------------------------------------------------------
*/

function ScoreCircle({ score }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress =
    circumference - (score / 100) * circumference;

  return (
    <Box
      sx={{
        position: "relative",
        width: 105,
        height: 105,
      }}
    >
      <svg
        width="105"
        height="105"
        style={{
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx="52.5"
          cy="52.5"
          r={radius}
          fill="none"
          stroke="#172337"
          strokeWidth="7"
        />

        <circle
          cx="52.5"
          cy="52.5"
          r={radius}
          fill="none"
          stroke="#70d84a"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
        />
      </svg>

      <Typography
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 800,
        }}
      >
        {score}%
      </Typography>
    </Box>
  );
}

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const selectStyle = {
  minWidth: 125,
  bgcolor: "#0b1425",
  color: "#dbe3ef",
  borderRadius: 1.5,

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#263249",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#46536c",
  },

  "& .MuiSvgIcon-root": {
    color: "#8c97ab",
  },
};

const paginationButton = {
  color: "#9ba8bc",
  border: "1px solid #253249",
  width: 34,
  height: 34,
};

const pageNumber = {
  width: 34,
  height: 34,
  borderRadius: 1,
  bgcolor: "#6941e8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  fontWeight: 600,
};

const pageText = {
  width: 34,
  textAlign: "center",
  color: "#a3aec0",
  fontSize: 13,
};

export default Candidate;