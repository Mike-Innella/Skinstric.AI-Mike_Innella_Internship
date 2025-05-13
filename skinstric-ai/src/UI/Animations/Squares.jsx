import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useEffect, useState } from "react";
import HoverPulse from './HoverPulse';

const DottedSquare = ({ position, reverse }) => {
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += reverse ? -0.001 : 0.001;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        rotation={[0, 0, Math.PI / 4]}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#1a1b1c" wireframe />
      </mesh>
      <HoverPulse position={[0, 0, -0.1]} isHovered={isHovered} />
    </group>
  );
};

const PositionedSquares = () => {
  const { viewport } = useThree();
  const [positions, setPositions] = useState({ left: [-7.29, 0, 0], right: [7.29, 0, 0] });

  useEffect(() => {
    const leftPos = [-viewport.width / 2, 0, 0];
    const rightPos = [viewport.width / 2, 0, 0];
    
    setPositions({ left: leftPos, right: rightPos });
  }, [viewport.width]);

  return (
    <>
      <DottedSquare position={positions.left} />
      <DottedSquare position={positions.right} reverse />
    </>
  );
};

const Squares = () => (
  <Canvas>
    <PositionedSquares />
  </Canvas>
);

export default Squares;