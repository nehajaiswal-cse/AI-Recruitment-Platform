import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded";

const interviews = [
  {
    id: "1",
    date: "2026-08-22",
    company: "InnovateX Solutions",
    role: "Frontend Developer",
    time: "02:00 PM",
    duration: "60 min",
    type: "Technical Interview",
    status: "Scheduled",
  },
  {
    id: "2",
    date: "2026-08-25",
    company: "CloudStack Technologies",
    role: "Full Stack Developer",
    time: "11:30 AM",
    duration: "30 min",
    type: "HR Interview",
    status: "Scheduled",
  },
  {
    id: "3",
    date: "2026-08-28",
    company: "WebCraft Solutions",
    role: "Software Engineer",
    time: "04:00 PM",
    duration: "45 min",
    type: "Technical Interview",
    status: "Confirmed",
  },
];

const InterviewCalendar = () => {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1));

  const [selectedDate, setSelectedDate] = useState("2026-08-22");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDate = (day) => {
    const monthNumber = String(month + 1).padStart(2, "0");
    const dayNumber = String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
  };

  const selectedInterview = interviews.filter(
    (item) => item.date === selectedDate,
  );

  const hasInterview = (day) => {
    return interviews.some((item) => item.date === formatDate(day));
  };

  const getInterviewForDay = (day) => {
    return interviews.find((item) => item.date === formatDate(day));
  };

  const statusStyle = (status) => {
    if (status === "Confirmed") {
      return {
        bgcolor: "#052e1b",
        color: "#4ade80",
      };
    }

    return {
      bgcolor: "#172554",
      color: "#60a5fa",
    };
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#07111f",
        color: "#f8fafc",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* ================= HEADER ================= */}

      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/applicant/interviews")}
          sx={{
            color: "#a78bfa",
            textTransform: "none",
            mb: 2,
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
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 30,
                  md: 36,
                },
                fontWeight: 700,
              }}
            >
              Interview Calendar
            </Typography>

            <Typography
              sx={{
                mt: 0.7,
                color: "#94a3b8",
                fontSize: 15,
              }}
            >
              View and manage your upcoming interviews.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: "#0e1a2b",
              border: "1px solid #24334a",
            }}
          >
            <CalendarMonthRoundedIcon
              sx={{
                color: "#a78bfa",
                fontSize: 20,
              }}
            />

            <Typography
              sx={{
                color: "#cbd5e1",
                fontSize: 13,
              }}
            >
              {interviews.length} Upcoming Interviews
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ================= MAIN ================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.6fr 0.9fr",
          },
          gap: 3,
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        {/* ================= CALENDAR ================= */}

        <Box
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
            borderRadius: 3,
            bgcolor: "#0e1a2b",
            border: "1px solid #24334a",
          }}
        >
          {/* Calendar Header */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {monthName} {year}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 0.5,
              }}
            >
              <Button
                onClick={previousMonth}
                sx={{
                  minWidth: 38,
                  width: 38,
                  height: 38,
                  color: "#94a3b8",
                }}
              >
                <ChevronLeftRoundedIcon />
              </Button>

              <Button
                onClick={nextMonth}
                sx={{
                  minWidth: 38,
                  width: 38,
                  height: 38,
                  color: "#94a3b8",
                }}
              >
                <ChevronRightRoundedIcon />
              </Button>
            </Box>
          </Box>

          {/* Week Days */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              mb: 1,
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Typography
                key={day}
                sx={{
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: 600,
                  py: 1,
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>

          {/* Calendar Days */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 0.7,
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
                    sm: 70,
                  },
                }}
              />
            ))}

            {Array.from({
              length: daysInMonth,
            }).map((_, index) => {
              const day = index + 1;
              const date = formatDate(day);
              const interview = getInterviewForDay(day);

              const selected = selectedDate === date;

              return (
                <Button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  sx={{
                    minWidth: 0,
                    minHeight: {
                      xs: 55,
                      sm: 70,
                    },
                    p: 0.8,
                    borderRadius: 2,
                    color: selected ? "#fff" : "#cbd5e1",
                    bgcolor: selected ? "#312e81" : "transparent",
                    border: selected
                      ? "1px solid #6366f1"
                      : "1px solid transparent",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",

                    "&:hover": {
                      bgcolor: selected ? "#312e81" : "#111c31",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: selected ? 700 : 500,
                    }}
                  >
                    {day}
                  </Typography>

                  {interview && (
                    <Box
                      sx={{
                        mt: 0.8,
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor:
                          interview.status === "Confirmed"
                            ? "#4ade80"
                            : "#60a5fa",
                      }}
                    />
                  )}
                </Button>
              );
            })}
          </Box>

          {/* Legend */}

          <Box
            sx={{
              display: "flex",
              gap: 2.5,
              mt: 3,
              pt: 2,
              borderTop: "1px solid #24334a",
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#60a5fa",
                }}
              />

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 12,
                }}
              >
                Scheduled
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#4ade80",
                }}
              />

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 12,
                }}
              >
                Confirmed
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ================= SELECTED DAY ================= */}

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "#0e1a2b",
            border: "1px solid #24334a",
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Selected Day
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 13,
              mb: 3,
            }}
          >
            {selectedDate}
          </Typography>

          {selectedInterview.length === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
              }}
            >
              <CalendarMonthRoundedIcon
                sx={{
                  fontSize: 42,
                  color: "#334155",
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 14,
                }}
              >
                No interview scheduled
              </Typography>
            </Box>
          ) : (
            selectedInterview.map((interview) => (
              <Box
                key={interview.company}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "#111c31",
                  border: "1px solid #293752",
                }}
              >
                {/* Status */}

                <Box
                  sx={{
                    display: "inline-flex",
                    px: 1.2,
                    py: 0.5,
                    borderRadius: 1.5,
                    fontSize: 11,
                    fontWeight: 600,
                    mb: 2,
                    ...statusStyle(interview.status),
                  }}
                >
                  {interview.status}
                </Box>

                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {interview.role}
                </Typography>

                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: 13,
                    mt: 0.4,
                    mb: 2.5,
                  }}
                >
                  {interview.company}
                </Typography>

                {/* Time */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <AccessTimeRoundedIcon
                    sx={{
                      color: "#a78bfa",
                      fontSize: 19,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 13,
                    }}
                  >
                    {interview.time} • {interview.duration}
                  </Typography>
                </Box>

                {/* Type */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2.5,
                  }}
                >
                  <VideoCameraFrontRoundedIcon
                    sx={{
                      color: "#60a5fa",
                      fontSize: 19,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#cbd5e1",
                      fontSize: 13,
                    }}
                  >
                    {interview.type}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  onClick={() =>
                    navigate(`/applicant/interviews/details/${interview.id}`)
                  }
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    "&:hover": {
                      background: "linear-gradient(135deg,#5859e8,#7c3aed)",
                    },
                  }}
                >
                  View Interview Details
                </Button>
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* ================= UPCOMING ================= */}

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          mt: 3,
          p: 3,
          borderRadius: 3,
          bgcolor: "#0e1a2b",
          border: "1px solid #24334a",
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Upcoming Interviews
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontSize: 13,
            mb: 2.5,
          }}
        >
          Your scheduled interviews at a glance.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {interviews.map((interview) => (
            <Box
              key={`${interview.company}-${interview.date}`}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#111c31",
                border: "1px solid #24334a",
              }}
            >
              <Typography
                sx={{
                  color: "#a78bfa",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {interview.date}
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  mt: 0.7,
                }}
              >
                {interview.role}
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 12,
                  mt: 0.3,
                }}
              >
                {interview.company}
              </Typography>

              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 12,
                  mt: 1.2,
                }}
              >
                {interview.time}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default InterviewCalendar;
