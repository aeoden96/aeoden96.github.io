import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { PlayerMovement, type Entity } from "../state";

// Define movement speed
const MOVEMENT_SPEED = 0.1;

// Movement Hook
export function usePlayerMovement(
  initialPosition: Entity["position"] = { x: 0, y: 0, z: 0 }
) {
  // Track position as state
  const [position, setPosition] = useState<Entity["position"]>(initialPosition);
  const [movementType, setMovementType] = useState<PlayerMovement>(
    PlayerMovement.IDLE
  );
  // Track keys pressed
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  // Handle keydown and keyup events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["w", "a", "s", "d"].includes(e.key.toLowerCase())) {
        setKeys((prevKeys) => ({
          ...prevKeys,
          [e.key.toLowerCase()]: true,
        }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["w", "a", "s", "d"].includes(e.key.toLowerCase())) {
        setKeys((prevKeys) => ({
          ...prevKeys,
          [e.key.toLowerCase()]: false,
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Update position based on keys pressed
  useFrame(() => {
    const newPosition: Entity["position"] = { ...position };
    let newMovementType = PlayerMovement.IDLE;

    if (keys.w) newPosition.z -= MOVEMENT_SPEED; // Move forward
    if (keys.s) newPosition.z += MOVEMENT_SPEED; // Move backward
    if (keys.a) {
      newPosition.x -= MOVEMENT_SPEED; // Move left
      newMovementType = PlayerMovement.WALK_LEFT;
    }
    if (keys.d) {
      newPosition.x += MOVEMENT_SPEED; // Move right
      newMovementType = PlayerMovement.WALK_RIGHT;
    }

    setPosition(newPosition);
    setMovementType(newMovementType);
  });

  return { position, setPosition, movementType };
}
