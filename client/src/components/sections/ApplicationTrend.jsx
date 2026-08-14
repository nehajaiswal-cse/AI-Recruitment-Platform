import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

const applicationData = [
  {
    month: 'Jan',
    applied: 42,
    shortlisted: 12,
    hired: 3,
  },
  {
    month: 'Feb',
    applied: 62,
    shortlisted: 18,
    hired: 5,
  },
  {
    month: 'Mar',
    applied: 58,
    shortlisted: 15,
    hired: 4,
  },
  {
    month: 'Apr',
    applied: 78,
    shortlisted: 22,
    hired: 7,
  },
  {
    month: 'May',
    applied: 95,
    shortlisted: 28,
    hired: 9,
  },
  {
    month: 'Jun',
    applied: 110,
    shortlisted: 32,
    hired: 11,
  },
  {
    month: 'Jul',
    applied: 98,
    shortlisted: 26,
    hired: 8,
  },
  {
    month: 'Aug',
    applied: 124,
    shortlisted: 35,
    hired: 14,
  },
]

const ApplicationTrend = () => {
  const theme = useTheme()

  const colors = {
    applied: '#3b82f6',
    shortlisted: '#f59e0b',
    hired: '#10b981',
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          alignItems: {
            xs: 'flex-start',
            md: 'center',
          },
          justifyContent: 'space-between',
          gap: 3,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Application Trend
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              mt: 0.5,
            }}
          >
            Monthly hiring overview
          </Typography>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          {[
            {
              label: 'Applied',
              color: colors.applied,
            },
            {
              label: 'Shortlisted',
              color: colors.shortlisted,
            },
            {
              label: 'Hired',
              color: colors.hired,
            },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: item.color,
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Chart */}
      <Box
        sx={{
          width: '100%',
          height: {
            xs: 280,
            sm: 320,
            md: 350,
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={applicationData}
            margin={{
              top: 10,
              right: 15,
              left: 0,
              bottom: 10,
            }}
          >
            {/* Gradients */}
            <defs>
              <linearGradient
                id="appliedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={colors.applied}
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor={colors.applied}
                  stopOpacity={0.02}
                />
              </linearGradient>

              <linearGradient
                id="shortlistedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={colors.shortlisted}
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor={colors.shortlisted}
                  stopOpacity={0.02}
                />
              </linearGradient>

              <linearGradient
                id="hiredGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={colors.hired}
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor={colors.hired}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid
              stroke={theme.palette.divider}
              strokeOpacity={1}
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme.palette.text.secondary,
                fontSize: 14,
              }}
            />

            {/* Y Axis */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme.palette.text.secondary,
                fontSize: 14,
              }}
              domain={[0, 125]}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '10px',
                color: theme.palette.text.primary,
              }}
              labelStyle={{
                color: theme.palette.text.primary,
              }}
              itemStyle={{
                color: theme.palette.text.secondary,
              }}
            />

            {/* Areas */}
            <Area
              type="monotone"
              dataKey="applied"
              stroke="none"
              fill="url(#appliedGradient)"
            />

            <Area
              type="monotone"
              dataKey="shortlisted"
              stroke="none"
              fill="url(#shortlistedGradient)"
            />

            <Area
              type="monotone"
              dataKey="hired"
              stroke="none"
              fill="url(#hiredGradient)"
            />

            {/* Applied */}
            <Line
              type="monotone"
              dataKey="applied"
              stroke={colors.applied}
              strokeWidth={3}
              dot={{
                r: 5,
                fill: theme.palette.background.paper,
                stroke: colors.applied,
                strokeWidth: 3,
              }}
              activeDot={{
                r: 7,
                fill: colors.applied,
                stroke: theme.palette.background.paper,
                strokeWidth: 2,
              }}
            />

            {/* Shortlisted */}
            <Line
              type="monotone"
              dataKey="shortlisted"
              stroke={colors.shortlisted}
              strokeWidth={3}
              dot={{
                r: 5,
                fill: theme.palette.background.paper,
                stroke: colors.shortlisted,
                strokeWidth: 3,
              }}
              activeDot={{
                r: 7,
                fill: colors.shortlisted,
                stroke: theme.palette.background.paper,
                strokeWidth: 2,
              }}
            />

            {/* Hired */}
            <Line
              type="monotone"
              dataKey="hired"
              stroke={colors.hired}
              strokeWidth={3}
              dot={{
                r: 5,
                fill: theme.palette.background.paper,
                stroke: colors.hired,
                strokeWidth: 3,
              }}
              activeDot={{
                r: 7,
                fill: colors.hired,
                stroke: theme.palette.background.paper,
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export default ApplicationTrend