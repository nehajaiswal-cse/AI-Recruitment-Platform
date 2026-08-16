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

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    currentJob,
    loading,
    error,
    fetchJobById,
    editJob,
  } = useJob();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    employmentType: "full-time",

    experienceMin: "",
    experienceMax: "",

    salaryMin: "",
    salaryMax: "",
    currency: "INR",

    education: "",
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

      description:
        currentJob.description ?? "",

      location:
        currentJob.location ?? "",

      employmentType:
        currentJob.employmentType ??
        "full-time",

      experienceMin:
        currentJob.experience?.min ??
        "",

      experienceMax:
        currentJob.experience?.max ??
        "",

      salaryMin:
        currentJob.salary?.min ??
        "",

      salaryMax:
        currentJob.salary?.max ??
        "",

      currency:
        currentJob.salary?.currency ??
        "INR",

      education:
        currentJob.education ?? "",

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
  // HANDLE INPUT CHANGE
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

    // -----------------------------
    // VALIDATION
    // -----------------------------

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

    if (!formData.experienceMin) {
      setFormError(
        "Minimum experience is required."
      );
      return;
    }

    if (
      formData.experienceMax !== "" &&
      Number(formData.experienceMax) <
        Number(formData.experienceMin)
    ) {
      setFormError(
        "Maximum experience cannot be less than minimum experience."
      );
      return;
    }

    if (
      formData.salaryMin !== "" &&
      formData.salaryMax !== "" &&
      Number(formData.salaryMax) <
        Number(formData.salaryMin)
    ) {
      setFormError(
        "Maximum salary cannot be less than minimum salary."
      );
      return;
    }

    // =================================================
    // DATA MATCHING BACKEND SCHEMA
    // =================================================

    const jobData = {
      title: formData.title.trim(),

      description:
        formData.description.trim(),

      skills,

      experience: {
        min: Number(
          formData.experienceMin
        ),

        ...(formData.experienceMax !== ""
          ? {
              max: Number(
                formData.experienceMax
              ),
            }
          : {}),
      },

      education:
        formData.education.trim(),

      location:
        formData.location.trim(),

      employmentType:
        formData.employmentType,

      salary: {
        ...(formData.salaryMin !== ""
          ? {
              min: Number(
                formData.salaryMin
              ),
            }
          : {}),

        ...(formData.salaryMax !== ""
          ? {
              max: Number(
                formData.salaryMax
              ),
            }
          : {}),

        currency:
          formData.currency || "INR",
      },

      ...(formData.deadline
        ? {
            deadline:
              formData.deadline,
          }
        : {}),
    };

    console.log(
      "UPDATE JOB DATA:",
      jobData
    );

    // =================================================
    // UPDATE
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
          minHeight:
            "calc(100vh - 70px)",
          bgcolor: "#111827",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          size={42}
          sx={{
            color: "#8b5cf6",
          }}
        />
      </Box>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        minHeight:
          "calc(100vh - 70px)",
        bgcolor: "#111827",
        color: "#fff",
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Container maxWidth="lg">

        {/* =========================================
            HEADER
        ========================================= */}

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
              Edit Job
            </Typography>

            <Typography
              sx={{
                color: "#9ca3af",
                mt: 0.5,
              }}
            >
              Update your job posting
              details.
            </Typography>
          </Box>
        </Stack>

        {/* =========================================
            ERROR
        ========================================= */}

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

        {/* =========================================
            FORM CARD
        ========================================= */}

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
            <form
              onSubmit={handleSubmit}
            >

              {/* ===================================
                  BASIC INFORMATION
              =================================== */}

              <SectionTitle
                icon={<Work />}
                title="Basic Information"
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
                    sx={inputStyle}
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
                    sx={inputStyle}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <LocationOn
                            sx={{
                              color:
                                "#9ca3af",
                              mr: 1,
                            }}
                          />
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* EMPLOYMENT TYPE */}

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <TextField
                    fullWidth
                    select
                    label="Employment Type"
                    name="employmentType"
                    value={
                      formData.employmentType
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                  >
                    <MenuItem value="full-time">
                      Full-time
                    </MenuItem>

                    <MenuItem value="part-time">
                      Part-time
                    </MenuItem>

                    <MenuItem value="internship">
                      Internship
                    </MenuItem>

                    <MenuItem value="contract">
                      Contract
                    </MenuItem>
                  </TextField>
                </Grid>

                {/* EDUCATION */}

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Education"
                    name="education"
                    value={
                      formData.education
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                  />
                </Grid>

                {/* EXPERIENCE MIN */}

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Experience (years)"
                    name="experienceMin"
                    value={
                      formData.experienceMin
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                      },
                    }}
                  />
                </Grid>

                {/* EXPERIENCE MAX */}

                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Experience (years)"
                    name="experienceMax"
                    value={
                      formData.experienceMax
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                      },
                    }}
                  />
                </Grid>

              </Grid>

              <Divider
                sx={{
                  my: 4,
                  borderColor:
                    "#374151",
                }}
              />

              {/* ===================================
                  SALARY
              =================================== */}

              <SectionTitle
                title="Salary"
              />

              <Grid
                container
                spacing={3}
              >

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Salary"
                    name="salaryMin"
                    value={
                      formData.salaryMin
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                      },
                    }}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Salary"
                    name="salaryMax"
                    value={
                      formData.salaryMax
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                      },
                    }}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <TextField
                    fullWidth
                    select
                    label="Currency"
                    name="currency"
                    value={
                      formData.currency
                    }
                    onChange={
                      handleChange
                    }
                    sx={inputStyle}
                  >
                    <MenuItem value="INR">
                      INR
                    </MenuItem>

                    <MenuItem value="USD">
                      USD
                    </MenuItem>

                    <MenuItem value="EUR">
                      EUR
                    </MenuItem>
                  </TextField>
                </Grid>

              </Grid>

              <Divider
                sx={{
                  my: 4,
                  borderColor:
                    "#374151",
                }}
              />

              {/* ===================================
                  JOB DESCRIPTION
              =================================== */}

              <SectionTitle
                icon={<Description />}
                title="Job Description"
              />

              <TextField
                fullWidth
                required
                multiline
                minRows={7}
                label="Description"
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                sx={inputStyle}
              />

              <Divider
                sx={{
                  my: 4,
                  borderColor:
                    "#374151",
                }}
              />

              {/* ===================================
                  SKILLS
              =================================== */}

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
                  value={
                    skillInput
                  }
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
                  sx={inputStyle}
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
                      "#6366f1",
                    color: "#a5b4fc",
                    textTransform:
                      "none",

                    "&:hover": {
                      borderColor:
                        "#8b5cf6",
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
                            "rgba(99,102,241,0.15)",
                          color:
                            "#a5b4fc",
                        }}
                      />
                    )
                  )}
                </Stack>
              )}

              {/* ===================================
                  DEADLINE
              =================================== */}

              <Box sx={{ mt: 3 }}>
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
                  sx={inputStyle}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Box>

              {/* ===================================
                  ACTIONS
              =================================== */}

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
                    minWidth: 120,
                    height: 44,
                    textTransform:
                      "none",
                    borderColor:
                      "#4b5563",
                    color:
                      "#d1d5db",
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    updating ||
                    loading
                  }
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
  );
};

// =====================================================
// SECTION TITLE
// =====================================================

const SectionTitle = ({
  icon,
  title,
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
            color: "#818cf8",
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
          color: "#fff",
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
};

// =====================================================
// INPUT STYLE
// =====================================================

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

export default EditJob;