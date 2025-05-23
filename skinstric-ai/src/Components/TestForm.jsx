import React, { useState, useEffect, useCallback, useRef } from "react";
import { submitPhaseOne, submitFinalImage, submitBase64Image } from "../Services/api";
import ImageOptions from "./ImageOptions";
import "../UI/Styles/Components/TestForm.css";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../Context/AnalysisContext";

const TestForm = ({
  step: externalStep,
  onStepChange,
  onCanProceedChange,
  onFinalSubmit,
  onSubmitPhaseOne,
  onSubmitPhaseThree,
}) => {
  const [internalStep, setInternalStep] = useState(1);
  const step = externalStep !== undefined ? externalStep : internalStep;
  const [visibleSteps, setVisibleSteps] = useState([1]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [capturedImageEvent, setCapturedImageEvent] = useState(null);
  const navigate = useNavigate();
  const { setAnalysisData } = useAnalysis();
  
  // Use ref to prevent infinite loops
  const canProceedRef = useRef(false);

  // Only call onCanProceedChange when the value actually changes
  const updateCanProceed = useCallback((newValue) => {
    if (canProceedRef.current !== newValue) {
      canProceedRef.current = newValue;
      onCanProceedChange?.(newValue);
    }
  }, [onCanProceedChange]);

  useEffect(() => {
    let canProceed = false;
    
    if (step === 1) {
      canProceed = !!name;
    } else if (step === 2) {
      canProceed = !!location;
    } else if (step === 3) {
      canProceed = !!capturedImageEvent;
    }
    
    updateCanProceed(canProceed);
    setMessage("");
  }, [name, location, step, capturedImageEvent, updateCanProceed]);

  useEffect(() => {
    if (step === 2 && !visibleSteps.includes(2)) setLocation("");
  }, [step, visibleSteps]);

  useEffect(() => {
    setVisibleSteps([step]);
  }, [step]);

  useEffect(() => {
    if (!visibleSteps.includes(step)) {
      setVisibleSteps((prev) => [...prev, step]);
    }
  }, [step, visibleSteps]);

  const transitionToStep = useCallback(
    (newStep) => {
      setMessage("");
      setVisibleSteps((prev) =>
        !prev.includes(newStep) ? [...prev, newStep] : prev
      );
      if (externalStep === undefined) setInternalStep(newStep);
      onStepChange?.(newStep);
      setTimeout(() => setVisibleSteps([newStep]), 600);
    },
    [externalStep, onStepChange]
  );

  const handleNextStep = useCallback(() => {
    transitionToStep(step + 1);
  }, [step, transitionToStep]);

  const handlePrevStep = useCallback(() => {
    transitionToStep(step - 1);
  }, [step, transitionToStep]);

  const handlePhaseOneSubmit = useCallback(async () => {
    if (!name || !location) return;
    setIsSubmitting(true);
    setMessage("");
    try {
      const result = await submitPhaseOne({ name, location });
      console.log("🔍 TestForm received API 1 result:", result);
      console.log("🔍 TestForm extracting result.data:", result.data);
      setMessage(`Phase 1 Success: ${result.message || "Submitted!"}`);
      setTimeout(() => setMessage(""), 1500);
      handleNextStep();
    } catch (err) {
      console.error("❌ API 1 failed:", err);
      setMessage("Phase 1 Error. Try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, location, handleNextStep]);

  const handleFinalImageSubmit = useCallback(async () => {
    if (!capturedImageEvent || isSubmitting) return;
    
    setIsSubmitting(true);
    setMessage("");
    
    try {
      // Show loading page first
      navigate("/loading");
      
      // Convert captured image event to base64
      const file = capturedImageEvent.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64String = reader.result.split(",")[1];
          
          // Create promises for API call and minimum loading time
          const apiPromise = submitFinalImage({
            name,
            location,
            image: base64String,
          });
          
          const delayPromise = new Promise(resolve => setTimeout(resolve, 2800));
          
          // Wait for both API response and minimum loading time
          const [result] = await Promise.all([apiPromise, delayPromise]);
          
          const timestamp = new Date().toISOString();
          console.log(`[${timestamp}] [TestForm] Raw API2 response:`, result);
          
          if (result && result.data) {
            setAnalysisData(result.data);
            console.log(`[${timestamp}] [TestForm] analysisData set in context, navigating to /dashboard`);
            navigate("/dashboard");
          } else {
            console.error("Invalid analysis result:", result);
            setMessage("Invalid analysis result. Try again.");
            navigate("/test"); // Go back to test page on error
          }
        } catch (err) {
          const timestamp = new Date().toISOString();
          console.error(`[${timestamp}] [TestForm] API2 failed:`, err);
          setMessage("Image upload failed. Please try again.");
          navigate("/test"); // Go back to test page on error
        } finally {
          setIsSubmitting(false);
        }
      };
      
      reader.onerror = () => {
        console.error("Error reading file");
        setMessage("Error reading file. Please try again.");
        navigate("/test"); // Go back to test page on error
        setIsSubmitting(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] [TestForm] File processing failed:`, err);
      setMessage("Image processing failed. Please try again.");
      navigate("/test"); // Go back to test page on error
      setIsSubmitting(false);
    }
  }, [capturedImageEvent, name, location, navigate, setAnalysisData, isSubmitting]);

  useEffect(() => {
    if (typeof onSubmitPhaseOne === "function") {
      onSubmitPhaseOne(() => handlePhaseOneSubmit);
    }
  }, [handlePhaseOneSubmit, onSubmitPhaseOne]);

  useEffect(() => {
    if (typeof onSubmitPhaseThree === "function") {
      onSubmitPhaseThree(() => handleFinalImageSubmit);
    }
  }, [handleFinalImageSubmit, onSubmitPhaseThree]);

  return (
    <div className="test-form__container">
      <div className="test-form">
        <label className="test-form-label">CLICK TO TYPE</label>
        <div className="test-form__steps-wrapper">
          {visibleSteps.includes(1) && (
            <div
              className={`test-form__step test-form__step--${step} ${
                step === 1
                  ? "test-form__step--visible"
                  : "test-form__step--fading"
              }`}
            >
              <input
                className="test-form__input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Introduce yourself"
              />
            </div>
          )}

          {visibleSteps.includes(2) && (
            <div
              className={`test-form__step test-form__step--${step} ${
                step === 2
                  ? "test-form__step--visible"
                  : "test-form__step--fading"
              }`}
            >
              <input
                className="test-form__input"
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
                placeholder="Where are you from?"
              />
            </div>
          )}

          {visibleSteps.includes(3) && (
            <div
              className={`test-form__step test-form__step--${step} ${
                step === 3
                  ? "test-form__step--visible"
                  : "test-form__step--fading"
              }`}
            >
              <ImageOptions
                onImageReady={(event) => {
                  setCapturedImageEvent(event);
                }}
              />
            </div>
          )}
        </div>
        {message && <p className="test-form__message">{message}</p>}
      </div>
    </div>
  );
};

export default TestForm;
