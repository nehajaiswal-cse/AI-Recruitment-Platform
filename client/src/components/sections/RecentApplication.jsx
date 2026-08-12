import { FiArrowRight } from "react-icons/fi";

const applications = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Senior Frontend Engineer",
    initials: "PS",
    color: "bg-rose-500",
    time: "2 hours ago",
    status: "Interview",
    statusColor: "bg-purple-50 text-purple-700",
  },
  {
    id: 2,
    name: "Arjun Mehta",
    role: "Product Designer",
    initials: "AM",
    color: "bg-blue-500",
    time: "5 hours ago",
    status: "Shortlisted",
    statusColor: "bg-amber-50 text-amber-700",
  },
  {
    id: 3,
    name: "Sneha Patel",
    role: "Backend Developer",
    initials: "SP",
    color: "bg-emerald-500",
    time: "1 day ago",
    status: "Applied",
    statusColor: "bg-slate-100 text-slate-700",
  },
  {
    id: 4,
    name: "Rahul Verma",
    role: "DevOps Engineer",
    initials: "RV",
    color: "bg-orange-500",
    time: "1 day ago",
    status: "Offer",
    statusColor: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 5,
    name: "Ananya Iyer",
    role: "Data Analyst",
    initials: "AI",
    color: "bg-violet-500",
    time: "2 days ago",
    status: "Applied",
    statusColor: "bg-slate-100 text-slate-700",
  },
];

const RecentApplications = () => {
  return (
    <section className="bg-gray-600 border border-gray-500 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-500">

        <div>
          <h2 className="text-2xl font-semibold text-gray-100">
            Recent Applications
          </h2>

          <p className="text-lg text-gray-300 mt-1">
            Latest candidate submissions
          </p>
        </div>

        <button className="flex items-center gap-2 text-blue-300 text-lg font-medium hover:text-blue-700">
          View all
          <FiArrowRight />
        </button>

      </div>


      {/* Applications */}
      <div>

        {applications.map((candidate) => (

          <div
            key={candidate.id}
            className="flex items-center gap-5 px-8 py-5 border-b border-gray-500 last:border-b-0 hover:bg-gray-700 transition"
          >

            {/* Avatar */}
            <div
              className={`w-16 h-16 rounded-full ${candidate.color} text-white flex items-center justify-center font-semibold text-lg shrink-0`}
            >
              {candidate.initials}
            </div>


            {/* Candidate information */}
            <div className="min-w-0 flex-1">

              <h3 className="text-xl font-medium text-gray-100">
                {candidate.name}
              </h3>

              <p className="text-base text-gray-300 mt-1">
                {candidate.role}
              </p>

            </div>


            {/* Time */}
            <p className="text-base text-gray-300 whitespace-nowrap">
              {candidate.time}
            </p>


            {/* Status */}
            <span
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${candidate.statusColor}`}
            >
              {candidate.status}
            </span>

          </div>

        ))}

      </div>

    </section>
  );
};

export default RecentApplications;