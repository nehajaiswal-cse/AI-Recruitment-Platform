import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  Edit,
  Work,
  LocationOn,
  BusinessCenter,
  School,
  Payments,
  CalendarToday,
  CheckCircle,
  Description,
} from "@mui/icons-material";

import useJob from "../../../hooks/useJob";

const ViewJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    currentJob,
    loading,
    error,
    fetchJobById,
  } = useJob();

  useEffect(() => {
    if (id) {
      fetchJobById(id);
    }
  }, [id, fetchJobById]);

  // ================================
  // LOADING
  // ================================

  if (loading && !currentJob) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#111827",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          size={42}
          sx={{ color: "#8b5cf6" }}
        />
      </Box>
    );
  }

  // ================================
  // ERROR
  // ================================

  if (error && !currentJob) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#111827",
          py: 5,
        }}
      >
        <Container maxWidth="lg">
          <Alert severity="error">
            {error}
          </Alert>

          <Button
            startIcon={<ArrowBack />}
            onClick={() =>
              navigate("/recruiter/jobs")
            }
            sx={{
              mt: 3,
              color: "#a5b4fc",
              textTransform: "none",
            }}
          >
            Back to Jobs
          </Button>
        </Container>
      </Box>
    );
  }

  if (!currentJob) {
    return null;
  }

  // ================================
  // HELPERS
  // ================================

  const formatJobType = (type) => {
    if (!type) return "Not specified";

    return type
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join("-");
  };

  const formatSalary = () => {
    const salary = currentJob.salary;

    if (!salary) {
      return "Not specified";
    }

    const min = salary.min;
    const max = salary.max;
    const currency = salary.currency || "INR";

    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    }

    if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    }

    if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }

    return "Not specified";
  };

  const formatExperience = () => {
    const experience = currentJob.experience;

    if (!experience) {
      return "Not specified";
    }

    const min = experience.min;
    const max = experience.max;

    if (
      min !== undefined &&
      max !== undefined
    ) {
      return `${min} - ${max} years`;
    }

    if (min !== undefined) {
      return `${min}+ years`;
    }

    if (max !== undefined) {
      return `Up to ${max} years`;
    }

    return "Not specified";
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const status = currentJob.status || "draft";

  const statusConfig = {
    draft: {
      label: "Draft",
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.12)",
    },
    published: {
      label: "Published",
      color: "#4ade80",
      bg: "rgba(34,197,94,0.12)",
    },
    archived: {
      label: "Archived",
      color: "#f87171",
      bg: "rgba(239,68,68,0.12)",
    },
  };

  const currentStatus =
    statusConfig[status] ||
    statusConfig.draft;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#111827",
        color: "#fff",
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Container maxWidth="lg">

        {/* ================================
            HEADER
        ================================= */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            mb: 4,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() =>
                navigate("/recruiter/jobs")
              }
              sx={{
                color: "#d1d5db",
                textTransform: "none",
                borderColor: "#374151",
              }}
              variant="outlined"
            >
              Back
            </Button>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                Job Details
              </Typography>

              <Typography
                sx={{
                  color: "#9ca3af",
                  mt: 0.5,
                }}
              >
                View your job posting details.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() =>
              navigate(
                `/recruiter/jobs/${id}/edit`
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, #6366f1, #8b5cf6)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #4f46e5, #7c3aed)",
              },
            }}
          >
            Edit Job
          </Button>
        </Stack>

        {/* ================================
            MAIN JOB CARD
        ================================= */}

        <Card
          sx={{
            bgcolor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: 3,
            color: "#fff",
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >

            {/* JOB TITLE */}

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
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor:
                      "rgba(99,102,241,0.15)",
                  }}
                >
                  <Work
                    sx={{
                      fontSize: 32,
                      color: "#818cf8",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {currentJob.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#9ca3af",
                      mt: 0.5,
                    }}
                  >
                    {currentJob.company ||
                      "Your Company"}
                  </Typography>
                </Box>
              </Stack>

              <Chip
                label={currentStatus.label}
                icon={<CheckCircle />}
                sx={{
                  bgcolor:
                    currentStatus.bg,
                  color:
                    currentStatus.color,
                  fontWeight: 600,
                  "& .MuiChip-icon": {
                    color:
                      currentStatus.color,
                  },
                }}
              />
            </Stack>

            <Divider
              sx={{
                my: 4,
                borderColor: "#374151",
              }}
            />

            {/* JOB INFO */}

            <Grid
              container
              spacing={3}
            >
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <InfoItem
                  icon={<LocationOn />}
                  label="Location"
                  value={
                    currentJob.location ||
                    "Not specified"
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <InfoItem
                  icon={<BusinessCenter />}
                  label="Employment Type"
                  value={formatJobType(
                    currentJob.employmentType
                  )}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <InfoItem
                  icon={<Work />}
                  label="Experience"
                  value={formatExperience()}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <InfoItem
                  icon={<Payments />}
                  label="Salary"
                  value={formatSalary()}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <InfoItem
                  icon={<School />}
                  label="Education"
                  value={
                    currentJob.education ||
                    "Not specified"
                  }
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <InfoItem
                  icon={<CalendarToday />}
                  label="Application Deadline"
                  value={formatDate(
                    currentJob.deadline
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ================================
            DESCRIPTION
        ================================= */}

        <Card
          sx={{
            bgcolor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: 3,
            color: "#fff",
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >
            <SectionTitle
              icon={<Description />}
              title="Job Description"
            />

            <Typography
              sx={{
                color: "#d1d5db",
                lineHeight: 1.8,
                whiteSpace: "pre-line",
              }}
            >
              {currentJob.description ||
                "No description provided."}
            </Typography>
          </CardContent>
        </Card>

        {/* ================================
            SKILLS
        ================================= */}

        <Card
          sx={{
            bgcolor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: 3,
            color: "#fff",
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 4,
              },
            }}
          >
            <SectionTitle
              icon={<Work />}
              title="Required Skills"
            />

            {Array.isArray(
              currentJob.skills
            ) &&
            currentJob.skills.length > 0 ? (
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{
                  flexWrap: "wrap",
                }}
              >
                {currentJob.skills.map(
                  (skill, index) => (
                    <Chip
                      key={`${skill}-${index}`}
                      label={skill}
                      sx={{
                        bgcolor:
                          "rgba(99,102,241,0.12)",
                        color: "#a5b4fc",
                        border:
                          "1px solid rgba(99,102,241,0.25)",
                      }}
                    />
                  )
                )}
              </Stack>
            ) : (
              <Typography
                sx={{
                  color: "#9ca3af",
                }}
              >
                No skills specified.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* ================================
            FOOTER INFO
        ================================= */}

        <Card
          sx={{
            bgcolor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              sx={{
                justifyContent:
                  "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9ca3af",
                  }}
                >
                  Created
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  {formatDate(
                    currentJob.createdAt
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9ca3af",
                  }}
                >
                  Last Updated
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  {formatDate(
                    currentJob.updatedAt
                  )}
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() =>
                  navigate(
                    `/recruiter/jobs/${id}/edit`
                  )
                }
                sx={{
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #6366f1, #8b5cf6)",
                }}
              >
                Edit Job
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

// ==========================================
// INFO ITEM
// ==========================================

const InfoItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor:
            "rgba(99,102,241,0.12)",
          color: "#818cf8",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="body2"
          sx={{
            color: "#9ca3af",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            color: "#fff",
            fontWeight: 500,
            mt: 0.2,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
};

// ==========================================
// SECTION TITLE
// ==========================================

const SectionTitle = ({
  icon,
  title,
}) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box
        sx={{
          color: "#818cf8",
          display: "flex",
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: "#fff",
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
};

export default ViewJob;