// import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
// import { alpha } from '@mui/material/styles'
// //import { useTheme } from '@mui/material/styles'
// import { FiArrowRight } from 'react-icons/fi'

// const applications = [
//   {
//     id: 1,
//     name: 'Priya Sharma',
//     role: 'Senior Frontend Engineer',
//     initials: 'PS',
//     color: '#f43f5e',
//     time: '2 hours ago',
//     status: 'Interview',
//     statusColor: '#9333ea',
//   },
//   {
//     id: 2,
//     name: 'Arjun Mehta',
//     role: 'Product Designer',
//     initials: 'AM',
//     color: '#3b82f6',
//     time: '5 hours ago',
//     status: 'Shortlisted',
//     statusColor: '#f59e0b',
//   },
//   {
//     id: 3,
//     name: 'Sneha Patel',
//     role: 'Backend Developer',
//     initials: 'SP',
//     color: '#10b981',
//     time: '1 day ago',
//     status: 'Applied',
//     statusColor: '#64748b',
//   },
//   {
//     id: 4,
//     name: 'Rahul Verma',
//     role: 'DevOps Engineer',
//     initials: 'RV',
//     color: '#f97316',
//     time: '1 day ago',
//     status: 'Offer',
//     statusColor: '#10b981',
//   },
//   {
//     id: 5,
//     name: 'Ananya Iyer',
//     role: 'Data Analyst',
//     initials: 'AI',
//     color: '#8b5cf6',
//     time: '2 days ago',
//     status: 'Applied',
//     statusColor: '#64748b',
//   },
// ]

// const RecentApplications = () => {
//   //const theme = useTheme()

//   return (
//     <Box
//       sx={{
//         bgcolor: 'background.paper',
//         border: '1px solid',
//         borderColor: 'divider',
//         borderRadius: 3,
//         overflow: 'hidden',
//       }}
//     >
//       {/* Header */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           gap: 2,
//           px: {
//             xs: 2,
//             sm: 3,
//             md: 4,
//           },
//           py: 3,
//           borderBottom: '1px solid',
//           borderColor: 'divider',
//         }}
//       >
//         <Box>
//           <Typography
//             variant="h5"
//             sx={{
//               fontWeight: 700,
//               color: 'text.primary',
//             }}
//           >
//             Recent Applications
//           </Typography>

//           <Typography
//             sx={{
//               color: 'text.secondary',
//               mt: 0.5,
//             }}
//           >
//             Latest candidate submissions
//           </Typography>
//         </Box>

//         <Box
//           component="button"
//           sx={{
//             border: 0,
//             background: 'none',
//             display: 'flex',
//             alignItems: 'center',
//             gap: 1,
//             color: 'primary.main',
//             fontWeight: 600,
//             cursor: 'pointer',
//             whiteSpace: 'nowrap',

//             '&:hover': {
//               opacity: 0.8,
//             },
//           }}
//         >
//           View all
//           <FiArrowRight />
//         </Box>
//       </Box>

//       {/* Applications */}
//       {applications.map((candidate) => (
//         <Box
//           key={candidate.id}
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: {
//               xs: 1.5,
//               sm: 2.5,
//             },

//             px: {
//               xs: 2,
//               sm: 3,
//               md: 4,
//             },

//             py: 2.5,

//             borderBottom: '1px solid',
//             borderColor: 'divider',

//             '&:last-child': {
//               borderBottom: 0,
//             },

//             '&:hover': {
//               bgcolor: 'action.hover',
//             },
//           }}
//         >
//           {/* Avatar */}
//           <Box
//             sx={{
//               width: {
//                 xs: 44,
//                 sm: 56,
//               },
//               height: {
//                 xs: 44,
//                 sm: 56,
//               },

//               borderRadius: '50%',
//               bgcolor: candidate.color,
//               color: '#fff',

//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',

//               fontWeight: 700,
//               flexShrink: 0,
//             }}
//           >
//             {candidate.initials}
//           </Box>

//           {/* Candidate */}
//           <Box
//             sx={{
//               minWidth: 0,
//               flex: 1,
//             }}
//           >
//             <Typography
//               sx={{
//                 color: 'text.primary',
//                 fontWeight: 600,
//                 fontSize: {
//                   xs: '0.95rem',
//                   sm: '1rem',
//                 },
//                 whiteSpace: 'nowrap',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//               }}
//             >
//               {candidate.name}
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{
//                 color: 'text.secondary',
//                 mt: 0.5,
//                 whiteSpace: 'nowrap',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//               }}
//             >
//               {candidate.role}
//             </Typography>
//           </Box>

//           {/* Time */}
//           <Typography
//             variant="body2"
//             sx={{
//               color: 'text.secondary',
//               whiteSpace: 'nowrap',
//               display: {
//                 xs: 'none',
//                 md: 'block',
//               },
//             }}
//           >
//             {candidate.time}
//           </Typography>

//           {/* Status */}
//           <Box
//             sx={{
//               px: 1.5,
//               py: 0.75,
//               borderRadius: 2,

//               bgcolor: alpha(candidate.statusColor, 0.12),
//               color: candidate.statusColor,

//               fontSize: '0.8rem',
//               fontWeight: 600,
//               whiteSpace: 'nowrap',
//             }}
//           >
//             {candidate.status}
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   )
// }

// export default RecentApplications

import { useEffect } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { alpha } from '@mui/material/styles'
//import { useTheme } from '@mui/material/styles'
import { FiArrowRight } from 'react-icons/fi'

import useCandidate from '../../../hooks/useCandidate'

// Cycled through for each candidate's avatar, same palette as the old mock data
const avatarColors = [
  '#f43f5e',
  '#3b82f6',
  '#10b981',
  '#f97316',
  '#8b5cf6',
]

// Candidate.status enum (backend): applied, screening, shortlisted,
// interview, selected, offered, hired, rejected
const statusColors = {
  applied: '#64748b',
  screening: '#0ea5e9',
  shortlisted: '#f59e0b',
  interview: '#9333ea',
  selected: '#10b981',
  offered: '#10b981',
  hired: '#10b981',
  rejected: '#f43f5e',
}

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return '?'

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const formatStatusLabel = (status = '') =>
  status.charAt(0).toUpperCase() + status.slice(1)

const formatTimeAgo = (dateString) => {
  if (!dateString) return ''

  const then = new Date(dateString).getTime()

  if (Number.isNaN(then)) return ''

  const seconds = Math.floor((Date.now() - then) / 1000)

  if (seconds < 60) return 'Just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`

  const years = Math.floor(months / 12)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

const RecentApplications = () => {
  //const theme = useTheme()

  const { candidates, loading, error, fetchCandidates } = useCandidate()

  useEffect(() => {
    fetchCandidates().catch(() => {})
  }, [fetchCandidates])

  // Backend already sorts by createdAt desc, so this is already "most
  // recent first" — just cap it to the 5 shown on the mock version.
  const recentCandidates = candidates.slice(0, 5)

  const applications = recentCandidates.map((candidate, index) => {
    const name = candidate.applicantId?.name || 'Unknown candidate'
    const status = candidate.status || 'applied'

    return {
      id: candidate._id,
      name,
      role: candidate.jobId?.title || 'Unknown position',
      initials: getInitials(name),
      color: avatarColors[index % avatarColors.length],
      time: formatTimeAgo(candidate.createdAt),
      status: formatStatusLabel(status),
      statusColor: statusColors[status] || '#64748b',
    }
  })

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

      {/* Error state */}
      {error && (
        <Typography
          variant="body2"
          sx={{ color: 'error.main', px: 4, py: 2 }}
        >
          {error}
        </Typography>
      )}

      {/* Loading state */}
      {loading &&
        Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              px: {
                xs: 2,
                sm: 3,
                md: 4,
              },
              py: 2.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Skeleton variant="rounded" height={56} />
          </Box>
        ))}

      {/* Empty state */}
      {!loading && !error && applications.length === 0 && (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', px: 4, py: 3 }}
        >
          No applications yet.
        </Typography>
      )}

      {/* Applications */}
      {!loading &&
        applications.map((candidate) => (
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