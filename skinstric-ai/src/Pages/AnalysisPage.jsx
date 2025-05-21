import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import PageBoxes from "../Components/PageBoxes";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/AnalysisPage.css";

// Import custom components
import DemographicsCard from "../Components/Analysis/DemographicsCard";
import ConfidenceTable from "../Components/Analysis/ConfidenceTable";
import ProgressDisplay from "../Components/Analysis/ProgressDisplay";

// Import component styles
import "../UI/Styles/Components/DemographicsCard.css";
import "../UI/Styles/Components/ConfidenceTable.css";
import "../UI/Styles/Components/ProgressDisplay.css";

// Import assets

function AnalysisPage() {
  const navigate = useNavigate();

  // State for analysis data
  const [analysisData] = useState({
    race: "EAST ASIAN",
    age: "20-29",
    sex: "FEMALE",
    confidence: {
      "0-9": 0,
      "10-19": 4,
      "20-29": 96,
      "30-39": 2,
      "40-49": 0,
      "50-59": 0,
      "60-69": 0,
      "70+": 0,
    },
  });

  // State for user selection
  const [selectedAge, setSelectedAge] = useState("");

  // Handle age selection
  const handleAgeSelection = (ageRange) => {
    setSelectedAge(ageRange);
  };

  // Handle confirm button click
  const handleConfirm = () => {
    // Submit the corrected data if user made changes
    if (selectedAge && selectedAge !== analysisData.age) {
      // API call to update the data would go here
      console.log("Updating age to:", selectedAge);
    }
    // Navigate to next step (for now, go back to main page)
    navigate("/");
  };

  // Handle reset button click
  const handleReset = () => {
    setSelectedAge("");
  };

  // Handle back button click
  const handleBack = () => {
    navigate("/dashboard");
    return false; // Prevent default navigation in PageBoxes
  };

  return (
    <>
      <Helmet>
        <title>AI Analysis | Skinstric.AI</title>
      </Helmet>

      <Header title="ANALYSIS" />

      <PageBoxes
        showLeft={false}
        showRight={false}
        showCenter={false}
        showNextButton={false}
        showBackButton={true} // Use the standard back button
        onBack={handleBack}
        backButtonLabel="BACK"
      />

      <div className="element">
        <div className="div">
          <div className="overlap"></div>

          <div className="a-i-analysis">A. I. ANALYSIS</div>
          <div className="predicted-race-age">PREDICTED RACE &amp; AGE</div>
          <div className="demographics">DEMOGRAPHICS</div>

          {/* Navigation buttons removed - using standard back button in PageBoxes */}

          <div className="group">
            <ProgressDisplay
              percentage={analysisData.confidence["20-29"]}
              ageRange={analysisData.age}
            />
          </div>

          <div className="overlap-wrapper">
            <DemographicsCard title="RACE" value={analysisData.race} />
          </div>

          <div className="div-wrapper">
            <DemographicsCard
              title="AGE"
              value={analysisData.age}
              isActive={true}
            />
          </div>

          <div className="group-3">
            <DemographicsCard title="SEX" value={analysisData.sex} />
          </div>

          <div className="group-4">
            <ConfidenceTable
              confidenceData={analysisData.confidence}
              selectedAge={selectedAge}
              onAgeSelection={handleAgeSelection}
            />
          </div>

          <p className="p">
            If A.I. estimate is wrong, select the correct one.
          </p>

          <div className="button-wrapper">
            <button className="button-3" onClick={handleReset}>
              RESET
            </button>
          </div>

          <div className="button-simple">
            <button className="button-2" onClick={handleConfirm}>
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnalysisPage;
