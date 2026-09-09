import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import {
  exportBuilderResume,
  getMyBuilderResume,
} from "../../api/resumeBuilderApi";

import { ResumePreview, TEMPLATES } from "./ResumeBuilder";


/* ================================================================
   Default Resume Data
   ================================================================ */

const EMPTY_DATA = {
  template: "modern",

  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },

  summary: "",

  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
};


/* ================================================================
   Template Names
   ================================================================ */

const TEMPLATE_NAMES = {
  modern: "Modern",
  classic: "Classic",
  minimal: "Minimal",
};


export default function ResumePreviewPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);


  /* ================================================================
     Load Preview Data
     ================================================================ */

  useEffect(() => {
    let active = true;

    const loadPreview = async () => {
      try {
        /*
         * ------------------------------------------------------------
         * 1. First priority:
         *    Current unsaved data from Resume Builder
         * ------------------------------------------------------------
         */

        const stored = sessionStorage.getItem(
          "resumeBuilderPreview"
        );

        if (stored) {
          const parsed = JSON.parse(stored);

          if (active) {
            setData({
              ...EMPTY_DATA,

              ...parsed,

              personal: {
                ...EMPTY_DATA.personal,
                ...(parsed?.personal || {}),
              },

              education: Array.isArray(parsed?.education)
                ? parsed.education
                : [],

              experience: Array.isArray(parsed?.experience)
                ? parsed.experience
                : [],

              projects: Array.isArray(parsed?.projects)
                ? parsed.projects
                : [],

              skills: Array.isArray(parsed?.skills)
                ? parsed.skills
                : [],

              certifications: Array.isArray(
                parsed?.certifications
              )
                ? parsed.certifications
                : [],

              achievements: Array.isArray(
                parsed?.achievements
              )
                ? parsed.achievements
                : [],
            });
          }

          return;
        }


        /*
         * ------------------------------------------------------------
         * 2. Fallback:
         *    Load saved resume from backend
         * ------------------------------------------------------------
         */

        const existing = await getMyBuilderResume();

        if (existing && active) {
          setData({
            ...EMPTY_DATA,

            ...existing,

            personal: {
              ...EMPTY_DATA.personal,
              ...(existing.personal || {}),
            },

            education: Array.isArray(existing.education)
              ? existing.education
              : [],

            experience: Array.isArray(existing.experience)
              ? existing.experience
              : [],

            projects: Array.isArray(existing.projects)
              ? existing.projects
              : [],

            skills: Array.isArray(existing.skills)
              ? existing.skills
              : [],

            certifications: Array.isArray(
              existing.certifications
            )
              ? existing.certifications
              : [],

            achievements: Array.isArray(
              existing.achievements
            )
              ? existing.achievements
              : [],
          });
        }
      } catch (error) {
        console.error(
          "Resume preview loading error:",
          error
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      active = false;
    };
  }, []);


  /* ================================================================
     Current Template
     ================================================================ */

  const tpl = useMemo(() => {
    return (
      TEMPLATES.find(
        (template) => template.id === data.template
      ) || TEMPLATES[0]
    );
  }, [data.template]);


  const templateName =
    TEMPLATE_NAMES[data.template] ||
    tpl?.name ||
    "Modern";


  /* ================================================================
     Back To Builder
     ================================================================ */

  const handleBack = () => {
    navigate("/applicant/resume-builder");
  };


  /* ================================================================
     Download Resume
     ================================================================ */

  const handleDownload = async () => {
    if (!data) return;

    setDownloading(true);

    try {
      const response = await exportBuilderResume(data);

      const url = response?.url;

      if (!url) {
        throw new Error(
          "No file URL returned from export API"
        );
      }

      /*
       * Open generated S3 PDF in a new tab.
       */
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(
        "Resume export error:",
        error
      );
    } finally {
      setDownloading(false);
    }
  };


  /* ================================================================
     Loading Screen
     ================================================================ */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Stack
          alignItems="center"
          spacing={2}
        >
          <CircularProgress />

          <Typography
            color="text.secondary"
            sx={{ fontSize: 14 }}
          >
            Loading resume preview...
          </Typography>
        </Stack>
      </Box>
    );
  }


  /* ================================================================
     Preview Page
     ================================================================ */

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "background.default",
        color: "text.primary",
      }}
    >

      {/* ============================================================
          TOP TOOLBAR
          ============================================================ */}

      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,

          width: "100%",

          bgcolor: "background.paper",

          borderBottom: "1px solid",
          borderColor: "divider",

          boxShadow:
            theme.palette.mode === "dark"
              ? "0 2px 12px rgba(0,0,0,0.25)"
              : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",

            px: {
              xs: 1.5,
              sm: 3,
              md: 4,
            },

            py: 1.25,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1.5}
          >

            {/* ======================================================
                BACK BUTTON
                ====================================================== */}

            <Button
              variant="outlined"
              size="small"
              startIcon={
                <ArrowBackRoundedIcon
                  fontSize="small"
                />
              }
              onClick={handleBack}
              sx={{
                borderRadius: 1.5,

                px: {
                  xs: 1.1,
                  sm: 1.6,
                },

                py: 0.8,

                fontSize: {
                  xs: 12,
                  sm: 13,
                },

                minWidth: "auto",

                whiteSpace: "nowrap",
              }}
            >
              <Box
                component="span"
                sx={{
                  display: {
                    xs: "none",
                    sm: "inline",
                  },
                }}
              >
                Back to Builder
              </Box>

              <Box
                component="span"
                sx={{
                  display: {
                    xs: "inline",
                    sm: "none",
                  },
                }}
              >
                Back
              </Box>
            </Button>


            {/* ======================================================
                CENTER TITLE
                ====================================================== */}

            <Box
              sx={{
                flex: 1,

                textAlign: "center",

                minWidth: 0,

                px: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: 14,
                    sm: 15,
                  },

                  fontWeight: 700,

                  lineHeight: 1.2,

                  color: "text.primary",

                  whiteSpace: "nowrap",

                  overflow: "hidden",

                  textOverflow: "ellipsis",
                }}
              >
                Resume Preview
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,

                  color: "text.secondary",

                  mt: 0.3,

                  whiteSpace: "nowrap",
                }}
              >
                {templateName} Template
              </Typography>
            </Box>


            {/* ======================================================
                DOWNLOAD BUTTON
                ====================================================== */}

            <Button
              variant="contained"
              size="small"
              startIcon={
                downloading ? (
                  <CircularProgress
                    size={15}
                    color="inherit"
                  />
                ) : (
                  <DownloadRoundedIcon
                    fontSize="small"
                  />
                )
              }
              onClick={handleDownload}
              disabled={downloading}
              sx={{
                borderRadius: 1.5,

                px: {
                  xs: 1.1,
                  sm: 1.7,
                },

                py: 0.8,

                fontSize: {
                  xs: 12,
                  sm: 13,
                },

                minWidth: "auto",

                whiteSpace: "nowrap",
              }}
            >
              <Box
                component="span"
                sx={{
                  display: {
                    xs: "none",
                    sm: "inline",
                  },
                }}
              >
                {downloading
                  ? "Preparing..."
                  : "Download Resume"}
              </Box>

              <Box
                component="span"
                sx={{
                  display: {
                    xs: "inline",
                    sm: "none",
                  },
                }}
              >
                {downloading
                  ? "..."
                  : "Download"}
              </Box>
            </Button>

          </Stack>
        </Box>
      </Box>


      {/* ============================================================
          PREVIEW BACKGROUND
          ============================================================ */}

      <Box
        component="main"
        sx={{
          width: "100%",

          bgcolor:
            theme.palette.mode === "dark"
              ? "#111827"
              : "#eef1f5",

          px: {
            xs: 0,
            sm: 2,
            md: 4,
          },

          py: {
            xs: 0,
            sm: 3,
            md: 4,
          },
        }}
      >

        {/* ==========================================================
            RESUME CONTAINER
            ========================================================== */}

        <Box
          sx={{
            width: "100%",

            maxWidth: 850,

            mx: "auto",

            /*
             * IMPORTANT:
             * Do NOT use minHeight: 100vh here.
             * Resume height will be based on content.
             */

            height: "fit-content",
          }}
        >

          {/* ========================================================
              RESUME PAPER
              ======================================================== */}

          <Box
            sx={{
              width: "100%",

              bgcolor: "#ffffff",

              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "#d1d5db"
                  : "#dfe3e8",

              borderRadius: {
                xs: 0,
                sm: 1.5,
              },

              overflow: "hidden",

              boxShadow: {
                xs: "none",

                sm:
                  theme.palette.mode === "dark"
                    ? "0 12px 40px rgba(0,0,0,0.40)"
                    : "0 12px 40px rgba(0,0,0,0.14)",
              },

              /*
               * Prevent accidental fixed height.
               */
              height: "fit-content",
            }}
          >

            <ResumePreview
              data={data}
              tpl={tpl}
              fullPage
            />

          </Box>
        </Box>
      </Box>
    </Box>
  );
}