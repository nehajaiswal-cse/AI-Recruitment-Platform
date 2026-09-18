
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  Tooltip,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Snackbar,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BookmarksRoundedIcon from "@mui/icons-material/BookmarksRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import ANavbar from '../../components/layout/applicant/Navbar';
import ASidebar from '../../components/layout/applicant/Sidebar';

import useJob from "../../hooks/useJob";
import useSavedJobs from "../../hooks/useSavedJobs";

import { brandGradient } from "../../theme.js";

const SavedJob = () => {
  const navigate = useNavigate();

  const { jobs, loading, error, fetchAllJobs } = useJob();
  const { savedJobIds, unsaveJob, saveJob } = useSavedJobs();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [undoJob, setUndoJob] = useState(null);

  // ==========================================
  // FETCH JOBS (real data - same job list the
  // Find Jobs page uses, filtered down to saved)
  // ==========================================

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  // ==========================================
  // SAVED JOBS (full job objects, real data)
  // ==========================================

  const savedJobs = useMemo(() => {
    if (!jobs || savedJobIds.length === 0) return [];

    return jobs.filter((job) => savedJobIds.includes(job._id));
  }, [jobs, savedJobIds]);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredSavedJobs = useMemo(() => {
    return savedJobs.filter((job) => {
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

      const matchesJobType = !jobType || job.jobType === jobType;

      return matchesSearch && matchesLocation && matchesJobType;
    });
  }, [savedJobs, search, location, jobType]);

  const hasActiveFilters = Boolean(search || location || jobType);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
  };

  // ==========================================
  // UNSAVE (with quick undo)
  // ==========================================

  const handleUnsaveJob = (event, job) => {
    event.stopPropagation();
    unsaveJob(job._id);
    setUndoJob(job);
  };

  const handleUndo = () => {
    if (undoJob) {
      saveJob(undoJob._id);
    }
    setUndoJob(null);
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleViewJob = (jobId) => {
    navigate(`/applicant/jobs/${jobId}`);
  };

  return (
     <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
          }}
        >
          {/* Navbar */}
          <Box
            component="header"
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 50,
            }}
          >
            <ANavbar />
          </Box>
    
          {/* Sidebar + Main */}
          <Box
            sx={{
              display: 'flex',
              minWidth: 0,
            }}
          >
            {/* Sidebar */}
            <ASidebar />
    
            {/* Main Content */}
            <Box
              component="main"
              sx={{
                flex: 1,
                minWidth: 0,
                bgcolor: 'background.default',
                color: 'text.primary',
                p: 5,
    
    
              }}
    
    
            >

    
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: brandGradient,
            flexShrink: 0,
          }}
        >
          <BookmarksRoundedIcon sx={{ color: "#fff" }} />
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
            Saved Jobs
          </Typography>

          <Typography color="text.secondary">
            Jobs you've bookmarked for later review.
          </Typography>
        </Box>
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
              placeholder="Search saved jobs, skills or company..."
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
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
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
          {filteredSavedJobs.length} Saved{" "}
          {filteredSavedJobs.length === 1 ? "Job" : "Jobs"}
        </Typography>

        {hasActiveFilters && (
          <Button variant="text" onClick={clearFilters}>
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

      {/* Saved Jobs Grid */}
      {!loading && filteredSavedJobs.length > 0 && (
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
          {filteredSavedJobs.map((job) => (
            <Card
              key={job._id}
              onClick={() => handleViewJob(job._id)}
              sx={{
                borderRadius: 3,
                cursor: "pointer",
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
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                      {job.title}
                    </Typography>

                    <Typography color="text.secondary" fontWeight={500}>
                      {job.company || "Company"}
                    </Typography>
                  </Box>

                  <Tooltip title="Remove from saved jobs">
                    <IconButton
                      onClick={(e) => handleUnsaveJob(e, job)}
                      color="primary"
                    >
                      <BookmarkRoundedIcon />
                    </IconButton>
                  </Tooltip>
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
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <LocationOnOutlinedIcon fontSize="small" />
                      <Typography variant="body2">{job.location}</Typography>
                    </Box>
                  )}

                  {job.jobType && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <WorkOutlineRoundedIcon fontSize="small" />
                      <Typography variant="body2">{job.jobType}</Typography>
                    </Box>
                  )}

                  {job.experience && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTimeRoundedIcon fontSize="small" />
                      <Typography variant="body2">
                        {job.experience}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}
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

                {/* View Details */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewJob(job._id);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* No Saved Jobs At All */}
      {!loading && savedJobs.length === 0 && (
        <Card sx={{ borderRadius: 3, textAlign: "center", py: 8 }}>
          <CardContent>
            <BookmarksRoundedIcon
              sx={{ fontSize: 50, color: "text.secondary", mb: 2 }}
            />

            <Typography variant="h6" fontWeight={600}>
              No saved jobs yet
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Tap the bookmark icon on any job to save it here for later.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/applicant/jobs")}
            >
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Saved Jobs Exist, But None Match Filters */}
      {!loading && savedJobs.length > 0 && filteredSavedJobs.length === 0 && (
        <Card sx={{ borderRadius: 3, textAlign: "center", py: 8 }}>
          <CardContent>
            <SearchRoundedIcon
              sx={{ fontSize: 50, color: "text.secondary", mb: 2 }}
            />

            <Typography variant="h6" fontWeight={600}>
              No saved jobs match your filters
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Try changing your search or clearing the filters.
            </Typography>

            <Button variant="outlined" onClick={clearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Undo Snackbar */}
      <Snackbar
        open={Boolean(undoJob)}
        autoHideDuration={4000}
        onClose={() => setUndoJob(null)}
        message={
          undoJob ? `Removed "${undoJob.title}" from saved jobs` : ""
        }
        action={
          <Button color="inherit" size="small" onClick={handleUndo}>
            UNDO
          </Button>
        }
      />
    
    </Box>
    </Box>
    </Box>
  );
};

export default SavedJob;