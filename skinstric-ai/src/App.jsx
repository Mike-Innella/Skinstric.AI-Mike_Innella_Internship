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
import Intro from "./Pages/Intro";
import MainPage from "./Pages/Main";
import PretestPage from "./Pages/Pretest";
import TestIntro from "./Pages/TestIntro";
import FadeWrapper, { FadeProvider } from "./UI/Animations/FadeWrapper";
import "./UI/Styles/Global.css";

// This component wraps the routes and provides location for transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <FadeWrapper>
            <Intro />
          </FadeWrapper>
        }
      />
      <Route
        path="/main"
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
        path="/testintro"
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
