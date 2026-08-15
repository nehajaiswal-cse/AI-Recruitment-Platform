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

import useAuth from "../../hooks/UseAuth";

const LoginForm = ({ role = "applicant" }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const isRecruiter = role === "recruiter";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) {
      setError("");
    }
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
      const payload = {
        email: formData.email,
        password: formData.password,
        role,
      };

      const res = await login(payload);

      console.log("LOGIN RESPONSE:", res);

      // Make sure backend actually returns the logged-in user
      const loggedInRole = res?.user?.role;

      if (loggedInRole && loggedInRole !== role) {
        setError(
          `This account is registered as a ${loggedInRole}, not a ${role}.`
        );
        return;
      }

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        if (role === "recruiter") {
          navigate("/recruiter");
        } else {
          navigate("/applicant");
        }
      }, 500);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

      {/* LEFT SIDE */}
      <div className="lg:col-span-6 space-y-6 hidden lg:block pr-6">

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-600 text-amber-300 text-sm font-medium">
          <FiCpu className="text-base text-blue-400" />
          AI Recruitment Platform
        </div>

        <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white">
          Welcome back to{" "}
          <br />

          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">
            Talvyn
          </span>
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          {isRecruiter
            ? "Manage candidates, create job openings, and use AI-powered candidate matching."
            : "Discover opportunities, improve your resume, and find jobs matched to your skills."}
        </p>

        {/* Feature 1 */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800 border border-gray-600 shadow-md">

          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shrink-0">
            {isRecruiter ? (
              <FiUserCheck className="text-xl" />
            ) : (
              <FiBriefcase className="text-xl" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {isRecruiter
                ? "Smart Candidate Screening"
                : "AI-Powered Job Matching"}
            </h3>

            <p className="text-sm text-gray-300">
              {isRecruiter
                ? "Analyze and rank candidates using AI"
                : "Find opportunities based on your skills"}
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800 border border-gray-600 shadow-md">

          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shrink-0">
            {isRecruiter ? (
              <FiBriefcase className="text-xl" />
            ) : (
              <FiUserCheck className="text-xl" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {isRecruiter
                ? "Recruitment Management"
                : "Career Management"}
            </h3>

            <p className="text-sm text-gray-300">
              {isRecruiter
                ? "Manage jobs and application pipelines"
                : "Track applications and improve your profile"}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:col-span-6">

        <div className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">

          <div className="mb-6">

            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                {isRecruiter ? "Recruiter" : "Applicant"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Sign In
            </h2>

            <p className="text-gray-300 text-sm mt-1">
              {isRecruiter
                ? "Sign in to manage your recruitment workspace."
                : "Sign in to access your applicant dashboard."}
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-sm flex items-start gap-3">
              <FiAlertCircle className="text-lg shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 text-sm flex items-start gap-3">
              <FiCheckCircle className="text-lg shrink-0 mt-0.5 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2"
              >
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={
                    isRecruiter
                      ? "hr@company.com"
                      : "you@example.com"
                  }
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-white placeholder-gray-400 transition outline-none"
                />

              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-300"
                >
                  Password
                </label>

                <Link
                  to="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-medium text-amber-300 hover:text-amber-200"
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-gray-900 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-white placeholder-gray-400 transition outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-amber-300"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>

              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="text-lg" />
                </>
              )}

            </button>

          </form>

          {/* REGISTER */}
          <div className="mt-6 text-center text-sm text-gray-300">

            Don't have an account?{" "}

            <Link
              to={
                isRecruiter
                  ? "/recruiter/register"
                  : "/applicant/register"
              }
              className="font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-4"
            >
              Create account
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginForm;