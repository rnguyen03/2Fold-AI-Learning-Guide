import { View, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function ThreeSetup() {
  return (
    <Canvas>
      <View.Port />
      <Preload all />
    </Canvas>
  );
}
