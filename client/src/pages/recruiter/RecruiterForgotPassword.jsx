import { Box, Typography } from "@mui/material";

import Navbar from "../../components/dashboard/Navbar";
import ForgotPasswordForm from "../../pages/auth/ForgotPassword";

const RecruiterForgotPassword = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        color: "text.primary",
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
          p: { xs: 2, sm: 3, lg: 4 },
          bgcolor: "background.default",
        }}
      >
        <ForgotPasswordForm role="recruiter" />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          fontSize: 12,
          bgcolor: "background.paper",
          color: "text.secondary",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
          © {new Date().getFullYear()} Talvyn AI Recruitment Platform. All rights
          reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default RecruiterForgotPassword;