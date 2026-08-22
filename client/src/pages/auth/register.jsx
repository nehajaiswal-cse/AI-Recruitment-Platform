import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiBriefcase,
  FiUserCheck,
  FiCheck,
} from "react-icons/fi";

import useAuth from "../../hooks/UseAuth";

import { brandGradient } from "../../theme";

const RegisterForm = ({ role = "applicant" }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { register } = useAuth();

  const isRecruiter = role === "recruiter";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);

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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError(
        "You must agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      };

      const res = await register(payload);

      console.log("REGISTER RESPONSE:", res);

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        if (role === "recruiter") {
          navigate("/recruiter/login");
        } else {
          navigate("/applicant/login");
        }
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.message ||
          "Registration failed. Email might already be registered."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.background.surface,

      "& fieldset": {
        borderColor: theme.palette.divider,
      },

      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },

      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },

    "& .MuiInputBase-input": {
      color: theme.palette.text.primary,
    },

    "& .MuiInputBase-input::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 1,
    },

    "& .MuiInputAdornment-root": {
      color: theme.palette.text.secondary,
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 5,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#60a5fa",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {isRecruiter
                ? "Recruiter Account"
                : "Applicant Account"}
            </Box>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              fontSize: {
                xs: "1.8rem",
                sm: "2.125rem",
              },
            }}
          >
            Create Your Account
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: theme.palette.text.secondary,
            }}
          >
            {isRecruiter
              ? "Create your recruiter workspace and start finding great candidates."
              : "Create your applicant account and discover opportunities."}
          </Typography>
        </Box>

        {/* ROLE INFORMATION */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 3,
            backgroundColor:
              theme.palette.background.surface,
            border: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: brandGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isRecruiter ? (
              <FiBriefcase
                style={{
                  fontSize: "20px",
                  color: "#fff",
                }}
              />
            ) : (
              <FiUserCheck
                style={{
                  fontSize: "20px",
                  color: "#fff",
                }}
              />
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {isRecruiter
                ? "Recruiter / Employer"
                : "Job Applicant"}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: "block",
                mt: 0.5,
              }}
            >
              {isRecruiter
                ? "Post jobs and find candidates using AI."
                : "Apply for jobs and get AI-powered career insights."}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor:
                theme.palette.success.main,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FiCheck size={16} />
          </Box>
        </Box>

        {/* ERROR */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* SUCCESS */}
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2.5,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>
        )}

        {/* FORM */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* NAME */}
          <Box>
            <Typography
              component="label"
              htmlFor="name"
              sx={{
                display: "block",
                mb: 0.75,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: theme.palette.text.secondary,
              }}
            >
              Full Name
            </Typography>

            <TextField
              fullWidth
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                isRecruiter
                  ? "Recruiter Name"
                  : "Alex Morgan"
              }
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiUser />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* EMAIL */}
          <Box>
            <Typography
              component="label"
              htmlFor="email"
              sx={{
                display: "block",
                mb: 0.75,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: theme.palette.text.secondary,
              }}
            >
              Email Address
            </Typography>

            <TextField
              fullWidth
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
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiMail />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* PASSWORDS */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            {/* PASSWORD */}
            <Box>
              <Typography
                component="label"
                htmlFor="password"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: theme.palette.text.secondary,
                }}
              >
                Password
              </Typography>

              <TextField
                fullWidth
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiLock />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        edge="end"
                        sx={{
                          color:
                            theme.palette.text.secondary,

                          "&:hover": {
                            color:
                              theme.palette.primary.main,
                          },
                        }}
                      >
                        {showPassword ? (
                          <FiEyeOff />
                        ) : (
                          <FiEye />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* CONFIRM PASSWORD */}
            <Box>
              <Typography
                component="label"
                htmlFor="confirmPassword"
                sx={{
                  display: "block",
                  mb: 0.75,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: theme.palette.text.secondary,
                }}
              >
                Confirm Password
              </Typography>

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiLock />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (prev) => !prev
                          )
                        }
                        edge="end"
                        sx={{
                          color:
                            theme.palette.text.secondary,

                          "&:hover": {
                            color:
                              theme.palette.primary.main,
                          },
                        }}
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff />
                        ) : (
                          <FiEye />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* TERMS */}
          <FormControlLabel
            sx={{
              mt: 0.5,
              alignItems: "flex-start",
              "& .MuiFormControlLabel-label": {
                mt: 0.5,
              },
            }}
            control={
              <Checkbox
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) =>
                  setAgreeTerms(e.target.checked)
                }
                sx={{
                  color: theme.palette.text.secondary,

                  "&.Mui-checked": {
                    color: theme.palette.warning.main,
                  },
                }}
              />
            }
            label={
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                I agree to the{" "}
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.warning.light,
                  }}
                >
                  Terms of Service
                </Box>{" "}
                and{" "}
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.warning.light,
                  }}
                >
                  Privacy Policy
                </Box>
              </Typography>
            }
          />

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              py: 1.5,
              borderRadius: 2,
              background: brandGradient,
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.95rem",
              boxShadow: 3,

              "&:hover": {
                background: brandGradient,
                opacity: 0.9,
                boxShadow: 5,
              },

              "&.Mui-disabled": {
                background: brandGradient,
                color: "#fff",
                opacity: 0.5,
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={22}
                sx={{
                  color: "#fff",
                }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <span>
                  Create{" "}
                  {isRecruiter
                    ? "Recruiter"
                    : "Applicant"}{" "}
                  Account
                </span>

                <FiArrowRight />
              </Box>
            )}
          </Button>
        </Box>

        {/* LOGIN LINK */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            textAlign: "center",
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            Already have an account?{" "}
          </Typography>

          <Box
            component={Link}
            to={
              isRecruiter
                ? "/recruiter/login"
                : "/applicant/login"
            }
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: theme.palette.warning.light,
              textDecoration: "underline",
              textUnderlineOffset: "4px",

              "&:hover": {
                color: theme.palette.warning.main,
              },
            }}
          >
            Sign in
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterForm;