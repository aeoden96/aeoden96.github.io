import { Billboard, useTexture } from "@react-three/drei";
import { Mesh, Texture, TextureLoader } from "three";
import { useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayerMovement } from "./Movement";
import { ECS, PlayerMovement, type Entity } from "../state";
import { CameraController } from "./CameraController";

interface PlayerProps {
  initialPosition?: Entity["position"];
  scale?: number;
}

function AnimatedSprite({
  spriteSheet,
  movementType,
  columns,
  rows,
  fps = 10,
}: {
  spriteSheet: string;
  columns: number;
  rows: number;
  fps: number;
  movementType: PlayerMovement;
}) {
  const texture = useLoader(THREE.TextureLoader, spriteSheet);
  const spriteRef = useRef<THREE.Sprite>(null);
  const [frame, setFrame] = useState(0);

  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  if (movementType === PlayerMovement.WALK_LEFT) {
    texture.repeat.set(-1 / columns, 1);
  } else if (movementType === PlayerMovement.WALK_RIGHT) {
    texture.repeat.set(1 / columns, 1);
  } else if (movementType === PlayerMovement.IDLE) {
    texture.repeat.set(1 / columns, 1);
  }

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const currentFrame = Math.floor(elapsed * fps) % (columns * rows);

    if (currentFrame !== frame) {
      setFrame(currentFrame);
      if (movementType === PlayerMovement.WALK_RIGHT) {
        const x = currentFrame % columns;
        texture.offset.set(x / columns, -0.05);
      } else if (movementType === PlayerMovement.WALK_LEFT) {
        const x = 6 - (currentFrame % columns);
        texture.offset.set(x / columns, -0.05);
      } else if (movementType === PlayerMovement.IDLE) {
        const x = currentFrame % columns;
        texture.offset.set(x / columns, -0.05);
      }
    }
  });

  return (
    <sprite ref={spriteRef}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}

export default function Player({
  initialPosition = { x: 0, y: 0, z: 0 },
}: PlayerProps) {
  // Use the movement hook to control player position
  const { position, movementType } = usePlayerMovement(initialPosition);

  return (
    <ECS.Entity>
      <CameraController target={position} offset={{ x: 0, y: 0, z: 5 }} />
      <ECS.Component name="position" data={position} />
      <ECS.Component name="health" data={100} />
      <ECS.Component name="three">
        <Billboard
          position={[position.x, position.y, position.z]}
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          <AnimatedSprite
            spriteSheet={
              movementType !== PlayerMovement.IDLE
                ? "/assets/Pink_Monster_Walk_6.png"
                : "/assets/Pink_Monster_Idle_4.png"
            }
            movementType={movementType}
            columns={movementType !== PlayerMovement.IDLE ? 6 : 4}
            rows={1}
            fps={10}
          />
        </Billboard>
      </ECS.Component>
    </ECS.Entity>
  );
}
