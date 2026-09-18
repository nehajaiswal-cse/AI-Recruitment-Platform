import { useCallback, useEffect, useState } from "react";
import useAuth from "./useAuth";

// ==========================================
// SHARED SAVED JOBS STORE
// ==========================================
// The backend doesn't expose save/unsave endpoints yet, so saved jobs
// are persisted in localStorage (scoped per logged-in user) and kept
// in sync across every component that uses this hook - including
// across browser tabs.
//
// Swapping this for real endpoints later just means replacing the
// body of saveJob / unsaveJob with API calls, e.g.
//   POST   /api/applicant/saved-jobs/:jobId
//   DELETE /api/applicant/saved-jobs/:jobId
// The hook's public shape (savedJobIds, isJobSaved, toggleSaveJob...)
// can stay the same, so no consuming page would need to change.

const STORAGE_PREFIX = "talvyn-saved-jobs";
const SYNC_EVENT = "saved-jobs-updated";

const getStorageKey = (userId) => `${STORAGE_PREFIX}:${userId || "guest"}`;

const readStoredIds = (storageKey) => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read saved jobs:", err);
    return [];
  }
};

const writeStoredIds = (storageKey, ids) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(ids));

    // Notify every other mounted instance of this hook (same tab)
    window.dispatchEvent(
      new CustomEvent(SYNC_EVENT, { detail: { storageKey } })
    );
  } catch (err) {
    console.error("Failed to persist saved jobs:", err);
  }
};

const useSavedJobs = () => {
  const { user } = useAuth();
  const storageKey = getStorageKey(user?._id || user?.id);

  const [savedJobIds, setSavedJobIds] = useState(() =>
    readStoredIds(storageKey)
  );

  // Re-read whenever the logged-in user changes (different storage key)
  useEffect(() => {
    setSavedJobIds(readStoredIds(storageKey));
  }, [storageKey]);



  // Stay in sync with saves/unsaves triggered elsewhere (other pages,
  // other tabs)
  useEffect(() => {
    const syncFromStorage = (event) => {
      if (
        event?.detail?.storageKey &&
        event.detail.storageKey !== storageKey
      ) {
        return;
      }

      setSavedJobIds(readStoredIds(storageKey));
    };

    window.addEventListener(SYNC_EVENT, syncFromStorage);
    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener(SYNC_EVENT, syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [storageKey]);

  const isJobSaved = useCallback(
    (jobId) => savedJobIds.includes(jobId),
    [savedJobIds]
  );

  const saveJob = useCallback(
    (jobId) => {
      if (!jobId || savedJobIds.includes(jobId)) return;

      const next = [...savedJobIds, jobId];
      writeStoredIds(storageKey, next);
      setSavedJobIds(next);
    },
    [savedJobIds, storageKey]
  );

  const unsaveJob = useCallback(
    (jobId) => {
      if (!savedJobIds.includes(jobId)) return;

      const next = savedJobIds.filter((id) => id !== jobId);
      writeStoredIds(storageKey, next);
      setSavedJobIds(next);
    },
    [savedJobIds, storageKey]
  );

  const toggleSaveJob = useCallback(
    (jobId) => {
      if (!jobId) return;

      const next = savedJobIds.includes(jobId)
        ? savedJobIds.filter((id) => id !== jobId)
        : [...savedJobIds, jobId];

      writeStoredIds(storageKey, next);
      setSavedJobIds(next);
    },
    [savedJobIds, storageKey]
  );

  return {
    savedJobIds,
    isJobSaved,
    saveJob,
    unsaveJob,
    toggleSaveJob,
  };
};

export default useSavedJobs;