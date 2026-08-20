//import React from 'react'

import './index.css';
import {Routes, Route} from 'react-router-dom';
import ADashboard from './pages/applicant/Dashboard';
import RDashboard from './pages/recruiter/Dashboard';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import ApplicantRegister from './pages/applicant/ApplicantRegister';
import ApplicantLogin from './pages/applicant/ApplicantLogin';
import RecruiterLogin from './pages/recruiter/RecruiterLogin';
import RecruiterRegister from './pages/recruiter/RecruiterRegister';
import ProtectedRoute from './components/dashboard/ProtectedRoute.jsx';
import ApplicantProfile from './pages/applicant/Profile';
import RecruiterProfile from './pages/recruiter/Profile';
import Jobs from "./pages/recruiter/jobs/Jobs.jsx"
import CreateJob from "./pages/recruiter/jobs/createJob.jsx"
import EditJob from "./pages/recruiter/jobs/editJob.jsx"
import ViewJob from "./pages/recruiter/jobs/ViewJob.jsx"
import FindJobs from "./pages/applicant/jobs/FindJobs.jsx"
import ApplicantviewJob from "./pages/applicant/jobs/ApplicantviewJob.jsx"
import Apply from "./pages/applicant/jobs/apply.jsx"


export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
       
        <Route path="*" element={<NotFound />} />
        <Route path="/applicant/register" element={<ApplicantRegister />} />
        <Route path="/applicant/login" element={<ApplicantLogin />} />
        <Route path="/recruiter/register" element={<RecruiterRegister />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />  

        <Route element={<ProtectedRoute allowedRole="applicant" />}>
        <Route path="/applicant" element={<ADashboard />} />   
        <Route path="/applicant/profile" element={<ApplicantProfile />} />
        </Route>
        

        <Route element={<ProtectedRoute allowedRole="recruiter" />}>
        <Route path="/recruiter" element={<RDashboard />} />
        <Route path="/recruiter/profile" element={<RecruiterProfile />} />

        <Route element={<ProtectedRoute allowedRole="recruiter" />}>
        <Route path="/recruiter/jobs" element={<Jobs />} />
        </Route>
        <Route  path="/recruiter/jobs/create"element={<CreateJob />}/>
        <Route element={<ProtectedRoute allowedRole="recruiter" />}>
         <Route  path="/recruiter/jobs/edit/:id"element={<EditJob />}/>
        </Route>
        <Route element={<ProtectedRoute allowedRole="recruiter" />}>
         <Route  path="/recruiter/jobs/:id/edit"element={<EditJob />}/>
        </Route>
        <Route element={<ProtectedRoute allowedRole="recruiter" />}>
         <Route  path="/recruiter/jobs/:id"element={<ViewJob />}/>
        </Route>
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

      </Routes>

     
       
    </div>
  )
}





