import React from "react";
import BracketLeft from "./SVG/BracketLeft";
import BracketRight from "./SVG/BracketRight";
import "../UI/Styles/Components/Header.css";

function Header({ title }) {
  // Ensure title text is uppercase
  const displayTitle = title ? title.toUpperCase() : "";

  return (
    <header className="header">
      <dniv className="header__title-bracket--wrapper">
        <h1 className="header__title--name">SKINSTRIC</h1>
        <div className="location">
          <div className="frame">
            {displayTitle && <BracketLeft className="rectangle" />}
            <div className="intro">{displayTitle}</div>
            {displayTitle && <BracketRight className="rectangle-2711" />}
          </div>
        </div>
      </dniv>
      <div className="header__btn--code">
        <button className="enter--code">ENTER CODE</button>
      </div>
    </header>
  );
}

export default Header;
