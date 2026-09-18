
import { Box, Typography, useTheme } from "@mui/material";

import Navbar from "../../components/dashboard/Navbar";
import RegisterForm from "../auth/register";

const RecruiterRegister = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
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
        <RegisterForm role="recruiter" />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          fontSize: "0.75rem",
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          © {new Date().getFullYear()} Talvyn AI Recruitment Platform.
          All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default RecruiterRegister;