import React from "react";
import { useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import PositionedSquares from "./PositionedSquares";
import { useFade } from "../UI/Animations/FadeWrapper";

const PageBoxes = ({
  showLeft = true,
  showRight = true,
  showCenter = false,
  showNextButton = true,
  showBackButton = true,
  onHoverDirectionChange,
  hoverState,
  onNext,
  onBack,
  nextButtonFadeOut = false,
  nextButtonLabel,
  backButtonLabel,
}) => {
  const location = useLocation();
  const { navigateWithFade } = useFade();

  const pages = ["/discover", "/", "/test"];
  const currentIndex = pages.indexOf(location.pathname);

  const handleNext = () => {
    if (onNext) return onNext();
    if (currentIndex < pages.length - 1)
      navigateWithFade(pages[currentIndex + 1]);
  };

  const handleBack = () => {
    if (onBack) {
      const result = onBack();
      if (result === false) return;
    }
    if (currentIndex > 0) navigateWithFade(pages[currentIndex - 1]);
  };

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 100 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 100,
        width: "100vw",
        height: "100vh",
      }}
    >
      <PositionedSquares
        showLeft={showLeft}
        showRight={showRight}
        showCenter={showCenter}
        showBackButton={showBackButton}
        showNextButton={showNextButton}
        onNext={handleNext}
        onBack={handleBack}
        onHoverDirectionChange={onHoverDirectionChange}
        hoverState={hoverState}
        nextButtonFadeOut={nextButtonFadeOut}
        nextButtonLabel={nextButtonLabel}
        backButtonLabel={backButtonLabel}
      />
    </Canvas>
  );
};

export default PageBoxes;
