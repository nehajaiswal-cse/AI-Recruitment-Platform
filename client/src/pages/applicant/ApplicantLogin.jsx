import Navbar from "../../components/dashboard/Navbar";
import LoginForm from "../auth/login";
import { Box, Typography } from "@mui/material";

const ApplicantLogin = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: {
            xs: 2,
            sm: 3,
            lg: 4,
          },
        }}
      >
        <LoginForm role="applicant" />
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          py: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
          }}
        >
          © {new Date().getFullYear()} Talvyn AI Recruitment Platform. All
          rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default ApplicantLogin;