import React from "react";

const DiamondButton = ({ className, direction = "left" }) => {
  return (
    <svg
      className={`diamond-button ${className || ""}`}
      fill="none"
      height="44"
      viewBox="0 0 44 44"
      width="44"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M43.293 22L22 43.293L0.707031 22L22 0.707031L43.293 22Z"
        stroke="#1A1B1C"
      />
      {/* Using Polygon.svg path, adjusted for positioning within diamond */}
      <path
        d={direction === "left" 
          ? "M15.7148 22L25.1434 27.4436V16.5564L15.7148 22Z" 
          : "M28.1426 22L18.714 27.4436V16.5564L28.1426 22Z"}
        fill="#1A1B1C"
      />
    </svg>
  );
};

export default DiamondButton;
