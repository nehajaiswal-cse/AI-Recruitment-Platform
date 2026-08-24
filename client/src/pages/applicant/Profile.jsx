// import { useEffect, useState } from "react";
// import Navbar from "../../components/layout/applicant/Navbar";
// import ASidebar from "../../components/layout/applicant/Sidebar";
// import { getprofile , updateProfile  } from "../../api/authApi";

// import {
//   Avatar,
//   Box,
//   Button,
//   Chip,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";

// import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
// import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

// const initialProfile = {
//   name: "Aarav Sharma",
//   email: "aarav.sharma@example.com",
//   phone: "+91 98765 43210",
//   location: "Bengaluru, India",
//   skills: "React, JavaScript, Node.js",
//   experience: "2 years",
//   education: "B.Tech in Computer Science",
//   summary:
//     "Frontend developer interested in building helpful, accessible products.",
// };

// const fieldSx = {
//   "& .MuiInputLabel-root": {
//     color: "#94a3b8",
//   },

//   "& .MuiInputLabel-root.Mui-disabled": {
//     color: "#94a3b8",
//   },

//   "& .MuiOutlinedInput-root": {
//     color: "#f8fafc",
//     backgroundColor: "#182235",

//     "& fieldset": {
//       borderColor: "#475569",
//     },

//     "&:hover fieldset": {
//       borderColor: "#64748b",
//     },

//     "&.Mui-focused fieldset": {
//       borderColor: "#82a9ff",
//     },
//   },

//   // Normal text
//   "& .MuiInputBase-input": {
//     color: "#f8fafc",
//   },

//   // Disabled text
//   "& .MuiInputBase-input.Mui-disabled": {
//     WebkitTextFillColor: "#e2e8f0",
//     color: "#e2e8f0",
//     opacity: 1,
//   },

//   // Disabled input border
//   "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
//     borderColor: "#475569",
//   },
// };

// const Profile = () => {
//   const [profile, setProfile] = useState(initialProfile);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//   const loadProfile = async () => {
//     try {
//       const response = await getprofile();

//       console.log("PROFILE RESPONSE:", response);

//       const user = response.user;

//       setProfile({
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         location: user.profile?.location || "",
//         skills: user.profile?.skills?.join(", ") || "",
//         experience: user.profile?.experience
//           ? `${user.profile.experience} years`
//           : "",
//         education: user.profile?.education || "",
//         summary: "",
//       });
//     } catch (error) {
//       console.error("Failed to load profile:", error);
//     }
//   };

//   loadProfile();
// }, []);


//   const handleChange = (field) => (event) => {
//     setProfile((prev) => ({
//       ...prev,
//       [field]: event.target.value,
//     }));
//   };

//   const handleCancel = () => {
//     setProfile(initialProfile);
//     setIsEditing(false);
//   };

//   const handleSave = async () => {
//   try {
//     const profileData = {
//       name: profile.name,
//       email: profile.email,
//       phone: profile.phone,
//       profile: {
//         skills: profile.skills
//           .split(",")
//           .map((skill) => skill.trim())
//           .filter(Boolean),

//         experience: Number.parseInt(profile.experience) || 0,

//         education: profile.education,
//         location: profile.location,
//       },
//     };

//     const response = await updateProfile(profileData);

//     console.log("PROFILE UPDATED:", response);

//     setProfile((prev) => ({
//       ...prev,
//       ...response.user,
//       skills: response.user.profile?.skills?.join(", ") || "",
//       experience: response.user.profile?.experience
//         ? `${response.user.profile.experience} years`
//         : "",
//       education: response.user.profile?.education || "",
//       location: response.user.profile?.location || "",
//     }));

//     setIsEditing(false);
//   } catch (error) {
//     console.error("Failed to update profile:", error);
//   }
// };

//   const getInitials = (name) => {
//     return name
//       .split(" ")
//       .map((word) => word[0])
//       .join("")
//       .slice(0, 2)
//       .toUpperCase();
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         bgcolor: "#111827",
//       }}
//     >
//       <Navbar />

//       <Box sx={{ display: "flex" }}>
//         <ASidebar />

//         <Box
//           component="main"
//           sx={{
//             flex: 1,
//             minWidth: 0,
//             p: {
//               xs: 2,
//               sm: 3,
//               md: 4,
//             },
//           }}
//         >
//           {/* PAGE HEADER */}
//           <Box sx={{ mb: 3 }}>
//             <Typography
//               sx={{
//                 fontSize: {
//                   xs: "28px",
//                   md: "32px",
//                 },
//                 fontWeight: 700,
//                 color: "#f8fafc",
//                 letterSpacing: "-0.5px",
//               }}
//             >
//               My Profile
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 0.5,
//                 fontSize: "14px",
//                 color: "#94a3b8",
//               }}
//             >
//               Keep your information up to date for employers.
//             </Typography>
//           </Box>

//           {/* PROFILE HEADER CARD */}
//           <Paper
//             elevation={0}
//             sx={{
//               p: {
//                 xs: 2.5,
//                 md: 3,
//               },
//               mb: 3,
//               borderRadius: 3,
//               backgroundColor: "#1c2535",
//               border: "1px solid #334155",
//             }}
//           >
//             <Stack
//               direction={{
//                 xs: "column",
//                 sm: "row",
//               }}
//               spacing={2}
//               alignItems={{
//                 xs: "flex-start",
//                 sm: "center",
//               }}
//             >
//               {/* Avatar */}
//               <Avatar
//                 sx={{
//                   width: 66,
//                   height: 66,
//                   backgroundColor: "#294b86",
//                   color: "#dbeafe",
//                   fontSize: "23px",
//                   fontWeight: 700,
//                 }}
//               >
//                 {getInitials(profile.name)}
//               </Avatar>

//               {/* User Info */}
//               <Box sx={{ flex: 1 }}>
//                 <Typography
//                   sx={{
//                     fontSize: "21px",
//                     fontWeight: 600,
//                     color: "#f8fafc",
//                   }}
//                 >
//                   {profile.name}
//                 </Typography>

//                 <Typography
//                   sx={{
//                     mt: 0.3,
//                     fontSize: "14px",
//                     color: "#aeb9ca",
//                   }}
//                 >
//                   {profile.email}
//                 </Typography>

//                 <Typography
//                   sx={{
//                     mt: 0.4,
//                     fontSize: "14px",
//                     color: "#aeb9ca",
//                   }}
//                 >
//                   Applicant account
//                 </Typography>
//               </Box>

//               {/* Role */}
//               <Chip
//                 label="Applicant"
//                 sx={{
//                   backgroundColor: "#124e35",
//                   color: "#65e6a0",
//                   fontWeight: 600,
//                   borderRadius: 2,
//                   height: 32,
//                   "& .MuiChip-label": {
//                     px: 1.5,
//                   },
//                 }}
//               />
//             </Stack>
//           </Paper>

//           {/* PERSONAL INFORMATION CARD */}
//           <Paper
//             elevation={0}
//             sx={{
//               p: {
//                 xs: 2.5,
//                 md: 3,
//               },
//               borderRadius: 3,
//               backgroundColor: "#1c2535",
//               border: "1px solid #334155",
//             }}
//           >
//             {/* Section Header */}
//             <Typography
//               sx={{
//                 fontSize: "19px",
//                 fontWeight: 600,
//                 color: "#f8fafc",
//                 mb: 3,
//               }}
//             >
//               Personal information
//             </Typography>

//             {/* Fields */}
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: {
//                   xs: "1fr",
//                   md: "1fr 1fr",
//                 },
//                 gap: 2.2,
//               }}
//             >
//               <TextField
//                 label="Full name"
//                 value={profile.name}
//                 onChange={handleChange("name")}
//                 fullWidth
//                 disabled={!isEditing}
//                 sx={fieldSx}
//               />

//               <TextField
//                 label="Email address"
//                 value={profile.email}
//                 onChange={handleChange("email")}
//                 fullWidth
//                 disabled={!isEditing}
//                 sx={fieldSx}
//               />

//               <TextField
//                 label="Phone number"
//                 value={profile.phone}
//                 onChange={handleChange("phone")}
//                 fullWidth
//                 disabled={!isEditing}
//                 sx={fieldSx}
//               />

//               <TextField
//                 label="Location"
//                 value={profile.location}
//                 onChange={handleChange("location")}
//                 fullWidth
//                 disabled={!isEditing}
//                 sx={fieldSx}
//               />

//               <TextField
//                 label="Skills"
//                 value={profile.skills}
//                 onChange={handleChange("skills")}
//                 fullWidth
//                 disabled={!isEditing}
//                 sx={fieldSx}
//               />

//               <TextField
//                 label="Experience"
//                 value={profile.experience}
//                 onChange={handleChange("experience")}
//                 fullWidth
//                 disabled={!isEditing}
//                 sx={fieldSx}
//               />

//               <TextField
//                 label="Education"
//                 value={profile.education}
//                 onChange={handleChange("education")}
//                 fullWidth
//                 disabled={!isEditing}
//                 sx={{
//                   ...fieldSx,
//                   gridColumn: {
//                     xs: "auto",
//                     md: "1 / -1",
//                   },
//                 }}
//               />

//               <TextField
//                 label="Professional summary"
//                 value={profile.summary}
//                 onChange={handleChange("summary")}
//                 fullWidth
//                 multiline
//                 minRows={3}
//                 disabled={!isEditing}
//                 sx={{
//                   ...fieldSx,
//                   gridColumn: {
//                     xs: "auto",
//                     md: "1 / -1",
//                   },
//                 }}
//               />
//             </Box>

//             {/* ACTION BUTTONS */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 1.5,
//                 mt: 3,
//               }}
//             >
//               {isEditing ? (
//                 <>
//                   <Button
//                     variant="outlined"
//                     startIcon={<CloseOutlinedIcon />}
//                     onClick={handleCancel}
//                     sx={{
//                       color: "#e2e8f0",
//                       borderColor: "#64748b",
//                       textTransform: "none",
//                       borderRadius: 1.5,
//                       px: 2.5,

//                       "&:hover": {
//                         borderColor: "#94a3b8",
//                         backgroundColor: "rgba(148,163,184,0.08)",
//                       },
//                     }}
//                   >
//                     Cancel
//                   </Button>

//                   <Button
//                     variant="contained"
//                     startIcon={<SaveOutlinedIcon />}
//                     onClick={handleSave}
//                     sx={{
//                       backgroundColor: "#82a9ff",
//                       color: "#0f172a",
//                       fontWeight: 700,
//                       textTransform: "none",
//                       borderRadius: 1.5,
//                       px: 2.5,

//                       "&:hover": {
//                         backgroundColor: "#9bbaff",
//                       },
//                     }}
//                   >
//                     Save changes
//                   </Button>
//                 </>
//               ) : (
//                 <Button
//                   variant="contained"
//                   startIcon={<EditOutlinedIcon />}
//                   onClick={() => setIsEditing(true)}
//                   sx={{
//                     textTransform: "none",
//                     borderRadius: 1.5,
//                   }}
//                 >
//                   Edit profile
//                 </Button>
//               )}
//             </Box>
//           </Paper>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Profile;



import { useEffect, useState } from "react";
import Navbar from "../../components/layout/applicant/Navbar";
import ASidebar from "../../components/layout/applicant/Sidebar";
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
  useTheme,
} from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const initialProfile = {
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, India",
  skills: "React, JavaScript, Node.js",
  experience: "2 years",
  education: "B.Tech in Computer Science",
  summary:
    "Frontend developer interested in building helpful, accessible products.",
};

const Profile = () => {
  const theme = useTheme();

  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const fieldSx = {
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
    },

    "& .MuiInputLabel-root.Mui-disabled": {
      color: theme.palette.text.secondary,
    },

    "& .MuiOutlinedInput-root": {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.surface,

      "& fieldset": {
        borderColor: theme.palette.divider,
      },

      "&:hover fieldset": {
        borderColor: theme.palette.text.secondary,
      },

      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },

    "& .MuiInputBase-input": {
      color: theme.palette.text.primary,
    },

    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: theme.palette.text.primary,
      color: theme.palette.text.primary,
      opacity: 1,
    },

    "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
      borderColor: theme.palette.divider,
    },
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getprofile();

        console.log("PROFILE RESPONSE:", response);

        const user = response.user;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.profile?.location || "",
          skills: user.profile?.skills?.join(", ") || "",
          experience: user.profile?.experience
            ? `${user.profile.experience} years`
            : "",
          education: user.profile?.education || "",
          summary: "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
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
          skills: profile.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),

          experience: Number.parseInt(profile.experience) || 0,

          education: profile.education,
          location: profile.location,
        },
      };

      const response = await updateProfile(profileData);

      console.log("PROFILE UPDATED:", response);

      setProfile((prev) => ({
        ...prev,
        ...response.user,
        skills: response.user.profile?.skills?.join(", ") || "",
        experience: response.user.profile?.experience
          ? `${response.user.profile.experience} years`
          : "",
        education: response.user.profile?.education || "",
        location: response.user.profile?.location || "",
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
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
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Navbar />

      <Box sx={{ display: "flex" }}>
        <ASidebar />

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
              Keep your information up to date for employers.
            </Typography>
          </Box>

          {/* PROFILE HEADER CARD */}
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
              mb: 3,
              borderRadius: 3,
              backgroundColor: "background.paper",
              border: "1px solid",
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
                  // backgroundColor:
                  //   theme.palette.mode === "dark"
                  //     ? "#294b86"
                  //     : "#dbeafe",
                  // color:
                  //   theme.palette.mode === "dark"
                  //     ? "#dbeafe"
                  //     : "#1d4ed8",
                  fontSize: "23px",
                  fontWeight: 700,
                }}
              >
                {getInitials(profile.name)}
              </Avatar>

              {/* User Info */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "21px",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {profile.name}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.3,
                    fontSize: "14px",
                    color: "text.secondary",
                  }}
                >
                  {profile.email}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: "14px",
                    color: "text.secondary",
                  }}
                >
                  Applicant account
                </Typography>
              </Box>

              {/* Role */}
              <Chip
                label="Applicant"
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "#124e35"
                      : "#dcfce7",
                  color:
                    theme.palette.mode === "dark"
                      ? "#65e6a0"
                      : "#15803d",
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

          {/* PERSONAL INFORMATION CARD */}
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
              borderRadius: 3,
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* Section Header */}
            <Typography
              sx={{
                fontSize: "19px",
                fontWeight: 600,
                color: "text.primary",
                mb: 3,
              }}
            >
              Personal information
            </Typography>

            {/* Fields */}
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
                label="Skills"
                value={profile.skills}
                onChange={handleChange("skills")}
                fullWidth
                disabled={!isEditing}
                sx={fieldSx}
              />

              <TextField
                label="Experience"
                value={profile.experience}
                onChange={handleChange("experience")}
                fullWidth
                disabled={!isEditing}
                sx={fieldSx}
              />

              <TextField
                label="Education"
                value={profile.education}
                onChange={handleChange("education")}
                fullWidth
                disabled={!isEditing}
                sx={{
                  ...fieldSx,
                  gridColumn: {
                    xs: "auto",
                    md: "1 / -1",
                  },
                }}
              />

              <TextField
                label="Professional summary"
                value={profile.summary}
                onChange={handleChange("summary")}
                fullWidth
                multiline
                minRows={3}
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

            {/* ACTION BUTTONS */}
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
                      color: "text.primary",
                      borderColor: "text.secondary",
                      textTransform: "none",
                      borderRadius: 1.5,
                      px: 2.5,

                      "&:hover": {
                        borderColor: "text.primary",
                        backgroundColor: "action.hover",
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
                      backgroundColor: "primary.main",
                      background:'linear-gradient(135deg, #3b82f6, #9333ea)',
                      color: "#ffffff",
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: 1.5,
                      px: 2.5,

                      "&:hover": {
                        backgroundColor: "primary.dark",
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