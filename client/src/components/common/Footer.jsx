
import { Box, Container, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        bgcolor: isDark
          ? "#081525"
          : "#E8F0F7",

        py: 5,

        borderTop: `1px solid ${
          theme.palette.divider
        }`,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            gap: 3,
          }}
        >
          {/* Brand */}
          <Box>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 800,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              Talvyn
            </Typography>

            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: 13,
              }}
            >
              Talent · Vision · AI
            </Typography>
          </Box>

          {/* Copyright */}
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: 13,
              alignSelf: {
                xs: "flex-start",
                md: "center",
              },
            }}
          >
            © 2026 Talvyn. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;