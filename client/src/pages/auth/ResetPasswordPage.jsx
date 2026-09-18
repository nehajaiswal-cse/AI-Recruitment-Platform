import { Box, Typography, useTheme } from "@mui/material";

import Navbar from "../../components/dashboard/Navbar";
import ResetPasswordForm from "./ResetPassword";

const ResetPasswordPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",

        bgcolor: "background.default",
        color: "text.primary",

        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
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
        <ResetPasswordForm />
      </Box>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          bgcolor: isDark
            ? theme.palette.background.paper
            : theme.palette.background.surface || theme.palette.background.paper,

          borderTop: "1px solid",
          borderColor: "divider",

          py: 2,
          textAlign: "center",

          transition: "background-color 0.2s ease, border-color 0.2s ease",
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
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

export default ResetPasswordPage;
