// import { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import {
//   Alert,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Container,
//   Divider,
//   Grid,
//   Stack,
//   Typography,
// } from "@mui/material";

// import {
//   ArrowBack,
//   Edit,
//   Work,
//   LocationOn,
//   BusinessCenter,
//   Payments,
//   CalendarToday,
//   CheckCircle,
//   Description,
//   Business,
//   ListAlt,
// } from "@mui/icons-material";

// import Navbar from "../../../components/dashboard/Navbar";
// import useJob from "../../../hooks/useJob";

// const ViewJob = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const {
//     currentJob,
//     loading,
//     error,
//     fetchJobById,
//   } = useJob();

//   // ==========================================
//   // FETCH JOB
//   // ==========================================

//   useEffect(() => {
//     if (id) {
//       fetchJobById(id);
//     }
//   }, [id]);

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading && !currentJob) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           bgcolor: "#111827",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <CircularProgress
//           size={42}
//           sx={{
//             color: "#8b5cf6",
//           }}
//         />
//       </Box>
//     );
//   }

//   // ==========================================
//   // ERROR
//   // ==========================================

//   if (error && !currentJob) {
//     return (
   
//       <Box
//         sx={{
//           minHeight: "100vh",
//           bgcolor: "#111827",
//           py: 5,
//         }}
//       >
//         <Container maxWidth="lg">
//           <Alert severity="error">
//             {error}
//           </Alert>

//           <Button
//             startIcon={<ArrowBack />}
//             onClick={() =>
//               navigate("/recruiter/jobs")
//             }
//             sx={{
//               mt: 3,
//               color: "#a5b4fc",
//               textTransform: "none",
//             }}
//           >
//             Back to Jobs
//           </Button>
//         </Container>
//       </Box>
//     );
//   }

//   if (!currentJob) {
//     return null;
//   }

//   // ==========================================
//   // HELPERS
//   // ==========================================

//   const formatJobType = (type) => {
//     if (!type) return "Not specified";

//     return type;
//   };

//   const formatDate = (date) => {
//     if (!date) {
//       return "Not specified";
//     }

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return "Not specified";
//     }

//     return parsedDate.toLocaleDateString(
//       "en-IN",
//       {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       }
//     );
//   };

//   // ==========================================
//   // STATUS
//   // ==========================================

//   const status = currentJob.status || "draft";

//   const statusConfig = {
//     draft: {
//       label: "Draft",
//       color: "#fbbf24",
//       bg: "rgba(251,191,36,0.12)",
//     },

//     published: {
//       label: "Published",
//       color: "#4ade80",
//       bg: "rgba(34,197,94,0.12)",
//     },

//     closed: {
//       label: "Closed",
//       color: "#f87171",
//       bg: "rgba(239,68,68,0.12)",
//     },
//   };

//   const currentStatus =
//     statusConfig[status] ||
//     statusConfig.draft;

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//        <>
//       <Navbar></Navbar>
//     <Box
//       sx={{
//         minHeight: "100vh",
//         bgcolor: "#111827",
//         color: "#fff",
//         py: {
//           xs: 3,
//           md: 5,
//         },
//       }}
//     >
//       <Container maxWidth="lg">

//         {/* ======================================
//             HEADER
//         ====================================== */}

//         <Stack
//           direction={{
//             xs: "column",
//             sm: "row",
//           }}
//           spacing={2}
//           sx={{
//             justifyContent: "space-between",
//             alignItems: {
//               xs: "flex-start",
//               sm: "center",
//             },
//             mb: 4,
//           }}
//         >
//           <Stack
//             direction="row"
//             spacing={2}
//             sx={{
//               alignItems: "center",
//             }}
//           >
//             <Button
//               variant="outlined"
//               startIcon={<ArrowBack />}
//               onClick={() =>
//                 navigate("/recruiter/jobs")
//               }
//               sx={{
//                 color: "#d1d5db",
//                 borderColor: "#374151",
//                 textTransform: "none",

//                 "&:hover": {
//                   borderColor: "#6366f1",
//                   bgcolor:
//                     "rgba(99,102,241,0.08)",
//                 },
//               }}
//             >
//               Back
//             </Button>

//             <Box>
//               <Typography
//                 variant="h4"
//                 sx={{
//                   fontWeight: 700,
//                   color: "#fff",
//                 }}
//               >
//                 Job Details
//               </Typography>

//               <Typography
//                 sx={{
//                   color: "#9ca3af",
//                   mt: 0.5,
//                 }}
//               >
//                 View your job posting details.
//               </Typography>
//             </Box>
//           </Stack>

//           <Button
//             variant="contained"
//             startIcon={<Edit />}
//             onClick={() =>
//               navigate(
//                 `/recruiter/jobs/${id}/edit`
//               )
//             }
//             sx={{
//               minWidth: 130,
//               textTransform: "none",
//               fontWeight: 600,
//               px: 3,
//               py: 1.2,
//               borderRadius: 2,

//               background:
//                 "linear-gradient(135deg, #6366f1, #8b5cf6)",

//               "&:hover": {
//                 background:
//                   "linear-gradient(135deg, #4f46e5, #7c3aed)",
//               },
//             }}
//           >
//             Edit Job
//           </Button>
//         </Stack>

//         {/* ======================================
//             MAIN JOB CARD
//         ====================================== */}

//         <Card
//           sx={{
//             bgcolor: "#1f2937",
//             border: "1px solid #374151",
//             borderRadius: 3,
//             color: "#fff",
//             mb: 3,
//           }}
//         >
//           <CardContent
//             sx={{
//               p: {
//                 xs: 3,
//                 md: 4,
//               },
//             }}
//           >

//             {/* JOB HEADER */}

//             <Stack
//               direction={{
//                 xs: "column",
//                 sm: "row",
//               }}
//               spacing={3}
//               sx={{
//                 justifyContent:
//                   "space-between",
//                 alignItems: {
//                   xs: "flex-start",
//                   sm: "center",
//                 },
//               }}
//             >
//               <Stack
//                 direction="row"
//                 spacing={2}
//                 sx={{
//                   alignItems: "center",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: 64,
//                     height: 64,
//                     borderRadius: 2,
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     bgcolor:
//                       "rgba(99,102,241,0.15)",
//                     flexShrink: 0,
//                   }}
//                 >
//                   <Work
//                     sx={{
//                       fontSize: 32,
//                       color: "#818cf8",
//                     }}
//                   />
//                 </Box>

//                 <Box>
//                   <Typography
//                     variant="h4"
//                     sx={{
//                       fontWeight: 700,
//                       color: "#fff",
//                     }}
//                   >
//                     {currentJob.title}
//                   </Typography>

//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     sx={{
//                       alignItems: "center",
//                       mt: 0.7,
//                     }}
//                   >
//                     <Business
//                       sx={{
//                         fontSize: 18,
//                         color: "#9ca3af",
//                       }}
//                     />

//                     <Typography
//                       sx={{
//                         color: "#9ca3af",
//                       }}
//                     >
//                       {currentJob.company ||
//                         "Company not specified"}
//                     </Typography>
//                   </Stack>
//                 </Box>
//               </Stack>

//               {/* STATUS */}

//               <Chip
//                 label={currentStatus.label}
//                 icon={<CheckCircle />}
//                 sx={{
//                   bgcolor:
//                     currentStatus.bg,
//                   color:
//                     currentStatus.color,
//                   fontWeight: 600,

//                   "& .MuiChip-icon": {
//                     color:
//                       currentStatus.color,
//                   },
//                 }}
//               />
//             </Stack>

//             <Divider
//               sx={{
//                 my: 4,
//                 borderColor: "#374151",
//               }}
//             />

//             {/* ==================================
//                 JOB INFORMATION
//             ================================== */}

//             <Grid
//               container
//               spacing={3}
//             >

//               {/* LOCATION */}

//               <Grid
//                 size={{
//                   xs: 12,
//                   sm: 6,
//                   md: 4,
//                 }}
//               >
//                 <InfoItem
//                   icon={<LocationOn />}
//                   label="Location"
//                   value={
//                     currentJob.location ||
//                     "Not specified"
//                   }
//                 />
//               </Grid>

//               {/* JOB TYPE */}

//               <Grid
//                 size={{
//                   xs: 12,
//                   sm: 6,
//                   md: 4,
//                 }}
//               >
//                 <InfoItem
//                   icon={<BusinessCenter />}
//                   label="Job Type"
//                   value={formatJobType(
//                     currentJob.jobType
//                   )}
//                 />
//               </Grid>

//               {/* EXPERIENCE */}

//               <Grid
//                 size={{
//                   xs: 12,
//                   sm: 6,
//                   md: 4,
//                 }}
//               >
//                 <InfoItem
//                   icon={<Work />}
//                   label="Experience"
//                   value={
//                     currentJob.experience ||
//                     "Not specified"
//                   }
//                 />
//               </Grid>

//               {/* SALARY */}

//               <Grid
//                 size={{
//                   xs: 12,
//                   sm: 6,
//                   md: 4,
//                 }}
//               >
//                 <InfoItem
//                   icon={<Payments />}
//                   label="Salary"
//                   value={
//                     currentJob.salary ||
//                     "Not specified"
//                   }
//                 />
//               </Grid>

//               {/* DEADLINE */}

//               <Grid
//                 size={{
//                   xs: 12,
//                   sm: 6,
//                   md: 4,
//                 }}
//               >
//                 <InfoItem
//                   icon={<CalendarToday />}
//                   label="Application Deadline"
//                   value={formatDate(
//                     currentJob.deadline
//                   )}
//                 />
//               </Grid>

//               {/* STATUS */}

//               <Grid
//                 size={{
//                   xs: 12,
//                   sm: 6,
//                   md: 4,
//                 }}
//               >
//                 <InfoItem
//                   icon={<CheckCircle />}
//                   label="Status"
//                   value={currentStatus.label}
//                 />
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>

//         {/* ======================================
//             DESCRIPTION
//         ====================================== */}

//         <Card
//           sx={{
//             bgcolor: "#1f2937",
//             border: "1px solid #374151",
//             borderRadius: 3,
//             color: "#fff",
//             mb: 3,
//           }}
//         >
//           <CardContent
//             sx={{
//               p: {
//                 xs: 3,
//                 md: 4,
//               },
//             }}
//           >
//             <SectionTitle
//               icon={<Description />}
//               title="Job Description"
//             />

//             <Typography
//               sx={{
//                 color: "#d1d5db",
//                 lineHeight: 1.8,
//                 whiteSpace: "pre-line",
//               }}
//             >
//               {currentJob.description ||
//                 "No description provided."}
//             </Typography>
//           </CardContent>
//         </Card>

//         {/* ======================================
//             REQUIREMENTS
//         ====================================== */}

//         <Card
//           sx={{
//             bgcolor: "#1f2937",
//             border: "1px solid #374151",
//             borderRadius: 3,
//             color: "#fff",
//             mb: 3,
//           }}
//         >
//           <CardContent
//             sx={{
//               p: {
//                 xs: 3,
//                 md: 4,
//               },
//             }}
//           >
//             <SectionTitle
//               icon={<ListAlt />}
//               title="Requirements"
//             />

//             <Typography
//               sx={{
//                 color: "#d1d5db",
//                 lineHeight: 1.8,
//                 whiteSpace: "pre-line",
//               }}
//             >
//               {currentJob.requirements ||
//                 "No requirements specified."}
//             </Typography>
//           </CardContent>
//         </Card>

//         {/* ======================================
//             SKILLS
//         ====================================== */}

//         <Card
//           sx={{
//             bgcolor: "#1f2937",
//             border: "1px solid #374151",
//             borderRadius: 3,
//             color: "#fff",
//             mb: 3,
//           }}
//         >
//           <CardContent
//             sx={{
//               p: {
//                 xs: 3,
//                 md: 4,
//               },
//             }}
//           >
//             <SectionTitle
//               icon={<Work />}
//               title="Required Skills"
//             />

//             {Array.isArray(
//               currentJob.skills
//             ) &&
//             currentJob.skills.length > 0 ? (
//               <Stack
//                 direction="row"
//                 spacing={1}
//                 useFlexGap
//                 sx={{
//                   flexWrap: "wrap",
//                 }}
//               >
//                 {currentJob.skills.map(
//                   (skill, index) => (
//                     <Chip
//                       key={`${skill}-${index}`}
//                       label={skill}
//                       sx={{
//                         bgcolor:
//                           "rgba(99,102,241,0.12)",
//                         color: "#a5b4fc",
//                         border:
//                           "1px solid rgba(99,102,241,0.25)",
//                       }}
//                     />
//                   )
//                 )}
//               </Stack>
//             ) : (
//               <Typography
//                 sx={{
//                   color: "#9ca3af",
//                 }}
//               >
//                 No skills specified.
//               </Typography>
//             )}
//           </CardContent>
//         </Card>

//         {/* ======================================
//             FOOTER
//         ====================================== */}

//         <Card
//           sx={{
//             bgcolor: "#1f2937",
//             border: "1px solid #374151",
//             borderRadius: 3,
//           }}
//         >
//           <CardContent>
//             <Stack
//               direction={{
//                 xs: "column",
//                 sm: "row",
//               }}
//               spacing={3}
//               sx={{
//                 justifyContent:
//                   "space-between",
//                 alignItems: {
//                   xs: "flex-start",
//                   sm: "center",
//                 },
//               }}
//             >
//               <Box>
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: "#9ca3af",
//                   }}
//                 >
//                   Created
//                 </Typography>

//                 <Typography
//                   sx={{
//                     color: "#fff",
//                     fontWeight: 500,
//                   }}
//                 >
//                   {formatDate(
//                     currentJob.createdAt
//                   )}
//                 </Typography>
//               </Box>

//               <Box>
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: "#9ca3af",
//                   }}
//                 >
//                   Last Updated
//                 </Typography>

//                 <Typography
//                   sx={{
//                     color: "#fff",
//                     fontWeight: 500,
//                   }}
//                 >
//                   {formatDate(
//                     currentJob.updatedAt
//                   )}
//                 </Typography>
//               </Box>

//               <Button
//                 variant="contained"
//                 startIcon={<Edit />}
//                 onClick={() =>
//                   navigate(
//                     `/recruiter/jobs/${id}/edit`
//                   )
//                 }
//                 sx={{
//                   minWidth: 130,
//                   textTransform: "none",
//                   fontWeight: 600,
//                   background:
//                     "linear-gradient(135deg, #6366f1, #8b5cf6)",

//                   "&:hover": {
//                     background:
//                       "linear-gradient(135deg, #4f46e5, #7c3aed)",
//                   },
//                 }}
//               >
//                 Edit Job
//               </Button>
//             </Stack>
//           </CardContent>
//         </Card>

//       </Container>
//     </Box>
//     </>
//   );
// };

// // ==========================================
// // INFO ITEM
// // ==========================================

// const InfoItem = ({
//   icon,
//   label,
//   value,
// }) => {
//   return (
//     <Stack
//       direction="row"
//       spacing={1.5}
//       sx={{
//         alignItems: "center",
//       }}
//     >
//       <Box
//         sx={{
//           width: 42,
//           height: 42,
//           borderRadius: 2,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           bgcolor:
//             "rgba(99,102,241,0.12)",
//           color: "#818cf8",
//           flexShrink: 0,
//         }}
//       >
//         {icon}
//       </Box>

//       <Box sx={{ minWidth: 0 }}>
//         <Typography
//           variant="body2"
//           sx={{
//             color: "#9ca3af",
//           }}
//         >
//           {label}
//         </Typography>

//         <Typography
//           sx={{
//             color: "#fff",
//             fontWeight: 500,
//             mt: 0.2,
//             wordBreak: "break-word",
//           }}
//         >
//           {value}
//         </Typography>
//       </Box>
    
//     </Stack>
//   );
// };

// // ==========================================
// // SECTION TITLE
// // ==========================================

// const SectionTitle = ({
//   icon,
//   title,
// }) => {
//   return (
//     <Stack
//       direction="row"
//       spacing={1}
//       sx={{
//         alignItems: "center",
//         mb: 3,
//       }}
//     >
//       <Box
//         sx={{
//           color: "#818cf8",
//           display: "flex",
//         }}
//       >
//         {icon}
//       </Box>

//       <Typography
//         variant="h6"
//         sx={{
//           fontWeight: 600,
//           color: "#fff",
//         }}
//       >
//         {title}
//       </Typography>
//     </Stack>
//   );
// };

// export default ViewJob;


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
  useTheme,
} from "@mui/material";

import {
  ArrowBack,
  Edit,
  Work,
  LocationOn,
  BusinessCenter,
  Payments,
  CalendarToday,
  CheckCircle,
  Description,
  Business,
  ListAlt,
} from "@mui/icons-material";

import Navbar from "../../../components/dashboard/Navbar";
import useJob from "../../../hooks/useJob";

const ViewJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  // =====================================================
  // THEME COLORS
  // =====================================================

  const colors = {
    pageBg: theme.palette.background.default,

    cardBg: theme.palette.background.paper,

    textPrimary: theme.palette.text.primary,

    textSecondary: theme.palette.text.secondary,

    border: theme.palette.divider,

    iconBg: isDark
      ? "rgba(99,102,241,0.15)"
      : "rgba(99,102,241,0.08)",

    skillBg: isDark
      ? "rgba(99,102,241,0.12)"
      : "rgba(99,102,241,0.08)",

    primaryLight: theme.palette.primary.light,

    primary: theme.palette.primary.main,
  };

  const {
    currentJob,
    loading,
    error,
    fetchJobById,
  } = useJob();

  // ==========================================
  // FETCH JOB
  // ==========================================

  useEffect(() => {
    if (id) {
      fetchJobById(id);
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && !currentJob) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: colors.pageBg,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          size={42}
          sx={{
            color: colors.primary,
          }}
        />
      </Box>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !currentJob) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: colors.pageBg,
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
              color: colors.primaryLight,
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

  // ==========================================
  // HELPERS
  // ==========================================

  const formatJobType = (type) => {
    if (!type) return "Not specified";

    return type;
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATUS
  // ==========================================

  const status =
    currentJob.status || "draft";

  const statusConfig = {
    draft: {
      label: "Draft",
      color: theme.palette.warning.main,
      bg: isDark
        ? "rgba(251,191,36,0.12)"
        : "rgba(251,191,36,0.10)",
    },

    published: {
      label: "Published",
      color: theme.palette.success.main,
      bg: isDark
        ? "rgba(34,197,94,0.12)"
        : "rgba(34,197,94,0.10)",
    },

    closed: {
      label: "Closed",
      color: theme.palette.error.main,
      bg: isDark
        ? "rgba(239,68,68,0.12)"
        : "rgba(239,68,68,0.10)",
    },
  };

  const currentStatus =
    statusConfig[status] ||
    statusConfig.draft;

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: colors.pageBg,
          color: colors.textPrimary,
          py: {
            xs: 3,
            md: 5,
          },

          transition:
            "background-color 0.25s ease, color 0.25s ease",
        }}
      >
        <Container maxWidth="lg">

          {/* HEADER */}

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
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() =>
                  navigate("/recruiter/jobs")
                }
                sx={{
                  color: colors.textSecondary,
                  borderColor: colors.border,
                  textTransform: "none",

                  "&:hover": {
                    borderColor:
                      colors.primary,
                    bgcolor:
                      theme.palette.action.hover,
                  },
                }}
              >
                Back
              </Button>

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: colors.textPrimary,
                  }}
                >
                  Job Details
                </Typography>

                <Typography
                  sx={{
                    color: colors.textSecondary,
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
                minWidth: 130,
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

          {/* MAIN JOB CARD */}

          <Card
            sx={{
              bgcolor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 3,
              color: colors.textPrimary,
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

              {/* JOB HEADER */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={3}
                sx={{
                  justifyContent:
                    "space-between",
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
                      bgcolor: colors.iconBg,
                      flexShrink: 0,
                    }}
                  >
                    <Work
                      sx={{
                        fontSize: 32,
                        color: colors.primaryLight,
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: colors.textPrimary,
                      }}
                    >
                      {currentJob.title}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: "center",
                        mt: 0.7,
                      }}
                    >
                      <Business
                        sx={{
                          fontSize: 18,
                          color:
                            colors.textSecondary,
                        }}
                      />

                      <Typography
                        sx={{
                          color:
                            colors.textSecondary,
                        }}
                      >
                        {currentJob.company ||
                          "Company not specified"}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                {/* STATUS */}

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
                  borderColor: colors.border,
                }}
              />

              {/* JOB INFORMATION */}

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
                    colors={colors}
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
                    label="Job Type"
                    value={formatJobType(
                      currentJob.jobType
                    )}
                    colors={colors}
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
                    value={
                      currentJob.experience ||
                      "Not specified"
                    }
                    colors={colors}
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
                    value={
                      currentJob.salary ||
                      "Not specified"
                    }
                    colors={colors}
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
                    colors={colors}
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
                    icon={<CheckCircle />}
                    label="Status"
                    value={currentStatus.label}
                    colors={colors}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* DESCRIPTION */}

          <Card
            sx={{
              bgcolor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 3,
              color: colors.textPrimary,
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
                colors={colors}
              />

              <Typography
                sx={{
                  color: colors.textSecondary,
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                }}
              >
                {currentJob.description ||
                  "No description provided."}
              </Typography>
            </CardContent>
          </Card>

          {/* REQUIREMENTS */}

          <Card
            sx={{
              bgcolor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 3,
              color: colors.textPrimary,
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
                icon={<ListAlt />}
                title="Requirements"
                colors={colors}
              />

              <Typography
                sx={{
                  color: colors.textSecondary,
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                }}
              >
                {currentJob.requirements ||
                  "No requirements specified."}
              </Typography>
            </CardContent>
          </Card>

          {/* SKILLS */}

          <Card
            sx={{
              bgcolor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 3,
              color: colors.textPrimary,
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
                colors={colors}
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
                            colors.skillBg,
                          color:
                            colors.primaryLight,
                          border: `1px solid ${isDark
                            ? "rgba(99,102,241,0.25)"
                            : "rgba(99,102,241,0.20)"
                          }`,
                        }}
                      />
                    )
                  )}
                </Stack>
              ) : (
                <Typography
                  sx={{
                    color:
                      colors.textSecondary,
                  }}
                >
                  No skills specified.
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* FOOTER */}

          <Card
            sx={{
              bgcolor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={3}
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
                      color:
                        colors.textSecondary,
                    }}
                  >
                    Created
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        colors.textPrimary,
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
                      color:
                        colors.textSecondary,
                    }}
                  >
                    Last Updated
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        colors.textPrimary,
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
                    minWidth: 130,
                    textTransform: "none",
                    fontWeight: 600,

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
            </CardContent>
          </Card>

        </Container>
      </Box>
    </>
  );
};

// ==========================================
// INFO ITEM
// ==========================================

const InfoItem = ({
  icon,
  label,
  value,
  colors,
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
          bgcolor: colors.iconBg,
          color: colors.primaryLight,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            color: colors.textSecondary,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            color: colors.textPrimary,
            fontWeight: 500,
            mt: 0.2,
            wordBreak: "break-word",
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
  colors,
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
          color: colors.primaryLight,
          display: "flex",
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: colors.textPrimary,
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
};

export default ViewJob;