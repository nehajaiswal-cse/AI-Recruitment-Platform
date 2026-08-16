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

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route element={<ProtectedRoute allowedRole="recruiter" />}>
        <Route path="/recruiter"element={<RDashboard />}/>
        </Route>
        <Route element={<ProtectedRoute allowedRole="applicant" />}>
        <Route path="/applicant"element={<ADashboard />}/>
        </Route>
        <Route path="/recruiter" element={<ProtectedRoute allowedRole="recruiter" />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/applicant/register" element={<ApplicantRegister />} />
        <Route path="/applicant/login" element={<ApplicantLogin />} />
        <Route path="/recruiter/register" element={<RecruiterRegister />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />  
         
        
      </Routes>

     
       
    </div>
  )
}






