import { Canvas } from "@react-three/fiber";
import Player from "./components/Player";

export default function TestComponent() {
  return (
    <div id="canvas-container" className="w-screen h-screen">
      <img
        src="/assets/origbig.png"
        alt="Player"
        className="w-screen h-screen absolute top-0 left-0d"
      />
      <Canvas>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} color="red" />

        <Player initialPosition={{ x: 0, y: 0, z: 1 }} />
      </Canvas>
    </div>
  );
}
