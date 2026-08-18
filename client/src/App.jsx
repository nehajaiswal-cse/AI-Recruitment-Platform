import "./index.css";
import { Routes, Route } from "react-router-dom";

import ADashboard from "./pages/applicant/Dashboard";
import RDashboard from "./pages/recruiter/Dashboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

import ApplicantRegister from "./pages/applicant/ApplicantRegister";
import ApplicantLogin from "./pages/applicant/ApplicantLogin";
import RecruiterLogin from "./pages/recruiter/RecruiterLogin";
import RecruiterRegister from "./pages/recruiter/RecruiterRegister";

import ProtectedRoute from "./components/dashboard/ProtectedRoute.jsx";

import ApplicantProfile from "./pages/applicant/Profile";
import RecruiterProfile from "./pages/recruiter/Profile";

import Interviews from "./pages/recruiter/Interviews";
import Candidates from "./pages/recruiter/Candidates";

import Jobs from "./pages/recruiter/jobs/Jobs.jsx";
import CreateJob from "./pages/recruiter/jobs/createJob.jsx";
import EditJob from "./pages/recruiter/jobs/editJob.jsx";
import ViewJob from "./pages/recruiter/jobs/ViewJob.jsx";

export default function App() {
  return (
    <div>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/applicant/register" element={<ApplicantRegister />} />
        <Route path="/applicant/login" element={<ApplicantLogin />} />

        <Route path="/recruiter/register" element={<RecruiterRegister />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />

        {/* Applicant Routes */}
        <Route element={<ProtectedRoute allowedRole="applicant" />}>
          <Route path="/applicant" element={<ADashboard />} />
          <Route
            path="/applicant/profile"
            element={<ApplicantProfile />}
          />
        </Route>

        {/* Recruiter Routes */}
        <Route element={<ProtectedRoute allowedRole="recruiter" />}>
          <Route path="/recruiter" element={<RDashboard />} />

          <Route
            path="/recruiter/profile"
            element={<RecruiterProfile />}
          />

          {/* Interviews */}
          <Route
            path="/recruiter/interviews"
            element={<Interviews />}
          />
          {/* Candidates */}
          <Route
            path="/recruiter/candidates"
            element={<Candidates />}
          />
          {/* Jobs */}
          <Route path="/recruiter/jobs" element={<Jobs />} />

          <Route
            path="/recruiter/jobs/create"
            element={<CreateJob />}
          />

          <Route
            path="/recruiter/jobs/edit/:id"
            element={<EditJob />}
          />

          <Route
            path="/recruiter/jobs/:id/edit"
            element={<EditJob />}
          />

          <Route
            path="/recruiter/jobs/:id"
            element={<ViewJob />}
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </div>
  );
}