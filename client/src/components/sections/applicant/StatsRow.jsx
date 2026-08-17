
import React from 'react';
import {
  Box,
  Card,
  Typography,
  useTheme,
} from '@mui/material';

import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';

const statsData = [
  {
    label: 'Applied',
    value: 7,
    icon: <WorkOutlineRoundedIcon />,
    iconColor: '#2563eb',
    bgColor: 'rgba(37, 99, 235, 0.08)',
    extra: '+3 this week',
  },
  {
    label: 'Shortlisted',
    value: 3,
    icon: <CheckCircleOutlineRoundedIcon />,
    iconColor: '#db2777',
    bgColor: 'rgba(219, 39, 119, 0.08)',
  },
  {
    label: 'Interviews',
    value: 2,
    icon: <GroupsOutlinedIcon />,
    iconColor: '#d97706',
    bgColor: 'rgba(217, 119, 6, 0.08)',
  },
  {
    label: 'Saved Jobs',
    value: 8,
    icon: <BookmarkBorderRoundedIcon />,
    iconColor: '#059669',
    bgColor: 'rgba(5, 150, 105, 0.08)',
  },
];

const StatsRow = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
      {statsData.map((stat) => (
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