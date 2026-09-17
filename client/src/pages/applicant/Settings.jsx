import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import ANavbar from "../../components/layout/applicant/Navbar";
import ASidebar from "../../components/layout/applicant/Sidebar";

import {
  getSettings,
  updateAccount,
  updateJobPreferences,
  updateNotifications,
  updatePrivacy,
  toggleTwoFactor,
  changePassword,
  downloadMyData,
  deactivateAccount,
  deleteAccount,
} from "../../api/settingsApi";

import { createSubscription, verifySubscription } from "../../api/paymentApi" ;

const SectionHeader = ({ icon, iconColor, iconBg, title }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: iconBg,
        color: iconColor,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{title}</Typography>
  </Stack>
);

const Row = ({ icon, iconColor, iconBg, title, subtitle, action, onClick }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    onClick={onClick}
    sx={{
      py: 1.75,
      gap: 2,
      borderBottom: "1px solid",
      borderColor: "divider",
      cursor: onClick ? "pointer" : "default",
      "&:last-of-type": { borderBottom: "none" },
    }}
  >
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{ minWidth: 0, flex: 1 }}
    >
      {icon && (
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: iconBg,
            color: iconColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{title}</Typography>
        {subtitle && (
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              mt: 0.2,
              overflowWrap: "break-word",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
    {action && (
      <Box sx={{ flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
        {action}
      </Box>
    )}
  </Stack>
);

const emptyJobPrefs = {
  preferredRole: "Frontend developer",
  preferredLocation: "",
  workMode: "Hybrid",
  expectedSalary: "",
  experienceLevel: "Fresher",
  employmentType: "Full-time",
};

const emptyNotifications = {
  jobRecommendations: true,
  newJobAlerts: true,
  applicationUpdates: true,
  recruiterMessages: true,
  emailNotifications: true,
  pushNotifications: false,
};

const emptyPrivacy = {
  profileVisibility: "Public",
  resumeVisibility: "Recruiters only",
};

const Settings = () => {
  const [loading, setLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  // Account
  const [account, setAccount] = useState({ name: "", email: "", phone: "" });
  const [accountSaving, setAccountSaving] = useState(false);

  // Subscription
  const [plan, setPlan] = useState("free");
  const [subscription, setSubscription] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Job preferences
  const [jobPrefs, setJobPrefs] = useState(emptyJobPrefs);
  const [skills, setSkills] = useState([]);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [jobPrefsSaving, setJobPrefsSaving] = useState(false);

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const addSkill = () => {
    const value = newSkill.trim();
    if (!value) {
      setShowSkillInput(false);
      return;
    }
    if (skills.length >= 10) {
      showSnackbar("You can add up to 10 skills only", "error");
      return;
    }
    if (!skills.includes(value)) {
      setSkills((prev) => [...prev, value]);
    }
    setNewSkill("");
    setShowSkillInput(false);
  };

  // Notifications
  const [notifications, setNotifications] = useState(emptyNotifications);
  const [notifSaving, setNotifSaving] = useState(false);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Privacy
  const [privacy, setPrivacy] = useState(emptyPrivacy);
  const [privacySaving, setPrivacySaving] = useState(false);

  const [twoFactor, setTwoFactor] = useState(false);
  const [twoFactorSaving, setTwoFactorSaving] = useState(false);

  // Password dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const closePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  // Download
  const [downloadSaving, setDownloadSaving] = useState(false);

  // Deactivate dialog
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deactivateSaving, setDeactivateSaving] = useState(false);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSaving, setDeleteSaving] = useState(false);

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletePassword("");
    setDeleteError("");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        const user = data.user;

        setPlan(user.plan || "free");
        setSubscription(user.subscription || null);

        setAccount({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        setJobPrefs({
          preferredRole:
            user.jobPreferences?.preferredRole || emptyJobPrefs.preferredRole,
          preferredLocation: user.jobPreferences?.preferredLocation || "",
          workMode: user.jobPreferences?.workMode || emptyJobPrefs.workMode,
          expectedSalary: user.jobPreferences?.expectedSalary || "",
          experienceLevel:
            user.jobPreferences?.experienceLevel ||
            emptyJobPrefs.experienceLevel,
          employmentType:
            user.jobPreferences?.employmentType || emptyJobPrefs.employmentType,
        });

        setSkills(user.profile?.skills || []);
        setNotifications({
          ...emptyNotifications,
          ...(user.notifications || {}),
        });
        setPrivacy({ ...emptyPrivacy, ...(user.privacy || {}) });
        setTwoFactor(!!user.privacy?.twoFactorEnabled);
      } catch (error) {
        console.error("Failed to load settings:", error);
        showSnackbar(error.message || "Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // =====================================================
  // RAZORPAY PAYMENT
  // =====================================================

  const handleUpgradeToPro = async () => {
    try {
      setPaymentLoading(true);

      // Load Razorpay Checkout
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error("Razorpay Checkout failed to load");
      }

      // Create subscription from backend
      const data = await createSubscription();

      if (!data?.subscriptionId || !data?.keyId) {
        throw new Error("Unable to create Razorpay subscription");
      }

      const options = {
        key: data.keyId,

        subscription_id: data.subscriptionId,

        name: "Talvyn",
        description: "Talvyn Pro - ₹299/month",

        prefill: {
          name: account.name || "",
          email: account.email || "",
          contact: account.phone || "",
        },

        theme: {
          color: "#7c3aed",
        },

        handler: async function (response) {
          try {
            setPaymentLoading(true);

            await verifySubscription({
              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_subscription_id: response.razorpay_subscription_id,

              razorpay_signature: response.razorpay_signature,
            });

            showSnackbar("Payment successful! Talvyn Pro activated.");

            // Reload user data so plan becomes Pro everywhere
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          } catch (error) {
            console.error("Payment verification error:", error);

            showSnackbar(
              error.message || "Payment verification failed",
              "error",
            );

            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
  console.error("\n=================================");
  console.error("RAZORPAY PAYMENT FAILED");
  console.error("=================================");

  console.error("FULL RESPONSE:");
  console.error(response);

  console.error("\nERROR OBJECT:");
  console.error(response?.error);

  console.error("\nERROR DETAILS:");
  console.error("Code:", response?.error?.code);
  console.error("Description:", response?.error?.description);
  console.error("Source:", response?.error?.source);
  console.error("Step:", response?.error?.step);
  console.error("Reason:", response?.error?.reason);

  console.error("\nMETADATA:");
  console.error(response?.error?.metadata);

  console.error("\nPAYMENT ID:");
  console.error(response?.error?.metadata?.payment_id);

  console.error("\nSUBSCRIPTION ID:");
  console.error(response?.error?.metadata?.subscription_id);

  console.error("=================================\n");

  const errorDescription =
    response?.error?.description ||
    response?.error?.reason ||
    "Payment failed. Please try again.";

  showSnackbar(errorDescription, "error");

  setPaymentLoading(false);
});

      razorpay.open();
    } catch (error) {
      console.error("Upgrade to Pro error:", error);

      showSnackbar(error.message || "Unable to start payment", "error");

      setPaymentLoading(false);
    }
  };

  // ---- SAVE HANDLERS ----

  const handleSaveAccount = async () => {
    setAccountSaving(true);
    try {
      await updateAccount(account);
      showSnackbar("Account details updated");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setAccountSaving(false);
    }
  };

  const handleSaveJobPrefs = async () => {
    setJobPrefsSaving(true);
    try {
      await updateJobPreferences({ ...jobPrefs, skills });
      showSnackbar("Job preferences updated");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setJobPrefsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    try {
      await updateNotifications(notifications);
      showSnackbar("Notification preferences updated");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setNotifSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setPrivacySaving(true);
    try {
      await updatePrivacy(privacy);
      showSnackbar("Privacy settings updated");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setPrivacySaving(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    const nextValue = !twoFactor;
    setTwoFactor(nextValue);
    setTwoFactorSaving(true);
    try {
      await toggleTwoFactor(nextValue);
      showSnackbar(
        `Two-factor authentication ${nextValue ? "enabled" : "disabled"}`,
      );
    } catch (error) {
      setTwoFactor(!nextValue);
      showSnackbar(error.message, "error");
    } finally {
      setTwoFactorSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      showSnackbar("Password updated successfully");
      closePasswordDialog();
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDownloadData = async () => {
    setDownloadSaving(true);
    try {
      const data = await downloadMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "my-data.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showSnackbar("Your data has been downloaded");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setDownloadSaving(false);
    }
  };

  const handleDeactivate = async () => {
    setDeactivateSaving(true);
    try {
      await deactivateAccount();
      showSnackbar("Account deactivated");
      setDeactivateDialogOpen(false);
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setDeactivateSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Password is required to delete your account");
      return;
    }

    setDeleteSaving(true);
    try {
      await deleteAccount(deletePassword);
      showSnackbar("Account deleted");
      closeDeleteDialog();
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setDeleteSaving(false);
    }
  };

  const cardSx = {
    p: 3,
    mb: 2.5,
    borderRadius: 3,
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "background.default",
    },
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 50 }}>
          <ANavbar />
        </Box>
        <Box sx={{ display: "flex" }}>
          <ASidebar />
          <Box
            component="main"
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
            }}
          >
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 50 }}>
        <ANavbar />
      </Box>

      <Box sx={{ display: "flex", minWidth: 0 }}>
        <ASidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1000, mx: "auto" }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{ fontSize: { xs: "28px", md: "32px" }, fontWeight: 700 }}
              >
                Settings
              </Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}
              >
                Manage your account, preferences and privacy settings.
              </Typography>
            </Box>

            {/* SUBSCRIPTION */}
            <Paper
              elevation={0}
              sx={{
                ...cardSx,
                overflow: "hidden",
                position: "relative",
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(99,102,241,0.03))",
              }}
            >
              {/* subtle background glow */}
              <Box
                sx={{
                  position: "absolute",
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background: "rgba(124,58,237,0.10)",
                  filter: "blur(70px)",
                  top: -120,
                  right: -80,
                  pointerEvents: "none",
                }}
              />

              <SectionHeader
                icon={<WorkspacePremiumRoundedIcon fontSize="small" />}
                iconColor="#7c3aed"
                iconBg="rgba(124,58,237,0.12)"
                title="Subscription"
              />

              {plan === "pro" ? (
                /* ================= PRO USER ================= */
                <Box
                  sx={{
                    position: "relative",
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    border: "1px solid rgba(124,58,237,0.25)",
                    background: "rgba(124,58,237,0.06)",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 0.7 }}
                      >
                        <Typography
                          sx={{
                            fontSize: 20,
                            fontWeight: 800,
                          }}
                        >
                          Talvyn Pro
                        </Typography>

                        <Chip
                          icon={<CheckCircleRoundedIcon />}
                          label="Active"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Stack>

                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "text.secondary",
                        }}
                      >
                        Your Pro subscription is active.
                      </Typography>

                      {subscription?.currentPeriodEnd && (
                        <Typography
                          sx={{
                            mt: 0.7,
                            fontSize: 12,
                            color: "text.secondary",
                          }}
                        >
                          Next billing date:{" "}
                          <strong>
                            {new Date(
                              subscription.currentPeriodEnd,
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </strong>
                        </Typography>
                      )}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#7c3aed",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ₹299
                      <Box
                        component="span"
                        sx={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "text.secondary",
                        }}
                      >
                        {" "}
                        / month
                      </Box>
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                /* ================= FREE USER ================= */
                <>
                  <Box
                    sx={{
                      position: "relative",
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 3,
                      border: "1px solid rgba(124,58,237,0.22)",
                      background:
                        "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(99,102,241,0.035))",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", md: "center" }}
                      spacing={{ xs: 2.5, md: 3 }}
                    >
                      {/* LEFT CONTENT */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 0.8 }}
                        >
                          <Typography
                            sx={{
                              fontSize: 21,
                              fontWeight: 800,
                              letterSpacing: "-0.3px",
                            }}
                          >
                            Talvyn Pro
                          </Typography>

                          <Chip
                            label="PREMIUM"
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: 10,
                              fontWeight: 800,
                              color: "#7c3aed",
                              background: "rgba(124,58,237,0.12)",
                              border: "1px solid rgba(124,58,237,0.20)",
                            }}
                          />
                        </Stack>

                        <Typography
                          sx={{
                            fontSize: 13.5,
                            color: "text.secondary",
                            lineHeight: 1.6,
                            maxWidth: 560,
                          }}
                        >
                          Unlock unlimited AI interviews and premium recruitment
                          features with Talvyn Pro.
                        </Typography>

                        {/* FEATURES */}
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={{ xs: 0.8, sm: 2 }}
                          sx={{ mt: 1.8 }}
                        >
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                            }}
                          >
                            ✓ Unlimited AI Interviews
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                            }}
                          >
                            ✓ Premium AI Features
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                            }}
                          >
                            ✓ Monthly Billing
                          </Typography>
                        </Stack>
                      </Box>

                      {/* RIGHT PRICE + BUTTON */}
                      <Box
                        sx={{
                          minWidth: { xs: "100%", md: 180 },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: { xs: "stretch", md: "flex-end" },
                          gap: 1.2,
                        }}
                      >
                        <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: 28,
                              fontWeight: 900,
                              color: "#7c3aed",
                              lineHeight: 1,
                            }}
                          >
                            ₹299
                          </Typography>

                          <Typography
                            component="span"
                            sx={{
                              ml: 0.5,
                              fontSize: 12,
                              color: "text.secondary",
                            }}
                          >
                            / month
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          onClick={handleUpgradeToPro}
                          disabled={paymentLoading}
                          startIcon={
                            paymentLoading ? (
                              <CircularProgress size={17} color="inherit" />
                            ) : (
                              <WorkspacePremiumRoundedIcon />
                            )
                          }
                          sx={{
                            width: { xs: "100%", md: "auto" },
                            minWidth: 170,
                            py: 1.15,
                            px: 2.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: 14,
                            background:
                              "linear-gradient(135deg, #6366f1, #7c3aed)",
                            boxShadow: "0 8px 20px rgba(124,58,237,0.22)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #5558e8, #6d28d9)",
                              boxShadow: "0 10px 24px rgba(124,58,237,0.30)",
                            },
                          }}
                        >
                          {paymentLoading ? "Processing..." : "Upgrade to Pro"}
                        </Button>
                      </Box>
                    </Stack>
                  </Box>

                  {/* BILLING NOTE */}
                  <Typography
                    sx={{
                      mt: 1.5,
                      fontSize: 11.5,
                      color: "text.secondary",
                      textAlign: "center",
                    }}
                  >
                    Secure payment powered by Razorpay
                  </Typography>
                </>
              )}
            </Paper>

            {/* ACCOUNT */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<PersonOutlineRoundedIcon fontSize="small" />}
                iconColor="primary.main"
                iconBg="rgba(59,130,246,0.15)"
                title="Account"
              />

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    fontWeight: 700,
                    fontSize: 22,
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  {account.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </Avatar>

                <Button
                  variant="outlined"
                  startIcon={<CameraAltOutlinedIcon />}
                  onClick={() =>
                    showSnackbar("Photo upload is coming soon", "info")
                  }
                >
                  Change photo
                </Button>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField
                  label="Full name"
                  value={account.name}
                  onChange={(e) =>
                    setAccount((p) => ({ ...p, name: e.target.value }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Email"
                  value={account.email}
                  onChange={(e) =>
                    setAccount((p) => ({ ...p, email: e.target.value }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Phone number"
                  value={account.phone}
                  onChange={(e) =>
                    setAccount((p) => ({ ...p, phone: e.target.value }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
              </Box>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  variant="outlined"
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  Update password
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveAccount}
                  disabled={accountSaving}
                >
                  {accountSaving ? "Saving..." : "Save changes"}
                </Button>
              </Stack>
            </Paper>

            {/* JOB PREFERENCES */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<WorkOutlineRoundedIcon fontSize="small" />}
                iconColor="secondary.main"
                iconBg="rgba(147,51,234,0.15)"
                title="Profile / job preferences"
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField
                  select
                  label="Preferred role"
                  value={jobPrefs.preferredRole}
                  onChange={(e) =>
                    setJobPrefs((p) => ({
                      ...p,
                      preferredRole: e.target.value,
                    }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Frontend developer">
                    Frontend developer
                  </MenuItem>
                  <MenuItem value="Backend developer">
                    Backend developer
                  </MenuItem>
                  <MenuItem value="Full stack developer">
                    Full stack developer
                  </MenuItem>
                </TextField>

                <TextField
                  label="Preferred location"
                  value={jobPrefs.preferredLocation}
                  onChange={(e) =>
                    setJobPrefs((p) => ({
                      ...p,
                      preferredLocation: e.target.value,
                    }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />

                <TextField
                  select
                  label="Work mode"
                  value={jobPrefs.workMode}
                  onChange={(e) =>
                    setJobPrefs((p) => ({ ...p, workMode: e.target.value }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                  <MenuItem value="On-site">On-site</MenuItem>
                </TextField>

                <TextField
                  label="Expected salary"
                  value={jobPrefs.expectedSalary}
                  onChange={(e) =>
                    setJobPrefs((p) => ({
                      ...p,
                      expectedSalary: e.target.value,
                    }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />

                <TextField
                  select
                  label="Experience level"
                  value={jobPrefs.experienceLevel}
                  onChange={(e) =>
                    setJobPrefs((p) => ({
                      ...p,
                      experienceLevel: e.target.value,
                    }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Fresher">Fresher</MenuItem>
                  <MenuItem value="Mid level (2-4 yrs)">
                    Mid level (2-4 yrs)
                  </MenuItem>
                  <MenuItem value="Senior (5+ yrs)">Senior (5+ yrs)</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Employment type"
                  value={jobPrefs.employmentType}
                  onChange={(e) =>
                    setJobPrefs((p) => ({
                      ...p,
                      employmentType: e.target.value,
                    }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{ fontSize: 12, color: "text.secondary", mb: 1 }}
                >
                  Skills (add up to 10)
                </Typography>

                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={1}
                  alignItems="center"
                >
                  {skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => removeSkill(skill)}
                      deleteIcon={<CloseRoundedIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        bgcolor: "rgba(59,130,246,0.12)",
                        color: "primary.main",
                        fontWeight: 500,
                      }}
                    />
                  ))}

                  {showSkillInput ? (
                    <TextField
                      autoFocus
                      size="small"
                      value={newSkill}
                      placeholder="Skill name"
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      onBlur={addSkill}
                      sx={{ width: 140, ...fieldSx }}
                    />
                  ) : (
                    <Chip
                      label="Add skill"
                      icon={<AddRoundedIcon sx={{ fontSize: 14 }} />}
                      variant="outlined"
                      onClick={() => setShowSkillInput(true)}
                      sx={{ borderStyle: "dashed", cursor: "pointer" }}
                    />
                  )}
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleSaveJobPrefs}
                  disabled={jobPrefsSaving}
                >
                  {jobPrefsSaving ? "Saving..." : "Save changes"}
                </Button>
              </Stack>
            </Paper>

            {/* NOTIFICATIONS */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<NotificationsNoneRoundedIcon fontSize="small" />}
                iconColor="success.main"
                iconBg="rgba(16,185,129,0.15)"
                title="Notifications"
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  columnGap: 4,
                }}
              >
                <Box>
                  <Row
                    title="Job recommendations"
                    action={
                      <Switch
                        checked={notifications.jobRecommendations}
                        onChange={() =>
                          toggleNotification("jobRecommendations")
                        }
                      />
                    }
                  />
                  <Row
                    title="Application status updates"
                    action={
                      <Switch
                        checked={notifications.applicationUpdates}
                        onChange={() =>
                          toggleNotification("applicationUpdates")
                        }
                      />
                    }
                  />
                  <Row
                    title="Email notifications"
                    action={
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={() =>
                          toggleNotification("emailNotifications")
                        }
                      />
                    }
                  />
                </Box>

                <Box>
                  <Row
                    title="New job alerts"
                    action={
                      <Switch
                        checked={notifications.newJobAlerts}
                        onChange={() => toggleNotification("newJobAlerts")}
                      />
                    }
                  />
                  <Row
                    title="Recruiter messages"
                    action={
                      <Switch
                        checked={notifications.recruiterMessages}
                        onChange={() => toggleNotification("recruiterMessages")}
                      />
                    }
                  />
                  <Row
                    title="Push notifications"
                    action={
                      <Switch
                        checked={notifications.pushNotifications}
                        onChange={() => toggleNotification("pushNotifications")}
                      />
                    }
                  />
                </Box>
              </Box>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveNotifications}
                  disabled={notifSaving}
                >
                  {notifSaving ? "Saving..." : "Save changes"}
                </Button>
              </Stack>
            </Paper>

            {/* PRIVACY & SECURITY */}
            <Paper elevation={0} sx={cardSx}>
              <SectionHeader
                icon={<ShieldOutlinedIcon fontSize="small" />}
                iconColor="primary.main"
                iconBg="rgba(59,130,246,0.15)"
                title="Privacy and security"
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mb: 1,
                }}
              >
                <TextField
                  select
                  label="Profile visibility"
                  value={privacy.profileVisibility}
                  onChange={(e) =>
                    setPrivacy((p) => ({
                      ...p,
                      profileVisibility: e.target.value,
                    }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Recruiters only">Recruiters only</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Who can view resume"
                  value={privacy.resumeVisibility}
                  onChange={(e) =>
                    setPrivacy((p) => ({
                      ...p,
                      resumeVisibility: e.target.value,
                    }))
                  }
                  size="small"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="Everyone">Everyone</MenuItem>
                  <MenuItem value="Recruiters only">Recruiters only</MenuItem>
                  <MenuItem value="No one">No one</MenuItem>
                </TextField>
              </Box>

              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSavePrivacy}
                  disabled={privacySaving}
                >
                  {privacySaving ? "Saving..." : "Save changes"}
                </Button>
              </Stack>

              <Row
                icon={<DevicesOutlinedIcon fontSize="small" />}
                iconColor="primary.main"
                iconBg="rgba(59,130,246,0.15)"
                title="Login / session management"
                subtitle="Manage your active sessions"
                onClick={() =>
                  showSnackbar("Session management is coming soon", "info")
                }
                action={
                  <ChevronRightRoundedIcon sx={{ color: "text.secondary" }} />
                }
              />

              <Row
                icon={<LockOutlinedIcon fontSize="small" />}
                iconColor="secondary.main"
                iconBg="rgba(147,51,234,0.15)"
                title="Change password"
                subtitle="Update your account password"
                onClick={() => setPasswordDialogOpen(true)}
                action={
                  <ChevronRightRoundedIcon sx={{ color: "text.secondary" }} />
                }
              />

              <Row
                icon={<VerifiedUserOutlinedIcon fontSize="small" />}
                iconColor="success.main"
                iconBg="rgba(16,185,129,0.15)"
                title="Two-factor authentication"
                subtitle="Add an extra layer of security"
                action={
                  <Switch
                    checked={twoFactor}
                    onChange={handleToggleTwoFactor}
                    disabled={twoFactorSaving}
                  />
                }
              />
            </Paper>

            {/* ACCOUNT MANAGEMENT */}
            <Paper
              elevation={0}
              sx={{ ...cardSx, borderColor: "rgba(239,68,68,0.35)" }}
            >
              <SectionHeader
                icon={<WarningAmberRoundedIcon fontSize="small" />}
                iconColor="error.main"
                iconBg="rgba(239,68,68,0.15)"
                title="Account management"
              />

              <Row
                icon={<CloudDownloadOutlinedIcon fontSize="small" />}
                iconColor="primary.main"
                iconBg="rgba(59,130,246,0.15)"
                title="Download my data"
                subtitle="Get a copy of your profile and applications"
                action={
                  <Button
                    variant="outlined"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={handleDownloadData}
                    disabled={downloadSaving}
                  >
                    {downloadSaving ? "Preparing..." : "Download"}
                  </Button>
                }
              />

              <Row
                icon={<PowerSettingsNewRoundedIcon fontSize="small" />}
                iconColor="warning.main"
                iconBg="rgba(245,158,11,0.15)"
                title="Deactivate account"
                subtitle="Temporarily hide your profile"
                action={
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={() => setDeactivateDialogOpen(true)}
                  >
                    Deactivate
                  </Button>
                }
              />

              <Row
                icon={<DeleteOutlineRoundedIcon fontSize="small" />}
                iconColor="error.main"
                iconBg="rgba(239,68,68,0.15)"
                title="Delete account"
                subtitle="Permanently remove your account and data"
                action={
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                }
              />
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* PASSWORD DIALOG */}
      <Dialog
        open={passwordDialogOpen}
        onClose={closePasswordDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Update password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            <TextField
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
            />
            <TextField
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closePasswordDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={passwordSaving}
          >
            {passwordSaving ? "Updating..." : "Update password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DEACTIVATE DIALOG */}
      <Dialog
        open={deactivateDialogOpen}
        onClose={() => setDeactivateDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Deactivate account?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Your profile will be hidden from recruiters until you log back in
            and reactivate it.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeactivateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleDeactivate}
            disabled={deactivateSaving}
          >
            {deactivateSaving ? "Deactivating..." : "Deactivate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete account permanently?</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              This action cannot be undone. Enter your password to confirm.
            </Typography>
            {deleteError && <Alert severity="error">{deleteError}</Alert>}
            <TextField
              label="Password"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={deleteSaving}
          >
            {deleteSaving ? "Deleting..." : "Delete account"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
