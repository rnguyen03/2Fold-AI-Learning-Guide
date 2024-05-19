"use client";

import { Environment, PerspectiveCamera } from "@react-three/drei";

export default function ThreeCommon({ color }) {
  return (
    <>
      {color && <color attach="background" args={[color]} />}
      <ambientLight intensity={0.5} />
      <pointLight position={[20, 30, 10]} intensity={1} />
      <pointLight position={[20, 30, -10]} intensity={1} />
      <Environment preset="dawn" />
      <PerspectiveCamera makeDefault fov={40} position={[10, 0, 0]} />
    </>
  );
}
