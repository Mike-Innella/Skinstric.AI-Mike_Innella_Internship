import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import Header from "./Components/Header";

// Import pages
import Intro from "./Pages/Intro";

// Import styles
import "../src/Styles/Global.css";

function App() {
  return (
    <div>
      <Router>
        <>
          <Header />
          <>
            <Routes>
              <Route path="/intro" element={<Intro />} />
            </Routes>
          </>
        </>
      </Router>
    </div>
  );
}
export default App;
