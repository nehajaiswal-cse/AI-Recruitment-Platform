import {
  createContext,
  useCallback,
  useState,
} from "react";

import {
  createApplication,
  getMyApplications,
  getApplicationById,
  withdrawApplication,
} from "../api/applicationApi";

export const ApplicationContext = createContext(null);

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [currentApplication, setCurrentApplication] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // CREATE APPLICATION
  // ==========================================

  const submitApplication = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError("");

      const data = await createApplication(formData);

      const newApplication =
        data.application || data;

      setApplications((previous) => [
        newApplication,
        ...previous,
      ]);

      return data;
    } catch (err) {
      console.error(
        "Submit application error:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to submit application.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // GET MY APPLICATIONS
  // ==========================================

  const fetchMyApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyApplications();

      setApplications(
        data.applications || data.data || data || []
      );

      return data;
    } catch (err) {
      console.error(
        "Fetch applications error:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch applications.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // GET SINGLE APPLICATION
  // ==========================================

  const fetchApplicationById = useCallback(
    async (applicationId) => {
      try {
        setLoading(true);
        setError("");

        if (!applicationId) {
          throw new Error(
            "Application ID is required."
          );
        }

        const data =
          await getApplicationById(applicationId);

        const application =
          data.application ||
          data.data ||
          data;

        setCurrentApplication(application);

        return application;
      } catch (err) {
        console.error(
          "Fetch application error:",
          err
        );

        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to fetch application.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================
  // WITHDRAW APPLICATION
  // ==========================================

  const removeApplication = useCallback(
    async (applicationId) => {
      try {
        setLoading(true);
        setError("");

        if (!applicationId) {
          throw new Error(
            "Application ID is required."
          );
        }

        const data =
          await withdrawApplication(
            applicationId
          );

        setApplications((previous) =>
          previous.map((application) =>
            application._id === applicationId
              ? {
                  ...application,
                  status: "withdrawn",
                }
              : application
          )
        );

        setCurrentApplication((previous) =>
          previous?._id === applicationId
            ? {
                ...previous,
                status: "withdrawn",
              }
            : previous
        );

        return data;
      } catch (err) {
        console.error(
          "Withdraw application error:",
          err
        );

        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to withdraw application.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================
  // CLEAR ERROR
  // ==========================================

  const clearApplicationError = useCallback(() => {
    setError("");
  }, []);

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        currentApplication,

        loading,
        error,

        submitApplication,
        fetchMyApplications,
        fetchApplicationById,
        removeApplication,

        clearApplicationError,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};