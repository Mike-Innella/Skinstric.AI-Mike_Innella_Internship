import React from "react";
import { Helmet } from "react-helmet-async";
import Dashboard from "../Components/Dashboard";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/DashboardPage.css";
import PageBoxes from "../Components/PageBoxes";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/analysis");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | Skinstric.AI</title>
      </Helmet>

      <PageBoxes
        showLeft={false}
        showRight={false}
        showCenter={true}
        showNextButton={true}
        showBackButton={true}
        backButtonLabel="BACK"
        nextButtonLabel="GET SUMMARY"
        onNext={handleNext}
        onBack={handleBack}
      />

      <Dashboard />
    </>
  );
}

export default DashboardPage;
