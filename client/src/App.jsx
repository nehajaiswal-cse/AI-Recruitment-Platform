
import "./index.css";
import { Routes, Route } from "react-router-dom";

//import { ApplicationProvider } from "./context/ApplicationProvider";

import ADashboard from "./pages/applicant/Dashboard";
import ApplicantRegister from "./pages/applicant/ApplicantRegister";
import ApplicantLogin from "./pages/applicant/ApplicantLogin";
import ApplicantProfile from "./pages/applicant/Profile";
import FindJobs from  "./pages/applicant/jobs/FindJobs.jsx"
import Apply from "./pages/applicant/jobs/Apply.jsx"

import RDashboard from "./pages/recruiter/Dashboard";
import RecruiterLogin from "./pages/recruiter/RecruiterLogin";
import RecruiterRegister from "./pages/recruiter/RecruiterRegister";
import RecruiterProfile from "./pages/recruiter/Profile";
import Analytics from "./pages/recruiter/Analytics";
import Candidates from "./pages/recruiter/Candidates";

import Jobs from "./pages/recruiter/jobs/Jobs.jsx";
import CreateJob from "./pages/recruiter/jobs/createJob.jsx";
import EditJob from "./pages/recruiter/jobs/editJob.jsx";
import ViewJob from "./pages/recruiter/jobs/ViewJob.jsx";



import ProtectedRoute from "./components/dashboard/ProtectedRoute.jsx";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    //<ApplicationProvider>
      <div>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<Home />} />

          <Route
            path="/applicant/register"
            element={<ApplicantRegister />}
          />

          <Route
            path="/applicant/login"
            element={<ApplicantLogin />}
          />

          <Route
            path="/recruiter/register"
            element={<RecruiterRegister />}
          />

          <Route
            path="/recruiter/login"
            element={<RecruiterLogin />}
          />
  
         
    

          {/* ================= APPLICANT ROUTES ================= */}

          <Route
            element={<ProtectedRoute allowedRole="applicant" />}
          >
            <Route
              path="/applicant"
              element={<ADashboard />}
            />

            <Route
              path="/applicant/profile"
              element={<ApplicantProfile />}
            />

            
            <Route
            path="/applicant/jobs"
            element={<FindJobs></FindJobs>}
              />

            <Route
            path = "/applicant/jobs/:jobId/apply"
            element={<Apply></Apply>}
            />  
          </Route>



          {/* ================= RECRUITER ROUTES ================= */}

          <Route
            element={<ProtectedRoute allowedRole="recruiter" />}
          >
            <Route
              path="/recruiter"
              element={<RDashboard />}
            />

            <Route
              path="/recruiter/profile"
              element={<RecruiterProfile />}
            />

            <Route
              path="/recruiter/analytics"
              element={<Analytics />}
            />
            <Route 
              path="/recruiter/candidates" 
              element={<Candidates />} 
            />
            
            <Route
              path="/recruiter/jobs"
              element={<Jobs />}
            />

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


          {/* ================= 404 ================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </div>
    //</ApplicationProvider>
  );
}




