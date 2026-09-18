

import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function CandidatePipeline({ data }) {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const textColor = theme.palette.text.secondary;

  const gridColor = isDark
    ? "#475569"
    : "#e2e8f0";

  const tooltipBg = isDark
    ? "#1e293b"
    : "#ffffff";

  const tooltipBorder = theme.palette.divider;

  const cursorColor = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(15,23,42,0.04)";

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
          Candidate Pipeline
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Candidates at each recruitment stage
        </Typography>

        {/* Chart */}
        <Box
          sx={{
            width: "100%",
            height: 300,
          }}
        >
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              {/* Grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />

              {/* X Axis */}
              <XAxis
                dataKey="stage"
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
                cursor={{
                  fill: cursorColor,
                }}
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

              {/* Bars */}
              <Bar
                dataKey="value"
                name="Candidates"
                radius={[6, 6, 0, 0]}
                maxBarSize={56}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}