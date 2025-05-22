import React, { useEffect, useRef, useState } from "react";
import "../Styles/loadingCanvas.css";

const LoadingCanvas = ({ 
  message = "PREPARING YOUR ANALYSIS...",
  textPosition = "center" // "center" or "below"
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const $ = c.getContext("2d");
    let w = (c.width = window.innerWidth / 1.2);
    let h = (c.height = window.innerHeight / 1.2);
    let cnt = 10;
    let animationFrameId;

    // Clear the canvas
    const clear = () => {
      $.clearRect(0, 0, w, h);
      $.fillStyle = "rgba(252, 252, 252, 1)"; // Match the background color
      $.fillRect(0, 0, w, h);
    };

    // Draw a dotted square
    const drawDottedSquare = (size, rotation, lineWidth = 1, opacity = 1) => {
      $.save();

      // Set up the dotted line style
      $.setLineDash([5, 5]);
      $.lineWidth = lineWidth;
      $.strokeStyle = `rgba(158, 158, 158, ${opacity})`; // Match the dotted border color from PageBoxes.css

      // Translate to center of canvas
      $.translate(c.width / 2, c.height / 2);

      // Rotate
      $.rotate(rotation);

      // Draw the square
      const halfSize = size / 2;
      $.beginPath();
      $.moveTo(-halfSize, -halfSize);
      $.lineTo(halfSize, -halfSize);
      $.lineTo(halfSize, halfSize);
      $.lineTo(-halfSize, halfSize);
      $.closePath();
      $.stroke();

      $.restore();
    };

    // Draw text in the center or below center based on textPosition prop
    const drawText = () => {
      $.save();
      $.font = "16px 'Roobert Trial', sans-serif";
      $.fontWeight = "600";
      $.fillStyle = "var(--color-text-black, #1a1b1c)";
      $.textAlign = "center";
      $.textBaseline = "middle";
      
      // Position text based on textPosition prop
      const xPos = c.width / 2;
      const yPos = textPosition === "below" 
        ? (c.height / 2) + 60 // 60px below center
        : c.height / 2;       // center
        
      $.fillText(message, xPos, yPos);
      $.restore();
    };

    const draw = () => {
      clear();

      // Calculate rotation based on time
      const time = cnt / 25;
      const baseRotation = time * 0.15;

      // Draw three layers of squares with different sizes and rotations
      const baseSize = Math.min(w, h) * 0.3;

      // Outer square (largest)
      drawDottedSquare(baseSize * 1.4, baseRotation, 2, 0.5);

      // Middle square
      drawDottedSquare(baseSize * 1.2, -baseRotation * 0.8, 2, 0.7);

      // Inner square (smallest)
      drawDottedSquare(baseSize, baseRotation * 0.6, 2, 1);

      // Draw the text
      drawText();

      cnt++;
      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      c.width = w = window.innerWidth / 1.2;
      c.height = h = window.innerHeight / 1.2;
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to cancel animation frame and remove event listener
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [message, textPosition]);

  return (
    <div className="loading-container">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default LoadingCanvas;
