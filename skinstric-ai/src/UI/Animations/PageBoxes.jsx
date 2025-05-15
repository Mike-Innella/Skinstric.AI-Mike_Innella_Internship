import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { RiArrowDropLeftFill, RiArrowDropRightFill } from "react-icons/ri";
import { useFade } from "./FadeWrapper";
import "../Styles/PageBoxes.css";

// === Rotating Dotted Square ===
const RotatingSquare = ({
  position = [0, 0, 0],
  reverse = false,
  hoverLabel = "",
  fadeOut = false,
}) => {
  const ref = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    if (ref.current) {
      const t = performance.now() * 0.0001;
      const direction = reverse ? -1 : 1;
      ref.current.rotation.z = direction * t * 0.15;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Html
        transform
        style={{
          position: "absolute",
          top: "calc(50% + var(--top-offset))",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: fadeOut ? 0 : 1,
          pointerEvents: fadeOut ? "none" : "auto",
          transition: "opacity 600ms ease",
        }}
        prepend
        center
      >
        <div
          className="square"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`square__hover-label ${
              isHovered && hoverLabel ? "visible" : ""
            }`}
          >
            {hoverLabel}
          </div>
        </div>
      </Html>
    </group>
  );
};

// === Navigation Button (Back / Next) ===
const NavigationButton = ({
  position,
  buttonType = "next",
  onButtonClick,
  onHoverDirectionChange,
  fadeOut = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef();
  const location = useLocation();

  const labels = {
    "/discover": { next: "START", back: "", center: "" },
    "/": { next: "TAKE TEST", back: "DISCOVER A. I.", center: "" },
    "/intro": { next: "", back: "BACK", center: "TESTING" },
  };

  const page = labels[location.pathname] || {};
  const pageClass = location.pathname.replace("/", "");
  const hoverText = buttonType === "next" ? page.next : page.back;

  const buttonClass =
    buttonType === "back" ? "square__page-back" : "square__page-next";
  const borderClass =
    buttonType === "back"
      ? "square__page-back-border"
      : "square__page-next-border";
  const buttonElementClass =
    buttonType === "back"
      ? "square__page-back-button"
      : "square__page-next-button";
  const iconClass =
    buttonType === "back"
      ? "square__page-back-button__icon"
      : "square__page-next-button__icon";

  return (
    <group position={position}>
      <Html
        transform
        style={{
          position: "absolute",
          pointerEvents: fadeOut ? "none" : "auto",
          textAlign: "center",
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 600ms ease",
        }}
        prepend
      >
        <div
          ref={buttonRef}
          className={`${buttonClass} ${pageClass}`}
          onClick={onButtonClick}
          onMouseEnter={() => {
            setIsHovered(true);
            onHoverDirectionChange?.(buttonType === "next" ? "left" : "center");
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            onHoverDirectionChange?.("center");
          }}
        >
          <div
            className={`square__hover-label ${
              isHovered && hoverText ? "visible" : ""
            }`}
          >
            {hoverText}
          </div>

          <div className={borderClass}></div>
          <div className={buttonElementClass}>
            {buttonType === "back" ? (
              <RiArrowDropLeftFill className={iconClass} />
            ) : (
              <RiArrowDropRightFill className={iconClass} />
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};

// === Positioned Squares and Arrows ===
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
}) => {
  const { viewport } = useThree();
  const location = useLocation();

  const [positions, setPositions] = useState({
    left: [-7.29, 0, 0],
    right: [7.29, 0, 0],
    center: [0, 0, 0],
  });

  useEffect(() => {
    const leftPos = [-viewport.width / 2, 0, 0];
    const rightPos = [viewport.width / 2, 0, 0];
    const centerPos = [0, 0, 0];

    setPositions({
      left: leftPos,
      right: rightPos,
      center: centerPos,
    });
  }, [viewport.width]);

  const labels = {
    "/discover": { center: "DISCOVER" },
    "/": { center: "WELCOME" },
    "/intro": { center: "TESTING" },
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
        <RotatingSquare
          position={positions.center}
          hoverLabel={centerLabel}
          // ✅ Restored: no fadeOut on center square
        />
      )}

      {showBackButton && (
        <NavigationButton
          position={[
            positions.left[0] + 1.5,
            positions.left[1],
            positions.left[2],
          ]}
          buttonType="back"
          onButtonClick={onBack}
          onHoverDirectionChange={onHoverDirectionChange}
          fadeOut={hoverState === "left" && location.pathname === "/"}
        />
      )}

      {showNextButton && (
        <NavigationButton
          position={[
            positions.right[0] - 1.5,
            positions.right[1],
            positions.right[2],
          ]}
          buttonType="next"
          onButtonClick={onNext}
          onHoverDirectionChange={onHoverDirectionChange}
        />
      )}
    </>
  );
};

// === Main Exported Component ===
export default function PageBoxes({
  showLeft = true,
  showRight = true,
  showCenter = false,
  showNextButton = true,
  showBackButton = true,
  onHoverDirectionChange,
  hoverState,
}) {
  const location = useLocation();
  const { navigateWithFade } = useFade();

  const pages = ["/discover", "/", "/pretest", "/intro"];
  const currentIndex = pages.indexOf(location.pathname);

  const handleNext = () => {
    if (currentIndex < pages.length - 1) {
      navigateWithFade(pages[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      navigateWithFade(pages[currentIndex - 1]);
    }
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
      />
    </Canvas>
  );
}
