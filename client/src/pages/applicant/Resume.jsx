import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import ANavbar from "../../components/layout/applicant/Navbar";
import ASidebar from "../../components/layout/applicant/Sidebar";
import useResume from "../../hooks/useResume";
import { getResumeUrl } from "../../api/resumeApi";

const FILE_COLORS = {
  PDF: "#ef4444",
  DOCX: "#3b82f6",
  DOC: "#64748b",
};

const FileIcon = ({ type, size = 40 }) => (
  <Box
    sx={{
      width: size * 0.85,
      height: size,
      borderRadius: 1,
      bgcolor: FILE_COLORS[type] || "#64748b",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size > 36 ? 10 : 8,
      fontWeight: 700,
      flexShrink: 0,
    }}
  >
    {type}
  </Box>
);

const formatSize = (bytes) => {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const builderSections = [
  "Personal info",
  "Summary",
  "Education",
  "Skills",
  "Experience",
  "Projects",
  "Certifications",
  "Achievements",
  "Languages",
  "Social links",
];

const Resume = () => {
  const navigate = useNavigate();
  const {
    resumes,
    loading,
    uploading,
    error,
    fetchMyResumes,
    uploadResume,
    setDefaultResume,
    removeResume,
  } = useResume();

  const [jobDescription, setJobDescription] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");

  const [atsResult, setAtsResult] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState("");

  const fileInputRef = useRef(null);

  const atsBreakdown = atsResult
    ? [
        {
          label: "Skills match",
          value: atsResult.skillsMatch?.score ?? 0,
          color: "success.main",
        },
        {
          label: "Keywords match",
          value: atsResult.keywordMatch?.score ?? 0,
          color: "success.main",
        },
        {
          label: "Experience match",
          value: atsResult.experienceMatch?.score ?? 0,
          color: "primary.main",
        },
        {
          label: "Education match",
          value: atsResult.educationMatch?.score ?? 0,
          color: "success.main",
        },
        {
          label: "Formatting",
          value: atsResult.formattingScore?.score ?? 0,
          color: "warning.main",
        },
      ]
    : [];

  const suggestions = atsResult?.suggestions ?? [];

  const getScoreMessage = (score) => {
    if (score == null)
      return "Analyze your resume against a job description to see your ATS score.";
    if (score >= 80)
      return "Your resume is well optimized for this job and ATS systems.";
    if (score >= 60)
      return "Your resume is a good match, but there are a few areas you can improve.";
    if (score >= 40)
      return "Your resume has some matching content, but several areas need improvement.";
    return "Your resume needs improvement to better match this job description.";
  };

  useEffect(() => {
    fetchMyResumes();
  }, [fetchMyResumes]);

  useEffect(() => {
    if (resumes.length > 0 && !selectedResumeId) {
      const def = resumes.find((r) => r.isDefault) || resumes[0];
      setSelectedResumeId(def._id);
    }
  }, [resumes, selectedResumeId]);

  const defaultResume = resumes.find((r) => r.isDefault) || resumes[0];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadResume(file);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      e.target.value = "";
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultResume(id);
    } catch (err) {
      console.error("Set default failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeResume(id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleView = async (id) => {
    try {
      const { url } = await getResumeUrl(id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("View failed:", err);
    }
  };

  const handleDownload = async (id) => {
    try {
      const { url } = await getResumeUrl(id);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      setAtsError("Please select a resume and enter a job description.");
      return;
    }

    try {
      setAtsLoading(true);
      setAtsError("");
      setAtsResult(null);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in. Please log in again.");
      }

      const apiBaseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch("http://localhost:5000/api/ats/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          jobDescription,
        }),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Backend returned an invalid response. Please check the API URL.",
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze resume");
      }

      setAtsResult(data);
    } catch (error) {
      console.error("ATS analysis failed:", error);
      setAtsError(error.message);
    } finally {
      setAtsLoading(false);
    }
  };

  const cardSx = {
    p: { xs: 2, sm: 3 },
    mb: 2.5,
    borderRadius: 3,
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 50 }}>
        <ANavbar />
      </Box>

      <Box sx={{ display: "flex", minWidth: 0 }}>
        <ASidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
            />

            {/* HEADER */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  sx={{ fontSize: { xs: "28px", md: "32px" }, fontWeight: 700 }}
                >
                  My Resume
                </Typography>
                <Typography
                  sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}
                >
                  Manage your resumes, check ATS score and build a better
                  profile.
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                <Button
                  variant="outlined"
                  startIcon={<BuildOutlinedIcon />}
                  onClick={() => navigate("/applicant/resume-builder")}
                >
                  Resume builder
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    uploading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <UploadRoundedIcon />
                    )
                  }
                  onClick={handleUploadClick}
                  disabled={uploading}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {uploading ? "Uploading..." : "Upload resume"}
                </Button>
              </Stack>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* CURRENT / DEFAULT RESUME */}
                <Paper elevation={0} sx={cardSx}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: 2.5 }}
                  >
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                      Current / default resume
                    </Typography>
                    {defaultResume && (
                      <Chip
                        label="Default"
                        size="small"
                        sx={{
                          bgcolor: "rgba(16,185,129,0.15)",
                          color: "success.main",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Stack>

                  {defaultResume ? (
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems={{ xs: "stretch", sm: "center" }}
                    >
                      <FileIcon type={defaultResume.fileType} />

                      <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
                        <Typography
                          sx={{ fontSize: 14, fontWeight: 600 }}
                          noWrap
                        >
                          {defaultResume.fileName}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "text.secondary",
                            mt: 0.3,
                          }}
                        >
                          Last updated: {formatDate(defaultResume.updatedAt)}{" "}
                          &nbsp;•&nbsp; {formatSize(defaultResume.size)}
                        </Typography>
                      </Box>

                      <Button
                        variant="outlined"
                        endIcon={<OpenInNewRoundedIcon fontSize="small" />}
                        onClick={() => handleView(defaultResume._id)}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        View resume
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadRoundedIcon fontSize="small" />}
                        onClick={() => handleDownload(defaultResume._id)}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        Download
                      </Button>
                    </Stack>
                  ) : (
                    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                      No resume uploaded yet. Click "Upload resume" to add one.
                    </Typography>
                  )}
                </Paper>

                {/* ALL RESUMES */}
                <Paper elevation={0} sx={cardSx}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
                    All resumes
                  </Typography>

                  {resumes.length === 0 ? (
                    <Typography
                      sx={{ fontSize: 14, color: "text.secondary", py: 2 }}
                    >
                      No resumes uploaded yet.
                    </Typography>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: { xs: "none", sm: "grid" },
                          gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1fr",
                          fontSize: 11,
                          color: "text.secondary",
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                          pb: 1.5,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <span>Resume name</span>
                        <span>Uploaded</span>
                        <span>Updated</span>
                        <span>Status</span>
                        <span>Actions</span>
                      </Box>

                      {resumes.map((resume) => (
                        <Box
                          key={resume._id}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "minmax(0, 1fr) auto",
                              sm: "2.2fr 1fr 1fr 1fr 1fr",
                            },
                            gap: { xs: 1, sm: 0 },
                            alignItems: "center",
                            py: 1.5,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            "&:last-of-type": { borderBottom: "none" },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{ minWidth: 0 }}
                          >
                            <FileIcon type={resume.fileType} size={32} />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{ fontSize: 13, fontWeight: 500 }}
                                noWrap
                              >
                                {resume.fileName}
                              </Typography>
                            </Box>
                          </Stack>

                          <Typography
                            sx={{
                              display: { xs: "none", sm: "block" },
                              fontSize: 12,
                              color: "text.secondary",
                            }}
                          >
                            {formatDate(resume.createdAt)}
                          </Typography>

                          <Typography
                            sx={{
                              display: { xs: "none", sm: "block" },
                              fontSize: 12,
                              color: "text.secondary",
                            }}
                          >
                            {formatDate(resume.updatedAt)}
                          </Typography>

                          <Box sx={{ display: { xs: "none", sm: "block" } }}>
                            {resume.isDefault ? (
                              <Chip
                                label="Default"
                                size="small"
                                sx={{
                                  bgcolor: "rgba(16,185,129,0.15)",
                                  color: "success.main",
                                  fontWeight: 600,
                                }}
                              />
                            ) : (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleSetDefault(resume._id)}
                              >
                                Set default
                              </Button>
                            )}
                          </Box>

                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              size="small"
                              sx={{ color: "text.secondary" }}
                              onClick={() => handleView(resume._id)}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ color: "text.secondary" }}
                              onClick={() => handleDownload(resume._id)}
                            >
                              <DownloadRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ color: "error.main" }}
                              onClick={() => handleDelete(resume._id)}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      ))}

                      <Typography
                        sx={{
                          textAlign: "center",
                          fontSize: 12,
                          color: "text.secondary",
                          pt: 2,
                        }}
                      >
                        Showing 1 to {resumes.length} of {resumes.length}{" "}
                        resumes
                      </Typography>
                    </>
                  )}
                </Paper>
              </>
            )}

            {/* ATS SCORE + AI SUGGESTIONS */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2.5,
                mb: 2.5,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                    AI ATS score
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "primary.main",
                      cursor: "pointer",
                    }}
                  >
                    View history
                  </Typography>
                </Stack>

                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography
                    sx={{
                      fontSize: 38,
                      fontWeight: 700,
                      color: "success.main",
                      lineHeight: 1,
                    }}
                  >
                    {atsResult ? atsResult.overallScore : "--"}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 16,
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    >
                      /100
                    </Typography>
                  </Typography>

                  {atsResult && (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                      alignItems="center"
                      sx={{ mt: 0.5 }}
                    >
                      <StarRoundedIcon
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                      <Typography sx={{ fontSize: 12, color: "success.main" }}>
                        {atsResult.overallScore >= 80
                          ? "Strong score"
                          : atsResult.overallScore >= 60
                            ? "Good score"
                            : atsResult.overallScore >= 40
                              ? "Needs improvement"
                              : "Low match"}
                      </Typography>
                    </Stack>
                  )}

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      mt: 1,
                      maxWidth: 520,
                      mx: "auto",
                    }}
                  >
                    {getScoreMessage(atsResult?.overallScore)}
                  </Typography>
                </Box>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>
                  AI suggestions
                </Typography>

                <Stack spacing={0.5} sx={{ mb: 2 }}>
                  {suggestions.length > 0 ? (
                    suggestions.map((tip, index) => (
                      <Stack
                        key={`${tip}-${index}`}
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                        sx={{ py: 0.5 }}
                      >
                        <LightbulbOutlinedIcon
                          sx={{
                            fontSize: 16,
                            color: "warning.main",
                            mt: 0.2,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: "text.secondary",
                            lineHeight: 1.5,
                          }}
                        >
                          {tip}
                        </Typography>
                      </Stack>
                    ))
                  ) : (
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "text.secondary",
                        py: 1,
                      }}
                    >
                      Analyze a resume to get personalized suggestions.
                    </Typography>
                  )}
                </Stack>

                <Button
                  fullWidth
                  variant="outlined"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => navigate("/applicant/resume-builder")}
                >
                  Improve in resume builder
                </Button>
              </Paper>
            </Box>

            {/* AI ATS ANALYZER */}
            <Paper elevation={0} sx={cardSx}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.5 }}>
                AI ATS resume analyzer
              </Typography>
              <Typography
                sx={{ fontSize: 12, color: "text.secondary", mb: 2.5 }}
              >
                Check how well your resume matches the job description.
              </Typography>

              {atsError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {atsError}
                </Alert>
              )}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mb: 2.5,
                }}
              >
                <TextField
                  select
                  label="Select resume"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  size="small"
                  fullWidth
                  disabled={resumes.length === 0}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.default",
                    },
                  }}
                >
                  {resumes.map((r) => (
                    <MenuItem key={r._id} value={r._id}>
                      {r.fileName}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Job description"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={4}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "background.default",
                    },
                  }}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{ width: { xs: "100%", sm: "auto" } }}
                startIcon={
                  atsLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <AutoAwesomeRoundedIcon />
                  )
                }
                onClick={handleAnalyzeResume}
                disabled={
                  !selectedResumeId || !jobDescription.trim() || atsLoading
                }
              >
                {atsLoading ? "Analyzing..." : "Analyze resume"}
              </Button>
            </Paper>

            {/* RESUME BUILDER CHECKLIST */}
            <Paper id="resume-builder" elevation={0} sx={cardSx}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                Resume builder
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
                Create a professional resume step by step.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(5, 1fr)" },
                  gap: 1,
                  mb: 2.5,
                }}
              >
                {builderSections.map((section) => (
                  <Stack
                    key={section}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CheckCircleRoundedIcon
                      sx={{ fontSize: 16, color: "success.main" }}
                    />
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                      {section}
                    </Typography>
                  </Stack>
                ))}
              </Box>

              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate("/applicant/resume-builder")}
              >
                Continue building
              </Button>
            </Paper>

            {/* TIPS */}
            <Paper elevation={0} sx={{ ...cardSx, mb: 0 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <ShieldOutlinedIcon sx={{ color: "primary.main" }} />

                <Box sx={{ flex: 1, width: "100%" }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    Tips to improve your ATS score
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: "text.secondary", mt: 0.3 }}
                  >
                    Use relevant keywords, keep formatting clean, and quantify
                    your achievements.
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  View guidelines
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Resume;
