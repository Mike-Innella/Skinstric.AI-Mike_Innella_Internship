import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "../UI/Styles/Pages/Pages.css";
import PageBoxes from "../UI/Animations/PageBoxes";
import TestForm from "../Components/TestForm";
import "../UI/Styles/Pages/Pages.css";
import "../UI/Styles/Pages/TestPage.css";

function TestPage() {
  const [formStep, setFormStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const navigate = useNavigate();
  const [submitPhaseOneRef, setSubmitPhaseOneRef] = useState(null);
  
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
    if (formStep === 2 && submitPhaseOneRef) {
      submitPhaseOneRef();
      // The form's handlePhaseOneSubmit will call onStepChange when done
      return;
    }
    
    // For other steps, just advance if possible
    if (formStep < 3) {
      setFormStep(prev => prev + 1);
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
    setFormStep(prev => prev - 1);
    // Always allow going back (no validation needed)
    setCanProceed(true);
    
    // Return false to prevent default navigation in PageBoxes
    return false;
  };
  
  const handleFinalSubmit = () => {
    // Navigate to intro page after final submission
    navigate('/intro');
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
        showCenter={true}
        showNextButton={true}
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
        onCanProceedChange={setCanProceed}
        onFinalSubmit={handleFinalSubmit}
        onSubmitPhaseOne={setSubmitPhaseOneRef}
      />
    </>
  );
}

export default TestPage;
