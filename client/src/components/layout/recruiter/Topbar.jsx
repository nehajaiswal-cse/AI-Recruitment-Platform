// import Box from '@mui/material/Box'
// import TextField from '@mui/material/TextField'
// import InputAdornment from '@mui/material/InputAdornment'
// import Button from '@mui/material/Button'
// import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
// import AddRoundedIcon from '@mui/icons-material/AddRounded'
// import { brandGradient } from '../../../theme.js'

// export default function RTopbar() {
//   return (
//   <Box
//   sx={{
//     display: 'flex',
//     flexDirection: {
//       xs: 'column',
//       sm: 'row',
//     },
//     alignItems: 'stretch',
//     gap: 2,

//     px: {
//       xs: 2,
//       sm: 3,
//       md: 4,
//     },

//     pt: {
//       xs: 2,
//       sm: 2,
//       md: 2,
//     },

//     mb: 3,
//   }}
// >
//       <TextField
//         placeholder="Search Candidates"
//         fullWidth
//         size="small"
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
//             </InputAdornment>
//           ),
//           sx: {
//             bgcolor: 'background.paper',
//             borderRadius: 2,
//             height: 44,
//           },
//         }}
//       />

//       <Button
//         variant="contained"
//         startIcon={<AddRoundedIcon />}
//         sx={{
//           background: brandGradient,
//           whiteSpace: 'nowrap',
//           px: 2.5,
//           height: 44,
//           width: { xs: '100%', sm: 'auto' },
//           flexShrink: 0,
//           '&:hover': { background: brandGradient, opacity: 0.92 },
//         }}
//       >
//         Create Job
//       </Button>
//     </Box>
//   )
// }





import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListSubheader from '@mui/material/ListSubheader'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { brandGradient } from '../../../theme.js'

import useJob from '../../../hooks/useJob'
import useCandidate from '../../../hooks/useCandidate'
import { useInterviewContext } from '../../../context/InterviewContext'

const RESULT_LIMIT = 5

export default function RTopbar() {
  const navigate = useNavigate()

  // Jobs, candidates and interviews already come from the same contexts
  // used elsewhere on the dashboard (StatsCards, RecentApplications,
  // UpcomingInterviews) — sharing state, not re-implementing anything.
  const { jobs, fetchMyJobs } = useJob()
  const { candidates, fetchCandidates } = useCandidate()
  const { interviews, fetchRecruiterInterviews } = useInterviewContext()

  const [search, setSearch] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const blurTimeout = useRef(null)

  useEffect(() => {
    fetchMyJobs().catch(() => {})
    fetchCandidates().catch(() => {})
    fetchRecruiterInterviews().catch(() => {})
  }, [fetchMyJobs, fetchCandidates, fetchRecruiterInterviews])

  const query = search.trim().toLowerCase()

  // Everything is matched against the job's name/title, per your request:
  // "search jobs and candidates and upcoming interviews as per job name".
  const matchedJobs = useMemo(() => {
    if (!query) return []

    return jobs
      .filter((job) => job.title?.toLowerCase().includes(query))
      .slice(0, RESULT_LIMIT)
  }, [jobs, query])

  const matchedCandidates = useMemo(() => {
    if (!query) return []

    return candidates
      .filter((candidate) =>
        candidate.jobId?.title?.toLowerCase().includes(query)
      )
      .slice(0, RESULT_LIMIT)
  }, [candidates, query])

  const matchedInterviews = useMemo(() => {
    if (!query) return []

    return interviews
      .filter((interview) =>
        interview.job?.title?.toLowerCase().includes(query)
      )
      .slice(0, RESULT_LIMIT)
  }, [interviews, query])

  const hasResults =
    matchedJobs.length > 0 ||
    matchedCandidates.length > 0 ||
    matchedInterviews.length > 0

  const showDropdown = isFocused && query.length > 0

  const handleBlur = () => {
    // Delay closing so a click on a result registers before the dropdown
    // unmounts (onBlur fires before onClick otherwise).
    blurTimeout.current = setTimeout(() => setIsFocused(false), 150)
  }

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current)
    setIsFocused(true)
  }

  const goTo = (path) => {
    setIsFocused(false)
    setSearch('')
    navigate(path)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: {
          xs: 'column',
          sm: 'row',
        },
        alignItems: 'stretch',
        gap: 2,

        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },

        pt: {
          xs: 2,
          sm: 2,
          md: 2,
        },

        mb: 3,
      }}
    >
      <Box sx={{ position: 'relative', flex: 1 }}>
        <TextField
<<<<<<< HEAD
          placeholder="Search Job , Interview and Candidates by Job name"
=======
          placeholder="Search Candidates"
>>>>>>> main
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  sx={{ color: 'text.secondary', fontSize: 20 }}
                />
              </InputAdornment>
            ),
            sx: {
              bgcolor: 'background.paper',
              borderRadius: 2,
              height: 44,
            },
          }}
        />

        {showDropdown && (
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              zIndex: 20,
              maxHeight: 360,
              overflowY: 'auto',
              borderRadius: 2,
            }}
          >
            {!hasResults && (
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', px: 2, py: 2 }}
              >
                No matches for "{search}"
              </Typography>
            )}

            {matchedJobs.length > 0 && (
              <List
                dense
                disablePadding
                subheader={
                  <ListSubheader sx={{ lineHeight: '32px' }}>
                    Jobs
                  </ListSubheader>
                }
              >
                {matchedJobs.map((job) => (
                  <ListItemButton
                    key={job._id}
<<<<<<< HEAD
=======
                    onMouseDown={(event) => event.preventDefault()}
>>>>>>> main
                    onClick={() => goTo(`/recruiter/jobs/${job._id}`)}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap sx={{ fontWeight: 600 }}>
                        {job.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ color: 'text.secondary' }}
                      >
                        {job.status}
                      </Typography>
                    </Box>
                  </ListItemButton>
                ))}
              </List>
            )}

            {matchedCandidates.length > 0 && (
              <List
                dense
                disablePadding
                subheader={
                  <ListSubheader sx={{ lineHeight: '32px' }}>
                    Candidates
                  </ListSubheader>
                }
              >
                {matchedCandidates.map((candidate) => (
                  <ListItemButton
                    key={candidate._id}
<<<<<<< HEAD
=======
                    onMouseDown={(event) => event.preventDefault()}
>>>>>>> main
                    onClick={() => goTo('/recruiter/candidates')}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap sx={{ fontWeight: 600 }}>
                        {candidate.applicantId?.name || 'Unknown candidate'}
                      </Typography>

                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ color: 'text.secondary' }}
                      >
                        {candidate.jobId?.title}
                      </Typography>
                    </Box>
                  </ListItemButton>
                ))}
              </List>
            )}

            {matchedInterviews.length > 0 && (
              <List
                dense
                disablePadding
                subheader={
                  <ListSubheader sx={{ lineHeight: '32px' }}>
                    Upcoming Interviews
                  </ListSubheader>
                }
              >
                {matchedInterviews.map((interview) => (
                  <ListItemButton
                    key={interview._id}
<<<<<<< HEAD
=======
                    onMouseDown={(event) => event.preventDefault()}
>>>>>>> main
                    onClick={() => goTo('/recruiter/interviews')}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap sx={{ fontWeight: 600 }}>
                        {interview.candidate?.name || 'Unknown candidate'}
                      </Typography>

                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ color: 'text.secondary' }}
                      >
                        {interview.job?.title} · {interview.time}
                      </Typography>
                    </Box>
                  </ListItemButton>
                ))}
              </List>
            )}
          </Paper>
        )}
      </Box>

      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={() => navigate('/recruiter/jobs/create')}
        sx={{
          background: brandGradient,
          whiteSpace: 'nowrap',
          px: 2.5,
          height: 44,
          width: { xs: '100%', sm: 'auto' },
          flexShrink: 0,
          '&:hover': { background: brandGradient, opacity: 0.92 },
        }}
      >
        Create Job
      </Button>
    </Box>
  )
}