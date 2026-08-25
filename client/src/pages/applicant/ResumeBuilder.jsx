import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ResumeBuilder = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700}>
        Resume Builder
      </Typography>

      <Typography sx={{ mt: 1, color: "text.secondary" }}>
        Build your professional resume step by step.
      </Typography>
    </Box>
  );
};

export default ResumeBuilder;