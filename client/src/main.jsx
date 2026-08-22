import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from "./App.jsx";
import "./index.css";
import AuthContextProvider from "./context/AuthContext.jsx";

import { ThemeModeProvider } from './context/ThemeModeContext.jsx'
import AppTheme from './components/common/AppTheme.jsx'
import { JobProvider } from './context/jobContext.jsx';
import { CandidateProvider } from './context/CandidateContext.jsx';
import { InterviewProvider } from "./context/InterviewContext.jsx"
//import { ApplicationProvider } from './context/ApplicationContext.jsx'; 
import { ApplicationProvider } from "./context/ApplicationProvider.jsx";

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <AuthContextProvider>
      <JobProvider>
        <CandidateProvider>
          <ApplicationProvider>
            <InterviewProvider>
             <BrowserRouter>
               <ThemeModeProvider>
                 <AppTheme>
                   <App />
                 </AppTheme>
               </ThemeModeProvider>
             </BrowserRouter>
            </InterviewProvider>
          </ApplicationProvider>
         
          
        </CandidateProvider>
      </JobProvider>
    </AuthContextProvider>
  </React.StrictMode>
)
