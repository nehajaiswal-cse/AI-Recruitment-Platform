
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../../dashboard/Sidebar.jsx";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";

const recruiterSidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/recruiter",
    icon: DashboardRoundedIcon,
  },
  {
    id: "jobs",
    label: "Manage Jobs",
    path: "/recruiter/jobs",
    icon: WorkOutlineRoundedIcon,
  },
  {
    id: "candidates",
    label: "Candidates",
    path: "/recruiter/candidates",
    icon: GroupOutlinedIcon,
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/recruiter/analytics",
    icon: InsightsRoundedIcon,
  },
  {
    id: "interviews",
    label: "Interviews",
    path: "/recruiter/interviews",
    icon: VideocamOutlinedIcon,
  },
  {
    id: "profile",
    label: "Profile",
    path: "/recruiter/profile",
    icon: PersonOutlineIcon,
  },
];

const RSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem =
    recruiterSidebarItems.find(
      (item) => location.pathname === item.path
    ) || recruiterSidebarItems[0];

  const handleNavigate = (id) => {
    const item = recruiterSidebarItems.find(
      (item) => item.id === id
    );

    if (item) {
      navigate(item.path);
    }
  };

  return (
    <Sidebar
      items={recruiterSidebarItems}
      active={activeItem.id}
      onNavigate={handleNavigate}
    />
  );
};

export default RSidebar;