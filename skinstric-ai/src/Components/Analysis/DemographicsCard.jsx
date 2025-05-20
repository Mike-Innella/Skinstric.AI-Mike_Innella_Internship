import React from "react";

const DemographicsCard = ({ 
  title, 
  value, 
  isActive = false, 
  className = "" 
}) => {
  return (
    <div className={`demographics-card ${isActive ? 'demographics-card--active' : ''} ${className}`}>
      <div className="demographics-card__rectangle"></div>
      <div className="demographics-card__content">
        <div className="demographics-card__value">{value}</div>
        <div className="demographics-card__title">{title}</div>
      </div>
    </div>
  );
};

export default DemographicsCard;
