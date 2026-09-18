
import { Box, Typography} from "@mui/material";

import WavingHandOutlinedIcon from "@mui/icons-material/WavingHandOutlined";
import useAuth from "../../../hooks/useAuth";




function Greeting({ role = "applicant",sx }) {
  

  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };



  const isRecruiter = role === "recruiter";

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        ...sx,
      }}
    >
      {/* ================= GREETING ================= */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
          }}
        >
          <WavingHandOutlinedIcon
            sx={{
              fontSize: {
                xs: 28,
                sm: 32,
              },
              color: "primary.main",
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 400,
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}
          >
            {getGreeting()},
          </Typography>

          <Typography
            variant="h4"
            component="span"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.7px",
              lineHeight: 1.2,
            }}
          >
            {user?.name}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontWeight: 400,
          }}
        >
          {isRecruiter
            ? "Manage your recruitment activities and discover top talent."
            : "Track your applications and discover your next opportunity."}
        </Typography>
      </Box>

      
    </Box>
  );
}

export default Greeting;



