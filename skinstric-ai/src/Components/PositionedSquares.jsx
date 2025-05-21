import React, { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import RotatingSquare from "../UI/Animations/RotatingSquare";
import NavigationButton from "./NavigationButton";

const PositionedSquares = ({
  showLeft,
  showRight,
  showCenter,
  showNextButton,
  showBackButton,
  onNext,
  onBack,
  onHoverDirectionChange,
  hoverState,
  nextButtonFadeOut,
  nextButtonLabel,
  backButtonLabel,
}) => {
  const { viewport } = useThree();
  const location = useLocation();

  const [positions, setPositions] = useState({
    left: [-7.29, 0, 0],
    right: [7.29, 0, 0],
    center: [0, 0, 0],
  });

  useEffect(() => {
    setPositions({
      left: [-viewport.width / 2, 0, 0],
      right: [viewport.width / 2, 0, 0],
      center: [0, 0, 0],
    });
  }, [viewport.width]);

  const labels = {
    "/discover": { center: "DISCOVER" },
    "/": { center: "WELCOME" },
    "/test": { center: "TESTING" },
    "/loading": { center: "" },
    "/analysis": { center: "ANALYSIS" },
  };

  const page = labels[location.pathname] || {};
  const centerLabel = page.center || "";

  return (
    <>
      {showLeft && (
        <RotatingSquare
          position={positions.left}
          fadeOut={hoverState === "left" && location.pathname === "/"}
        />
      )}
      {showRight && <RotatingSquare position={positions.right} reverse />}
      {showCenter && (
        <>
          {/* Larger square with half opacity behind */}
          <RotatingSquare
            position={positions.center}
            scale={1.2}
            opacity={0.5}
            zIndex={4}
            reverse={true}
          />
          {/* Original square on top */}
          <RotatingSquare
            position={positions.center}
            hoverLabel={centerLabel}
            zIndex={5}
          />
        </>
      )}
      {showBackButton && (
        <NavigationButton
          position={[positions.left[0] + 1.5, 0, 0]}
          buttonType="back"
          onButtonClick={onBack}
          onHoverDirectionChange={onHoverDirectionChange}
          fadeOut={hoverState === "left" && location.pathname === "/"}
          customLabel={backButtonLabel}
        />
      )}
      {showNextButton && (
        <NavigationButton
          position={[positions.right[0] - 1.5, 0, 0]}
          buttonType="next"
          onButtonClick={onNext}
          onHoverDirectionChange={onHoverDirectionChange}
          fadeOut={nextButtonFadeOut}
          customLabel={nextButtonLabel}
        />
      )}
    </>
  );
};

export default PositionedSquares;
