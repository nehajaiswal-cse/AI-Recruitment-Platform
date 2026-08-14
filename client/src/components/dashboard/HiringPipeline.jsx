import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'

const pipelineData = [
  {
    id: 'applied',
    title: 'Applied',
    count: 154,
    percentage: 55,
    color: '#3b82f6',
  },
  {
    id: 'shortlisted',
    title: 'Shortlisted',
    count: 62,
    percentage: 22,
    color: '#f59e0b',
  },
  {
    id: 'interview',
    title: 'Interview',
    count: 18,
    percentage: 6,
    color: '#9333ea',
  },
  {
    id: 'selected',
    title: 'Selected',
    count: 6,
    percentage: 2,
    color: '#10b981',
  },
  {
    id: 'rejected',
    title: 'Rejected',
    count: 41,
    percentage: 15,
    color: '#f43f5e',
  },
]

const HiringPipeline = () => {
  //const theme = useTheme()

  const totalCandidates = pipelineData.reduce(
    (total, stage) => total + stage.count,
    0
  )

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
          alignItems: {
            xs: 'flex-start',
            sm: 'center',
          },
          justifyContent: 'space-between',
          gap: 2,
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
            Hiring Pipeline
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 0.5,
            }}
          >
            {totalCandidates} total candidates
          </Typography>
        </Box>

        <Box
          component={Link}
          to="/recruiter/pipeline"
          sx={{
            color: 'primary.main',
            fontSize: '0.95rem',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',

            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          View all
        </Box>
      </Box>

      {/* Pipeline Progress Bar */}
      <Box
        sx={{
          display: 'flex',
          height: 20,
          overflow: 'hidden',
          borderRadius: 999,
          mt: 4,
          mb: 4,
          bgcolor: 'action.hover',
        }}
      >
        {pipelineData.map((stage) => (
          <Box
            key={stage.id}
            sx={{
              width: `${stage.percentage}%`,
              bgcolor: stage.color,
              transition: 'width 0.3s ease',
            }}
          />
        ))}
      </Box>

      {/* Pipeline Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {pipelineData.map((stage) => (
          <Box
            key={stage.id}
            sx={{
              bgcolor: alpha(stage.color, 0.10),
              border: '1px solid',
              borderColor: alpha(stage.color, 0.20),
              borderRadius: 3,
              p: 3,
              minHeight: 165,

              transition: 'all 0.2s ease',

              '&:hover': {
                bgcolor: alpha(stage.color, 0.15),
                transform: 'translateY(-2px)',
              },
            }}
          >
            {/* Title */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: stage.color,
                  flexShrink: 0,
                }}
              />

              <Typography
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {stage.title}
              </Typography>
            </Box>

            {/* Count */}
            <Typography
              sx={{
                color: stage.color,
                fontSize: '2.25rem',
                fontWeight: 700,
                mt: 2,
              }}
            >
              {stage.count}
            </Typography>

            {/* Percentage */}
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 0.5,
              }}
            >
              {stage.percentage}% of total
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default HiringPipeline