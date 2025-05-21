import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingCanvas from "../UI/Animations/LoadingCanvas";

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 4000); // duration to show animation

    return () => clearTimeout(timer);
  }, [navigate]);

  return <LoadingCanvas />;
};

export default LoadingPage;
