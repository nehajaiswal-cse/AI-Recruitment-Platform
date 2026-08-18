import {
  Box,

  Typography,
} from '@mui/material';

import RNavbar from '../../components/layout/recruiter/Navbar';
import RSidebar from '../../components/layout/recruiter/Sidebar';

import StatCards from '../../components/analytics/StatCard';
import ApplicationOverview from '../../components/analytics/ApplicationOverview';
import CandidatePipeline from '../../components/analytics/CandidatePipeline';
import AIMatchDistribution from '../../components/analytics/AIMatchDistribution';
import JobPerformance from '../../components/analytics/JobPerformance';

import {
  summaryStats,
  applicationTrend,
  candidatePipeline,
  aiMatchDistribution,
  jobPerformance,
} from '../../data/analyticsData';

function Analytics() {
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

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: 'background.default',
            color: 'text.primary',
            p:5,
            
            
          }}
          
           
        >
        

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                Analytics
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
              >
                Track recruitment performance and hiring outcomes
              </Typography>
            </Box>

            {/* Summary Cards */}
            <Box sx={{ mb: 4 }}>
              <StatCards stats={summaryStats} />
            </Box>

            {/* Application Overview + AI Matching */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: '2fr 1fr',
                },
                gap: 3,
                mb: 3,
              }}
            >
              <ApplicationOverview
                data={applicationTrend}
              />

              <AIMatchDistribution
                data={aiMatchDistribution}
              />
            </Box>

            {/* Candidate Pipeline */}
            <Box sx={{ mb: 3 }}>
              <CandidatePipeline
                data={candidatePipeline}
              />
            </Box>

            {/* Job Performance */}
            <JobPerformance
              data={jobPerformance}
            />
         
        </Box>
      </Box>
    </Box>
  );
}

export default Analytics;




