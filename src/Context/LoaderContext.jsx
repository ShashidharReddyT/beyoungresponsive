import React, { createContext, useState, useContext } from "react";

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
  const [showLoader, setShowLoader] = useState(false);

  const updateLoaderStatus = (newStatus) => {
    setShowLoader(newStatus);
  };
  console.log("updateLoaderStatus", updateLoaderStatus);
  return (
    <LoaderContext.Provider value={{ showLoader, updateLoaderStatus }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  console.log("context", context);
  return {
    showLoader: context.showLoader,
    updateLoaderStatus: context.updateLoaderStatus,
  };
}
