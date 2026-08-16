
import "../../../index.css"
import Navbar from "../../dashboard/Navbar.jsx"

const recruiterLinks = [
  {
    label: "Dashboard",
    path: "/recruiter",
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
]

const RNavbar = ({ onSidebarToggle }) => {
  return (
    <Navbar
      links={recruiterLinks}
      onSidebarToggle={onSidebarToggle}
    />
  )
}

export default RNavbar