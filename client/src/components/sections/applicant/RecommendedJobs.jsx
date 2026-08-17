
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button,
  Chip,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

const getInitials = (company) => {
  if (!company) return '';

  return company
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export default function RecommendedJobs({ jobs = [] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isDark = theme.palette.mode === 'dark';

  // Theme-aware colors
  const colors = {
    cardBackground: theme.palette.background.paper,
    surface: theme.palette.background.surface || theme.palette.background.default,
    primaryText: theme.palette.text.primary,
    secondaryText: theme.palette.text.secondary,
    divider: theme.palette.divider,
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
    chipBackground: isDark ? '#273449' : '#f1f5f9',
    hoverBackground: isDark ? '#263449' : '#f8fafc',
    progressBackground: isDark ? '#334155' : '#edf2f7',
    iconMuted: isDark ? '#94a3b8' : '#94a3b8',
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.divider}`,
        boxShadow: 'none',
        color: colors.primaryText,
       
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
            justifyContent: 'space-between',
            mb: 2,
            pl: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <TrendingUpOutlinedIcon
              sx={{
                color: colors.primary,
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
              Recommended Jobs
            </Typography>
          </Box>

          <Button
            size="small"
            endIcon={<ArrowForwardOutlinedIcon />}
            sx={{
              color: colors.primary,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 'auto',
              fontSize: '0.95rem',

              '&:hover': {
                backgroundColor: isDark
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(59, 130, 246, 0.08)',
              },
            }}
          >
            View all
          </Button>
        </Box>

        {/* Jobs */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            flex: 1,
          }}
        >
          {jobs.slice(0, isMobile ? 2 : 3).map((job, index) => (
            <Box key={job.id}>
              {index > 0 && (
                <Divider
                  sx={{
                    mb: 1.5,
                    borderColor: colors.divider,
                  }}
                />
              )}

              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                  p: 3,
                  borderRadius: 2,
                  cursor: 'pointer',
                  //transition: 'background-color 0.15s',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: colors.hoverBackground,
                     boxShadow: 3,
                    transform: 'translateY(-2px)',
                    
                  },
                  

        
                }}
              >
                {/* Company Logo */}
                <Box
                  sx={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    backgroundColor: job.logo_color || colors.primary,

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',

                    flexShrink: 0,
                  }}
                >
                  {getInitials(job.company)}
                </Box>

                {/* Job Information */}
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
                    {job.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.secondaryText,
                      mb: 1,
                      fontSize: '0.9rem',
                    }}
                  >
                    {job.company}
                  </Typography>

                  {/* Location + Job Type */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.75,
                      flexWrap: 'wrap',
                      mb: 1.5,
                    }}
                  >
                    <Chip
                      icon={
                        <LocationOnOutlinedIcon
                          sx={{
                            fontSize: '15px !important',
                          }}
                        />
                      }
                      label={job.location}
                      size="small"
                      sx={{
                        height: 28,
                        backgroundColor: colors.chipBackground,
                        color: colors.secondaryText,
                        fontWeight: 500,

                        '& .MuiChip-icon': {
                          color: colors.iconMuted,
                        },

                        '&:hover': {
                          backgroundColor: colors.hoverBackground,
                        },
                      }}
                    />

                    <Chip
                      icon={
                        <AccessTimeOutlinedIcon
                          sx={{
                            fontSize: '15px !important',
                          }}
                        />
                      }
                      label={job.job_type}
                      size="small"
                      sx={{
                        height: 28,
                        backgroundColor: colors.chipBackground,
                        color: colors.secondaryText,
                        fontWeight: 500,

                        '& .MuiChip-icon': {
                          color: colors.iconMuted,
                        },

                        '&:hover': {
                          backgroundColor: colors.hoverBackground,
                        },
                      }}
                    />
                  </Box>

                  {/* Match Score */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={job.match_score}
                      sx={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: colors.progressBackground,

                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(
                            90deg,
                            ${theme.palette.success.main},
                            #34d399
                          )`,
                        },
                      }}
                    />

                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: colors.success,
                        minWidth: 35,
                        fontSize: '0.95rem',
                      }}
                    >
                      {job.match_score}%
                    </Typography>
                  </Box>
                </Box>

                {/* Bookmark */}
                <IconButton
                  size="small"
                  sx={{
                    color: colors.secondaryText,
                    flexShrink: 0,

                    '&:hover': {
                      color: colors.primary,
                      backgroundColor: isDark
                        ? 'rgba(59, 130, 246, 0.12)'
                        : 'rgba(59, 130, 246, 0.08)',
                    },
                  }}
                >
                  <BookmarkBorderOutlinedIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}