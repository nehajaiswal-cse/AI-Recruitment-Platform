import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

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

const Navbar = ({
  links = [],
  showLogout = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const navigate = useNavigate();

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

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#081A3A",
        color: "#fff",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
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

        {/* ================================================= */}
        {/* LOGO + BRAND */}
        {/* ================================================= */}

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




        {/* ================================================= */}
        {/* FLEX SPACE */}
        {/* ================================================= */}

        <Box sx={{ flex: 1 }} />


        {/* ================================================= */}
        {/* DESKTOP ROLE SWITCHER */}
        {/* ================================================= */}

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

              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035))",

              border: "1px solid rgba(255,255,255,0.08)",

              boxShadow:
                "0 8px 30px rgba(0,0,0,0.20)",

              backdropFilter: "blur(12px)",
            }}
          >

            {/* Applicant */}

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

                color: "#fff",

                fontSize: {
                  sm: 13,
                  md: 14,
                },

                fontWeight: 600,

                lineHeight: 1.15,

                background:
                  selectedRole === "applicant"
                    ? "linear-gradient(135deg, #486DB9, #4168B5)"
                    : "transparent",

                boxShadow:
                  selectedRole === "applicant"
                    ? "0 5px 18px rgba(66,103,181,0.28)"
                    : "none",

                transition: "all 0.25s ease",

                "&:hover": {
                  background:
                    selectedRole === "applicant"
                      ? "linear-gradient(135deg, #5278C7, #456FC0)"
                      : "rgba(255,255,255,0.07)",
                },

                "& .MuiButton-startIcon": {
                  marginRight: 1,
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
                    color: "rgba(255,255,255,0.62)",
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
                    color: "#fff",
                  }}
                >
                  Applicant
                </Typography>
              </Box>
            </Button>


            {/* Recruiter */}

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

                color: "#fff",

                fontSize: {
                  sm: 13,
                  md: 14,
                },

                fontWeight: 600,

                background:
                  selectedRole === "recruiter"
                    ? "linear-gradient(135deg, #486DB9, #4168B5)"
                    : "transparent",

                boxShadow:
                  selectedRole === "recruiter"
                    ? "0 5px 18px rgba(66,103,181,0.28)"
                    : "none",

                transition: "all 0.25s ease",

                "&:hover": {
                  background:
                    selectedRole === "recruiter"
                      ? "linear-gradient(135deg, #5278C7, #456FC0)"
                      : "rgba(255,255,255,0.07)",
                },

                "& .MuiButton-startIcon": {
                  marginRight: 1,
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
                    color: "rgba(255,255,255,0.62)",
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
                    color: "#fff",
                  }}
                >
                  Recruiter
                </Typography>
              </Box>
            </Button>

          </Box>
        )}


        {/* ================================================= */}
        {/* DESKTOP LINKS - LOGGED IN */}
        {/* ================================================= */}

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
                  color: "#B8C7E4",
                  fontSize: 14,
                  px: 1.5,
                  textTransform: "none",

                  "&.active": {
                    color: "#fff",
                    fontWeight: 700,
                  },

                  "&:hover": {
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.06)",
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
                color: "#ff8e8e",
                ml: 1,
                textTransform: "none",

                "&:hover": {
                  bgcolor: "rgba(255,80,80,0.10)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}


        {/* ================================================= */}
        {/* NOTIFICATIONS */}
        {/* ================================================= */}

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


        {/* ================================================= */}
        {/* DIVIDER BEFORE THEME */}
        {/* ================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },

            width: "1px",
            height: 32,

            bgcolor: "rgba(255,255,255,0.16)",

            mx: {
              sm: 1,
              md: 1.5,
            },
          }}
        />


        {/* ================================================= */}
        {/* THEME */}
        {/* ================================================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,

            "& button": {
              color: "#fff",
            },
          }}
        >
          <ThemeToggle />
        </Box>


        {/* ================================================= */}
        {/* MOBILE HAMBURGER */}
        {/* ================================================= */}

        <IconButton
          onClick={handleMenuOpen}
          aria-label="Open navigation menu"
          sx={{
            display: {
              xs: "inline-flex",
              sm: "none",
            },

            color: "#fff",

            width: 42,
            height: 42,

            borderRadius: "12px",

            border: "1px solid rgba(255,255,255,0.10)",

            bgcolor: "rgba(255,255,255,0.05)",

            "&:hover": {
              bgcolor: "rgba(255,255,255,0.10)",
            },
          }}
        >
          <MenuRoundedIcon />
        </IconButton>


        {/* ================================================= */}
        {/* MOBILE MENU */}
        {/* ================================================= */}

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

                bgcolor: "#0F2347",

                color: "#fff",

                border:
                  "1px solid rgba(255,255,255,0.10)",

                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.35)",

                overflow: "hidden",
              },
            },
          }}
        >

          {/* Mobile Role Selection */}

          {!showLogout && (
            <>
              <Box
                sx={{
                  px: 2,
                  pt: 1.5,
                  pb: 1,

                  color: "#9DB4DF",

                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                }}
              >
                CONTINUE AS
              </Box>

              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleRoleSelect("applicant");
                }}
                sx={{
                  py: 1.4,

                  borderRadius: 1,

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.07)",
                  },
                }}
              >
                <PersonRoundedIcon
                  sx={{
                    mr: 1.5,
                    color: "#8FAAFF",
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#91A5C7",
                    }}
                  >
                    I'm a
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    Applicant
                  </Typography>
                </Box>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleRoleSelect("recruiter");
                }}
                sx={{
                  py: 1.4,

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.07)",
                  },
                }}
              >
                <BusinessCenterRoundedIcon
                  sx={{
                    mr: 1.5,
                    color: "#8FAAFF",
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#91A5C7",
                    }}
                  >
                    I'm a
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    Recruiter
                  </Typography>
                </Box>
              </MenuItem>

              <Divider
                sx={{
                  borderColor:
                    "rgba(255,255,255,0.08)",
                }}
              />
            </>
          )}


          {/* Logged-in links */}

          {showLogout &&
            links.map((link) => (
              <MenuItem
                key={link.path}
                component={NavLink}
                to={link.path}
                end
                onClick={handleMenuClose}
                sx={{
                  py: 1.3,

                  color: "#D8E2F5",

                  "&.active": {
                    color: "#fff",
                    bgcolor:
                      "rgba(255,255,255,0.08)",
                    fontWeight: 700,
                  },
                }}
              >
                {link.label}
              </MenuItem>
            ))}


          {/* Logout */}

          {showLogout && (
            <>
              <Divider
                sx={{
                  borderColor:
                    "rgba(255,255,255,0.08)",
                }}
              />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.3,

                  color: "#ff9090",

                  "&:hover": {
                    bgcolor:
                      "rgba(255,70,70,0.10)",
                  },
                }}
              >
                <LogoutRoundedIcon
                  fontSize="small"
                  sx={{ mr: 1.5 }}
                />

                Logout
              </MenuItem>
            </>
          )}


          {/* Theme */}

          <Divider
            sx={{
              borderColor:
                "rgba(255,255,255,0.08)",
            }}
          />

          <Box
            sx={{
              px: 2,
              py: 1.5,

              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: "#9DB4DF",
              }}
            >
              Theme
            </Typography>

            <ThemeToggle />
          </Box>

        </Menu>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;