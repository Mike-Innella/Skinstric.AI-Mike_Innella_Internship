import React from "react";
import RadioSelector from "../SVG/RadioSelector";
import RadioSelectorActive from "../SVG/RadioSelectorActive";

const ConfidenceTable = ({ 
  confidenceData, 
  selectedAge, 
  onAgeSelection,
  className = "" 
}) => {
  // Define age ranges
  const ageRanges = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70+"];

  return (
    <div className={`confidence-table ${className}`}>
      <div className="confidence-table__rectangle"></div>
      <div className="confidence-table__header">
        <div className="confidence-table__title">RACE</div>
        <div className="confidence-table__title confidence-table__title--right">A. I. CONFIDENCE</div>
      </div>
      
      {ageRanges.map((range) => {
        const isSelected = selectedAge === range;
        const isHighestConfidence = confidenceData[range] === Math.max(...Object.values(confidenceData));
        const rowClass = isSelected 
          ? "confidence-table__row confidence-table__row--selected" 
          : isHighestConfidence 
            ? "confidence-table__row confidence-table__row--highest" 
            : "confidence-table__row";
            
        return (
          <div 
            key={range} 
            className={rowClass}
            onClick={() => onAgeSelection(range)}
          >
            <div className="confidence-table__row-content">
              <div className="confidence-table__selector">
                {isSelected || isHighestConfidence ? <RadioSelectorActive /> : <RadioSelector />}
              </div>
              <div className="confidence-table__range">{range}</div>
              <div className="confidence-table__value">{confidenceData[range]} %</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConfidenceTable;
