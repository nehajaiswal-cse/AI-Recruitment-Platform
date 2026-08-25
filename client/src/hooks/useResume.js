import { useState, useCallback } from "react";
import {
  uploadResume as uploadResumeApi,
  getMyResumes,
  setDefaultResume as setDefaultResumeApi,
  deleteResume as deleteResumeApi,
} from "../api/resumeApi";

const useResume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyResumes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMyResumes();
      setResumes(data.resumes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadResume = async (file) => {
    setUploading(true);
    setError(null);

    try {
      const data = await uploadResumeApi(file);
      setResumes((prev) => [data.resume, ...prev]);
      return data.resume;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const setDefaultResume = async (id) => {
    try {
      await setDefaultResumeApi(id);
      setResumes((prev) =>
        prev.map((r) => ({ ...r, isDefault: r._id === id }))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeResume = async (id) => {
    try {
      await deleteResumeApi(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    resumes,
    loading,
    uploading,
    error,
    fetchMyResumes,
    uploadResume,
    setDefaultResume,
    removeResume,
  };
};

export default useResume;