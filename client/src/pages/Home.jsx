
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
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
  ArrowForward,
  AutoAwesome,
  Bolt,
  CheckCircle,
  Warning,
} from "@mui/icons-material";

import Navbar from "../components/dashboard/Navbar";
import {AIMatchCard}  from "../components/common/Cards";
import Footer from "../components/common/Footer";

import {
  explainableBullets,
  insightRows,
  audiences,
} from "./homeData";

import {
  primaryButtonSx,
  outlineButtonSx,
  tealIconBox,
  darkCardBase,
  darkCardHover,
} from "./homeStyles";

// ================= Hero =================
const Hero = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at 85% 25%, rgba(45,105,180,0.18), transparent 30%), #0F1F35"
            : "radial-gradient(circle at 85% 25%, rgba(59,130,246,0.10), transparent 30%), #f8fafc",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          right: -250,
          top: 80,
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(56,139,224,0.12), transparent 70%)"
              : "radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          py: { xs: 8, md: 12 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 6, md: 8 }}
          sx={{ alignItems: "center" }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.8,
                py: 0.9,
                borderRadius: "30px",
                border:
                  "1px solid rgba(63,145,224,0.38)",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(35,102,171,0.10)"
                    : "rgba(59,130,246,0.08)",
                color: theme.palette.primary.light,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "1.5px",
                mb: 3,
              }}
            >
              <AutoAwesome sx={{ fontSize: 17 }} />
              AI-POWERED RECRUITING
            </Box>

            <Typography
              component="h1"
              sx={{
                fontSize: {
                  xs: "3.5rem",
                  sm: "4.5rem",
                  md: "5.3rem",
                },
                lineHeight: 0.98,
                letterSpacing: "-4px",
                fontWeight: 800,
                color: theme.palette.text.primary,
                mb: 3,
              }}
            >
              Hire people
              <br />
              who move
              <br />
              your business
              <br />
              <Box
                component="span"
                sx={{
                  color: "#269C8D",
                }}
              >
                forward.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 620,
                color: theme.palette.text.secondary,
                fontSize: { xs: 17, md: 20 },
                lineHeight: 1.65,
                mb: 4,
              }}
            >
              Talvyn helps modern teams discover the right talent faster
              with intelligent matching, clear insights, and a hiring
              workflow people actually enjoy using.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
            >
              <Button
                onClick={() =>
                  navigate("/recruiter/login")
                }
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  ...primaryButtonSx,
                  px: 3.5,
                  py: 1.6,
                  borderRadius: "12px",
                }}
              >
                Start hiring
              </Button>

              <Button
                variant="outlined"
                size="large"
                sx={{
                  ...outlineButtonSx,
                  px: 3.5,
                  py: 1.6,
                  borderRadius: "12px",
                }}
              >
                See how it works
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AIMatchCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// ================= Cards =================

const Cards = () => {
  const theme = useTheme();

  const features = [
    {
      title: "Resume Analysis",
      description:
        "Automatically extract skills, experience, education and projects from resumes.",
    },
    {
      title: "Smart Matching",
      description:
        "Match candidates with jobs using intelligent skill and experience analysis.",
    },
    {
      title: "Candidate Ranking",
      description:
        "Rank candidates based on how closely they match the job requirements.",
    },
    {
      title: "AI Insights",
      description:
        "Get clear explanations about why a candidate matches a particular role.",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
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
              color: "#269C8D",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "1.5px",
              mb: 1.5,
            }}
          >
            INTELLIGENT RECRUITMENT
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
            Everything you need to hire better.
          </Typography>

          <Typography
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 650,
              mx: "auto",
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            Talvyn combines AI-powered resume analysis, candidate
            matching and explainable insights into one simple workflow.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid
              key={feature.title}
              size={{ xs: 12, sm: 6, md: 3 }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: "22px",
                  backgroundColor:
                    theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.3s ease",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor:
                      "rgba(103,200,188,0.35)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 20px 50px rgba(3,16,32,0.25)"
                        : "0 20px 50px rgba(15,23,42,0.10)",
                  },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "13px",
                      bgcolor:
                        "rgba(103,200,188,0.10)",
                      color: "#269C8D",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      fontWeight: 800,
                    }}
                  >
                    <AutoAwesome />
                  </Box>

                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      fontSize: 18,
                      fontWeight: 800,
                      mb: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// ================= Explainable AI =================

const Bullet = ({ text }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <CheckCircle
        sx={{
          fontSize: 20,
          color: "#269C8D",
          flexShrink: 0,
        }}
      />

      <Typography
        sx={{
          color: theme.palette.text.primary,
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

const InsightRow = ({ text, success = false }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: "9px",
          bgcolor: success
            ? "rgba(103,200,188,0.12)"
            : "rgba(232,156,80,0.12)",
          color: success ? "#269C8D" : "#E6A15F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {success ? (
          <CheckCircle sx={{ fontSize: 17 }} />
        ) : (
          <Warning sx={{ fontSize: 17 }} />
        )}
      </Box>

      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: 14,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

const InsightCard = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: "26px",
        backgroundColor:
          theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 25px 60px rgba(15,31,53,0.16)"
            : "0 25px 60px rgba(15,23,42,0.08)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box
          sx={{
            ...tealIconBox,
            width: 42,
            height: 42,
            borderRadius: "12px",
            flexShrink: 0,
          }}
        >
          <AutoAwesome />
        </Box>

        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: 19,
            fontWeight: 800,
          }}
        >
          Why this candidate matches
        </Typography>
      </Box>

      {/* Description */}
      <Box
        sx={{
          p: 2.5,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.045)"
              : "rgba(15,23,42,0.035)",
          borderRadius: "15px",
          border: `1px solid ${theme.palette.divider}`,
          mb: 3,
        }}
      >
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 14,
            lineHeight: 1.8,
          }}
        >
          Strong technical alignment with the role. The candidate has
          extensive experience with React, Node.js and MongoDB and has
          completed multiple relevant projects.
        </Typography>
      </Box>

      {/* Insights */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {insightRows.map((row) => (
          <InsightRow
            key={row.text}
            text={row.text}
            success={row.success}
          />
        ))}
      </Box>
    </Paper>
  );
};

const ExplainableAI = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.background.default,
        py: { xs: 8, md: 11 },
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={8}
          sx={{
            alignItems: "center",
          }}
        >
          {/* Left Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.8,
                borderRadius: "20px",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(103,200,188,0.12)"
                    : "#E5F5F3",
                color: "#269C8D",
                fontSize: 12,
                fontWeight: 800,
                mb: 2,
              }}
            >
              <Bolt sx={{ fontSize: 16 }} />
              EXPLAINABLE AI
            </Box>

            <Typography
              sx={{
                color: theme.palette.text.primary,
                fontSize: {
                  xs: "2.3rem",
                  md: "3.2rem",
                },
                lineHeight: 1.05,
                letterSpacing: "-2px",
                fontWeight: 800,
                mb: 3,
              }}
            >
              Don't just get
              <br />
              a score.
              <br />
              Understand why.
            </Typography>

            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: 17,
                lineHeight: 1.75,
                maxWidth: 560,
                mb: 4,
              }}
            >
              Traditional applicant tracking systems tell you who
              applied. Talvyn explains who fits your requirements and why.
            </Typography>

            <Stack spacing={2}>
              {explainableBullets.map((text) => (
                <Bullet
                  key={text}
                  text={text}
                />
              ))}
            </Stack>
          </Grid>

          {/* Right Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InsightCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// ================= Audience Section =================

const AudienceCard = ({
  icon: Icon,
  title,
  description,
  bullets,
  button,
  path,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        ...darkCardBase,
        ...darkCardHover,
        height: "100%",
        borderRadius: "26px",
        backgroundColor:
          theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 30px 70px rgba(3,16,32,0.28)"
            : "0 30px 70px rgba(15,23,42,0.10)",
        position: "relative",
        overflow: "hidden",

        "&::before": {
          content: '""',
          position: "absolute",
          width: 320,
          height: 320,
          right: -160,
          top: -180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(50,135,245,0.13), transparent 70%)",
          pointerEvents: "none",
        },

        "&:hover": {
          ...darkCardHover["&:hover"],
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 35px 80px rgba(3,16,32,0.38)"
              : "0 35px 80px rgba(15,23,42,0.14)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 3, md: 4 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box
            sx={{
              ...tealIconBox,
              width: 55,
              height: 55,
              borderRadius: "15px",
              border:
                "1px solid rgba(103,200,188,0.12)",
            }}
          >
            <Icon />
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 0.7,
              borderRadius: "20px",
              bgcolor:
                "rgba(103,200,188,0.10)",
              color: "#269C8D",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            TALVYN AI
          </Box>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: {
              xs: 25,
              md: 28,
            },
            fontWeight: 800,
            letterSpacing: "-0.8px",
            mb: 1.5,
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 15,
            lineHeight: 1.7,
            mb: 3,
            maxWidth: 500,
          }}
        >
          {description}
        </Typography>

        <Divider
          sx={{
            borderColor: theme.palette.divider,
            mb: 3,
          }}
        />

        {/* Bullets */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.7,
            mb: 4,
          }}
        >
          {bullets.map((item) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  bgcolor:
                    "rgba(103,200,188,0.10)",
                  color: "#269C8D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CheckCircle sx={{ fontSize: 17 }} />
              </Box>

              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Button */}
        <Button
          onClick={() => navigate(path)}
          variant="contained"
          endIcon={<ArrowForward />}
          sx={{
            ...primaryButtonSx,
            px: 2.8,
            py: 1.3,
            boxShadow:
              "0 10px 25px rgba(50,135,245,0.20)",

            "&:hover": {
              boxShadow:
                "0 12px 30px rgba(50,135,245,0.30)",
            },
          }}
        >
          {button}
        </Button>
      </CardContent>
    </Card>
  );
};

const AudienceSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.background.default,
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
              color: theme.palette.text.primary,
              fontSize: {
                xs: "2.3rem",
                md: "3rem",
              },
              fontWeight: 800,
              letterSpacing: "-1.5px",
            }}
          >
            Built for both sides of hiring.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {audiences.map((audience) => (
            <Grid
              key={audience.title}
              size={{ xs: 12, md: 6 }}
            >
              <AudienceCard {...audience} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// ================= CTA =================

const CTA = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? "#0F1F35"
            : theme.palette.background.paper,
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "2.5rem",
                md: "3.5rem",
              },
              fontWeight: 800,
              letterSpacing: "-2px",
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Ready to hire smarter?
          </Typography>

          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: 17,
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            Find better opportunities or discover exceptional talent with
            Talvyn's intelligent recruitment platform.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              onClick={() =>
                navigate("/recruiter/login")
              }
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                ...primaryButtonSx,
                px: 4,
                py: 1.6,
              }}
            >
              Start hiring
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                ...outlineButtonSx,
                px: 4,
                py: 1.6,
              }}
            >
              Explore platform
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// ================= Home =================

const Home = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor:
          theme.palette.background.default,
        color: theme.palette.text.primary,
        overflow: "hidden",
      }}
    >
      <Navbar />

      <Hero />

      <Cards />

      <ExplainableAI />

      <AudienceSection />

      <CTA />

      <Footer />
    </Box>
  );
};

export default Home;