import React from "react";

const BracketRight = ({ className }) => {
  return (
    <svg
      className={`bracket-right ${className || ""}`}
      fill="none"
      height="18"
      viewBox="0 0 4 18"
      width="4"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M0.5 0.5V17.5H3.5"
        stroke="#1A1B1C"
      />
    </svg>
  );
};

export default BracketRight;
