// BorderSquares.jsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import "../Styles/BorderSquares.css";

// Reusable dotted square component with position offset
const DottedSquare = ({ position = [0, 0, 0], reverse = false }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      const t = performance.now() * 0.0001;
      const direction = reverse ? -1 : 1;
      ref.current.rotation.z = direction * t * 0.15;
      const scale = 1 + Math.sin(t * 2) * 0.005;
      ref.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group ref={ref} position={position}>
      <Html
        transform
        style={{
          transform: "translate(-50%, -50%)",
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        <div className="dotted-square" />
      </Html>
    </group>
  );
};

export default function BorderSquares() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 100 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 100,
        width: "100vw",
        height: "100vh",
      }}
    >
      <DottedSquare position={[-7.29, 0, 0]} />
      <DottedSquare position={[7.29, 0, 0]} reverse />
    </Canvas>
  );
}
