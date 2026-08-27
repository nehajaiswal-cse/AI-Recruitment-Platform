
import "./index.css";
import { Routes, Route } from "react-router-dom";

//import { ApplicationProvider } from "./context/ApplicationProvider";

import ADashboard from "./pages/applicant/Dashboard";
import ApplicantRegister from "./pages/applicant/ApplicantRegister";
import ApplicantLogin from "./pages/applicant/ApplicantLogin";
import ApplicantProfile from "./pages/applicant/Profile";
import SavedJob from "./pages/applicant/SavedJob.jsx";
import FindJobs from  "./pages/applicant/jobs/FindJobs.jsx";
import Apply from "./pages/applicant/jobs/Apply.jsx";
import ApplicantviewJob from "./pages/applicant/jobs/ApplicantviewJob.jsx";


import RDashboard from "./pages/recruiter/Dashboard";
import RecruiterLogin from "./pages/recruiter/RecruiterLogin";
import RecruiterRegister from "./pages/recruiter/RecruiterRegister";
import RecruiterProfile from "./pages/recruiter/Profile";
import Analytics from "./pages/recruiter/Analytics";
import Candidates from "./pages/recruiter/Candidates"
import Interview from "./pages/recruiter/Interviews"

import Jobs from "./pages/recruiter/jobs/Jobs.jsx";
import CreateJob from "./pages/recruiter/jobs/createJob.jsx";
import EditJob from "./pages/recruiter/jobs/editJob.jsx";
import ViewJob from "./pages/recruiter/jobs/ViewJob.jsx";

import AInterview from "./pages/applicant/Interview/Interviews"


import Settings from "./pages/applicant/Settings";
import Resume from "./pages/applicant/Resume";
import ResumeBuilder from "./pages/applicant/ResumeBuilder";


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
            
             <Route path="/applicant/saved-jobs" element={<SavedJob />} />
             <Route path="/applicant/interviews" element={<AInterview />} />

            <Route
              path="/applicant/settings"
              element={<Settings />}
            />  
            
            <Route
              path="/applicant/resume"
              element={<Resume />}
            />
            
            <Route
  path="/applicant/resume-builder"
  element={<ResumeBuilder />}
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

           <Route element={<ProtectedRoute allowedRole="applicant" />}>
        <Route path="/applicant/jobs" element={<FindJobs />} />
        </Route>
        <Route element={<ProtectedRoute allowedRole="applicant" />}>
        <Route path="/applicant/jobs/:jobId" element={<ApplicantviewJob />} />
        </Route>  
        <Route element={<ProtectedRoute allowedRole="applicant" />}>
        <Route path="/applicant/jobs/:jobId/apply" element={<Apply />} />
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
              path="/recruiter/interviews"
              element={<Interview/>}
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




