import { useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../../dashboard/Sidebar.jsx";

// Maps this Sidebar component's internal ids -> actual routes
const ID_TO_PATH = {
  dashboard: "/recruiter",
  jobs: "/recruiter/jobs",
  candidates: "/recruiter/candidates",
  analytics: "/recruiter/analytics",
  interviews: "/recruiter/interviews",
  company: "/recruiter/company",
  settings: "/recruiter/settings",
};

// Reverse map: route path -> id (used to highlight the active item)
const PATH_TO_ID = Object.fromEntries(
  Object.entries(ID_TO_PATH).map(([id, path]) => [path, id])
);

const RSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeId = PATH_TO_ID[location.pathname] || "dashboard";

  const handleNavigate = (id) => {
    const path = ID_TO_PATH[id];
    if (path) {
      navigate(path);
    }
  };

  return <Sidebar active={activeId} onNavigate={handleNavigate} />;
};

export default RSidebar;