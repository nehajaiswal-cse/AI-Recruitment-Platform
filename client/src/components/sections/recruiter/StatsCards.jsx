// import Box from '@mui/material/Box'

// import StatsCard from '../../dashboard/StatsCard'

// const StatsCards = () => {
//   return (
//     <Box
//       sx={{
//         bgcolor: 'background.paper',
//         border: '1px solid',
//         borderColor: 'divider',
//         borderRadius: 3,
//         p: {
//           xs: 2,
//           sm: 2.5,
//           md: 3,
//         },

//         display: 'grid',

//         gridTemplateColumns: {
//           xs: '1fr',
//           sm: '1fr 1fr',
//           lg: 'repeat(4, 1fr)',
//         },

//         gap: 2,
//       }}
//     >
//       <StatsCard
//         title="Total Jobs"
//         value="24"
//         icon="💼"
//         description="5 active jobs"
//       />

//       <StatsCard
//         title="Applications"
//         value="281"
//         icon="📄"
//         description="12 new this week"
//       />

//       <StatsCard
//         title="Interviews"
//         value="18"
//         icon="📅"
//         description="4 scheduled today"
//       />

//       <StatsCard
//         title="Selected"
//         value="6"
//         icon="🎯"
//         description="This month"
//       />
//     </Box>
//   )
// }

// export default StatsCards


import { useEffect, useMemo, useState, useCallback } from 'react'

import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import StatsCard from '../../dashboard/StatsCard'

import useJob from '../../../hooks/useJob'
import { useInterviewContext } from '../../../context/InterviewContext'
import { getRecruiterAnalytics } from '../../../api/analyticsApi'

const StatsCards = () => {
  // Jobs come from the existing JobContext (already provided in main.jsx)
  const { jobs, fetchMyJobs } = useJob()

  // Interviews come from the existing InterviewContext.
  // (useInterview.js is applicant-focused and auto-fetches "my" interviews,
  // so we talk to the context directly here to get the recruiter's interviews.)
  const { interviews, fetchRecruiterInterviews } = useInterviewContext()

  // No AnalyticsContext exists yet, so this component owns its own
  // loading/error/data state for that one call, same shape every other
  // context in this app uses (loading / error / data).
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getRecruiterAnalytics()

      setAnalytics(response.data)
    } catch (err) {
      console.error('Fetch recruiter analytics error:', err)

      setError(
        err.response?.data?.message || 'Failed to load dashboard stats.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAnalytics()
    fetchMyJobs().catch(() => {})
    fetchRecruiterInterviews().catch(() => {})
  }, [loadAnalytics, fetchMyJobs, fetchRecruiterInterviews])

  // ---- Derived numbers not returned directly by the analytics endpoint ----

  const activeJobsCount = useMemo(
    () => jobs.filter((job) => job.status === 'published').length,
    [jobs]
  )

  const interviewsToday = useMemo(() => {
    const today = new Date()

    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.date)

      return (
        interviewDate.getFullYear() === today.getFullYear() &&
        interviewDate.getMonth() === today.getMonth() &&
        interviewDate.getDate() === today.getDate()
      )
    }).length
  }, [interviews])

  const totalJobs = analytics?.totalJobs ?? jobs.length
  const totalApplications = analytics?.totalApplications ?? 0
  const shortlisted = analytics?.shortlisted ?? 0
  const hired = analytics?.hired ?? 0

  const cards = [
    {
      title: 'Total Jobs',
      value: totalJobs,
      icon: '💼',
      description: `${activeJobsCount} active job${
        activeJobsCount === 1 ? '' : 's'
      }`,
    },
    {
      title: 'Applications',
      value: totalApplications,
      icon: '📄',
      description: `${shortlisted} shortlisted`,
    },
    {
      title: 'Interviews',
      value: interviews.length,
      icon: '📅',
      description: `${interviewsToday} scheduled today`,
    },
    {
      title: 'Selected',
      value: hired,
      icon: '🎯',
      description: 'Hired candidates',
    },
  ]

  return (
    <Box>
      {error && (
        <Typography
          variant="body2"
          sx={{ color: 'error.main', mb: 1.5 }}
        >
          {error}
        </Typography>
      )}

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },

          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            lg: 'repeat(4, 1fr)',
          },

          gap: 2,
        }}
      >
        {loading
          ? cards.map((card) => (
              <Skeleton
                key={card.title}
                variant="rounded"
                height={104}
                sx={{ borderRadius: 3 }}
              />
            ))
          : cards.map((card) => (
              <StatsCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                description={card.description}
              />
            ))}
      </Box>
    </Box>
  )
}

export default StatsCards