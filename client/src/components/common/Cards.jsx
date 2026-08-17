//import React from "react";
import {
  Box, Card, CardContent, Container, Divider, Grid, Paper, Stack, Typography,
} from "@mui/material";
import {
 // ArrowForward, AutoAwesome, Bolt, CheckCircle, Warning,
   AutoAwesome, Bolt
} from "@mui/icons-material";
import { COLORS } from "../../pages/homeStyles";
import {
  blueIconBox, darkCardBase, darkCardHover, flexCenter, primaryButtonSx,
  sectionSx, sectionLabelSx, tealIconBox,
} from "../../pages/homeStyles";
import { stats, features, steps, matchRows, insightRows } from "../../pages/homeData";

export const MatchRow = ({ label, value }) => (
  <Box sx={{ mb: 2.3 }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 0.9,
      }}
    >
      <Typography
        sx={{
          color: "#B6C7D8",
          fontSize: 12.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: COLORS.white,
          fontSize: 12.5,
          fontWeight: 700,
        }}
      >
        {value}%
      </Typography>
    </Box>

    <Box
      sx={{
        width: "100%",
        height: 7,
        bgcolor: COLORS.track,
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: `${value}%`,
          height: "100%",
          borderRadius: "20px",
          background:
            "linear-gradient(90deg, #58B8B0, #69C9BE)",
        }}
      />
    </Box>
  </Box>
);

export const AIMatchCard = () => (
  <Paper
    elevation={0}
    sx={{
      width: "100%",
      maxWidth: 570,
      mx: "auto",
      p: { xs: 3, md: 4 },
      borderRadius: "26px",
      background:
        "linear-gradient(145deg, #142A45 0%, #10223A 100%)",
      border: "1px solid rgba(112,167,194,0.25)",
      boxShadow: "0 35px 80px rgba(3,16,32,0.35)",
      position: "relative",
      overflow: "hidden",

      "&::before": {
        content: '""',
        position: "absolute",
        width: 350,
        height: 350,
        right: -180,
        top: -190,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(55,136,210,0.16), transparent 70%)",
        pointerEvents: "none",
      },
    }}
  >
    {/* Header */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.4,
        }}
      >
        <Box
          sx={{
            ...tealIconBox,
            width: 38,
            height: 38,
            borderRadius: "11px",
            flexShrink: 0,
          }}
        >
          <AutoAwesome sx={{ fontSize: 20 }} />
        </Box>

        <Typography
          sx={{
            color: COLORS.white,
            fontSize: 17,
            fontWeight: 700,
          }}
        >
          Match overview
        </Typography>
      </Box>

      {/* Candidates */}
      <Box
        sx={{
          px: 1.5,
          py: 0.7,
          borderRadius: "20px",
          bgcolor: "rgba(103,200,188,0.13)",
          color: COLORS.teal,
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        12 candidates
      </Box>
    </Box>

    {/* Job Title */}
    <Typography
      sx={{
        color: "#819AB4",
        fontSize: 13,
        mt: 1,
        mb: 3,
      }}
    >
      Senior Product Designer
    </Typography>

    <Divider
      sx={{
        borderColor: "rgba(255,255,255,0.09)",
        mb: 3,
      }}
    />

    {/* Candidate */}
    <Box
      sx={{
        p: 2.5,
        borderRadius: "17px",
        bgcolor: "rgba(41,70,101,0.65)",
        border: "1px solid rgba(120,163,197,0.20)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            bgcolor: "#D9914E",
            ...flexCenter,
            color: COLORS.white,
            fontWeight: 800,
            fontSize: 17,
            flexShrink: 0,
          }}
        >
          AM
        </Box>

        {/* Candidate Info */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              color: COLORS.white,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Alex Morgan
          </Typography>

          <Typography
            sx={{
              color: "#91A8C0",
              fontSize: 13,
              mt: 0.4,
            }}
          >
            Product designer · 5 years
          </Typography>
        </Box>

        {/* Score */}
        <Typography
          sx={{
            color: COLORS.teal,
            fontSize: 28,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          94%
        </Typography>
      </Box>

      {/* Match Rows */}
      <Box sx={{ mt: 3 }}>
        {matchRows.map((row) => (
          <MatchRow
            key={row.label}
            label={row.label}
            value={row.value}
          />
        ))}
      </Box>
    </Box>

    {/* Strong Match */}
    <Box
      sx={{
        mt: 2.5,
        p: 2,
        borderRadius: "14px",
        bgcolor: "rgba(76,140,178,0.13)",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Bolt
        sx={{
          color: COLORS.teal,
          fontSize: 20,
          flexShrink: 0,
        }}
      />

      <Typography
        sx={{
          color: "#B5C9DB",
          fontSize: 12.5,
        }}
      >
        Strong match: 8 of 9 key requirements found.
      </Typography>
    </Box>
  </Paper>
);

export const StatsCard = ({ number, title, label }) => (
  <Paper elevation={0} sx={{ p: 4, minHeight: 220, borderRadius: "25px", bgcolor: "#10233D", color: COLORS.white, boxShadow: "0 20px 50px rgba(16,35,61,0.12)" }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{label}</Typography>
      <Box sx={{ px: 1.5, py: 0.6, borderRadius: "20px", bgcolor: "rgba(103,200,188,0.13)", color: COLORS.teal, fontSize: 11, fontWeight: 700 }}>
        Live insights
      </Box>
    </Stack>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography sx={{ fontSize: 58, lineHeight: 1, fontWeight: 800, letterSpacing: "-3px" }}>{number}</Typography>
      <Typography sx={{ color: "#A6B9CC", fontSize: 15, lineHeight: 1.5, maxWidth: 150 }}>{title}</Typography>
    </Stack>
  </Paper>
);

export const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card
    elevation={0}
    sx={{
      ...darkCardBase, ...darkCardHover, height: "100%", borderRadius: "22px",
      boxShadow: "0 20px 45px rgba(3,16,32,0.20)",
      "&::before": {
        content: '""', position: "absolute", width: 180, height: 180,
        right: -90, top: -100, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(50,135,245,0.14), transparent 70%)",
        pointerEvents: "none",
      },
      "&:hover": {
        ...darkCardHover["&:hover"],
        boxShadow: "0 30px 60px rgba(3,16,32,0.35)",
        borderColor: "rgba(101,169,245,0.30)",
      },
    }}
  >
    <CardContent sx={{ p: 3.5, position: "relative", zIndex: 1 }}>
      <Box sx={{ ...blueIconBox, width: 50, height: 50, borderRadius: "14px", border: "1px solid rgba(101,169,245,0.12)", mb: 2.5 }}>
        <Icon />
      </Box>
      <Typography sx={{ color: COLORS.white, fontSize: 18, fontWeight: 800, mb: 1 }}>{title}</Typography>
      <Typography sx={{ color: "#9FB5C9", fontSize: 14, lineHeight: 1.7 }}>{description}</Typography>
      <Box sx={{ mt: 3, width: 38, height: 3, borderRadius: "10px", background: "linear-gradient(90deg, #3287F5, #67C8BC)" }} />
    </CardContent>
  </Card>
);

export const StepCard = ({ number, icon: Icon, title, description }) => (
  <Box
    sx={{
      ...darkCardBase, height: "100%", p: 3.5, borderRadius: "24px",
      background: COLORS.stepGradient, boxShadow: "0 20px 50px rgba(15,31,53,0.14)",
      "&::before": {
        content: '""', position: "absolute", width: 260, height: 260,
        right: -130, top: -150, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(50,135,245,0.14), transparent 70%)",
        pointerEvents: "none",
      },
      "&:hover": { ...darkCardHover["&:hover"], boxShadow: "0 30px 65px rgba(15,31,53,0.22)" },
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, position: "relative", zIndex: 1 }}>
      <Typography sx={{ color: "rgba(103,200,188,0.55)", fontSize: 42, fontWeight: 800, lineHeight: 1, letterSpacing: "-2px" }}>{number}</Typography>
      <Box sx={{ ...blueIconBox, width: 48, height: 48, borderRadius: "14px", border: "1px solid rgba(101,169,245,0.14)" }}><Icon /></Box>
    </Stack>
    <Typography sx={{ color: COLORS.white, fontSize: 19, fontWeight: 800, letterSpacing: "-0.3px", mb: 1.2, position: "relative", zIndex: 1 }}>{title}</Typography>
    <Typography sx={{ color: "#A9BBCD", fontSize: 14, lineHeight: 1.75, position: "relative", zIndex: 1 }}>{description}</Typography>
    <Box sx={{ mt: 3, width: 42, height: 3, borderRadius: "10px", background: "linear-gradient(90deg, #3287F5, #67C8BC)" }} />
  </Box>
);

const Cards = () => (
  <>
    <Box sx={{ bgcolor: COLORS.section, py: { xs: 7, md: 9 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {stats.map((item) => (
            <Grid key={item.number} size={{ xs: 12, md: 4 }}>
              <StatsCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

    <Box
      sx={{
        ...sectionSx, position: "relative", overflow: "hidden",
        "&::before": {
          content: '""', position: "absolute", width: 500, height: 500,
          left: -250, top: -220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(50,135,245,0.10), transparent 70%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""', position: "absolute", width: 450, height: 450,
          right: -250, bottom: -250, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(103,200,188,0.07), transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: 7 }}>
          <Typography sx={{ color: "#65A9F5", fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", mb: 1.5 }}>
            BUILT FOR BETTER HIRING
          </Typography>
          <Typography sx={{ color: "black", fontSize: { xs: "2.2rem", md: "3rem" }, fontWeight: 800, letterSpacing: "-1.5px", mb: 2 }}>
            Intelligence behind every hire.
          </Typography>
          <Typography sx={{ color: "#2e5070", maxWidth: 650, mx: "auto", lineHeight: 1.7, fontSize: 16 }}>
            Talvyn turns recruitment data into clear, actionable insights so teams can focus on finding people who actually fit.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

    <Box sx={sectionSx}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography sx={sectionLabelSx}>HOW IT WORKS</Typography>
          <Typography sx={{ color: COLORS.textDark, fontSize: { xs: "2.3rem", md: "3.2rem" }, fontWeight: 800, letterSpacing: "-1.5px" }}>
            From application to insight.
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {steps.map((step) => (
            <Grid key={step.number} size={{ xs: 12, sm: 6, md: 3 }}>
              <StepCard {...step} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  </>
);

export default Cards;
