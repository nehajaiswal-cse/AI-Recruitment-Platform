import Navbar from "../../dashboard/Navbar.jsx";
import '../../../index.css';

const applicantLinks = [
  {
    label: "Dashboard",
    path: "/applicant",
  },
  {
    label: "Find Jobs",
    path: "/applicant/jobs",
  },
  {
    label: "Saved Jobs",
    path: "/applicant/saved-jobs",
  },
  {
    label: "Applications",
    path: "/applicant/applications",
  },
  {
    label: "Interviews",
    path: "/applicant/interviews",
  },
  {
    label: "Resume",
    path: "/applicant/resume",
  },
  {
    label: "Profile",
    path: "/applicant/profile",
  },
  {
    label: "Settings",
    path: "/applicant/settings",
  },
];

const ANavbar = () => {
  return (
    <Navbar links={applicantLinks} showLogout={true} />
  );
};

export default ANavbar;