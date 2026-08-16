//import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { COLORS } from "../../pages/homeStyles";

const Footer = () => (
  <Box sx={{ bgcolor: COLORS.navyDark, py: 5, borderTop: "1px solid rgba(130,166,195,0.12)" }}>
    <Container maxWidth="xl">
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={3}>
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 800, mb: 0.5 }}>Talvyn</Typography>
          <Typography sx={{ color: "#748AA1", fontSize: 13 }}>Talent · Vision · AI</Typography>
        </Box>
        <Typography sx={{ color: "#667C92", fontSize: 13, alignSelf: "center" }}>
          © 2026 Talvyn. All rights reserved.
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
