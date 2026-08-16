import Box from '@mui/material/Box'

import RNavbar from '../../components/layout/recuriter/Navbar'
import RSidebar from '../../components/layout/recuriter/Sidebar'
import Topbar from '../../components/layout/recuriter/Topbar'

import StatsCards from '../../components/sections/StatsCards'
import ApplicationTrend from '../../components/sections/ApplicationTrend'
import HiringPipelines from '../../components/sections/HiringPipelines'
import RecentApplications from '../../components/sections/RecentApplication'
import UpcomingInterviews from '../../components/sections/UpcomingInterviews'

const RDashboard = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* Navbar */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <RNavbar />
      </Box>

      {/* Sidebar + Main */}
      <Box
        sx={{
          display: 'flex',
          minWidth: 0,
        }}
      >
        {/* Sidebar */}
        <RSidebar />

        {/* Main */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: 'background.default',
            color: 'text.primary',
          }}
        >
          <Topbar />

          <Box
            sx={{
              p: {
                xs: 2,
                sm: 3,
                md: 4,
              },
            }}
          >
            {/* Welcome */}
            <Box sx={{ mb: 3 }}>
              <Box
                component="h1"
                sx={{
                  m: 0,
                  fontSize: {
                    xs: '1.5rem',
                    sm: '1.875rem',
                  },
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                👋 Hi Recruiter
              </Box>

              <Box
                component="p"
                sx={{
                  mt: 1,
                  mb: 0,
                  color: 'text.secondary',
                }}
              >
                Welcome to your dashboard
              </Box>
            </Box>

            {/* Dashboard sections */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <StatsCards />

              <ApplicationTrend />

              <HiringPipelines />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    xl: '1fr 1fr',
                  },
                  gap: 3,
                }}
              >
                <RecentApplications />
                <UpcomingInterviews />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default RDashboard






