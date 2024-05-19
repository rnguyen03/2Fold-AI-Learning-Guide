import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import NoteRabbit from "./NoteRabbit"; // Make sure the import path is correct

export default function NoteSetup({ cursorPosition }) {
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 5]} color = "white" />
      <NoteRabbit cursorPosition={cursorPosition} />
      <Preload all />
    </Canvas>
  );
}
