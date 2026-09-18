import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import Logo from "../common/Logo.jsx";
import ThemeToggle from "../common/ThemeToggle.jsx";
import NotificationBell from "../notifications/NotificationsBell.jsx";

import { brandGradient } from "../../theme";

const Navbar = ({
  links = [],
  showLogout = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();

  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    handleMenuClose();
    navigate("/");
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);

    if (role === "applicant") {
      navigate("/applicant/login");
    }

    if (role === "recruiter") {
      navigate("/recruiter/login");
    }
  };

  const hoverBg =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(15,23,42,0.06)";

  const subtleBg =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(15,23,42,0.04)";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          height: {
            xs: 64,
            sm: 72,
            md: 84,
          },

          minHeight: "unset",

          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 6,
          },

          gap: 2,
          width: "100%",
          boxSizing: "border-box",
        }}
      >

        {/* LOGO */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 1,
              sm: 1.5,
            },
            flexShrink: 0,

            "& img": {
              width: {
                xs: 42,
                sm: 48,
                md: 52,
              },
              height: "auto",
            },
          }}
        >
          <Logo />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* ROLE SWITCHER */}
        {/* ROLE SWITCHER */}
{!showLogout && (
  <Box
    sx={{
      display: {
        xs: "none",
        sm: "flex",
      },

      alignItems: "center",
      p: "3px",
      borderRadius: "20px",

      bgcolor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.06)"
          : "rgba(15,23,42,0.04)",

      border: `1px solid ${theme.palette.divider}`,

      boxShadow:
        theme.palette.mode === "dark"
          ? "0 8px 30px rgba(0,0,0,0.20)"
          : "0 8px 30px rgba(15,23,42,0.08)",

      backdropFilter: "blur(12px)",
    }}
  >
    {/* APPLICANT */}
    <Button
      onClick={() => handleRoleSelect("applicant")}
      startIcon={
        <PersonRoundedIcon
          sx={{
            fontSize: {
              sm: 21,
              md: 23,
            },
          }}
        />
      }
      sx={{
        minWidth: {
          sm: 135,
          md: 160,
        },

        height: {
          sm: 48,
          md: 52,
        },

        px: {
          sm: 2,
          md: 2.5,
        },

        borderRadius: "26px",
        textTransform: "none",

        // Theme-aware text
        color:
          selectedRole === "applicant"
            ? "#fff"
            : theme.palette.text.primary,

        // Theme-aware background
        background:
          selectedRole === "applicant"
            ? brandGradient
            : "transparent",

        boxShadow:
          selectedRole === "applicant"
            ? "0 5px 18px rgba(66,103,181,0.28)"
            : "none",

        transition: "all 0.25s ease",

        "&:hover": {
          background:
            selectedRole === "applicant"
              ? brandGradient
              : hoverBg,

          color:
            selectedRole === "applicant"
              ? "#fff"
              : theme.palette.text.primary,
        },

        "& .MuiButton-startIcon": {
          marginRight: 1,

          color:
            selectedRole === "applicant"
              ? "#fff"
              : theme.palette.text.secondary,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          sx={{
            fontSize: 11,

            color:
              selectedRole === "applicant"
                ? "rgba(255,255,255,0.75)"
                : theme.palette.text.secondary,

            lineHeight: 1,
            mb: 0.3,
          }}
        >
          I'm a
        </Typography>

        <Typography
          sx={{
            fontSize: {
              sm: 14,
              md: 15,
            },

            fontWeight: 700,
            lineHeight: 1,

            color:
              selectedRole === "applicant"
                ? "#fff"
                : theme.palette.text.primary,
          }}
        >
          Applicant
        </Typography>
      </Box>
    </Button>

    {/* RECRUITER */}
    <Button
      onClick={() => handleRoleSelect("recruiter")}
      startIcon={
        <BusinessCenterRoundedIcon
          sx={{
            fontSize: {
              sm: 21,
              md: 23,
            },
          }}
        />
      }
      sx={{
        minWidth: {
          sm: 135,
          md: 160,
        },

        height: {
          sm: 48,
          md: 52,
        },

        px: {
          sm: 2,
          md: 2.5,
        },

        borderRadius: "26px",
        textTransform: "none",

        // Theme-aware text
        color:
          selectedRole === "recruiter"
            ? "#fff"
            : theme.palette.text.primary,

        background:
          selectedRole === "recruiter"
            ? brandGradient
            : "transparent",

        boxShadow:
          selectedRole === "recruiter"
            ? "0 5px 18px rgba(66,103,181,0.28)"
            : "none",

        transition: "all 0.25s ease",

        "&:hover": {
          background:
            selectedRole === "recruiter"
              ? brandGradient
              : hoverBg,

          color:
            selectedRole === "recruiter"
              ? "#fff"
              : theme.palette.text.primary,
        },

        "& .MuiButton-startIcon": {
          marginRight: 1,

          color:
            selectedRole === "recruiter"
              ? "#fff"
              : theme.palette.text.secondary,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          sx={{
            fontSize: 11,

            color:
              selectedRole === "recruiter"
                ? "rgba(255,255,255,0.75)"
                : theme.palette.text.secondary,

            lineHeight: 1,
            mb: 0.3,
          }}
        >
          I'm a
        </Typography>

        <Typography
          sx={{
            fontSize: {
              sm: 14,
              md: 15,
            },

            fontWeight: 700,
            lineHeight: 1,

            color:
              selectedRole === "recruiter"
                ? "#fff"
                : theme.palette.text.primary,
          }}
        >
          Recruiter
        </Typography>
      </Box>
    </Button>
  </Box>
)}

        {/* LOGGED-IN LINKS */}
        {showLogout && (
          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },

              alignItems: "center",
              gap: 0.5,
            }}
          >
            {links.map((link) => (
              <Button
                key={link.path}
                component={NavLink}
                to={link.path}
                end
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: 14,
                  px: 1.5,
                  textTransform: "none",

                  "&.active": {
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                  },

                  "&:hover": {
                    color: theme.palette.text.primary,
                    bgcolor: hoverBg,
                  },
                }}
              >
                {link.label}
              </Button>
            ))}

            <Button
              onClick={handleLogout}
              startIcon={<LogoutRoundedIcon />}
              sx={{
                color: theme.palette.error.main,
                ml: 1,
                textTransform: "none",

                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,80,80,0.10)"
                      : "rgba(239,68,68,0.08)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}

        {/* NOTIFICATIONS */}
        {showLogout && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 0.5,
            }}
          >
            <NotificationBell />
          </Box>
        )}

        {/* DIVIDER */}
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },

            width: "1px",
            height: 32,

            bgcolor: theme.palette.divider,

            mx: {
              sm: 1,
              md: 1.5,
            },
          }}
        />

        {/* THEME */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,

            "& button": {
              color: theme.palette.text.primary,
            },
          }}
        >
          <ThemeToggle />
        </Box>

        {/* MOBILE */}
        <IconButton
          onClick={handleMenuOpen}
          aria-label="Open navigation menu"
          sx={{
            display: {
              xs: "inline-flex",
              sm: "none",
            },

            color: theme.palette.text.primary,

            width: 42,
            height: 42,

            borderRadius: "12px",

            border: `1px solid ${theme.palette.divider}`,

            bgcolor: subtleBg,

            "&:hover": {
              bgcolor: hoverBg,
            },
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        {/* MOBILE MENU */}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 1.2,

                minWidth: 250,

                borderRadius: "16px",

                bgcolor: theme.palette.background.paper,

                color: theme.palette.text.primary,

                border:
                  `1px solid ${theme.palette.divider}`,

                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.25)",

                overflow: "hidden",
              },
            },
          }}
        >

          {/* Your existing mobile menu content can remain,
              replacing hardcoded white/blue text colors
              with theme.palette.text.primary/secondary. */}

        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;