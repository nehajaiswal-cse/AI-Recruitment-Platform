

import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from "@mui/material";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ApplicationOverview({ data }) {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const textColor = theme.palette.text.secondary;
  const gridColor = isDark ? "#475569" : "#e2e8f0";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = theme.palette.divider;

  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "background.paper",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            mb: 0.5,
            color: "text.primary",
            fontWeight: 600,
          }}
        >
          Application Overview
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Monthly recruitment activity over the last 6 months
        </Typography>

        {/* Chart */}
        <Box
          sx={{
            width: "100%",
            height: 300,
          }}
        >
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              {/* Gradients */}
              <defs>
                <linearGradient
                  id="colorApps"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#4f46e5"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="#4f46e5"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="colorShort"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#d97706"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#d97706"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="colorHired"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#059669"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#059669"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              {/* Grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />

              {/* X Axis */}
              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 12,
                  fill: textColor,
                }}
                axisLine={false}
                tickLine={false}
              />

              {/* Y Axis */}
              <YAxis
                tick={{
                  fontSize: 12,
                  fill: textColor,
                }}
                axisLine={false}
                tickLine={false}
              />

              {/* Tooltip */}
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${tooltipBorder}`,
                  backgroundColor: tooltipBg,
                  color: theme.palette.text.primary,
                  boxShadow: isDark
                    ? "0 4px 16px rgba(0,0,0,0.35)"
                    : "0 4px 16px rgba(0,0,0,0.08)",
                  fontSize: 13,
                }}
                labelStyle={{
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: theme.palette.text.primary,
                }}
              />

              {/* Legend */}
              <Legend
                wrapperStyle={{
                  fontSize: 13,
                  paddingTop: 10,
                  color: theme.palette.text.secondary,
                }}
              />

              {/* Applications */}
              <Area
                type="monotone"
                dataKey="applications"
                name="Applications"
                stroke="#4f46e5"
                strokeWidth={2}
                fill="url(#colorApps)"
              />

              {/* Shortlisted */}
              <Area
                type="monotone"
                dataKey="shortlisted"
                name="Shortlisted"
                stroke="#d97706"
                strokeWidth={2}
                fill="url(#colorShort)"
              />

              {/* Hired */}
              <Area
                type="monotone"
                dataKey="hired"
                name="Hired"
                stroke="#059669"
                strokeWidth={2}
                fill="url(#colorHired)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
