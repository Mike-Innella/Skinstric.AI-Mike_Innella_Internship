import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PageBoxes from "../Components/PageBoxes";
import CornerText from "../Components/CornerText";
import "../UI/Styles/Pages/MainPage.css";
import { useHeaderTitle } from "../Context/HeaderContext";

function MainPage() {
  const [hoverState, setHoverState] = useState("center");
  const { setHeaderTitle } = useHeaderTitle();
  
  useEffect(() => {
    setHeaderTitle("INTRO");
    
    // Clear header title when component unmounts
    return () => setHeaderTitle("");
  }, [setHeaderTitle]);

  return (
    <>
      <Helmet>
        <title>Main Page | Skinstric.AI</title>
      </Helmet>

      <PageBoxes
        showLeft={true}
        showRight={true}
        showCenter={false}
        showNextButton={true}
        showBackButton={true}
        onHoverDirectionChange={setHoverState}
        hoverState={hoverState}
      />

      <div className="main__page--container">
        <div
          className={`main__page--header-wrapper ${
            hoverState === "left"
              ? "header-left"
              : hoverState === "right"
              ? "header-right"
              : "header-center"
          }`}
        >
          <h1 className="main__page--header">
            <span className="header-line-1">Sophisticated</span>
            <br />
            <span className="header-line-2">skincare</span>
          </h1>
        </div>
      </div>

      <CornerText />
    </>
  );
}

export default MainPage;
