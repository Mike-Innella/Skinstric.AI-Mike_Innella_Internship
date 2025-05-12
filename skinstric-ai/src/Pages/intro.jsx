import React from 'react';
import { Link } from "react-router-dom";

function Intro() {
  return (
    <div>
      <h1>Introduction Page</h1>
      <Navigation />
    </div>
  );
}

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/intro">Intro</Link>
    </nav>
  );
}

export default Intro;