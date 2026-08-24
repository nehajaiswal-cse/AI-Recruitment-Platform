import{ useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { useCandidate } from "../../hooks/useCandidate";

import RNavbar from "../../components/layout/recruiter/Navbar";
import RSidebar from "../../components/layout/recruiter/Sidebar";

const Candidate = () => {
  const {
    candidates,
    loading,
    error,
    fetchCandidates,
  } = useCandidate();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates?.filter((candidate) => {
    const name =
      candidate?.applicantId?.name ||
      candidate?.applicantId?.fullName ||
      "";

    const email =
      candidate?.applicantId?.email || "";

    const jobTitle =
      candidate?.jobId?.title ||
      candidate?.jobId?.jobTitle ||
      "";

    const searchText = search.toLowerCase();

    return (
      name.toLowerCase().includes(searchText) ||
      email.toLowerCase().includes(searchText) ||
      jobTitle.toLowerCase().includes(searchText)
    );
  });

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

      {/* Sidebar + Main */}
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
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                gap: 2,
                mb: 4,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  Candidates
                </Typography>

                <Typography color="text.secondary">
                  Candidates are automatically added when applicants apply for jobs.
                </Typography>
              </Box>

              {/* Search */}
              <TextField
                fullWidth
                placeholder="Search candidates by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  maxWidth: {
                    xs: "100%",
                    md: 400,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

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

            {/* Error */}
            {!loading && error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Empty State */}
            {!loading &&
              !error &&
              filteredCandidates?.length === 0 && (
                <Card
                  sx={{
                    borderRadius: 3,
                    textAlign: "center",
                    py: 8,
                  }}
                >
                  <CardContent>
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
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Candidates will appear here automatically when applicants
                      apply for your jobs.
                    </Typography>
                  </CardContent>
                </Card>
              )}

            {/* Candidate List */}
            {!loading &&
              !error &&
              filteredCandidates?.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      lg: "1fr 1fr 1fr",
                    },
                    gap: 3,
                  }}
                >
                  {filteredCandidates.map((candidate) => {
                    const applicant = candidate?.applicantId || {};
                    const job = candidate?.jobId || {};

                    const name =
                      applicant.name ||
                      applicant.fullName ||
                      "Unknown Candidate";

                    const email =
                      applicant.email || "No email";

                    const jobTitle =
                      job.title ||
                      job.jobTitle ||
                      "Job not available";

                    const status =
                      candidate.status ||
                      candidate.applicationStatus ||
                      "Applied";

                    return (
                      <Card
                        key={candidate._id}
                        sx={{
                          borderRadius: 3,
                          transition: "0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: 5,
                          },
                        }}
                      >
                        <CardContent>
                          {/* Candidate Info */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 3,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 52,
                                height: 52,
                              }}
                            >
                              {name.charAt(0).toUpperCase()}
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="h6"
                                fontWeight={600}
                                noWrap
                              >
                                {name}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                              >
                                {email}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Applied Job */}
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Applied For
                          </Typography>

                          <Typography
                            fontWeight={600}
                            sx={{ mb: 2 }}
                          >
                            {jobTitle}
                          </Typography>

                          {/* Status */}
                          <Chip
                            label={status}
                            size="small"
                            variant="outlined"
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Candidate;