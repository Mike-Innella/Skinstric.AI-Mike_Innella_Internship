import { createContext, useState, useContext } from "react";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <AnalysisContext.Provider 
      value={{ 
        analysisData, 
        setAnalysisData 
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
};
