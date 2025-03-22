import { Canvas } from "@react-three/fiber";
import Player from "./components/Player";

export default function PlayerExample() {
  return (
    <div id="canvas-container" className="w-full h-full bg-gray-800">
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* Player with a 2D texture that faces the camera */}
        <Player
          position={[0, 0, 0]}
          textureUrl="/textures/player.png"
          scale={2}
        />

        {/* Add some lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Optional: add a simple floor for reference */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
      </Canvas>
    </div>
  );
}
