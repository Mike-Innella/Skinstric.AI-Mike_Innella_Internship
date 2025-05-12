import React from "react";
import "../Styles/Components/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__title">
        <h1 className="header__title--name">SKINSTRIC</h1>
      </div>
      <div className="header__btn--code">
        <button className="enter--code">ENTER CODE</button>
      </div>
    </header>
  );
}

export default Header;
