// import { Link } from 'react-router-dom'
// import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
// import { alpha } from '@mui/material/styles'

// const pipelineData = [
//   {
//     id: 'applied',
//     title: 'Applied',
//     count: 154,
//     percentage: 55,
//     color: '#3b82f6',
//   },
//   {
//     id: 'shortlisted',
//     title: 'Shortlisted',
//     count: 62,
//     percentage: 22,
//     color: '#f59e0b',
//   },
//   {
//     id: 'interview',
//     title: 'Interview',
//     count: 18,
//     percentage: 6,
//     color: '#9333ea',
//   },
//   {
//     id: 'selected',
//     title: 'Selected',
//     count: 6,
//     percentage: 2,
//     color: '#10b981',
//   },
//   {
//     id: 'rejected',
//     title: 'Rejected',
//     count: 41,
//     percentage: 15,
//     color: '#f43f5e',
//   },
// ]

// const HiringPipeline = () => {
//   //const theme = useTheme()

//   const totalCandidates = pipelineData.reduce(
//     (total, stage) => total + stage.count,
//     0
//   )

//   return (
//     <Box
//       sx={{
//         bgcolor: 'background.paper',
//         border: '1px solid',
//         borderColor: 'divider',
//         borderRadius: 3,
//         p: {
//           xs: 2,
//           sm: 3,
//           md: 4,
//         },
//       }}
//     >
//       {/* Header */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: {
//             xs: 'flex-start',
//             sm: 'center',
//           },
//           justifyContent: 'space-between',
//           gap: 2,
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
//             Hiring Pipeline
//           </Typography>

//           <Typography
//             variant="body2"
//             sx={{
//               color: 'text.secondary',
//               mt: 0.5,
//             }}
//           >
//             {totalCandidates} total candidates
//           </Typography>
//         </Box>

//         <Box
//           component={Link}
//           to="/recruiter/pipeline"
//           sx={{
//             color: 'primary.main',
//             fontSize: '0.95rem',
//             fontWeight: 600,
//             textDecoration: 'none',
//             whiteSpace: 'nowrap',

//             '&:hover': {
//               textDecoration: 'underline',
//             },
//           }}
//         >
//           View all
//         </Box>
//       </Box>

//       {/* Pipeline Progress Bar */}
//       <Box
//         sx={{
//           display: 'flex',
//           height: 20,
//           overflow: 'hidden',
//           borderRadius: 999,
//           mt: 4,
//           mb: 4,
//           bgcolor: 'action.hover',
//         }}
//       >
//         {pipelineData.map((stage) => (
//           <Box
//             key={stage.id}
//             sx={{
//               width: `${stage.percentage}%`,
//               bgcolor: stage.color,
//               transition: 'width 0.3s ease',
//             }}
//           />
//         ))}
//       </Box>

//       {/* Pipeline Cards */}
//       <Box
//         sx={{
//           display: 'grid',
//           gridTemplateColumns: {
//             xs: '1fr',
//             sm: '1fr 1fr',
//             lg: 'repeat(3, 1fr)',
//           },
//           gap: 2,
//         }}
//       >
//         {pipelineData.map((stage) => (
//           <Box
//             key={stage.id}
//             sx={{
//               bgcolor: alpha(stage.color, 0.10),
//               border: '1px solid',
//               borderColor: alpha(stage.color, 0.20),
//               borderRadius: 3,
//               p: 3,
//               minHeight: 165,

//               transition: 'all 0.2s ease',

//               '&:hover': {
//                 bgcolor: alpha(stage.color, 0.15),
//                 transform: 'translateY(-2px)',
//               },
//             }}
//           >
//             {/* Title */}
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 1.5,
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 14,
//                   height: 14,
//                   borderRadius: '50%',
//                   bgcolor: stage.color,
//                   flexShrink: 0,
//                 }}
//               />

//               <Typography
//                 sx={{
//                   color: 'text.primary',
//                   fontWeight: 600,
//                   fontSize: '1rem',
//                 }}
//               >
//                 {stage.title}
//               </Typography>
//             </Box>

//             {/* Count */}
//             <Typography
//               sx={{
//                 color: stage.color,
//                 fontSize: '2.25rem',
//                 fontWeight: 700,
//                 mt: 2,
//               }}
//             >
//               {stage.count}
//             </Typography>

//             {/* Percentage */}
//             <Typography
//               variant="body2"
//               sx={{
//                 color: 'text.secondary',
//                 mt: 0.5,
//               }}
//             >
//               {stage.percentage}% of total
//             </Typography>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   )
// }

// export default HiringPipeline


import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { alpha } from '@mui/material/styles'

import { useInterviewContext } from '../../context/InterviewContext'
import { getRecruiterAnalytics } from '../../api/analyticsApi'

const HiringPipeline = () => {
  //const theme = useTheme()

  // Interviews come from the existing InterviewContext, same as StatsCards.
  const { interviews, fetchRecruiterInterviews } = useInterviewContext()

  // No AnalyticsContext exists yet, so this component owns its own
  // loading/error/data state for this one call — same pattern as
  // StatsCards.jsx and ApplicationTrend.jsx.
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadAnalytics = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getRecruiterAnalytics()

        if (isMounted) {
          setAnalytics(response.data)
        }
      } catch (err) {
        console.error('Fetch hiring pipeline error:', err)

        if (isMounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load hiring pipeline.'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAnalytics()
    fetchRecruiterInterviews().catch(() => {})

    return () => {
      isMounted = false
    }
  }, [fetchRecruiterInterviews])

  // The analytics endpoint returns totalApplications, shortlisted, hired,
  // rejected — but not a separate "still just applied" count. Since every
  // application's status is one of applied/shortlisted/rejected/hired
  // (mutually exclusive), "applied" is whatever's left over.
  const totalApplications = analytics?.totalApplications ?? 0
  const shortlistedCount = analytics?.shortlisted ?? 0
  const rejectedCount = analytics?.rejected ?? 0
  const selectedCount = analytics?.hired ?? 0

  const appliedCount = Math.max(
    totalApplications -
      shortlistedCount -
      rejectedCount -
      selectedCount,
    0
  )

  const interviewCount = interviews.length

  const pipelineData = [
    {
      id: 'applied',
      title: 'Applied',
      count: appliedCount,
      color: '#3b82f6',
    },
    {
      id: 'shortlisted',
      title: 'Shortlisted',
      count: shortlistedCount,
      color: '#f59e0b',
    },
    {
      id: 'interview',
      title: 'Interview',
      count: interviewCount,
      color: '#9333ea',
    },
    {
      id: 'selected',
      title: 'Selected',
      count: selectedCount,
      color: '#10b981',
    },
    {
      id: 'rejected',
      title: 'Rejected',
      count: rejectedCount,
      color: '#f43f5e',
    },
  ]

  const totalCandidates = pipelineData.reduce(
    (total, stage) => total + stage.count,
    0
  )

  // Percentage used to be a separate hardcoded field alongside count.
  // Derive it from count/total instead so it always matches the real data.
  const pipelineDataWithPercentage = pipelineData.map((stage) => ({
    ...stage,
    percentage:
      totalCandidates > 0
        ? Math.round((stage.count / totalCandidates) * 100)
        : 0,
  }))

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

      {/* Error state */}
      {error && (
        <Typography
          variant="body2"
          sx={{ color: 'error.main', mt: 2 }}
        >
          {error}
        </Typography>
      )}

      {loading ? (
        <>
          <Skeleton
            variant="rounded"
            height={20}
            sx={{ borderRadius: 999, mt: 4, mb: 4 }}
          />

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
              <Skeleton
                key={stage.id}
                variant="rounded"
                height={165}
                sx={{ borderRadius: 3 }}
              />
            ))}
          </Box>
        </>
      ) : (
        <>
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
            {pipelineDataWithPercentage.map((stage) => (
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
            {pipelineDataWithPercentage.map((stage) => (
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
        </>
      )}
    </Box>
  )
}

export default HiringPipeline