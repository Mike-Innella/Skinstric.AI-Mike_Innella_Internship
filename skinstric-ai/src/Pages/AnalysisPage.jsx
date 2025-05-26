import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Components/Header";
import PageBoxes from "../Components/PageBoxes";
import DemographicsCard from "../Components/Analysis/DemographicsCard";
import ConfidenceTable from "../Components/Analysis/ConfidenceTable";
import MobileDropdown from "../Components/Analysis/MobileDropdown";
import ProgressDisplay from "../Components/Analysis/ProgressDisplay";
import { useHeaderTitle } from "../Context/HeaderContext";
import { useAnalysis } from "../Context/AnalysisContext";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/AnalysisPage.css";
import "../UI/Styles/Components/DemographicsCard.css";
import "../UI/Styles/Components/ConfidenceTable.css";
import "../UI/Styles/Components/MobileDropdown.css";
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

  // Helper function to prepare dropdown data
  const getDropdownOptions = (dataType) => {
    if (!analysisData) return [];
    
    const data = analysisData[dataType] || {};
    return Object.entries(data)
      .sort((a, b) => {
        // For age, sort by age range numerically (youngest first)
        if (dataType === "age") {
          const getFirstNumber = (range) => {
            const match = range.match(/^(\d+)/);
            return match ? parseInt(match[1], 10) : 999;
          };
          return getFirstNumber(a[0]) - getFirstNumber(b[0]);
        }
        // For other types, sort by confidence (highest first)
        return parseFloat(b[1]) - parseFloat(a[1]);
      })
      .map(([key, value]) => ({ 
        key, 
        value: Math.round(parseFloat(value)) 
      }));
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

            {/* Right Column - Confidence Tables (Desktop Only) */}
            <div className="confidence-tables desktop-only">
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

            {/* Mobile Dropdowns (Mobile Only) */}
            <div className="mobile-dropdowns mobile-only">
              <div className="mobile-dropdown-section">
                <h3 className="mobile-dropdown-title">Select Race:</h3>
                <MobileDropdown
                  options={getDropdownOptions('race')}
                  selectedValue={selectedValues.race}
                  onValueChange={handleValueSelection}
                  dataType="race"
                  placeholder="Choose race..."
                />
              </div>

              <div className="mobile-dropdown-section">
                <h3 className="mobile-dropdown-title">Select Age:</h3>
                <MobileDropdown
                  options={getDropdownOptions('age')}
                  selectedValue={selectedValues.age}
                  onValueChange={handleValueSelection}
                  dataType="age"
                  placeholder="Choose age range..."
                />
              </div>

              <div className="mobile-dropdown-section">
                <h3 className="mobile-dropdown-title">Select Gender:</h3>
                <MobileDropdown
                  options={getDropdownOptions('gender')}
                  selectedValue={selectedValues.gender}
                  onValueChange={handleValueSelection}
                  dataType="gender"
                  placeholder="Choose gender..."
                />
              </div>
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
