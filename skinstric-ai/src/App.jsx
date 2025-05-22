// App.jsx

import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./Components/Header";
import Discover from "./Pages/DiscoverPage";
import MainPage from "./Pages/MainPage";
import TestPage from "./Pages/TestPage";
import LoadingPage from "./Pages/LoadingPage";
import AnalysisPage from "./Pages/AnalysisPage";
import DashboardPage from "./Pages/DashboardPage";
import TestImageOptions from "./TestImageOptions";
import FadeWrapper, { FadeProvider } from "./UI/Animations/FadeWrapper";
import "./UI/Styles/Global.css";

// This component wraps the routes and provides location for transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/discover"
        element={
          <FadeWrapper>
            <Discover />
          </FadeWrapper>
        }
      />
      <Route
        path="/"
        element={
          <FadeWrapper>
            <MainPage />
          </FadeWrapper>
        }
      />
      <Route
        path="/test"
        element={
          <FadeWrapper>
            <TestPage />
          </FadeWrapper>
        }
      />
      <Route
        path="/loading"
        element={
          <FadeWrapper>
            <LoadingPage />
          </FadeWrapper>
        }
      />
      <Route
        path="/analysis"
        element={
          <FadeWrapper>
            <AnalysisPage />
          </FadeWrapper>
        }
      />
      <Route
        path="/dashboard"
        element={
          <FadeWrapper>
            <DashboardPage />
          </FadeWrapper>
        }
      />
      <Route
        path="/test-image-options"
        element={
          <FadeWrapper>
            <TestImageOptions />
          </FadeWrapper>
        }
      />
    </Routes>
  );
};

// Wrapper component that provides the FadeProvider
const AppWithFadeProvider = () => {
  return (
    <>
      <Header />
      <FadeProvider>
        <AnimatedRoutes />
      </FadeProvider>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWithFadeProvider />
    </Router>
  );
}

export default App;
