import React, { useState, useEffect, useCallback } from "react";
import { submitPhaseOne, submitFinalImage, submitBase64Image } from "../Services/api";
import ImageOptions from "./ImageOptions";
import "../UI/Styles/Components/TestForm.css";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    if (step === 1) onCanProceedChange?.(!!name);
    else if (step === 2) onCanProceedChange?.(!!location);
    else if (step === 3) {
      if (capturedImageEvent) {
        console.log(
          "Setting canProceed to true because capturedImageEvent exists"
        );
        onCanProceedChange?.(true);
      } else {
        onCanProceedChange?.(false);
      }
    }
    setMessage("");
  }, [name, location, step, capturedImageEvent, onCanProceedChange]);

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
      setMessage(`Phase 1 Success: ${result.message || "Submitted!"}`);
      setTimeout(() => setMessage(""), 1500);
      handleNextStep();
    } catch (err) {
      setMessage("Phase 1 Error. Try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, location, handleNextStep]);

  useEffect(() => {
    if (typeof onSubmitPhaseOne === "function") {
      onSubmitPhaseOne(() => handlePhaseOneSubmit());
    }
  }, []);

  useEffect(() => {
    if (typeof onSubmitPhaseThree === "function") {
      onSubmitPhaseThree(() => {
        if (capturedImageEvent) {
          handleImageUpload(capturedImageEvent);
        }
      });
    }
  }, [capturedImageEvent, onSubmitPhaseThree]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];
      setIsSubmitting(true);
      setMessage("");
      try {
        const result = await submitFinalImage({
          name,
          location,
          image: base64String
        });

        if (result) {
          navigate("/analysis", { state: { analysisData: result } });
        } else {
          setMessage("Invalid analysis result. Try again.");
          onCanProceedChange?.(false);
        }
        // Don't automatically call onFinalSubmit, let the user click the submit button
        setTimeout(() => setMessage(""), 1800);
      } catch (err) {
        console.error("Image upload error:", err);
        setMessage("Image upload failed. Please try again.");
        onCanProceedChange?.(false);
        setTimeout(() => setMessage(""), 2800);
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.readAsDataURL(file);
  };

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
                  onCanProceedChange?.(!!e.target.value);
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
                  onCanProceedChange?.(!!e.target.value);
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
                onImageSelected={handleImageUpload}
                onCanProceed={(canProceed) => onCanProceedChange?.(canProceed)}
                onImageReady={(event) => setCapturedImageEvent(event)}
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
