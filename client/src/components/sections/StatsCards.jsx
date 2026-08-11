import StatsCard from "../dashboard/StatsCard";

const StatsCards = () => {
  return (
    
      <div className="bg-gray-600 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <StatsCard
          title="Total Jobs"
          value="24"
          icon="💼"
          description="5 active jobs"
        />

        <StatsCard
          title="Applications"
          value="281"
          icon="📄"
          description="12 new this week"
        />

        <StatsCard
          title="Interviews"
          value="18"
          icon="📅"
          description="4 scheduled today"
        />

        <StatsCard
          title="Selected"
          value="6"
          icon="🎯"
          description="This month"
        />

      </div>


  );
};

export default StatsCards;