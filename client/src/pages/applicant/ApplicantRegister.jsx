import Navbar from "../../components/dashboard/Navbar";
import RegisterForm from "../auth/register";
import { Box, Typography, useTheme } from "@mui/material";

const ApplicantRegister = () => {
  const theme = useTheme();

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
        <RegisterForm role="applicant" />
      </Box>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          bgcolor:
            theme.palette.background.surface ||
            theme.palette.background.paper,

          borderTop: "1px solid",
          borderColor: "divider",

          py: 2,
          textAlign: "center",

          transition:
            "background-color 0.2s ease, border-color 0.2s ease",
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

export default ApplicantRegister;
