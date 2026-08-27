import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import { useNavigate } from "react-router-dom";
import  useJobs  from "../../../hooks/useJob";
import useSavedJobs from "../../../hooks/useSavedJobs";

import ANavbar from "../../../components/layout/applicant/Navbar";
import ASidebar from "../../../components/layout/applicant/Sidebar";

const FindJobs = () => {
  const navigate = useNavigate();

  const {
    jobs,
    loading,
    error,
    fetchAllJobs,
  } = useJobs();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
 // const [savedJobs, setSavedJobs] = useState([]);
  const { savedJobIds, toggleSaveJob } = useSavedJobs();

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];

    return jobs.filter((job) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        job.title?.toLowerCase().includes(searchText) ||
        job.company?.toLowerCase().includes(searchText) ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesLocation =
        !location ||
        job.location?.toLowerCase().includes(location.toLowerCase());

      const matchesJobType =
        !jobType || job.jobType === jobType;

      return matchesSearch && matchesLocation && matchesJobType;
    });
  }, [jobs, search, location, jobType]);

  // const handleSaveJob = (jobId) => {
  //   setSavedJobs((prev) => {
  //     if (prev.includes(jobId)) {
  //       return prev.filter((id) => id !== jobId);
  //     }

  //     return [...prev, jobId];
  //   });
  // };

  const handleSaveJob = (jobId) => {
  toggleSaveJob(jobId);
};

  const handleViewJob = (jobId) => {
    navigate(`/applicant/jobs/${jobId}`);
  };

  const handleApply = (jobId) => {
    navigate(`/applicant/jobs/${jobId}/apply`);
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
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <ANavbar />
      </Box>

      {/* Sidebar + Main */}
      <Box
        sx={{
          display: "flex",
          minWidth: 0,
        }}
      >
        {/* Sidebar */}
        <ASidebar />

        {/* Main */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mb: 1 }}
              >
                Find Jobs
              </Typography>

              <Typography color="text.secondary">
                Discover opportunities that match your skills and career goals.
              </Typography>
            </Box>

            {/* Search & Filters */}
            <Card
              sx={{
                mb: 4,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "2fr 1.3fr 1fr",
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search jobs, skills or company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    select
                    fullWidth
                    label="Job Type"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Full Time">Full Time</MenuItem>
                    <MenuItem value="Part Time">Part Time</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                  </TextField>
                </Box>
              </CardContent>
            </Card>

            {/* Result Count */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography fontWeight={600}>
                {filteredJobs.length} Jobs Found
              </Typography>

              {(search || location || jobType) && (
                <Button
                  variant="text"
                  onClick={() => {
                    setSearch("");
                    setLocation("");
                    setJobType("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>

            {/* Loading */}
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 8,
                }}
              >
                <CircularProgress />
              </Box>
            )}

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Jobs */}
            {!loading && filteredJobs.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {filteredJobs.map((job) => {
                  const isSaved = savedJobs.includes(job._id);

                  return (
                    <Card
                      key={job._id}
                      sx={{
                        borderRadius: 3,
                        transition: "0.2s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        {/* Top */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              sx={{ mb: 0.5 }}
                            >
                              {job.title}
                            </Typography>

                            <Typography
                              color="text.secondary"
                              fontWeight={500}
                            >
                              {job.company || "Company"}
                            </Typography>
                          </Box>

                          <IconButton
                            onClick={() => handleSaveJob(job._id)}
                            color={isSaved ? "primary" : "default"}
                          >
                            {isSaved ? (
                              <BookmarkRoundedIcon />
                            ) : (
                              <BookmarkBorderRoundedIcon />
                            )}
                          </IconButton>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Job Info */}
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          {job.location && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <LocationOnOutlinedIcon
                                fontSize="small"
                              />
                              <Typography variant="body2">
                                {job.location}
                              </Typography>
                            </Box>
                          )}

                          {job.jobType && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <WorkOutlineRoundedIcon
                                fontSize="small"
                              />
                              <Typography variant="body2">
                                {job.jobType}
                              </Typography>
                            </Box>
                          )}

                          {job.experience && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <AccessTimeRoundedIcon
                                fontSize="small"
                              />
                              <Typography variant="body2">
                                {job.experience}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Skills */}
                        {job.skills?.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              mb: 3,
                            }}
                          >
                            {job.skills.slice(0, 5).map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}

                        {/* Description */}
                        {job.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 3,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {job.description}
                          </Typography>
                        )}

                        {/* Buttons */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1.5,
                          }}
                        >
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => handleViewJob(job._id)}
                          >
                            View Details
                          </Button>

                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleApply(job._id)}
                          >
                            Apply Now
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}

            {/* No Jobs */}
            {!loading && filteredJobs.length === 0 && (
              <Card
                sx={{
                  borderRadius: 3,
                  textAlign: "center",
                  py: 8,
                }}
              >
                <CardContent>
                  <SearchRoundedIcon
                    sx={{
                      fontSize: 50,
                      color: "text.secondary",
                      mb: 2,
                    }}
                  />

                  <Typography variant="h6" fontWeight={600}>
                    No jobs found
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Try changing your search or filters.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FindJobs;