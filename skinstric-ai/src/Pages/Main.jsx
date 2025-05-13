import React from "react";
import { Helmet } from "react-helmet-async";
import "../UI/Styles/Pages/Pages.css";
import PageBoxes from "../UI/Animations/PageBoxes";

function MainPage() {
  return (
    <>
      <Helmet>
        <title>Main Page | Skinstric.AI</title>
        {/* TODO: Add meta tags for main page */}
      </Helmet>

      <PageBoxes
        showLeft={true}
        showRight={true}
        showCenter={false}
        showNextButton={true}
        showBackButton={true}
      />
      {/* TODO: Set up and CSS the content title */}
      <div className="main__page--container">
        <div className="main__page--content">
          <h1 className="main__page--header">
            Sophisticated
            <br />
            skincare
          </h1>
        </div>
      </div>
    </>
  );
}

export default MainPage;
