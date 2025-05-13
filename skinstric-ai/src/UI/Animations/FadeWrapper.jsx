// FadeWrapper.jsx

import React, { useEffect, useState, useContext, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./../../UI/Styles/FadeWrapper.css";

// Create a context to manage global fade state
const FadeContext = createContext();

// Provider component to manage fade transitions globally
export const FadeProvider = ({ children }) => {
  const [isFading, setIsFading] = useState(false);
  // TODO: Double check unused pendingNavigation
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const navigate = useNavigate();

  // Function to handle navigation with fade transition
  const navigateWithFade = (to) => {
    // Start fade out
    setIsFading(true);
    setPendingNavigation(to);

    // After fade out completes, perform the actual navigation
    setTimeout(() => {
      navigate(to);

      // Reset fading state after a short delay to allow the new page to render
      setTimeout(() => {
        setIsFading(false);
        setPendingNavigation(null);
      }, 50);
    }, 300); // Fade out duration
  };

  return (
    <FadeContext.Provider value={{ isFading, navigateWithFade }}>
      {children}
    </FadeContext.Provider>
  );
};

// Hook to use the fade context
export const useFade = () => {
  const context = useContext(FadeContext);
  if (!context) {
    throw new Error("useFade must be used within a FadeProvider");
  }
  return context;
};

// Main wrapper component using CSS for transitions
const FadeWrapper = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { isFading } = useFade();

  useEffect(() => {
    // When location changes or component mounts, fade in the content
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Delay before fade in starts

    return () => {
      clearTimeout(timer);
      setIsVisible(false);
    };
  }, [location.pathname]); // Re-run when route changes

  return (
    <div className="fade-wrapper">
      {/* Fade overlay */}
      <div
        className={`fade-overlay ${isFading ? "active" : ""}`}
        style={{ opacity: isFading ? 1 : 0 }}
      />

      {/* Actual content */}
      <div
        className="fade-content"
        style={{ opacity: isVisible && !isFading ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
};

export default FadeWrapper;
