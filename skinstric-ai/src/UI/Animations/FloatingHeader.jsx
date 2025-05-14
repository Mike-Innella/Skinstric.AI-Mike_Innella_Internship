import React, { useRef, useEffect } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

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
      fontSize={0.6}
      maxWidth={5}
      lineHeight={1.2}
      textAlign={align}
      position={[0, 1, 0]} // starting position
      anchorX="center"
      anchorY="middle"
    >
      Sophisticated
      {"\n"}
      skincare
    </Text>
  );
}
