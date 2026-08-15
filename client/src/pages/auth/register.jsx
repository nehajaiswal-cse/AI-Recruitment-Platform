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

import useAuth from "../../hooks/UseAuth";

const RegisterForm = ({ role = "applicant" }) => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const isRecruiter = role === "recruiter";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);

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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
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
      setError(
        "You must agree to the Terms of Service and Privacy Policy."
      );
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
        role,
      };

      const res = await register(payload);

      console.log("REGISTER RESPONSE:", res);

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        if (role === "recruiter") {
          navigate("/recruiter/login");
        } else {
          navigate("/applicant/login");
        }
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.message ||
          "Registration failed. Email might already be registered."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">

      <div className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">

        {/* HEADER */}
        <div className="text-center mb-8">

          <div className="flex justify-center mb-3">

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
              {isRecruiter
                ? "Recruiter Account"
                : "Applicant Account"}
            </span>

          </div>

          <h2 className="text-3xl font-extrabold text-white">
            Create Your Account
          </h2>

          <p className="text-gray-300 text-sm mt-1">
            {isRecruiter
              ? "Create your recruiter workspace and start finding great candidates."
              : "Create your applicant account and discover opportunities."}
          </p>

        </div>

        {/* ROLE INFORMATION */}
        <div className="mb-6 p-4 rounded-xl bg-gray-900 border border-gray-600 flex items-center gap-4">

          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">

            {isRecruiter ? (
              <FiBriefcase className="text-xl text-white" />
            ) : (
              <FiUserCheck className="text-xl text-white" />
            )}

          </div>

          <div>

            <h3 className="font-semibold text-white">
              {isRecruiter
                ? "Recruiter / Employer"
                : "Job Applicant"}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              {isRecruiter
                ? "Post jobs and find candidates using AI."
                : "Apply for jobs and get AI-powered career insights."}
            </p>

          </div>

          <div className="ml-auto w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <FiCheck />
          </div>

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
          className="space-y-4"
          noValidate
        >

          {/* NAME */}
          <div>

            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5"
            >
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
                value={formData.name}
                onChange={handleChange}
                placeholder={
                  isRecruiter
                    ? "Recruiter Name"
                    : "Alex Morgan"
                }
                className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-white placeholder-gray-400 transition outline-none"
              />

            </div>

          </div>

          {/* EMAIL */}
          <div>

            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5"
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

          {/* PASSWORDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* PASSWORD */}
            <div>

              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5"
              >
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-gray-900 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-white placeholder-gray-400 transition outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-amber-300"
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>

              </div>

            </div>

            {/* CONFIRM */}
            <div>

              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5"
              >
                Confirm Password
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiLock className="text-lg" />
                </div>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-gray-900 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 rounded-xl text-white placeholder-gray-400 transition outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-amber-300"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>

              </div>

            </div>

          </div>

          {/* TERMS */}
          <div className="flex items-center gap-3 pt-2">

            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) =>
                setAgreeTerms(e.target.checked)
              }
              className="w-4 h-4 accent-amber-400 cursor-pointer"
            />

            <label
              htmlFor="agreeTerms"
              className="text-xs text-gray-300 cursor-pointer"
            >
              I agree to the{" "}
              <span className="text-amber-300">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-amber-300">
                Privacy Policy
              </span>
            </label>

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >

            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  Create{" "}
                  {isRecruiter
                    ? "Recruiter"
                    : "Applicant"}{" "}
                  Account
                </span>

                <FiArrowRight />
              </>
            )}

          </button>

        </form>

        {/* LOGIN LINK */}
        <div className="mt-6 text-center text-sm text-gray-300 pt-4 border-t border-gray-600">

          Already have an account?{" "}

          <Link
            to={
              isRecruiter
                ? "/recruiter/login"
                : "/applicant/login"
            }
            className="font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-4"
          >
            Sign in
          </Link>

        </div>

      </div>
    </div>
  );
};

export default RegisterForm;