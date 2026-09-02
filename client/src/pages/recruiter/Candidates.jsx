import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import RNavbar from "../../components/layout/recruiter/Navbar";
import RSidebar from "../../components/layout/recruiter/Sidebar";

import { useCandidate } from "../../hooks/useCandidate";


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
  const [analyzingId, setAnalyzingId] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];

    return candidates.filter((candidate) => {
      const applicant = candidate.applicantId;
      const job = candidate.jobId;

      const name =
        applicant?.name ||
        applicant?.fullName ||
        "";

      const email =
        applicant?.email ||
        "";

      const jobTitle =
        job?.title ||
        "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        jobTitle.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        candidate.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [candidates, search, statusFilter]);

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

      console.log(
        "Starting AI analysis for:",
         applicationId
      );

      const response = await analyzeResume(applicationId);
      

      console.log("AI ANALYSIS RESPONSE:", response);

    } catch (error) {
      console.error(
        "AI ANALYSIS ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleScheduleInterview = (candidate) => {
    navigate("/recruiter/interviews", {
      state: {
        candidate,
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "shortlisted":
        return "success";

      case "rejected":
        return "error";

      case "interview":
        return "warning";

      case "selected":
        return "success";

      case "hired":
        return "success";

      case "screening":
        return "info";

      default:
        return "default";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "success.main";
    }

    if (score >= 60) {
      return "warning.main";
    }

    return "error.main";
  };

  if (loading) {
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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Navbar */}
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

      <Box
        sx={{
          display: "flex",
          minWidth: 0,
        }}
      >
        {/* Sidebar */}
        <RSidebar />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: "background.default",
            p: {
              xs: 2,
              md: 4,
              lg: 5,
            },
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Candidates
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Review candidates and analyze their resumes using AI
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          )}

          {/* Search + Filter */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 4,
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 250,
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

            <FormControl
              sx={{
                minWidth: 180,
              }}
            >
              <InputLabel>Status</InputLabel>

              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <MenuItem value="all">
                  All Status
                </MenuItem>

                <MenuItem value="applied">
                  Applied
                </MenuItem>

                <MenuItem value="screening">
                  Screening
                </MenuItem>

                <MenuItem value="shortlisted">
                  Shortlisted
                </MenuItem>

                <MenuItem value="interview">
                  Interview
                </MenuItem>

                <MenuItem value="selected">
                  Selected
                </MenuItem>

                <MenuItem value="hired">
                  Hired
                </MenuItem>

                <MenuItem value="rejected">
                  Rejected
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Candidate Count */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Showing {filteredCandidates.length} candidate
            {filteredCandidates.length !== 1 ? "s" : ""}
          </Typography>

          {/* Candidates */}
          {filteredCandidates.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 1 }}
              >
                No candidates found
              </Typography>

              <Typography
                color="text.secondary"
              >
                Try changing your search or status filter.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                  xl: "1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              {filteredCandidates.map((candidate) => {
                const applicant = candidate.applicantId;
                const job = candidate.jobId;

                const applicantName =
                  applicant?.name ||
                  applicant?.fullName ||
                  "Unknown Candidate";

                const applicantEmail =
                  applicant?.email ||
                  "No email available";

                const jobTitle =
                  job?.title ||
                  "Unknown Job";

                const hasAIAnalysis =
                  candidate.aiScore !== null &&
                  candidate.aiScore !== undefined;

                return (
                  <Card
                    key={candidate._id}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "background.paper",
                      transition: "0.2s",

                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 3,
                      }}
                    >
                      {/* Candidate Name */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {applicantName}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {applicantEmail}
                          </Typography>
                        </Box>

                        <Chip
                          label={
                            candidate.status
                              ? candidate.status
                                  .charAt(0)
                                  .toUpperCase() +
                                candidate.status.slice(1)
                              : "Applied"
                          }
                          color={getStatusColor(
                            candidate.status
                          )}
                          size="small"
                        />
                      </Box>

                      {/* Job */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Applied for
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {jobTitle}
                        </Typography>
                      </Box>

                      {/* AI Score */}
                      {hasAIAnalysis && (
                        <Box
                          sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            bgcolor:
                              "background.default",
                            border: "1px solid",
                            borderColor:
                              "divider",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent:
                                "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems:
                                  "center",
                                gap: 1,
                              }}
                            >
                              <AutoAwesomeRoundedIcon
                                sx={{
                                  fontSize: 20,
                                  color:
                                    "primary.main",
                                }}
                              />

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                AI Match Score
                              </Typography>
                            </Box>

                            <Typography
                              sx={{
                                fontSize: 24,
                                fontWeight: 800,
                                color:
                                  getScoreColor(
                                    candidate.aiScore
                                  ),
                              }}
                            >
                              {candidate.aiScore}%
                            </Typography>
                          </Box>

                          {/* Recommendation */}
                          {candidate.aiAnalysis
                            ?.recommendation && (
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                              }}
                            >
                              AI Recommendation:{" "}
                              <Box
                                component="span"
                                sx={{
                                  color:
                                    candidate
                                      .aiAnalysis
                                      .recommendation ===
                                    "Shortlist"
                                      ? "success.main"
                                      : candidate
                                          .aiAnalysis
                                          .recommendation ===
                                        "Reject"
                                      ? "error.main"
                                      : "warning.main",
                                }}
                              >
                                {
                                  candidate
                                    .aiAnalysis
                                    .recommendation
                                }
                              </Box>
                            </Typography>
                          )}

                          {/* Matching Skills */}
                          {candidate.aiAnalysis
                            ?.matchingSkills
                            ?.length > 0 && (
                            <Box sx={{ mt: 1.5 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Matching Skills
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                  mt: 0.5,
                                }}
                              >
                                {candidate.aiAnalysis.matchingSkills
                                  .slice(0, 5)
                                  .map(
                                    (
                                      skill,
                                      index
                                    ) => (
                                      <Chip
                                        key={`${skill}-${index}`}
                                        label={
                                          skill
                                        }
                                        size="small"
                                        variant="outlined"
                                        color="success"
                                      />
                                    )
                                  )}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* AI Analysis Summary */}
                      {hasAIAnalysis &&
                        candidate.aiAnalysis
                          ?.summary && (
                          <Box
                            sx={{
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              AI Summary
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                mt: 0.5,
                                lineHeight: 1.6,
                              }}
                            >
                              {
                                candidate
                                  .aiAnalysis
                                  .summary
                              }
                            </Typography>
                          </Box>
                        )}

                      {/* Actions */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mt: 2,
                          flexDirection: "column",
                        }}
                      >
                        {/* AI Analysis Button */}
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={
                            analyzingId ===
                            candidate._id ? (
                              <CircularProgress
                                size={18}
                                color="inherit"
                              />
                            ) : (
                              <AutoAwesomeRoundedIcon />
                            )
                          }
                          onClick={() =>
                            handleAIAnalysis(
                              candidate
                            )
                          }
                          disabled={
                            analyzingId ===
                            candidate._id
                          }
                          sx={{
                            textTransform:
                              "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            background:
                              "linear-gradient(135deg,#6366f1,#8b5cf6)",

                            "&:hover": {
                              background:
                                "linear-gradient(135deg,#4f46e5,#7c3aed)",
                            },
                          }}
                        >
                          {analyzingId ===
                          candidate._id
                            ? "Analyzing Resume..."
                            : hasAIAnalysis
                            ? "Re-analyze Resume"
                            : "Analyze Resume"}
                        </Button>

                        {/* Schedule Interview */}
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={
                            <EventRoundedIcon />
                          }
                          onClick={() =>
                            handleScheduleInterview(
                              candidate
                            )
                          }
                          sx={{
                            textTransform:
                              "none",
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        >
                          Schedule Interview
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Candidate;