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
  name: "",
  email: "",
  phone: "",
  location: "",
  companyName: "",
  companyWebsite: "",
  companyDescription: "",
};

const fieldSx = {
  "& .MuiInputLabel-root": {
    color: "text.secondary",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "primary.main",
  },

  "& .MuiOutlinedInput-root": {
    color: "text.primary",
    backgroundColor: "background.surface",
    borderRadius: 1.5,

    "& fieldset": {
      borderColor: "divider",
    },

    "&:hover fieldset": {
      borderColor: "text.secondary",
    },

    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
    },
  },

  "& .MuiInputBase-input": {
    color: "text.primary",
  },

  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "inherit",
    color: "text.primary",
    opacity: 1,
  },

  "& .MuiOutlinedInput-root.Mui-disabled": {
    backgroundColor: "background.surface",
  },

  "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
    borderColor: "divider",
  },
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [savedProfile, setSavedProfile] = useState(initialProfile);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getprofile();

        console.log("RECRUITER PROFILE RESPONSE:", response);

        const user = response.user;

        const profileData = {
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          location: user?.profile?.location || "",
          companyName: user?.profile?.companyName || "",
          companyWebsite: user?.profile?.companyWebsite || "",
          companyDescription:
            user?.profile?.companyDescription || "",
        };

        setProfile(profileData);
        setSavedProfile(profileData);
      } catch (error) {
        console.error(
          "Failed to load recruiter profile:",
          error
        );
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
    setProfile(savedProfile);
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

      console.log(
        "RECRUITER PROFILE UPDATED:",
        response
      );

      const user = response.user;

      const updatedProfile = {
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        location: user?.profile?.location || "",
        companyName: user?.profile?.companyName || "",
        companyWebsite:
          user?.profile?.companyWebsite || "",
        companyDescription:
          user?.profile?.companyDescription || "",
      };

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Failed to update recruiter profile:",
        error
      );
    }
  };

  const getInitials = (name) => {
    if (!name) return "R";

    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Main */}
      <Box
        sx={{
          display: "flex",
          minWidth: 0,
        }}
      >
        {/* Sidebar */}
        <RSidebar />

        {/* Main Content */}
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
            bgcolor: "background.default",
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
                color: "text.primary",
                letterSpacing: "-0.5px",
              }}
            >
              My Profile
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: "14px",
                color: "text.secondary",
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
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
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
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 66,
                  height: 66,
                   background:'linear-gradient(135deg, #3b82f6, #9333ea)',
                  color: "#fff",
                  fontSize: "23px",
                  fontWeight: 700,
                }}
                
              >
                {getInitials(profile.name)}
              </Avatar>

              {/* User Information */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "21px",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {profile.name || "Recruiter"}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.3,
                    fontSize: "14px",
                    color: "text.secondary",
                  }}
                >
                  {profile.email || "No email available"}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: "14px",
                    color: "text.secondary",
                  }}
                >
                  Recruiter account
                </Typography>
              </Box>

              {/* Role */}
              <Chip
                label="Recruiter"
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.15)",
                  color: "success.main",
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
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              sx={{
                fontSize: "19px",
                fontWeight: 600,
                color: "text.primary",
                mb: 3,
              }}
            >
              Personal & company information
            </Typography>

            {/* FORM */}
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
                  {/* Cancel */}
                  <Button
                    variant="outlined"
                    startIcon={<CloseOutlinedIcon />}
                    onClick={handleCancel}
                    sx={{
                      color: "text.primary",
                      borderColor: "divider",
                      textTransform: "none",
                      borderRadius: 1.5,
                      px: 2.5,

                      "&:hover": {
                        borderColor: "text.secondary",
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    Cancel
                  </Button>

                  {/* Save */}
                  <Button
                    variant="contained"
                    startIcon={<SaveOutlinedIcon />}
                    onClick={handleSave}
                    sx={{
                      bgcolor: "primary.main",
                       background:'linear-gradient(135deg, #3b82f6, #9333ea)',
                      color: "#fff",
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: 1.5,
                      px: 2.5,

                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    Save changes
                  </Button>
                </>
              ) : (
                /* Edit */
                <Button
                  variant="contained"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 1.5,
                     background:'linear-gradient(135deg, #3b82f6, #9333ea)',
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




