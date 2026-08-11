
import RNavbar from '../../components/layout/recuriter/Navbar';
import RSidebar from '../../components/layout/recuriter/Sidebar';
import Topbar from '../../components/layout/recuriter/Topbar';
// import StatsCards from '../../components/sections/StatsCards';
// import HiringPipelines from '../../components/sections/HiringPipelines';

const RDashboard = () => {
  return (
    
    <div className="min-h-screen bg-gray-700">
        <header className="sticky top-0 z-50">
          <RNavbar />
        </header> 

      <div className="flex">
    
      
        <RSidebar />
     


      <main className="w-full lg:ml-64 lg:w-[calc(100%-16rem)]">
         <Topbar />

        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
           👋 Hi Recruiter
          </h1>

          <p className="text-gray-300 mt-2">
            Welcome to your dashboard
           </p>

          {/* <div className="mt-6">
           <StatsCards />
           <HiringPipelines />
          </div> */}
        </div>
      </main>



      </div>

    </div>
    
  );
};

export default RDashboard;