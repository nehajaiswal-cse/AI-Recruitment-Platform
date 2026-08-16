import Navbar from "../../components/dashboard/Navbar";
import LoginForm from "../auth/login";

const ApplicantLogin = () => {
  return (
    <div className="min-h-screen bg-gray-700 text-white flex flex-col">

      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">

        <LoginForm role="applicant" />

      </main>

      <footer className="bg-gray-800 border-t-2 border-gray-600 py-4 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} Talvyn AI Recruitment Platform. All rights reserved.
      </footer>

    </div>
  );
};

export default ApplicantLogin;