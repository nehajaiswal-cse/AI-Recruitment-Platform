import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";

import { useCandidate } from "../../hooks/useCandidate";

import RNavbar from "../../components/layout/recruiter/Navbar";
import RSidebar from "../../components/layout/recruiter/Sidebar";

const Candidate = () => {
  const navigate = useNavigate();

  const {
    candidates = [],
    loading,
    error,
    fetchCandidates,
  } = useCandidate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const getApplicant = (candidate) => {
    return candidate?.applicantId || {};
  };

  const getJob = (candidate) => {
    return candidate?.jobId || {};
  };

  const getCandidateName = (candidate) => {
    const applicant = getApplicant(candidate);

    return (
      applicant.name ||
      applicant.fullName ||
      "Unknown Candidate"
    );
  };

  const getCandidateEmail = (candidate) => {
    const applicant = getApplicant(candidate);

    return applicant.email || "No email available";
  };

  const getJobTitle = (candidate) => {
    const job = getJob(candidate);

    return (
      job.title ||
      job.jobTitle ||
      "Job not available"
    );
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const filteredCandidates = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return candidates.filter((candidate) => {
      const name = getCandidateName(candidate).toLowerCase();
      const email = getCandidateEmail(candidate).toLowerCase();
      const job = getJobTitle(candidate).toLowerCase();

      const status = candidate?.status || "Applied";

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        job.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, search, statusFilter]);

  const handleScheduleInterview = (candidate) => {
    /*
      We don't ask recruiter for Candidate ID.

      We already have it:
      candidate._id

      Job ID is also already available:
      candidate.jobId._id
    */

    navigate("/recruiter/interviews", {
      state: {
        candidate,
      },
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return {
          color: "success.main",
          borderColor: "success.main",
        };

      case "Rejected":
        return {
          color: "error.main",
          borderColor: "error.main",
        };

      case "Interview":
        return {
          color: "primary.main",
          borderColor: "primary.main",
        };

      default:
        return {
          color: "text.secondary",
          borderColor: "divider",
        };
    }
  };

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

        {/* Main */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {/* Header */}
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
                    xs: 28,
                    md: 34,
                  },
                  fontWeight: 700,
                }}
              >
                Candidates
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                }}
              >
                Review applicants and manage your
                recruitment pipeline.
              </Typography>
            </Box>

            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  color: "text.secondary",
                }}
              >
                Total Candidates
              </Typography>

              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {candidates.length}
              </Typography>
            </Box>
          </Box>

          {/* Search + Filter */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            <TextField
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search candidate, email or job..."
              size="small"
              sx={{
                flex: 1,
                minWidth: 260,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "background.paper",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      color="action"
                    />
                  </InputAdornment>
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
              SelectProps={{
                native: true,
              }}
              sx={{
                minWidth: 160,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "background.paper",
                },
              }}
            >
              <option value="All">
                All Status
              </option>

              <option value="Applied">
                Applied
              </option>

              <option value="Shortlisted">
                Shortlisted
              </option>

              <option value="Interview">
                Interview
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </TextField>
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

          {/* Loading */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredCandidates.length === 0 && (
              <Card
                sx={{
                  borderRadius: 3,
                  textAlign: "center",
                  py: 8,
                }}
              >
                <PersonRoundedIcon
                  sx={{
                    fontSize: 60,
                    color: "text.secondary",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  No candidates found
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    color: "text.secondary",
                  }}
                >
                  Candidates will appear here when
                  applicants apply for your jobs.
                </Typography>
              </Card>
            )}

          {/* Candidate Grid */}
          {!loading &&
            !error &&
            filteredCandidates.length > 0 && (
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
                {filteredCandidates.map(
                  (candidate) => {
                    const name =
                      getCandidateName(candidate);

                    const email =
                      getCandidateEmail(candidate);

                    const jobTitle =
                      getJobTitle(candidate);

                    const status =
                      candidate.status ||
                      "Applied";

                    return (
                      <Card
                        key={candidate._id}
                        sx={{
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "background.paper",
                          transition:
                            "all .2s ease",

                          "&:hover": {
                            transform:
                              "translateY(-3px)",
                            boxShadow: 6,
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 3,
                          }}
                        >
                          {/* Candidate Header */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent:
                                "space-between",
                              gap: 2,
                              mb: 3,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1.5,
                                minWidth: 0,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 52,
                                  height: 52,
                                  fontWeight: 700,
                                  background:
                                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                }}
                              >
                                {getInitials(name)}
                              </Avatar>

                              <Box
                                sx={{
                                  minWidth: 0,
                                }}
                              >
                                <Typography
                                  fontWeight={700}
                                  noWrap
                                >
                                  {name}
                                </Typography>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems:
                                      "center",
                                    gap: 0.5,
                                    mt: 0.5,
                                  }}
                                >
                                  <EmailRoundedIcon
                                    sx={{
                                      fontSize: 15,
                                      color:
                                        "text.secondary",
                                    }}
                                  />

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    noWrap
                                  >
                                    {email}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Chip
                              label={status}
                              size="small"
                              variant="outlined"
                              sx={{
                                ...getStatusStyle(
                                  status
                                ),
                              }}
                            />
                          </Box>

                          {/* Job */}
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor:
                                "background.default",
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems:
                                  "center",
                              }}
                            >
                              <WorkOutlineRoundedIcon
                                sx={{
                                  fontSize: 18,
                                  color:
                                    "primary.main",
                                }}
                              />

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Applied Position
                              </Typography>
                            </Box>

                            <Typography
                              fontWeight={600}
                              sx={{
                                mt: 0.5,
                              }}
                            >
                              {jobTitle}
                            </Typography>
                          </Box>

                          {/* Candidate ID hidden from UI */}
                          <Typography
                            sx={{
                              display: "none",
                            }}
                          >
                            {candidate._id}
                          </Typography>

                          {/* Actions */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mt: 2,
                            }}
                          >
                            <Button
                              fullWidth
                              variant="contained"
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
                                background:
                                  "linear-gradient(135deg,#6366f1,#8b5cf6)",
                              }}
                            >
                              Schedule Interview
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </Box>
            )}
        </Box>
      </Box>
    </Box>
  );
};

export default Candidate;