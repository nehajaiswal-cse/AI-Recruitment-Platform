import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Box, Typography, useTheme } from "@mui/material";

import useAuth from "../../hooks/UseAuth";

const ResetPasswordForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useParams();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await resetPassword({ token, password });

      setSuccess("Your password has been reset. Redirecting to sign in...");
      setTimeout(() => navigate("/applicant/login"), 1500);
    } catch (err) {
      setError(err?.message || "This reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 480, mx: "auto", px: { xs: 2, sm: 3 } }}>
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
        <Typography component="h2" sx={{ fontSize: { xs: 28, sm: 32 }, fontWeight: 700, color: "text.primary" }}>
          Set a new password
        </Typography>

        <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>
          Choose a new password for your account.
        </Typography>

        {error && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              bgcolor: theme.palette.mode === "dark" ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
              border: "1px solid",
              borderColor: theme.palette.mode === "dark" ? "rgba(239,68,68,0.35)" : "rgba(239,68,68,0.25)",
            }}
          >
            <FiAlertCircle size={20} style={{ color: theme.palette.error.main, flexShrink: 0, marginTop: 2 }} />
            <Typography sx={{ fontSize: 14, color: theme.palette.error.main }}>{error}</Typography>
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
              bgcolor: theme.palette.mode === "dark" ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
              border: "1px solid",
              borderColor: theme.palette.mode === "dark" ? "rgba(16,185,129,0.35)" : "rgba(16,185,129,0.25)",
            }}
          >
            <FiCheckCircle size={20} style={{ color: theme.palette.success.main, flexShrink: 0, marginTop: 2 }} />
            <Typography sx={{ fontSize: 14, color: theme.palette.success.main }}>{success}</Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography
              component="label"
              htmlFor="password"
              sx={{ display: "block", mb: 1, fontSize: 12, fontWeight: 600, letterSpacing: "1px", color: "text.secondary" }}
            >
              NEW PASSWORD
            </Typography>

            <Box sx={{ position: "relative" }}>
              <Box sx={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "text.secondary", zIndex: 1, display: "flex" }}>
                <FiLock size={19} />
              </Box>

              <Box
                component="input"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
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
                  bgcolor: theme.palette.mode === "dark" ? "#182235" : "#f1f5f9",
                  border: "1px solid",
                  borderColor: "divider",
                  "&::placeholder": { color: "text.secondary", opacity: 1 },
                  "&:focus": { borderColor: "primary.main", boxShadow: `0 0 0 3px ${theme.palette.primary.main}20` },
                }}
              />

              <Box
                component="button"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
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
                  p: 0.5,
                  "&:hover": { color: "primary.main" },
                }}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              component="label"
              htmlFor="confirmPassword"
              sx={{ display: "block", mb: 1, fontSize: 12, fontWeight: 600, letterSpacing: "1px", color: "text.secondary" }}
            >
              CONFIRM PASSWORD
            </Typography>

            <Box sx={{ position: "relative" }}>
              <Box sx={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "text.secondary", zIndex: 1, display: "flex" }}>
                <FiLock size={19} />
              </Box>

              <Box
                component="input"
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="••••••••"
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
                  "&::placeholder": { color: "text.secondary", opacity: 1 },
                  "&:focus": { borderColor: "primary.main", boxShadow: `0 0 0 3px ${theme.palette.primary.main}20` },
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
              boxShadow: "0 8px 20px rgba(59,130,246,0.20)",
              "&:hover": { opacity: loading ? 0.55 : 0.92, transform: loading ? "none" : "translateY(-1px)" },
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
                  animation: "rpSpin 0.8s linear infinite",
                  "@keyframes rpSpin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
                }}
              />
            ) : (
              <Typography component="span" sx={{ color: "#fff", fontSize: 17, fontWeight: 600 }}>
                Reset password
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Link to="/applicant/login" style={{ color: theme.palette.text.secondary, fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
            Back to sign in
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;