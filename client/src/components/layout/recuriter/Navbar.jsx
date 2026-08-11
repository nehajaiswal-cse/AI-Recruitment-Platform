
import "../../../index.css";
import Navbar from "../../dashboard/Navbar.jsx";


const recruiterLinks = [
  {
    label: "Dashboard",
    path: "/recruiter/dashboard",
  },
  {
    label: "Jobs",
    path: "/recruiter/jobs",
  },
  {
    label: "Candidates",
    path: "/recruiter/candidates",
  },
  {
    label: "Interviews",
    path: "/recruiter/interviews",
  },
  {
    label: "Analytics",
    path: "/recruiter/analytics",
  },
  {
    label: "Profile",
    path: "/recruiter/profile",
  },
  {
    label: "Logout",
    path: "/recruiter/logout",
  },
];



const RNavbar = () => {
  return (
    <div>
      <Navbar links={recruiterLinks} />
    </div>
  );
};

export default RNavbar;

