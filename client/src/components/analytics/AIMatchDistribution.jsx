import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';

export default function AIMatchDistribution({ data }) {
  const theme = useTheme();

  const chartData = data.map((d) => ({
    name: d.name,
    value: d.value,
    fill: d.color,
  }));

  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            mb: 0.5,
            color: 'text.primary',
            fontWeight: 600,
          }}
        >
          AI Candidate Matching
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Match quality distribution
        </Typography>

        {/* Radial Chart */}
        <Box
          sx={{
            width: '100%',
            height: 200,
          }}
        >
          <ResponsiveContainer>
            <RadialBarChart
              innerRadius="35%"
              outerRadius="100%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 50]}
                tick={false}
              />

              <RadialBar
                background={{
                  fill:
                    theme.palette.mode === 'dark'
                      ? '#314057'
                      : '#e2e8f0',
                }}
                dataKey="value"
                cornerRadius={8}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mt: 2,
          }}
        >
          {data.map((item) => (
            <Box
              key={item.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Label */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: item.color,
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {item.name}
                </Typography>
              </Box>

              {/* Percentage */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {item.value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}




