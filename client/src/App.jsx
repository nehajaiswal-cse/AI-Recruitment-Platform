//import React from 'react'

import './index.css';
import {Routes, Route} from 'react-router-dom';
import ADashboard from './pages/applicant/Dashboard';
import RDashboard from './pages/recruiter/Dashboard';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Login from './pages/auth/login';
import Register from './pages/auth/register';

export default function App() {
  return (
    <div>
      <Routes>
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> */}
         <Route path="/applicant" element={<ADashboard />} />
        <Route path="/" element={<Home/>} />
        <Route path="/recruiter" element={<RDashboard />} />
        <Route path="*" element={<NotFound />} />
        
      </Routes>

     
       
    </div>
  )
}






// import { useEffect, useMemo, useState } from 'react'
// //import { BrowserRouter } from 'react-router-dom'
// import {Routes, Route} from 'react-router-dom';
// //import ThemeProvider from '@mui/material/styles/ThemeProvider'
// import CssBaseline from '@mui/material/CssBaseline'
// import Box from '@mui/material/Box'
// import Skeleton from '@mui/material/Skeleton'
// import Stack from '@mui/material/Stack'

// import { getTheme } from './theme.js'
// import { ThemeModeProvider} from './context/ThemeModeContext.jsx'
// import {useThemeMode } from './context/useThemeMode.js'
// import RNavbar from './components/layout/recuriter/Navbar.jsx'
// import RSidebar from './components/layout/recuriter/Sidebar.jsx'
// import RTopbar from './components/layout/recuriter/Topbar.jsx'
// // import WelcomeHeader from './components/layout/recuriter/WelcomeHeader.jsx'
// // import StatCards from './components/layout/recuriter/StatCards.jsx'
// // import TrendChart from './components/layout/recuriter/TrendChart.jsx'
// // import PipelineFunnel from './components/layout/recuriter/PipelineFunnel.jsx'
// // import RecentApplications from './components/layout/recuriter/RecentApplications.jsx'
// // import UpcomingInterviews from './components/layout/recuriter/UpcomingInterviews.jsx'
// import { fetchDashboardData } from './data/mockData.js'
// import { ThemeProvider} from '@mui/material/styles'

// export default function App() {
//   return (
//     <ThemeModeProvider>
//       <ThemedApp />
//     </ThemeModeProvider>
//   )
// }

// function ThemedApp() {
//   const { mode } = useThemeMode()
//   const theme = useMemo(() => getTheme(mode), [mode])

//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [mobileNavOpen, setMobileNavOpen] = useState(false)

//   useEffect(() => {
//     let cancelled = false
//     fetchDashboardData().then((result) => {
//       if (!cancelled) {
//         setData(result)
//         setLoading(false)
//       }
//     })
//     return () => {
//       cancelled = true
//     }
//   }, [])

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       {/* <BrowserRouter> */}

//       <Routes>
//          <Route path="/" element={<ADashboard />} />
//          <Route path="/recruiter" element={<RDashboard />} />
//          {/* <Route path="*" element={<NotFound />} /> */}
//       </Routes>

//         <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
//           <RNavbar onSidebarToggle={() => setMobileNavOpen((v) => !v)} />

//           <Box sx={{ display: 'flex' }}>
//             <RSidebar
//               active="dashboard"
//               mobileOpen={mobileNavOpen}
//               onMobileClose={() => setMobileNavOpen(false)}
//             />

//             <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, sm: 3, md: 4 } }}>
//               {loading || !data ? (
//                 <DashboardSkeleton />
//               ) : (
//                 <>
//                   <RTopbar />
//                   {/* <WelcomeHeader recruiterName={data.recruiterName} />
//                   <StatCards stats={data.stats} />
//                   <TrendChart data={data.applicationTrend} />
//                   <PipelineFunnel pipeline={data.pipeline} totalCandidates={data.totalCandidates} />

//                   <Box
//                     sx={{
//                       display: 'grid',
//                       gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' },
//                       gap: 3,
//                       alignItems: 'start',
//                     }}
//                   >
//                     <RecentApplications applications={data.recentApplications} />
//                     <UpcomingInterviews interviews={data.upcomingInterviews} />
//                   </Box> */}
//                 </>
//               )}
//             </Box>
//           </Box>
//         </Box>
//       {/* </BrowserRouter> */}
//     </ThemeProvider>
//   )
// }

// function DashboardSkeleton() {
//   return (
//     <Stack spacing={2.5}>
//       <Skeleton variant="rounded" height={44} sx={{ bgcolor: 'rgba(148,163,184,0.08)' }} />
//       <Skeleton variant="rounded" height={92} sx={{ bgcolor: 'rgba(148,163,184,0.08)' }} />
//       <Skeleton variant="rounded" height={300} sx={{ bgcolor: 'rgba(148,163,184,0.08)' }} />
//       <Skeleton variant="rounded" height={200} sx={{ bgcolor: 'rgba(148,163,184,0.08)' }} />
//     </Stack>
//   )
// }

