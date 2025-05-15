import React from "react";
import { Helmet } from "react-helmet-async";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/DiscoverPage.css";

import PageBoxes from "../Components/PageBoxes";

function Discover() {
  return (
    <>
      <Helmet>
        <title>Welcome | Skinstric.AI</title>
        <meta
          name="description"
          content="Get personalized skincare recommendations powered by AI. Start your skin assessment today with Skinstric.AI."
        />
      </Helmet>

      {/* Animated 3D Dotted Borders - Only right square with next button */}
      <PageBoxes
        showLeft={false}
        showRight={true}
        showCenter={false}
        showNextButton={true}
        showBackButton={false}
      />
      
      <div className="discover__container">
        <h1 className="discover__title">Welcome to Skinstric.AI</h1>

        <section className="discover__section">
          <h2 className="discover__section--title">About Our Platform</h2>
          <p className="discover__section--text">
            Skinstric.AI is an innovative platform that leverages artificial
            intelligence to provide personalized skincare recommendations...
          </p>
        </section>

        <section className="discover__section">
          <h2 className="discover__section--title">How It Works</h2>
          <p className="discover__section--text">
            1. Take our comprehensive skin assessment
            <br />
            2. Receive personalized product recommendations
            <br />
            3. Track your progress and adjust your routine as needed
          </p>
        </section>
      </div>
    </>
  );
}

export default Discover;
