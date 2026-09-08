import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  Business,
  Description,
} from "@mui/icons-material";

import RNavbar from "../../../components/layout/recruiter/Navbar";
import RSidebar from "../../../components/layout/recruiter/Sidebar";
import useJob from "../../../hooks/useJob";

const CreateJob = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { addJob, loading, error } = useJob();

  // ==========================================
  // FORM STATE - MATCHES JOB SCHEMA
  // ==========================================

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

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  // ==========================================
  // ADD SKILL
  // ==========================================

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

  // ==========================================
  // REMOVE SKILL
  // ==========================================

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((previous) =>
      previous.filter(
        (skill) => skill !== skillToRemove
      )
    );
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    // VALIDATION

    if (!formData.title.trim()) {
      setFormError(
        "Job title is required."
      );
      return;
    }

    if (!formData.description.trim()) {
      setFormError(
        "Job description is required."
      );
      return;
    }

    // DATA MATCHING BACKEND SCHEMA

    const jobData = {
      title: formData.title.trim(),

      company: formData.company.trim(),

      location: formData.location.trim(),

      jobType: formData.jobType,

      experience:
        formData.experience.trim(),

      salary: formData.salary.trim(),

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
      "CREATE JOB DATA:",
      jobData
    );

    // CREATE JOB

    try {
      await addJob(jobData);

      navigate("/recruiter/jobs");
    } catch (err) {
      console.error(
        "Create job error:",
        err
      );

      setFormError(
        err.response?.data?.message ||
          "Failed to create job."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <RNavbar />

      <Box sx={{ display: "flex", minWidth: 0 }}>
        <RSidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              minHeight: "calc(100vh - 72px)",
          bgcolor:
            theme.palette.background.default,
          color:
            theme.palette.text.primary,
          py: {
            xs: 3,
            md: 5,
          },
        }}
      >
        <Container maxWidth="lg">

          {/* HEADER */}

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
                navigate(
                  "/recruiter/jobs"
                )
              }
              sx={{
                color:
                  theme.palette.text.secondary,
                bgcolor:
                  theme.palette.background.paper,
                border:
                  `1px solid ${theme.palette.divider}`,

                "&:hover": {
                  bgcolor:
                    theme.palette.background.surface,
                  borderColor:
                    theme.palette.primary.main,
                },
              }}
            >
              <ArrowBack />
            </IconButton>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color:
                    theme.palette.text.primary,
                }}
              >
                Create Job
              </Typography>

              <Typography
                sx={{
                  color:
                    theme.palette.text.secondary,
                  mt: 0.5,
                }}
              >
                Create a new job posting for
                candidates.
              </Typography>
            </Box>
          </Stack>

          {/* ERROR */}

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

          {/* FORM CARD */}

          <Card
            sx={{
              bgcolor:
                theme.palette.background.paper,
              color:
                theme.palette.text.primary,
              border:
                `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
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
              <form
                onSubmit={handleSubmit}
              >

                {/* BASIC INFORMATION */}

                <SectionTitle
                  icon={<Work />}
                  title="Basic Information"
                  theme={theme}
                />

                <Grid
                  container
                  spacing={3}
                >

                  {/* TITLE */}

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
                      value={
                        formData.title
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Frontend Developer"
                      sx={inputStyle(
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
                      value={
                        formData.company
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Talvyn Technologies"
                      sx={inputStyle(
                        theme
                      )}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <Business
                              sx={{
                                color:
                                  theme
                                    .palette
                                    .text
                                    .secondary,
                                mr: 1,
                              }}
                            />
                          ),
                        },
                      }}
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
                      value={
                        formData.location
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Noida / Remote"
                      sx={inputStyle(
                        theme
                      )}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <LocationOn
                              sx={{
                                color:
                                  theme
                                    .palette
                                    .text
                                    .secondary,
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
                      value={
                        formData.jobType
                      }
                      onChange={
                        handleChange
                      }
                      sx={inputStyle(
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
                      value={
                        formData.experience
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. 0-2 years"
                      sx={inputStyle(
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
                      value={
                        formData.salary
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. ₹5-8 LPA"
                      sx={inputStyle(
                        theme
                      )}
                    />
                  </Grid>

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
                      value={
                        formData.status
                      }
                      onChange={
                        handleChange
                      }
                      sx={inputStyle(
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
                      value={
                        formData.deadline
                      }
                      onChange={
                        handleChange
                      }
                      sx={inputStyle(
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

                <Divider
                  sx={{
                    my: 4,
                    borderColor:
                      theme.palette.divider,
                  }}
                />

                {/* DESCRIPTION */}

                <SectionTitle
                  icon={<Description />}
                  title="Job Description"
                  theme={theme}
                />

                <TextField
                  fullWidth
                  required
                  multiline
                  minRows={6}
                  label="Description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe the role, responsibilities and expectations..."
                  sx={inputStyle(theme)}
                />

                {/* REQUIREMENTS */}

                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    label="Requirements"
                    name="requirements"
                    value={
                      formData.requirements
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Mention required qualifications, experience, education, etc."
                    sx={inputStyle(
                      theme
                    )}
                  />
                </Box>

                <Divider
                  sx={{
                    my: 4,
                    borderColor:
                      theme.palette.divider,
                  }}
                />

                {/* SKILLS */}

                <SectionTitle
                  icon={<Work />}
                  title="Required Skills"
                  theme={theme}
                />

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
                        event.key ===
                        "Enter"
                      ) {
                        event.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="e.g. React"
                    sx={inputStyle(
                      theme
                    )}
                  />

                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={
                      handleAddSkill
                    }
                    sx={{
                      minWidth: 130,
                      borderColor:
                        theme.palette.primary.main,
                      color:
                        theme.palette.primary.main,
                      textTransform:
                        "none",

                      "&:hover": {
                        borderColor:
                          theme.palette.secondary.main,
                      },
                    }}
                  >
                    Add Skill
                  </Button>
                </Stack>

                {/* SKILL CHIPS */}

                {skills.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{
                      mt: 2,
                    }}
                  >
                    {skills.map(
                      (skill) => (
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
                              theme.palette.mode ===
                              "dark"
                                ? "rgba(59,130,246,0.15)"
                                : "rgba(59,130,246,0.10)",
                            color:
                              theme.palette.primary.main,
                          }}
                        />
                      )
                    )}
                  </Stack>
                )}

                {/* ACTIONS */}

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
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        "/recruiter/jobs"
                      )
                    }
                    sx={{
                      textTransform:
                        "none",
                      borderColor:
                        theme.palette.divider,
                      color:
                        theme.palette.text.secondary,
                      px: 3,

                      "&:hover": {
                        borderColor:
                          theme.palette.text.secondary,
                      },
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      textTransform:
                        "none",
                      px: 4,
                      background:
                        "linear-gradient(135deg, #3b82f6, #9333ea)",

                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #2563eb, #7e22ce)",
                      },
                    }}
                  >
                    {loading
                      ? "Creating..."
                      : "Create Job"}
                  </Button>
                </Stack>

              </form>
            </CardContent>
          </Card>
          </Container>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ==========================================
// SECTION TITLE
// ==========================================

const SectionTitle = ({
  icon,
  title,
  theme,
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
          color:
            theme.palette.primary.main,
          display: "flex",
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color:
            theme.palette.text.primary,
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
};

// ==========================================
// INPUT STYLE
// ==========================================

const inputStyle = (theme) => ({
  "& .MuiOutlinedInput-root": {
    color:
      theme.palette.text.primary,
    bgcolor:
      theme.palette.background.surface,

    "& fieldset": {
      borderColor:
        theme.palette.divider,
    },

    "&:hover fieldset": {
      borderColor:
        theme.palette.primary.main,
    },

    "&.Mui-focused fieldset": {
      borderColor:
        theme.palette.secondary.main,
    },
  },

  "& .MuiInputLabel-root": {
    color:
      theme.palette.text.secondary,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color:
      theme.palette.primary.main,
  },

  "& .MuiInputBase-input": {
    color:
      theme.palette.text.primary,
  },

  "& textarea": {
    color:
      theme.palette.text.primary,
  },

  "& .MuiSelect-select": {
    color:
      theme.palette.text.primary,
  },
});

export default CreateJob;