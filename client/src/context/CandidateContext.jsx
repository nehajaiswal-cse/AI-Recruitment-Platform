import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  updateCandidateStatus,
  deleteCandidate,
} from "../api/candidateApi";

const CandidateContext = createContext(null);

export const CandidateProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all candidates
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCandidates();

      setCandidates(data?.candidates || []);

      return data;
    } catch (error) {
      console.error("Fetch candidates error:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to fetch candidates"
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get candidate by ID
  const fetchCandidateById = useCallback(async (candidateId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCandidateById(candidateId);

      setSelectedCandidate(data?.candidate || null);

      return data?.candidate;
    } catch (error) {
      console.error("Fetch candidate error:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to fetch candidate"
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);


  // Update candidate
  const editCandidate = useCallback(
    async (candidateId, candidateData) => {
      try {
        setLoading(true);
        setError(null);

        const data = await updateCandidate(
          candidateId,
          candidateData
        );

        if (data?.candidate) {
          setCandidates((prev) =>
            prev.map((candidate) =>
              candidate._id === candidateId
                ? data.candidate
                : candidate
            )
          );

          setSelectedCandidate(data.candidate);
        }

        return data;
      } catch (error) {
        console.error("Update candidate error:", error);

        setError(
          error?.response?.data?.message ||
            "Failed to update candidate"
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update candidate status
  const changeCandidateStatus = useCallback(
    async (candidateId, status) => {
      try {
        setLoading(true);
        setError(null);

        const data = await updateCandidateStatus(
          candidateId,
          status
        );

        if (data?.candidate) {
          setCandidates((prev) =>
            prev.map((candidate) =>
              candidate._id === candidateId
                ? {
                    ...candidate,
                    status: data.candidate.status,
                  }
                : candidate
            )
          );

          setSelectedCandidate((prev) =>
            prev?._id === candidateId
              ? {
                  ...prev,
                  status: data.candidate.status,
                }
              : prev
          );
        }

        return data;
      } catch (error) {
        console.error(
          "Update candidate status error:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to update candidate status"
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete candidate
  const removeCandidate = useCallback(async (candidateId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await deleteCandidate(candidateId);

      setCandidates((prev) =>
        prev.filter(
          (candidate) => candidate._id !== candidateId
        )
      );

      if (selectedCandidate?._id === candidateId) {
        setSelectedCandidate(null);
      }

      return data;
    } catch (error) {
      console.error("Delete candidate error:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to delete candidate"
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, [selectedCandidate]);

  const clearError = () => {
    setError(null);
  };

  const clearSelectedCandidate = () => {
    setSelectedCandidate(null);
  };

  return (
    <CandidateContext.Provider
      value={{
        candidates,
        selectedCandidate,

        loading,
        error,

        fetchCandidates,
        fetchCandidateById,


        editCandidate,
        changeCandidateStatus,
        removeCandidate,

        clearError,
        clearSelectedCandidate,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidateContext = () => {
  const context = useContext(CandidateContext);

  if (!context) {
    throw new Error(
      "useCandidateContext must be used inside CandidateProvider"
    );
  }

  return context;
};

export default CandidateContext;