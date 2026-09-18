import Box from '@mui/material/Box'

import RNavbar from '../../components/layout/recruiter/Navbar'
import RSidebar from '../../components/layout/recruiter/Sidebar'
import Topbar from '../../components/layout/recruiter/Topbar'

import StatsCards from '../../components/sections/recruiter/StatsCards'
import ApplicationTrend from '../../components/sections/recruiter/ApplicationTrend'
import HiringPipelines from '../../components/sections/recruiter/HiringPipelines'
import RecentApplications from '../../components/sections/recruiter/RecentApplication'
import UpcomingInterviews from '../../components/sections/recruiter/UpcomingInterviews'
import Greeting from '../../components/layout/recruiter/WelcomeHeader';

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
            pt: 5
          }}
        >
          {/* Greeting */}
          <Greeting role="recruiter" sx={{ ml: 4 }} />
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






