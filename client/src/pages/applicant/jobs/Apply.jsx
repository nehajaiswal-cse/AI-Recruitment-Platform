import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Stack,
  Paper,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";

import useJob  from "../../../hooks/useJob";
import { useApplication } from "../../../hooks/useApplication";

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // JOB CONTEXT
  // ==========================================

  const {
    currentJob,
    loading: jobLoading,
    error: jobError,
    fetchJobById,
  } = useJob();

  // ==========================================
  // APPLICATION CONTEXT
  // ==========================================

  const {
    submitApplication,
    loading: applicationLoading,
    error: applicationError,
  } = useApplication();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  // ==========================================
  // FETCH JOB
  // ==========================================

  useEffect(() => {
    if (jobId) {
      fetchJobById(jobId);
    }
  }, [jobId, fetchJobById]);

  // ==========================================
  // RESUME CHANGE
  // ==========================================

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFormError(
        "Please upload a PDF, DOC, or DOCX file."
      );

      setResume(null);
      return;
    }

    // 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setFormError(
        "Resume must be smaller than 5 MB."
      );

      setResume(null);
      return;
    }

    setFormError("");
    setResume(file);
  };

  // ==========================================
  // SUBMIT APPLICATION
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!resume) {
      setFormError(
        "Please upload your resume before applying."
      );
      return;
    }

    if (!jobId) {
      setFormError("Invalid job.");
      return;
    }

    try {
      const formData = new FormData();

      // Job ID comes from URL
      formData.append("jobId", jobId);

      // Resume
      formData.append("resume", resume);

      // Cover letter is optional
      if (coverLetter.trim()) {
        formData.append(
          "coverLetter",
          coverLetter.trim()
        );
      }

      /*
        DO NOT manually send:

        applicantId
        recruiterId
        applicationId

        Backend should handle those.
      */

      await submitApplication(formData);

      setSuccess(true);
    } catch (err) {
      console.error(
        "Submit application error:",
        err
      );

      setFormError(
        err.response?.data?.message ||
          "Failed to submit application."
      );
    }
  };

  // ==========================================
  // LOADING JOB
  // ==========================================

  if (jobLoading && !currentJob) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ==========================================
  // JOB ERROR
  // ==========================================

  if (jobError && !currentJob) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="error">
          {jobError}
        </Alert>

        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackRoundedIcon />}
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
          sx={{ mt: 2 }}
          startIcon={<ArrowBackRoundedIcon />}
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
  // SUCCESS
  // ==========================================

  if (success) {
    return (
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: 700,
          mx: "auto",
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <CheckCircleRoundedIcon
              color="success"
              sx={{
                fontSize: 75,
                mb: 2,
              }}
            />

            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ mb: 1 }}
            >
              Application Submitted!
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mb: 4,
                lineHeight: 1.7,
              }}
            >
              Your application for{" "}
              <strong>
                {currentJob.title}
              </strong>{" "}
              has been submitted successfully.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    "/applicant/applications"
                  )
                }
              >
                My Applications
              </Button>

              <Button
                variant="outlined"
                onClick={() =>
                  navigate("/applicant/jobs")
                }
              >
                Find More Jobs
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1100,
        mx: "auto",
      }}
    >
      {/* BACK */}

      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() =>
          navigate(`/applicant/jobs/${jobId}`)
        }
        sx={{
          mb: 3,
          textTransform: "none",
        }}
      >
        Back to Job
      </Button>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "0.8fr 1.5fr",
          },
          gap: 3,
        }}
      >
        {/* ======================================
            JOB SUMMARY
        ====================================== */}

        <Card
          sx={{
            borderRadius: 3,
            height: "fit-content",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ mb: 1 }}
            >
              {currentJob.title}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {currentJob.company ||
                "Company"}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {currentJob.location && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
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
                  mb: 2,
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
              <Box sx={{ mb: 2 }}>
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
            )}

            {currentJob.salary && (
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
            )}
          </CardContent>
        </Card>

        {/* ======================================
            APPLICATION FORM
        ====================================== */}

        <Card
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 2.5, md: 4 },
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ mb: 1 }}
            >
              Apply for this Job
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Upload your resume and add an
              optional cover letter.
            </Typography>

            {/* ERROR */}

            {(formError || applicationError) && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
              >
                {formError || applicationError}
              </Alert>
            )}

            {/* ==================================
                RESUME
            ================================== */}

            <Typography
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              Resume *
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: "center",
                borderStyle: "dashed",
                borderRadius: 2,
                mb: 1,
              }}
            >
              <CloudUploadRoundedIcon
                sx={{
                  fontSize: 40,
                  color: "text.secondary",
                  mb: 1,
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Upload your latest resume
              </Typography>

              <Button
                component="label"
                variant="outlined"
                sx={{
                  textTransform: "none",
                }}
              >
                {resume
                  ? "Change Resume"
                  : "Choose File"}

                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={
                    handleResumeChange
                  }
                />
              </Button>

              {resume && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    fontWeight: 500,
                    wordBreak: "break-word",
                  }}
                >
                  {resume.name}
                </Typography>
              )}
            </Paper>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Accepted: PDF, DOC, DOCX • Maximum
              size: 5 MB
            </Typography>

            {/* ==================================
                COVER LETTER
            ================================== */}

            <TextField
              fullWidth
              multiline
              minRows={6}
              label="Cover Letter"
              placeholder="Write a short message to the recruiter..."
              value={coverLetter}
              onChange={(event) =>
                setCoverLetter(event.target.value)
              }
              sx={{ mt: 4 }}
            />

            {/* ==================================
                SUBMIT
            ================================== */}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={
                applicationLoading
              }
              sx={{
                mt: 3,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {applicationLoading
                ? "Submitting Application..."
                : "Submit Application"}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Apply;