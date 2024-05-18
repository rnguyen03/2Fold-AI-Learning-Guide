"use client";
import { useState, useRef } from "react";
import { Canvas, addEffect } from "@react-three/fiber";
import {
  View,
  Preload,
  OrbitControls,
  PerspectiveCamera,
  CameraShake,
  PivotControls,
  Environment,
  Center,
} from "@react-three/drei";
import { Rabbit, Tiger } from "./Models";

export function App() {
  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div className="text">
          <View className="absolute top-0 left-0 w-full h-full break-words">
            <Common color="" />
            <Rabbit scale={2} position={[0, -1.6, 0]} />
            {/* <OrbitControls /> */}
          </View>
          <View className="absolute top-0 left-0 w-full h-full break-words">
            <Common color="lightpink" />
            <Tiger scale={2} position={[0, -1.6, 0]} />
            {/* <OrbitControls /> */}
          </View>
        </div>
        <Canvas>
          <View.Port />
          <Preload all />
        </Canvas>
      </div>
    </>
  );
}

function Common({ color }) {
  return (
    <>
      {color && <color attach="background" args={[color]} />}
      <ambientLight intensity={0.5} />
      <pointLight position={[20, 30, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="blue" />
      <Environment preset="dawn" />
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
    </>
  );
}
