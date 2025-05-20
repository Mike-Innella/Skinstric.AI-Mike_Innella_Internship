import React from "react";

const ProgressCircle = ({ className, percentage = 0 }) => {
  // Calculate the circumference of the circle
  const radius = 192; // Half of the viewBox width/height (384/2)
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke-dasharray and stroke-dashoffset
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      className={`progress-circle ${className || ""}`}
      fill="none"
      height="384"
      viewBox="0 0 384 384"
      width="384"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <path 
        d="M192 1.5C217.017 1.5 241.789 6.42743 264.901 16.001C288.014 25.5745 309.014 39.6066 326.704 57.2962C344.393 74.9857 358.426 95.9863 367.999 119.099C377.573 142.211 382.5 166.983 382.5 192C382.5 217.017 377.573 241.789 367.999 264.901C358.426 288.014 344.393 309.014 326.704 326.704C309.014 344.393 288.014 358.426 264.901 367.999C241.789 377.573 217.017 382.5 192 382.5C166.983 382.5 142.211 377.573 119.099 367.999C95.9862 358.425 74.9857 344.393 57.2961 326.704C39.6065 309.014 25.5744 288.014 16.0009 264.901C6.4274 241.789 1.49999 217.017 1.5 192C1.50001 166.983 6.42745 142.211 16.001 119.099C25.5745 95.9862 39.6067 74.9856 57.2962 57.2961C74.9858 39.6065 95.9864 25.5744 119.099 16.0009C142.211 6.4274 166.983 1.49998 192 1.5L192 1.5Z" 
        stroke="#C1C2C3" 
        strokeWidth="3"
      />
      
      {/* Progress arc */}
      <circle
        cx="192"
        cy="192"
        r="190.5"
        stroke="#1A1B1C"
        strokeWidth="3"
        fill="none"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 192 192)"
      />
    </svg>
  );
};

export default ProgressCircle;
