import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../../dashboard/Sidebar.jsx";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";


const applicantSidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/applicant",
    icon: DashboardRoundedIcon,
  },
  {
    id: "findjobs",
    label: "Find Jobs",
    path: "/applicant/jobs",
    icon: WorkOutlineRoundedIcon,
  },
  {
    id: "savedjobs",
    label: "Saved Jobs",
    path: "/applicant/saved-jobs",
    icon: BookmarkBorderIcon,
  },
  {
    id: "myapplications",
    label: "My Applications",
    path: "/applicant/applications",
    icon: DescriptionOutlinedIcon,
  },
  {
    id: "resume",
    label: "Resume",
    path: "/applicant/resume",
    icon: ArticleOutlinedIcon,
  },
  {
    id: "profile",
    label: "Profile",
    path: "/applicant/profile",
    icon: PersonOutlineIcon,
  },
  
];

const ASidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem =
    applicantSidebarItems.find(
      (item) => location.pathname === item.path
    ) || applicantSidebarItems[0];

  const handleNavigate = (id) => {
    const item = applicantSidebarItems.find(
      (item) => item.id === id
    );

    if (item) {
      navigate(item.path);
    }
  };

  return (
    <Sidebar
      items={applicantSidebarItems}
      active={activeItem.id}
      onNavigate={handleNavigate}
    />
  );
};

export default ASidebar;