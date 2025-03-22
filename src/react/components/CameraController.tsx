import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import type { Entity } from "../state";

interface CameraControllerProps {
  target: Entity["position"];
  offset?: {
    x: number;
    y: number;
    z: number;
  };
  lerp?: number;
}

export function CameraController({
  target,
  offset = { x: 0, y: 5, z: 5 }, // Default camera position above and behind player
  lerp = 0.1, // Smoothing factor (0-1)
}: CameraControllerProps) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());

  useFrame(() => {
    // Calculate target position with offset
    targetRef.current.set(
      target.x + offset.x,
      target.y + offset.y,
      target.z + offset.z
    );

    // Smoothly move camera to target (lerp)
    camera.position.lerp(targetRef.current, lerp);

    // Look at player position
    camera.lookAt(target.x, target.y, target.z);
  });

  return null; // This component doesn't render anything
}
