// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

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
//   IconButton,
//   Menu,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";

// import {
//   ArrowBack,
//   Add,
//   Search,
//   MoreVert,
//   Work,
//   People,
//   LocationOn,
//   CalendarToday,
//   Edit,
//   Delete,
//   Visibility,
// } from "@mui/icons-material";

// import useJob from "../../../hooks/useJob";
// import Navbar from "../../../components/dashboard/Navbar";
// const Jobs = () => {
//   const navigate = useNavigate();

//   const {
//     jobs,
//     loading,
//     error,
//     fetchMyJobs,
//     removeJob,
//   } = useJob();

//   const [search, setSearch] = useState("");
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [selectedJob, setSelectedJob] = useState(null);

//   // ==========================================
//   // FETCH JOBS
//   // ==========================================

//   useEffect(() => {
//     fetchMyJobs();
//   }, [fetchMyJobs]);

//   // ==========================================
//   // FILTER JOBS
//   // ==========================================

//   const filteredJobs = useMemo(() => {
//     if (!Array.isArray(jobs)) return [];

//     const value = search.toLowerCase().trim();

//     if (!value) return jobs;

//     return jobs.filter((job) =>
//       [
//         job.title,
//         job.company,
//         job.location,
//         job.jobType,
//         job.status,
//       ]
//         .filter(Boolean)
//         .some((field) =>
//           field
//             .toString()
//             .toLowerCase()
//             .includes(value)
//         )
//     );
//   }, [jobs, search]);

//   // ==========================================
//   // MENU
//   // ==========================================

//   const handleMenuOpen = (event, job) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedJob(job);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedJob(null);
//   };

//   // ==========================================
//   // DELETE
//   // ==========================================

//   const handleDelete = async () => {
//     if (!selectedJob?._id) return;

//     try {
//       await removeJob(selectedJob._id);
//       handleMenuClose();
//       await fetchMyJobs();
//     } catch (err) {
//       console.error("Delete job error:", err);
//     }
//   };

//   // ==========================================
//   // STATUS
//   // ==========================================

//   const getStatusConfig = (status) => {
//     switch (status) {
//       case "published":
//         return {
//           label: "Published",
//           color: "#4ade80",
//           bg: "rgba(34,197,94,0.12)",
//         };

//       case "draft":
//         return {
//           label: "Draft",
//           color: "#fbbf24",
//           bg: "rgba(251,191,36,0.12)",
//         };

//       case "closed":
//         return {
//           label: "Closed",
//           color: "#f87171",
//           bg: "rgba(239,68,68,0.12)",
//         };

//       default:
//         return {
//           label: status || "Unknown",
//           color: "#9ca3af",
//           bg: "rgba(156,163,175,0.12)",
//         };
//     }
//   };

//   // ==========================================
//   // DATE
//   // ==========================================

//   const formatDate = (date) => {
//     if (!date) return "Not specified";

//     return new Date(date).toLocaleDateString(
//       "en-IN",
//       {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading && !jobs) {
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
//   // UI
//   // ==========================================

//   return (
//     <>
//     <Navbar />
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
//         ======================================= */}

//         <Stack
//           direction={{
//             xs: "column",
//             sm: "row",
//           }}
//           spacing={3}
//           sx={{
//             justifyContent: "space-between",
//             alignItems: {
//               xs: "flex-start",
//               sm: "center",
//             },
//             mb: 4,
//           }}
//         >
//           {/* LEFT SIDE */}

//           <Stack
//             direction="row"
//             spacing={2}
//             sx={{
//               alignItems: "center",
//             }}
//           >
//             {/* BACK ARROW */}

//             <IconButton
//               onClick={() =>
//                 navigate("/recruiter")
//               }
//               sx={{
//                 color: "#d1d5db",
//                 bgcolor: "#1f2937",
//                 border:
//                   "1px solid #374151",

//                 "&:hover": {
//                   bgcolor: "#374151",
//                   borderColor: "#6366f1",
//                   color: "#a5b4fc",
//                 },
//               }}
//             >
//               <ArrowBack />
//             </IconButton>

//             {/* TITLE */}

//             <Box>
//               <Typography
//                 variant="h4"
//                 sx={{
//                   color: "#fff",
//                   fontWeight: 700,
//                   fontSize: {
//                     xs: "1.8rem",
//                     md: "2.2rem",
//                   },
//                 }}
//               >
//                 Manage Jobs
//               </Typography>

//               <Typography
//                 sx={{
//                   color: "#9ca3af",
//                   mt: 0.7,
//                 }}
//               >
//                 Create, manage and track
//                 your job postings.
//               </Typography>
//             </Box>
//           </Stack>

//           {/* CREATE JOB */}

//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={() =>
//               navigate(
//                 "/recruiter/jobs/create"
//               )
//             }
//             sx={{
//               minWidth: 150,
//               px: 2.5,
//               py: 1.2,
//               borderRadius: 2,
//               textTransform: "none",
//               fontWeight: 600,
//               background:
//                 "linear-gradient(135deg, #6366f1, #8b5cf6)",

//               "&:hover": {
//                 background:
//                   "linear-gradient(135deg, #4f46e5, #7c3aed)",
//               },
//             }}
//           >
//             Create Job
//           </Button>
//         </Stack>

//         {/* ======================================
//             ERROR
//         ======================================= */}

//         {error && (
//           <Alert
//             severity="error"
//             sx={{
//               mb: 3,
//               borderRadius: 2,
//             }}
//           >
//             {error}
//           </Alert>
//         )}

//         {/* ======================================
//             SEARCH
//         ======================================= */}

//         <Card
//           sx={{
//             bgcolor: "#1f2937",
//             border:
//               "1px solid #374151",
//             borderRadius: 3,
//             mb: 3,
//           }}
//         >
//           <CardContent>
//             <TextField
//               fullWidth
//               value={search}
//               onChange={(event) =>
//                 setSearch(event.target.value)
//               }
//               placeholder="Search jobs by title, company, location..."
//               InputProps={{
//                 startAdornment: (
//                   <Search
//                     sx={{
//                       color: "#9ca3af",
//                       mr: 1,
//                     }}
//                   />
//                 ),
//               }}
//               sx={inputStyle}
//             />
//           </CardContent>
//         </Card>

//         {/* ======================================
//             JOB COUNT
//         ======================================= */}

//         <Stack
//           direction="row"
//           sx={{
//             justifyContent:
//               "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Typography
//             sx={{
//               color: "#9ca3af",
//             }}
//           >
//             {filteredJobs.length}{" "}
//             {filteredJobs.length === 1
//               ? "job"
//               : "jobs"} found
//           </Typography>
//         </Stack>

//         {/* ======================================
//             NO JOBS
//         ======================================= */}

//         {filteredJobs.length === 0 ? (
//           <Card
//             sx={{
//               bgcolor: "#1f2937",
//               border:
//                 "1px solid #374151",
//               borderRadius: 3,
//             }}
//           >
//             <CardContent
//               sx={{
//                 py: 8,
//                 textAlign: "center",
//               }}
//             >
//               <Work
//                 sx={{
//                   fontSize: 55,
//                   color: "#6366f1",
//                   mb: 2,
//                 }}
//               />

//               <Typography
//                 variant="h6"
//                 sx={{
//                   color: "#fff",
//                   fontWeight: 600,
//                 }}
//               >
//                 No jobs found
//               </Typography>

//               <Typography
//                 sx={{
//                   color: "#9ca3af",
//                   mt: 1,
//                   mb: 3,
//                 }}
//               >
//                 Create your first job posting
//                 to get started.
//               </Typography>

//               <Button
//                 variant="contained"
//                 startIcon={<Add />}
//                 onClick={() =>
//                   navigate(
//                     "/recruiter/jobs/create"
//                   )
//                 }
//                 sx={{
//                   textTransform: "none",
//                   background:
//                     "linear-gradient(135deg, #6366f1, #8b5cf6)",
//                 }}
//               >
//                 Create Job
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           /* ======================================
//               JOB LIST
//           ======================================= */

//           <Grid
//             container
//             spacing={3}
//           >
//             {filteredJobs.map((job) => {
//               const status =
//                 getStatusConfig(
//                   job.status
//                 );

//               return (
//                 <Grid
//                   key={job._id}
//                   size={{
//                     xs: 12,
//                     md: 6,
//                   }}
//                 >
//                   <Card
//                     sx={{
//                       height: "100%",
//                       bgcolor: "#1f2937",
//                       border:
//                         "1px solid #374151",
//                       borderRadius: 3,
//                       color: "#fff",
//                       transition:
//                         "0.2s",

//                       "&:hover": {
//                         borderColor:
//                           "#6366f1",
//                         transform:
//                           "translateY(-2px)",
//                       },
//                     }}
//                   >
//                     <CardContent
//                       sx={{
//                         p: 3,
//                       }}
//                     >
//                       {/* TOP */}

//                       <Stack
//                         direction="row"
//                         sx={{
//                           justifyContent:
//                             "space-between",
//                           alignItems:
//                             "flex-start",
//                         }}
//                       >
//                         <Stack
//                           direction="row"
//                           spacing={2}
//                         >
//                           <Box
//                             sx={{
//                               width: 50,
//                               height: 50,
//                               borderRadius: 2,
//                               display:
//                                 "flex",
//                               justifyContent:
//                                 "center",
//                               alignItems:
//                                 "center",
//                               bgcolor:
//                                 "rgba(99,102,241,0.15)",
//                             }}
//                           >
//                             <Work
//                               sx={{
//                                 color:
//                                   "#818cf8",
//                               }}
//                             />
//                           </Box>

//                           <Box>
//                             <Typography
//                               variant="h6"
//                               sx={{
//                                 color:
//                                   "#fff",
//                                 fontWeight:
//                                   600,
//                               }}
//                             >
//                               {job.title}
//                             </Typography>

//                             <Typography
//                               sx={{
//                                 color:
//                                   "#9ca3af",
//                                 mt: 0.3,
//                               }}
//                             >
//                               {job.company ||
//                                 "Your Company"}
//                             </Typography>
//                           </Box>
//                         </Stack>

//                         <IconButton
//                           onClick={(event) =>
//                             handleMenuOpen(
//                               event,
//                               job
//                             )
//                           }
//                           sx={{
//                             color:
//                               "#9ca3af",
//                           }}
//                         >
//                           <MoreVert />
//                         </IconButton>
//                       </Stack>

//                       <Divider
//                         sx={{
//                           my: 2.5,
//                           borderColor:
//                             "#374151",
//                         }}
//                       />

//                       {/* JOB INFO */}

//                       <Stack spacing={1.5}>
//                         <InfoRow
//                           icon={
//                             <LocationOn />
//                           }
//                           text={
//                             job.location ||
//                             "Location not specified"
//                           }
//                         />

//                         <InfoRow
//                           icon={
//                             <Work />
//                           }
//                           text={
//                             job.jobType ||
//                             "Job type not specified"
//                           }
//                         />

//                         <InfoRow
//                           icon={
//                             <CalendarToday />
//                           }
//                           text={`Deadline: ${formatDate(
//                             job.deadline
//                           )}`}
//                         />
//                       </Stack>

//                       {/* BOTTOM */}

//                       <Stack
//                         direction="row"
//                         sx={{
//                           justifyContent:
//                             "space-between",
//                           alignItems:
//                             "center",
//                           mt: 3,
//                         }}
//                       >
//                         <Chip
//                           label={
//                             status.label
//                           }
//                           sx={{
//                             bgcolor:
//                               status.bg,
//                             color:
//                               status.color,
//                             fontWeight:
//                               600,
//                           }}
//                         />

//                         <Stack
//                           direction="row"
//                           spacing={1}
//                         >
//                           <Button
//                             size="small"
//                             startIcon={
//                               <Visibility />
//                             }
//                             onClick={() =>
//                               navigate(
//                                 `/recruiter/jobs/${job._id}`
//                               )
//                             }
//                             sx={{
//                               color:
//                                 "#a5b4fc",
//                               textTransform:
//                                 "none",
//                             }}
//                           >
//                             View
//                           </Button>

//                           <Button
//                             size="small"
//                             startIcon={
//                               <Edit />
//                             }
//                             onClick={() =>
//                               navigate(
//                                 `/recruiter/jobs/${job._id}/edit`
//                               )
//                             }
//                             sx={{
//                               color:
//                                 "#a5b4fc",
//                               textTransform:
//                                 "none",
//                             }}
//                           >
//                             Edit
//                           </Button>
//                         </Stack>
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         )}

//         {/* ======================================
//             MENU
//         ======================================= */}

//         <Menu
//           anchorEl={menuAnchor}
//           open={Boolean(menuAnchor)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem
//             onClick={() => {
//               navigate(
//                 `/recruiter/jobs/${selectedJob?._id}`
//               );
//               handleMenuClose();
//             }}
//           >
//             <Visibility
//               fontSize="small"
//               sx={{ mr: 1 }}
//             />
//             View
//           </MenuItem>

//           <MenuItem
//             onClick={() => {
//               navigate(
//                 `/recruiter/jobs/${selectedJob?._id}/edit`
//               );
//               handleMenuClose();
//             }}
//           >
//             <Edit
//               fontSize="small"
//               sx={{ mr: 1 }}
//             />
//             Edit
//           </MenuItem>

//           <MenuItem
//             onClick={handleDelete}
//             sx={{
//               color: "#ef4444",
//             }}
//           >
//             <Delete
//               fontSize="small"
//               sx={{ mr: 1 }}
//             />
//             Delete
//           </MenuItem>
//         </Menu>
//       </Container>
//     </Box>
//   </>
//   );
// };

// // ==========================================
// // INFO ROW
// // ==========================================

// const InfoRow = ({
//   icon,
//   text,
// }) => {
//   return (
//     <Stack
//       direction="row"
//       spacing={1}
//       sx={{
//         alignItems: "center",
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           color: "#818cf8",
//         }}
//       >
//         {icon}
//       </Box>

//       <Typography
//         variant="body2"
//         sx={{
//           color: "#d1d5db",
//         }}
//       >
//         {text}
//       </Typography>
//     </Stack>
//   );
// };

// // ==========================================
// // INPUT STYLE
// // ==========================================

// const inputStyle = {
//   "& .MuiOutlinedInput-root": {
//     color: "#fff",
//     bgcolor: "#111827",

//     "& fieldset": {
//       borderColor: "#374151",
//     },

//     "&:hover fieldset": {
//       borderColor: "#6366f1",
//     },

//     "&.Mui-focused fieldset": {
//       borderColor: "#8b5cf6",
//     },
//   },

//   "& .MuiInputBase-input": {
//     color: "#fff",
//   },

//   "& .MuiInputBase-input::placeholder": {
//     color: "#6b7280",
//     opacity: 1,
//   },
// };

// export default Jobs;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
 // useTheme,
} from "@mui/material";

import {
  ArrowBack,
  Add,
  Search,
  MoreVert,
  Work,
  LocationOn,
  CalendarToday,
  Edit,
  Delete,
  Visibility,
} from "@mui/icons-material";

import useJob from "../../../hooks/useJob";

import RNavbar from "../../../components/layout/recruiter/Navbar";
import RSidebar from "../../../components/layout/recruiter/Sidebar";

const Jobs = () => {
  const navigate = useNavigate();
 // const theme = useTheme();

  const {
    jobs,
    loading,
    error,
    fetchMyJobs,
    removeJob,
  } = useJob();

  const [search, setSearch] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];

    const value = search.toLowerCase().trim();

    if (!value) return jobs;

    return jobs.filter((job) =>
      [
        job.title,
        job.company,
        job.location,
        job.jobType,
        job.status,
      ]
        .filter(Boolean)
        .some((field) =>
          field
            .toString()
            .toLowerCase()
            .includes(value)
        )
    );
  }, [jobs, search]);

  const handleMenuOpen = (event, job) => {
    setMenuAnchor(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedJob(null);
  };

  const handleDelete = async () => {
    if (!selectedJob?._id) return;

    try {
      await removeJob(selectedJob._id);
      handleMenuClose();
      await fetchMyJobs();
    } catch (err) {
      console.error("Delete job error:", err);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "published":
        return {
          label: "Published",
          color: "success.main",
          bg: "rgba(34,197,94,0.12)",
        };

      case "draft":
        return {
          label: "Draft",
          color: "warning.main",
          bg: "rgba(251,191,36,0.12)",
        };

      case "closed":
        return {
          label: "Closed",
          color: "error.main",
          bg: "rgba(239,68,68,0.12)",
        };

      default:
        return {
          label: status || "Unknown",
          color: "text.secondary",
          bg: "rgba(156,163,175,0.12)",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading && !jobs) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          size={42}
          sx={{
            color: "primary.main",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Navbar */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <RNavbar />
      </Box>

      {/* Sidebar + Main */}
      <Box
        sx={{
          display: "flex",
          minWidth: 0,
        }}
      >
        {/* Sidebar */}
        <RSidebar />

        {/* Main */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: "background.default",
            color: "text.primary",
            py: {
              xs: 3,
              md: 5,
            },
          }}
        >
          <Container maxWidth="lg">
            {/* HEADER */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={3}
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
                <IconButton
                  onClick={() =>
                    navigate("/recruiter")
                  }
                  sx={{
                    color: "text.secondary",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",

                    "&:hover": {
                      bgcolor: "action.hover",
                      borderColor: "primary.main",
                      color: "primary.main",
                    },
                  }}
                >
                  <ArrowBack />
                </IconButton>

                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "text.primary",
                      fontWeight: 700,
                      fontSize: {
                        xs: "1.8rem",
                        md: "2.2rem",
                      },
                    }}
                  >
                    Manage Jobs
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",
                      mt: 0.7,
                    }}
                  >
                    Create, manage and track your job postings.
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() =>
                  navigate("/recruiter/jobs/create")
                }
                sx={{
                  minWidth: 150,
                  px: 2.5,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,

                  "&:hover": {
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                }}
              >
                Create Job
              </Button>
            </Stack>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}

            {/* SEARCH */}

            <Card
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                mb: 3,
              }}
            >
              <CardContent>
                <TextField
                  fullWidth
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search jobs by title, company, location..."
                  InputProps={{
                    startAdornment: (
                      <Search
                        sx={{
                          color: "text.secondary",
                          mr: 1,
                        }}
                      />
                    ),
                  }}
                  sx={inputStyle}
                />
              </CardContent>
            </Card>

            {/* JOB COUNT */}

            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",
                }}
              >
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} found
              </Typography>
            </Stack>

            {/* NO JOBS */}

            {filteredJobs.length === 0 ? (
              <Card
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent
                  sx={{
                    py: 8,
                    textAlign: "center",
                  }}
                >
                  <Work
                    sx={{
                      fontSize: 55,
                      color: "primary.main",
                      mb: 2,
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                    }}
                  >
                    No jobs found
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",
                      mt: 1,
                      mb: 3,
                    }}
                  >
                    Create your first job posting to get started.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() =>
                      navigate("/recruiter/jobs/create")
                    }
                    sx={{
                      textTransform: "none",
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                  >
                    Create Job
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {filteredJobs.map((job) => {
                  const status = getStatusConfig(job.status);

                  return (
                    <Grid
                      key={job._id}
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 3,
                          color: "text.primary",
                          transition: "0.2s",

                          "&:hover": {
                            borderColor: "primary.main",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack
                            direction="row"
                            sx={{
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Stack direction="row" spacing={2}>
                              <Box
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 2,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  bgcolor: "rgba(99,102,241,0.15)",
                                }}
                              >
                                <Work sx={{ color: "primary.light" }} />
                              </Box>

                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "text.primary",
                                    fontWeight: 600,
                                  }}
                                >
                                  {job.title}
                                </Typography>

                                <Typography
                                  sx={{
                                    color: "text.secondary",
                                    mt: 0.3,
                                  }}
                                >
                                  {job.company || "Your Company"}
                                </Typography>
                              </Box>
                            </Stack>

                            <IconButton
                              onClick={(event) =>
                                handleMenuOpen(event, job)
                              }
                              sx={{
                                color: "text.secondary",
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Stack>

                          <Divider
                            sx={{
                              my: 2.5,
                              borderColor: "divider",
                            }}
                          />

                          <Stack spacing={1.5}>
                            <InfoRow
                              icon={<LocationOn />}
                              text={job.location || "Location not specified"}
                            />

                            <InfoRow
                              icon={<Work />}
                              text={job.jobType || "Job type not specified"}
                            />

                            <InfoRow
                              icon={<CalendarToday />}
                              text={`Deadline: ${formatDate(job.deadline)}`}
                            />
                          </Stack>

                          <Stack
                            direction="row"
                            sx={{
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 3,
                            }}
                          >
                            <Chip
                              label={status.label}
                              sx={{
                                bgcolor: status.bg,
                                color: status.color,
                                fontWeight: 600,
                              }}
                            />

                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() =>
                                  navigate(`/recruiter/jobs/${job._id}`)
                                }
                                sx={{
                                  color: "primary.light",
                                  textTransform: "none",
                                }}
                              >
                                View
                              </Button>

                              <Button
                                size="small"
                                startIcon={<Edit />}
                                onClick={() =>
                                  navigate(`/recruiter/jobs/${job._id}/edit`)
                                }
                                sx={{
                                  color: "primary.light",
                                  textTransform: "none",
                                }}
                              >
                                Edit
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  navigate(`/recruiter/jobs/${selectedJob?._id}`);
                  handleMenuClose();
                }}
              >
                <Visibility fontSize="small" sx={{ mr: 1 }} />
                View
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate(`/recruiter/jobs/${selectedJob?._id}/edit`);
                  handleMenuClose();
                }}
              >
                <Edit fontSize="small" sx={{ mr: 1 }} />
                Edit
              </MenuItem>

              <MenuItem
                onClick={handleDelete}
                sx={{
                  color: "error.main",
                }}
              >
                <Delete fontSize="small" sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            </Menu>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

const InfoRow = ({ icon, text }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          color: "primary.light",
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "text.primary",
    bgcolor: "background.default",

    "& fieldset": {
      borderColor: "divider",
    },

    "&:hover fieldset": {
      borderColor: "primary.main",
    },

    "&.Mui-focused fieldset": {
      borderColor: "secondary.main",
    },
  },

  "& .MuiInputBase-input": {
    color: "text.primary",
  },

  "& .MuiInputBase-input::placeholder": {
    color: "text.secondary",
    opacity: 1,
  },
};

// ==========================================
// BRAND GRADIENT
// ==========================================

const brandGradient =
  "linear-gradient(135deg, #3b82f6, #9333ea)";

// ==========================================
// BRAND GRADIENT
// ==========================================

//const brandGradient = "linear-gradient(135deg, #3b82f6, #9333ea)";

export default Jobs;