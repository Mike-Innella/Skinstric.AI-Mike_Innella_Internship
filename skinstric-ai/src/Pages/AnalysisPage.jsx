import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Components/Header";
import PageBoxes from "../Components/PageBoxes";
import DemographicsCard from "../Components/Analysis/DemographicsCard";
import ConfidenceTable from "../Components/Analysis/ConfidenceTable";
import ProgressDisplay from "../Components/Analysis/ProgressDisplay";
import { useHeaderTitle } from "../Context/HeaderContext";
import { useAnalysis } from "../Context/AnalysisContext";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/AnalysisPage.css";
import "../UI/Styles/Components/DemographicsCard.css";
import "../UI/Styles/Components/ConfidenceTable.css";
import "../UI/Styles/Components/ProgressDisplay.css";

function AnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setHeaderTitle } = useHeaderTitle();
  const { analysisData } = useAnalysis();

  const [selectedValues, setSelectedValues] = useState({
    race: "",
    age: "",
    gender: ""
  });

  const [activeDemographic, setActiveDemographic] = useState("race");

  useEffect(() => {
    setHeaderTitle("ANALYSIS");
    return () => setHeaderTitle("");
  }, [setHeaderTitle]);

  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [AnalysisPage] Mounted. analysisData from context:`, analysisData);
    if (analysisData) {
      // Extract highest-confidence value for each demographic
      const getHighest = (obj) =>
        obj && typeof obj === "object"
          ? Object.entries(obj).sort((a, b) => b[1] - a[1])[0][0]
          : "";
      setSelectedValues({
        race: getHighest(analysisData.race || analysisData.confidence?.race),
        age: getHighest(analysisData.age || analysisData.confidence?.age),
        gender: getHighest(analysisData.gender || analysisData.confidence?.gender)
      });
      console.log(`[${timestamp}] [AnalysisPage] Selected values set from analysisData:`, {
        race: getHighest(analysisData.race || analysisData.confidence?.race),
        age: getHighest(analysisData.age || analysisData.confidence?.age),
        gender: getHighest(analysisData.gender || analysisData.confidence?.gender)
      });
      if (analysisData.confidence) {
        console.log(`[${timestamp}] [AnalysisPage] Confidence breakdown:`, analysisData.confidence);
      }
    } else {
      setSelectedValues({
        race: "",
        age: "",
        gender: ""
      });
      console.warn(`[${timestamp}] [AnalysisPage] No analysisData found in context.`);
    }
  }, [analysisData]);

  // Handle selection of a demographic value
  const handleValueSelection = (value, type) => {
    setSelectedValues(prev => ({
      ...prev,
      [type]: value
    }));
    
    // No need to update context or state for analysisData here.
    // Only update local selectedValues for UI.
  };
  
  // Handle clicking on a demographic card
  const handleDemographicCardClick = (type) => {
    setActiveDemographic(type);
  };

  const handleConfirm = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Confirmed selections:", selectedValues);
    }
    // Optionally send to API
    navigate("/");
  };

  const handleReset = () => {
    // Temporarily clear the active demographic to provide visual feedback
    setActiveDemographic("");
    
    // Reset to original values from API
    if (analysisData) {
      if (analysisData.demographics) {
        setSelectedValues({
          race: analysisData.demographics.race,
          age: analysisData.demographics.age,
          gender: analysisData.demographics.sex
        });
      } else if (analysisData.race && analysisData.age && analysisData.sex) {
        setSelectedValues({
          race: analysisData.race,
          age: analysisData.age,
          gender: analysisData.sex
        });
      }
    }
    
    // After a brief timeout, set the active demographic back to "race"
    // to prompt the user to make a new selection
    setTimeout(() => {
      setActiveDemographic("race");
    }, 300);
  };

  const handleBack = () => {
    navigate("/dashboard");
    return false;
  };

  if (!analysisData) return <div className="loading">Loading analysis...</div>;

  // Get the confidence value for the selected demographic
  const getConfidenceValue = () => {
    if (!analysisData) return "0";
    
    switch (activeDemographic) {
      case 'race':
        return analysisData.race?.[selectedValues.race] || "0";
      case 'age':
        return analysisData.age?.[selectedValues.age] || "0";
      case 'gender':
        return analysisData.gender?.[selectedValues.gender] || "0";
      default:
        return "0";
    }
  };
  
  // Get the display value for the center area
  const getDisplayValue = () => {
    // If activeDemographic is empty (during reset), return empty string
    if (!activeDemographic) return "";
    
    switch (activeDemographic) {
      case 'race':
        return selectedValues.race;
      case 'age':
        return `${selectedValues.age} y.o.`;
      case 'gender':
        return selectedValues.gender;
      default:
        return "";
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Analysis | Skinstric.AI</title>
      </Helmet>

      {/* Add Header component */}
      <Header title="ANALYSIS" />

      <PageBoxes
        showLeft={false}
        showRight={false}
        showCenter={false}
        showNextButton={false}
        showBackButton={true}
        onBack={handleBack}
        backButtonLabel="BACK"
      />

      <div className="analysis-container">
        <div className="analysis-content">
          {/* Header Section */}
          <div className="analysis-header">
            <h2 className="analysis-title">A. I. ANALYSIS</h2>
            <h1 className="demographics-title">DEMOGRAPHICS</h1>
            <p className="demographics-subtitle">
              PREDICTED RACE & AGE
            </p>
          </div>

          {/* Main Content Area */}
          <div className="analysis-main">
            {/* Left Column - Demographics Cards */}
            <div className="demographics-cards">
              <div 
                className={`demographics-card-wrapper ${activeDemographic === 'race' ? 'active' : ''}`}
                onClick={() => handleDemographicCardClick('race')}
              >
                <DemographicsCard 
                  title="RACE" 
                  value={selectedValues.race}
                  isActive={activeDemographic === 'race'}
                />
              </div>
              
              <div 
                className={`demographics-card-wrapper ${activeDemographic === 'age' ? 'active' : ''}`}
                onClick={() => handleDemographicCardClick('age')}
              >
                <DemographicsCard 
                  title="AGE" 
                  value={selectedValues.age}
                  isActive={activeDemographic === 'age'}
                />
              </div>
              
              <div 
                className={`demographics-card-wrapper ${activeDemographic === 'gender' ? 'active' : ''}`}
                onClick={() => handleDemographicCardClick('gender')}
              >
                <DemographicsCard 
                  title="SEX" 
                  value={selectedValues.gender}
                  isActive={activeDemographic === 'gender'}
                />
              </div>
            </div>

            {/* Center Column - Progress Display */}
            <div className="progress-display-wrapper">
              <div className="selected-value-display">
                {getDisplayValue()}
              </div>
              <div className="progress-circle-container">
                <ProgressDisplay
                  percentage={getConfidenceValue()}
                  ageRange={activeDemographic === 'age' ? selectedValues.age : ''}
                />
              </div>
            </div>

            {/* Right Column - Confidence Tables */}
            <div className="confidence-tables">
              <div className="confidence-table-header">
                <span>{activeDemographic.toUpperCase()}</span>
                <span>A. I. CONFIDENCE</span>
              </div>
              
              <ConfidenceTable
                confidenceData={analysisData}
                selectedValue={selectedValues.race}
                onValueSelection={handleValueSelection}
                dataType="race"
                title=""
                className={activeDemographic !== 'race' ? 'hidden' : ''}
              />
              
              <ConfidenceTable
                confidenceData={analysisData}
                selectedValue={selectedValues.age}
                onValueSelection={handleValueSelection}
                dataType="age"
                title=""
                className={activeDemographic !== 'age' ? 'hidden' : ''}
              />
              
              <ConfidenceTable
                confidenceData={analysisData}
                selectedValue={selectedValues.gender}
                onValueSelection={handleValueSelection}
                dataType="gender"
                title=""
                className={activeDemographic !== 'gender' ? 'hidden' : ''}
              />
            </div>
          </div>

          {/* Footer Section */}
          <div className="analysis-footer">
            <p className="instruction-text">
              If A.I. estimate is wrong, select the correct one.
            </p>

            <div className="action-buttons">
              <button className="reset-button" onClick={handleReset}>
                RESET
              </button>
              <button className="confirm-button" onClick={handleConfirm}>
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnalysisPage;
