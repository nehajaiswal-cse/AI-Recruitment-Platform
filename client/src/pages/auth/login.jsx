import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiBriefcase,
  FiUserCheck,
  FiCpu,
} from "react-icons/fi";
import Navbar from "../../components/dashboard/Navbar";
import Logo from "../../components/common/Logo";
//import { loginUser } from "../../api/authApi";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await loginUser(formData);
      setSuccess("Login successful! Redirecting...");
      
      const role = res.user?.role || "applicant";
      setTimeout(() => {
        if (role === "recruiter") {
          navigate("/recruiter");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const email = role === "recruiter" ? "recruiter@talvyn.ai" : "applicant@talvyn.ai";
    setFormData({
      email,
      password: "password123",
    });
  };

  return (
    <div className="min-h-screen bg-gray-700 text-white flex flex-col justify-between">
      <Navbar></Navbar>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Feature Banner */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-600 text-amber-300 text-sm font-medium">
              <FiCpu className="text-base text-blue-400" /> AI Recruitment Platform
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Welcome back to <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">
                Talvyn Dashboard
              </span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed">
              Log in to manage candidate pipelines, run AI resume analysis, and track application statuses seamlessly.
            </p>

            {/* Feature Cards matching dashboard styling */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800 border border-gray-600 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold shrink-0">
                  <FiUserCheck className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Smart Candidate Screening</h3>
                  <p className="text-sm text-gray-300">Automated resume parsing and applicant ranking</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800 border border-gray-600 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold shrink-0">
                  <FiBriefcase className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Role-Based Portals</h3>
                  <p className="text-sm text-gray-300">Tailored views for both Applicants and Recruiters</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Login Card matching Dashboard Sidebar/Card palette */}
          <div className="lg:col-span-6">
            <div className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
              
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Sign In</h2>
                <p className="text-gray-300 text-sm mt-1">
                  Enter your credentials to access your dashboard
                </p>
              </div>

              {error && (
                <div className="mb-5 p-4 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-sm flex items-start gap-3">
                  <FiAlertCircle className="text-lg shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-5 p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 text-sm flex items-start gap-3">
                  <FiCheckCircle className="text-lg shrink-0 mt-0.5 text-emerald-400" />
                  <span>{success}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiMail className="text-lg" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-white placeholder-gray-400 transition outline-none"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Password
                    </label>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Password reset functionality will be available soon.");
                      }}
                      className="text-xs font-medium text-amber-300 hover:text-amber-200 transition"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 bg-gray-900 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-white placeholder-gray-400 transition outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-amber-300 transition cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:text-amber-300 mt-2"
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <FiArrowRight className="text-lg" />
                    </>
                  )}
                </button>
              </form>

             

              {/* Footer Register Link */}
              <div className="mt-6 text-center text-sm text-gray-300">
                Don't have an account yet?{" "}
                <Link to="/register" className="font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-4 transition">
                  Create an account
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer matching dashboard aesthetics */}
      <footer className="bg-gray-800 border-t-2 border-gray-600 py-4 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} Talvyn AI Recruitment Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
