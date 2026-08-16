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
  Stack,
  TextField,
  Typography,
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

import useJob from "../../../hooks/useJob";

const CreateJob = () => {
  const navigate = useNavigate();

  const { addJob, loading, error } = useJob();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    experience: "",
    salary: "",
    description: "",
    requirements: "",
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
  };

  // ==========================================
  // ADD SKILL
  // ==========================================

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (skills.includes(skill)) {
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

    if (!formData.title.trim()) {
      setFormError("Job title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setFormError("Job description is required.");
      return;
    }

    try {
      const jobData = {
        ...formData,
        skills,
      };

      await addJob(jobData);

      navigate("/recruiter/jobs");
    } catch (err) {
      console.error("Create job error:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        bgcolor: "#111827",
        color: "#fff",
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Container maxWidth="lg">

        {/* ======================================
            HEADER
        ======================================= */}

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
              color: "#d1d5db",
              bgcolor: "#1f2937",
              "&:hover": {
                bgcolor: "#374151",
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
                color: "#fff",
              }}
            >
              Create Job
            </Typography>

            <Typography
              sx={{
                color: "#9ca3af",
                mt: 0.5,
              }}
            >
              Create a new job posting for candidates.
            </Typography>
          </Box>
        </Stack>

        {/* ======================================
            ERROR
        ======================================= */}

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

        {/* ======================================
            FORM
        ======================================= */}

        <Card
          sx={{
            bgcolor: "#1f2937",
            color: "#fff",
            border:
              "1px solid #374151",
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
            <form onSubmit={handleSubmit}>

              {/* BASIC INFORMATION */}

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Work
                  sx={{
                    color: "#818cf8",
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Basic Information
                </Typography>
              </Stack>

              <Grid
                container
                spacing={3}
              >
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
                    placeholder="e.g. Frontend Developer"
                    sx={inputStyle}
                  />
                </Grid>

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
                    placeholder="e.g. Talvyn Technologies"
                    sx={inputStyle}
                  />
                </Grid>

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
                    placeholder="e.g. Noida / Remote"
                    sx={inputStyle}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <LocationOn
                            sx={{
                              color: "#9ca3af",
                              mr: 1,
                            }}
                          />
                        ),
                      },
                    }}
                  />
                </Grid>

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
                    sx={inputStyle}
                    slotProps={{
                      select: {
                        native: true,
                      },
                    }}
                  >
                    <option value="Full-time">
                      Full-time
                    </option>

                    <option value="Part-time">
                      Part-time
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Contract">
                      Contract
                    </option>

                    <option value="Remote">
                      Remote
                    </option>
                  </TextField>
                </Grid>

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
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 0-2 years"
                    sx={inputStyle}
                  />
                </Grid>

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
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. ₹5-8 LPA"
                    sx={inputStyle}
                  />
                </Grid>
              </Grid>

              <Divider
                sx={{
                  my: 4,
                  borderColor: "#374151",
                }}
              />

              {/* DESCRIPTION */}

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Description
                  sx={{
                    color: "#818cf8",
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Job Description
                </Typography>
              </Stack>

              <TextField
                fullWidth
                required
                multiline
                minRows={6}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities and expectations..."
                sx={inputStyle}
              />

              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  label="Requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Mention required qualifications, experience, education, etc."
                  sx={inputStyle}
                />
              </Box>

              <Divider
                sx={{
                  my: 4,
                  borderColor: "#374151",
                }}
              />

              {/* SKILLS */}

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
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
                  placeholder="e.g. React"
                  sx={inputStyle}
                />

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddSkill}
                  sx={{
                    minWidth: 130,
                    borderColor: "#6366f1",
                    color: "#a5b4fc",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#818cf8",
                    },
                  }}
                >
                  Add Skill
                </Button>
              </Stack>

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
                          "rgba(99,102,241,0.15)",
                        color: "#a5b4fc",
                      }}
                    />
                  ))}
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
                  variant="outlined"
                  onClick={() =>
                    navigate(
                      "/recruiter/jobs"
                    )
                  }
                  sx={{
                    textTransform: "none",
                    borderColor: "#4b5563",
                    color: "#d1d5db",
                    px: 3,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    textTransform: "none",
                    px: 4,
                    background:
                      "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4f46e5, #7c3aed)",
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
  );
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    bgcolor: "#111827",

    "& fieldset": {
      borderColor: "#374151",
    },

    "&:hover fieldset": {
      borderColor: "#6366f1",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#8b5cf6",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#9ca3af",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#a5b4fc",
  },

  "& .MuiInputBase-input": {
    color: "#fff",
  },

  "& textarea": {
    color: "#fff",
  },

  "& .MuiSelect-select": {
    color: "#fff",
  },
};

export default CreateJob;