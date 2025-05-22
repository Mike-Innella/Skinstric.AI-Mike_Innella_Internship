import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingCanvas from "../UI/Animations/LoadingCanvas";
import "../UI/Styles/Pages/LoadingPage.css";
import { useHeaderTitle } from "../Context/HeaderContext";

const LoadingPage = () => {
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeaderTitle();

  useEffect(() => {
    // Set the header title
    setHeaderTitle("ANALYZING");

    // Navigate to dashboard page after animation completes
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2800); 

    return () => {
      clearTimeout(timer);
      // Clear the header title when component unmounts
      setHeaderTitle("");
    };
  }, [navigate, setHeaderTitle]);

  // Wrap the LoadingCanvas in a div with the loading-page class
  return (
    <>
      <div className="loading-page">
        <LoadingCanvas
          message="PREPARING ANALYSIS..."
          textPosition="center"
          style={{ fontSize: "16px" }}
        />
      </div>

      <div className="loading__message--wrapper">
        <p className="loading__message--text">PREPARING ANALYSIS...</p>
      </div>
    </>
  );
};

export default LoadingPage;
