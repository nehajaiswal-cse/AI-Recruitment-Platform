const StatsCard = ({
  title,
  value,
  icon,
  description,
}) => {
  return (
    <div className="bg-gray-500 rounded-xl shadow-md p-5 my-5 mx-5 flex items-center justify-between">
      
      <div>
        <p className="text-gray-100 text-md font-medium">
          {title}
        </p>

        <h2 className="text-3xl font-bold text-gray-800 mt-2">
          {value}
        </h2>

        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="text-3xl bg-gray-400 p-3 rounded-lg">
        {icon}
      </div>

    </div>
  );
};

export default StatsCard;