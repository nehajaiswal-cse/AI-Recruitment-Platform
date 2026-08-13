


const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg shadow-xl/30 font-medium transition duration-200
        bg-gray-700 text-white hover:bg-gray-800 
        disabled:bg-gray-400 disabled:cursor-not-allowed
        ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

