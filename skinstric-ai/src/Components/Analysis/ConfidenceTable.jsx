import React from "react";
import RadioSelector from "../SVG/RadioSelector";
import RadioSelectorActive from "../SVG/RadioSelectorActive";

const ConfidenceTable = ({ 
  confidenceData, 
  selectedValue,
  onValueSelection,
  dataType = "age", // "age", "race", or "gender"
  title = null,
  className = "" 
}) => {
  // Get the appropriate data based on dataType
  const data = confidenceData && confidenceData[dataType] ? confidenceData[dataType] : {};
  
  // Sort data based on dataType
  const sortedData = Object.entries(data)
    .sort((a, b) => {
      // For age, sort by age range numerically (youngest first)
      if (dataType === "age") {
        // Extract the first number from each age range (e.g., "20-29" -> 20)
        const getFirstNumber = (range) => {
          const match = range.match(/^(\d+)/);
          return match ? parseInt(match[1], 10) : 999; // Default to high number if no match
        };
        return getFirstNumber(a[0]) - getFirstNumber(b[0]);
      } 
      // For other types, sort by confidence (highest first)
      return parseFloat(b[1]) - parseFloat(a[1]);
    })
    .map(([key, value]) => ({ key, value }));

  return (
    <div className={`confidence-table ${className}`}>
      <div className="confidence-table__rectangle"></div>
      <div className="confidence-table__header">
        <div className="confidence-table__title">{title || dataType.toUpperCase()}</div>
        <div className="confidence-table__title confidence-table__title--right">A. I. CONFIDENCE</div>
      </div>
      
      {sortedData.map(({ key, value }) => {
        const isSelected = selectedValue === key;
        // Remove the isHighestConfidence logic completely
        const rowClass = isSelected 
          ? "confidence-table__row confidence-table__row--selected" 
          : "confidence-table__row";
            
        return (
          <div 
            key={key} 
            className={rowClass}
            onClick={() => onValueSelection(key, dataType)}
          >
            <div className="confidence-table__row-content">
              <div className="confidence-table__selector">
                {isSelected ? <RadioSelectorActive /> : <RadioSelector />}
              </div>
              <div className="confidence-table__range">{key}</div>
              <div className="confidence-table__value">{value} %</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConfidenceTable;
