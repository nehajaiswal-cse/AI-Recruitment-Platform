import Box from '@mui/material/Box'
import ANavbar from '../../components/layout/applicant/Navbar';
import ASidebar from '../../components/layout/applicant/Sidebar';
import Topbar from '../../components/layout/applicant/Topbar';
import Greeting from '../../components/layout/applicant/WelcomeHeader';
import StatsRow from '../../components/sections/applicant/StatsRow';
import RecommendedJobs from '../../components/sections/applicant/RecommendedJobs'
import UpcomingInterviews from '../../components/sections/applicant/UpcomingInterviews'
import RecentApplications from '../../components/sections/applicant/RecentApplications'



import {
  recommendedJobs,
  upcomingInterviews,
} from '../../data/dashboardData';

const ADashboard = () => {
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
        <ANavbar />
      </Box>

      {/* Sidebar + Main */}
      <Box
        sx={{
          display: 'flex',
          minWidth: 0,
        }}
      >
        {/* Sidebar */}
        <ASidebar />

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
           
             {/* Greeting */}
     <Greeting/>

     <StatsRow/>

      <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'minmax(0, 1.65fr) minmax(320px, 1fr)',
        },
        gap: 3,
        pt:5,
        mb:5
        
      }}
    >
      <RecommendedJobs jobs={recommendedJobs} />

      <UpcomingInterviews interviews={upcomingInterviews} />
    </Box>

    <RecentApplications/>

            
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ADashboard