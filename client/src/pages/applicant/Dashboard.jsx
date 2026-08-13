
import Navbar from '../../components/layout/applicant/Navbar';
import ASidebar from '../../components/layout/applicant/Sidebar';
import Topbar from '../../components/layout/applicant/Topbar';


const ADashboard = () => {
  return (
    

    <div className="min-h-screen bg-gray-700">
        <header className="sticky top-0 z-50">
          <Navbar />
        </header> 

      <div className="flex">
  
        <ASidebar />
      

   
       <main className="w-full lg:ml-64 lg:w-[calc(100%-16rem)]">
         <Topbar />

        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
           👋 Hi Applicant
          </h1>

          <p className="text-gray-300 mt-2">
            Welcome to your dashboard
           </p>

          
        </div>
      </main>

      </div>
    </div>
    
  );
};

export default ADashboard;