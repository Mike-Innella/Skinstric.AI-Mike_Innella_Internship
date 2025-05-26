import React from "react";

const MobileDropdown = ({ 
  options = [], 
  selectedValue, 
  onValueChange, 
  dataType, 
  placeholder = "Select an option" 
}) => {
  const handleChange = (event) => {
    const value = event.target.value;
    if (value && onValueChange) {
      onValueChange(value, dataType);
    }
  };

  return (
    <div className="mobile-dropdown">
      <select 
        className="mobile-dropdown__select"
        value={selectedValue || ""}
        onChange={handleChange}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map(({ key, value: confidence }) => (
          <option key={key} value={key}>
            {key} ({confidence}%)
          </option>
        ))}
      </select>
    </div>
  );
};

export default MobileDropdown;
