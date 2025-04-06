import Geo from "./Geo";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Effects } from "@react-three/drei";

export default function GeoCanvas() {
  return (
    <Canvas
      shadows
      // dpr={[1, 2]}
      camera={{ position: [0, 0, 5], far: 1000 }}
      // gl={{
      //   powerPreference: "low-power",
      //   alpha: false,
      //   antialias: false,
      //   stencil: false,
      //   depth: false,
      // }}
      onCreated={({ gl }) => gl.setClearColor("#00000000")}
    >
      <pointLight position={[-10, -10, -10]} intensity={1} />
      <ambientLight intensity={0.4} />
      <spotLight
        castShadow
        angle={0.3}
        penumbra={1}
        position={[0, 10, 20]}
        intensity={5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Suspense fallback={null}>
        <Geo />
      </Suspense>

      <Effects />
    </Canvas>
  );
}
