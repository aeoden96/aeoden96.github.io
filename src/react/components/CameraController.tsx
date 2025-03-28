import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import type { Entity } from "../state";

interface CameraControllerProps {
  target: Entity["position"];
  lerp?: number;
}

export function CameraController({
  target,
  lerp = 1, // Smoothing factor (0-1)
}: CameraControllerProps) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());

  const cameraPosition = {
    x: (target.r + 5) * Math.cos(target.phi),
    y: target.y,
    z: (target.r + 5) * Math.sin(target.phi),
  };

  useFrame(() => {
    targetRef.current.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    // Smoothly move camera to target (lerp)
    camera.position.lerp(targetRef.current, lerp);

    // Look at player position
    camera.lookAt(0, 0, 0);
  });

  return null; // This component doesn't render anything
}
