import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiBriefcase,
  FiUserCheck,
  FiCheck,
} from "react-icons/fi";
import Navbar from "../../components/dashboard/Navbar";
//import Logo from "../../components/common/Logo";
import { registerUser } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "applicant", // default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      await registerUser(payload);
      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Email might already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 text-white flex flex-col justify-between">
     <Navbar />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl">
          
          <div className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white">Create Your Account</h2>
              <p className="text-gray-300 text-sm mt-1">
                Join Talvyn to supercharge your recruitment & job search experience
              </p>
            </div>

            {/* Role Selection Switcher matching Dashboard palette */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-3 text-center">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Applicant Option */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect("applicant")}
                  className={`p-4 rounded-xl border transition-all text-left relative flex flex-col gap-2 cursor-pointer ${
                    formData.role === "applicant"
                      ? "bg-gray-900 border-amber-400 text-amber-300 shadow-lg"
                      : "bg-gray-900/60 border-gray-600 hover:border-gray-500 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${formData.role === "applicant" ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}>
                      <FiUserCheck className="text-xl" />
                    </div>
                    {formData.role === "applicant" && (
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-bold">
                        <FiCheck />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${formData.role === "applicant" ? "text-amber-300" : "text-white"}`}>
                      Job Applicant
                    </h3>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Apply for jobs & run AI resume feedback
                    </p>
                  </div>
                </button>

                {/* Recruiter Option */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect("recruiter")}
                  className={`p-4 rounded-xl border transition-all text-left relative flex flex-col gap-2 cursor-pointer ${
                    formData.role === "recruiter"
                      ? "bg-gray-900 border-amber-400 text-amber-300 shadow-lg"
                      : "bg-gray-900/60 border-gray-600 hover:border-gray-500 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${formData.role === "recruiter" ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}>
                      <FiBriefcase className="text-xl" />
                    </div>
                    {formData.role === "recruiter" && (
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-bold">
                        <FiCheck />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${formData.role === "recruiter" ? "text-amber-300" : "text-white"}`}>
                      Recruiter / Employer
                    </h3>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Post jobs & leverage AI candidate matching
                    </p>
                  </div>
                </button>

              </div>
            </div>

            {/* Alert Messages */}
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FiUser className="text-lg" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Morgan"
                    className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-white placeholder-gray-400 transition outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
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
                    placeholder="alex@company.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-white placeholder-gray-400 transition outline-none"
                  />
                </div>
              </div>

              {/* Grid Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
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

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 bg-gray-900 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-white placeholder-gray-400 transition outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-amber-300 transition cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkbox Terms */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-amber-400 focus:ring-amber-400/30 accent-amber-400 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-gray-300 cursor-pointer">
                  I agree to the{" "}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-amber-300 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-amber-300 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:text-amber-300 mt-4"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create {formData.role === "recruiter" ? "Recruiter" : "Applicant"} Account</span>
                    <FiArrowRight className="text-lg" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-6 text-center text-sm text-gray-300 pt-4 border-t border-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-4 transition">
                Sign in here
              </Link>
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

export default Register;
