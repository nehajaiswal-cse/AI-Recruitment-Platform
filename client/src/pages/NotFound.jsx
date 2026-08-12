import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center dark:bg-slate-950">
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-primary-900/30 text-slate-500 dark:text-slate-400">
      <FiAlertCircle size={30} />
    </div>
    <h1 className="text-8xl font-extrabold tracking-tight text-slate-500 dark:text-slate-400">404</h1>
    <p className="text-slate-500 dark:text-slate-400">The page you're looking for doesn't exist.</p>
    <Link to="/dashboard" className="btn-primary mt-2">
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
