//import { useEffect, useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";

import  useJob  from "../../../hooks/useJob";
import useSavedJobs from "../../../hooks/useSavedJobs";

const ApplicantViewJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const {
    currentJob,
    loading,
    error,
    fetchJobById,
  } = useJob();

  //const [saved, setSaved] = useState(false);
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
   const saved = isJobSaved(jobId);
  // ==========================================
  // FETCH JOB
  // ==========================================

  useEffect(() => {
    if (jobId) {
      fetchJobById(jobId);
    }
  }, [jobId, fetchJobById]);

  // ==========================================
  // SAVE JOB
  // ==========================================

  const handleSaveJob = () => {
    toggleSaveJob(jobId);
    //setSaved((previous) => !previous);
    
    // Later connect this with backend:
    // saveJob(jobId)
    // removeSavedJob(jobId)
  };

  // ==========================================
  // APPLY JOB
  // ==========================================

  const handleApply = () => {
    navigate(`/applicant/jobs/${jobId}/apply`);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && !currentJob) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !currentJob) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="error">
          {error}
        </Alert>

        <Button
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            mt: 2,
            textTransform: "none",
          }}
          onClick={() =>
            navigate("/applicant/jobs")
          }
        >
          Back to Jobs
        </Button>
      </Box>
    );
  }

  // ==========================================
  // JOB NOT FOUND
  // ==========================================

  if (!currentJob) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="warning">
          Job not found.
        </Alert>

        <Button
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            mt: 2,
            textTransform: "none",
          }}
          onClick={() =>
            navigate("/applicant/jobs")
          }
        >
          Back to Jobs
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      {/* ==========================================
          BACK BUTTON
      ========================================== */}

      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() =>
          navigate("/applicant/jobs")
        }
        sx={{
          mb: 3,
          textTransform: "none",
        }}
      >
        Back to Jobs
      </Button>

      {/* ==========================================
          JOB HEADER
      ========================================== */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            {/* Job title */}
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  mb: 1,
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.2rem",
                  },
                }}
              >
                {currentJob.title}
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
              >
                {currentJob.company ||
                  "Company"}
              </Typography>
            </Box>

            {/* Save */}
            <IconButton
              onClick={handleSaveJob}
              color={saved ? "primary" : "default"}
              sx={{
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {saved ? (
                <BookmarkRoundedIcon />
              ) : (
                <BookmarkBorderRoundedIcon />
              )}
            </IconButton>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ==========================================
              JOB INFORMATION
          ========================================== */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={3}
            flexWrap="wrap"
          >
            {currentJob.location && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocationOnOutlinedIcon
                  color="action"
                />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Location
                  </Typography>

                  <Typography fontWeight={500}>
                    {currentJob.location}
                  </Typography>
                </Box>
              </Box>
            )}

            {currentJob.jobType && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <WorkOutlineRoundedIcon
                  color="action"
                />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Job Type
                  </Typography>

                  <Typography fontWeight={500}>
                    {currentJob.jobType}
                  </Typography>
                </Box>
              </Box>
            )}

            {currentJob.experience && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AccessTimeRoundedIcon
                  color="action"
                />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Experience
                  </Typography>

                  <Typography fontWeight={500}>
                    {currentJob.experience}
                  </Typography>
                </Box>
              </Box>
            )}

            {currentJob.salary && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BusinessCenterOutlinedIcon
                  color="action"
                />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Salary
                  </Typography>

                  <Typography fontWeight={500}>
                    {currentJob.salary}
                  </Typography>
                </Box>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* ==========================================
          APPLY SECTION
      ========================================== */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
          position: "sticky",
          top: 20,
          zIndex: 5,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Interested in this position?
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Submit your application and take the
              next step in your career.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleApply}
            sx={{
              minWidth: 150,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Apply Now
          </Button>
        </CardContent>
      </Card>

      {/* ==========================================
          DESCRIPTION
      ========================================== */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            About the Job
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              whiteSpace: "pre-line",
              lineHeight: 1.8,
            }}
          >
            {currentJob.description ||
              "No job description available."}
          </Typography>
        </CardContent>
      </Card>

      {/* ==========================================
          REQUIREMENTS
      ========================================== */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2} }
          >
            Requirements
          </Typography>

          {currentJob.requirements ? (
            <Typography
              color="text.secondary"
              sx={{
                whiteSpace: "pre-line",
                lineHeight: 1.8,
              }}
            >
              {currentJob.requirements}
            </Typography>
          ) : (
            <Typography color="text.secondary">
              No requirements provided.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* ==========================================
          SKILLS
      ========================================== */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2} }
          >
            Skills Required
          </Typography>

          {currentJob.skills?.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {currentJob.skills.map(
                (skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    variant="outlined"
                  />
                )
              )}
            </Box>
          ) : (
            <Typography color="text.secondary">
              No specific skills listed.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* ==========================================
          ADDITIONAL INFORMATION
      ========================================== */}

      {(currentJob.education ||
        currentJob.salary ||
        currentJob.deadline) && (
        <Card
          sx={{
            borderRadius: 3,
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2.5, md: 4 },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Additional Information
            </Typography>

            <Stack spacing={2}>
              {currentJob.education && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Education
                  </Typography>

                  <Typography fontWeight={500}>
                    {currentJob.education}
                  </Typography>
                </Box>
              )}

              {currentJob.salary && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Salary
                  </Typography>

                  <Typography fontWeight={500}>
                    {currentJob.salary}
                  </Typography>
                </Box>
              )}

              {currentJob.deadline && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Application Deadline
                  </Typography>

                  <Typography fontWeight={500}>
                    {new Date(
                      currentJob.deadline
                    ).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ApplicantViewJob;