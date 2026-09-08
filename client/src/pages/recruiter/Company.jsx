import React, { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Divider,
  Grid,
  TextField,
  Stack,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import RNavbar from "../../components/layout/recruiter/Navbar";
import RSidebar from "../../components/layout/recruiter/Sidebar";

const Company = () => {
  const theme = useTheme();

  const [editing, setEditing] = useState(false);

  const [company, setCompany] = useState({
    name: "TechNova Solutions",
    industry: "Information Technology",
    website: "https://technova.com",
    location: "Lucknow, Uttar Pradesh",
    email: "hr@technova.com",
    phone: "+91 98765 43210",
    employees: "51 - 200",
    description:
      "TechNova Solutions is a technology-driven company focused on building innovative digital products and intelligent solutions. We are committed to creating a collaborative environment where talented professionals can grow and make an impact.",
  });

  const handleChange = (event) => {
    setCompany({
      ...company,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = () => {
    setEditing(false);

    // API call will go here
    console.log(company);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Recruiter Navbar */}
      <RNavbar />

      <Box sx={{ display: "flex" }}>
        {/* Recruiter Sidebar */}
        <RSidebar />

        {/* Company Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: "calc(100vh - 72px)",
            p: { xs: 2, md: 4 },
            overflow: "hidden",
          }}
        >
          {/* ================= HEADER ================= */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                Company
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "14px",
                  mt: 0.7,
                }}
              >
                Manage your company profile and information
              </Typography>
            </Box>

            {!editing ? (
              <Button
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                onClick={() => setEditing(true)}
                sx={{
                  textTransform: "none",
                  backgroundColor: "primary.main",
                  borderRadius: "10px",
                  px: 2.5,
                  py: 1.1,
                  fontWeight: 600,
                  boxShadow: "none",

                  "&:hover": {
                    backgroundColor: "primary.dark",
                    boxShadow: "none",
                  },
                }}
              >
                Edit Company
              </Button>
            ) : (
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  onClick={() => setEditing(false)}
                  sx={{
                    textTransform: "none",
                    color: "text.secondary",
                    borderColor: "divider",
                    borderRadius: "10px",
                    px: 2.5,

                    "&:hover": {
                      borderColor: "text.secondary",
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "primary.main",
                    borderRadius: "10px",
                    px: 2.5,
                    fontWeight: 600,
                    boxShadow: "none",

                    "&:hover": {
                      backgroundColor: "primary.dark",
                      boxShadow: "none",
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Stack>
            )}
          </Box>

          {/* ================= COMPANY PROFILE ================= */}

          <Card
            sx={{
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "16px",
              color: "text.primary",
              boxShadow: "none",
              mb: 2.5,
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                  mb: 3,
                }}
              >
                {/* LOGO */}

                <Box sx={{ position: "relative" }}>
                  <Avatar
                    sx={{
                      width: 85,
                      height: 85,

                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(59, 130, 246, 0.18)"
                          : "rgba(59, 130, 246, 0.10)",

                      color: "primary.main",

                      border: "1px solid",
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(59, 130, 246, 0.35)"
                          : "rgba(59, 130, 246, 0.20)",
                    }}
                  >
                    <BusinessOutlinedIcon sx={{ fontSize: 38 }} />
                  </Avatar>

                  {editing && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -5,
                        right: -5,
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        cursor: "pointer",

                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      <CloudUploadOutlinedIcon
                        sx={{
                          fontSize: 17,
                          color: "common.white",
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* COMPANY NAME */}

                <Box>
                  {editing ? (
                    <TextField
                      name="name"
                      value={company.name}
                      onChange={handleChange}
                      variant="standard"
                      sx={{
                        "& input": {
                          color: "text.primary",
                          fontSize: "23px",
                          fontWeight: 600,
                        },

                        "& .MuiInput-underline:before": {
                          borderColor: "divider",
                        },

                        "& .MuiInput-underline:hover:before": {
                          borderColor: "primary.main",
                        },

                        "& .MuiInput-underline:after": {
                          borderColor: "primary.main",
                        },
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "23px",
                        fontWeight: 650,
                        color: "text.primary",
                      }}
                    >
                      {company.name}
                    </Typography>
                  )}

                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: "14px",
                      mt: 0.5,
                    }}
                  >
                    {company.industry}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.8,
                    }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{
                        fontSize: 17,
                        color: "text.secondary",
                      }}
                    />

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "13px",
                      }}
                    >
                      {company.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ borderColor: "divider" }} />

              {/* ABOUT */}

              <Box sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontSize: "17px",
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  About Company
                </Typography>

                {editing ? (
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    name="description"
                    value={company.description}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "text.primary",
                        backgroundColor: "background.default",
                        borderRadius: "10px",
                      },

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "divider",
                      },

                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "text.secondary",
                        },

                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },

                      "& textarea": {
                        color: "text.primary",
                      },
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: "14px",
                      lineHeight: 1.8,
                      maxWidth: "900px",
                    }}
                  >
                    {company.description}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* ================= COMPANY INFORMATION ================= */}

          <Card
            sx={{
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "16px",
              color: "text.primary",
              boxShadow: "none",
              mb: 2.5,
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: "17px",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Company Information
              </Typography>

              <Grid container spacing={3}>
                {/* COMPANY NAME */}

                <Grid item xs={12} md={6}>
                  <CompanyField
                    label="Company Name"
                    icon={<BusinessOutlinedIcon />}
                    editing={editing}
                    name="name"
                    value={company.name}
                    onChange={handleChange}
                  />
                </Grid>

                {/* INDUSTRY */}

                <Grid item xs={12} md={6}>
                  <CompanyField
                    label="Industry"
                    editing={editing}
                    name="industry"
                    value={company.industry}
                    onChange={handleChange}
                  />
                </Grid>

                {/* COMPANY SIZE */}

                <Grid item xs={12} md={6}>
                  <CompanyField
                    label="Company Size"
                    icon={<PeopleOutlineOutlinedIcon />}
                    editing={editing}
                    name="employees"
                    value={company.employees}
                    onChange={handleChange}
                  />
                </Grid>

                {/* LOCATION */}

                <Grid item xs={12} md={6}>
                  <CompanyField
                    label="Location"
                    icon={<LocationOnOutlinedIcon />}
                    editing={editing}
                    name="location"
                    value={company.location}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ================= CONTACT INFORMATION ================= */}

          <Card
            sx={{
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "16px",
              color: "text.primary",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: "17px",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Contact Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CompanyField
                    label="Email Address"
                    icon={<EmailOutlinedIcon />}
                    editing={editing}
                    name="email"
                    value={company.email}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CompanyField
                    label="Phone Number"
                    icon={<PhoneOutlinedIcon />}
                    editing={editing}
                    name="phone"
                    value={company.phone}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CompanyField
                    label="Website"
                    icon={<LanguageOutlinedIcon />}
                    editing={editing}
                    name="website"
                    value={company.website}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

/* =========================================================
   REUSABLE COMPANY FIELD
========================================================= */

const CompanyField = ({
  label,
  icon,
  editing,
  name,
  value,
  onChange,
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: "12px",
          fontWeight: 500,
          mb: 1,
        }}
      >
        {label}
      </Typography>

      {editing ? (
        <TextField
          fullWidth
          name={name}
          value={value}
          onChange={onChange}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "text.primary",
              backgroundColor: "background.default",
              borderRadius: "9px",
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "divider",
            },

            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "text.secondary",
              },

            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "primary.main",
              },

            "& .MuiInputBase-input": {
              color: "text.primary",
            },
          }}
        />
      ) : (
        <Box
          sx={{
            minHeight: 44,
            px: 1.75,

            backgroundColor: "background.default",

            border: "1px solid",
            borderColor: "divider",

            borderRadius: "9px",

            display: "flex",
            alignItems: "center",
            gap: 1,

            boxSizing: "border-box",

            transition: "border-color 0.2s ease",

            "&:hover": {
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.20)"
                  : "rgba(0,0,0,0.20)",
            },
          }}
        >
          {icon && (
            <Box
              sx={{
                display: "flex",
                color: "primary.main",

                "& svg": {
                  fontSize: 19,
                },
              }}
            >
              {icon}
            </Box>
          )}

          <Typography
            sx={{
              color: "text.primary",
              fontSize: "14px",
            }}
          >
            {value}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Company;