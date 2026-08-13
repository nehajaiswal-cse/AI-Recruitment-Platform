import SearchBar from "../../common/SearchBar.jsx";
import Button from "../../common/Button.jsx"
const Topbar = () => {
  return (
    <div className="bg-gray-600 h-20 min-w-full relative flex items-center justify-around">
      <SearchBar placeholder="Search Candidates" className="w-[50%]"/>
      <Button className="  hover:scale-105
    hover:shadow-2xl
    transition-all
    duration-300">Create Job</Button>
    </div>
  );
};

export default Topbar;