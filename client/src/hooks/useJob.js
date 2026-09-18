import { useContext } from "react";
import { JobContext } from "../context/jobContext";

const useJob = () => {
  const context = useContext(JobContext);

  if (!context) {
    throw new Error(
      "useJob must be used inside JobProvider"
    );
  }

  return context;
};

export default useJob;