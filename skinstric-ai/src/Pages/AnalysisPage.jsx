import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import PageBoxes from "../Components/PageBoxes";
import DemographicsCard from "../Components/Analysis/DemographicsCard";
import ConfidenceTable from "../Components/Analysis/ConfidenceTable";
import ProgressDisplay from "../Components/Analysis/ProgressDisplay";
import { useHeaderTitle } from "../Context/HeaderContext";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/AnalysisPage.css";
import "../UI/Styles/Components/DemographicsCard.css";
import "../UI/Styles/Components/ConfidenceTable.css";
import "../UI/Styles/Components/ProgressDisplay.css";

function AnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state;
  const { setHeaderTitle } = useHeaderTitle();

  const [analysisData, setAnalysisData] = useState(null);
  const [selectedAge, setSelectedAge] = useState("");
  
  useEffect(() => {
    setHeaderTitle("ANALYSIS");
    
    // Clear header title when component unmounts
    return () => setHeaderTitle("");
  }, [setHeaderTitle]);

  useEffect(() => {
    if (result) setAnalysisData(result);
  }, [result]);

  const handleAgeSelection = (ageRange) => {
    setSelectedAge(ageRange);
  };

  const handleConfirm = () => {
    if (selectedAge && selectedAge !== analysisData.age) {
      console.log("Updating age to:", selectedAge);
      // Optionally send to API
    }
    navigate("/");
  };

  const handleReset = () => {
    setSelectedAge("");
  };

  const handleBack = () => {
    navigate("/dashboard");
    return false;
  };

  if (!analysisData) return <div className="loading">Loading analysis...</div>;

  return (
    <>
      <Helmet>
        <title>AI Analysis | Skinstric.AI</title>
      </Helmet>

      <PageBoxes
        showLeft={false}
        showRight={false}
        showCenter={false}
        showNextButton={false}
        showBackButton={true}
        onBack={handleBack}
        backButtonLabel="BACK"
      />

      <div className="element">
        <div className="div">
          <div className="overlap" />
          <div className="header-section">
            <h2 className="a-i-analysis">A. I. ANALYSIS</h2>
            <p className="a-i-has-estimated">
              PREDICTED RACE & AGE <br />
              DEMOGRAPHICS
            </p>
          </div>

          <div className="group">
            <ProgressDisplay
              percentage={analysisData.confidence[analysisData.age] || 0}
              ageRange={analysisData.age}
            />
          </div>

          <div className="overlap-wrapper">
            <DemographicsCard title="RACE" value={analysisData.race} />
          </div>

          <div className="div-wrapper">
            <DemographicsCard title="AGE" value={analysisData.age} isActive />
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
