import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import useInterview from "../../../hooks/useInterview";

import ANavbar from "../../../components/layout/applicant/Navbar";
import ASidebar from "../../../components/layout/applicant/Sidebar";

// ======================================================
// HELPERS
// ======================================================

const pad = (value) => String(value).padStart(2, "0");

const getDateKey = (value) => {
  if (!value) return "";

  // Avoid timezone shift for YYYY-MM-DD values
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`;
};

const formatLongDate = (dateKey) => {
  if (!dateKey) return "";

  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

const formatShortDate = (dateKey) => {
  if (!dateKey) return "";

  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

const getStatusColor = (theme, status) => {
  switch (status) {
    case "Confirmed":
      return theme.palette.success.main;

    case "Completed":
      return theme.palette.success.main;

    case "Pending":
      return theme.palette.warning.main;

    case "Cancelled":
      return theme.palette.error.main;

    case "Scheduled":
    default:
      return theme.palette.primary.main;
  }
};

const parseDuration = (duration) => {
  if (!duration) return 30;

  const match = String(duration).match(/\d+/);

  return match ? Number(match[0]) : 30;
};

const createGoogleCalendarUrl = (interview) => {
  const dateKey = getDateKey(interview.date);

  if (!dateKey) return "#";

  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  let hours = 9;
  let minutes = 0;

  if (interview.time) {
    const time = String(interview.time)
      .trim()
      .match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

    if (time) {
      hours = Number(time[1]);
      minutes = Number(time[2]);

      const meridiem = time[3]?.toUpperCase();

      if (meridiem === "PM" && hours !== 12) {
        hours += 12;
      }

      if (meridiem === "AM" && hours === 12) {
        hours = 0;
      }
    }
  }

  const start = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes
  );

  const end = new Date(
    start.getTime() +
      parseDuration(interview.duration) * 60 * 1000
  );

  const formatGoogleDate = (date) => {
    return (
      date.getFullYear() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      "00"
    );
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text:
      interview.job?.title ||
      "Interview",
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(
      end
    )}`,
    details:
      `${interview.type || "Interview"}\n` +
      `Recruiter: ${
        interview.recruiter?.name || "Recruiter"
      }`,
    location: interview.meetingLink || "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// ======================================================
// COMPONENT
// ======================================================

const InterviewCalendar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    interviews = [],
    upcomingInterviews = [],
    loading,
    error,
  } = useInterview();

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
  );

  const [selectedDate, setSelectedDate] = useState(
    getDateKey(today)
  );

  // ====================================================
  // CALENDAR
  // ====================================================

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  // ====================================================
  // GROUP INTERVIEWS
  // ====================================================

  const interviewsByDate = useMemo(() => {
    const grouped = {};

    interviews.forEach((interview) => {
      const key = getDateKey(interview.date);

      if (!key) return;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(interview);
    });

    Object.values(grouped).forEach((items) => {
      items.sort((a, b) =>
        String(a.time || "").localeCompare(
          String(b.time || "")
        )
      );
    });

    return grouped;
  }, [interviews]);

  const selectedInterviews =
    interviewsByDate[selectedDate] || [];

  // ====================================================
  // NAVIGATION
  // ====================================================

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const goToToday = () => {
    const now = new Date();

    setCurrentDate(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
    );

    setSelectedDate(getDateKey(now));
  };

  const formatDate = (day) => {
    return `${year}-${pad(month + 1)}-${pad(day)}`;
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <ANavbar />

        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress />

          <Typography color="text.secondary">
            Loading your interviews...
          </Typography>
        </Box>
      </Box>
    );
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <ANavbar />

      <Box
        sx={{
          display: "flex",
          minWidth: 0,
        }}
      >
        <ASidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              maxWidth: 1450,
              mx: "auto",
              px: {
                xs: 2,
                sm: 3,
                lg: 4,
              },
              py: {
                xs: 2,
                md: 3,
              },
            }}
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() =>
                navigate("/applicant/interviews")
              }
              sx={{
                color: "primary.main",
                textTransform: "none",
                fontWeight: 600,
                mb: 1.5,
                px: 0,
                "&:hover": {
                  bgcolor: "transparent",
                },
              }}
            >
              Back to Interviews
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: {
                      xs: 28,
                      md: 36,
                    },
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  My Calendar
                </Typography>

                <Typography
                  sx={{
                    mt: 0.8,
                    color: "text.secondary",
                    fontSize: 14,
                  }}
                >
                  View and manage your scheduled
                  interviews, mock interviews and
                  other events.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <CalendarMonthRoundedIcon
                    sx={{
                      color: "primary.main",
                      fontSize: 19,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "text.secondary",
                    }}
                  >
                    {upcomingInterviews.length}{" "}
                    Upcoming
                  </Typography>
                </Box>
              </Box>
            </Box>

            {error && (
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(
                    theme.palette.error.main,
                    0.08
                  ),
                  border: "1px solid",
                  borderColor: alpha(
                    theme.palette.error.main,
                    0.35
                  ),
                }}
              >
                <Typography
                  color="error.main"
                  fontSize={13}
                >
                  {error}
                </Typography>
              </Box>
            )}

            {/* =================================================
                CALENDAR
            ================================================= */}

            <Box
              sx={{
                p: {
                  xs: 1.5,
                  sm: 2,
                  md: 2.5,
                },
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {/* Calendar top bar */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Button
                    onClick={previousMonth}
                    sx={{
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      color: "text.primary",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <ChevronLeftRoundedIcon />
                  </Button>

                  <Button
                    onClick={nextMonth}
                    sx={{
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      color: "text.primary",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <ChevronRightRoundedIcon />
                  </Button>

                  <Typography
                    sx={{
                      fontSize: {
                        xs: 18,
                        md: 21,
                      },
                      fontWeight: 700,
                      ml: 0.5,
                    }}
                  >
                    {monthName}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      display: {
                        xs: "none",
                        sm: "flex",
                      },
                      p: 0.4,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                    }}
                  >
                    {["Month", "Week", "Day"].map(
                      (view) => (
                        <Button
                          key={view}
                          disabled={view !== "Month"}
                          sx={{
                            minWidth: 65,
                            textTransform:
                              "none",
                            borderRadius: 1.5,
                            fontSize: 12,
                            fontWeight: 600,
                            color:
                              view === "Month"
                                ? "primary.contrastText"
                                : "text.secondary",
                            bgcolor:
                              view === "Month"
                                ? "primary.main"
                                : "transparent",
                            "&.Mui-disabled":
                              {
                                color:
                                  view ===
                                  "Month"
                                    ? "primary.contrastText"
                                    : "text.secondary",
                                opacity: 1,
                              },
                          }}
                        >
                          {view}
                        </Button>
                      )
                    )}
                  </Box>

                  <Button
                    onClick={goToToday}
                    startIcon={
                      <EventAvailableRoundedIcon />
                    }
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      color: "text.primary",
                      border: "1px solid",
                      borderColor: "divider",
                      minHeight: 40,
                    }}
                  >
                    Today
                  </Button>
                </Box>
              </Box>

              {/* Week days */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(7, minmax(0, 1fr))",
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    0.06
                  ),
                  borderRadius: "10px 10px 0 0",
                  overflow: "hidden",
                }}
              >
                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((day) => (
                  <Typography
                    key={day}
                    sx={{
                      textAlign: "center",
                      py: 1.1,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    {day}
                  </Typography>
                ))}
              </Box>

              {/* Days */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(7, minmax(0, 1fr))",
                  borderLeft: "1px solid",
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                {Array.from({
                  length: firstDay,
                }).map((_, index) => (
                  <Box
                    key={`empty-${index}`}
                    sx={{
                      minHeight: {
                        xs: 55,
                        sm: 82,
                        md: 92,
                      },
                      borderRight: "1px solid",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      bgcolor:
                        "background.default",
                    }}
                  />
                ))}

                {Array.from({
                  length: daysInMonth,
                }).map((_, index) => {
                  const day = index + 1;
                  const dateKey = formatDate(day);

                  const dayInterviews =
                    interviewsByDate[dateKey] || [];

                  const isSelected =
                    selectedDate === dateKey;

                  const isToday =
                    getDateKey(new Date()) ===
                    dateKey;

                  return (
                    <Box
                      key={dateKey}
                      onClick={() =>
                        setSelectedDate(dateKey)
                      }
                      sx={{
                        minHeight: {
                          xs: 55,
                          sm: 82,
                          md: 92,
                        },
                        p: {
                          xs: 0.6,
                          sm: 0.9,
                        },
                        borderRight: "1px solid",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        cursor: "pointer",
                        bgcolor: isSelected
                          ? alpha(
                              theme.palette
                                .primary.main,
                              0.1
                            )
                          : "background.paper",
                        transition:
                          "background-color .15s ease",
                        "&:hover": {
                          bgcolor:
                            "action.hover",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 27,
                            height: 27,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            bgcolor: isToday
                              ? "primary.main"
                              : isSelected
                              ? alpha(
                                  theme.palette
                                    .primary
                                    .main,
                                  0.18
                                )
                              : "transparent",
                            color: isToday
                              ? "primary.contrastText"
                              : "text.primary",
                            fontSize: 12,
                            fontWeight:
                              isToday ||
                              isSelected
                                ? 700
                                : 500,
                          }}
                        >
                          {day}
                        </Box>

                        {dayInterviews.length >
                          0 && (
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius:
                                "50%",
                              bgcolor:
                                getStatusColor(
                                  theme,
                                  dayInterviews[0]
                                    ?.status
                                ),
                            }}
                          />
                        )}
                      </Box>

                      <Box
                        sx={{
                          mt: 0.7,
                          display: "flex",
                          flexDirection:
                            "column",
                          gap: 0.4,
                        }}
                      >
                        {dayInterviews
                          .slice(0, 2)
                          .map((interview) => (
                            <Box
                              key={
                                interview._id
                              }
                              sx={{
                                px: 0.6,
                                py: 0.35,
                                borderRadius: 1,
                                bgcolor:
                                  alpha(
                                    getStatusColor(
                                      theme,
                                      interview.status
                                    ),
                                    0.12
                                  ),
                                color:
                                  getStatusColor(
                                    theme,
                                    interview.status
                                  ),
                                fontSize: {
                                  xs: 8,
                                  sm: 9,
                                },
                                fontWeight: 600,
                                whiteSpace:
                                  "nowrap",
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                              }}
                            >
                              {interview.time ||
                                "Interview"}
                            </Box>
                          ))}

                        {dayInterviews.length >
                          2 && (
                          <Typography
                            sx={{
                              fontSize: 9,
                              color:
                                "text.secondary",
                            }}
                          >
                            +
                            {dayInterviews.length -
                              2}{" "}
                            more
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* =================================================
                UPCOMING + FILTERS
            ================================================= */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "1.8fr 0.8fr",
                },
                gap: 3,
                mt: 3,
              }}
            >
              {/* Upcoming Events */}

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      fontSize={18}
                      fontWeight={700}
                    >
                      Upcoming Events
                    </Typography>

                    <Typography
                      color="text.secondary"
                      fontSize={12}
                      mt={0.3}
                    >
                      Your scheduled interviews
                      at a glance.
                    </Typography>
                  </Box>

                  <Button
                    onClick={() =>
                      setSelectedDate(
                        getDateKey(
                          upcomingInterviews[0]
                            ?.date
                        ) || selectedDate
                      )
                    }
                    sx={{
                      textTransform: "none",
                      color: "primary.main",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    View All
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      xl: "repeat(3, 1fr)",
                    },
                    gap: 1.5,
                  }}
                >
                  {upcomingInterviews
                    .slice(0, 3)
                    .map((interview) => {
                      const dateKey =
                        getDateKey(
                          interview.date
                        );

                      return (
                        <Box
                          key={
                            interview._id
                          }
                          onClick={() =>
                            setSelectedDate(
                              dateKey
                            )
                          }
                          sx={{
                            p: 1.7,
                            borderRadius: 2.5,
                            border: "1px solid",
                            borderColor:
                              "divider",
                            cursor: "pointer",
                            bgcolor:
                              "background.default",
                            "&:hover": {
                              borderColor:
                                "primary.main",
                              bgcolor:
                                "action.hover",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                "primary.main",
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          >
                            {formatShortDate(
                              dateKey
                            )}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.7,
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                            noWrap
                          >
                            {interview.job
                              ?.title ||
                              "Interview"}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.3,
                              color:
                                "text.secondary",
                              fontSize: 11,
                            }}
                            noWrap
                          >
                            {interview.job
                              ?.company ||
                              interview.recruiter
                                ?.name ||
                              "Company"}
                          </Typography>

                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 0.5,
                              mt: 1.2,
                            }}
                          >
                            <AccessTimeRoundedIcon
                              sx={{
                                fontSize: 15,
                                color:
                                  "primary.main",
                              }}
                            />

                            <Typography
                              fontSize={11}
                              color="text.secondary"
                            >
                              {interview.time ||
                                "Time not set"}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}

                  {upcomingInterviews.length ===
                    0 && (
                    <Typography
                      color="text.secondary"
                      fontSize={13}
                    >
                      No upcoming interviews.
                    </Typography>
                  )}
                </Box>

                <Button
                  fullWidth
                  onClick={() =>
                    navigate(
                      "/applicant/interviews/coach"
                    )
                  }
                  startIcon={
                    <SmartToyRoundedIcon />
                  }
                  endIcon={
                    <ChevronRightRoundedIcon />
                  }
                  sx={{
                    mt: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    color:
                      "primary.contrastText",
                    bgcolor: "primary.main",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor:
                        "primary.dark",
                    },
                  }}
                >
                  Book an Interview Practice
                </Button>
              </Box>

              {/* Filters */}

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  fontSize={18}
                  fontWeight={700}
                  mb={1.5}
                >
                  Calendar Filters
                </Typography>

                {[
                  {
                    label:
                      "Scheduled Interviews",
                    color:
                      theme.palette.primary
                        .main,
                  },
                  {
                    label:
                      "Completed Interviews",
                    color:
                      theme.palette.success
                        .main,
                  },
                  {
                    label: "Mock Interviews",
                    color:
                      theme.palette.info.main,
                  },
                  {
                    label: "Other Events",
                    color:
                      theme.palette.warning
                        .main,
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 1.1,
                      mb: 1.1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius:
                          "50%",
                        bgcolor: item.color,
                      }}
                    />

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}

                {/* Compact tip */}

                <Box
                  sx={{
                    mt: 2,
                    p: 1.3,
                    borderRadius: 2,
                    display: "flex",
                    gap: 0.8,
                    bgcolor: alpha(
                      theme.palette.info
                        .main,
                      0.08
                    ),
                    border: "1px solid",
                    borderColor: alpha(
                      theme.palette.info
                        .main,
                      0.25
                    ),
                  }}
                >
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: 17,
                      color:
                        "info.main",
                    }}
                  />

                  <Typography
                    fontSize={10.5}
                    color="text.secondary"
                  >
                    Add interviews to Google
                    Calendar from the event
                    details.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* =================================================
                SELECTED DAY
            ================================================= */}

            <Box
              sx={{
                mt: 3,
                p: 2.5,
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                fontSize={18}
                fontWeight={700}
              >
                Selected Day
              </Typography>

              <Typography
                color="text.secondary"
                fontSize={13}
                mt={0.3}
                mb={2}
              >
                {formatLongDate(selectedDate)}
              </Typography>

              {selectedInterviews.length ===
              0 ? (
                <Box
                  sx={{
                    py: 3,
                    textAlign: "center",
                  }}
                >
                  <CalendarMonthRoundedIcon
                    sx={{
                      fontSize: 38,
                      color:
                        "text.disabled",
                    }}
                  />

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                    mt={1}
                  >
                    No interview scheduled
                    for this date.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md:
                        selectedInterviews.length ===
                        1
                          ? "minmax(280px, 520px)"
                          : "repeat(2, minmax(0, 1fr))",
                      xl:
                        selectedInterviews.length >=
                        3
                          ? "repeat(3, minmax(0, 1fr))"
                          : "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  {selectedInterviews.map(
                    (interview) => {
                      const statusColor =
                        getStatusColor(
                          theme,
                          interview.status
                        );

                      const googleCalendarUrl =
                        createGoogleCalendarUrl(
                          interview
                        );

                      return (
                        <Box
                          key={
                            interview._id
                          }
                          sx={{
                            p: 2.2,
                            borderRadius: 2.5,
                            border: "1px solid",
                            borderColor:
                              "divider",
                            bgcolor:
                              "background.default",
                          }}
                        >
                          {/* Status */}

                          <Box
                            sx={{
                              display:
                                "inline-flex",
                              px: 1,
                              py: 0.45,
                              borderRadius:
                                1.5,
                              bgcolor:
                                alpha(
                                  statusColor,
                                  0.12
                                ),
                              color:
                                statusColor,
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          >
                            {interview.status ||
                              "Scheduled"}
                          </Box>

                          <Typography
                            sx={{
                              mt: 1.3,
                              fontSize: 17,
                              fontWeight: 700,
                            }}
                          >
                            {interview.job
                              ?.title ||
                              "Interview"}
                          </Typography>

                          <Typography
                            color="text.secondary"
                            fontSize={12}
                            mt={0.4}
                          >
                            {interview.job
                              ?.company ||
                              interview.recruiter
                                ?.name ||
                              "Company"}
                          </Typography>

                          <Box
                            sx={{
                              display:
                                "flex",
                              flexWrap:
                                "wrap",
                              gap: 1.5,
                              mt: 1.8,
                            }}
                          >
                            <Box
                              sx={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: 0.5,
                              }}
                            >
                              <AccessTimeRoundedIcon
                                sx={{
                                  fontSize: 17,
                                  color:
                                    "primary.main",
                                }}
                              />

                              <Typography
                                fontSize={12}
                              >
                                {interview.time ||
                                  "Time not set"}
                              </Typography>
                            </Box>

                            {interview.duration && (
                              <Typography
                                fontSize={12}
                                color="text.secondary"
                              >
                                •{" "}
                                {
                                  interview.duration
                                }
                              </Typography>
                            )}
                          </Box>

                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 0.6,
                              mt: 1.2,
                            }}
                          >
                            <VideoCameraFrontRoundedIcon
                              sx={{
                                fontSize: 17,
                                color:
                                  "info.main",
                              }}
                            />

                            <Typography
                              fontSize={12}
                              color="text.secondary"
                            >
                              {interview.type ||
                                "Interview"}
                            </Typography>
                          </Box>

                          {/* Actions */}

                          <Box
                            sx={{
                              display:
                                "flex",
                              gap: 1,
                              mt: 2,
                              flexWrap:
                                "wrap",
                            }}
                          >
                            <Button
                              component="a"
                              href={
                                googleCalendarUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              startIcon={
                                <AddRoundedIcon />
                              }
                              sx={{
                                flex: 1,
                                minWidth: 170,
                                textTransform:
                                  "none",
                                borderRadius: 2,
                                color:
                                  "primary.main",
                                border: "1px solid",
                                borderColor:
                                  "primary.main",
                              }}
                            >
                              Add to Google
                              Calendar
                            </Button>

                            <Button
                              size="small"
                              variant="contained"
                              onClick={() =>
                                navigate(
                                  `/applicant/interviews/details/${interview._id}`
                                )
                              }
                              sx={{
                                flex: 1,
                                minWidth: 150,
                                textTransform:
                                  "none",
                                borderRadius: 2,
                              }}
                            >
                              View Details
                            </Button>
                          </Box>
                        </Box>
                      );
                    }
                  )}
                </Box>
              )}
            </Box>

            {/* =================================================
                UPCOMING INTERVIEWS
            ================================================= */}

            <Box
              sx={{
                mt: 3,
                p: 2.5,
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                fontSize={18}
                fontWeight={700}
              >
                Upcoming Interviews
              </Typography>

              <Typography
                color="text.secondary"
                fontSize={12}
                mt={0.3}
                mb={2}
              >
                Your scheduled interviews at a
                glance.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {upcomingInterviews
                  .slice(0, 6)
                  .map((interview) => {
                    const dateKey =
                      getDateKey(
                        interview.date
                      );

                    return (
                      <Box
                        key={
                          interview._id
                        }
                        sx={{
                          p: 1.7,
                          borderRadius: 2.5,
                          bgcolor:
                            "background.default",
                          border: "1px solid",
                          borderColor:
                            "divider",
                          cursor: "pointer",
                          "&:hover": {
                            borderColor:
                              "primary.main",
                            bgcolor:
                              "action.hover",
                          },
                        }}
                        onClick={() =>
                          setSelectedDate(
                            dateKey
                          )
                        }
                      >
                        <Typography
                          color="primary.main"
                          fontSize={10}
                          fontWeight={700}
                        >
                          {dateKey}
                        </Typography>

                        <Typography
                          fontSize={14}
                          fontWeight={700}
                          mt={0.7}
                          noWrap
                        >
                          {interview.job
                            ?.title ||
                            "Interview"}
                        </Typography>

                        <Typography
                          color="text.secondary"
                          fontSize={11}
                          mt={0.3}
                          noWrap
                        >
                          {interview.job
                            ?.company ||
                            interview.recruiter
                              ?.name ||
                            "Company"}
                        </Typography>

                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 0.5,
                            mt: 1,
                          }}
                        >
                          <AccessTimeRoundedIcon
                            sx={{
                              fontSize: 14,
                              color:
                                "primary.main",
                            }}
                          />

                          <Typography
                            fontSize={11}
                            color="text.secondary"
                          >
                            {interview.time ||
                              "Time not set"}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InterviewCalendar;