import React from "react";
import { Helmet } from "react-helmet-async";
import "../UI/Styles/Pages/Pages.css";
import PageBoxes from "../UI/Animations/PageBoxes";
import CornerText from "../Components/CornerText";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/TestIntro.css";

function TestIntro() {
  return (
    <>
      <Helmet>
        <title>Pretest | Skinstric.AI</title>
        {/* TODO: Add meta tags for pretest page */}
      </Helmet>

      <PageBoxes
        showLeft={false}
        showRight={false}
        showCenter={true}
        showNextButton={false}
        showBackButton={true}
      />

      <div className="test__intro--container">
        <h2 className="analysis-text">TO START ANALYSIS</h2>
        <h1 className="test__intro--header">Introduce Yourself</h1>
      </div>

    </>
  );
}

export default TestIntro;
