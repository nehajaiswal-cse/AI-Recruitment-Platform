import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
//import { useTheme } from '@mui/material/styles'
import { FiArrowRight } from 'react-icons/fi'

const applications = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Senior Frontend Engineer',
    initials: 'PS',
    color: '#f43f5e',
    time: '2 hours ago',
    status: 'Interview',
    statusColor: '#9333ea',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    role: 'Product Designer',
    initials: 'AM',
    color: '#3b82f6',
    time: '5 hours ago',
    status: 'Shortlisted',
    statusColor: '#f59e0b',
  },
  {
    id: 3,
    name: 'Sneha Patel',
    role: 'Backend Developer',
    initials: 'SP',
    color: '#10b981',
    time: '1 day ago',
    status: 'Applied',
    statusColor: '#64748b',
  },
  {
    id: 4,
    name: 'Rahul Verma',
    role: 'DevOps Engineer',
    initials: 'RV',
    color: '#f97316',
    time: '1 day ago',
    status: 'Offer',
    statusColor: '#10b981',
  },
  {
    id: 5,
    name: 'Ananya Iyer',
    role: 'Data Analyst',
    initials: 'AI',
    color: '#8b5cf6',
    time: '2 days ago',
    status: 'Applied',
    statusColor: '#64748b',
  },
]

const RecentApplications = () => {
  //const theme = useTheme()

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          py: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
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
            Recent Applications
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              mt: 0.5,
            }}
          >
            Latest candidate submissions
          </Typography>
        </Box>

        <Box
          component="button"
          sx={{
            border: 0,
            background: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'primary.main',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',

            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          View all
          <FiArrowRight />
        </Box>
      </Box>

      {/* Applications */}
      {applications.map((candidate) => (
        <Box
          key={candidate.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: {
              xs: 1.5,
              sm: 2.5,
            },

            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },

            py: 2.5,

            borderBottom: '1px solid',
            borderColor: 'divider',

            '&:last-child': {
              borderBottom: 0,
            },

            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {/* Avatar */}
          <Box
            sx={{
              width: {
                xs: 44,
                sm: 56,
              },
              height: {
                xs: 44,
                sm: 56,
              },

              borderRadius: '50%',
              bgcolor: candidate.color,
              color: '#fff',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {candidate.initials}
          </Box>

          {/* Candidate */}
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                fontSize: {
                  xs: '0.95rem',
                  sm: '1rem',
                },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {candidate.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 0.5,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {candidate.role}
            </Typography>
          </Box>

          {/* Time */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              display: {
                xs: 'none',
                md: 'block',
              },
            }}
          >
            {candidate.time}
          </Typography>

          {/* Status */}
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 2,

              bgcolor: alpha(candidate.statusColor, 0.12),
              color: candidate.statusColor,

              fontSize: '0.8rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {candidate.status}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default RecentApplications