
// import React from 'react';
// import {
//   Box,
//   Card,
//   Typography,
//   useTheme,
// } from '@mui/material';

// import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
// import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
// import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
// import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';

// const statsData = [
//   {
//     label: 'Applied',
//     value: 7,
//     icon: <WorkOutlineRoundedIcon />,
//     iconColor: '#2563eb',
//     bgColor: 'rgba(37, 99, 235, 0.08)',
//     extra: '+3 this week',
//   },
//   {
//     label: 'Shortlisted',
//     value: 3,
//     icon: <CheckCircleOutlineRoundedIcon />,
//     iconColor: '#db2777',
//     bgColor: 'rgba(219, 39, 119, 0.08)',
//   },
//   {
//     label: 'Interviews',
//     value: 2,
//     icon: <GroupsOutlinedIcon />,
//     iconColor: '#d97706',
//     bgColor: 'rgba(217, 119, 6, 0.08)',
//   },
//   {
//     label: 'Saved Jobs',
//     value: 8,
//     icon: <BookmarkBorderRoundedIcon />,
//     iconColor: '#059669',
//     bgColor: 'rgba(5, 150, 105, 0.08)',
//   },
// ];

// const StatsRow = () => {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';

//   return (
//     <Box
//       sx={{
//         display: 'grid',
//         gridTemplateColumns: {
//           xs: '1fr',
//           sm: 'repeat(2, 1fr)',
//           md: 'repeat(4, 1fr)',
//         },
//         gap: 2.5,
//         width: '100%',
//       }}
//     >
//       {statsData.map((stat) => (
//         <Card
//           key={stat.label}
//           elevation={0}
//           sx={{
//             position: 'relative',
//             overflow: 'hidden',
//             minHeight: 225,
//             borderRadius: 3,

//             border: `1px solid ${theme.palette.divider}`,

//             backgroundColor: theme.palette.background.paper,

//             boxShadow: isDark
//               ? '0 2px 6px rgba(0, 0, 0, 0.25)'
//               : '0 2px 6px rgba(15, 23, 42, 0.08)',

//             p: 3,
//             transition: 'all 0.2s ease',

//         '&:hover': {
//           boxShadow: 3,
//           transform: 'translateY(-2px)',
//         },
//           }}
//         >
//           {/* Decorative circle */}
//           <Box
//             sx={{
//               position: 'absolute',
//               width: 145,
//               height: 145,
//               borderRadius: '50%',
//               backgroundColor: stat.bgColor,
//               top: -22,
//               right: -22,
//             }}
//           />

//           {/* Icon */}
//           <Box
//             sx={{
//               position: 'relative',
//               zIndex: 1,
//               width: 66,
//               height: 66,
//               borderRadius: '50%',
//               backgroundColor: stat.iconColor,

//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',

//               color: '#fff',
//               mb: 2,

//               boxShadow: `0 5px 12px ${stat.iconColor}40`,
//             }}
//           >
//             {React.cloneElement(stat.icon, {
//               sx: {
//                 fontSize: 34,
//               },
//             })}
//           </Box>

//           {/* Extra badge */}
//           {stat.extra && (
//             <Box
//               sx={{
//                 position: 'absolute',
//                 top: 45,
//                 left: 98,
//                 zIndex: 2,

//                 px: 1.25,
//                 py: 0.6,
//                 borderRadius: 3,

//                 backgroundColor: isDark
//                   ? 'rgba(14, 116, 144, 0.20)'
//                   : '#e0f2fe',

//                 color: theme.palette.success.main,

//                 fontSize: '0.9rem',
//                 fontWeight: 600,
//                 whiteSpace: 'nowrap',
//               }}
//             >
//               {stat.extra}
//             </Box>
//           )}

//           {/* Value */}
//           <Typography
//             sx={{
//               position: 'relative',
//               zIndex: 1,

//               fontSize: '2.2rem',
//               lineHeight: 1,
//               fontWeight: 700,

//               color: theme.palette.text.primary,

//               mb: 0.75,
//             }}
//           >
//             {stat.value}
//           </Typography>

//           {/* Label */}
//           <Typography
//             sx={{
//               position: 'relative',
//               zIndex: 1,

//               fontSize: '1.25rem',

//               color: theme.palette.text.secondary,

//               fontWeight: 500,
//             }}
//           >
//             {stat.label}
//           </Typography>
//         </Card>
//       ))}
//     </Box>
//   );
// };

// export default StatsRow;


import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Skeleton,
  useTheme,
} from '@mui/material';

import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';

import { useApplication } from '../../../hooks/useApplication';
import useInterview from '../../../hooks/useInterview';

const StatsRow = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Same ApplicationContext/InterviewContext already used elsewhere.
  // useInterview() auto-fetches "my interviews" on mount.
  const {
    applications,
    loading: applicationsLoading,
    error: applicationsError,
    fetchMyApplications,
  } = useApplication();

  const {
    interviews,
    loading: interviewsLoading,
    error: interviewsError,
  } = useInterview();

  useEffect(() => {
    fetchMyApplications().catch(() => {});
  }, [fetchMyApplications]);

  const loading = applicationsLoading || interviewsLoading;
  const error = applicationsError || interviewsError;

  // Applications with status still "applied" this week — mirrors the
  // thisWeekCount pattern already used in useInterview.js.
  const appliedThisWeek = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return applications.filter((application) => {
      const createdAt = new Date(application.createdAt);
      return createdAt >= startOfWeek;
    }).length;
  }, [applications]);

  const shortlistedCount = useMemo(
    () =>
      applications.filter(
        (application) => application.status === 'shortlisted'
      ).length,
    [applications]
  );

  const statsData = [
    {
      label: 'Applied',
      value: applications.length,
      icon: <WorkOutlineRoundedIcon />,
      iconColor: '#2563eb',
      bgColor: 'rgba(37, 99, 235, 0.08)',
      extra: appliedThisWeek > 0 ? `+${appliedThisWeek} this week` : null,
    },
    {
      label: 'Shortlisted',
      value: shortlistedCount,
      icon: <CheckCircleOutlineRoundedIcon />,
      iconColor: '#db2777',
      bgColor: 'rgba(219, 39, 119, 0.08)',
    },
    {
      label: 'Interviews',
      value: interviews.length,
      icon: <GroupsOutlinedIcon />,
      iconColor: '#d97706',
      bgColor: 'rgba(217, 119, 6, 0.08)',
    },
    {
      // NOTE: there is no "saved jobs" model/endpoint in the backend yet,
      // so this can't be wired to real data. Shown as 0 until that exists.
      label: 'Saved Jobs',
      value: 0,
      icon: <BookmarkBorderRoundedIcon />,
      iconColor: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.08)',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 2.5,
        width: '100%',
      }}
    >
      {error && (
        <Typography
          variant="body2"
          sx={{ color: 'error.main', gridColumn: '1 / -1' }}
        >
          {error}
        </Typography>
      )}

      {loading
        ? statsData.map((stat) => (
            <Skeleton
              key={stat.label}
              variant="rounded"
              height={225}
              sx={{ borderRadius: 3 }}
            />
          ))
        : statsData.map((stat) => (
            <Card
              key={stat.label}
              elevation={0}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: 225,
                borderRadius: 3,

                border: `1px solid ${theme.palette.divider}`,

                backgroundColor: theme.palette.background.paper,

                boxShadow: isDark
                  ? '0 2px 6px rgba(0, 0, 0, 0.25)'
                  : '0 2px 6px rgba(15, 23, 42, 0.08)',

                p: 3,
                transition: 'all 0.2s ease',

                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {/* Decorative circle */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 145,
                  height: 145,
                  borderRadius: '50%',
                  backgroundColor: stat.bgColor,
                  top: -22,
                  right: -22,
                }}
              />

              {/* Icon */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: 66,
                  height: 66,
                  borderRadius: '50%',
                  backgroundColor: stat.iconColor,

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  color: '#fff',
                  mb: 2,

                  boxShadow: `0 5px 12px ${stat.iconColor}40`,
                }}
              >
                {React.cloneElement(stat.icon, {
                  sx: {
                    fontSize: 34,
                  },
                })}
              </Box>

              {/* Extra badge */}
              {stat.extra && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 45,
                    left: 98,
                    zIndex: 2,

                    px: 1.25,
                    py: 0.6,
                    borderRadius: 3,

                    backgroundColor: isDark
                      ? 'rgba(14, 116, 144, 0.20)'
                      : '#e0f2fe',

                    color: theme.palette.success.main,

                    fontSize: '0.9rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stat.extra}
                </Box>
              )}

              {/* Value */}
              <Typography
                sx={{
                  position: 'relative',
                  zIndex: 1,

                  fontSize: '2.2rem',
                  lineHeight: 1,
                  fontWeight: 700,

                  color: theme.palette.text.primary,

                  mb: 0.75,
                }}
              >
                {stat.value}
              </Typography>

              {/* Label */}
              <Typography
                sx={{
                  position: 'relative',
                  zIndex: 1,

                  fontSize: '1.25rem',

                  color: theme.palette.text.secondary,

                  fontWeight: 500,
                }}
              >
                {stat.label}
              </Typography>
            </Card>
          ))}
    </Box>
  );
};

export default StatsRow;