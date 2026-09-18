import { useEffect, useState } from "react";

import Navbar from "../../components/layout/recruiter/Navbar";
import RSidebar from "../../components/layout/recruiter/Sidebar";
import { getprofile, updateProfile } from "../../api/authApi";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const initialProfile = {
  name: "Rahul Verma",
  email: "rahul.verma@example.com",
  phone: "+91 98765 12345",
  location: "Noida, India",
  companyName: "Tech Solutions Pvt. Ltd.",
  companyWebsite: "https://techsolutions.com",
  companyDescription:
    "Technology company focused on building innovative software products.",
};

const fieldSx = {
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
  },

  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#94a3b8",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#82a9ff",
  },

  "& .MuiOutlinedInput-root": {
    color: "#f8fafc",
    backgroundColor: "#182235",
    borderRadius: 1.5,

    "& fieldset": {
      borderColor: "#475569",
    },

    "&:hover fieldset": {
      borderColor: "#64748b",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#82a9ff",
    },
  },

  "& .MuiInputBase-input": {
    color: "#f8fafc",
  },

  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#e2e8f0",
    color: "#e2e8f0",
    opacity: 1,
  },

  "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
    borderColor: "#475569",
  },
};


const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
  const loadProfile = async () => {
    try {
      const response = await getprofile();

      console.log("RECRUITER PROFILE RESPONSE:", response);

      const user = response.user;

      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.profile?.location || "",
        companyName: user.profile?.companyName || "",
        companyWebsite: user.profile?.companyWebsite || "",
        companyDescription: user.profile?.companyDescription || "",
      });
    } catch (error) {
      console.error("Failed to load recruiter profile:", error);
    }
  };

  loadProfile();
}, []);

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setIsEditing(false);
  };

  const handleSave = async () => {
  try {
    const profileData = {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,

      profile: {
        location: profile.location,
        companyName: profile.companyName,
        companyWebsite: profile.companyWebsite,
        companyDescription: profile.companyDescription,
      },
    };

    const response = await updateProfile(profileData);

    console.log("RECRUITER PROFILE UPDATED:", response);

    const user = response.user;

    setProfile({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.profile?.location || "",
      companyName: user.profile?.companyName || "",
      companyWebsite: user.profile?.companyWebsite || "",
      companyDescription: user.profile?.companyDescription || "",
    });

    setIsEditing(false);
  } catch (error) {
    console.error("Failed to update recruiter profile:", error);
  }
};

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#111827",
      }}
    >
      <Navbar />

      <Box sx={{ display: "flex" }}>
        <RSidebar />

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
          {/* PAGE HEADER */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: {
                  xs: "28px",
                  md: "32px",
                },
                fontWeight: 700,
                color: "#f8fafc",
                letterSpacing: "-0.5px",
              }}
            >
              My Profile
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: "14px",
                color: "#94a3b8",
              }}
            >
              Manage your personal and company information.
            </Typography>
          </Box>

          {/* PROFILE HEADER */}
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
              mb: 3,
              borderRadius: 3,
              backgroundColor: "#1c2535",
              border: "1px solid #334155",
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 66,
                  height: 66,
                  backgroundColor: "#294b86",
                  color: "#dbeafe",
                  fontSize: "23px",
                  fontWeight: 700,
                }}
              >
                {getInitials(profile.name)}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "21px",
                    fontWeight: 600,
                    color: "#f8fafc",
                  }}
                >
                  {profile.name}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.3,
                    fontSize: "14px",
                    color: "#aeb9ca",
                  }}
                >
                  {profile.email}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: "14px",
                    color: "#aeb9ca",
                  }}
                >
                  Recruiter account
                </Typography>
              </Box>

              <Chip
                label="Recruiter"
                sx={{
                  backgroundColor: "#124e35",
                  color: "#65e6a0",
                  fontWeight: 600,
                  borderRadius: 2,
                  height: 32,
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                }}
              />
            </Stack>
          </Paper>

          {/* PERSONAL & COMPANY INFORMATION */}
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
              borderRadius: 3,
              backgroundColor: "#1c2535",
              border: "1px solid #334155",
            }}
          >
            <Typography
              sx={{
                fontSize: "19px",
                fontWeight: 600,
                color: "#f8fafc",
                mb: 3,
              }}
            >
              Personal & company information
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2.2,
              }}
            >
              <TextField
                label="Full name"
                value={profile.name}
                onChange={handleChange("name")}
                fullWidth
                disabled={!isEditing}
                sx={fieldSx}
              />

              <TextField
                label="Email address"
                value={profile.email}
                onChange={handleChange("email")}
                fullWidth
                disabled={!isEditing}
                sx={fieldSx}
              />

              <TextField
                label="Phone number"
                value={profile.phone}
                onChange={handleChange("phone")}
                fullWidth
                disabled={!isEditing}
                sx={fieldSx}
              />

              <TextField
                label="Location"
                value={profile.location}
                onChange={handleChange("location")}
                fullWidth
                disabled={!isEditing}
                sx={fieldSx}
              />

              <TextField
                label="Company name"
                value={profile.companyName}
                onChange={handleChange("companyName")}
                fullWidth
                disabled={!isEditing}
                sx={fieldSx}
              />

              <TextField
                label="Company website"
                value={profile.companyWebsite}
                onChange={handleChange("companyWebsite")}
                fullWidth
                disabled={!isEditing}
                sx={fieldSx}
              />

              <TextField
                label="Company description"
                value={profile.companyDescription}
                onChange={handleChange("companyDescription")}
                fullWidth
                multiline
                minRows={4}
                disabled={!isEditing}
                sx={{
                  ...fieldSx,
                  gridColumn: {
                    xs: "auto",
                    md: "1 / -1",
                  },
                }}
              />
            </Box>

            {/* BUTTONS */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                mt: 3,
              }}
            >
              {isEditing ? (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<CloseOutlinedIcon />}
                    onClick={handleCancel}
                    sx={{
                      color: "#e2e8f0",
                      borderColor: "#64748b",
                      textTransform: "none",
                      borderRadius: 1.5,
                      px: 2.5,

                      "&:hover": {
                        borderColor: "#94a3b8",
                        backgroundColor: "rgba(148,163,184,0.08)",
                      },
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<SaveOutlinedIcon />}
                    onClick={handleSave}
                    sx={{
                      backgroundColor: "#82a9ff",
                      color: "#0f172a",
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: 1.5,
                      px: 2.5,

                      "&:hover": {
                        backgroundColor: "#9bbaff",
                      },
                    }}
                  >
                    Save changes
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 1.5,
                  }}
                >
                  Edit profile
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;