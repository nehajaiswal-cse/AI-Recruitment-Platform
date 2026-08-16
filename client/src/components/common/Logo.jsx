import {Link} from "react-router-dom";


const Logo = () => {
  return (
    <Link to="/recruiter" className="text-6xl font-bold px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                 T
                </span>
              </div>
    
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Talvyn
                </h1>
                
                <p className="text-[15px] uppercase tracking-widest text-gray-400">
                  Talent + Vision + AI
                </p>
              </div>
            </div>
    </Link> 
  );
};

export default Logo;