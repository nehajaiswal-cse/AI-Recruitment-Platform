import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiBriefcase,
  FiUserCheck,
  FiCpu,
} from "react-icons/fi";

import { Box, Typography, useTheme } from "@mui/material";

import useAuth from "../../hooks/UseAuth";

const LoginForm = ({ role = "applicant" }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const isRecruiter = role === "recruiter";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role,
      };

      const res = await login(payload);

      console.log("LOGIN RESPONSE:", res);

      // Make sure backend actually returns the logged-in user
      const loggedInRole = res?.user?.role;

      if (loggedInRole && loggedInRole !== role) {
        setError(
          `This account is registered as a ${loggedInRole}, not a ${role}.`
        );
        return;
      }

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        if (role === "recruiter") {
          navigate("/recruiter");
        } else {
          navigate("/applicant");
        }
      }, 500);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "1fr 1fr",
        },
        gap: {
          xs: 3,
          lg: 6,
        },
        alignItems: "center",
        px: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      {/* =====================================================
          LEFT SIDE
      ====================================================== */}
      <Box
        sx={{
          display: {
            xs: "none",
            lg: "block",
          },
          pr: 3,
        }}
      >
        {/* AI PLATFORM BADGE */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.8,
            borderRadius: 10,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(59,130,246,0.10)"
                : "rgba(59,130,246,0.08)",
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(59,130,246,0.30)"
                : "rgba(59,130,246,0.25)",
            color: theme.palette.primary.main,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <FiCpu
            style={{
              fontSize: "18px",
            }}
          />

          <Typography
            component="span"
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: theme.palette.primary.main,
            }}
          >
            AI Recruitment Platform
          </Typography>
        </Box>

        {/* TITLE */}
        <Typography
          component="h1"
          sx={{
            mt: 4,
            fontSize: {
              lg: "48px",
              xl: "56px",
            },
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            color: "text.primary",
          }}
        >
          Welcome back to
        </Typography>

        <Typography
          component="div"
          sx={{
            fontSize: {
              lg: "48px",
              xl: "56px",
            },
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            background:
              "linear-gradient(135deg, #3b82f6, #9333ea)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Talvyn
        </Typography>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            mt: 3,
            maxWidth: 600,
            fontSize: 18,
            lineHeight: 1.7,
            color: "text.secondary",
          }}
        >
          {isRecruiter
            ? "Manage candidates, create job openings, and use AI-powered candidate matching."
            : "Discover opportunities, improve your resume, and find jobs matched to your skills."}
        </Typography>

        {/* =====================================================
            FEATURE 1
        ====================================================== */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 24px rgba(0,0,0,0.20)"
                : "0 8px 24px rgba(15,23,42,0.08)",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              minWidth: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #3b82f6, #9333ea)",
              color: "#fff",
            }}
          >
            {isRecruiter ? (
              <FiUserCheck size={22} />
            ) : (
              <FiBriefcase size={22} />
            )}
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {isRecruiter
                ? "Smart Candidate Screening"
                : "AI-Powered Job Matching"}
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: 14,
                color: "text.secondary",
              }}
            >
              {isRecruiter
                ? "Analyze and rank candidates using AI"
                : "Find opportunities based on your skills"}
            </Typography>
          </Box>
        </Box>

        {/* =====================================================
            FEATURE 2
        ====================================================== */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 24px rgba(0,0,0,0.20)"
                : "0 8px 24px rgba(15,23,42,0.08)",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              minWidth: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #3b82f6, #9333ea)",
              color: "#fff",
            }}
          >
            {isRecruiter ? (
              <FiBriefcase size={22} />
            ) : (
              <FiUserCheck size={22} />
            )}
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {isRecruiter
                ? "Recruitment Management"
                : "Career Management"}
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: 14,
                color: "text.secondary",
              }}
            >
              {isRecruiter
                ? "Manage jobs and application pipelines"
                : "Track applications and improve your profile"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* =====================================================
          RIGHT SIDE - LOGIN CARD
      ====================================================== */}
      <Box>
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: {
              xs: 3,
              sm: 4,
            },
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 20px 50px rgba(0,0,0,0.30)"
                : "0 20px 50px rgba(15,23,42,0.10)",
          }}
        >
          {/* ROLE BADGE */}
          <Box
            sx={{
              display: "inline-flex",
              px: 1.5,
              py: 0.6,
              borderRadius: 10,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(59,130,246,0.12)"
                  : "rgba(59,130,246,0.08)",
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(59,130,246,0.35)"
                  : "rgba(59,130,246,0.25)",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              {isRecruiter ? "Recruiter" : "Applicant"}
            </Typography>
          </Box>

          {/* HEADER */}
          <Box sx={{ mt: 2 }}>
            <Typography
              component="h2"
              sx={{
                fontSize: {
                  xs: 28,
                  sm: 32,
                },
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Sign In
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 14,
                color: "text.secondary",
              }}
            >
              {isRecruiter
                ? "Sign in to manage your recruitment workspace."
                : "Sign in to access your applicant dashboard."}
            </Typography>
          </Box>

          {/* =====================================================
              ERROR
          ====================================================== */}
          {error && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(239,68,68,0.08)",
                border: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(239,68,68,0.35)"
                    : "rgba(239,68,68,0.25)",
              }}
            >
              <FiAlertCircle
                size={20}
                style={{
                  color: theme.palette.error.main,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />

              <Typography
                sx={{
                  fontSize: 14,
                  color: theme.palette.error.main,
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          {/* =====================================================
              SUCCESS
          ====================================================== */}
          {success && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(16,185,129,0.12)"
                    : "rgba(16,185,129,0.08)",
                border: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(16,185,129,0.35)"
                    : "rgba(16,185,129,0.25)",
              }}
            >
              <FiCheckCircle
                size={20}
                style={{
                  color: theme.palette.success.main,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />

              <Typography
                sx={{
                  fontSize: 14,
                  color: theme.palette.success.main,
                }}
              >
                {success}
              </Typography>
            </Box>
          )}

          {/* =====================================================
              FORM
          ====================================================== */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              mt: 3,
            }}
          >
            {/* EMAIL */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                component="label"
                htmlFor="email"
                sx={{
                  display: "block",
                  mb: 1,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  color: "text.secondary",
                }}
              >
                EMAIL ADDRESS
              </Typography>

              <Box
                sx={{
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "text.secondary",
                    zIndex: 1,
                    display: "flex",
                  }}
                >
                  <FiMail size={19} />
                </Box>

                <Box
                  component="input"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={
                    isRecruiter
                      ? "hr@company.com"
                      : "you@example.com"
                  }
                  sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    height: 64,
                    pl: 6,
                    pr: 2,
                    borderRadius: 2,
                    outline: "none",
                    fontSize: 16,
                    fontFamily: "inherit",
                    color: "text.primary",
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "#182235"
                        : "#f1f5f9",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s ease",

                    "&::placeholder": {
                      color: "text.secondary",
                      opacity: 1,
                    },

                    "&:focus": {
                      borderColor: "primary.main",
                      boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* PASSWORD */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  component="label"
                  htmlFor="password"
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "1px",
                    color: "text.secondary",
                  }}
                >
                  PASSWORD
                </Typography>

                <Link
                  to="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    color: theme.palette.warning.main,
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Box
                sx={{
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "text.secondary",
                    zIndex: 1,
                    display: "flex",
                  }}
                >
                  <FiLock size={19} />
                </Box>

                <Box
                  component="input"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    height: 64,
                    pl: 6,
                    pr: 6,
                    borderRadius: 2,
                    outline: "none",
                    fontSize: 16,
                    fontFamily: "inherit",
                    color: "text.primary",
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "#182235"
                        : "#f1f5f9",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s ease",

                    "&::placeholder": {
                      color: "text.secondary",
                      opacity: 1,
                    },

                    "&:focus": {
                      borderColor: "primary.main",
                      boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
                    },
                  }}
                />

                {/* SHOW / HIDE PASSWORD */}
                <Box
                  component="button"
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: 0,
                    bgcolor: "transparent",
                    color: "text.secondary",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 0.5,

                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {showPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </Box>
              </Box>
            </Box>

            {/* =====================================================
                SUBMIT BUTTON
            ====================================================== */}
            <Box
              component="button"
              type="submit"
              disabled={loading}
              sx={{
                width: "100%",
                height: 64,
                border: 0,
                borderRadius: 2,
                background:
                  "linear-gradient(90deg, #3b82f6, #9333ea)",
                color: "#fff",
                fontSize: 17,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                opacity: loading ? 0.55 : 1,
                transition: "all 0.2s ease",
                boxShadow:
                  "0 8px 20px rgba(59,130,246,0.20)",

                "&:hover": {
                  opacity: loading ? 0.55 : 0.92,
                  transform: loading
                    ? "none"
                    : "translateY(-1px)",
                  boxShadow:
                    "0 10px 24px rgba(59,130,246,0.28)",
                },

                "&:disabled": {
                  cursor: "not-allowed",
                },
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "loginSpin 0.8s linear infinite",

                    "@keyframes loginSpin": {
                      from: {
                        transform: "rotate(0deg)",
                      },
                      to: {
                        transform: "rotate(360deg)",
                      },
                    },
                  }}
                />
              ) : (
                <>
                  <Typography
                    component="span"
                    sx={{
                      color: "#fff",
                      fontSize: 17,
                      fontWeight: 600,
                    }}
                  >
                    Sign In
                  </Typography>

                  <FiArrowRight size={20} />
                </>
              )}
            </Box>
          </Box>

          {/* =====================================================
              REGISTER
          ====================================================== */}
          <Box
            sx={{
              mt: 3,
              textAlign: "center",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: 14,
                color: "text.secondary",
              }}
            >
              Don't have an account?{" "}
            </Typography>

            <Link
              to={
                isRecruiter
                  ? "/recruiter/register"
                  : "/applicant/register"
              }
              style={{
                color: theme.palette.warning.main,
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              Create account
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;






