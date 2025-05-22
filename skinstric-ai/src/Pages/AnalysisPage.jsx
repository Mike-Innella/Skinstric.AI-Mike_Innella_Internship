import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Components/Header";
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
  const { setHeaderTitle } = useHeaderTitle();

  const [analysisData, setAnalysisData] = useState(null);
  const [selectedValues, setSelectedValues] = useState({
    race: "",
    age: "",
    gender: ""
  });
  
  const [activeDemographic, setActiveDemographic] = useState("race");
  
  useEffect(() => {
    setHeaderTitle("ANALYSIS");
    
    // Clear header title when component unmounts
    return () => setHeaderTitle("");
  }, [setHeaderTitle]);

  useEffect(() => {
    if (location.state?.analysisData) {
      const data = location.state.analysisData;
      setAnalysisData(data);
      
      // Initialize selected values with highest confidence values
      if (data.demographics) {
        setSelectedValues({
          race: data.demographics.race,
          age: data.demographics.age,
          gender: data.demographics.sex
        });
      }
    } else if (location.state) {
      // For backward compatibility with old data structure
      const data = location.state;
      setAnalysisData(data);
      
      if (data.race && data.age && data.sex) {
        setSelectedValues({
          race: data.race,
          age: data.age,
          gender: data.sex
        });
      }
    } else {
      // Generate dummy data if no data is present (e.g., when coming from Dashboard)
      if (process.env.NODE_ENV === "development") {
        console.log("No analysis data found, generating dummy data");
      }
      const dummyData = generateDummyData();
      setAnalysisData(dummyData);
      setSelectedValues({
        race: dummyData.demographics.race,
        age: dummyData.demographics.age,
        gender: dummyData.demographics.sex
      });
    }
  }, [location.state]);
  
  // Generate dummy data for when no data is passed to the page
  const generateDummyData = () => {
    const dummyRaceData = {
      "east asian": 0.96,
      "white": 0.06,
      "black": 0.03,
      "south asian": 0.02,
      "latino hispanic": 0.00,
      "southeast asian": 0.00,
      "middle eastern": 0.00
    };
    
    const dummyAgeData = {
      "20-29": 0.45,
      "30-39": 0.25,
      "10-19": 0.15,
      "40-49": 0.08,
      "0-9": 0.03,
      "50-59": 0.02,
      "60-69": 0.01,
      "70+": 0.01
    };
    
    const dummyGenderData = {
      "female": 0.52,
      "male": 0.48
    };
    
    return {
      demographics: {
        name: "Demo User",
        location: "Demo Location",
        race: "east asian",
        age: "20-29",
        sex: "female"
      },
      confidence: {
        race: formatConfidenceData(dummyRaceData),
        age: formatConfidenceData(dummyAgeData),
        gender: formatConfidenceData(dummyGenderData)
      }
    };
  };
  
  // Helper function to format confidence data
  const formatConfidenceData = (obj) => {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [key, value]) => {
        acc[key] = (value * 100).toFixed(2);
        return acc;
      }, {});
  };

  // Handle selection of a demographic value
  const handleValueSelection = (value, type) => {
    setSelectedValues(prev => ({
      ...prev,
      [type]: value
    }));
    
    // If type is gender, we need to update the 'sex' property for display
    if (type === 'gender') {
      setAnalysisData(prev => {
        if (prev.demographics) {
          return {
            ...prev,
            demographics: {
              ...prev.demographics,
              sex: value
            }
          };
        } else {
          return {
            ...prev,
            sex: value
          };
        }
      });
    } else {
      // Update the demographics or direct property
      setAnalysisData(prev => {
        if (prev.demographics) {
          return {
            ...prev,
            demographics: {
              ...prev.demographics,
              [type]: value
            }
          };
        } else {
          return {
            ...prev,
            [type]: value
          };
        }
      });
    }
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
    if (!analysisData.confidence) return "0";
    
    switch (activeDemographic) {
      case 'race':
        return analysisData.confidence.race[selectedValues.race] || "0";
      case 'age':
        return analysisData.confidence.age[selectedValues.age] || "0";
      case 'gender':
        return analysisData.confidence.gender[selectedValues.gender] || "0";
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
                confidenceData={analysisData.confidence}
                selectedValue={selectedValues.race}
                onValueSelection={handleValueSelection}
                dataType="race"
                title=""
                className={activeDemographic !== 'race' ? 'hidden' : ''}
              />
              
              <ConfidenceTable
                confidenceData={analysisData.confidence}
                selectedValue={selectedValues.age}
                onValueSelection={handleValueSelection}
                dataType="age"
                title=""
                className={activeDemographic !== 'age' ? 'hidden' : ''}
              />
              
              <ConfidenceTable
                confidenceData={analysisData.confidence}
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
