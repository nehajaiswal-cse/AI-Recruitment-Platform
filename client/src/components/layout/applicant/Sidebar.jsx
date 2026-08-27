import Sidebar from "../../dashboard/Sidebar.jsx";

import {
  LuLayoutDashboard,
  LuBriefcase,
  LuBookmark,
  LuFileText,
  LuUser,
  LuSettings,
} from "react-icons/lu";

const applicantSidebarItems = [
  {
    label: "Dashboard",
    path: "/applicant",
    icon: LuLayoutDashboard,
  },
  {
    label: "Find Jobs",
    path: "/applicant/jobs",
    icon: LuBriefcase,
  },
  {
    label: "Saved Jobs",
    path: "/applicant/saved-jobs",
    icon: LuBookmark,
  },
  {
    label: "My Applications",
    path: "/applicant/applications",
    icon: LuFileText,
  },
  {
    label: "Resume",
    path: "/applicant/resume",
    icon: LuFileText,
  },
  {
    label: "Profile",
    path: "/applicant/profile",
    icon: LuUser,
  },
  {
    label: "Settings",
    path: "/applicant/settings",
    icon: LuSettings,
  },
];

const ASidebar = () => {
  return <Sidebar items={applicantSidebarItems} />;
};

export default ASidebar;