//import React from 'react'

import './index.css';
import {Routes, Route} from 'react-router-dom';
import ADashboard from './pages/applicant/Dashboard';
import RDashboard from './pages/recruiter/Dashboard';
import NotFound from './pages/NotFound';
import Home from './pages/Home';

export default function App() {
  return (
    <div>
      <Routes>
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> */}
         <Route path="/applicant" element={<ADashboard />} />
        <Route path="/" element={<Home/>} />
        <Route path="/recruiter" element={<RDashboard />} />
        <Route path="*" element={<NotFound />} />
        
      </Routes>

     
       
    </div>
  )
}
