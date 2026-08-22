import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBackRounded,
  BusinessRounded,
  CalendarTodayRounded,
  CheckCircleRounded,
  DescriptionRounded,
  LocationOnRounded,
  WorkOutlineRounded,
  ScheduleRounded,
  EventRounded,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../../components/layout/applicant/Navbar";
import ASidebar from "../../../components/layout/applicant/Sidebar";

import useApplications from "../../../hooks/useApplications";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getApplicationById } = useApplications();

  const application = getApplicationById(id);

  // --------------------------------------------------
  // Application not found
  // --------------------------------------------------

  if (!application) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Navbar />

        <Box sx={{ display: "flex" }}>
          <ASidebar />

          <Box
            component="main"
            sx={{
              flex: 1,
              p: {
                xs: 2,
                sm: 3,
                md: 4,
              },
            }}
          >
            <Container maxWidth="xl">
              <Typography variant="h5" fontWeight={600}>
                Application not found
              </Typography>

              <Button
                startIcon={<ArrowBackRounded />}
                sx={{ mt: 3 }}
                onClick={() =>
                  navigate("/applicant/applications")
                }
              >
                Back to Applications
              </Button>
            </Container>
          </Box>
        </Box>
      </Box>
    );
  }

  // --------------------------------------------------
  // Status color
  // --------------------------------------------------

  const getStatusColor = (status) => {
    switch (status) {
      case "Shortlisted":
        return "success";

      case "Under Review":
        return "info";

      case "Rejected":
        return "error";

      case "Interview Scheduled":
        return "secondary";

      case "Selected":
        return "success";

      case "Withdrawn":
        return "default";

      default:
        return "warning";
    }
  };

  // --------------------------------------------------
  // Timeline
  // --------------------------------------------------

  const timeline = [
    {
      title: "Application Submitted",
      date: application.appliedDate,
      completed: true,
    },
    {
      title: "Resume Reviewed",
      date: "Application reviewed by recruiter",
      completed: [
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Selected",
        "Rejected",
      ].includes(application.status),
    },
    {
      title: "Shortlisted",
      date:
        application.status === "Shortlisted" ||
          application.status === "Interview Scheduled" ||
          application.status === "Selected"
          ? "Candidate shortlisted"
          : "Waiting for recruiter decision",
      completed:
        application.status === "Shortlisted" ||
        application.status === "Interview Scheduled" ||
        application.status === "Selected",
    },
    {
      title: "Interview",
      date:
        application.status === "Interview Scheduled"
          ? "Interview scheduled"
          : "Not scheduled",
      completed:
        application.status === "Interview Scheduled" ||
        application.status === "Selected",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Navbar */}
      <Navbar />

      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <ASidebar />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          <Container maxWidth="xl">
            {/* ---------------------------------------- */}
            {/* Header */}
            {/* ---------------------------------------- */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackRounded />}
                onClick={() =>
                  navigate("/applicant/applications")
                }
              >
                Back
              </Button>

              <Box>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="text.primary"
                >
                  Application Details
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  View your application information and status
                </Typography>
              </Box>
            </Stack>

            {/* ---------------------------------------- */}
            {/* Job Header Card */}
            {/* ---------------------------------------- */}

            <Card
              sx={{
                mb: 3,
                backgroundColor: "background.paper",
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color="text.primary"
                    >
                      {application.jobTitle}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <BusinessRounded
                        fontSize="small"
                        color="action"
                      />

                      <Typography
                        color="text.secondary"
                      >
                        {application.company}
                      </Typography>
                    </Stack>
                  </Box>

                  <Chip
                    label={application.status}
                    color={getStatusColor(
                      application.status
                    )}
                    sx={{
                      alignSelf: {
                        xs: "flex-start",
                        sm: "center",
                      },
                      fontWeight: 600,
                    }}
                  />
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                    >
                      <LocationOnRounded color="action" />

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Location
                        </Typography>

                        <Typography
                          fontWeight={600}
                          color="text.primary"
                        >
                          {application.location}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                    >
                      <WorkOutlineRounded color="action" />

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Job Type
                        </Typography>

                        <Typography
                          fontWeight={600}
                          color="text.primary"
                        >
                          {application.jobType}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                    >
                      <CalendarTodayRounded color="action" />

                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Applied On
                        </Typography>

                        <Typography
                          fontWeight={600}
                          color="text.primary"
                        >
                          {application.appliedDate}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ---------------------------------------- */}
            {/* Main Grid */}
            {/* ---------------------------------------- */}

            <Grid container spacing={3}>
              {/* -------------------------------------- */}
              {/* Left Column */}
              {/* -------------------------------------- */}

              <Grid size={{ xs: 12, md: 8 }}>
                {/* AI Match Score */}

                <Card sx={{ mb: 3 }}>
  <CardContent>
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        width: "100%",
        mb: 2,
      }}
    >
      {/* LEFT SIDE */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          fontWeight={700}
        >
          AI Match Score
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          How well your profile matches this position
        </Typography>
      </Box>

      {/* RIGHT SIDE */}
      <Box sx={{ ml: 4 }}>
        <Typography
          variant="h3"
          fontWeight={500}
          color="text.primary"
        >
          {application.matchScore}%
        </Typography>
      </Box>
    </Stack>

    <LinearProgress
      variant="determinate"
      value={application.matchScore}
      sx={{
        height: 10,
        borderRadius: 5,
        bgcolor: "action.hover",
      }}
    />

    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing={2}
      sx={{ mt: 3 }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Skills Match
        </Typography>
        <Typography fontWeight={600}>
          92%
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Experience Match
        </Typography>
        <Typography fontWeight={600}>
          85%
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Education Match
        </Typography>
        <Typography fontWeight={600}>
          90%
        </Typography>
      </Box>
    </Stack>
  </CardContent>
</Card>

                {/* Application Timeline */}

                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 3 }}
                    >
                      Application Timeline
                    </Typography>

                    <Stack spacing={0}>
                      {timeline.map((item, index) => (
                        <Box
                          key={item.title}
                          sx={{
                            display: "flex",
                            position: "relative",
                            pb:
                              index === timeline.length - 1
                                ? 0
                                : 4,
                          }}
                        >
                          {/* Timeline Line */}

                          {index !==
                            timeline.length - 1 && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: 11,
                                  top: 25,
                                  bottom: 0,
                                  width: 2,
                                  bgcolor:
                                    "divider",
                                }}
                              />
                            )}

                          {/* Icon */}

                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 2,
                              zIndex: 1,
                              bgcolor: item.completed
                                ? "success.main"
                                : "action.hover",
                              color: item.completed
                                ? "#fff"
                                : "text.secondary",
                            }}
                          >
                            {item.completed && (
                              <CheckCircleRounded
                                sx={{ fontSize: 16 }}
                              />
                            )}
                          </Box>

                          {/* Content */}

                          <Box>
                            <Typography
                              fontWeight={600}
                              color="text.primary"
                            >
                              {item.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {item.date}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* -------------------------------------- */}
              {/* Right Column */}
              {/* -------------------------------------- */}

              <Grid size={{ xs: 12, md: 4 }}>
                {/* Application Summary */}

                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 2 }}
                    >
                      Application Summary
                    </Typography>

                    <Stack spacing={2} sx={{ width: "100%" }}>

                      {/* Status */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography color="text.secondary">
                          Status
                        </Typography>

                        <Chip
                          size="small"
                          label={application.status}
                          color={getStatusColor(application.status)}
                        />
                      </Box>

                      <Divider />

                      {/* Applied Date */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography color="text.secondary">
                          Applied
                        </Typography>

                        <Typography
                          fontWeight={600}
                          color="text.primary"
                        >
                          {application.appliedDate}
                        </Typography>
                      </Box>

                      <Divider />

                      {/* Match Score */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography color="text.secondary">
                          Match Score
                        </Typography>

                        <Typography
                          fontWeight={700}
                          color="primary.main"
                        >
                          {application.matchScore}%
                        </Typography>
                      </Box>

                    </Stack>
                  </CardContent>
                </Card>

                {/* Resume */}

                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 2 }}
                    >
                      Submitted Resume
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >
                      <DescriptionRounded
                        color="primary"
                      />

                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={600}>
                          {application.resume ||
                            "Resume.pdf"}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Submitted with application
                        </Typography>
                      </Box>
                    </Stack>

                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      View Resume
                    </Button>
                  </CardContent>
                </Card>

                {/* Interview */}

                {application.status ===
                  "Interview Scheduled" && (
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ mb: 2 }}
                        >
                          Interview
                        </Typography>

                        <Stack spacing={2}>
                          <Stack
                            direction="row"
                            spacing={1}
                          >
                            <EventRounded color="primary" />

                            <Typography>
                              Interview Scheduled
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={1}
                          >
                            <ScheduleRounded color="primary" />

                            <Typography>
                              Check your interview schedule
                            </Typography>
                          </Stack>

                          <Button
                            variant="contained"
                            fullWidth
                          >
                            View Interview
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  )}

                {/* Actions */}

                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 2 }}
                    >
                      Actions
                    </Typography>

                    <Stack spacing={1.5}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() =>
                          navigate("/applicant/applications")
                        }
                      >
                        Back to Applications
                      </Button>

                      {application.status === "Applied" && (
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                        >
                          Withdraw Application
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ApplicationDetails;