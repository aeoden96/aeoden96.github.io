import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OUTER_RADIUS, PlayerMovement, type Entity } from "../state";
import { useKeyboardControls } from "@react-three/drei";
import type { Controls } from "../TestComponent";

// Define movement speed
const MOVEMENT_SPEED = 0.005;

export function usePlayerMovement(
  initialPosition: Entity["position"] = { phi: 0, r: OUTER_RADIUS, y: 0 }
) {
  // Track position as state
  const [position, setPosition] = useState<Entity["position"]>(initialPosition);
  const [movementType, setMovementType] = useState<PlayerMovement>(
    PlayerMovement.IDLE
  );

  const forwardPressed = useKeyboardControls<Controls>(
    (state) => state.forward
  );

  const backwardPressed = useKeyboardControls<Controls>((state) => state.back);

  const leftPressed = useKeyboardControls<Controls>((state) => state.left);

  const rightPressed = useKeyboardControls<Controls>((state) => state.right);

  useFrame(() => {
    // console.log(leftPressed);
    if (forwardPressed) {
      setPosition((prev) => ({ ...prev, r: prev.r - MOVEMENT_SPEED }));
      // setMovementType(PlayerMovement.WALK_FORWARD);
    } else if (backwardPressed) {
      setPosition((prev) => ({ ...prev, r: prev.r + MOVEMENT_SPEED }));
      // setMovementType(PlayerMovement.WALK_BACKWARD);
    } else if (leftPressed) {
      setPosition((prev) => ({ ...prev, phi: prev.phi + MOVEMENT_SPEED }));
      setMovementType(PlayerMovement.WALK_LEFT);
    } else if (rightPressed) {
      setPosition((prev) => ({ ...prev, phi: prev.phi - MOVEMENT_SPEED }));
      setMovementType(PlayerMovement.WALK_RIGHT);
    } else {
      setMovementType(PlayerMovement.IDLE);
    }
  });

  return { position, setPosition, movementType };
}
