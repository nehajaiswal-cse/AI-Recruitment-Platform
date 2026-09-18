import { useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
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
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import ANavbar from "../../components/layout/applicant/Navbar";
import ASidebar from "../../components/layout/applicant/Sidebar";

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
      borderBottom: "1px solid",
      borderColor: "divider",
      cursor: onClick ? "pointer" : "default",
      "&:last-of-type": { borderBottom: "none" },
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
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

      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{title}</Typography>

        {subtitle && (
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.2 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>

    {action}
  </Stack>
);

const Settings = () => {
  // Account
  const [name, setName] = useState("Aarav Sharma");
  const [email, setEmail] = useState("aarav.sharma@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");

  // Job preferences
  const [role, setRole] = useState("Frontend developer");
  const [location, setLocation] = useState("Bengaluru, India");
  const [workMode, setWorkMode] = useState("Hybrid");
  const [salary, setSalary] = useState("10 - 14 LPA");
  const [experience, setExperience] = useState("Mid level (2-4 yrs)");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [skills, setSkills] = useState(["React", "JavaScript", "Node.js"]);

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  // Notifications
  const [notifications, setNotifications] = useState({
    jobRecommendations: true,
    newJobAlerts: true,
    applicationUpdates: true,
    recruiterMessages: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState("Public");
  const [resumeVisibility, setResumeVisibility] = useState("Recruiters only");
  const [twoFactor, setTwoFactor] = useState(false);

  const cardSx = {
    p: 3,
    mb: 2.5,
    borderRadius: 3,
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "background.default",
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 50 }}>
        <ANavbar />
      </Box>

      <Box sx={{ display: "flex", minWidth: 0 }}>
        <ASidebar />

        <Box component="main" sx={{ flex: 1, minWidth: 0, bgcolor: "background.default", color: "text.primary" }}>
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1000 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: { xs: "28px", md: "32px" }, fontWeight: 700 }}>
                Settings
              </Typography>

              <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>
                Manage your account, preferences and privacy settings.
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
                  {name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </Avatar>

                <Button variant="outlined" startIcon={<CameraAltOutlinedIcon />}>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />

                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />

                <TextField
                  label="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button variant="outlined">Update password</Button>
                <Button variant="contained">Save changes</Button>
              </Stack>
            </Paper>

            {/* JOB PREFERENCES */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<WorkOutlineRoundedIcon fontSize="small" />}
                iconColor="secondary.main"
                iconBg="rgba(147,51,234,0.15)"
                title="Profile / job preferences"
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField
                  select
                  label="Preferred role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Frontend developer">Frontend developer</MenuItem>
                  <MenuItem value="Backend developer">Backend developer</MenuItem>
                  <MenuItem value="Full stack developer">Full stack developer</MenuItem>
                </TextField>

                <TextField
                  label="Preferred location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />

                <TextField
                  select
                  label="Work mode"
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                  <MenuItem value="On-site">On-site</MenuItem>
                </TextField>

                <TextField
                  label="Expected salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />

                <TextField
                  select
                  label="Experience level"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Fresher">Fresher</MenuItem>
                  <MenuItem value="Mid level (2-4 yrs)">Mid level (2-4 yrs)</MenuItem>
                  <MenuItem value="Senior (5+ yrs)">Senior (5+ yrs)</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Employment type"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1 }}>
                  Skills (add up to 10)
                </Typography>

                <Stack direction="row" flexWrap="wrap" gap={1}>
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

                  <Chip
                    label="Add skill"
                    icon={<AddRoundedIcon sx={{ fontSize: 14 }} />}
                    variant="outlined"
                    sx={{ borderStyle: "dashed" }}
                  />
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained">Save changes</Button>
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

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  columnGap: 4,
                }}
              >
                <Box>
                  <Row
                    title="Job recommendations"
                    action={
                      <Switch
                        checked={notifications.jobRecommendations}
                        onChange={() => toggleNotification("jobRecommendations")}
                      />
                    }
                  />
                  <Row
                    title="Application status updates"
                    action={
                      <Switch
                        checked={notifications.applicationUpdates}
                        onChange={() => toggleNotification("applicationUpdates")}
                      />
                    }
                  />
                  <Row
                    title="Email notifications"
                    action={
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={() => toggleNotification("emailNotifications")}
                      />
                    }
                  />
                </Box>

                <Box>
                  <Row
                    title="New job alerts"
                    action={
                      <Switch
                        checked={notifications.newJobAlerts}
                        onChange={() => toggleNotification("newJobAlerts")}
                      />
                    }
                  />
                  <Row
                    title="Recruiter messages"
                    action={
                      <Switch
                        checked={notifications.recruiterMessages}
                        onChange={() => toggleNotification("recruiterMessages")}
                      />
                    }
                  />
                  <Row
                    title="Push notifications"
                    action={
                      <Switch
                        checked={notifications.pushNotifications}
                        onChange={() => toggleNotification("pushNotifications")}
                      />
                    }
                  />
                </Box>
              </Box>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button variant="contained">Save changes</Button>
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

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mb: 1,
                }}
              >
                <TextField
                  select
                  label="Profile visibility"
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Recruiters only">Recruiters only</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Who can view resume"
                  value={resumeVisibility}
                  onChange={(e) => setResumeVisibility(e.target.value)}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Everyone">Everyone</MenuItem>
                  <MenuItem value="Recruiters only">Recruiters only</MenuItem>
                  <MenuItem value="No one">No one</MenuItem>
                </TextField>
              </Box>

              <Row
                icon={<DevicesOutlinedIcon fontSize="small" />}
                iconColor="primary.main"
                iconBg="rgba(59,130,246,0.15)"
                title="Login / session management"
                subtitle="Manage your active sessions"
                onClick={() => {}}
                action={<ChevronRightRoundedIcon sx={{ color: "text.secondary" }} />}
              />

              <Row
                icon={<LockOutlinedIcon fontSize="small" />}
                iconColor="secondary.main"
                iconBg="rgba(147,51,234,0.15)"
                title="Change password"
                subtitle="Update your account password"
                onClick={() => {}}
                action={<ChevronRightRoundedIcon sx={{ color: "text.secondary" }} />}
              />

              <Row
                icon={<VerifiedUserOutlinedIcon fontSize="small" />}
                iconColor="success.main"
                iconBg="rgba(16,185,129,0.15)"
                title="Two-factor authentication"
                subtitle="Add an extra layer of security"
                action={<Switch checked={twoFactor} onChange={() => setTwoFactor((v) => !v)} />}
              />
            </Paper>

            {/* ACCOUNT MANAGEMENT */}
            <Paper
              elevation={0}
              sx={{
                ...cardSx,
                borderColor: "rgba(239,68,68,0.35)",
              }}
            >
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
                subtitle="Get a copy of your profile and applications"
                action={<Button variant="outlined">Download</Button>}
              />

              <Row
                icon={<PowerSettingsNewRoundedIcon fontSize="small" />}
                iconColor="warning.main"
                iconBg="rgba(245,158,11,0.15)"
                title="Deactivate account"
                subtitle="Temporarily hide your profile"
                action={
                  <Button variant="outlined" color="warning">
                    Deactivate
                  </Button>
                }
              />

              <Row
                icon={<DeleteOutlineRoundedIcon fontSize="small" />}
                iconColor="error.main"
                iconBg="rgba(239,68,68,0.15)"
                title="Delete account"
                subtitle="Permanently remove your account and data"
                action={
                  <Button variant="outlined" color="error">
                    Delete
                  </Button>
                }
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;