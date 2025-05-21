import React from "react";

const BracketLeft = ({ className }) => {
  return (
    <svg
      className={`bracket-left ${className || ""}`}
      fill="none"
      height="18"
      viewBox="0 0 4 18"
      width="4"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M3.5 0.5V17.5H0.5"
        stroke="#1A1B1C"
      />
    </svg>
  );
};

export default BracketLeft;
