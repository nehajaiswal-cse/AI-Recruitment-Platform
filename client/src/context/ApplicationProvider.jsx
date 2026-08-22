// import { useState } from "react";
// import { ApplicationContext } from "./ApplicationContext";
// import mockApplications from "../data/mockApplications";

// export const ApplicationProvider = ({ children }) => {
//   const [applications, setApplications] = useState(mockApplications);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");

//   const filteredApplications = applications.filter((application) => {
//     const matchesSearch =
//       application.jobTitle
//         .toLowerCase()
//         .includes(search.toLowerCase()) ||
//       application.company
//         .toLowerCase()
//         .includes(search.toLowerCase());

//     const matchesStatus =
//       statusFilter === "All" ||
//       application.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <ApplicationContext.Provider
//       value={{
//         applications,
//         setApplications,
//         search,
//         setSearch,
//         statusFilter,
//         setStatusFilter,
//         filteredApplications,
//       }}
//     >
//       {children}
//     </ApplicationContext.Provider>
//   );
// };


import { useState } from "react";
import { ApplicationContext } from "./ApplicationContext";
import mockApplications from "../data/mockApplications";

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState(mockApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.jobTitle
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      application.company
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        setApplications,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        filteredApplications,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};