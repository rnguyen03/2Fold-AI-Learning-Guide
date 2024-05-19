"use client";
import { View, OrbitControls } from "@react-three/drei";
import ThreeCommon from "./ThreeCommon";
import { Rabbit } from "@/app/explore/Models";

export default function ThreeRabbit() {
  return (
    <View className="absolute top-0 left-0 w-full h-full break-words">
      <ThreeCommon color="" />
      <Rabbit scale={1.7} position={[2, -1.6, 0]} />
      <OrbitControls />
    </View>
  );
}
