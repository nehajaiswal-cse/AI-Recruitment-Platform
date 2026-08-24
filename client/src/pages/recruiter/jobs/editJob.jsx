// import { useCallback, useEffect, useState } from "react";
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
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";

// import {
//   ArrowBack,
//   Add,
//   Delete,
//   Work,
//   LocationOn,
//   Description,
// } from "@mui/icons-material";

// import useJob from "../../../hooks/useJob";
// import Navbar from "../../../components/dashboard/Navbar";

// const EditJob = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const {
//     currentJob,
//     loading,
//     error,
//     fetchJobById,
//     editJob,
//   } = useJob();

//   // =====================================================
//   // FORM STATE
//   // =====================================================

//   const [formData, setFormData] = useState({
//     title: "",
//     company: "",
//     location: "",
//     jobType: "Full-time",
//     experience: "",
//     salary: "",
//     description: "",
//     requirements: "",
//     status: "published",
//     deadline: "",
//   });

//   const [skills, setSkills] = useState([]);
//   const [skillInput, setSkillInput] = useState("");

//   const [formError, setFormError] = useState("");
//   const [updating, setUpdating] = useState(false);

//   // =====================================================
//   // FETCH JOB
//   // =====================================================

//   const loadJob = useCallback(async () => {
//     if (!id) return;

//     try {
//       await fetchJobById(id);
//     } catch (err) {
//       console.error("Fetch job error:", err);
//     }
//   }, [id, fetchJobById]);

//   useEffect(() => {
//     loadJob();
//   }, [loadJob]);

//   // =====================================================
//   // SET FORM DATA
//   // =====================================================

//   useEffect(() => {
//     if (!currentJob) return;

//     setFormData({
//       title: currentJob.title ?? "",

//       company: currentJob.company ?? "",

//       location: currentJob.location ?? "",

//       jobType:
//         currentJob.jobType ?? "Full-time",

//       experience:
//         currentJob.experience ?? "",

//       salary:
//         currentJob.salary ?? "",

//       description:
//         currentJob.description ?? "",

//       requirements:
//         currentJob.requirements ?? "",

//       status:
//         currentJob.status ?? "published",

//       deadline: currentJob.deadline
//         ? new Date(currentJob.deadline)
//             .toISOString()
//             .split("T")[0]
//         : "",
//     });

//     setSkills(
//       Array.isArray(currentJob.skills)
//         ? currentJob.skills
//         : []
//     );
//   }, [currentJob]);

//   // =====================================================
//   // HANDLE CHANGE
//   // =====================================================

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));

//     setFormError("");
//   };

//   // =====================================================
//   // ADD SKILL
//   // =====================================================

//   const handleAddSkill = () => {
//     const skill = skillInput.trim();

//     if (!skill) return;

//     const alreadyExists = skills.some(
//       (item) =>
//         item.toLowerCase() ===
//         skill.toLowerCase()
//     );

//     if (alreadyExists) {
//       setSkillInput("");
//       return;
//     }

//     setSkills((previous) => [
//       ...previous,
//       skill,
//     ]);

//     setSkillInput("");
//   };

//   // =====================================================
//   // REMOVE SKILL
//   // =====================================================

//   const handleRemoveSkill = (skillToRemove) => {
//     setSkills((previous) =>
//       previous.filter(
//         (skill) => skill !== skillToRemove
//       )
//     );
//   };

//   // =====================================================
//   // SUBMIT
//   // =====================================================

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (updating) return;

//     setFormError("");

//     // -----------------------------
//     // VALIDATION
//     // -----------------------------

//     if (!formData.title.trim()) {
//       setFormError("Job title is required.");
//       return;
//     }

//     if (!formData.description.trim()) {
//       setFormError(
//         "Job description is required."
//       );
//       return;
//     }

//     // =================================================
//     // BACKEND PAYLOAD
//     // =================================================

//     const jobData = {
//       title: formData.title.trim(),

//       company: formData.company.trim(),

//       location: formData.location.trim(),

//       jobType: formData.jobType,

//       experience:
//         formData.experience.trim(),

//       salary:
//         formData.salary.trim(),

//       description:
//         formData.description.trim(),

//       requirements:
//         formData.requirements.trim(),

//       skills,

//       status: formData.status,

//       ...(formData.deadline
//         ? {
//             deadline: formData.deadline,
//           }
//         : {}),
//     };

//     console.log(
//       "UPDATE JOB DATA:",
//       jobData
//     );

//     // =================================================
//     // UPDATE JOB
//     // =================================================

//     try {
//       setUpdating(true);

//       await editJob(id, jobData);

//       navigate("/recruiter/jobs");
//     } catch (err) {
//       console.error(
//         "Update job error:",
//         err
//       );

//       setFormError(
//         err.response?.data?.message ||
//           "Failed to update job."
//       );
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // =====================================================
//   // INITIAL LOADING
//   // =====================================================

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

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <>
//     <Navbar></Navbar>
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

//         {/* HEADER */}

//         <Stack
//           direction="row"
//           spacing={2}
//           sx={{
//             alignItems: "center",
//             mb: 4,
//           }}
//         >
//           <IconButton
//             onClick={() =>
//               navigate("/recruiter/jobs")
//             }
//             sx={{
//               color: "#d1d5db",
//               bgcolor: "#1f2937",

//               "&:hover": {
//                 bgcolor: "#374151",
//               },
//             }}
//           >
//             <ArrowBack />
//           </IconButton>

//           <Box>
//             <Typography
//               variant="h4"
//               sx={{
//                 fontWeight: 700,
//                 color: "#fff",
//               }}
//             >
//               Edit Job
//             </Typography>

//             <Typography
//               sx={{
//                 color: "#9ca3af",
//                 mt: 0.5,
//               }}
//             >
//               Update your job posting details.
//             </Typography>
//           </Box>
//         </Stack>

//         {/* ERROR */}

//         {(formError || error) && (
//           <Alert
//             severity="error"
//             sx={{
//               mb: 3,
//               borderRadius: 2,
//             }}
//           >
//             {formError || error}
//           </Alert>
//         )}

//         {/* FORM CARD */}

//         <Card
//           sx={{
//             bgcolor: "#1f2937",
//             color: "#fff",
//             border: "1px solid #374151",
//             borderRadius: 3,
//           }}
//         >
//           <CardContent
//             sx={{
//               p: {
//                 xs: 2,
//                 md: 4,
//               },
//             }}
//           >
//             <form onSubmit={handleSubmit}>

//               {/* =====================================
//                   BASIC INFORMATION
//               ====================================== */}

//               <SectionTitle
//                 icon={<Work />}
//                 title="Basic Information"
//               />

//               <Grid
//                 container
//                 spacing={3}
//               >

//                 {/* JOB TITLE */}

//                 <Grid
//                   size={{
//                     xs: 12,
//                     md: 6,
//                   }}
//                 >
//                   <TextField
//                     fullWidth
//                     required
//                     label="Job Title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     sx={inputStyle}
//                   />
//                 </Grid>

//                 {/* COMPANY */}

//                 <Grid
//                   size={{
//                     xs: 12,
//                     md: 6,
//                   }}
//                 >
//                   <TextField
//                     fullWidth
//                     label="Company"
//                     name="company"
//                     value={formData.company}
//                     onChange={handleChange}
//                     sx={inputStyle}
//                   />
//                 </Grid>

//                 {/* LOCATION */}

//                 <Grid
//                   size={{
//                     xs: 12,
//                     md: 6,
//                   }}
//                 >
//                   <TextField
//                     fullWidth
//                     label="Location"
//                     name="location"
//                     value={formData.location}
//                     onChange={handleChange}
//                     sx={inputStyle}
//                     slotProps={{
//                       input: {
//                         startAdornment: (
//                           <LocationOn
//                             sx={{
//                               color: "#9ca3af",
//                               mr: 1,
//                             }}
//                           />
//                         ),
//                       },
//                     }}
//                   />
//                 </Grid>

//                 {/* JOB TYPE */}

//                 <Grid
//                   size={{
//                     xs: 12,
//                     md: 6,
//                   }}
//                 >
//                   <TextField
//                     fullWidth
//                     select
//                     label="Job Type"
//                     name="jobType"
//                     value={formData.jobType}
//                     onChange={handleChange}
//                     sx={inputStyle}
//                   >
//                     <MenuItem value="Full-time">
//                       Full-time
//                     </MenuItem>

//                     <MenuItem value="Part-time">
//                       Part-time
//                     </MenuItem>

//                     <MenuItem value="Internship">
//                       Internship
//                     </MenuItem>

//                     <MenuItem value="Contract">
//                       Contract
//                     </MenuItem>

//                     <MenuItem value="Remote">
//                       Remote
//                     </MenuItem>
//                   </TextField>
//                 </Grid>

//                 {/* EXPERIENCE */}

//                 <Grid
//                   size={{
//                     xs: 12,
//                     md: 6,
//                   }}
//                 >
//                   <TextField
//                     fullWidth
//                     label="Experience"
//                     name="experience"
//                     placeholder="e.g. 2-4 years"
//                     value={formData.experience}
//                     onChange={handleChange}
//                     sx={inputStyle}
//                   />
//                 </Grid>

//                 {/* SALARY */}

//                 <Grid
//                   size={{
//                     xs: 12,
//                     md: 6,
//                   }}
//                 >
//                   <TextField
//                     fullWidth
//                     label="Salary"
//                     name="salary"
//                     placeholder="e.g. ₹6-10 LPA"
//                     value={formData.salary}
//                     onChange={handleChange}
//                     sx={inputStyle}
//                   />
//                 </Grid>

//               </Grid>

//               <Divider sx={dividerStyle} />

//               {/* =====================================
//                   JOB DESCRIPTION
//               ====================================== */}

//               <SectionTitle
//                 icon={<Description />}
//                 title="Job Description"
//               />

//               <TextField
//                 fullWidth
//                 required
//                 multiline
//                 minRows={7}
//                 label="Description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 sx={inputStyle}
//               />

//               {/* REQUIREMENTS */}

//               <Box sx={{ mt: 3 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   minRows={5}
//                   label="Requirements"
//                   name="requirements"
//                   value={formData.requirements}
//                   onChange={handleChange}
//                   sx={inputStyle}
//                 />
//               </Box>

//               <Divider sx={dividerStyle} />

//               {/* =====================================
//                   SKILLS
//               ====================================== */}

//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: 600,
//                   mb: 2,
//                 }}
//               >
//                 Required Skills
//               </Typography>

//               <Stack
//                 direction={{
//                   xs: "column",
//                   sm: "row",
//                 }}
//                 spacing={2}
//               >
//                 <TextField
//                   fullWidth
//                   label="Add Skill"
//                   value={skillInput}
//                   onChange={(event) =>
//                     setSkillInput(
//                       event.target.value
//                     )
//                   }
//                   onKeyDown={(event) => {
//                     if (event.key === "Enter") {
//                       event.preventDefault();
//                       handleAddSkill();
//                     }
//                   }}
//                   sx={inputStyle}
//                 />

//                 <Button
//                   type="button"
//                   variant="outlined"
//                   startIcon={<Add />}
//                   onClick={handleAddSkill}
//                   sx={{
//                     minWidth: 130,
//                     height: 56,
//                     borderColor: "#6366f1",
//                     color: "#a5b4fc",
//                     textTransform: "none",

//                     "&:hover": {
//                       borderColor: "#8b5cf6",
//                     },
//                   }}
//                 >
//                   Add Skill
//                 </Button>
//               </Stack>

//               {skills.length > 0 && (
//                 <Stack
//                   direction="row"
//                   spacing={1}
//                   useFlexGap
//                   sx={{
//                     flexWrap: "wrap",
//                     mt: 2,
//                   }}
//                 >
//                   {skills.map((skill) => (
//                     <Chip
//                       key={skill}
//                       label={skill}
//                       onDelete={() =>
//                         handleRemoveSkill(skill)
//                       }
//                       deleteIcon={<Delete />}
//                       sx={{
//                         bgcolor:
//                           "rgba(99,102,241,0.15)",
//                         color: "#a5b4fc",
//                       }}
//                     />
//                   ))}
//                 </Stack>
//               )}

//               {/* =====================================
//                   STATUS + DEADLINE
//               ====================================== */}

//               <Grid
//                 container
//                 spacing={3}
//                 sx={{ mt: 1 }}
//               >

//                 {/* STATUS */}

//                 <Grid
//                   size={{
//                     xs: 12,
//                     md: 6,
//                   }}
//                 >
//                   <TextField
//                     fullWidth
//                     select
//                     label="Job Status"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     sx={inputStyle}
//                   >
//                     <MenuItem value="draft">
//                       Draft
//                     </MenuItem>

//                     <MenuItem value="published">
//                       Published
//                     </MenuItem>

//                     <MenuItem value="closed">
//                       Closed
//                     </MenuItem>
//                   </TextField>
//                 </Grid>

//                 {/* DEADLINE */}

//                 <Grid
//                   size={{
//                     xs: 12,
//                     md: 6,
//                   }}
//                 >
//                   <TextField
//                     fullWidth
//                     type="date"
//                     label="Application Deadline"
//                     name="deadline"
//                     value={formData.deadline}
//                     onChange={handleChange}
//                     sx={inputStyle}
//                     slotProps={{
//                       inputLabel: {
//                         shrink: true,
//                       },
//                     }}
//                   />
//                 </Grid>

//               </Grid>

//               {/* =====================================
//                   ACTIONS
//               ====================================== */}

//               <Stack
//                 direction={{
//                   xs: "column-reverse",
//                   sm: "row",
//                 }}
//                 spacing={2}
//                 sx={{
//                   justifyContent: "flex-end",
//                   mt: 5,
//                 }}
//               >

//                 <Button
//                   type="button"
//                   variant="outlined"
//                   onClick={() =>
//                     navigate("/recruiter/jobs")
//                   }
//                   sx={{
//                     minWidth: 120,
//                     height: 44,
//                     textTransform: "none",
//                     borderColor: "#4b5563",
//                     color: "#d1d5db",
//                   }}
//                 >
//                   Cancel
//                 </Button>

//                 <Button
//                   type="submit"
//                   variant="contained"
//                   disabled={updating}
//                   sx={{
//                     minWidth: 150,
//                     height: 44,
//                     textTransform: "none",
//                     fontWeight: 600,

//                     background:
//                       "linear-gradient(135deg, #6366f1, #8b5cf6)",

//                     "&:hover": {
//                       background:
//                         "linear-gradient(135deg, #4f46e5, #7c3aed)",
//                     },

//                     "&.Mui-disabled": {
//                       color: "#fff",
//                       background:
//                         "linear-gradient(135deg, #6366f1, #8b5cf6)",
//                       opacity: 0.65,
//                     },
//                   }}
//                 >
//                   {updating
//                     ? "Updating..."
//                     : "Update Job"}
//                 </Button>

//               </Stack>

//             </form>
//           </CardContent>
//         </Card>
//       </Container>
//     </Box>
//     </>
//   );
// };

// // =====================================================
// // SECTION TITLE
// // =====================================================

// const SectionTitle = ({ icon, title }) => {
//   return (
//     <Stack
//       direction="row"
//       spacing={1}
//       sx={{
//         alignItems: "center",
//         mb: 3,
//       }}
//     >
//       {icon && (
//         <Box
//           sx={{
//             color: "#818cf8",
//             display: "flex",
//           }}
//         >
//           {icon}
//         </Box>
  
//       )}

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

// // =====================================================
// // DIVIDER STYLE
// // =====================================================

// const dividerStyle = {
//   my: 4,
//   borderColor: "#374151",
// };

// // =====================================================
// // INPUT STYLE
// // =====================================================

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

//   "& .MuiInputLabel-root": {
//     color: "#9ca3af",
//   },

//   "& .MuiInputLabel-root.Mui-focused": {
//     color: "#a5b4fc",
//   },

//   "& .MuiInputBase-input": {
//     color: "#fff",
//   },

//   "& textarea": {
//     color: "#fff",
//   },

//   "& .MuiSelect-select": {
//     color: "#fff",
//   },
// };

// export default EditJob;



import { useCallback, useEffect, useState } from "react";
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
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowBack,
  Add,
  Delete,
  Work,
  LocationOn,
  Description,
} from "@mui/icons-material";

import useJob from "../../../hooks/useJob";
import Navbar from "../../../components/dashboard/Navbar";

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const {
    currentJob,
    loading,
    error,
    fetchJobById,
    editJob,
  } = useJob();

  // =====================================================
  // THEME COLORS
  // =====================================================

  const colors = {
    pageBg: isDark
      ? "#111827"
      : theme.palette.background.default,

    cardBg: isDark
      ? "#1f2937"
      : theme.palette.background.paper,

    inputBg: isDark
      ? "#111827"
      : theme.palette.background.default,

    border: isDark
      ? "#374151"
      : theme.palette.divider,

    text: isDark
      ? "#ffffff"
      : theme.palette.text.primary,

    secondaryText: isDark
      ? "#9ca3af"
      : theme.palette.text.secondary,

    icon: isDark
      ? "#818cf8"
      : theme.palette.primary.main,

    inputText: isDark
      ? "#ffffff"
      : theme.palette.text.primary,

    placeholder: isDark
      ? "#6b7280"
      : theme.palette.text.secondary,

    buttonText: isDark
      ? "#a5b4fc"
      : theme.palette.primary.main,

    hoverBorder: isDark
      ? "#6366f1"
      : theme.palette.primary.main,

    chipBg: isDark
      ? "rgba(99,102,241,0.15)"
      : "rgba(99,102,241,0.10)",
  };

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    experience: "",
    salary: "",
    description: "",
    requirements: "",
    status: "published",
    deadline: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [formError, setFormError] = useState("");
  const [updating, setUpdating] = useState(false);

  // =====================================================
  // FETCH JOB
  // =====================================================

  const loadJob = useCallback(async () => {
    if (!id) return;

    try {
      await fetchJobById(id);
    } catch (err) {
      console.error("Fetch job error:", err);
    }
  }, [id, fetchJobById]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  // =====================================================
  // SET FORM DATA
  // =====================================================

  useEffect(() => {
    if (!currentJob) return;

    setFormData({
      title: currentJob.title ?? "",
      company: currentJob.company ?? "",
      location: currentJob.location ?? "",
      jobType: currentJob.jobType ?? "Full-time",
      experience: currentJob.experience ?? "",
      salary: currentJob.salary ?? "",
      description: currentJob.description ?? "",
      requirements: currentJob.requirements ?? "",
      status: currentJob.status ?? "published",

      deadline: currentJob.deadline
        ? new Date(currentJob.deadline)
            .toISOString()
            .split("T")[0]
        : "",
    });

    setSkills(
      Array.isArray(currentJob.skills)
        ? currentJob.skills
        : []
    );
  }, [currentJob]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  // =====================================================
  // ADD SKILL
  // =====================================================

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const alreadyExists = skills.some(
      (item) =>
        item.toLowerCase() ===
        skill.toLowerCase()
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setSkills((previous) => [
      ...previous,
      skill,
    ]);

    setSkillInput("");
  };

  // =====================================================
  // REMOVE SKILL
  // =====================================================

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((previous) =>
      previous.filter(
        (skill) => skill !== skillToRemove
      )
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (updating) return;

    setFormError("");

    // =================================================
    // VALIDATION
    // =================================================

    if (!formData.title.trim()) {
      setFormError("Job title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setFormError(
        "Job description is required."
      );
      return;
    }

    // =================================================
    // BACKEND PAYLOAD
    // =================================================

    const jobData = {
      title: formData.title.trim(),

      company: formData.company.trim(),

      location: formData.location.trim(),

      jobType: formData.jobType,

      experience:
        formData.experience.trim(),

      salary:
        formData.salary.trim(),

      description:
        formData.description.trim(),

      requirements:
        formData.requirements.trim(),

      skills,

      status: formData.status,

      ...(formData.deadline
        ? {
            deadline: formData.deadline,
          }
        : {}),
    };

    console.log(
      "UPDATE JOB DATA:",
      jobData
    );

    // =================================================
    // UPDATE JOB
    // =================================================

    try {
      setUpdating(true);

      await editJob(id, jobData);

      navigate("/recruiter/jobs");
    } catch (err) {
      console.error(
        "Update job error:",
        err
      );

      setFormError(
        err.response?.data?.message ||
          "Failed to update job."
      );
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // INITIAL LOADING
  // =====================================================

  if (loading && !currentJob) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: colors.pageBg,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "background-color 0.3s ease",
        }}
      >
        <CircularProgress
          size={42}
          sx={{
            color: theme.palette.primary.main,
          }}
        />
      </Box>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: colors.pageBg,
          color: colors.text,
          py: {
            xs: 3,
            md: 5,
          },

          transition:
            "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <Container maxWidth="lg">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              mb: 4,
            }}
          >
            <IconButton
              onClick={() =>
                navigate("/recruiter/jobs")
              }
              sx={{
                color: colors.secondaryText,
                bgcolor: colors.cardBg,
                border: `1px solid ${colors.border}`,

                "&:hover": {
                  bgcolor: isDark
                    ? "#374151"
                    : theme.palette.action.hover,

                  borderColor:
                    theme.palette.primary.main,
                },

                transition:
                  "all 0.2s ease",
              }}
            >
              <ArrowBack />
            </IconButton>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: colors.text,
                }}
              >
                Edit Job
              </Typography>

              <Typography
                sx={{
                  color:
                    colors.secondaryText,
                  mt: 0.5,
                }}
              >
                Update your job posting
                details.
              </Typography>
            </Box>
          </Stack>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {(formError || error) && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              {formError || error}
            </Alert>
          )}

          {/* =====================================================
              FORM CARD
          ===================================================== */}

          <Card
            sx={{
              bgcolor: colors.cardBg,
              color: colors.text,
              border:
                `1px solid ${colors.border}`,
              borderRadius: 3,

              transition:
                "background-color 0.3s ease, border-color 0.3s ease",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  md: 4,
                },
              }}
            >
              <form onSubmit={handleSubmit}>

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <SectionTitle
                  icon={<Work />}
                  title="Basic Information"
                  colors={colors}
                />

                <Grid
                  container
                  spacing={3}
                >

                  {/* JOB TITLE */}

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Job Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      sx={getInputStyle(
                        colors,
                        theme
                      )}
                    />
                  </Grid>

                  {/* COMPANY */}

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      sx={getInputStyle(
                        colors,
                        theme
                      )}
                    />
                  </Grid>

                  {/* LOCATION */}

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      sx={getInputStyle(
                        colors,
                        theme
                      )}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <LocationOn
                              sx={{
                                color:
                                  colors.secondaryText,
                                mr: 1,
                              }}
                            />
                          ),
                        },
                      }}
                    />
                  </Grid>

                  {/* JOB TYPE */}

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      select
                      label="Job Type"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      sx={getInputStyle(
                        colors,
                        theme
                      )}
                    >
                      <MenuItem value="Full-time">
                        Full-time
                      </MenuItem>

                      <MenuItem value="Part-time">
                        Part-time
                      </MenuItem>

                      <MenuItem value="Internship">
                        Internship
                      </MenuItem>

                      <MenuItem value="Contract">
                        Contract
                      </MenuItem>

                      <MenuItem value="Remote">
                        Remote
                      </MenuItem>
                    </TextField>
                  </Grid>

                  {/* EXPERIENCE */}

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Experience"
                      name="experience"
                      placeholder="e.g. 2-4 years"
                      value={formData.experience}
                      onChange={handleChange}
                      sx={getInputStyle(
                        colors,
                        theme
                      )}
                    />
                  </Grid>

                  {/* SALARY */}

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Salary"
                      name="salary"
                      placeholder="e.g. ₹6-10 LPA"
                      value={formData.salary}
                      onChange={handleChange}
                      sx={getInputStyle(
                        colors,
                        theme
                      )}
                    />
                  </Grid>
                </Grid>

                <Divider
                  sx={{
                    ...dividerStyle,
                    borderColor:
                      colors.border,
                  }}
                />

                {/* =================================================
                    JOB DESCRIPTION
                ================================================= */}

                <SectionTitle
                  icon={<Description />}
                  title="Job Description"
                  colors={colors}
                />

                <TextField
                  fullWidth
                  required
                  multiline
                  minRows={7}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  sx={getInputStyle(
                    colors,
                    theme
                  )}
                />

                {/* REQUIREMENTS */}

                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    label="Requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    sx={getInputStyle(
                      colors,
                      theme
                    )}
                  />
                </Box>

                <Divider
                  sx={{
                    ...dividerStyle,
                    borderColor:
                      colors.border,
                  }}
                />

                {/* =================================================
                    SKILLS
                ================================================= */}

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: colors.text,
                  }}
                >
                  Required Skills
                </Typography>

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                >
                  <TextField
                    fullWidth
                    label="Add Skill"
                    value={skillInput}
                    onChange={(event) =>
                      setSkillInput(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter"
                      ) {
                        event.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    sx={getInputStyle(
                      colors,
                      theme
                    )}
                  />

                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddSkill}
                    sx={{
                      minWidth: 130,
                      height: 56,
                      borderColor:
                        theme.palette.primary.main,
                      color: colors.buttonText,
                      textTransform:
                        "none",

                      "&:hover": {
                        borderColor:
                          theme.palette.primary.dark,
                        bgcolor:
                          theme.palette.action.hover,
                      },
                    }}
                  >
                    Add Skill
                  </Button>
                </Stack>

                {/* SKILLS */}

                {skills.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{
                      flexWrap: "wrap",
                      mt: 2,
                    }}
                  >
                    {skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onDelete={() =>
                          handleRemoveSkill(
                            skill
                          )
                        }
                        deleteIcon={
                          <Delete />
                        }
                        sx={{
                          bgcolor:
                            colors.chipBg,
                          color:
                            colors.buttonText,
                          border:
                            `1px solid ${theme.palette.primary.main}33`,

                          "& .MuiChip-deleteIcon":
                            {
                              color:
                                colors.secondaryText,

                              "&:hover": {
                                color:
                                  theme.palette.error.main,
                              },
                            },
                        }}
                      />
                    ))}
                  </Stack>
                )}

                {/* =================================================
                    STATUS + DEADLINE
                ================================================= */}

                <Grid
                  container
                  spacing={3}
                  sx={{ mt: 1 }}
                >

                  {/* STATUS */}

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      select
                      label="Job Status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      sx={getInputStyle(
                        colors,
                        theme
                      )}
                    >
                      <MenuItem value="draft">
                        Draft
                      </MenuItem>

                      <MenuItem value="published">
                        Published
                      </MenuItem>

                      <MenuItem value="closed">
                        Closed
                      </MenuItem>
                    </TextField>
                  </Grid>

                  {/* DEADLINE */}

                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <TextField
                      fullWidth
                      type="date"
                      label="Application Deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      sx={getInputStyle(
                        colors,
                        theme
                      )}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <Stack
                  direction={{
                    xs: "column-reverse",
                    sm: "row",
                  }}
                  spacing={2}
                  sx={{
                    justifyContent:
                      "flex-end",
                    mt: 5,
                  }}
                >

                  {/* CANCEL */}

                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        "/recruiter/jobs"
                      )
                    }
                    sx={{
                      minWidth: 120,
                      height: 44,
                      textTransform:
                        "none",

                      borderColor:
                        colors.border,

                      color:
                        colors.secondaryText,

                      "&:hover": {
                        borderColor:
                          theme.palette.primary.main,
                        bgcolor:
                          theme.palette.action.hover,
                      },
                    }}
                  >
                    Cancel
                  </Button>

                  {/* UPDATE */}

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={updating}
                    sx={{
                      minWidth: 150,
                      height: 44,
                      textTransform:
                        "none",
                      fontWeight: 600,

                      background:
                        "linear-gradient(135deg, #6366f1, #8b5cf6)",

                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      },

                      "&.Mui-disabled": {
                        color: "#fff",
                        background:
                          "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        opacity: 0.65,
                      },
                    }}
                  >
                    {updating
                      ? "Updating..."
                      : "Update Job"}
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

// =====================================================
// SECTION TITLE
// =====================================================

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
      {icon && (
        <Box
          sx={{
            color: colors.icon,
            display: "flex",
          }}
        >
          {icon}
        </Box>
      )}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: colors.text,
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
};

// =====================================================
// DIVIDER STYLE
// =====================================================

const dividerStyle = {
  my: 4,
};

// =====================================================
// INPUT STYLE
// =====================================================

const getInputStyle = (
  colors,
  theme
) => ({
  "& .MuiOutlinedInput-root": {
    color: colors.inputText,
    bgcolor: colors.inputBg,

    "& fieldset": {
      borderColor: colors.border,
    },

    "&:hover fieldset": {
      borderColor:
        theme.palette.primary.main,
    },

    "&.Mui-focused fieldset": {
      borderColor:
        theme.palette.primary.main,
    },

    "& input": {
      color: colors.inputText,
    },

    "& textarea": {
      color: colors.inputText,
    },

    "& .MuiSelect-select": {
      color: colors.inputText,
    },

    "& input::placeholder": {
      color: colors.placeholder,
      opacity: 1,
    },

    "& textarea::placeholder": {
      color: colors.placeholder,
      opacity: 1,
    },
  },

  "& .MuiInputLabel-root": {
    color: colors.secondaryText,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.primary.main,
  },

  // Date input icon
  "& input[type='date']::-webkit-calendar-picker-indicator":
    {
      filter:
        theme.palette.mode === "dark"
          ? "invert(1)"
          : "none",
      cursor: "pointer",
    },

  // Select dropdown icon
  "& .MuiSelect-icon": {
    color: colors.secondaryText,
  },
});

export default EditJob;