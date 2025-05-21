import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingCanvas from "../UI/Animations/LoadingCanvas";
import Header from "../Components/Header";
import "../UI/Styles/Pages/LoadingPage.css";

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to dashboard page after animation completes
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2800); // Reset to original duration

    return () => clearTimeout(timer);
  }, [navigate]);

  // Wrap the LoadingCanvas in a div with the loading-page class
  return (
    <div className="loading-page">
      <Header title="ANALYZING" />
      <LoadingCanvas />
    </div>
  );
};

export default LoadingPage;
