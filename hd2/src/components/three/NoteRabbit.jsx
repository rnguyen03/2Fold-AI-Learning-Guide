import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { RabbitRabbit } from "@/app/explore/Models"; // Make sure the import path is correct

export default function NoteRabbit({ cursorPosition }) {
  const rabbitRef = useRef();

  // useFrame(() => {
  //   if (rabbitRef.current) {
  //     // Convert cursor position to normalized device coordinates (-1 to +1)
  //     const x = -(cursorPosition.x / window.innerWidth) * 2 - 1;
  //     // rabbitRef.current.position.x = x * 5; // Adjust multiplier as needed
  //     // rabbitRef.current.position.y = y * 5; // Adjust multiplier as needed
  //   }
  // });

  return (
    <>
      <RabbitRabbit ref={rabbitRef} scale={3} position={[-0.5, -1.6, 0]} />
      <OrbitControls />
    </>
  );
}
