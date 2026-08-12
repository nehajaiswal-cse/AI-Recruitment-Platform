
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const applicationData = [
  {
    month: "Jan",
    applied: 42,
    shortlisted: 12,
    hired: 3,
  },
  {
    month: "Feb",
    applied: 62,
    shortlisted: 18,
    hired: 5,
  },
  {
    month: "Mar",
    applied: 58,
    shortlisted: 15,
    hired: 4,
  },
  {
    month: "Apr",
    applied: 78,
    shortlisted: 22,
    hired: 7,
  },
  {
    month: "May",
    applied: 95,
    shortlisted: 28,
    hired: 9,
  },
  {
    month: "Jun",
    applied: 110,
    shortlisted: 32,
    hired: 11,
  },
  {
    month: "Jul",
    applied: 98,
    shortlisted: 26,
    hired: 8,
  },
  {
    month: "Aug",
    applied: 124,
    shortlisted: 35,
    hired: 14,
  },
];

const ApplicationTrend = () => {
  return (
    <section className="bg-gray-600 rounded-2xl p-6 md:p-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-8">

        {/* Title */}
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Application Trend
          </h2>

          <p className="text-gray-300 mt-1">
            Monthly hiring overview
          </p>
        </div>


        {/* ================= LEGEND ================= */}
        <div className="flex flex-wrap items-center gap-5">

          {/* Applied */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-500" />

            <span className="text-gray-100 text-sm font-medium">
              Applied
            </span>
          </div>


          {/* Shortlisted */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-orange-500" />

            <span className="text-gray-100 text-sm font-medium">
              Shortlisted
            </span>
          </div>


          {/* Hired */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />

            <span className="text-gray-100 text-sm font-medium">
              Hired
            </span>
          </div>

        </div>

      </div>


      {/* ================= CHART ================= */}
      <div className="w-full h-87.5">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={applicationData}
            margin={{
              top: 10,
              right: 15,
              left: 0,
              bottom: 10,
            }}
          >

            {/* ================= GRADIENTS ================= */}
            <defs>

              {/* Blue */}
              <linearGradient
                id="appliedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#3b82f6"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#3b82f6"
                  stopOpacity={0.02}
                />
              </linearGradient>


              {/* Orange */}
              <linearGradient
                id="shortlistedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#f59e0b"
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor="#f59e0b"
                  stopOpacity={0.02}
                />
              </linearGradient>


              {/* Green */}
              <linearGradient
                id="hiredGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#10b981"
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor="#10b981"
                  stopOpacity={0.02}
                />
              </linearGradient>

            </defs>


            {/* ================= GRID ================= */}
            <CartesianGrid
              stroke="#9ca3af"
              strokeOpacity={0.2}
              vertical={false}
            />


            {/* ================= X AXIS ================= */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#d1d5db",
                fontSize: 14,
              }}
            />


            {/* ================= Y AXIS ================= */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#d1d5db",
                fontSize: 14,
              }}
              domain={[0, 125]}
            />


            {/* ================= TOOLTIP ================= */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#374151",
                border: "1px solid #6b7280",
                borderRadius: "10px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
              }}
            />


            {/* ================= AREA SHADOWS ================= */}

            <Area
              type="monotone"
              dataKey="applied"
              stroke="none"
              fill="url(#appliedGradient)"
            />

            <Area
              type="monotone"
              dataKey="shortlisted"
              stroke="none"
              fill="url(#shortlistedGradient)"
            />

            <Area
              type="monotone"
              dataKey="hired"
              stroke="none"
              fill="url(#hiredGradient)"
            />


            {/* ================= APPLIED ================= */}

            <Line
              type="monotone"
              dataKey="applied"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#4b5563",
                stroke: "#3b82f6",
                strokeWidth: 3,
              }}
              activeDot={{
                r: 7,
                fill: "#3b82f6",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />


            {/* ================= SHORTLISTED ================= */}

            <Line
              type="monotone"
              dataKey="shortlisted"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#4b5563",
                stroke: "#f59e0b",
                strokeWidth: 3,
              }}
              activeDot={{
                r: 7,
                fill: "#f59e0b",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />


            {/* ================= HIRED ================= */}

            <Line
              type="monotone"
              dataKey="hired"
              stroke="#10b981"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#4b5563",
                stroke: "#10b981",
                strokeWidth: 3,
              }}
              activeDot={{
                r: 7,
                fill: "#10b981",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </section>
  );
};

export default ApplicationTrend;