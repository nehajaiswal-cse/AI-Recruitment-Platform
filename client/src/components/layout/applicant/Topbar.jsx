import SearchBar from "../../common/SearchBar.jsx";

const Topbar = () => {
  return (
    <div className="bg-gray-500 h-20 relative flex items-center justify-around">
      <SearchBar placeholder="Search Candidates" className="w-[50%]"/>
      
    </div>
  );
};

export default Topbar;