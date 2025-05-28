import React from "react";
import ProgressCircle from "../SVG/ProgressCircle";

const ProgressDisplay = ({ 
  percentage, 
  ageRange,
  className = "" 
}) => {
  return (
    <div className={`progress-display ${className}`}>
      <div className="progress-display__rectangle"></div>
      <div className="progress-display__age">Total Confidence</div>
      <div className="progress-display__circle-container">
        <ProgressCircle percentage={percentage} className="progress-display__circle" />
        <div className="progress-display__percentage-container">
          <div className="progress-display__percentage">{Math.floor(percentage * 100)}</div>
          <div className="progress-display__percentage-symbol">%</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDisplay;
