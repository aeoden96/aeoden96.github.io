import { Canvas } from "@react-three/fiber";
import Player from "./components/Player";
import { OUTER_RADIUS } from "./state";
import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  KeyboardControls,
  type KeyboardControlsEntry,
  useGLTF,
} from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// Tree model component
const TreeModel = ({ position = [0, 0, 0], scale = 0.02 }) => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    // Convert position to fixed array with 3 elements
    const pos: [number, number, number] = [
      typeof position[0] === "number" ? position[0] : 0,
      typeof position[1] === "number" ? position[1] : 0,
      typeof position[2] === "number" ? position[2] : 0,
    ];

    loader.load(
      "/assets/tree.fbx",
      (fbx) => {
        // Successfully loaded
        fbx.scale.set(scale, scale, scale);
        fbx.position.set(pos[0], pos[1], pos[2]);
        fbx.rotation.set(0, 0, 0);

        // Apply some default material if needed
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        setModel(fbx);
      },
      // Progress callback
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // Error callback
      (error: unknown) => {
        console.error("Error loading FBX:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(`Failed to load model: ${errorMessage}`);
      }
    );

    // Cleanup
    return () => {
      if (model) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [position, scale]);

  // Show error if loading failed
  if (error) {
    // Create three.js compatible position vector
    const posVector = new THREE.Vector3(
      typeof position[0] === "number" ? position[0] : 0,
      typeof position[1] === "number" ? position[1] : 0,
      typeof position[2] === "number" ? position[2] : 0
    );

    return (
      <mesh position={posVector}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  // Return nothing until model is loaded
  if (!model) return null;

  return <primitive object={model} />;
};

const GrassMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Animate grass
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  // Create grass shader
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      grassColor: { value: new THREE.Color(0x497c2e) },
      tipColor: { value: new THREE.Color(0x7ea645) },
      noiseScale: { value: 5.0 },
      bladeHeight: { value: 0.4 },
      waveSpeed: { value: 1.5 },
    }),
    []
  );

  // Vertex shader for grass
  const vertexShader = `
    uniform float time;
    uniform float noiseScale;
    uniform float bladeHeight;
    uniform float waveSpeed;
    
    varying vec2 vUv;
    varying float vNoise;
    
    // Simple noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vUv = uv;
      
      // Create noise pattern for variation
      vec2 noiseCoord = position.xy * noiseScale;
      float n = noise(noiseCoord) * 2.0 - 1.0;
      
      // Calculate grass blade displacement
      float windStrength = sin(time * waveSpeed + position.x * 2.0) * 0.1;
      float displacement = n * bladeHeight * (vUv.y * vUv.y);
      
      // Apply displacement along normal for grass-like effect
      vec3 newPosition = position + normal * displacement;
      newPosition.y += windStrength * vUv.y;
      
      vNoise = n;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

  // Fragment shader for grass
  const fragmentShader = `
    uniform vec3 grassColor;
    uniform vec3 tipColor;
    
    varying vec2 vUv;
    varying float vNoise;
    
    void main() {
      // Mix colors based on height (y-coordinate) for natural grass look
      vec3 color = mix(grassColor, tipColor, vUv.y);
      
      // Add slight variation based on noise
      color = mix(color, color * 0.9, vNoise * 0.2);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      side={THREE.DoubleSide}
    />
  );
};

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
}

export default function TestComponent() {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  return (
    <div id="canvas-container" className="w-screen h-screen">
      <img
        src="/assets/origbig.png"
        alt="Player"
        className="w-screen h-screen absolute top-0 left-0d"
      />
      <KeyboardControls map={map}>
        <Canvas>
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshPhongMaterial />
          </mesh>
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 0, 5]} color="red" />

          {/* Tree model instead of sphere */}
          <Suspense fallback={null}>
            <TreeModel position={[0, 0, 0]} />
          </Suspense>

          {/* torus with grass material */}
          <mesh position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry
              args={[OUTER_RADIUS, 1, 32, 100, (Math.PI / 2) * 3]}
            />
            <GrassMaterial />
          </mesh>

          <Player initialPosition={{ phi: 0, r: OUTER_RADIUS, y: 0 }} />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
