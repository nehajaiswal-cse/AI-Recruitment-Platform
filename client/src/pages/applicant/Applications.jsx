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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  IconButton,
  Snackbar,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import ANavbar from "../../components/layout/applicant/Navbar";
import ASidebar from "../../components/layout/applicant/Sidebar";

import { useApplication } from "../../hooks/useApplication";
import { brandGradient } from "../../theme.js";

// Application.status enum (backend): applied, shortlisted, rejected, hired
const statusColors = {
  applied: "#64748b",
  shortlisted: "#f59e0b",
  hired: "#10b981",
  rejected: "#f43f5e",
  withdrawn: "#94a3b8",
};

const statusLabel = (status) => {
  if (!status) return "Applied";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ==========================================
// RESOLVE RESUME URL
// ==========================================
// Newer applications store a full S3 URL (e.g. https://bucket.s3...amazonaws.com/...)
// and that can be used as-is.
//
// Older applications (uploaded before the S3 migration) stored a relative
// path like "/uploads/167...-Resume.pdf". A relative path resolves against
// whatever origin the browser tab is currently on - which, in dev, is the
// Vite server (localhost:5173), NOT the backend (localhost:5000) that
// actually serves that file via express.static("uploads"). That mismatch
// is what caused the 404. This helper fixes that by prefixing relative
// paths with the backend's origin.
const resolveResumeUrl = (url) => {
  if (!url) return null;

  // Already a full URL (S3 or otherwise) - use as-is.
  if (/^https?:\/\//i.test(url)) return url;

  // Relative path from the old local-storage upload flow - point it at
  // the backend server instead of the frontend dev server.
  //
  // VITE_API_URL is something like "http://localhost:5000/api" (used for
  // API calls), but static files are served from the origin only, with
  // no "/api" prefix - e.g. app.use("/uploads", express.static("uploads")).
  // So we take just the origin (protocol + host + port) and drop any path.
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  let backendOrigin;
  try {
    backendOrigin = new URL(apiUrl).origin;
  } catch {
    backendOrigin = "http://localhost:5000";
  }

  return `${backendOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
};

const TABS = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const Applications = () => {
  const navigate = useNavigate();

  const {
    applications,
    loading,
    error,
    fetchMyApplications,
    removeApplication,
  } = useApplication();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ==========================================
  // FETCH APPLICATIONS
  // ==========================================

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  // ==========================================
  // NORMALIZE (job may be populated or missing)
  // ==========================================

  const rows = useMemo(() => {
    return (applications || []).map((application) => {
      const job =
        application.jobId && typeof application.jobId === "object"
          ? application.jobId
          : null;

      return {
        id: application._id,
        jobId: job?._id || application.jobId,
        jobTitle: job?.title || "Job no longer available",
        company: job?.company || "-",
        location: job?.location || "-",
        appliedDate: application.createdAt,
        status: application.status || "applied",
        resumeName: application.resume?.fileName,
        resumeUrl: resolveResumeUrl(application.resume?.fileUrl),
      };
    });
  }, [applications]);

  // ==========================================
  // TAB COUNTS
  // ==========================================

  const counts = useMemo(() => {
    const base = { all: rows.length, applied: 0, shortlisted: 0, hired: 0, rejected: 0 };
    rows.forEach((row) => {
      if (base[row.status] !== undefined) base[row.status] += 1;
    });
    return base;
  }, [rows]);

  // ==========================================
  // FILTER (tab + search)
  // ==========================================

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesTab = activeTab === "all" || row.status === activeTab;

      const searchText = search.trim().toLowerCase();
      const matchesSearch =
        !searchText ||
        row.jobTitle.toLowerCase().includes(searchText) ||
        row.company.toLowerCase().includes(searchText);

      return matchesTab && matchesSearch;
    });
  }, [rows, activeTab, search]);

  // ==========================================
  // WITHDRAW
  // ==========================================

  const handleWithdrawClick = (row) => {
    setWithdrawErrorMsg("");
    setWithdrawTarget(row);
  };

  const handleWithdrawConfirm = async () => {
    if (!withdrawTarget) return;

    try {
      setWithdrawing(true);
      setWithdrawErrorMsg("");

      await removeApplication(withdrawTarget.id);

      setSuccessMsg(`Withdrew application for "${withdrawTarget.jobTitle}"`);
      setWithdrawTarget(null);
    } catch (err) {
      setWithdrawErrorMsg(
        err.response?.data?.message || "Failed to withdraw application."
      );
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      {/* Navbar */}
      <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 50 }}>
        <ANavbar />
      </Box>

      {/* Sidebar + Main */}
      <Box sx={{ display: "flex", minWidth: 0 }}>
        <ASidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: "background.default",
            color: "text.primary",
            p: 5,
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
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
              <DescriptionRoundedIcon sx={{ color: "#fff" }} />
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                My Applications
              </Typography>
              <Typography color="text.secondary">
                Track the status of every job you've applied to.
              </Typography>
            </Box>
          </Box>

          {/* Search + Tabs */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <CardContent>
              <TextField
                fullWidth
                placeholder="Search by job title or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Tabs
                value={activeTab}
                onChange={(e, value) => setActiveTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 40,
                  "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 },
                }}
              >
                {TABS.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={`${tab.label} (${counts[tab.value] ?? 0})`}
                  />
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading && rows.length === 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Table */}
          {!loading && filteredRows.length > 0 && (
            <TableContainer
              component={Card}
              sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Job</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Applied On</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Resume</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredRows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.jobTitle}</TableCell>
                      <TableCell>{row.company}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{formatDate(row.appliedDate)}</TableCell>

                      <TableCell>
                        {row.resumeUrl ? (
                          <Tooltip title={row.resumeName || "View resume"}>
                            <Button
                              size="small"
                              startIcon={<InsertDriveFileOutlinedIcon />}
                              href={row.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ textTransform: "none" }}
                            >
                              View
                            </Button>
                          </Tooltip>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={statusLabel(row.status)}
                          size="small"
                          sx={{
                            bgcolor: `${statusColors[row.status] || "#64748b"}20`,
                            color: statusColors[row.status] || "#64748b",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="View job">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/applicant/jobs/${row.jobId}`)}
                          >
                            <VisibilityRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            row.status === "withdrawn"
                              ? "Already withdrawn"
                              : "Withdraw application"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={row.status === "withdrawn"}
                              onClick={() => handleWithdrawClick(row)}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* No applications at all */}
          {!loading && rows.length === 0 && (
            <Card sx={{ borderRadius: 3, textAlign: "center", py: 8 }}>
              <CardContent>
                <DescriptionRoundedIcon
                  sx={{ fontSize: 50, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" fontWeight={600}>
                  You haven't applied to any jobs yet
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                  Browse open roles and submit your first application.
                </Typography>
                <Button variant="contained" onClick={() => navigate("/applicant/jobs")}>
                  Find Jobs
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Applications exist, but none match tab/search */}
          {!loading && rows.length > 0 && filteredRows.length === 0 && (
            <Card sx={{ borderRadius: 3, textAlign: "center", py: 8 }}>
              <CardContent>
                <SearchRoundedIcon sx={{ fontSize: 50, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                  No applications match your filters
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                  Try a different search term or status tab.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearch("");
                    setActiveTab("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {/* Withdraw Confirmation Dialog */}
      <Dialog open={Boolean(withdrawTarget)} onClose={() => setWithdrawTarget(null)}>
        <DialogTitle>Withdraw Application?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw your application for{" "}
            <strong>{withdrawTarget?.jobTitle}</strong>? This action cannot be undone.
          </DialogContentText>

          {withdrawErrorMsg && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {withdrawErrorMsg}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setWithdrawTarget(null)} disabled={withdrawing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleWithdrawConfirm}
            disabled={withdrawing}
          >
            {withdrawing ? "Withdrawing..." : "Withdraw"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(successMsg)}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg("")}
        message={successMsg}
      />
    </Box>
  );
};

export default Applications;