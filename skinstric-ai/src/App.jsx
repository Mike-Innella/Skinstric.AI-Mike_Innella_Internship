import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import Header from "./Components/Header";

// Import pages
import Intro from "../src/Pages/Intro";

// Import styles
import "../src/UI/Styles/Global.css";

function App() {
  return (
    <Router>
      <Header />
      <Intro />
      <Routes>
        <Route path="/" />
        {/* TODO: Add more routes here for project phases */}
      </Routes>
    </Router>
  );
}

export default App;
