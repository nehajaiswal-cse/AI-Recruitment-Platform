
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import {
  AutoAwesome,
  Bolt,
} from "@mui/icons-material";

import {
  stats,
  features,
  steps,
  matchRows,
} from "../../pages/homeData";


// ======================================================
// Match Row
// ======================================================

export const MatchRow = ({ label, value }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ mb: 2.3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 0.9,
        }}
      >
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 12.5,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            color: theme.palette.text.primary,
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
          bgcolor: isDark
            ? "#263E59"
            : "#D9E3EC",
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
};


// ======================================================
// AI Match Card
// ======================================================

export const AIMatchCard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 570,
        mx: "auto",
        p: { xs: 3, md: 4 },
        borderRadius: "26px",

        background: isDark
          ? "linear-gradient(145deg, #142A45 0%, #10223A 100%)"
          : "#FFFFFF",

        border: isDark
          ? "1px solid rgba(112,167,194,0.25)"
          : "1px solid rgba(15,23,42,0.10)",

        boxShadow: isDark
          ? "0 35px 80px rgba(3,16,32,0.35)"
          : "0 20px 50px rgba(15,23,42,0.10)",

        position: "relative",
        overflow: "hidden",

        transition: "all 0.3s ease",

        "&:hover": {
          transform: "translateY(-5px)",

          boxShadow: isDark
            ? "0 40px 90px rgba(3,16,32,0.45)"
            : "0 25px 60px rgba(15,23,42,0.14)",
        },

        "&::before": {
          content: '""',
          position: "absolute",
          width: 350,
          height: 350,
          right: -180,
          top: -190,
          borderRadius: "50%",

          background: isDark
            ? "radial-gradient(circle, rgba(55,136,210,0.16), transparent 70%)"
            : "radial-gradient(circle, rgba(50,135,245,0.07), transparent 70%)",

          pointerEvents: "none",
        },
      }}
    >

      {/* Header */}

      <Box
        sx={{
          display: "flex",
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
              width: 38,
              height: 38,
              borderRadius: "11px",

              bgcolor: isDark
                ? "rgba(103,200,188,0.12)"
                : "rgba(38,156,141,0.10)",

              color: "#269C8D",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              flexShrink: 0,
            }}
          >
            <AutoAwesome sx={{ fontSize: 20 }} />
          </Box>

          <Typography
            sx={{
              color: theme.palette.text.primary,
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

            bgcolor: isDark
              ? "rgba(103,200,188,0.13)"
              : "rgba(38,156,141,0.10)",

            color: "#269C8D",

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
          color: theme.palette.text.secondary,
          fontSize: 13,
          mt: 1,
          mb: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        Senior Product Designer
      </Typography>


      <Divider
        sx={{
          borderColor: theme.palette.divider,
          mb: 3,
        }}
      />


      {/* Candidate */}

      <Box
        sx={{
          p: 2.5,
          borderRadius: "17px",

          bgcolor: isDark
            ? "rgba(41,70,101,0.65)"
            : "#F2F6FA",

          border: isDark
            ? "1px solid rgba(120,163,197,0.20)"
            : "1px solid rgba(15,23,42,0.08)",

          position: "relative",
          zIndex: 1,
        }}
      >

        <Box
          sx={{
            display: "flex",
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

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              color: "#FFFFFF",
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
                color: theme.palette.text.primary,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Alex Morgan
            </Typography>

            <Typography
              sx={{
                color: theme.palette.text.secondary,
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
              color: "#269C8D",
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

          bgcolor: isDark
            ? "rgba(76,140,178,0.13)"
            : "rgba(38,156,141,0.07)",

          display: "flex",
          alignItems: "center",
          gap: 1.5,

          position: "relative",
          zIndex: 1,
        }}
      >
        <Bolt
          sx={{
            color: "#269C8D",
            fontSize: 20,
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 12.5,
          }}
        >
          Strong match: 8 of 9 key requirements found.
        </Typography>
      </Box>

    </Paper>
  );
};


// ======================================================
// Stats Card
// ======================================================

export const StatsCard = ({
  number,
  title,
  label,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        minHeight: 220,
        borderRadius: "25px",

        bgcolor: theme.palette.background.paper,

        color: theme.palette.text.primary,

        border: `1px solid ${theme.palette.divider}`,

        boxShadow:
          theme.palette.mode === "dark"
            ? "0 20px 50px rgba(3,16,32,0.20)"
            : "0 20px 50px rgba(15,23,42,0.08)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 4 }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {label}
        </Typography>

        <Box
          sx={{
            px: 1.5,
            py: 0.6,
            borderRadius: "20px",

            bgcolor:
              "rgba(38,156,141,0.10)",

            color: "#269C8D",

            fontSize: 11,
            fontWeight: 700,
          }}
        >
          Live insights
        </Box>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <Typography
          sx={{
            fontSize: 58,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: "-3px",
          }}
        >
          {number}
        </Typography>

        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 15,
            lineHeight: 1.5,
            maxWidth: 150,
          }}
        >
          {title}
        </Typography>
      </Stack>
    </Paper>
  );
};


// ======================================================
// Feature Card
// ======================================================

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: "22px",

        bgcolor: theme.palette.background.paper,

        border: `1px solid ${theme.palette.divider}`,

        boxShadow:
          theme.palette.mode === "dark"
            ? "0 20px 45px rgba(3,16,32,0.20)"
            : "0 20px 45px rgba(15,23,42,0.07)",

        transition: "all 0.3s ease",

        "&:hover": {
          transform: "translateY(-6px)",

          boxShadow:
            theme.palette.mode === "dark"
              ? "0 30px 60px rgba(3,16,32,0.35)"
              : "0 30px 60px rgba(15,23,42,0.12)",

          borderColor:
            "rgba(103,200,188,0.35)",
        },
      }}
    >
      <CardContent sx={{ p: 3.5 }}>

        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: "14px",

            bgcolor:
              "rgba(50,135,245,0.10)",

            color: "#3287F5",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            mb: 2.5,
          }}
        >
          {Icon && <Icon />}
        </Box>

        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: 18,
            fontWeight: 800,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            mt: 3,
            width: 38,
            height: 3,
            borderRadius: "10px",

            background:
              "linear-gradient(90deg, #3287F5, #67C8BC)",
          }}
        />
      </CardContent>
    </Card>
  );
};


// ======================================================
// Step Card
// ======================================================

export const StepCard = ({
  number,
  icon: Icon,
  title,
  description,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100%",
        p: 3.5,
        borderRadius: "24px",

        bgcolor: theme.palette.background.paper,

        border: `1px solid ${theme.palette.divider}`,

        boxShadow:
          theme.palette.mode === "dark"
            ? "0 20px 50px rgba(3,16,32,0.20)"
            : "0 20px 50px rgba(15,23,42,0.07)",

        transition: "all 0.3s ease",

        "&:hover": {
          transform: "translateY(-6px)",

          boxShadow:
            theme.palette.mode === "dark"
              ? "0 30px 65px rgba(3,16,32,0.30)"
              : "0 30px 65px rgba(15,23,42,0.12)",
        },
      }}
    >

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography
          sx={{
            color: "rgba(38,156,141,0.65)",
            fontSize: 42,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-2px",
          }}
        >
          {number}
        </Typography>

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",

            bgcolor:
              "rgba(50,135,245,0.10)",

            color: "#3287F5",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Icon && <Icon />}
        </Box>
      </Stack>

      <Typography
        sx={{
          color: theme.palette.text.primary,
          fontSize: 19,
          fontWeight: 800,
          letterSpacing: "-0.3px",
          mb: 1.2,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: 14,
          lineHeight: 1.75,
        }}
      >
        {description}
      </Typography>

      <Box
        sx={{
          mt: 3,
          width: 42,
          height: 3,
          borderRadius: "10px",

          background:
            "linear-gradient(90deg, #3287F5, #67C8BC)",
        }}
      />
    </Box>
  );
};


// ======================================================
// Cards Section
// ======================================================

const Cards = () => {
  const theme = useTheme();

  return (
    <>
      {/* Stats */}

      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          py: { xs: 7, md: 9 },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {stats.map((item) => (
              <Grid
                key={item.number}
                size={{ xs: 12, md: 4 }}
              >
                <StatsCard {...item} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      {/* Features */}

      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          py: { xs: 8, md: 11 },
        }}
      >
        <Container maxWidth="xl">

          <Box
            sx={{
              textAlign: "center",
              mb: 7,
            }}
          >
            <Typography
              sx={{
                color: "#3287F5",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "1.5px",
                mb: 1.5,
              }}
            >
              BUILT FOR BETTER HIRING
            </Typography>

            <Typography
              sx={{
                color: theme.palette.text.primary,
                fontSize: {
                  xs: "2.2rem",
                  md: "3rem",
                },
                fontWeight: 800,
                letterSpacing: "-1.5px",
                mb: 2,
              }}
            >
              Intelligence behind every hire.
            </Typography>

            <Typography
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 650,
                mx: "auto",
                lineHeight: 1.7,
                fontSize: 16,
              }}
            >
              Talvyn turns recruitment data into clear,
              actionable insights so teams can focus on
              finding people who actually fit.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid
                key={feature.title}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>

        </Container>
      </Box>


      {/* How It Works */}

      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          py: { xs: 8, md: 11 },
        }}
      >
        <Container maxWidth="xl">

          <Box
            sx={{
              textAlign: "center",
              mb: 8,
            }}
          >
            <Typography
              sx={{
                color: "#269C8D",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "1.5px",
                mb: 1.5,
              }}
            >
              HOW IT WORKS
            </Typography>

            <Typography
              sx={{
                color: theme.palette.text.primary,
                fontSize: {
                  xs: "2.3rem",
                  md: "3.2rem",
                },
                fontWeight: 800,
                letterSpacing: "-1.5px",
              }}
            >
              From application to insight.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {steps.map((step) => (
              <Grid
                key={step.number}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <StepCard {...step} />
              </Grid>
            ))}
          </Grid>

        </Container>
      </Box>
    </>
  );
};


export default Cards;