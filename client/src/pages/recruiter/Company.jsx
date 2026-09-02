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
  Chip,
} from "@mui/material";

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
        backgroundColor: "#080f1f",
        color: "#fff",
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
                  color: "#fff",
                }}
              >
                Company
              </Typography>

              <Typography
                sx={{
                  color: "#8190aa",
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
                  backgroundColor: "#315db5",
                  borderRadius: "10px",
                  px: 2.5,
                  py: 1.1,
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#3b6bc9",
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
                    color: "#aebbd0",
                    borderColor: "#293750",
                    borderRadius: "10px",
                    px: 2.5,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#315db5",
                    borderRadius: "10px",
                    px: 2.5,
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#3b6bc9",
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
              backgroundColor: "#101a2e",
              border: "1px solid #202d45",
              borderRadius: "16px",
              color: "#fff",
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
                      backgroundColor: "#1b3159",
                      color: "#6ca8ff",
                      border: "1px solid #294775",
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
                        backgroundColor: "#315db5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <CloudUploadOutlinedIcon
                        sx={{
                          fontSize: 17,
                          color: "#fff",
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
                          color: "#fff",
                          fontSize: "23px",
                          fontWeight: 600,
                        },
                        "& .MuiInput-underline:before": {
                          borderColor: "#293750",
                        },
                        "& .MuiInput-underline:hover:before": {
                          borderColor: "#4675c8",
                        },
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "23px",
                        fontWeight: 650,
                        color: "#fff",
                      }}
                    >
                      {company.name}
                    </Typography>
                  )}

                  <Typography
                    sx={{
                      color: "#8190aa",
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
                        color: "#71819d",
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#71819d",
                        fontSize: "13px",
                      }}
                    >
                      {company.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ borderColor: "#202d45" }} />

              {/* ABOUT */}

              <Box sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    color: "#fff",
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
                        color: "#dce5f4",
                        backgroundColor: "#0c1527",
                        borderRadius: "10px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#293750",
                      },
                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "#405576",
                        },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4675c8",
                      },
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "#8998b1",
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
              backgroundColor: "#101a2e",
              border: "1px solid #202d45",
              borderRadius: "16px",
              color: "#fff",
              boxShadow: "none",
              mb: 2.5,
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography
                sx={{
                  color: "#fff",
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
              backgroundColor: "#101a2e",
              border: "1px solid #202d45",
              borderRadius: "16px",
              color: "#fff",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography
                sx={{
                  color: "#fff",
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

const CompanyField = ({ label, icon, editing, name, value, onChange }) => {
  return (
    <Box>
      <Typography
        sx={{
          color: "#71809b",
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
              color: "#dce5f4",
              backgroundColor: "#0c1527",
              borderRadius: "9px",
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#293750",
            },

            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#405576",
            },

            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4675c8",
            },
          }}
        />
      ) : (
        <Box
          sx={{
            minHeight: 44,
            px: 1.75,
            backgroundColor: "#0c1527",
            border: "1px solid #202d45",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            boxSizing: "border-box",
          }}
        >
          {icon && (
            <Box
              sx={{
                display: "flex",
                color: "#6b9ce6",
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
              color: "#d7dfed",
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
