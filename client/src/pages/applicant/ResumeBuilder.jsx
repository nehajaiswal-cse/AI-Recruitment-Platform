import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";

import {
  getMyBuilderResume,
  saveBuilderResume,
  exportBuilderResume,
} from "../../api/resumeBuilderApi";

import ANavbar from "../../components/layout/applicant/Navbar";

/* ------------------------------------------------------------------ */
/* Config                                                             */
/* ------------------------------------------------------------------ */

const STEPS = [
  { key: "personal", label: "Personal Info", sub: "Basic information" },
  { key: "summary", label: "Professional Summary", sub: "Add a summary" },
  { key: "education", label: "Education", sub: "Add your education" },
  { key: "experience", label: "Experience", sub: "Add work experience" },
  { key: "projects", label: "Projects", sub: "Add your projects" },
  { key: "skills", label: "Skills", sub: "Add your skills" },
  { key: "certifications", label: "Certifications", sub: "Add certifications" },
  { key: "achievements", label: "Achievements", sub: "Add achievements" },
  { key: "preview", label: "Preview", sub: "Review and download" },
];

export const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    desc: "Clean, accent-coloured headings",
    font: '"Inter", "Roboto", "Helvetica", sans-serif',
    accent: "#2563eb",
    headerAlign: "left",
    rule: "accent",
  },
  {
    id: "classic",
    name: "Classic",
    desc: "Traditional serif, centred header",
    font: 'Georgia, "Times New Roman", serif',
    accent: "#111827",
    headerAlign: "center",
    rule: "solid",
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Lots of whitespace, no rules",
    font: '"Inter", "Roboto", "Helvetica", sans-serif',
    accent: "#0f172a",
    headerAlign: "left",
    rule: "none",
  },
];

const EMPTY_DATA = {
  template: "modern",
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
};

const newEducation = () => ({
  institution: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
  grade: "",
});
const newExperience = () => ({
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
});
const newProject = () => ({ name: "", tech: "", link: "", description: "" });
const newCertification = () => ({ name: "", issuer: "", year: "" });

// Input styling to match Resume.jsx (fields sit on background.default inside a paper)
const fieldSx = {
  "& .MuiOutlinedInput-root": { bgcolor: "background.default" },
};

const cardSx = {
  borderRadius: 3,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
};

/* ------------------------------------------------------------------ */
/* Preview helpers                                                    */
/* ------------------------------------------------------------------ */

const Placeholder = ({ text }) => (
  <span style={{ color: "#9ca3af", fontStyle: "italic" }}>{text}</span>
);
const PreviewSection = ({ tpl, title, children }) => {
  const template = tpl.id || "modern";

  const styles = {
    modern: {
      color: tpl.accent || "#2563eb",
      border: `2px solid ${tpl.accent || "#2563eb"}`,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: 700,
    },

    classic: {
      color: "#111827",
      border: "1px solid #111827",
      textTransform: "none",
      letterSpacing: "0.04em",
      fontWeight: 700,
    },

    minimal: {
      color: "#4b5563",
      border: "none",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontWeight: 600,
    },
  };

  const style = styles[template] || styles.modern;

  return (
    <div style={{ marginTop: 18 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: style.fontWeight,
          letterSpacing: style.letterSpacing,
          textTransform: style.textTransform,
          color: style.color,
          paddingBottom: 5,
          marginBottom: 7,
          borderBottom: style.border,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 11.5,
          lineHeight: 1.5,
          color: "#374151",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

const ResumeBuilder = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState(EMPTY_DATA);
  const [resumeId, setResumeId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [templateAnchor, setTemplateAnchor] = useState(null);

  const [skillInput, setSkillInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  const [toast, setToast] = useState({
    open: false,
    msg: "",
    severity: "success",
  });
  const notify = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const tpl = useMemo(
    () => TEMPLATES.find((t) => t.id === data.template) || TEMPLATES[0],
    [data.template],
  );

  const currentStep = STEPS[activeStep];
  const progress = ((activeStep + 1) / STEPS.length) * 100;

  /* ------------------------- load existing draft ------------------------ */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const existing = await getMyBuilderResume();
        if (active && existing && existing._id) {
          setResumeId(existing._id);
          setData({ ...EMPTY_DATA, ...existing });
        }
      } catch {
        // no saved draft yet / backend not ready — start fresh silently
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  /* --------------------------- data mutators --------------------------- */
  const setPersonal = (field, value) =>
    setData((d) => ({ ...d, personal: { ...d.personal, [field]: value } }));

  const addItem = (section, factory) =>
    setData((d) => ({ ...d, [section]: [...d[section], factory()] }));

  const updateItem = (section, index, field, value) =>
    setData((d) => ({
      ...d,
      [section]: d[section].map((it, i) =>
        i === index ? { ...it, [field]: value } : it,
      ),
    }));

  const removeItem = (section, index) =>
    setData((d) => ({
      ...d,
      [section]: d[section].filter((_, i) => i !== index),
    }));

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    setData((d) => ({ ...d, skills: [...d.skills, v] }));
    setSkillInput("");
  };
  const addAchievement = () => {
    const v = achievementInput.trim();
    if (!v) return;
    setData((d) => ({ ...d, achievements: [...d.achievements, v] }));
    setAchievementInput("");
  };

  /* ----------------------------- actions ------------------------------- */
  const persist = async () => {
    const saved = await saveBuilderResume(resumeId, data);
    if (saved && saved._id) setResumeId(saved._id);
    return saved;
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      await persist();
      notify("Draft saved");
    } catch (err) {
      notify(err.message || "Could not save draft", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const handleSaveAndContinue = async () => {
    const isLast = activeStep === STEPS.length - 1;
    if (!isLast) setActiveStep((s) => s + 1);
    // fire-and-forget save; only surface errors so navigation stays smooth
    try {
      setSaving(true);
      await persist();
      if (isLast) notify("Resume saved");
    } catch (err) {
      notify(
        err.message || "Couldn't save to the server — you can keep editing",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Preferred path: backend renders the PDF (and stores to S3) → { url }
      const { url } = await exportBuilderResume(data);
      if (!url) throw new Error("No file url returned");
      window.open(url, "_blank");
      notify("Download started");
    } catch (err) {
      // Fallback so Download always works even before the export API is live
      printResume(data, tpl);
      notify("Opened print view (backend export unavailable)", "info");
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenPreview = () => {
    sessionStorage.setItem("resumeBuilderPreview", JSON.stringify(data));

    window.open("/applicant/resume-builder/preview", "_blank");
  };

  const chooseTemplate = (id) => {
    setData((d) => ({ ...d, template: id }));
    setTemplateAnchor(null);
  };

  /* ------------------------------ render ------------------------------- */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* ---------------------- Applicant Navbar ---------------------- */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <ANavbar />
      </Box>

      {/* ----------------------- Builder Content ---------------------- */}
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* ---------------------------- Header ---------------------------- */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography sx={{ fontSize: { xs: 28, md: 32 }, fontWeight: 700 }}>
              Resume Builder
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>
              Build your professional resume step by step.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ width: "auto" }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={
                saving ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  <SaveOutlinedIcon />
                )
              }
              onClick={handleSaveDraft}
              disabled={saving}
              sx={{
                px: 1.8,
                py: 1,
                minWidth: 120,
                fontSize: 13,
              }}
            >
              Save Draft
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<VisibilityRoundedIcon />}
              onClick={handleOpenPreview}
              sx={{
                px: 1.8,
                py: 1,
                minWidth: 145,
                fontSize: 13,
              }}
            >
              Preview Resume
            </Button>
          </Stack>
        </Stack>

        {/* --------------------------- 3-col grid ------------------------- */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "270px minmax(0, 1fr) 400px",
            },
            gap: 2.5,
            alignItems: "start",
          }}
        >
          {/* -------------------------- Steps nav ------------------------- */}
          <Paper
            elevation={0}
            sx={{
              ...cardSx,
              p: 1.5,
              position: { lg: "sticky" },
              top: { lg: 16 },
            }}
          >
            <Box sx={{ px: 1, pt: 1, pb: 1.5 }}>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                Step {activeStep + 1} of {STEPS.length}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </Box>

            <Stack spacing={0.5}>
              {STEPS.map((step, index) => {
                const isActive = index === activeStep;
                const isDone = index < activeStep;
                return (
                  <Stack
                    key={step.key}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    onClick={() => setActiveStep(index)}
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor: isActive ? "primary.main" : "transparent",
                      bgcolor: isActive ? "action.selected" : "transparent",
                      transition: "background-color .15s ease",
                      "&:hover": {
                        bgcolor: isActive ? "action.selected" : "action.hover",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 600,
                        color: isActive || isDone ? "#fff" : "text.secondary",
                        bgcolor:
                          isActive || isDone ? "primary.main" : "transparent",
                        border: "1px solid",
                        borderColor:
                          isActive || isDone ? "primary.main" : "divider",
                      }}
                    >
                      {isDone ? (
                        <CheckRoundedIcon sx={{ fontSize: 16 }} />
                      ) : (
                        index + 1
                      )}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 13.5,
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "text.primary" : "text.primary",
                          lineHeight: 1.2,
                        }}
                        noWrap
                      >
                        {step.label}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 11.5, color: "text.secondary" }}
                        noWrap
                      >
                        {step.sub}
                      </Typography>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          </Paper>

          {/* --------------------------- Form area ------------------------ */}
          <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, sm: 3 } }}>
            <StepForm
              step={currentStep.key}
              data={data}
              setPersonal={setPersonal}
              setData={setData}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
              skillInput={skillInput}
              setSkillInput={setSkillInput}
              addSkill={addSkill}
              achievementInput={achievementInput}
              setAchievementInput={setAchievementInput}
              addAchievement={addAchievement}
              templates={TEMPLATES}
              onChooseTemplate={chooseTemplate}
            />

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" justifyContent="space-between">
              <Button
                variant="outlined"
                startIcon={<ArrowBackRoundedIcon />}
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button
                variant="contained"
                endIcon={
                  activeStep === STEPS.length - 1 ? (
                    <SaveOutlinedIcon />
                  ) : (
                    <ArrowForwardRoundedIcon />
                  )
                }
                onClick={handleSaveAndContinue}
              >
                {activeStep === STEPS.length - 1
                  ? "Save Resume"
                  : "Save & Continue"}
              </Button>
            </Stack>
          </Paper>

          {/* ---------------------------- Preview ------------------------- */}
          <Box sx={{ position: { lg: "sticky" }, top: { lg: 16 } }}>
            <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, sm: 3 } }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ mb: 0.5 }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                  Resume Preview
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DashboardCustomizeRoundedIcon fontSize="small" />}
                  onClick={(e) => setTemplateAnchor(e.currentTarget)}
                >
                  Change Template
                </Button>
              </Stack>
              <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
                Live preview of your resume.
              </Typography>

              <ResumePreview data={data} tpl={tpl} />

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={
                  downloading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <DownloadRoundedIcon />
                  )
                }
                onClick={handleDownload}
                disabled={downloading}
                sx={{ mt: 2 }}
              >
                {downloading ? "Preparing..." : "Download Resume"}
              </Button>
            </Paper>
          </Box>

          <Menu
            anchorEl={templateAnchor}
            open={Boolean(templateAnchor)}
            onClose={() => setTemplateAnchor(null)}
          >
            <MenuItem
              selected={data.template === "modern"}
              onClick={() => {
                setData((prev) => ({
                  ...prev,
                  template: "modern",
                }));
                setTemplateAnchor(null);
              }}
            >
              Modern
            </MenuItem>

            <MenuItem
              selected={data.template === "classic"}
              onClick={() => {
                setData((prev) => ({
                  ...prev,
                  template: "classic",
                }));
                setTemplateAnchor(null);
              }}
            >
              Classic
            </MenuItem>

            <MenuItem
              selected={data.template === "minimal"}
              onClick={() => {
                setData((prev) => ({
                  ...prev,
                  template: "minimal",
                }));
                setTemplateAnchor(null);
              }}
            >
              Minimal
            </MenuItem>
          </Menu>
        </Box>

        {/* ----------------------- Template menu ------------------------- */}
        <Menu
          anchorEl={templateAnchor}
          open={Boolean(templateAnchor)}
          onClose={() => setTemplateAnchor(null)}
        >
          {TEMPLATES.map((t) => (
            <MenuItem
              key={t.id}
              selected={t.id === data.template}
              onClick={() => chooseTemplate(t.id)}
              sx={{ gap: 1.5, minWidth: 220 }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {t.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  {t.desc}
                </Typography>
              </Box>
              {t.id === data.template && (
                <CheckRoundedIcon fontSize="small" color="primary" />
              )}
            </MenuItem>
          ))}
        </Menu>

        <Snackbar
          open={toast.open}
          autoHideDuration={3500}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={toast.severity}
            variant="filled"
            onClose={() => setToast((t) => ({ ...t, open: false }))}
          >
            {toast.msg}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

/* ================================================================== */
/* Step forms                                                         */
/* ================================================================== */

const FormHeading = ({ title, subtitle }) => (
  <Box sx={{ mb: 3 }}>
    <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{title}</Typography>
    <Typography sx={{ mt: 0.5, fontSize: 13.5, color: "text.secondary" }}>
      {subtitle}
    </Typography>
  </Box>
);

const twoCol = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  gap: 2,
};

const ItemCard = ({ title, onRemove, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      mb: 2,
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "background.default",
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 1.5 }}
    >
      <Typography
        sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary" }}
      >
        {title}
      </Typography>
      <Tooltip title="Remove">
        <IconButton size="small" color="error" onClick={onRemove}>
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
    {children}
  </Paper>
);

const EmptyHint = ({ text }) => (
  <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
    {text}
  </Typography>
);

const StepForm = (props) => {
  const {
    step,
    data,
    setPersonal,
    setData,
    addItem,
    updateItem,
    removeItem,
    skillInput,
    setSkillInput,
    addSkill,
    achievementInput,
    setAchievementInput,
    addAchievement,
    templates,
    onChooseTemplate,
  } = props;

  switch (step) {
    /* ----------------------------- Personal ---------------------------- */
    case "personal":
      return (
        <>
          <FormHeading
            title="Personal Information"
            subtitle="Add your basic information. This will appear at the top of your resume."
          />
          <Box sx={twoCol}>
            <TextField
              required
              label="Full Name"
              placeholder="Enter your full name"
              value={data.personal.fullName}
              onChange={(e) => setPersonal("fullName", e.target.value)}
              size="small"
              fullWidth
              sx={fieldSx}
            />
            <TextField
              required
              label="Email Address"
              placeholder="your.email@example.com"
              value={data.personal.email}
              onChange={(e) => setPersonal("email", e.target.value)}
              size="small"
              fullWidth
              sx={fieldSx}
            />
            <TextField
              required
              label="Phone Number"
              placeholder="+91 9876543210"
              value={data.personal.phone}
              onChange={(e) => setPersonal("phone", e.target.value)}
              size="small"
              fullWidth
              sx={fieldSx}
            />
            <TextField
              required
              label="Location"
              placeholder="City, State, Country"
              value={data.personal.location}
              onChange={(e) => setPersonal("location", e.target.value)}
              size="small"
              fullWidth
              sx={fieldSx}
            />
            <TextField
              label="LinkedIn Profile"
              placeholder="https://linkedin.com/in/yourname"
              value={data.personal.linkedin}
              onChange={(e) => setPersonal("linkedin", e.target.value)}
              size="small"
              fullWidth
              sx={fieldSx}
            />
            <TextField
              label="GitHub Profile"
              placeholder="https://github.com/yourname"
              value={data.personal.github}
              onChange={(e) => setPersonal("github", e.target.value)}
              size="small"
              fullWidth
              sx={fieldSx}
            />
          </Box>
          <TextField
            label="Portfolio / Website"
            placeholder="https://yourportfolio.com"
            value={data.personal.portfolio}
            onChange={(e) => setPersonal("portfolio", e.target.value)}
            size="small"
            fullWidth
            sx={{ ...fieldSx, mt: 2 }}
          />
        </>
      );

    /* ----------------------------- Summary ----------------------------- */
    case "summary":
      return (
        <>
          <FormHeading
            title="Professional Summary"
            subtitle="Write 2-4 sentences describing your experience, strengths and goals."
          />
          <TextField
            label="Summary"
            placeholder="Results-driven software engineer with 3+ years of experience building scalable web applications..."
            value={data.summary}
            onChange={(e) =>
              setData((d) => ({ ...d, summary: e.target.value }))
            }
            size="small"
            fullWidth
            multiline
            minRows={6}
            sx={fieldSx}
          />
          <Typography sx={{ mt: 1, fontSize: 12, color: "text.secondary" }}>
            {data.summary.length} characters
          </Typography>
        </>
      );

    /* ---------------------------- Education ---------------------------- */
    case "education":
      return (
        <>
          <FormHeading
            title="Education"
            subtitle="Add your degrees, starting with the most recent."
          />
          {data.education.length === 0 && (
            <EmptyHint text="No education added yet. Click the button below to add one." />
          )}
          {data.education.map((ed, i) => (
            <ItemCard
              key={i}
              title={`Education ${i + 1}`}
              onRemove={() => removeItem("education", i)}
            >
              <Box sx={twoCol}>
                <TextField
                  label="Institution"
                  value={ed.institution}
                  onChange={(e) =>
                    updateItem("education", i, "institution", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Degree"
                  placeholder="B.Tech, M.Sc, ..."
                  value={ed.degree}
                  onChange={(e) =>
                    updateItem("education", i, "degree", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Field of Study"
                  value={ed.field}
                  onChange={(e) =>
                    updateItem("education", i, "field", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Grade / CGPA"
                  value={ed.grade}
                  onChange={(e) =>
                    updateItem("education", i, "grade", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Start Year"
                  placeholder="2020"
                  value={ed.startYear}
                  onChange={(e) =>
                    updateItem("education", i, "startYear", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="End Year"
                  placeholder="2024 (or Present)"
                  value={ed.endYear}
                  onChange={(e) =>
                    updateItem("education", i, "endYear", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
              </Box>
            </ItemCard>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={() => addItem("education", newEducation)}
          >
            Add education
          </Button>
        </>
      );

    /* --------------------------- Experience ---------------------------- */
    case "experience":
      return (
        <>
          <FormHeading
            title="Work Experience"
            subtitle="List your roles, starting with the most recent."
          />
          {data.experience.length === 0 && (
            <EmptyHint text="No experience added yet. Add your first role below." />
          )}
          {data.experience.map((ex, i) => (
            <ItemCard
              key={i}
              title={`Experience ${i + 1}`}
              onRemove={() => removeItem("experience", i)}
            >
              <Box sx={twoCol}>
                <TextField
                  label="Company"
                  value={ex.company}
                  onChange={(e) =>
                    updateItem("experience", i, "company", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Role / Title"
                  value={ex.role}
                  onChange={(e) =>
                    updateItem("experience", i, "role", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Start Date"
                  placeholder="Jan 2023"
                  value={ex.startDate}
                  onChange={(e) =>
                    updateItem("experience", i, "startDate", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="End Date"
                  placeholder="Present"
                  value={ex.endDate}
                  onChange={(e) =>
                    updateItem("experience", i, "endDate", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
              </Box>
              <TextField
                label="Description"
                placeholder="What you did and achieved (use bullet-style lines)"
                value={ex.description}
                onChange={(e) =>
                  updateItem("experience", i, "description", e.target.value)
                }
                size="small"
                fullWidth
                multiline
                minRows={3}
                sx={{ ...fieldSx, mt: 2 }}
              />
            </ItemCard>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={() => addItem("experience", newExperience)}
          >
            Add experience
          </Button>
        </>
      );

    /* ----------------------------- Projects ---------------------------- */
    case "projects":
      return (
        <>
          <FormHeading
            title="Projects"
            subtitle="Showcase the work you're most proud of."
          />
          {data.projects.length === 0 && (
            <EmptyHint text="No projects added yet. Add one to highlight your work." />
          )}
          {data.projects.map((pr, i) => (
            <ItemCard
              key={i}
              title={`Project ${i + 1}`}
              onRemove={() => removeItem("projects", i)}
            >
              <Box sx={twoCol}>
                <TextField
                  label="Project Name"
                  value={pr.name}
                  onChange={(e) =>
                    updateItem("projects", i, "name", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Tech Stack"
                  placeholder="React, Node, MongoDB"
                  value={pr.tech}
                  onChange={(e) =>
                    updateItem("projects", i, "tech", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
              </Box>
              <TextField
                label="Link"
                placeholder="https://github.com/you/project"
                value={pr.link}
                onChange={(e) =>
                  updateItem("projects", i, "link", e.target.value)
                }
                size="small"
                fullWidth
                sx={{ ...fieldSx, mt: 2 }}
              />
              <TextField
                label="Description"
                value={pr.description}
                onChange={(e) =>
                  updateItem("projects", i, "description", e.target.value)
                }
                size="small"
                fullWidth
                multiline
                minRows={3}
                sx={{ ...fieldSx, mt: 2 }}
              />
            </ItemCard>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={() => addItem("projects", newProject)}
          >
            Add project
          </Button>
        </>
      );

    /* ------------------------------ Skills ----------------------------- */
    case "skills":
      return (
        <>
          <FormHeading
            title="Skills"
            subtitle="Add your technical and soft skills. Press Enter to add each one."
          />
          <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
            <TextField
              label="Add a skill"
              placeholder="e.g. JavaScript"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              size="small"
              fullWidth
              sx={fieldSx}
            />
            <Button
              variant="contained"
              onClick={addSkill}
              sx={{ flexShrink: 0 }}
            >
              Add
            </Button>
          </Stack>
          {data.skills.length === 0 ? (
            <EmptyHint text="No skills added yet." />
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {data.skills.map((s, i) => (
                <Chip
                  key={`${s}-${i}`}
                  label={s}
                  onDelete={() => removeItem("skills", i)}
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>
          )}
        </>
      );

    /* -------------------------- Certifications ------------------------- */
    case "certifications":
      return (
        <>
          <FormHeading
            title="Certifications"
            subtitle="Add any certifications or licenses you've earned."
          />
          {data.certifications.length === 0 && (
            <EmptyHint text="No certifications added yet." />
          )}
          {data.certifications.map((c, i) => (
            <ItemCard
              key={i}
              title={`Certification ${i + 1}`}
              onRemove={() => removeItem("certifications", i)}
            >
              <Box sx={twoCol}>
                <TextField
                  label="Name"
                  value={c.name}
                  onChange={(e) =>
                    updateItem("certifications", i, "name", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Issuer"
                  value={c.issuer}
                  onChange={(e) =>
                    updateItem("certifications", i, "issuer", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Year"
                  placeholder="2024"
                  value={c.year}
                  onChange={(e) =>
                    updateItem("certifications", i, "year", e.target.value)
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
              </Box>
            </ItemCard>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={() => addItem("certifications", newCertification)}
          >
            Add certification
          </Button>
        </>
      );

    /* --------------------------- Achievements -------------------------- */
    case "achievements":
      return (
        <>
          <FormHeading
            title="Achievements"
            subtitle="Awards, recognitions, or notable accomplishments."
          />
          <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
            <TextField
              label="Add an achievement"
              placeholder="e.g. Won 1st place at XYZ Hackathon"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAchievement();
                }
              }}
              size="small"
              fullWidth
              sx={fieldSx}
            />
            <Button
              variant="contained"
              onClick={addAchievement}
              sx={{ flexShrink: 0 }}
            >
              Add
            </Button>
          </Stack>
          {data.achievements.length === 0 ? (
            <EmptyHint text="No achievements added yet." />
          ) : (
            <Stack spacing={1}>
              {data.achievements.map((a, i) => (
                <Stack
                  key={`${a}-${i}`}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.default",
                  }}
                >
                  <Typography sx={{ fontSize: 13.5 }}>{a}</Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeItem("achievements", i)}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          )}
        </>
      );

    /* ----------------------------- Preview ----------------------------- */
    case "preview":
      return (
        <>
          <FormHeading
            title="Review & Download"
            subtitle="Pick a template, review the live preview, then download your resume."
          />
          <Typography sx={{ fontSize: 13.5, fontWeight: 600, mb: 1.5 }}>
            Choose a template
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 1.5,
              mb: 3,
            }}
          >
            {templates.map((t) => {
              const selected = t.id === data.template;
              return (
                <Paper
                  key={t.id}
                  elevation={0}
                  onClick={() => onChooseTemplate(t.id)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor: selected ? "primary.main" : "divider",
                    bgcolor: "background.default",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                      {t.name}
                    </Typography>
                    {selected && (
                      <CheckRoundedIcon fontSize="small" color="primary" />
                    )}
                  </Stack>
                  <Typography
                    sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
                  >
                    {t.desc}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
          <Alert severity="info" variant="outlined">
            Your resume preview updates live on the right. Use “Download Resume”
            to export it.
          </Alert>
        </>
      );

    default:
      return null;
  }
};

/* ================================================================== */
/* Live preview (white "paper")                                       */
/* ================================================================== */

export const ResumePreview = ({ data, tpl, fullPage = false }) => {
  const p = data.personal || {};

  /*
   * IMPORTANT:
   * TEMPLATES uses `id`, not `template`.
   * So we must use tpl.id here.
   */
  const template = tpl?.id || data.template || "modern";

  /*
   * Safe fallback in case tpl is missing.
   */
  const activeTpl =
    TEMPLATES.find((t) => t.id === template) || TEMPLATES[0];

  const contactLine = [
    p.email,
    p.phone,
  ]
    .filter(Boolean)
    .join("  |  ");

  /*
   * Template-specific styles
   */
  const templateStyles = {
    modern: {
      nameSize: 22,
      nameWeight: 700,
      nameColor: "#111827",

      sectionColor: activeTpl.accent,
      sectionBorder: `2px solid ${activeTpl.accent}`,
      sectionTransform: "uppercase",
      sectionSpacing: 18,

      bodyColor: "#374151",
      bodyFontSize: 11.5,
      lineHeight: 1.5,

      headerAlign: "left",
      socialJustify: "flex-start",
    },

    classic: {
      nameSize: 23,
      nameWeight: 700,
      nameColor: "#111827",

      sectionColor: "#111827",
      sectionBorder: "1px solid #111827",
      sectionTransform: "none",
      sectionSpacing: 16,

      bodyColor: "#374151",
      bodyFontSize: 11.5,
      lineHeight: 1.5,

      headerAlign: "center",
      socialJustify: "center",
    },

    minimal: {
      nameSize: 22,
      nameWeight: 600,
      nameColor: "#111827",

      sectionColor: "#4b5563",
      sectionBorder: "none",
      sectionTransform: "uppercase",
      sectionSpacing: 22,

      bodyColor: "#374151",
      bodyFontSize: 11.5,
      lineHeight: 1.55,

      headerAlign: "left",
      socialJustify: "flex-start",
    },
  };

  const style = templateStyles[template] || templateStyles.modern;

  return (
    <Box
      id="resume-preview-paper"
      sx={{
        width: "100%",
        boxSizing: "border-box",

        bgcolor: "#ffffff",
        color: "#111827",

        /*
         * Normal preview = card
         * Full page = content determines height
         */
        borderRadius: fullPage ? 0 : 2,

        p: fullPage
          ? {
              xs: 3,
              sm: 5,
              md: 6,
            }
          : 2.5,

        /*
         * IMPORTANT:
         * No fixed/minimum height for full page.
         * Resume will end exactly after its content.
         */
        minHeight: "auto",
        height: "auto",

        maxHeight: fullPage ? "none" : 620,
        overflowY: fullPage ? "visible" : "auto",

        fontFamily: activeTpl.font,

        border: fullPage ? "none" : "1px solid #e5e7eb",

        /*
         * Prevent weird page stretching.
         */
        "& > *:last-child": {
          marginBottom: 0,
        },
      }}
    >
      {/* ============================================================ */}
      {/* HEADER                                                        */}
      {/* ============================================================ */}

      <div
        style={{
          textAlign: style.headerAlign,
        }}
      >
        {/* Name */}
        <div
          className="resume-name"
          style={{
            fontSize: style.nameSize,
            fontWeight: style.nameWeight,
            color: style.nameColor,
            lineHeight: 1.2,
          }}
        >
          {p.fullName || "Your Name"}
        </div>

        {/* Email + Phone */}
        <div
          style={{
            fontSize: 11.5,
            color: "#374151",
            marginTop: 4,
          }}
        >
          {contactLine || "your.email@example.com  |  +91 9876543210"}
        </div>

        {/* Location */}
        <div
          style={{
            fontSize: 11.5,
            color: "#374151",
            marginTop: 1,
          }}
        >
          {p.location || "City, State, Country"}
        </div>

        {/* Social Links */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 7,
            justifyContent: style.socialJustify,
            fontSize: 11,
            color: "#374151",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <LinkedInIcon sx={{ fontSize: 14 }} />
            {p.linkedin
              ? cleanUrl(p.linkedin)
              : "linkedin.com/in/yourname"}
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <GitHubIcon sx={{ fontSize: 14 }} />
            {p.github
              ? cleanUrl(p.github)
              : "github.com/yourname"}
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <LanguageRoundedIcon sx={{ fontSize: 14 }} />
            {p.portfolio
              ? cleanUrl(p.portfolio)
              : "yourportfolio.com"}
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SUMMARY                                                       */}
      {/* ============================================================ */}

      <PreviewSection
        tpl={{
          ...activeTpl,
          id: "modern",
          accent: style.sectionColor,
          rule: template === "minimal" ? "none" : template === "classic" ? "solid" : "accent",
        }}
        title="Professional Summary"
      >
        {data.summary ? (
          <div style={{ whiteSpace: "pre-line" }}>
            {data.summary}
          </div>
        ) : (
          <Placeholder text="Your summary will appear here..." />
        )}
      </PreviewSection>

      {/* ============================================================ */}
      {/* EDUCATION                                                     */}
      {/* ============================================================ */}

      {data.education?.length > 0 ? (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Education"
        >
          {data.education.map((ed, i) => (
            <div
              key={i}
              style={{
                marginBottom: i === data.education.length - 1 ? 0 : 8,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {ed.degree || "Degree"}
                {ed.field ? `, ${ed.field}` : ""}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span>
                  {ed.institution || "Institution"}
                </span>

                <span
                  style={{
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                  }}
                >
                  {[ed.startYear, ed.endYear]
                    .filter(Boolean)
                    .join(" - ")}
                </span>
              </div>

              {ed.grade && (
                <div style={{ color: "#6b7280" }}>
                  Grade: {ed.grade}
                </div>
              )}
            </div>
          ))}
        </PreviewSection>
      ) : (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Education"
        >
          <Placeholder text="Your education details will appear here..." />
        </PreviewSection>
      )}

      {/* ============================================================ */}
      {/* EXPERIENCE                                                    */}
      {/* ============================================================ */}

      {data.experience?.length > 0 ? (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Experience"
        >
          {data.experience.map((ex, i) => (
            <div
              key={i}
              style={{
                marginBottom: i === data.experience.length - 1 ? 0 : 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {ex.role || "Role"}
                </span>

                <span
                  style={{
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                  }}
                >
                  {[ex.startDate, ex.endDate]
                    .filter(Boolean)
                    .join(" - ")}
                </span>
              </div>

              <div
                style={{
                  color: "#374151",
                }}
              >
                {ex.company || "Company"}
              </div>

              {ex.description && (
                <div
                  style={{
                    whiteSpace: "pre-line",
                    marginTop: 3,
                  }}
                >
                  {ex.description}
                </div>
              )}
            </div>
          ))}
        </PreviewSection>
      ) : (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Experience"
        >
          <Placeholder text="Your experience details will appear here..." />
        </PreviewSection>
      )}

      {/* ============================================================ */}
      {/* PROJECTS                                                      */}
      {/* ============================================================ */}

      {data.projects?.length > 0 ? (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Projects"
        >
          {data.projects.map((pr, i) => (
            <div
              key={i}
              style={{
                marginBottom: i === data.projects.length - 1 ? 0 : 10,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {pr.name || "Project"}

                {pr.tech && (
                  <span
                    style={{
                      fontWeight: 400,
                      color: "#6b7280",
                    }}
                  >
                    {" "}
                    — {pr.tech}
                  </span>
                )}
              </div>

              {pr.description && (
                <div
                  style={{
                    whiteSpace: "pre-line",
                    marginTop: 2,
                  }}
                >
                  {pr.description}
                </div>
              )}

              {pr.link && (
                <div
                  style={{
                    color: "#2563eb",
                    marginTop: 2,
                  }}
                >
                  {cleanUrl(pr.link)}
                </div>
              )}
            </div>
          ))}
        </PreviewSection>
      ) : (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Projects"
        >
          <Placeholder text="Your projects will appear here..." />
        </PreviewSection>
      )}

      {/* ============================================================ */}
      {/* SKILLS                                                        */}
      {/* ============================================================ */}

      {data.skills?.length > 0 ? (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Skills"
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {data.skills.map((s, i) => (
              <span
                key={`${s}-${i}`}
                style={{
                  background:
                    template === "minimal"
                      ? "transparent"
                      : "#f3f4f6",

                  border:
                    template === "minimal"
                      ? "none"
                      : "1px solid #e5e7eb",

                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 11,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </PreviewSection>
      ) : (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Skills"
        >
          <Placeholder text="Your skills will appear here..." />
        </PreviewSection>
      )}

      {/* ============================================================ */}
      {/* CERTIFICATIONS                                                */}
      {/* ============================================================ */}

      {data.certifications?.length > 0 ? (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Certifications"
        >
          {data.certifications.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginBottom:
                  i === data.certifications.length - 1 ? 0 : 5,
              }}
            >
              <span>
                {c.name || "Certification"}
                {c.issuer ? ` — ${c.issuer}` : ""}
              </span>

              {c.year && (
                <span
                  style={{
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.year}
                </span>
              )}
            </div>
          ))}
        </PreviewSection>
      ) : (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Certifications"
        >
          <Placeholder text="Your certifications will appear here..." />
        </PreviewSection>
      )}

      {/* ============================================================ */}
      {/* ACHIEVEMENTS                                                   */}
      {/* ============================================================ */}

      {data.achievements?.length > 0 ? (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Achievements"
        >
          <ul
            style={{
              margin: 0,
              paddingLeft: 17,
            }}
          >
            {data.achievements.map((a, i) => (
              <li key={`${a}-${i}`}>
                {a}
              </li>
            ))}
          </ul>
        </PreviewSection>
      ) : (
        <PreviewSection
          tpl={{
            ...activeTpl,
            id: template,
            accent: style.sectionColor,
            rule:
              template === "minimal"
                ? "none"
                : template === "classic"
                ? "solid"
                : "accent",
          }}
          title="Achievements"
        >
          <Placeholder text="Your achievements will appear here..." />
        </PreviewSection>
      )}
    </Box>
  );
};
export default ResumeBuilder;