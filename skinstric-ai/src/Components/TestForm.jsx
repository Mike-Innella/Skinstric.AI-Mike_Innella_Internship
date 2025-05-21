import React, { useState, useEffect, useCallback } from "react";
import { submitPhaseOne, submitBase64Image } from "../Services/api";
import ImageOptions from "./ImageOptions";
import "../UI/Styles/Components/TestForm.css";

const TestForm = ({
  step: externalStep,
  onStepChange,
  onCanProceedChange,
  onFinalSubmit,
  onSubmitPhaseOne,
}) => {
  const [internalStep, setInternalStep] = useState(1);
  // Use external step if provided, otherwise use internal step
  const step = externalStep !== undefined ? externalStep : internalStep;
  const [visibleSteps, setVisibleSteps] = useState([1]); // Tracks which steps are visible

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Update validation state when inputs change
  useEffect(() => {
    if (step === 1) {
      onCanProceedChange?.(!!name);
    } else if (step === 2) {
      onCanProceedChange?.(!!location);
    }

    // Clear any messages when step changes
    setMessage("");
  }, [name, location, step, onCanProceedChange]);

  // Reset input fields when step changes
  useEffect(() => {
    // Clear the input field when transitioning to a new step
    if (step === 2) {
      // Only reset if we're coming from step 1
      if (!visibleSteps.includes(2)) {
        setLocation("");
      }
    }
  }, [step, visibleSteps]);

  // Update visible steps when step changes
  useEffect(() => {
    // Force re-render of the current step
    setVisibleSteps([step]);
  }, [step]);

  // Ensure visibleSteps includes current step
  useEffect(() => {
    if (!visibleSteps.includes(step)) {
      setVisibleSteps((prev) => [...prev, step]);
    }
  }, [step, visibleSteps]);

  // Transition with fade-out delay - memoized to avoid recreation on each render
  const transitionToStep = useCallback(
    (newStep) => {
      // Clear any messages when transitioning
      setMessage("");

      // First make sure both steps are visible during transition
      setVisibleSteps((prev) => {
        if (!prev.includes(newStep)) {
          return [...prev, newStep];
        }
        return prev;
      });

      // Update internal step if needed
      if (externalStep === undefined) {
        setInternalStep(newStep);
      }

      // Notify parent component about step change
      onStepChange?.(newStep);

      // Remove old steps after fade duration (600ms to ensure smooth transition)
      setTimeout(() => {
        setVisibleSteps([newStep]);
      }, 600);
    },
    [externalStep, onStepChange]
  );

  // Helper functions for step navigation
  const handleNextStep = useCallback(() => {
    transitionToStep(step + 1);
  }, [step, transitionToStep]);

  const handlePrevStep = useCallback(() => {
    transitionToStep(step - 1);
  }, [step, transitionToStep]);

  // Memoize the submit function to avoid recreation on each render
  const handlePhaseOneSubmit = useCallback(async () => {
    if (!name || !location) {
      return; // Don't submit if data is missing
    }

    setIsSubmitting(true);
    setMessage("");
    try {
      const result = await submitPhaseOne(name, location);
      // Only briefly show success message, then clear it
      setMessage(`Phase 1 Success: ${result.message || "Submitted!"}`);
      // Clear success message after a short delay
      setTimeout(() => setMessage(""), 1500);
      handleNextStep();
    } catch (err) {
      // Only show error message if there's an actual error
      setMessage("Phase 1 Error. Try again.");
      // Clear error message after a delay
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, location, handleNextStep]);

  // Expose the submit function to parent component
  useEffect(() => {
    if (typeof onSubmitPhaseOne === "function") {
      // Only set it once to avoid unnecessary re-renders
      const submitFn = () => handlePhaseOneSubmit();
      onSubmitPhaseOne(submitFn);
    }
    // Only run this effect once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageSuccess = () => {
    // Call onFinalSubmit when the image is successfully uploaded
    onFinalSubmit?.();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];
      setIsSubmitting(true);
      setMessage("");

      try {
        // Submit the image to the API
        const result = await submitBase64Image(base64String);
        setMessage(`Image uploaded: ${result.message || "Done!"}`);
        
        // Enable the proceed button
        onCanProceedChange?.(true);
        
        // Navigate to loading page
        onFinalSubmit?.();
        
        // Clear success message after a delay
        setTimeout(() => setMessage(""), 1500);
      } catch (err) {
        console.error("Image upload error:", err);
        setMessage("Image upload failed. Please try again.");
        onCanProceedChange?.(false);
        // Clear error message after a delay
        setTimeout(() => setMessage(""), 3000);
      } finally {
        setIsSubmitting(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="test-form__container">
        <div className="test-form">
          <label className="test-form-label">CLICK TO TYPE</label>
          <div className="test-form__steps-wrapper">
            {/* Step 1 */}
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
                {/* Buttons removed */}
              </div>
            )}

            {/* Step 2 */}
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
                {/* Buttons removed */}
              </div>
            )}

            {/* Step 3 */}
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
                />
              </div>
            )}
          </div>

          {message && <p className="test-form__message">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default TestForm;
