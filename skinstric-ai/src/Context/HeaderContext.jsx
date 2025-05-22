import React, { createContext, useState, useContext } from "react";

// Create the context
const HeaderContext = createContext();

// Create a provider component
export const HeaderProvider = ({ children }) => {
  const [headerTitle, setHeaderTitle] = useState("");

  return (
    <HeaderContext.Provider value={{ headerTitle, setHeaderTitle }}>
      {children}
    </HeaderContext.Provider>
  );
};

// Create a custom hook to use the context
export const useHeaderTitle = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderTitle must be used within a HeaderProvider");
  }
  return context;
};
