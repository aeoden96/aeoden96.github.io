import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import perlinFragmentShader from "../../shaders/perlin";
import { getGlowCirclesShader } from "../../shaders/glow_circles";

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const getShader = (shader: string, step?: number) => {
  return {
    perlin: perlinFragmentShader,
    glow_circles: getGlowCirclesShader(step ?? 19),
  }[shader];
};

function ShaderPlane({ shader, step }: { shader: string; step?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const fragmentShader = getShader(shader, step);

  // Create shader material with uniforms
  const material = useRef(
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(size.width * 2, size.height * 2),
        },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    })
  );

  // Update time uniform on each frame
  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  // Update resolution when canvas size changes
  useThree(({ size }) => {
    if (material.current) {
      material.current.uniforms.uResolution.value.set(
        size.width * 2,
        size.height * 2
      );
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material.current} attach="material" />
    </mesh>
  );
}

type Props = {
  shader: string;
  step?: number;
};

export default function FragmentViewerThreeJS({ shader, step }: Props) {
  if (!getShader(shader, step)) {
    console.error("Shader not found");
    return null;
  }

  return (
    <div className="fragment-viewer-container aspect-square w-full h-[600px] my-4 rounded-md shadow-lg overflow-hidden">
      <Canvas
        className="fragment-viewer-canvas aspect-square w-full h-full"
        gl={{ antialias: true, alpha: false }}
        orthographic
        camera={{ zoom: 50, position: [23, 0, 100] }}
      >
        <ShaderPlane shader={shader} step={step} />
      </Canvas>
    </div>
  );
}
