import { useState, useEffect } from "react";
import { ApplicationContext } from "./ApplicationContext";
import { createApplication, getMyApplications } from "../api/applicationApi";

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const filteredApplications = applications.filter((application) => {
    const jobTitle = application.jobTitle || application.job?.title || "";
    const company = application.company || application.job?.company || "";

    const matchesSearch =
      jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const submitApplication = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const newApplication = await createApplication(formData);
      setApplications((prev) => [...prev, newApplication]);
      return newApplication;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to submit application.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
        submitApplication,
        loading,
        error,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};


// import { useState } from "react";
// import { ApplicationContext } from "./ApplicationContext";
// import mockApplications from "../data/mockApplications";
// import { createApplication } from "../api/applicationApi";

// export const ApplicationProvider = ({ children }) => {
//   const [applications, setApplications] = useState(mockApplications);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const filteredApplications = applications.filter((application) => {
//     const matchesSearch =
//       application.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
//       application.company.toLowerCase().includes(search.toLowerCase());
//     const matchesStatus =
//       statusFilter === "All" || application.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const submitApplication = async (formData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const newApplication = await createApplication(formData);
//       setApplications((prev) => [...prev, newApplication]);
//       return newApplication;
//     } catch (err) {
//       const message =
//         err.response?.data?.message || "Failed to submit application.";
//       setError(message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

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
//         submitApplication,
//         loading,
//         error,
//       }}
//     >
//       {children}
//     </ApplicationContext.Provider>
//   );
// };









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