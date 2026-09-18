import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiAlertCircle, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { Box, Typography, useTheme } from "@mui/material";

import useAuth from "../../hooks/useAuth";

const ForgotPasswordForm = ({ role = "applicant" }) => {
  const theme = useTheme();
  const { forgotPassword } = useAuth();

  const isRecruiter = role === "recruiter";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await forgotPassword({ email, role });

      setSuccess(
        res?.message ||
          "If an account with that email exists, a reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 480,
        mx: "auto",
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
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
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "primary.main" }}>
            {isRecruiter ? "Recruiter" : "Applicant"}
          </Typography>
        </Box>

        {/* HEADER */}
        <Box sx={{ mt: 2 }}>
          <Typography
            component="h2"
            sx={{ fontSize: { xs: 28, sm: 32 }, fontWeight: 700, color: "text.primary" }}
          >
            Forgot your password?
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>
            Enter the email associated with your{" "}
            {isRecruiter ? "recruiter" : "applicant"} account and we'll send you a
            link to reset it.
          </Typography>
        </Box>

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
              style={{ color: theme.palette.error.main, flexShrink: 0, marginTop: 2 }}
            />
            <Typography sx={{ fontSize: 14, color: theme.palette.error.main }}>
              {error}
            </Typography>
          </Box>
        )}

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
              style={{ color: theme.palette.success.main, flexShrink: 0, marginTop: 2 }}
            />
            <Typography sx={{ fontSize: 14, color: theme.palette.success.main }}>
              {success}
            </Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Box sx={{ mb: 3 }}>
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

            <Box sx={{ position: "relative" }}>
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder={isRecruiter ? "hr@company.com" : "you@example.com"}
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
                  bgcolor: theme.palette.mode === "dark" ? "#182235" : "#f1f5f9",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease",
                  "&::placeholder": { color: "text.secondary", opacity: 1 },
                  "&:focus": {
                    borderColor: "primary.main",
                    boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
                  },
                }}
              />
            </Box>
          </Box>

          <Box
            component="button"
            type="submit"
            disabled={loading}
            sx={{
              width: "100%",
              height: 64,
              border: 0,
              borderRadius: 2,
              background: "linear-gradient(90deg, #3b82f6, #9333ea)",
              color: "#fff",
              fontSize: 17,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.55 : 1,
              transition: "all 0.2s ease",
              boxShadow: "0 8px 20px rgba(59,130,246,0.20)",
              "&:hover": {
                opacity: loading ? 0.55 : 0.92,
                transform: loading ? "none" : "translateY(-1px)",
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
                  animation: "fpSpin 0.8s linear infinite",
                  "@keyframes fpSpin": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                  },
                }}
              />
            ) : (
              <Typography component="span" sx={{ color: "#fff", fontSize: 17, fontWeight: 600 }}>
                Send reset link
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Link
            to={isRecruiter ? "/recruiter/login" : "/applicant/login"}
            style={{
              color: theme.palette.text.secondary,
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FiArrowLeft size={14} /> Back to sign in
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;