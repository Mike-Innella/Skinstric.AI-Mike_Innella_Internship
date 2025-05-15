import React, { useRef } from "react";
import { Html, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import "../Styles/Pages/MainPage.css";

export default function FloatingHeader({ align = "center" }) {
  const textRef = useRef();
  const targetX = align === "left" ? -2 : 0; // adjust offset based on your layout

  useFrame(() => {
    if (!textRef.current) return;
    // Smoothly interpolate toward targetX
    textRef.current.position.x += (targetX - textRef.current.position.x) * 0.1;
  });

  return (
    <Text
      ref={textRef}
      textAlign={align}
      position={[0, 1, 0]} // starting position
      anchorX="center"
      anchorY="middle"
    >
      <Html>
        <div
          className={`main__page--header-wrapper ${
            align === "left" ? "header-left" : "header-center"
          }`}
        >
          <h1 className="main__page--header">
            Sophisticated <br />
            <span className="page--header-sub">skincare</span>
          </h1>
        </div>
      </Html>
    </Text>
  );
}
