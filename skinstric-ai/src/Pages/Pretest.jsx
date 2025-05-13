import React from "react";
import { Helmet } from "react-helmet-async";
import "../UI/Styles/Pages/Pages.css";
import PageBoxes from "../UI/Animations/PageBoxes";
import CornerText from "../Components/CornerText";
import "../UI/Styles/Pages/Main.css";

function PretestPage() {
  return (
    <>
      <Helmet>
        <title>Pretest | Skinstric.AI</title>
        {/* TODO: Add meta tags for pretest page */}
      </Helmet>

      <PageBoxes
        showLeft={true}
        showRight={true}
        showCenter={false}
        showNextButton={true}
        showBackButton={true}
      />
      <CornerText />
    </>
  );
}

export default PretestPage;
