import { View, OrbitControls } from "@react-three/drei";
import ThreeCommon from "./ThreeCommon";
import { Tiger } from "@/app/explore/Models";

export default function ThreeTiger() {
  return (
    <View className="absolute top-0 left-0 w-full h-full break-words">
      <ThreeCommon color="" />
      <Tiger scale={2} position={[0, -1.6, 0]} />
      <OrbitControls />
    </View>
  );
}
