import React, { useState } from "react";
import { RiArrowDropLeftFill } from "react-icons/ri";
import "../UI/Styles/PageBoxes.css";
import "../UI/Styles/Components/SimpleBackButton.css";

/**
 * A simplified version of NavigationButton that doesn't use React Three Fiber
 * Specifically for use in regular React components outside of a Canvas
 */
const SimpleBackButton = ({
  onButtonClick,
  customLabel = "BACK",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="simple-back-button"
      onClick={onButtonClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`square__hover-label ${
          isHovered && customLabel ? "visible" : ""
        }`}
      >
        {customLabel}
      </div>
      <div className="square__page-back-border"></div>
      <div className="square__page-back-button">
        <RiArrowDropLeftFill className="square__page-back-button__icon" />
      </div>
    </div>
  );
};

export default SimpleBackButton;
