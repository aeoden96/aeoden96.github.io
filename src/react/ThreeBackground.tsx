import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  Group,
  Vector3,
  Euler,
  Object3D,
  Material,
  MeshStandardMaterial,
  Mesh,
} from "three";

interface WaveySurfaceProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  side: "left" | "right";
}

interface PointData {
  position: [number, number, number];
  index: number;
  size: number;
  color: Color;
  emissive: Color;
  emissiveIntensity: number;
  isGridLine: boolean;
  randomFactor: number;
  randomPhase: number;
}

const WaveySurface = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  side = "left",
}: WaveySurfaceProps) => {
  const groupRef = useRef<Group>(null);

  // Grid dimensions
  const cols = 25;
  const rows = 25;
  const width = side === "left" ? -15 : 15;

  // Create grid points with some randomness
  const points: PointData[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Add some randomness to the grid positions
      const jitter = 0.15; // How much to offset points from the perfect grid
      const xOffset = (Math.random() - 0.2) * jitter;
      const zOffset = (Math.random() - 0.2) * jitter;

      const x = (i / cols - 0.5) * width + (xOffset * width) / cols;
      const z = (j / rows - 0.5) * 30 + (zOffset * 30) / rows;

      // Skip some points randomly to create gaps
      if (
        Math.random() < 0.1 &&
        i > 0 &&
        i < cols - 1 &&
        j > 0 &&
        j < rows - 1
      ) {
        continue;
      }

      // Add more variation to create organic feel
      const isEdgePoint =
        i === 0 || j === 0 || i === cols - 1 || j === rows - 1;
      const isMajorGridLine = i % 5 === 0 || j % 5 === 0;

      // Determine point size and color based on position with some randomness
      let size = 0.03 * (0.8 + Math.random() * 0.4); // Random size variation
      let color = new Color(0x0088ff);
      let emissive = new Color(0x00ccff);
      let emissiveIntensity = 1.5;

      if (isEdgePoint) {
        size = 0.05 * (0.9 + Math.random() * 0.2);
        emissiveIntensity = 2.5;
      } else if (isMajorGridLine) {
        size = 0.04 * (0.85 + Math.random() * 0.3);
        color = new Color(0x00314a);
        emissive = new Color(0x00314a);
        emissiveIntensity = 2;
      }

      // Randomly enhance some non-gridline points to create visual interest
      if (!isMajorGridLine && !isEdgePoint && Math.random() < 0.1) {
        size *= 1.5;
        emissiveIntensity *= 1.3;
      }

      points.push({
        position: [x, 0, z] as [number, number, number],
        index: i + j * cols,
        size,
        color,
        emissive,
        emissiveIntensity,
        isGridLine: isMajorGridLine,
        randomFactor: Math.random() * 2.0, // Used for wave height variation
        randomPhase: Math.random() * Math.PI * 2, // Random phase offset
      });
    }
  }

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Animate wave pattern
    const time = clock.getElapsedTime() * 0.25; // Slower animation

    // Update each point's y position for wave effect
    groupRef.current.children.forEach((point, index) => {
      if (index >= points.length) return; // Skip points that were filtered out

      const pointData = points[index];
      const i = index % cols;
      const j = Math.floor(index / cols);

      // Create more chaotic wave pattern
      const baseFrequency = 0.15;
      const frequency1 = baseFrequency + 0.02 * pointData.randomFactor;
      const frequency2 = baseFrequency * 1.7 - 0.01 * pointData.randomFactor;
      const amplitude = 1.1 + 0.3 * pointData.randomFactor;
      const phase = pointData.randomPhase;

      // Different wave patterns for left and right with added complexity
      if (side === "left") {
        point.position.y =
          (Math.sin(i * frequency1 + time + phase) *
            Math.cos(j * frequency1 + time) *
            0.7 +
            Math.sin(i * frequency2 + j * 0.13 + time * 1.3) * 0.3) *
          amplitude;
      } else {
        point.position.y =
          (Math.cos(i * frequency1 + time + phase) *
            Math.sin(j * frequency1 + time) *
            0.7 +
            Math.cos(j * frequency2 + i * 0.13 + time * 1.1) * 0.3) *
          amplitude;
      }

      // Add a second harmonic with a different frequency
      point.position.y +=
        Math.sin(i * 0.3 + j * 0.2 + time * 0.7 + phase) * 0.3 * amplitude;

      // Pulse effect for gridlines
      if (pointData.isGridLine) {
        const mesh = point as Mesh;
        if (mesh.material && mesh.material instanceof MeshStandardMaterial) {
          const pulse =
            Math.sin(time * 1.5 + i * 0.1 + j * 0.1 + phase) * 0.5 + 0.5;
          mesh.material.emissiveIntensity =
            pointData.emissiveIntensity * (0.8 + pulse * 0.4);
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {points.map((point) => (
        <mesh key={point.index} position={point.position}>
          <sphereGeometry args={[point.size, 8, 8]} />
          <meshStandardMaterial
            color={point.color}
            emissive={point.emissive}
            emissiveIntensity={point.emissiveIntensity}
            transparent={true}
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
};

const CameraScroller = () => {
  const { camera } = useThree();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage (0 to 1)
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(scrollY / maxScroll, 1);
      setScrollPosition(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    // Adjust camera z-position based on scroll
    // Starting position is 15, let's move it from 15 to 25 based on scroll
    const zPosition = 15 + scrollPosition * 5;
    camera.position.z = zPosition;
  });

  return null;
};

const ThreeBackground = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    // Initial theme detection
    const checkTheme = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      setIsDarkTheme(isDark);
    };

    // Check theme on mount
    checkTheme();

    // Set up mutation observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Clean up observer on component unmount
    return () => observer.disconnect();
  }, []);

  // Background color based on theme
  const backgroundColor = isDarkTheme ? "#000814" : "#ffffff";
  const fogColor = isDarkTheme ? "#000814" : "#ffffff";

  return (
    <div className="fixed inset-0 w-full h-full z-[-1]">
      <Canvas camera={{ position: [0, 10, 15], fov: 60 }}>
        <CameraScroller />
        <color attach="background" args={[backgroundColor]} />
        <fog attach="fog" args={[fogColor, 15, 35]} />
        <ambientLight intensity={isDarkTheme ? 0.05 : 0.2} />
        <pointLight
          position={[0, 10, 5]}
          intensity={isDarkTheme ? 0.2 : 0.1}
          color={isDarkTheme ? "#013340" : "#4488ff"}
        />
        <WaveySurface
          position={[-15, 2, 4]}
          side="left"
          rotation={[0, 0, Math.PI / 2]}
        />
        <WaveySurface
          position={[15, 2, 4]}
          side="right"
          rotation={[0, 0, Math.PI / 2]}
        />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
