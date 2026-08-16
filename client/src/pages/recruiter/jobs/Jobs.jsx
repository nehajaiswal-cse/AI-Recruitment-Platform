import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../../components/dashboard/Navbar";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Search,
  MoreVert,
  Work,
  People,
  LocationOn,
  CalendarToday,
  Edit,
  Delete,
  Visibility,
} from "@mui/icons-material";

import useJob from "../../../hooks/useJob";

const Jobs = () => {
  const navigate = useNavigate();

  const {
    jobs,
    loading,
    error,
    fetchMyJobs,
    removeJob,
  } = useJob();

  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // ==========================================
  // FETCH JOBS
  // ==========================================

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredJobs = jobs.filter((job) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query)
    );
  });

  // ==========================================
  // MENU
  // ==========================================

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async () => {
    if (!selectedJob) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedJob.title}"?`
    );

    if (!confirmed) return;

    try {
      await removeJob(selectedJob._id);
      handleMenuClose();
    } catch (err) {
      console.error("Delete job error:", err);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && jobs.length === 0) {
    return (
      <>
        <Navbar />

        <Box
          sx={{
            minHeight: "calc(100vh - 70px)",
            bgcolor: "#111827",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress
            size={42}
            sx={{
              color: "#8b5cf6",
            }}
          />
        </Box>
      </>
    );
  }

  return (
    <>
      {/* KEEP NAVBAR */}
      <Navbar />

      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          bgcolor: "#111827",
          color: "#fff",
          py: {
            xs: 3,
            md: 5,
          },
        }}
      >
        <Container maxWidth="xl">

          {/* ======================================
              HEADER
          ======================================= */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={3}
            sx={{
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.2rem",
                  },
                }}
              >
                Manage Jobs
              </Typography>

              <Typography
                sx={{
                  color: "#9ca3af",
                  mt: 0.7,
                }}
              >
                Create, manage and track your job postings.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() =>
                navigate("/recruiter/jobs/create")
              }
              sx={{
                minWidth: 150,
                px: 2.5,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, #6366f1, #8b5cf6)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4f46e5, #7c3aed)",
                },
              }}
            >
              Create Job
            </Button>
          </Stack>

          {/* ======================================
              ERROR
          ======================================= */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {/* ======================================
              SEARCH
          ======================================= */}

          <TextField
            fullWidth
            placeholder="Search jobs..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            sx={{
              maxWidth: 600,
              mb: 4,

              "& .MuiOutlinedInput-root": {
                bgcolor: "#1f2937",
                borderRadius: 2,

                "& fieldset": {
                  borderColor: "#374151",
                },

                "&:hover fieldset": {
                  borderColor: "#6366f1",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#8b5cf6",
                },
              },

              "& .MuiInputBase-input": {
                color: "#fff",
              },

              "& .MuiInputBase-input::placeholder": {
                color: "#9ca3af",
                opacity: 1,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search
                      sx={{
                        color: "#9ca3af",
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* ======================================
              EMPTY STATE
          ======================================= */}

          {!loading &&
            filteredJobs.length === 0 &&
            !error && (
              <Card
                sx={{
                  bgcolor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: 3,
                  textAlign: "center",
                  py: 8,
                  px: 3,
                }}
              >
                <Work
                  sx={{
                    fontSize: 60,
                    color: "#6b7280",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  {search
                    ? "No jobs found"
                    : "No jobs created yet"}
                </Typography>

                <Typography
                  sx={{
                    color: "#9ca3af",
                    mt: 1,
                  }}
                >
                  {search
                    ? "Try searching with a different keyword."
                    : "Create your first job posting to get started."}
                </Typography>

                {!search && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() =>
                      navigate(
                        "/recruiter/jobs/create"
                      )
                    }
                    sx={{
                      mt: 3,
                      textTransform: "none",
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    }}
                  >
                    Create Your First Job
                  </Button>
                )}
              </Card>
            )}

          {/* ======================================
              JOB CARDS
          ======================================= */}

          <Grid
            container
            spacing={3}
          >
            {filteredJobs.map((job) => (
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                  lg: 4,
                }}
                key={job._id}
              >
                <Card
                  sx={{
                    height: "100%",
                    bgcolor: "#1f2937",
                    color: "#fff",
                    borderRadius: 3,
                    border:
                      "1px solid #374151",
                    transition:
                      "all 0.25s ease",

                    "&:hover": {
                      transform:
                        "translateY(-4px)",
                      borderColor:
                        "#6366f1",
                      boxShadow:
                        "0 15px 35px rgba(0,0,0,0.25)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>

                    {/* JOB HEADER */}

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          alignItems:
                            "center",
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            minWidth: 48,
                            borderRadius: 2,
                            display: "flex",
                            justifyContent:
                              "center",
                            alignItems:
                              "center",
                            bgcolor:
                              "rgba(99,102,241,0.15)",
                          }}
                        >
                          <Work
                            sx={{
                              color:
                                "#818cf8",
                              fontSize: 25,
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 700,
                              fontSize:
                                "1.05rem",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {job.title ||
                              "Untitled Job"}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                "#9ca3af",
                              mt: 0.3,
                            }}
                          >
                            {job.company ||
                              "Your Company"}
                          </Typography>
                        </Box>
                      </Stack>

                      <IconButton
                        onClick={(event) =>
                          handleMenuOpen(
                            event,
                            job
                          )
                        }
                        sx={{
                          color:
                            "#9ca3af",
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Stack>

                    {/* STATUS */}

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={
                          job.status ===
                          "closed"
                            ? "Closed"
                            : "Active"
                        }
                        size="small"
                        sx={{
                          bgcolor:
                            job.status ===
                            "closed"
                              ? "rgba(239,68,68,0.12)"
                              : "rgba(34,197,94,0.12)",

                          color:
                            job.status ===
                            "closed"
                              ? "#f87171"
                              : "#4ade80",

                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Divider
                      sx={{
                        my: 2.5,
                        borderColor:
                          "#374151",
                      }}
                    />

                    {/* DETAILS */}

                    <Stack spacing={1.5}>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems:
                            "center",
                        }}
                      >
                        <LocationOn
                          sx={{
                            fontSize: 19,
                            color:
                              "#9ca3af",
                          }}
                        />

                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "#d1d5db",
                          }}
                        >
                          {job.location ||
                            "Remote"}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems:
                            "center",
                        }}
                      >
                        <People
                          sx={{
                            fontSize: 19,
                            color:
                              "#9ca3af",
                          }}
                        />

                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "#d1d5db",
                          }}
                        >
                          {job.applicantsCount ||
                            0}{" "}
                          Applicants
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems:
                            "center",
                        }}
                      >
                        <CalendarToday
                          sx={{
                            fontSize: 18,
                            color:
                              "#9ca3af",
                          }}
                        />

                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "#d1d5db",
                          }}
                        >
                          {job.createdAt
                            ? new Date(
                                job.createdAt
                              ).toLocaleDateString()
                            : "Recently"}
                        </Typography>
                      </Stack>

                    </Stack>

                    {/* SKILLS */}

                    {Array.isArray(
                      job.skills
                    ) &&
                      job.skills.length > 0 && (
                        <Stack
                          direction="row"
                          spacing={1}
                          useFlexGap
                          flexWrap="wrap"
                          sx={{
                            mt: 2.5,
                          }}
                        >
                          {job.skills
                            .slice(0, 4)
                            .map(
                              (
                                skill,
                                index
                              ) => (
                                <Chip
                                  key={
                                    index
                                  }
                                  label={
                                    skill
                                  }
                                  size="small"
                                  sx={{
                                    bgcolor:
                                      "rgba(99,102,241,0.12)",
                                    color:
                                      "#a5b4fc",
                                  }}
                                />
                              )
                            )}
                        </Stack>
                      )}

                    {/* ACTIONS */}

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 3 }}
                    >
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        startIcon={
                          <Visibility />
                        }
                        onClick={() =>
                          navigate(
                            `/recruiter/jobs/${job._id}`
                          )
                        }
                        sx={{
                          textTransform:
                            "none",
                          borderColor:
                            "#4b5563",
                          color:
                            "#d1d5db",

                          "&:hover": {
                            borderColor:
                              "#818cf8",
                            color:
                              "#a5b4fc",
                          },
                        }}
                      >
                        View
                      </Button>

                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        startIcon={
                          <People />
                        }
                        onClick={() =>
                          navigate(
                            `/recruiter/jobs/${job._id}/applicants`
                          )
                        }
                        sx={{
                          textTransform:
                            "none",
                          borderColor:
                            "#4b5563",
                          color:
                            "#d1d5db",

                          "&:hover": {
                            borderColor:
                              "#818cf8",
                            color:
                              "#a5b4fc",
                          },
                        }}
                      >
                        Applicants
                      </Button>
                    </Stack>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* ======================================
              MENU
          ======================================= */}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: "#1f2937",
                color: "#fff",
                border:
                  "1px solid #374151",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                navigate(
                  `/recruiter/jobs/${selectedJob?._id}`
                );
                handleMenuClose();
              }}
            >
              <Visibility
                sx={{ mr: 1.5 }}
              />
              View Job
            </MenuItem>

            <MenuItem
              onClick={() => {
                navigate(
                  `/recruiter/jobs/${selectedJob?._id}/edit`
                );
                handleMenuClose();
              }}
            >
              <Edit
                sx={{ mr: 1.5 }}
              />
              Edit Job
            </MenuItem>

            <MenuItem
              onClick={handleDelete}
              sx={{
                color: "#f87171",
              }}
            >
              <Delete
                sx={{ mr: 1.5 }}
              />
              Delete Job
            </MenuItem>
          </Menu>

        </Container>
      </Box>
    </>
  );
};

export default Jobs;