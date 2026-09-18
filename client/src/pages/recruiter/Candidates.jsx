import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import RNavbar from "../../components/layout/recruiter/Navbar";
import RSidebar from "../../components/layout/recruiter/Sidebar";
import CandidateCopilot from "../../components/copilot/CandidateCopilto";

import { useCandidate } from "../../hooks/useCandidate";
import { getResumeUrl } from "../../api/resumeApi";


export default function Candidates() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const jobId = searchParams.get("jobId");

  const {
    candidates,
    fetchCandidates,
    analyzeResume,
    changeCandidateStatus,
    removeCandidate,
  } = useCandidate();


  /* -------------------------------------------------------
   * STATE
   * ------------------------------------------------------- */

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [jobFilter, setJobFilter] = useState("all");

  const [scoreFilter, setScoreFilter] = useState("all");

  const [skillFilter, setSkillFilter] = useState("all");

  const [experienceFilter, setExperienceFilter] =
    useState("all");

  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  const [analyzingId, setAnalyzingId] = useState(null);

  const [actionMenuAnchor, setActionMenuAnchor] =
    useState(null);


  /* -------------------------------------------------------
   * FETCH CANDIDATES
   * ------------------------------------------------------- */

  useEffect(() => {
    fetchCandidates();
  }, []);


  /* -------------------------------------------------------
   * FILTER CANDIDATES
   * ------------------------------------------------------- */

  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];

    return candidates.filter((candidate) => {
      const applicant = candidate?.applicantId;
      const job = candidate?.jobId;

      /* ---------------------------------------------------
       * JOB FROM URL
       * --------------------------------------------------- */

      if (jobId && job?._id !== jobId) {
        return false;
      }


      /* ---------------------------------------------------
       * BASIC DATA
       * --------------------------------------------------- */

      const name =
        applicant?.name ||
        applicant?.fullName ||
        "";

      const email = applicant?.email || "";

      const jobTitle = job?.title || "";

      const searchText = search.toLowerCase();


      /* ---------------------------------------------------
       * SEARCH
       * --------------------------------------------------- */

      const matchesSearch =
        name.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        jobTitle.toLowerCase().includes(searchText);


      /* ---------------------------------------------------
       * STATUS
       * --------------------------------------------------- */

      const matchesStatus =
        statusFilter === "all" ||
        candidate?.status?.toLowerCase() ===
          statusFilter.toLowerCase();


      /* ---------------------------------------------------
       * JOB FILTER
       * --------------------------------------------------- */

      const matchesJob =
        jobFilter === "all" ||
        job?._id === jobFilter;


      /* ---------------------------------------------------
       * SCORE FILTER
       * --------------------------------------------------- */

      const score = Number(
        candidate?.aiScore || 0
      );

      let matchesScore = true;

      if (scoreFilter === "90") {
        matchesScore = score >= 90;
      }

      if (scoreFilter === "80") {
        matchesScore = score >= 80;
      }

      if (scoreFilter === "70") {
        matchesScore = score >= 70;
      }


      /* ---------------------------------------------------
       * EXPERIENCE FILTER
       * --------------------------------------------------- */

      const experience =
        Number(
          applicant?.experience ??
            candidate?.aiAnalysis?.experienceYears ??
            candidate?.aiAnalysis?.experience ??
            0
        ) || 0;

      let matchesExperience = true;

      if (experienceFilter === "0-2") {
        matchesExperience = experience <= 2;
      }

      if (experienceFilter === "2-5") {
        matchesExperience =
          experience > 2 && experience <= 5;
      }

      if (experienceFilter === "5+") {
        matchesExperience = experience > 5;
      }


      /* ---------------------------------------------------
       * SKILLS FILTER
       * --------------------------------------------------- */

      let matchesSkill = true;

      if (skillFilter !== "all") {
        const skills = [
          ...(Array.isArray(applicant?.skills)
            ? applicant.skills
            : []),

          ...(Array.isArray(candidate?.skills)
            ? candidate.skills
            : []),

          ...(Array.isArray(
            candidate?.aiAnalysis?.skills
          )
            ? candidate.aiAnalysis.skills
            : []),

          ...(Array.isArray(
            candidate?.aiAnalysis?.matchingSkills
          )
            ? candidate.aiAnalysis.matchingSkills
            : []),
        ].map((skill) =>
          String(skill).toLowerCase()
        );

        matchesSkill = skills.some((skill) =>
          skill.includes(
            skillFilter.toLowerCase()
          )
        );
      }


      /* ---------------------------------------------------
       * FINAL RESULT
       * --------------------------------------------------- */

      return (
        matchesSearch &&
        matchesStatus &&
        matchesJob &&
        matchesScore &&
        matchesSkill &&
        matchesExperience
      );
    });
  }, [
    candidates,
    search,
    statusFilter,
    jobFilter,
    scoreFilter,
    skillFilter,
    experienceFilter,
    jobId,
  ]);


  /* -------------------------------------------------------
   * UNIQUE JOBS
   * ------------------------------------------------------- */

  const jobs = useMemo(() => {
    if (!candidates) return [];

    const map = new Map();

    candidates.forEach((candidate) => {
      const job = candidate?.jobId;

      if (job?._id && !map.has(job._id)) {
        map.set(job._id, job);
      }
    });

    return Array.from(map.values());
  }, [candidates]);


  /* -------------------------------------------------------
   * DEFAULT SELECTED CANDIDATE
   * ------------------------------------------------------- */

  useEffect(() => {
    if (
      filteredCandidates.length > 0 &&
      !selectedCandidate
    ) {
      setSelectedCandidate(
        filteredCandidates[0]
      );
    }
  }, [
    filteredCandidates,
    selectedCandidate,
  ]);


  /* -------------------------------------------------------
   * AI ANALYSIS
   * ------------------------------------------------------- */

  const handleAIAnalysis = async (candidate) => {
    try {
      if (!candidate?.applicationId) {
        console.error("Application ID missing");
        return;
      }

      const applicationId =
        typeof candidate.applicationId === "object"
          ? candidate.applicationId._id
          : candidate.applicationId;

      if (!applicationId) {
        console.error(
          "Application ID not found"
        );
        return;
      }

      setAnalyzingId(candidate._id);

      await analyzeResume(applicationId);

      await fetchCandidates();
    } catch (err) {
      console.error(
        "AI ANALYSIS ERROR:",
        err.response?.data || err.message
      );
    } finally {
      setAnalyzingId(null);
    }
  };


  /* -------------------------------------------------------
   * STATUS CHANGE
   * ------------------------------------------------------- */

  const handleStatusChange = async (
    candidate,
    status
  ) => {
    try {
      if (!candidate?._id) {
        alert("Candidate not found");
        return;
      }

      await changeCandidateStatus(
        candidate._id,
        status
      );

      setSelectedCandidate((prev) =>
        prev
          ? {
              ...prev,
              status,
            }
          : prev
      );

      await fetchCandidates();
    } catch (err) {
      console.error(
        "STATUS UPDATE ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          err.message ||
          "Unable to update candidate status"
      );
    }
  };


  /* -------------------------------------------------------
   * REMOVE CANDIDATE
   * ------------------------------------------------------- */

  const handleRemoveCandidate = async () => {
    handleActionMenuClose();

    if (!selectedCandidate?._id) {
      return;
    }

    const candidateName =
      selectedCandidate?.applicantId?.name ||
      selectedCandidate?.applicantId?.fullName ||
      "this candidate";

    const confirmed = window.confirm(
      `Are you sure you want to remove ${candidateName} from the candidate list?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeCandidate(
        selectedCandidate._id
      );

      setSelectedCandidate(null);

      await fetchCandidates();
    } catch (err) {
      console.error(
        "REMOVE CANDIDATE ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          err.message ||
          "Unable to remove candidate"
      );
    }
  };


  /* -------------------------------------------------------
   * MENU
   * ------------------------------------------------------- */

  const handleActionMenuOpen = (event) => {
    setActionMenuAnchor(
      event.currentTarget
    );
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
  };


  /* -------------------------------------------------------
   * REJECT
   * ------------------------------------------------------- */

  const handleReject = async () => {
    handleActionMenuClose();

    if (!selectedCandidate) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this candidate?"
    );

    if (!confirmed) {
      return;
    }

    await handleStatusChange(
      selectedCandidate,
      "rejected"
    );
  };


  /* -------------------------------------------------------
   * SCHEDULE INTERVIEW
   * ------------------------------------------------------- */

  const handleScheduleInterview = (
    candidate
  ) => {
    navigate(
      "/recruiter/interviews",
      {
        state: {
          candidate,
        },
      }
    );
  };


  /* -------------------------------------------------------
   * VIEW RESUME
   * ------------------------------------------------------- */

  const handleViewResume = async (
    candidate
  ) => {
    try {
      const applicationId =
        typeof candidate?.applicationId ===
        "object"
          ? candidate.applicationId._id
          : candidate?.applicationId;

      if (!applicationId) {
        alert("Application not found");
        return;
      }

      const data =
        await getResumeUrl(applicationId);

      if (!data?.url) {
        alert(
          "Resume URL could not be generated"
        );
        return;
      }

      window.open(
        data.url,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error(
        "VIEW RESUME ERROR:",
        err
      );

      alert(
        err.message ||
          "Unable to open resume"
      );
    }
  };


  /* -------------------------------------------------------
   * SCORE HELPERS
   * ------------------------------------------------------- */

  const getScoreColor = (score) => {
    if (score >= 80) return "#70d84a";

    if (score >= 60) return "#f4c542";

    return "#ff5d7d";
  };


  const getScoreLabel = (score) => {
    if (score >= 90) {
      return "Excellent Match";
    }

    if (score >= 80) {
      return "Strong Match";
    }

    if (score >= 70) {
      return "Good Match";
    }

    if (score >= 60) {
      return "Moderate Match";
    }

    return "Low Match";
  };


  /* -------------------------------------------------------
   * SELECTED CANDIDATE DATA
   * ------------------------------------------------------- */

  const selectedApplicant =
    selectedCandidate?.applicantId;

  const selectedJob =
    selectedCandidate?.jobId;

  const selectedAnalysis =
    selectedCandidate?.aiAnalysis || {};

  const selectedScore = Number(
    selectedCandidate?.aiScore || 0
  );


  /* -------------------------------------------------------
   * EXPERIENCE
   * ------------------------------------------------------- */

  const getExperience = (candidate) => {
    const applicant =
      candidate?.applicantId;

    return (
      applicant?.experience ||
      candidate?.aiAnalysis
        ?.experienceYears ||
      candidate?.aiAnalysis
        ?.experience ||
      "N/A"
    );
  };


  /* -------------------------------------------------------
   * UI
   * ------------------------------------------------------- */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#020817",
        color: "#fff",
      }}
    >
      <RNavbar />

      <Box
        sx={{
          display: "flex",
        }}
      >
        <RSidebar />

        <Box
          sx={{
            flex: 1,
            p: 3,
            minWidth: 0,
          }}
        >

          {/* HEADER */}

          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            mb={3}
          >
            <IconButton
              onClick={() =>
                navigate(-1)
              }
              sx={{
                color: "#fff",
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
              >
                Candidates
              </Typography>

              <Typography
                sx={{
                  color: "#94a3b8",
                }}
              >
                Manage and evaluate
                candidates
              </Typography>
            </Box>
          </Stack>


          {/* FILTERS */}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              mb: 3,
            }}
          >

            {/* SEARCH */}

            <TextField
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search candidates..."
              size="small"
              InputProps={{
                startAdornment: (
                  <SearchIcon
                    sx={{
                      mr: 1,
                      color: "#94a3b8",
                    }}
                  />
                ),
              }}
              sx={{
                minWidth: 260,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  background:
                    "#0f172a",
                },
              }}
            />


            {/* STATUS */}

            <FormControl
              size="small"
              sx={{
                minWidth: 150,
              }}
            >
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                sx={{
                  color: "#fff",
                  background:
                    "#0f172a",
                }}
              >
                <MenuItem value="all">
                  Status
                </MenuItem>

                <MenuItem value="applied">
                  Applied
                </MenuItem>

                <MenuItem value="shortlisted">
                  Shortlisted
                </MenuItem>

                <MenuItem value="rejected">
                  Rejected
                </MenuItem>

                <MenuItem value="hired">
                  Hired
                </MenuItem>
              </Select>
            </FormControl>


            {/* JOB */}

            <FormControl
              size="small"
              sx={{
                minWidth: 180,
              }}
            >
              <Select
                value={jobFilter}
                onChange={(e) =>
                  setJobFilter(
                    e.target.value
                  )
                }
                sx={{
                  color: "#fff",
                  background:
                    "#0f172a",
                }}
              >
                <MenuItem value="all">
                  All Jobs
                </MenuItem>

                {jobs.map((job) => (
                  <MenuItem
                    key={job._id}
                    value={job._id}
                  >
                    {job.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


            {/* SCORE */}

            <FormControl
              size="small"
              sx={{
                minWidth: 150,
              }}
            >
              <Select
                value={scoreFilter}
                onChange={(e) =>
                  setScoreFilter(
                    e.target.value
                  )
                }
                sx={{
                  color: "#fff",
                  background:
                    "#0f172a",
                }}
              >
                <MenuItem value="all">
                  Match Score
                </MenuItem>

                <MenuItem value="90">
                  90 - 100
                </MenuItem>

                <MenuItem value="80">
                  80 - 100
                </MenuItem>

                <MenuItem value="70">
                  70 - 100
                </MenuItem>
              </Select>
            </FormControl>


            {/* SKILLS */}

            <FormControl
              size="small"
              sx={{
                minWidth: 150,
              }}
            >
              <Select
                value={skillFilter}
                onChange={(e) =>
                  setSkillFilter(
                    e.target.value
                  )
                }
                sx={{
                  color: "#fff",
                  background:
                    "#0f172a",
                }}
              >
                <MenuItem value="all">
                  Skills
                </MenuItem>

                <MenuItem value="react">
                  React
                </MenuItem>

                <MenuItem value="node">
                  Node.js
                </MenuItem>

                <MenuItem value="mongodb">
                  MongoDB
                </MenuItem>
              </Select>
            </FormControl>


            {/* EXPERIENCE */}

            <FormControl
              size="small"
              sx={{
                minWidth: 160,
              }}
            >
              <Select
                value={
                  experienceFilter
                }
                onChange={(e) =>
                  setExperienceFilter(
                    e.target.value
                  )
                }
                sx={{
                  color: "#fff",
                  background:
                    "#0f172a",
                }}
              >
                <MenuItem value="all">
                  Experience
                </MenuItem>

                <MenuItem value="0-2">
                  0 - 2 years
                </MenuItem>

                <MenuItem value="2-5">
                  2 - 5 years
                </MenuItem>

                <MenuItem value="5+">
                  5+ years
                </MenuItem>
              </Select>
            </FormControl>

          </Box>


          {/* MAIN CONTENT */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "minmax(350px, 0.9fr) minmax(400px, 1.1fr)",
              gap: 2,
            }}
          >

            {/* CANDIDATE LIST */}

            <Box
              sx={{
                background:
                  "#0f172a",
                border:
                  "1px solid #1e293b",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >

              <Box sx={{ p: 2 }}>
                <Typography
                  fontWeight={700}
                >
                  Candidates (
                  {
                    filteredCandidates.length
                  }
                  )
                </Typography>
              </Box>

              <Divider
                sx={{
                  borderColor:
                    "#1e293b",
                }}
              />


              {filteredCandidates.length ===
              0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign:
                      "center",
                  }}
                >
                  <Typography
                    color="#94a3b8"
                  >
                    No candidates found
                  </Typography>
                </Box>
              ) : (
                filteredCandidates.map(
                  (candidate) => {
                    const applicant =
                      candidate?.applicantId;

                    const score =
                      Number(
                        candidate?.aiScore ||
                          0
                      );

                    const isSelected =
                      selectedCandidate?._id ===
                      candidate?._id;

                    return (
                      <Box
                        key={
                          candidate._id
                        }
                        onClick={() =>
                          setSelectedCandidate(
                            candidate
                          )
                        }
                        sx={{
                          p: 2,
                          cursor: "pointer",
                          borderTop:
                            "1px solid #1e293b",
                          background:
                            isSelected
                              ? "#172033"
                              : "transparent",
                          "&:hover": {
                            background:
                              "#172033",
                          },
                        }}
                      >

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >

                          <Box>
                            <Typography
                              fontWeight={700}
                            >
                              {applicant?.name ||
                                applicant?.fullName ||
                                "Unknown Candidate"}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  "#94a3b8",
                                mt: 0.5,
                              }}
                            >
                              {applicant?.email ||
                                "No email"}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  "#64748b",
                                mt: 0.5,
                              }}
                            >
                              {candidate?.jobId
                                ?.title ||
                                "No job"}
                            </Typography>
                          </Box>


                          <Chip
                            label={`${score}%`}
                            size="small"
                            sx={{
                              color:
                                getScoreColor(
                                  score
                                ),
                              border: `1px solid ${getScoreColor(
                                score
                              )}`,
                              background:
                                "transparent",
                            }}
                          />

                        </Stack>


                        <Stack
                          direction="row"
                          spacing={1}
                          mt={1}
                        >
                          <Chip
                            label={
                              candidate?.status ||
                              "Applied"
                            }
                            size="small"
                            sx={{
                              background:
                                "#1e293b",
                              color:
                                "#cbd5e1",
                            }}
                          />

                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                "#64748b",
                              alignSelf:
                                "center",
                            }}
                          >
                            {getExperience(
                              candidate
                            )}{" "}
                            years
                          </Typography>
                        </Stack>

                      </Box>
                    );
                  }
                )
              )}

            </Box>


            {/* DETAILS */}

            <Box
              sx={{
                background:
                  "#0f172a",
                border:
                  "1px solid #1e293b",
                borderRadius: 2,
                p: 3,
                minHeight: 500,
              }}
            >

              {!selectedCandidate ? (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                  }}
                >
                  <Typography
                    color="#64748b"
                  >
                    Select a candidate
                    to view details
                  </Typography>
                </Box>
              ) : (
                <>

                  {/* CANDIDATE HEADER */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >

                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                      >
                        {selectedApplicant?.name ||
                          selectedApplicant?.fullName ||
                          "Candidate"}
                      </Typography>

                      <Typography
                        color="#94a3b8"
                      >
                        {selectedApplicant?.email ||
                          "No email"}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,
                          color:
                            "#64748b",
                        }}
                      >
                        {selectedJob?.title ||
                          "Job"}
                      </Typography>
                    </Box>


                    <IconButton
                      onClick={
                        handleActionMenuOpen
                      }
                      sx={{
                        color: "#fff",
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>

                  </Stack>


                  {/* ACTION MENU */}

                  <Menu
                    anchorEl={
                      actionMenuAnchor
                    }
                    open={Boolean(
                      actionMenuAnchor
                    )}
                    onClose={
                      handleActionMenuClose
                    }
                  >
                    <MenuItem
                      onClick={() =>
                        handleViewResume(
                          selectedCandidate
                        )
                      }
                    >
                      View Resume
                    </MenuItem>

                    <MenuItem
                      onClick={() =>
                        console.log(
                          "Add note"
                        )
                      }
                    >
                      Add Note
                    </MenuItem>

                    <MenuItem
                      onClick={handleReject}
                    >
                      Reject Candidate
                    </MenuItem>

                    <MenuItem
                      onClick={
                        handleRemoveCandidate
                      }
                    >
                      Remove Candidate
                    </MenuItem>
                  </Menu>


                  <Divider
                    sx={{
                      my: 3,
                      borderColor:
                        "#1e293b",
                    }}
                  />


                  {/* SCORE */}

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background:
                        "#07111f",
                      border:
                        "1px solid #1e293b",
                      mb: 3,
                    }}
                  >

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >

                      <Box>
                        <Typography
                          color="#94a3b8"
                        >
                          AI Match Score
                        </Typography>

                        <Typography
                          variant="h3"
                          fontWeight={800}
                          sx={{
                            color:
                              getScoreColor(
                                selectedScore
                              ),
                          }}
                        >
                          {
                            selectedScore
                          }%
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              getScoreColor(
                                selectedScore
                              ),
                          }}
                        >
                          {getScoreLabel(
                            selectedScore
                          )}
                        </Typography>
                      </Box>


                      <Button
                        variant="contained"
                        onClick={() =>
                          handleAIAnalysis(
                            selectedCandidate
                          )
                        }
                        disabled={
                          analyzingId ===
                          selectedCandidate?._id
                        }
                      >
                        {analyzingId ===
                        selectedCandidate?._id
                          ? "Analyzing..."
                          : "Analyze Resume"}
                      </Button>

                    </Stack>

                  </Box>


                  {/* STATUS */}

                  <Typography
                    fontWeight={700}
                    mb={1}
                  >
                    Candidate Status
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    mb={3}
                  >

                    {[
                      "applied",
                      "shortlisted",
                      "hired",
                      "rejected",
                    ].map((status) => (
                      <Button
                        key={status}
                        size="small"
                        variant={
                          selectedCandidate?.status ===
                          status
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          handleStatusChange(
                            selectedCandidate,
                            status
                          )
                        }
                      >
                        {status
                          .charAt(0)
                          .toUpperCase() +
                          status.slice(1)}
                      </Button>
                    ))}

                  </Stack>


                  {/* DETAILS */}

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={2}
                  >
                    Candidate Details
                  </Typography>

                  <Stack spacing={1.5}>

                    <Typography>
                      <strong>
                        Experience:
                      </strong>{" "}
                      {getExperience(
                        selectedCandidate
                      )}{" "}
                      years
                    </Typography>

                    <Typography>
                      <strong>
                        Job:
                      </strong>{" "}
                      {selectedJob?.title ||
                        "N/A"}
                    </Typography>

                    <Typography>
                      <strong>
                        Status:
                      </strong>{" "}
                      {selectedCandidate?.status ||
                        "Applied"}
                    </Typography>

                  </Stack>


                  {/* AI ANALYSIS */}

                  <Box mt={4}>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      mb={2}
                    >
                      AI Analysis
                    </Typography>

                    <Typography
                      color="#94a3b8"
                      mb={2}
                    >
                      {selectedAnalysis
                        ?.summary ||
                        "No AI analysis available yet."}
                    </Typography>


                    {Array.isArray(
                      selectedAnalysis?.skills
                    ) &&
                      selectedAnalysis
                        .skills.length >
                        0 && (
                        <Box mb={2}>
                          <Typography
                            fontWeight={600}
                            mb={1}
                          >
                            Skills
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                          >
                            {selectedAnalysis.skills.map(
                              (
                                skill,
                                index
                              ) => (
                                <Chip
                                  key={
                                    index
                                  }
                                  label={
                                    skill
                                  }
                                  size="small"
                                />
                              )
                            )}
                          </Stack>
                        </Box>
                      )}


                    {Array.isArray(
                      selectedAnalysis?.strengths
                    ) &&
                      selectedAnalysis
                        .strengths.length >
                        0 && (
                        <Box mb={2}>
                          <Typography
                            fontWeight={600}
                            mb={1}
                          >
                            Strengths
                          </Typography>

                          {selectedAnalysis.strengths.map(
                            (
                              strength,
                              index
                            ) => (
                              <Typography
                                key={
                                  index
                                }
                                color="#94a3b8"
                              >
                                •{" "}
                                {strength}
                              </Typography>
                            )
                          )}
                        </Box>
                      )}


                    {Array.isArray(
                      selectedAnalysis?.weaknesses
                    ) &&
                      selectedAnalysis
                        .weaknesses.length >
                        0 && (
                        <Box mb={2}>
                          <Typography
                            fontWeight={600}
                            mb={1}
                          >
                            Weaknesses
                          </Typography>

                          {selectedAnalysis.weaknesses.map(
                            (
                              weakness,
                              index
                            ) => (
                              <Typography
                                key={
                                  index
                                }
                                color="#94a3b8"
                              >
                                •{" "}
                                {weakness}
                              </Typography>
                            )
                          )}
                        </Box>
                      )}

                  </Box>


                  {/* ACTIONS */}

                  <Stack
                    direction="row"
                    spacing={2}
                    mt={4}
                  >

                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleViewResume(
                          selectedCandidate
                        )
                      }
                    >
                      View Resume
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() =>
                        handleScheduleInterview(
                          selectedCandidate
                        )
                      }
                    >
                      Schedule Interview
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => {
                        document
                          .getElementById(
                            "candidate-copilot"
                          )
                          ?.scrollIntoView({
                            behavior:
                              "smooth",
                          });
                      }}
                    >
                      Ask Copilot
                    </Button>

                  </Stack>

                </>
              )}

            </Box>

          </Box>


          {/* CANDIDATE COPILOT */}

          {selectedCandidate && (
            <Box
              id="candidate-copilot"
              mt={3}
            >
              <CandidateCopilot
                candidate={
                  selectedCandidate
                }
              />
            </Box>
          )}

        </Box>
      </Box>
    </Box>
  );
}
