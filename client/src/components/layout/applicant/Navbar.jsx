import Navbar from "../../dashboard/Navbar.jsx";
import '../../../index.css';


const applicantLinks = [
  {
    label: "Dashboard",
    path: "/applicant/dashboard",
  },
  {
    label: "Find Jobs",
    path: "/applicant/jobs",
  },
  {
    label: "Saved Jobs",
    path: "/applicant/candidates",
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
    label: "Profile",
    path: "/applicant/profile",
  },
  {
    label: "Logout",
    path: "/logout",
  },
];

const ANavbar = () => {
  return (
    <Navbar links={applicantLinks} />
  );
};

export default ANavbar;