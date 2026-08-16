
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined';

const getInitials = (company) => {
  if (!company) return '';

  return company
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (date) => {
  const formattedDate = new Date(date);

  return formattedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export default function UpcomingInterviews({ interviews = [] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  

  const colors = {
  primaryText: theme.palette.text.primary,
  secondaryText: theme.palette.text.secondary,
  divider: theme.palette.divider,

  accent: theme.palette.secondary.main,

  // Interview card
  interviewBackground: isDark ? '#211b38' : '#faf5ff',
  interviewBorder: isDark ? '#3f3566' : '#e9d5ff',

  // Chips
  chipBackground: isDark ? '#1e2a4a' : '#eff6ff',
  chipText: isDark ? '#93c5fd' : '#2563eb',
  chipIcon: isDark ? '#60a5fa' : '#3b82f6',

  // Button
  buttonGradient: 'linear-gradient(135deg, #3b82f6, #9333ea)',
  buttonHoverGradient: 'linear-gradient(135deg, #2563eb, #7e22ce)',
};


  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${colors.divider}`,
        boxShadow: 'none',
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          pb: 1,
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            pl: 2,
          }}
        >
          <VideoCameraFrontOutlinedIcon
            sx={{
              color: colors.accent,
              fontSize: 24,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: colors.primaryText,
            }}
          >
            Upcoming Interviews
          </Typography>
        </Box>

        {/* Interviews */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            flex: 1,
          }}
        >
          {interviews.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: colors.secondaryText,
                }}
              >
                No upcoming interviews
              </Typography>
            </Box>
          )}

          {interviews.slice(0, 2).map((interview, index) => (
            <Box key={interview.id}>
              {index > 0 && (
                <Divider
                  sx={{
                    mb: 2,
                    borderColor: colors.divider,
                  }}
                />
              )}

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,

                  backgroundColor: colors.interviewBackground,
                  border: `1px solid ${colors.interviewBorder}`,
                }}
              >
                {/* Company + Position */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  {/* Company Logo */}
                  <Box
                    sx={{
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      backgroundColor:
                        interview.logo_color || theme.palette.primary.main,

                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',

                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '1rem',

                      flexShrink: 0,
                    }}
                  >
                    {getInitials(interview.company)}
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        lineHeight: 1.3,
                        mb: 0.25,
                        color: colors.primaryText,
                      }}
                    >
                      {interview.position}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.secondaryText,
                        fontSize: '0.9rem',
                      }}
                    >
                      {interview.company}
                    </Typography>
                  </Box>
                </Box>

                {/* Date + Time */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.75,
                    flexWrap: 'wrap',
                    mb: 1.75,
                  }}
                >
                  <Chip
                    icon={
                      <CalendarMonthOutlinedIcon
                        sx={{
                          fontSize: '16px !important',
                        }}
                      />
                    }
                    label={formatDate(interview.interview_date)}
                    size="small"
                    sx={{
                      height: 30,
                      backgroundColor: colors.chipBackground,
                      color: colors.chipText,
                      border: `1px solid ${colors.interviewBorder}`,
                      fontWeight: 600,

                      '& .MuiChip-icon': {
                        color: colors.chipIcon,
                      },

                      '&:hover': {
                        backgroundColor: colors.chipBackground,
                      },
                    }}
                  />

                  <Chip
                    icon={
                      <AccessTimeOutlinedIcon
                        sx={{
                          fontSize: '16px !important',
                        }}
                      />
                    }
                    label={interview.interview_time}
                    size="small"
                    sx={{
                      height: 30,
                      backgroundColor: colors.chipBackground,
                      color: colors.chipText,
                      border: `1px solid ${colors.interviewBorder}`,
                      fontWeight: 600,

                      '& .MuiChip-icon': {
                        color: colors.chipIcon,
                      },

                      '&:hover': {
                        backgroundColor: colors.chipBackground,
                      },
                    }}
                  />
                </Box>

                {/* Join Interview */}
                <Button
                  fullWidth
                  variant="contained"
                  size="medium"
                  startIcon={<VideoCameraFrontOutlinedIcon />}
                  component={interview.meeting_link ? 'a' : 'button'}
                  href={interview.meeting_link || undefined}
                  target={
                    interview.meeting_link ? '_blank' : undefined
                  }
                  rel={
                    interview.meeting_link
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderRadius: 3,
                    py: 1.1,

                    background: colors.buttonGradient,
                     
                    boxShadow: isDark
                      ? '0 2px 8px rgba(124,58,237,0.2)'
                      : '0 2px 8px rgba(124,58,237,0.3)',

                    '&:hover': {
                      background: colors.buttonHoverGradient,
                    },
                  }}
                >
                  Join Interview
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}