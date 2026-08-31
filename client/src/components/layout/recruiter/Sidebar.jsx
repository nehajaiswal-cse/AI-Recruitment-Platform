import Sidebar from "../../dashboard/Sidebar.jsx";

import {
  LuLayoutDashboard,
  LuBriefcaseBusiness,
  LuUsers,
  LuChartNoAxesCombined,
  LuVideo,
  LuBuilding2,
  LuSettings,
} from "react-icons/lu";

const recruiterSidebarItems = [
  {
    label: "Dashboard",
    path: "/recruiter",
    icon: LuLayoutDashboard,
  },
  {
    label: "Manage Jobs",
    path: "/recruiter/jobs",
    icon: LuBriefcaseBusiness,
  },
  {
    label: "Candidates",
    path: "/recruiter/candidates",
    icon: LuUsers,
  },
  {
    label: "Analytics",
    path: "/recruiter/analytics",
    icon: LuChartNoAxesCombined,
  },
  {
    label: "Interviews",
    path: "/recruiter/interviews",
    icon: LuVideo,
  },
  {
    label: "Company",
    path: "/recruiter/company",
    icon: LuBuilding2,
  },
  {
    label: "Settings",
    path: "/recruiter/settings",
    icon: LuSettings,
  },
];

const RSidebar = () => {
  return <Sidebar items={recruiterSidebarItems} />;
};

export default RSidebar;