import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

// NOTE: adjust these two import paths if your recruiter navbar/sidebar
// components live somewhere else in the project.
import RNavbar from "../../components/layout/recruiter/Navbar";
import RSidebar from "../../components/layout/recruiter/Sidebar";

const SectionHeader = ({ icon, iconColor, iconBg, title }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: iconBg,
        color: iconColor,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{title}</Typography>
  </Stack>
);

const Row = ({ icon, iconColor, iconBg, title, subtitle, action, onClick }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    onClick={onClick}
    sx={{
      py: 1.75,
      gap: 2,
      borderBottom: "1px solid",
      borderColor: "divider",
      cursor: onClick ? "pointer" : "default",
      "&:last-of-type": { borderBottom: "none" },
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
      {icon && (
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: iconBg,
            color: iconColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{title}</Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.2, overflowWrap: "break-word" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
    {action && (
      <Box sx={{ flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>{action}</Box>
    )}
  </Stack>
);

// Compact toggle row used inside the 2-column notification / AI-preference grids
const ToggleRow = ({ title, checked, onChange }) => (
  <Row title={title} action={<Switch checked={checked} onChange={onChange} />} />
);

const RecruiterSettings = () => {
  const API_BASE = "http://localhost:5000";

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken");

  const apiRequest = async (path, options = {}) => {
    const token = getToken();

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Something went wrong");
    }

    return data;
  };

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const fieldSx = {
    "& .MuiOutlinedInput-root": { bgcolor: "background.default" },
  };

  const cardSx = {
    p: 3,
    mb: 2.5,
    borderRadius: 3,
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
  };

  // ---- Account ----
  const [account, setAccount] = useState({
    fullName: "Rahul Sharma",
    email: "rahul@techcorp.com",
    phone: "+91 98765 43210",
    jobTitle: "Senior HR Manager",
    companyName: "TechCorp Solutions",
    companyEmail: "hr@techcorp.com",
  });
  const [accountSaving, setAccountSaving] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const updateAccount = (field) => (e) =>
    setAccount((s) => ({ ...s, [field]: e.target.value }));

  const handleSaveAccount = async () => {
    setAccountSaving(true);
    try {
      const data = await apiRequest("/api/recruiter/settings/account", {
        method: "PUT",
        body: JSON.stringify(account),
      });
      if (data.settings?.account) {
        setAccount((prev) => ({ ...prev, ...data.settings.account }));
      }
      showSnackbar(data.message || "Account details updated");
    } catch (error) {
      showSnackbar(error.message || "Failed to update account", "error");
    } finally {
      setAccountSaving(false);
    }
  };

  // ---- Recruiter / company preferences ----
  const [prefs, setPrefs] = useState({
    companyName: "TechCorp Solutions",
    companyWebsite: "https://www.techcorp.com",
    industry: "IT Services",
    companySize: "201 - 500",
    recruiterDesignation: "HR Manager",
    defaultJobLocation: "Bangalore, India",
    defaultWorkMode: "Hybrid",
    defaultEmploymentType: "Full-time",
    preferredExperienceRange: "0 - 3 years",
    preferredEducationLevel: "Bachelor's Degree",
  });
  const [prefsSaving, setPrefsSaving] = useState(false);
  const updatePrefs = (field) => (e) =>
    setPrefs((s) => ({ ...s, [field]: e.target.value }));

  const [skills, setSkills] = useState(["React", "Node.js", "JavaScript"]);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  const addSkill = () => {
    const value = newSkill.trim();
    if (!value) {
      setShowSkillInput(false);
      return;
    }
    if (skills.length >= 10) {
      showSnackbar("You can add up to 10 skills only", "error");
      return;
    }
    if (!skills.includes(value)) {
      setSkills((prev) => [...prev, value]);
    }
    setNewSkill("");
    setShowSkillInput(false);
  };

  const handleSavePrefs = async () => {
    setPrefsSaving(true);
    try {
      const data = await apiRequest(
        "/api/recruiter/settings/company-preferences",
        {
          method: "PUT",
          body: JSON.stringify({ ...prefs, skills }),
        }
      );
      if (data.settings?.prefs) {
        const nextPrefs = { ...data.settings.prefs };
        delete nextPrefs.preferredSkills;
        setPrefs((prev) => ({ ...prev, ...nextPrefs }));
      }
      if (Array.isArray(data.settings?.skills)) setSkills(data.settings.skills);
      showSnackbar(data.message || "Recruiter preferences updated");
    } catch (error) {
      showSnackbar(error.message || "Failed to update preferences", "error");
    } finally {
      setPrefsSaving(false);
    }
  };

  // ---- Notifications ----
  const [notifications, setNotifications] = useState({
    newApplications: true,
    applicationStatusUpdates: true,
    interviewReminders: true,
    emailNotifications: true,
    newJobAlerts: true,
    candidateMessages: true,
    aiScreeningCompleted: true,
    pushNotifications: false,
  });
  const [notifSaving, setNotifSaving] = useState(false);
  const toggleNotification = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    try {
      const data = await apiRequest("/api/recruiter/settings/notifications", {
        method: "PUT",
        body: JSON.stringify(notifications),
      });
      if (data.notifications) {
        setNotifications((prev) => ({ ...prev, ...data.notifications }));
      }
      showSnackbar(data.message || "Notification preferences updated");
    } catch (error) {
      showSnackbar(error.message || "Failed to update notifications", "error");
    } finally {
      setNotifSaving(false);
    }
  };

  // ---- AI & recruitment preferences ----
  const [aiPrefs, setAiPrefs] = useState({
    aiCandidateMatching: true,
    autoRankCandidates: true,
    aiResumeScreening: true,
    autoHighlightSkills: true,
    interviewQuestionSuggestions: true,
    jobDescriptionSuggestions: true,
    minMatchingScore: 70,
    minAtsScore: 70,
  });
  const [aiPrefsSaving, setAiPrefsSaving] = useState(false);
  const toggleAiPref = (key) => setAiPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  const updateAiScore = (key) => (e) =>
    setAiPrefs((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSaveAiPrefs = async () => {
    setAiPrefsSaving(true);
    try {
      const data = await apiRequest("/api/recruiter/settings/ai-preferences", {
        method: "PUT",
        body: JSON.stringify({
          ...aiPrefs,
          minMatchingScore: Number(aiPrefs.minMatchingScore),
          minAtsScore: Number(aiPrefs.minAtsScore),
        }),
      });
      if (data.aiPrefs) setAiPrefs((prev) => ({ ...prev, ...data.aiPrefs }));
      showSnackbar(data.message || "AI & recruitment preferences updated");
    } catch (error) {
      showSnackbar(error.message || "Failed to update AI preferences", "error");
    } finally {
      setAiPrefsSaving(false);
    }
  };

  // ---- Hiring / job posting preferences ----
  const [hiring, setHiring] = useState({
    defaultJobVisibility: "Public",
    defaultApplicationDeadline: "30 days",
    automaticallyPublishJobs: true,
    allowResumeDownload: true,
    allowCandidateMessaging: true,
    enableAiScreeningForNewJobs: true,
  });
  const [hiringSaving, setHiringSaving] = useState(false);
  const updateHiringField = (field) => (e) =>
    setHiring((prev) => ({ ...prev, [field]: e.target.value }));
  const toggleHiring = (key) => setHiring((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSaveHiring = async () => {
    setHiringSaving(true);
    try {
      const data = await apiRequest(
        "/api/recruiter/settings/hiring-preferences",
        {
          method: "PUT",
          body: JSON.stringify(hiring),
        }
      );
      if (data.hiring) setHiring((prev) => ({ ...prev, ...data.hiring }));
      showSnackbar(data.message || "Hiring preferences updated");
    } catch (error) {
      showSnackbar(error.message || "Failed to update hiring preferences", "error");
    } finally {
      setHiringSaving(false);
    }
  };

  // ---- Privacy & security ----
  const [privacy, setPrivacy] = useState({
    profileVisibility: "Company only",
    whoCanViewCandidateData: "Team members",
  });
  const [privacySaving, setPrivacySaving] = useState(false);
  const updatePrivacyField = (field) => (e) =>
    setPrivacy((prev) => ({ ...prev, [field]: e.target.value }));

  const [twoFactor, setTwoFactor] = useState(true);
  const [twoFactorSaving, setTwoFactorSaving] = useState(false);

  const handleSavePrivacy = async () => {
    setPrivacySaving(true);
    try {
      const data = await apiRequest("/api/recruiter/settings/privacy", {
        method: "PUT",
        body: JSON.stringify(privacy),
      });
      if (data.privacy) {
        setPrivacy((prev) => ({ ...prev, ...data.privacy }));
        if (typeof data.privacy.twoFactorAuth === "boolean") {
          setTwoFactor(data.privacy.twoFactorAuth);
        }
      }
      showSnackbar(data.message || "Privacy settings updated");
    } catch (error) {
      showSnackbar(error.message || "Failed to update privacy settings", "error");
    } finally {
      setPrivacySaving(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    const nextValue = !twoFactor;
    setTwoFactor(nextValue);
    setTwoFactorSaving(true);
    try {
      const data = await apiRequest("/api/recruiter/settings/two-factor", {
        method: "PUT",
        body: JSON.stringify({ enabled: nextValue }),
      });
      if (typeof data.twoFactorAuth === "boolean") {
        setTwoFactor(data.twoFactorAuth);
      }
      showSnackbar(
        data.message ||
          `Two-factor authentication ${nextValue ? "enabled" : "disabled"}`
      );
    } catch (error) {
      setTwoFactor(!nextValue);
      showSnackbar(error.message || "Failed to update", "error");
    } finally {
      setTwoFactorSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const currentPassword = window.prompt("Enter your current password");
    if (currentPassword === null) return;

    const newPassword = window.prompt(
      "Enter your new password (minimum 6 characters)"
    );
    if (newPassword === null) return;

    if (newPassword.length < 6) {
      showSnackbar("New password must be at least 6 characters", "error");
      return;
    }

    try {
      const data = await apiRequest(
        "/api/recruiter/settings/change-password",
        {
          method: "PUT",
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );
      showSnackbar(data.message || "Password updated successfully");
    } catch (error) {
      showSnackbar(error.message || "Failed to change password", "error");
    }
  };

  // ---- Account management ----
  const [downloadSaving, setDownloadSaving] = useState(false);
  const [exportSaving, setExportSaving] = useState(false);

  const handleDownloadData = async () => {
    setDownloadSaving(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE}/api/recruiter/settings/download-data`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to download data");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "recruiter-data.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSnackbar("Your data has been downloaded");
    } catch (error) {
      showSnackbar(error.message || "Failed to download data", "error");
    } finally {
      setDownloadSaving(false);
    }
  };

  const handleExportData = async () => {
    setExportSaving(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE}/api/recruiter/settings/export-recruitment-data`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to export data");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "recruitment-data.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSnackbar("Recruitment data exported");
    } catch (error) {
      showSnackbar(error.message || "Failed to export data", "error");
    } finally {
      setExportSaving(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      setSettingsLoading(true);
      try {
        const data = await apiRequest("/api/recruiter/settings");
        if (!active || !data.settings) return;

        const s = data.settings;

        if (s.account) {
          setAccount((prev) => ({ ...prev, ...s.account }));
        }

        if (s.prefs) {
          const nextPrefs = { ...s.prefs };
          delete nextPrefs.preferredSkills;
          setPrefs((prev) => ({ ...prev, ...nextPrefs }));
        }

        if (Array.isArray(s.skills)) setSkills(s.skills);

        if (s.notifications) {
          setNotifications((prev) => ({ ...prev, ...s.notifications }));
        }

        if (s.aiPrefs) {
          setAiPrefs((prev) => ({ ...prev, ...s.aiPrefs }));
        }

        if (s.hiring) {
          setHiring((prev) => ({ ...prev, ...s.hiring }));
        }

        if (s.privacy) {
          setPrivacy((prev) => ({
            ...prev,
            profileVisibility:
              s.privacy.profileVisibility ?? prev.profileVisibility,
            whoCanViewCandidateData:
              s.privacy.whoCanViewCandidateData ??
              prev.whoCanViewCandidateData,
          }));

          if (typeof s.privacy.twoFactorAuth === "boolean") {
            setTwoFactor(s.privacy.twoFactorAuth);
          } else if (typeof s.privacy.twoFactorEnabled === "boolean") {
            setTwoFactor(s.privacy.twoFactorEnabled);
          }
        }
      } catch (error) {
        if (active) {
          showSnackbar(
            error.message || "Failed to load recruiter settings",
            "error"
          );
        }
      } finally {
        if (active) setSettingsLoading(false);
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 50 }}>
        <RNavbar />
      </Box>

      <Box sx={{ display: "flex", minWidth: 0 }}>
        <RSidebar />

        <Box component="main" sx={{ flex: 1, minWidth: 0, bgcolor: "background.default", color: "text.primary" }}>
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1000, mx: "auto" }}>
            {settingsLoading && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Loading your saved settings...
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: { xs: "28px", md: "32px" }, fontWeight: 700 }}>
                Settings
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>
                Manage your account, recruitment preferences and security settings.
              </Typography>
            </Box>

            {/* ACCOUNT */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<PersonOutlineRoundedIcon fontSize="small" />}
                iconColor="primary.main"
                iconBg="rgba(59,130,246,0.15)"
                title="Account"
              />

              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    fontWeight: 700,
                    fontSize: 22,
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  {account.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </Avatar>

                <Button
                  variant="outlined"
                  startIcon={<CameraAltOutlinedIcon />}
                  onClick={() => showSnackbar("Photo upload is coming soon", "info")}
                >
                  Change photo
                </Button>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField
                  label="Full name"
                  value={account.fullName}
                  onChange={updateAccount("fullName")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Email"
                  value={account.email}
                  onChange={updateAccount("email")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Phone number"
                  value={account.phone}
                  onChange={updateAccount("phone")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Job title / Designation"
                  value={account.jobTitle}
                  onChange={updateAccount("jobTitle")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Company name"
                  value={account.companyName}
                  onChange={updateAccount("companyName")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Company email"
                  value={account.companyEmail}
                  onChange={updateAccount("companyEmail")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button variant="outlined" onClick={handleChangePassword}>
                  Update password
                </Button>
                <Button variant="contained" onClick={handleSaveAccount} disabled={accountSaving}>
                  {accountSaving ? "Saving..." : "Save changes"}
                </Button>
              </Stack>
            </Paper>

            {/* RECRUITER / COMPANY PREFERENCES */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<ApartmentOutlinedIcon fontSize="small" />}
                iconColor="secondary.main"
                iconBg="rgba(147,51,234,0.15)"
                title="Recruiter / Company preferences"
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField
                  label="Company name"
                  value={prefs.companyName}
                  onChange={updatePrefs("companyName")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Company website"
                  value={prefs.companyWebsite}
                  onChange={updatePrefs("companyWebsite")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Industry"
                  value={prefs.industry}
                  onChange={updatePrefs("industry")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  select
                  label="Company size"
                  value={prefs.companySize}
                  onChange={updatePrefs("companySize")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="1 - 50">1 - 50</MenuItem>
                  <MenuItem value="51 - 200">51 - 200</MenuItem>
                  <MenuItem value="201 - 500">201 - 500</MenuItem>
                  <MenuItem value="500+">500+</MenuItem>
                </TextField>
                <TextField
                  label="Recruiter designation"
                  value={prefs.recruiterDesignation}
                  onChange={updatePrefs("recruiterDesignation")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Default job location"
                  value={prefs.defaultJobLocation}
                  onChange={updatePrefs("defaultJobLocation")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  select
                  label="Default work mode"
                  value={prefs.defaultWorkMode}
                  onChange={updatePrefs("defaultWorkMode")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="On-site">On-site</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Default employment type"
                  value={prefs.defaultEmploymentType}
                  onChange={updatePrefs("defaultEmploymentType")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Preferred experience range"
                  value={prefs.preferredExperienceRange}
                  onChange={updatePrefs("preferredExperienceRange")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="0 - 3 years">0 - 3 years</MenuItem>
                  <MenuItem value="3 - 5 years">3 - 5 years</MenuItem>
                  <MenuItem value="5 - 10 years">5 - 10 years</MenuItem>
                  <MenuItem value="10+ years">10+ years</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Preferred education level"
                  value={prefs.preferredEducationLevel}
                  onChange={updatePrefs("preferredEducationLevel")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Any">Any</MenuItem>
                  <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
                  <MenuItem value="Master's Degree">Master's Degree</MenuItem>
                  <MenuItem value="PhD">PhD</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1 }}>
                  Preferred skills (add up to 10)
                </Typography>

                <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
                  {skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => removeSkill(skill)}
                      deleteIcon={<CloseRoundedIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        bgcolor: "rgba(59,130,246,0.12)",
                        color: "primary.main",
                        fontWeight: 500,
                      }}
                    />
                  ))}

                  {showSkillInput ? (
                    <TextField
                      autoFocus
                      size="small"
                      value={newSkill}
                      placeholder="Skill name"
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      onBlur={addSkill}
                      sx={{ width: 140, ...fieldSx }}
                    />
                  ) : (
                    <Chip
                      label="Add skill"
                      icon={<AddRoundedIcon sx={{ fontSize: 14 }} />}
                      variant="outlined"
                      onClick={() => setShowSkillInput(true)}
                      sx={{ borderStyle: "dashed", cursor: "pointer" }}
                    />
                  )}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={handleSavePrefs} disabled={prefsSaving}>
                  {prefsSaving ? "Saving..." : "Save changes"}
                </Button>
              </Stack>
            </Paper>

            {/* NOTIFICATIONS */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<NotificationsNoneRoundedIcon fontSize="small" />}
                iconColor="success.main"
                iconBg="rgba(16,185,129,0.15)"
                title="Notifications"
              />

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, columnGap: 4 }}>
                <Box>
                  <ToggleRow
                    title="New applications"
                    checked={notifications.newApplications}
                    onChange={() => toggleNotification("newApplications")}
                  />
                  <ToggleRow
                    title="Application status updates"
                    checked={notifications.applicationStatusUpdates}
                    onChange={() => toggleNotification("applicationStatusUpdates")}
                  />
                  <ToggleRow
                    title="Interview reminders"
                    checked={notifications.interviewReminders}
                    onChange={() => toggleNotification("interviewReminders")}
                  />
                  <ToggleRow
                    title="Email notifications"
                    checked={notifications.emailNotifications}
                    onChange={() => toggleNotification("emailNotifications")}
                  />
                </Box>

                <Box>
                  <ToggleRow
                    title="New job alerts"
                    checked={notifications.newJobAlerts}
                    onChange={() => toggleNotification("newJobAlerts")}
                  />
                  <ToggleRow
                    title="Candidate messages"
                    checked={notifications.candidateMessages}
                    onChange={() => toggleNotification("candidateMessages")}
                  />
                  <ToggleRow
                    title="AI screening completed"
                    checked={notifications.aiScreeningCompleted}
                    onChange={() => toggleNotification("aiScreeningCompleted")}
                  />
                  <ToggleRow
                    title="Push notifications"
                    checked={notifications.pushNotifications}
                    onChange={() => toggleNotification("pushNotifications")}
                  />
                </Box>
              </Box>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleSaveNotifications} disabled={notifSaving}>
                  {notifSaving ? "Saving..." : "Save changes"}
                </Button>
              </Stack>
            </Paper>

            {/* AI & RECRUITMENT PREFERENCES */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<AutoAwesomeOutlinedIcon fontSize="small" />}
                iconColor="secondary.main"
                iconBg="rgba(147,51,234,0.15)"
                title="AI & recruitment preferences"
              />

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, columnGap: 4 }}>
                <Box>
                  <ToggleRow
                    title="AI candidate matching"
                    checked={aiPrefs.aiCandidateMatching}
                    onChange={() => toggleAiPref("aiCandidateMatching")}
                  />
                  <ToggleRow
                    title="Auto-rank candidates"
                    checked={aiPrefs.autoRankCandidates}
                    onChange={() => toggleAiPref("autoRankCandidates")}
                  />
                  <ToggleRow
                    title="AI resume screening"
                    checked={aiPrefs.aiResumeScreening}
                    onChange={() => toggleAiPref("aiResumeScreening")}
                  />
                </Box>
                <Box>
                  <ToggleRow
                    title="Auto-highlight matching skills"
                    checked={aiPrefs.autoHighlightSkills}
                    onChange={() => toggleAiPref("autoHighlightSkills")}
                  />
                  <ToggleRow
                    title="Interview question suggestions"
                    checked={aiPrefs.interviewQuestionSuggestions}
                    onChange={() => toggleAiPref("interviewQuestionSuggestions")}
                  />
                  <ToggleRow
                    title="Job description suggestions"
                    checked={aiPrefs.jobDescriptionSuggestions}
                    onChange={() => toggleAiPref("jobDescriptionSuggestions")}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mt: 3,
                }}
              >
                <TextField
                  label="Minimum matching score"
                  type="number"
                  value={aiPrefs.minMatchingScore}
                  onChange={updateAiScore("minMatchingScore")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Minimum ATS score"
                  type="number"
                  value={aiPrefs.minAtsScore}
                  onChange={updateAiScore("minAtsScore")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
              </Box>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleSaveAiPrefs} disabled={aiPrefsSaving}>
                  {aiPrefsSaving ? "Saving..." : "Save changes"}
                </Button>
              </Stack>
            </Paper>

            {/* HIRING / JOB POSTING PREFERENCES */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<WorkOutlineRoundedIcon fontSize="small" />}
                iconColor="warning.main"
                iconBg="rgba(245,158,11,0.15)"
                title="Hiring / job posting preferences"
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  select
                  label="Default job visibility"
                  value={hiring.defaultJobVisibility}
                  onChange={updateHiringField("defaultJobVisibility")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Company only">Company only</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Default application deadline"
                  value={hiring.defaultApplicationDeadline}
                  onChange={updateHiringField("defaultApplicationDeadline")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="15 days">15 days</MenuItem>
                  <MenuItem value="30 days">30 days</MenuItem>
                  <MenuItem value="45 days">45 days</MenuItem>
                  <MenuItem value="60 days">60 days</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, columnGap: 4 }}>
                <Box>
                  <ToggleRow
                    title="Automatically publish jobs"
                    checked={hiring.automaticallyPublishJobs}
                    onChange={() => toggleHiring("automaticallyPublishJobs")}
                  />
                  <ToggleRow
                    title="Allow resume download"
                    checked={hiring.allowResumeDownload}
                    onChange={() => toggleHiring("allowResumeDownload")}
                  />
                </Box>
                <Box>
                  <ToggleRow
                    title="Allow candidate messaging"
                    checked={hiring.allowCandidateMessaging}
                    onChange={() => toggleHiring("allowCandidateMessaging")}
                  />
                  <ToggleRow
                    title="Enable AI screening for new jobs"
                    checked={hiring.enableAiScreeningForNewJobs}
                    onChange={() => toggleHiring("enableAiScreeningForNewJobs")}
                  />
                </Box>
              </Box>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleSaveHiring} disabled={hiringSaving}>
                  {hiringSaving ? "Saving..." : "Save changes"}
                </Button>
              </Stack>
            </Paper>

            {/* PRIVACY & SECURITY */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<ShieldOutlinedIcon fontSize="small" />}
                iconColor="primary.main"
                iconBg="rgba(59,130,246,0.15)"
                title="Privacy and security"
              />

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 1 }}>
                <TextField
                  select
                  label="Profile visibility"
                  value={privacy.profileVisibility}
                  onChange={updatePrivacyField("profileVisibility")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Company only">Company only</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Who can view candidate data"
                  value={privacy.whoCanViewCandidateData}
                  onChange={updatePrivacyField("whoCanViewCandidateData")}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Only me">Only me</MenuItem>
                  <MenuItem value="Team members">Team members</MenuItem>
                  <MenuItem value="Entire company">Entire company</MenuItem>
                </TextField>
              </Box>

              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <Button variant="contained" size="small" onClick={handleSavePrivacy} disabled={privacySaving}>
                  {privacySaving ? "Saving..." : "Save changes"}
                </Button>
              </Stack>

              <Row
                icon={<DevicesOutlinedIcon fontSize="small" />}
                iconColor="primary.main"
                iconBg="rgba(59,130,246,0.15)"
                title="Login / session management"
                subtitle="Manage your active sessions"
                onClick={() => showSnackbar("Session management is coming soon", "info")}
                action={<ChevronRightRoundedIcon sx={{ color: "text.secondary" }} />}
              />

              <Row
                icon={<LockOutlinedIcon fontSize="small" />}
                iconColor="secondary.main"
                iconBg="rgba(147,51,234,0.15)"
                title="Change password"
                subtitle="Update your account password"
                onClick={handleChangePassword}
                action={<ChevronRightRoundedIcon sx={{ color: "text.secondary" }} />}
              />

              <Row
                icon={<VerifiedUserOutlinedIcon fontSize="small" />}
                iconColor="success.main"
                iconBg="rgba(16,185,129,0.15)"
                title="Two-factor authentication"
                subtitle="Add an extra layer of security"
                action={
                  <Switch checked={twoFactor} onChange={handleToggleTwoFactor} disabled={twoFactorSaving} />
                }
              />
            </Paper>

            {/* ACCOUNT MANAGEMENT */}
            <Paper elevation={0} sx={{ ...cardSx, borderColor: "rgba(239,68,68,0.35)" }}>
              <SectionHeader
                icon={<WarningAmberRoundedIcon fontSize="small" />}
                iconColor="error.main"
                iconBg="rgba(239,68,68,0.15)"
                title="Account management"
              />

              <Row
                icon={<CloudDownloadOutlinedIcon fontSize="small" />}
                iconColor="primary.main"
                iconBg="rgba(59,130,246,0.15)"
                title="Download my data"
                subtitle="Get a copy of your profile, jobs and recruitment data"
                action={
                  <Button
                    variant="outlined"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={handleDownloadData}
                    disabled={downloadSaving}
                  >
                    {downloadSaving ? "Preparing..." : "Download"}
                  </Button>
                }
              />

              <Row
                icon={<FileDownloadOutlinedIcon fontSize="small" />}
                iconColor="secondary.main"
                iconBg="rgba(147,51,234,0.15)"
                title="Export recruitment data"
                subtitle="Export jobs, candidates, applications and interview data"
                action={
                  <Button
                    variant="outlined"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={handleExportData}
                    disabled={exportSaving}
                  >
                    {exportSaving ? "Exporting..." : "Export"}
                  </Button>
                }
              />

              <Row
                icon={<PowerSettingsNewRoundedIcon fontSize="small" />}
                iconColor="warning.main"
                iconBg="rgba(245,158,11,0.15)"
                title="Deactivate account"
                subtitle="Temporarily hide your profile and company"
                action={
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={async () => {
                      if (!window.confirm("Deactivate your recruiter account?")) return;
                      try {
                        const data = await apiRequest(
                          "/api/recruiter/settings/deactivate",
                          { method: "POST" }
                        );
                        showSnackbar(data.message || "Account deactivated");
                      } catch (error) {
                        showSnackbar(
                          error.message || "Failed to deactivate account",
                          "error"
                        );
                      }
                    }}
                  >
                    Deactivate
                  </Button>
                }
              />

              <Row
                icon={<DeleteOutlineRoundedIcon fontSize="small" />}
                iconColor="error.main"
                iconBg="rgba(239,68,68,0.15)"
                title="Delete account"
                subtitle="Permanently remove your profile and account data"
                action={
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={async () => {
                      if (
                        !window.confirm(
                          "This permanently deletes your account. Continue?"
                        )
                      )
                        return;

                      try {
                        const data = await apiRequest(
                          "/api/recruiter/settings/account",
                          { method: "DELETE" }
                        );
                        showSnackbar(data.message || "Account deleted");
                      } catch (error) {
                        showSnackbar(
                          error.message || "Failed to delete account",
                          "error"
                        );
                      }
                    }}
                  >
                    Delete
                  </Button>
                }
              />
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecruiterSettings;