// src/UI/Animations/Borders.jsx

import React from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

// Single square border component
function Border({ position, rotation = [0, 0, 0] }) {
  const texture = useLoader(TextureLoader, "/assets/rectDotted.png"); // Must be in /public/assets

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[6, 6]} /> {/* 600px equivalent square */}
      <meshBasicMaterial map={texture} transparent opacity={1} side={0} />
    </mesh>
  );
}

// Renders two static square borders on left and right
export default function BorderSquares() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 100 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 5,
        opacity: 1,
      }}
    >
      <ambientLight intensity={1} />

      {/* Left square (half offscreen) */}
      <Border position={[-9, 0, 0]} />

      {/* Right square (flipped 180°, half offscreen) */}
      <Border position={[9, 0, 0]} rotation={[0, 0, Math.PI]} />
    </Canvas>
  );
}
