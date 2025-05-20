import React from "react";

const RadioSelectorActive = ({ className }) => {
  return (
    <svg
      className={`radio-selector-active ${className || ""}`}
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.293 6L6 11.293L0.707031 6L6 0.707031L11.293 6Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
      />
    </svg>
  );
};

export default RadioSelectorActive;
