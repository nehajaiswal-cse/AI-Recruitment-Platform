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

export const ApplicationContext =
  createContext(null);

export const ApplicationProvider = ({
  children,
}) => {
  const [applications, setApplications] =
    useState([]);

  const [currentApplication, setCurrentApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // CREATE APPLICATION
  // ==========================================

  const submitApplication = useCallback(
    async (formData) => {
      try {
        setLoading(true);
        setError("");

        const data =
          await createApplication(formData);

        const newApplication =
          data.application || data;

        setApplications((previousApplications) => [
          newApplication,
          ...previousApplications,
        ]);

        setCurrentApplication(
          newApplication
        );

        return data;
      } catch (err) {
        console.error(
          "Create application error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to submit application."
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================
  // GET MY APPLICATIONS
  // ==========================================

  const fetchMyApplications =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getMyApplications();

        setApplications(
          data.applications || []
        );

        return data;
      } catch (err) {
        console.error(
          "Fetch applications error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to fetch applications."
        );

        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

  // ==========================================
  // GET SINGLE APPLICATION
  // ==========================================

  const fetchApplicationById =
    useCallback(async (applicationId) => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getApplicationById(
            applicationId
          );

        const application =
          data.application || data;

        setCurrentApplication(
          application
        );

        return data;
      } catch (err) {
        console.error(
          "Fetch application error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to fetch application."
        );

        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

  // ==========================================
  // WITHDRAW APPLICATION
  // ==========================================

  const withdrawMyApplication =
    useCallback(async (applicationId) => {
      try {
        setLoading(true);
        setError("");

        const data =
          await withdrawApplication(
            applicationId
          );

        setApplications(
          (previousApplications) =>
            previousApplications.filter(
              (application) =>
                application._id !==
                applicationId
            )
        );

        setCurrentApplication(
          (previous) =>
            previous?._id === applicationId
              ? null
              : previous
        );

        return data;
      } catch (err) {
        console.error(
          "Withdraw application error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to withdraw application."
        );

        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

  // ==========================================
  // CLEAR ERROR
  // ==========================================

  const clearApplicationError =
    useCallback(() => {
      setError("");
    }, []);

  // ==========================================
  // CONTEXT VALUE
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
        withdrawMyApplication,

        clearApplicationError,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};