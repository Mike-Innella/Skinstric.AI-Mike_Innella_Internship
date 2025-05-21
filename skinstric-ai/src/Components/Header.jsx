import React from "react";
import BracketLeft from "./SVG/BracketLeft";
import BracketRight from "./SVG/BracketRight";
import "../UI/Styles/Components/Header.css";
import { Link } from "react-router-dom";

function Header({ title }) {
  // Ensure title text is uppercase
  const displayTitle = title ? title.toUpperCase() : "";

  return (
    <header className="header">
      <div className="header__title-bracket--wrapper">
        <Link to="/">
          <h1 className="header__title--name">SKINSTRIC</h1>
        </Link>
        <div className="location">
          <div className="frame">
            {displayTitle && <BracketRight className="rectangle-2711" />}
            <div className="intro">{displayTitle}</div>
            {displayTitle && <BracketLeft className="rectangle" />}
          </div>
        </div>
      </div>
      <div className="header__btn--code">
        <button className="enter--code">ENTER CODE</button>
      </div>
    </header>
  );
}

export default Header;
