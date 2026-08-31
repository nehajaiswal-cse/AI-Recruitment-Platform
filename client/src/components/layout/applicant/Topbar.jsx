// import { useEffect, useMemo, useRef, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// import Box from '@mui/material/Box'
// import TextField from '@mui/material/TextField'
// import InputAdornment from '@mui/material/InputAdornment'
// import Button from '@mui/material/Button'
// import Paper from '@mui/material/Paper'
// import Typography from '@mui/material/Typography'
// import List from '@mui/material/List'
// import ListItemButton from '@mui/material/ListItemButton'
// import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
// import AddRoundedIcon from '@mui/icons-material/AddRounded'
// import { brandGradient } from '../../../theme.js'

// import useJob from '../../../hooks/useJob'

// const RESULT_LIMIT = 6

// export default function ATopbar() {
//   const navigate = useNavigate()

//   // Same JobContext already used elsewhere in the app — fetchAllJobs pulls
//   // every published job, which is what applicants browse/search.
//   const { jobs, fetchAllJobs } = useJob()

//   const [search, setSearch] = useState('')
//   const [isFocused, setIsFocused] = useState(false)
//   const blurTimeout = useRef(null)

//   useEffect(() => {
//     fetchAllJobs().catch(() => {})
//   }, [fetchAllJobs])

//   const query = search.trim().toLowerCase()

//   const matchedJobs = useMemo(() => {
//     if (!query) return []

//     return jobs
//       .filter(
//         (job) =>
//           job.title?.toLowerCase().includes(query) ||
//           job.location?.toLowerCase().includes(query)
//       )
//       .slice(0, RESULT_LIMIT)
//   }, [jobs, query])

//   const showDropdown = isFocused && query.length > 0

//   const handleBlur = () => {
//     // Delay closing so a click on a result registers before the dropdown
//     // unmounts (onBlur fires before onClick otherwise).
//     blurTimeout.current = setTimeout(() => setIsFocused(false), 150)
//   }

//   const handleFocus = () => {
//     if (blurTimeout.current) clearTimeout(blurTimeout.current)
//     setIsFocused(true)
//   }

//   const goToJob = (jobId) => {
//     setIsFocused(false)
//     setSearch('')
//     navigate(`/applicant/jobs/${jobId}`)
//   }

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: {
//           xs: 'column',
//           sm: 'row',
//         },
//         alignItems: 'stretch',
//         gap: 2,

//         px: {
//           xs: 2,
//           sm: 3,
//           md: 4,
//         },

//         pt: {
//           xs: 2,
//           sm: 2,
//           md: 2,
//         },

//         mb: 3,
//       }}
//     >
//       <Box sx={{ position: 'relative', flex: 1 }}>
//         <TextField
//           placeholder="Search Jobs"
//           fullWidth
//           size="small"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchRoundedIcon
//                   sx={{ color: 'text.secondary', fontSize: 20 }}
//                 />
//               </InputAdornment>
//             ),
//             sx: {
//               bgcolor: 'background.paper',
//               borderRadius: 2,
//               height: 44,
//             },
//           }}
//         />

//         {showDropdown && (
//           <Paper
//             elevation={4}
//             sx={{
//               position: 'absolute',
//               top: 'calc(100% + 6px)',
//               left: 0,
//               right: 0,
//               zIndex: 20,
//               maxHeight: 360,
//               overflowY: 'auto',
//               borderRadius: 2,
//             }}
//           >
//             {matchedJobs.length === 0 ? (
//               <Typography
//                 variant="body2"
//                 sx={{ color: 'text.secondary', px: 2, py: 2 }}
//               >
//                 No jobs found for "{search}"
//               </Typography>
//             ) : (
//               <List dense disablePadding>
//                 {matchedJobs.map((job) => (
//                   <ListItemButton
//                     key={job._id}
//                     onClick={() => goToJob(job._id)}
//                   >
//                     <Box sx={{ minWidth: 0 }}>
//                       <Typography noWrap sx={{ fontWeight: 600 }}>
//                         {job.title}
//                       </Typography>

//                       <Typography
//                         variant="body2"
//                         noWrap
//                         sx={{ color: 'text.secondary' }}
//                       >
//                         {job.location}
//                         {job.employmentType ? ` · ${job.employmentType}` : ''}
//                       </Typography>
//                     </Box>
//                   </ListItemButton>
//                 ))}
//               </List>
//             )}
//           </Paper>
//         )}
//       </Box>

//       <Button
//         variant="contained"
//         startIcon={<AddRoundedIcon />}
//         onClick={() => navigate('/applicant/jobs')}
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
//         Apply
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
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { brandGradient } from '../../../theme.js'

<<<<<<< HEAD
export default function ATopbar() {
=======
import useJob from '../../../hooks/useJob'

const RESULT_LIMIT = 6

export default function ATopbar() {
  const navigate = useNavigate()

  // Same JobContext already used elsewhere in the app — fetchAllJobs pulls
  // every published job, which is what applicants browse/search.
  const { jobs, fetchAllJobs } = useJob()

  const [search, setSearch] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const blurTimeout = useRef(null)

  useEffect(() => {
    fetchAllJobs().catch(() => {})
  }, [fetchAllJobs])

  const query = search.trim().toLowerCase()

  const matchedJobs = useMemo(() => {
    if (!query) return []

    return jobs
      .filter(
        (job) =>
          job.title?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query)
      )
      .slice(0, RESULT_LIMIT)
  }, [jobs, query])

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

  const goToJob = (jobId) => {
    setIsFocused(false)
    setSearch('')
    navigate(`/applicant/jobs/${jobId}`)
  }

>>>>>>> main
  return (
    <Box
      sx={{
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
          placeholder="Search Jobs"
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
            {matchedJobs.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', px: 2, py: 2 }}
              >
                No jobs found for "{search}"
              </Typography>
            ) : (
              <List dense disablePadding>
                {matchedJobs.map((job) => (
                  <ListItemButton
                    key={job._id}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => goToJob(job._id)}
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
                        {job.location}
                        {job.jobType ? ` · ${job.jobType}` : ''}
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
        onClick={() => navigate('/applicant/jobs')}
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
        Apply
      </Button>
    </Box>
  )
}












<<<<<<< HEAD













=======
>>>>>>> main
