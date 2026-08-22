import {
  Box,
  Container,
  Typography,
} from "@mui/material";

import ApplicationStats from "../../components/applications/ApplicationStats";
import ApplicationFilters from "../../components/applications/ApplicationFilters";
import ApplicationTable from "../../components/applications/ApplicationTable";

import Navbar from "../../components/layout/applicant/Navbar";
import ASidebar from "../../components/layout/applicant/Sidebar";

const Applications = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Navbar />

      <Box sx={{ display: "flex" }}>
        <ASidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            bgcolor: "background.default",
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>

              <Typography
                variant="h4"
                fontWeight={600}
                color="text.primary"
              >
                My Applications
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Track and manage your job applications.
              </Typography>

              <ApplicationStats />

              <ApplicationFilters />

              <ApplicationTable />

            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Applications;