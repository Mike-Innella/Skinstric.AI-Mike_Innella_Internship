import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import PageBoxes from "../UI/Animations/PageBoxes";
import CornerText from "../Components/CornerText";
import FloatingHeader from "../UI/Animations/FloatingHeader";
import { Canvas } from "@react-three/fiber";

function MainPage() {
  const [hoverState, setHoverState] = useState("center");

  return (
    <>
      <Helmet>
        <title>Main Page | Skinstric.AI</title>
      </Helmet>

      <PageBoxes
        showLeft={true}
        showRight={true}
        showCenter={false}
        showNextButton={true}
        showBackButton={true}
        onHoverDirectionChange={setHoverState}
        hoverState={hoverState}
      />

      <Canvas
        orthographic
        camera={{ zoom: 80, position: [0, 0, 10] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          maxWidth: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <FloatingHeader align={hoverState} />
      </Canvas>

      <CornerText />
    </>
  );
}

export default MainPage;
