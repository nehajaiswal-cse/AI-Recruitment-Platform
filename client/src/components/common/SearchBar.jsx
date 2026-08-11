
import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
  inputClassName = "",
}) => {
  return (
    <div
      className={`bg-white h-10 rounded-lg shadow-xl/30 flex items-center px-3 ${className}`}
    >
      <FaSearch className="text-gray-500 text-lg" />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`bg-transparent w-full ml-3 outline-none ${inputClassName}`}
      />
    </div>
  );
};

export default SearchBar;