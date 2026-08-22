// import { useApplicationContext } from "../context/ApplicationContext";

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

import { useApplicationContext } from "../context/useApplicationContext";

const useApplications = () => {
  const {
    applications,
    filteredApplications,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = useApplicationContext();

  const getApplicationById = (id) => {
    return applications.find(
      (application) => application.id === Number(id)
    );
  };

  return {
    applications,
    filteredApplications,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    getApplicationById,
  };
};

export default useApplications;