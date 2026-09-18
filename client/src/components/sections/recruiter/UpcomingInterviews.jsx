
// import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
// import { alpha } from '@mui/material/styles'
// import { FiClock, FiVideo } from 'react-icons/fi'

// const interviews = [
//   {
//     id: 1,
//     name: 'Priya Sharma',
//     role: 'Senior Frontend Engineer',
//     initials: 'PS',
//     color: '#f43f5e',
//     date: 'Today',
//     time: '10:00 AM',
//     type: 'Technical Round',
//   },
//   {
//     id: 2,
//     name: 'Karthik Rao',
//     role: 'Product Manager',
//     initials: 'KR',
//     color: '#3b82f6',
//     date: 'Today',
//     time: '2:30 PM',
//     type: 'HR Round',
//   },
//   {
//     id: 3,
//     name: 'Meera Nair',
//     role: 'UX Researcher',
//     initials: 'MN',
//     color: '#10b981',
//     date: 'Tomorrow',
//     time: '11:00 AM',
//     type: 'Portfolio Review',
//   },
//   {
//     id: 4,
//     name: 'Vikram Singh',
//     role: 'Full Stack Developer',
//     initials: 'VS',
//     color: '#f97316',
//     date: 'Tomorrow',
//     time: '4:00 PM',
//     type: 'Technical Round',
//   },
// ]

// const UpcomingInterviews = () => {
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
//         <Typography
//           variant="h5"
//           sx={{
//             fontWeight: 700,
//             color: 'text.primary',
//           }}
//         >
//           Upcoming Interviews
//         </Typography>

//         <Typography
//           sx={{
//             color: 'text.secondary',
//             mt: 0.5,
//           }}
//         >
//           Scheduled sessions
//         </Typography>
//       </Box>

//       {/* Interviews */}
//       {interviews.map((interview) => (
//         <Box
//           key={interview.id}
//           sx={{
//             px: {
//               xs: 2,
//               sm: 3,
//               md: 4,
//             },

//             py: 3,

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
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'flex-start',
//               gap: {
//                 xs: 1.5,
//                 sm: 2.5,
//               },
//             }}
//           >
//             {/* Avatar */}
//             <Box
//               sx={{
//                 width: {
//                   xs: 44,
//                   sm: 56,
//                 },
//                 height: {
//                   xs: 44,
//                   sm: 56,
//                 },

//                 borderRadius: '50%',
//                 bgcolor: interview.color,
//                 color: '#fff',

//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',

//                 fontWeight: 700,
//                 flexShrink: 0,
//               }}
//             >
//               {interview.initials}
//             </Box>

//             {/* Details */}
//             <Box
//               sx={{
//                 flex: 1,
//                 minWidth: 0,
//               }}
//             >
//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'flex-start',
//                   justifyContent: 'space-between',
//                   gap: 2,
//                 }}
//               >
//                 <Box sx={{ minWidth: 0 }}>
//                   <Typography
//                     sx={{
//                       color: 'text.primary',
//                       fontWeight: 600,
//                     }}
//                   >
//                     {interview.name}
//                   </Typography>

//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color: 'text.secondary',
//                       mt: 0.5,
//                     }}
//                   >
//                     {interview.role}
//                   </Typography>
//                 </Box>

//                 {/* Date */}
//                 <Box
//                   sx={{
//                     px: 1.5,
//                     py: 0.75,
//                     borderRadius: 2,

//                     bgcolor: alpha('#3b82f6', 0.12),
//                     color: '#3b82f6',

//                     fontSize: '0.8rem',
//                     fontWeight: 600,
//                     whiteSpace: 'nowrap',
//                     flexShrink: 0,
//                   }}
//                 >
//                   {interview.date}
//                 </Box>
//               </Box>

//               {/* Time + Type */}
//               <Box
//                 sx={{
//                   display: 'flex',
//                   flexWrap: 'wrap',
//                   alignItems: 'center',
//                   gap: {
//                     xs: 2,
//                     sm: 3,
//                   },

//                   mt: 2,

//                   color: 'text.secondary',
//                   fontSize: '0.9rem',
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 0.75,
//                   }}
//                 >
//                   <FiClock />
//                   <span>{interview.time}</span>
//                 </Box>

//                 <Box
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 0.75,
//                   }}
//                 >
//                   <FiVideo />
//                   <span>{interview.type}</span>
//                 </Box>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   )
// }

// export default UpcomingInterviews

import { useEffect, useMemo } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { alpha } from '@mui/material/styles'
import { FiClock, FiVideo } from 'react-icons/fi'

import { useInterviewContext } from '../../../context/InterviewContext'

// Cycled through for each interview's avatar, same palette as the old mock data
const avatarColors = [
  '#f43f5e',
  '#3b82f6',
  '#10b981',
  '#f97316',
]

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return '?'

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const getDateLabel = (dateString) => {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) return ''

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(date, today)) return 'Today'
  if (isSameDay(date, tomorrow)) return 'Tomorrow'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const UpcomingInterviews = () => {
  const { interviews, loading, error, fetchRecruiterInterviews } =
    useInterviewContext()

  useEffect(() => {
    fetchRecruiterInterviews().catch(() => {})
  }, [fetchRecruiterInterviews])

  // Backend already sorts by date ascending, so just filter out
  // past/cancelled/completed ones and cap it to the top 4 shown on the
  // mock version.
  const upcoming = useMemo(() => {
    const now = new Date()

    return interviews
      .filter((interview) => {
        const interviewDate = new Date(interview.date)

        return (
          interviewDate >= now &&
          interview.status !== 'Completed' &&
          interview.status !== 'Cancelled'
        )
      })
      .slice(0, 4)
  }, [interviews])

  const displayInterviews = upcoming.map((interview, index) => {
    const name = interview.candidate?.name || 'Unknown candidate'

    return {
      id: interview._id,
      name,
      role: interview.job?.title || 'Unknown position',
      initials: getInitials(name),
      color: avatarColors[index % avatarColors.length],
      date: getDateLabel(interview.date),
      time: interview.time,
      type: interview.type,
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
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          Upcoming Interviews
        </Typography>

        <Typography
          sx={{
            color: 'text.secondary',
            mt: 0.5,
          }}
        >
          Scheduled sessions
        </Typography>
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
              py: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Skeleton variant="rounded" height={70} />
          </Box>
        ))}

      {/* Empty state */}
      {!loading && !error && displayInterviews.length === 0 && (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', px: 4, py: 3 }}
        >
          No upcoming interviews.
        </Typography>
      )}

      {/* Interviews */}
      {!loading &&
        displayInterviews.map((interview) => (
          <Box
            key={interview.id}
            sx={{
              px: {
                xs: 2,
                sm: 3,
                md: 4,
              },

              py: 3,

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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: {
                  xs: 1.5,
                  sm: 2.5,
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
                  bgcolor: interview.color,
                  color: '#fff',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {interview.initials}
              </Box>

              {/* Details */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                      }}
                    >
                      {interview.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mt: 0.5,
                      }}
                    >
                      {interview.role}
                    </Typography>
                  </Box>

                  {/* Date */}
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,

                      bgcolor: alpha('#3b82f6', 0.12),
                      color: '#3b82f6',

                      fontSize: '0.8rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {interview.date}
                  </Box>
                </Box>

                {/* Time + Type */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: {
                      xs: 2,
                      sm: 3,
                    },

                    mt: 2,

                    color: 'text.secondary',
                    fontSize: '0.9rem',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <FiClock />
                    <span>{interview.time}</span>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <FiVideo />
                    <span>{interview.type}</span>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
    </Box>
  )
}

export default UpcomingInterviews