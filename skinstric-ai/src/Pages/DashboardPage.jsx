import React from "react";
import { Helmet } from "react-helmet-async";
import Dashboard from "../Components/Dashboard";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/DashboardPage.css";
import PageBoxes from "../Components/PageBoxes";

function DashboardPage() {
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
      />

      <Dashboard />
    </>
  );
}

export default DashboardPage;
