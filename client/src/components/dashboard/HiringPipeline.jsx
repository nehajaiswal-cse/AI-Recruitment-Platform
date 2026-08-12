import { Link } from "react-router-dom";

const pipelineData = [
  {
    id: "applied",
    title: "Applied",
    count: 154,
    percentage: 55,
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  {
    id: "shortlisted",
    title: "Shortlisted",
    count: 62,
    percentage: 22,
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
  },
  {
    id: "interview",
    title: "Interview",
    count: 18,
    percentage: 6,
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
  },
  {
    id: "selected",
    title: "Selected",
    count: 6,
    percentage: 2,
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  {
    id: "rejected",
    title: "Rejected",
    count: 41,
    percentage: 15,
    color: "bg-rose-500",
    textColor: "text-rose-700",
    bgColor: "bg-rose-50",
  },
];

const HiringPipeline = () => {
  const totalCandidates = pipelineData.reduce(
    (total, stage) => total + stage.count,
    0
  );

  return (
    <section className="bg-gray-600 rounded-xl p-6">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <h2 className="text-2xl font-semibold text-white">
            Hiring Pipeline
          </h2>

          <p className="text-md text-gray-100 mt-1">
            {totalCandidates} total candidates
          </p>
        </div>

        <Link
          to="/recruiter/pipeline"
          className="text-blue-600 text-lg font-medium hover:text-blue-700"
        >
          View all
        </Link>

      </div>


      {/* Pipeline Progress Bar */}
      <div className="flex h-5 overflow-hidden rounded-full mt-8 mb-8">

        {pipelineData.map((stage) => (
          <div
            key={stage.id}
            className={`${stage.color}`}
            style={{
              width: `${stage.percentage}%`,
            }}
          />
        ))}

      </div>


      {/* Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {pipelineData.map((stage) => (
          <div
            key={stage.id}
            className={`${stage.bgColor} rounded-2xl p-6 min-h-41.25`}
          >

            {/* Title */}
            <div className="flex items-center gap-3">

              <span
                className={`w-4 h-4 rounded-full ${stage.color}`}
              />

              <h3 className="text-lg font-medium text-gray-700">
                {stage.title}
              </h3>

            </div>


            {/* Count */}
            <p
              className={`text-4xl font-bold mt-5 ${stage.textColor}`}
            >
              {stage.count}
            </p>


            {/* Percentage */}
            <p className="text-base text-gray-400 mt-1">
              {stage.percentage}% of total
            </p>

          </div>
        ))}

      </div>

    </section>
  );
};

export default HiringPipeline;