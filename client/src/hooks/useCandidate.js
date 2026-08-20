import { useCandidateContext } from "../context/CandidateContext";

export const useCandidate = () => {
  return useCandidateContext();
};

export default useCandidate;