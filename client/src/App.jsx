//import React from 'react'

import './index.css';
import {Routes, Route} from 'react-router-dom';
import ADashboard from './pages/applicant/Dashboard';
import RDashboard from './pages/recruiter/Dashboard';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ApplicantRegister from './pages/applicant/ApplicantRegister';
import ApplicantLogin from './pages/applicant/ApplicantLogin';
import RecruiterLogin from './pages/recruiter/RecruiterLogin';
import RecruiterRegister from './pages/recruiter/RecruiterRegister';


export default function App() {
  return (
    <div>
      <Routes>
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
       {/* <Route path="/forgot-password" element={<ForgotPassword />} />  */}
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />  */}
         <Route path="/applicant" element={<ADashboard />} />
        <Route path="/" element={<Home/>} />
        <Route path="/recruiter" element={<RDashboard />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/applicant/register" element={<ApplicantRegister />} />
        <Route path="/applicant/login" element={<ApplicantLogin />} />
        <Route path="/recruiter/register" element={<RecruiterRegister />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />  
         
        
      </Routes>

     
       
    </div>
  )
}
