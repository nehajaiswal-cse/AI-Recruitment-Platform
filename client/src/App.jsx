
import './index.css';
import {Routes, Route} from 'react-router-dom';

// Dashboards
import ADashboard from "./pages/applicant/Dashboard";
import RDashboard from "./pages/recruiter/Dashboard";

// Common
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ProtectedRoute from "./components/dashboard/ProtectedRoute.jsx";

// Applicant Auth
import ApplicantRegister from "./pages/applicant/ApplicantRegister";
import ApplicantLogin from "./pages/applicant/ApplicantLogin";

// Recruiter Auth
import RecruiterLogin from "./pages/recruiter/RecruiterLogin";
import RecruiterRegister from "./pages/recruiter/RecruiterRegister";

// Profiles
import ApplicantProfile from "./pages/applicant/Profile";
import RecruiterProfile from "./pages/recruiter/Profile";

// Applicant Interviews
import ApplicantInterviews from "./pages/applicant/Interview/Interviews.jsx";
import InterviewDetails from "./pages/applicant/Interview/InterviewDetails.jsx";
import AIInterviewCoach from "./pages/applicant/Interview/AIInterviewCoach.jsx";
import InterviewFeedback from "./pages/applicant/Interview/InterviewFeedback.jsx";
import InterviewCalendar from "./pages/applicant/Interview/InterviewCalendar.jsx";

// Recruiter
import RecruiterInterviews from "./pages/recruiter/Interviews";
import Candidates from "./pages/recruiter/Candidates";

// Jobs
import Jobs from "./pages/recruiter/jobs/Jobs.jsx";
import CreateJob from "./pages/recruiter/jobs/createJob.jsx";
import EditJob from "./pages/recruiter/jobs/editJob.jsx";
import ViewJob from "./pages/recruiter/jobs/ViewJob.jsx";

//apply
import FindJobs from "./pages/applicant/jobs/FindJobs.jsx"
import ApplicantviewJob from "./pages/applicant/jobs/ApplicantviewJob.jsx"
import Apply from "./pages/applicant/jobs/apply.jsx"

import Analytics from "./pages/recruiter/Analytics.jsx"



export default function App() {
  return (
    <div>
      <Routes>

        {/* ================= HOME ================= */}
        <Route path="/" element={<Home />} />

        {/* ================= AUTH ROUTES ================= */}
        <Route path="/applicant/register" element={<ApplicantRegister />} />
        <Route path="/applicant/login" element={<ApplicantLogin />} />

        <Route path="/recruiter/register" element={<RecruiterRegister />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />

        {/* ================= APPLICANT ROUTES ================= */}
        <Route element={<ProtectedRoute allowedRole="applicant" />}>
          <Route path="/applicant" element={<ADashboard />} />
          <Route path="/applicant-dashboard" element={<ADashboard />} />
          <Route path="/applicant/profile" element={<ApplicantProfile />} />

          <Route
            path="/applicant/interviews"
            element={<ApplicantInterviews />}
          />

          <Route
            path="/applicant/interviews/details/:id"
            element={<InterviewDetails />}
          />

          <Route
            path="/applicant/interviews/coach"
            element={<AIInterviewCoach />}
          />

          <Route
            path="/applicant/interviews/feedback/:id"
            element={<InterviewFeedback />}
          />

          <Route
            path="/applicant/interviews/calendar"
            element={<InterviewCalendar />}
          />
        </Route>

        {/* ================= RECRUITER ROUTES ================= */}
        <Route element={<ProtectedRoute allowedRole="recruiter" />}>
          <Route path="/recruiter" element={<RDashboard />} />
          <Route path="/recruiter-dashboard" element={<RDashboard />} />

          <Route
            path="/recruiter/profile"
            element={<RecruiterProfile />}
          />

          <Route
            path="/recruiter/interviews"
            element={<RecruiterInterviews />}
          />

          <Route
            path="/recruiter/candidates"
            element={<Candidates />}
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

    

          <Route path="/recruiter/jobs" element={<Jobs />} />
          <Route path="/recruiter/jobs/create" element={<CreateJob />}/>

          <Route path="/recruiter/jobs/:id/edit"element={<EditJob />}/>

          <Route path="/recruiter/jobs/:id"element={<ViewJob />}/>
          <Route path="*" element={<NotFound />} />

          <Route path="/recruiter/analytics" element={<Analytics />} />
       

     
    </Routes>
      
    </div>
    
  );
}
