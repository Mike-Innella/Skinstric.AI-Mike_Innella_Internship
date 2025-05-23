import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "../UI/Styles/Pages/Pages.css";
import PageBoxes from "../Components/PageBoxes";
import TestForm from "../Components/TestForm";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/TestPage.css";
import { useHeaderTitle } from "../Context/HeaderContext";

function TestPage() {
  const [formStep, setFormStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeaderTitle();
  const [submitPhaseOneRef, setSubmitPhaseOneRef] = useState(() => () => {
    console.log("submitPhaseOneRef called before initialization");
  });
  // Add submitPhaseThreeRef for API2 submission
  const [submitPhaseThreeRef, setSubmitPhaseThreeRef] = useState(() => () => {
    console.log("submitPhaseThreeRef called before initialization");
  });

  // Set header title when component mounts
  useEffect(() => {
    setHeaderTitle("INTRO");
    
    // Clear header title when component unmounts
    return () => setHeaderTitle("");
  }, [setHeaderTitle]);

  // Initialize with valid state for first step if name is entered
  const [initialLoad, setInitialLoad] = useState(true);

  // Button labels based on current step
  const [nextButtonLabel, setNextButtonLabel] = useState("PROCEED");
  const [backButtonLabel, setBackButtonLabel] = useState("BACK");

  // Update button labels and reset canProceed when step changes
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }

    // Reset canProceed when step changes (except on initial load)
    setCanProceed(false);
    console.log(`Step changed to ${formStep}, resetting canProceed to false`);

    // Update button labels based on current step
    if (formStep === 1) {
      setNextButtonLabel("PROCEED");
      setBackButtonLabel("BACK");
    } else if (formStep === 2) {
      setNextButtonLabel("PROCEED");
      setBackButtonLabel("PREVIOUS");
    } else if (formStep === 3) {
      setNextButtonLabel("SUBMIT");
      setBackButtonLabel("PREVIOUS");
    }
  }, [formStep, initialLoad]);

  const handleNextStep = () => {
    // Don't proceed if validation fails
    if (!canProceed) return;

    // If we're on step 2 and can proceed, submit phase one data before advancing
    if (formStep === 2 && typeof submitPhaseOneRef === "function") {
      try {
        submitPhaseOneRef(); 
        return;
      } catch (error) {
        console.error("Error calling submitPhaseOneRef:", error);
      }
    }

    // For other steps, just advance if possible
    if (formStep < 3) {
      setFormStep((prev) => prev + 1);
    } else if (formStep === 3 && canProceed) {
      // If on step 3 and can proceed, trigger API2 submission via TestForm
      if (typeof submitPhaseThreeRef === "function") {
        try {
          submitPhaseThreeRef();
        } catch (error) {
          console.error("Error calling submitPhaseThreeRef:", error);
        }
      }
    }
  };

  // Handle back button behavior
  const handleBackStep = () => {
    // If on step 1, use default navigation (to previous page)
    // by not handling the event and letting PageBoxes handle it
    if (formStep === 1) {
      return; // undefined return allows default navigation
    }

    // If on steps 2 or 3, go to previous form step
    setFormStep((prev) => prev - 1);
    // Always allow going back (no validation needed)
    setCanProceed(true);

    // Return false to prevent default navigation in PageBoxes
    return false;
  };

  const handleFinalSubmit = () => {
    // Navigate to loading page after final submission
    navigate("/loading");
  };

  return (
    <>
      <Helmet>
        <title>Pretest | Skinstric.AI</title>
        {/* TODO: Add meta tags for pretest page */}
      </Helmet>

      <PageBoxes
        showLeft={false}
        showRight={false}
        showCenter={formStep !== 3}
        showNextButton={formStep < 3 || (formStep === 3 && canProceed)}
        showBackButton={true}
        onNext={handleNextStep}
        onBack={handleBackStep}
        nextButtonFadeOut={!canProceed}
        nextButtonLabel={nextButtonLabel}
        backButtonLabel={backButtonLabel}
      />
      <TestForm
        step={formStep}
        onStepChange={setFormStep}
        onCanProceedChange={(value) => {
          console.log(`canProceed changed to ${value}`);
          setCanProceed(value);
        }}
        onFinalSubmit={handleFinalSubmit}
        onSubmitPhaseOne={setSubmitPhaseOneRef}
        onSubmitPhaseThree={setSubmitPhaseThreeRef}
      />
    </>
  );
}

export default TestPage;
