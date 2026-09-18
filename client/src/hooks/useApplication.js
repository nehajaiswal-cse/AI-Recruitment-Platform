import { useContext } from "react";

import {
  ApplicationContext,
} from "../context/ApplicationContext";

export const useApplication = () => {
  const context = useContext(
    ApplicationContext
  );

  if (!context) {
    throw new Error(
      "useApplication must be used inside ApplicationProvider"
    );
  }

  return context;
};