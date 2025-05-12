import React from "react";
import { Helmet } from "react-helmet-async";
import "../UI/Styles/Components/Header.css";

function Header() {
  return (
    <>
      <Helmet>
        <title>Skinstric.AI</title>
      </Helmet>

      <header className="header">
        <div className="header__title">
          <h1 className="header__title--name">SKINSTRIC</h1>
        </div>
        <div className="header__btn--code">
          <button className="enter--code">ENTER CODE</button>
        </div>
      </header>
    </>
  );
}

export default Header;
