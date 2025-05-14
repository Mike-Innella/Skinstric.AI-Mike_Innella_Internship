// App.jsx

import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  // TODO: double check unused useNavigate
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./Components/Header";
import Discover from "./Pages/DiscoverPage";
import MainPage from "./Pages/MainPage";
import PretestPage from "./Pages/Pretest";
import TestIntro from "./Pages/IntroPage";
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
        path="/pretest"
        element={
          <FadeWrapper>
            <PretestPage />
          </FadeWrapper>
        }
      />
      <Route
        path="/intro"
        element={
          <FadeWrapper>
            <TestIntro />
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
