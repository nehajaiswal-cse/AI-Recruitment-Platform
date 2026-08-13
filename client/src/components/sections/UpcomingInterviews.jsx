import { FiClock, FiVideo } from "react-icons/fi";

const interviews = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Senior Frontend Engineer",
    initials: "PS",
    color: "bg-rose-500",
    date: "Today",
    time: "10:00 AM",
    type: "Technical Round",
  },
  {
    id: 2,
    name: "Karthik Rao",
    role: "Product Manager",
    initials: "KR",
    color: "bg-blue-500",
    date: "Today",
    time: "2:30 PM",
    type: "HR Round",
  },
  {
    id: 3,
    name: "Meera Nair",
    role: "UX Researcher",
    initials: "MN",
    color: "bg-emerald-500",
    date: "Tomorrow",
    time: "11:00 AM",
    type: "Portfolio Review",
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Full Stack Developer",
    initials: "VS",
    color: "bg-orange-500",
    date: "Tomorrow",
    time: "4:00 PM",
    type: "Technical Round",
  },
];

const UpcomingInterviews = () => {
  return (
    <section className="bg-gray-600 border border-gray-500 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-500">

        <h2 className="text-2xl font-semibold text-gray-100">
          Upcoming Interviews
        </h2>

        <p className="text-lg text-gray-300 mt-1">
          Scheduled sessions
        </p>

      </div>


      {/* Interviews */}
      <div className="grid grid-cols-1">

        {interviews.map((interview) => (

          <div
            key={interview.id}
            className="px-8 py-6 border-b border-gray-500 last:border-b-0 hover:bg-gray-700 transition"
          >

            <div className="flex items-starts gap-5">

              {/* Avatar */}
              <div
                className={`w-16 h-16 rounded-full ${interview.color} text-white flex items-center justify-center font-semibold text-lg shrink-0`}
              >
                {interview.initials}
              </div>


              {/* Candidate details */}
              <div className="flex-1 min-w-0">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h3 className="text-xl font-medium text-gray-100">
                      {interview.name}
                    </h3>

                    <p className="text-base text-gray-300 mt-1">
                      {interview.role}
                    </p>

                  </div>


                  {/* Date */}
                  <span className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium whitespace-nowrap">
                    {interview.date}
                  </span>

                </div>


                {/* Time + Interview type */}
                <div className="flex items-center gap-5 mt-4 text-gray-300">

                  <div className="flex items-center gap-2">
                    <FiClock />
                    <span>{interview.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiVideo />
                    <span>{interview.type}</span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default UpcomingInterviews;