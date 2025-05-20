import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ImageOptionsThreeJS = ({ leftIconPos, rightIconPos, onHoverLeft, onHoverRight }) => {
  const mountRef = useRef(null);
  const [hovered, setHovered] = useState({ left: false, right: false });

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, width, height, 0, 1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Line material
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });

    // Geometry for left line
    const leftPoints = [
      new THREE.Vector3(leftIconPos.x, leftIconPos.y, 0),
      new THREE.Vector3(leftIconPos.x + 100, leftIconPos.y + 30, 0),
    ];
    const leftGeometry = new THREE.BufferGeometry().setFromPoints(leftPoints);
    const leftLine = new THREE.Line(leftGeometry, material);
    leftLine.visible = false;
    scene.add(leftLine);

    // Geometry for right line
    const rightPoints = [
      new THREE.Vector3(rightIconPos.x, rightIconPos.y, 0),
      new THREE.Vector3(rightIconPos.x - 100, rightIconPos.y - 30, 0),
    ];
    const rightGeometry = new THREE.BufferGeometry().setFromPoints(rightPoints);
    const rightLine = new THREE.Line(rightGeometry, material);
    rightLine.visible = false;
    scene.add(rightLine);

    // Animation variables
    let leftDrawProgress = 0;
    let rightDrawProgress = 0;
    let leftAnimating = false;
    let rightAnimating = false;

    // Animate line drawing once
    function animate() {
      requestAnimationFrame(animate);

      if (leftAnimating && leftDrawProgress < 1) {
        leftDrawProgress += 0.02;
        const leftDrawPoints = [
          leftPoints[0],
          new THREE.Vector3(
            leftPoints[0].x + (leftPoints[1].x - leftPoints[0].x) * leftDrawProgress,
            leftPoints[0].y + (leftPoints[1].y - leftPoints[0].y) * leftDrawProgress,
            0
          ),
        ];
        leftGeometry.setFromPoints(leftDrawPoints);
        leftLine.visible = true;
      } else if (leftDrawProgress >= 1) {
        leftAnimating = false;
      }

      if (rightAnimating && rightDrawProgress < 1) {
        rightDrawProgress += 0.02;
        const rightDrawPoints = [
          rightPoints[0],
          new THREE.Vector3(
            rightPoints[0].x + (rightPoints[1].x - rightPoints[0].x) * rightDrawProgress,
            rightPoints[0].y + (rightPoints[1].y - rightPoints[0].y) * rightDrawProgress,
            0
          ),
        ];
        rightGeometry.setFromPoints(rightDrawPoints);
        rightLine.visible = true;
      } else if (rightDrawProgress >= 1) {
        rightAnimating = false;
      }

      renderer.render(scene, camera);
    }

    animate();

    // Hover handlers
    function onMouseMove(event) {
      const rect = mountRef.current.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = rect.height - (event.clientY - rect.top);

      // Simple hit test for left icon area
      if (
        mouseX > leftIconPos.x - 40 &&
        mouseX < leftIconPos.x + 40 &&
        mouseY > leftIconPos.y - 40 &&
        mouseY < leftIconPos.y + 40
      ) {
        if (!hovered.left) {
          setHovered((prev) => ({ ...prev, left: true }));
          leftAnimating = true;
          leftDrawProgress = 0;
          leftLine.visible = true;
          onHoverLeft && onHoverLeft(true);
        }
      } else {
        if (hovered.left) {
          setHovered((prev) => ({ ...prev, left: false }));
          onHoverLeft && onHoverLeft(false);
        }
      }

      // Simple hit test for right icon area
      if (
        mouseX > rightIconPos.x - 40 &&
        mouseX < rightIconPos.x + 40 &&
        mouseY > rightIconPos.y - 40 &&
        mouseY < rightIconPos.y + 40
      ) {
        if (!hovered.right) {
          setHovered((prev) => ({ ...prev, right: true }));
          rightAnimating = true;
          rightDrawProgress = 0;
          rightLine.visible = true;
          onHoverRight && onHoverRight(true);
        }
      } else {
        if (hovered.right) {
          setHovered((prev) => ({ ...prev, right: false }));
          onHoverRight && onHoverRight(false);
        }
      }
    }

    mountRef.current.addEventListener('mousemove', onMouseMove);

    // Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      mountRef.current.removeEventListener('mousemove', onMouseMove);
      scene.clear();
      renderer.dispose();
    };
  }, [leftIconPos, rightIconPos, hovered.left, hovered.right, onHoverLeft, onHoverRight]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    />
  );
};

export default ImageOptionsThreeJS;
