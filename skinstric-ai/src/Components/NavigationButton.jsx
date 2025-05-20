import React, { useState, useRef } from "react";
import { Html } from "@react-three/drei";
import { useLocation } from "react-router-dom";
import { RiArrowDropLeftFill, RiArrowDropRightFill } from "react-icons/ri";
import "../UI/Styles/PageBoxes.css";

const NavigationButton = ({
  position,
  buttonType = "next",
  onButtonClick,
  onHoverDirectionChange,
  fadeOut = false,
  customLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef();
  const location = useLocation();

  const labels = {
    "/discover": { next: "START", back: "", center: "" },
    "/": { next: "TAKE TEST", back: "DISCOVER A. I.", center: "" },
    "/test": { next: "PROCEED", back: "BACK", center: "TESTING" },
    "/analysis": { next: "", back: "BACK", center: "ANALYSIS" },
  };

  const page = labels[location.pathname] || {};
  const pageClass = location.pathname.replace("/", "");
  const hoverText =
    customLabel || (buttonType === "next" ? page.next : page.back);

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

export default NavigationButton;
