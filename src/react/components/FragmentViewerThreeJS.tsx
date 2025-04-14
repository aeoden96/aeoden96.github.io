import React, {
  useRef,
  useState,
  useEffect,
  type RefObject,
  type DragEventHandler,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import perlinFragmentShader from "../../shaders/perlin";
import { getGlowCirclesShader } from "../../shaders/glow_circles";
import { getRaymarchingShader } from "../../shaders/raymarching";

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const getShader = (shader: string, step?: number) => {
  return {
    perlin: perlinFragmentShader,
    glow_circles: getGlowCirclesShader(step ?? 19),
    raymarching: getRaymarchingShader(step ?? 13),
  }[shader];
};

function ShaderPlane({ shader, step }: { shader: string; step?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const fragmentShader = getShader(shader, step);

  const material = useRef(
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uResolution: {
          value: new THREE.Vector2(size.width, size.height),
        },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    })
  );

  useEffect(() => {
    let isDragging = false;

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      if (material.current) {
        const x = event.clientX;
        const y = event.clientY;
        const z = 0;
        material.current.uniforms.uMouse.value.set(x, y, z);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !material.current) return;

      // Update coordinates only when dragging
      const x = event.clientX;
      const y = event.clientY;
      const z = 0;
      material.current.uniforms.uMouse.value.set(x, y, z);
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Update time uniform on each frame
  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  // Update resolution when canvas size changes
  useThree(({ size }) => {
    if (material.current) {
      material.current.uniforms.uResolution.value.set(size.width, size.height);
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
  isClickable?: boolean;
};

export default function FragmentViewerThreeJS({
  shader,
  step,
  isClickable = false,
}: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Consider visible when at least 10% is in view
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  if (!getShader(shader, step)) {
    console.error("Shader not found");
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fragment-viewer-container aspect-square w-full h-[600px] my-4 rounded-md shadow-lg overflow-hidden relative"
    >
      {isVisible && (
        <Canvas
          onDrag={(e) => {}}
          className="fragment-viewer-canvas aspect-square w-full h-full"
          gl={{ antialias: true, alpha: false }}
          orthographic
          camera={{ zoom: 50, position: [0, 0, 100] }}
          frameloop={isVisible ? "always" : "never"}
        >
          <ShaderPlane shader={shader} step={step} />
        </Canvas>
      )}
      {isClickable && (
        <div className="absolute inset-0 flex items-start justify-start p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 9l-3 3 3 3" className="animate-pulse" />
            <path
              d="M17 9l3 3-3 3"
              className="animate-pulse [animation-delay:0.2s]"
            />
            <path
              d="M9 7l3-3 3 3"
              className="animate-pulse [animation-delay:0.4s]"
            />
            <path
              d="M9 17l3 3 3-3"
              className="animate-pulse [animation-delay:0.6s]"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
