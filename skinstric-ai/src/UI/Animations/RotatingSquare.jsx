import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import "../Styles/PageBoxes.css";

const RotatingSquare = ({
  position = [0, 0, 0],
  reverse = false,
  hoverLabel = "",
  fadeOut = false,
  scale = 0.85,
  opacity = 1,
  zIndex = 5,
}) => {
  const ref = useRef();
  const [isHovered, setIsHovered] = useState(false);

  // Rotation removed as requested

  return (
    <group ref={ref} position={position}>
      <Html
        transform
        style={{
          position: "absolute",
          top: "calc(50% + var(--top-offset))",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity: fadeOut ? 0 : opacity,
          pointerEvents: fadeOut ? "none" : "auto",
          transition: "opacity 600ms ease",
          zIndex: zIndex,
        }}
        prepend
        center
      >
        <div
          className="square"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`square__hover-label ${
              isHovered && hoverLabel ? "visible" : ""
            }`}
          >
            {hoverLabel}
          </div>
        </div>
      </Html>
    </group>
  );
};

export default RotatingSquare;
