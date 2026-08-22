// import { useApplicationContext } from "../context/useApplicationContext";

// const useApplications = () => {
//   const {
//     applications,
//     filteredApplications,
//     search,
//     setSearch,
//     statusFilter,
//     setStatusFilter,
//   } = useApplicationContext();

//   const getApplicationById = (id) => {
//     return applications.find(
//       (application) => application.id === Number(id)
//     );
//   };

//   return {
//     applications,
//     filteredApplications,
//     search,
//     setSearch,
//     statusFilter,
//     setStatusFilter,
//     getApplicationById,
//   };
// };

// export default useApplications;


import { useContext } from "react";
import { ApplicationContext } from "./ApplicationContext";

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error(
      "useApplicationContext must be used inside ApplicationProvider"
    );
  }

  return context;
};