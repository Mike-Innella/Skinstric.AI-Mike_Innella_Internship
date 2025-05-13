import React from "react";
import { Helmet } from "react-helmet-async";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/Intro.css";

import PageBoxes from "../UI/Animations/PageBoxes.jsx";

function Intro() {
  return (
    <>
      <Helmet>
        <title>Welcome | Skinstric.AI</title>
        <meta
          name="description"
          content="Get personalized skincare recommendations powered by AI. Start your skin assessment today with Skinstric.AI."
        />
      </Helmet>

      <div className="intro">
        {/* Animated 3D Dotted Borders - Only right square with next button */}
        <PageBoxes
          showLeft={false}
          showRight={true}
          showCenter={false}
          showNextButton={true}
          showBackButton={false}
        />
        <div className="intro__container">
          <h1 className="intro__title">Welcome to Skinstric.AI</h1>

          <section className="intro__section">
            <h2 className="intro__section--title">About Our Platform</h2>
            <p className="intro__section--text">
              Skinstric.AI is an innovative platform that leverages artificial
              intelligence to provide personalized skincare recommendations...
            </p>
          </section>

          <section className="intro__section">
            <h2 className="intro__section--title">How It Works</h2>
            <p className="intro__section--text">
              1. Take our comprehensive skin assessment
              <br />
              2. Receive personalized product recommendations
              <br />
              3. Track your progress and adjust your routine as needed
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default Intro;
