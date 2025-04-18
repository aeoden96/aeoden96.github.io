import { OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useState, useEffect } from "react";
import map from "lodash/map";
import flatMap from "lodash/flatMap";
import range from "lodash/range";
import * as THREE from "three";

export default function TicTacToe() {
  const [hoveredBlock, setHoveredBlock] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const blockPositions = flatMap(range(-1, 2), (i) =>
    flatMap(range(-1, 2), (j) =>
      flatMap(range(-1, 2), (k) => ({
        x: i,
        y: j,
        z: k,
      }))
    )
  );

  const [markedBlocks, setMarkedBlocks] = useState<
    {
      x: number;
      y: number;
      z: number;
    }[]
  >([]);

  return (
    <div className="w-full h-[500px]">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {map(blockPositions, (blockPosition) => (
          <RoundedBox
            position={[blockPosition.x, blockPosition.y, blockPosition.z]}
            scale={
              hoveredBlock?.x === blockPosition.x &&
              hoveredBlock?.y === blockPosition.y &&
              hoveredBlock?.z === blockPosition.z
                ? [0.52, 0.52, 0.52]
                : [0.5, 0.5, 0.5]
            }
            radius={0.1}
            smoothness={4}
            onPointerEnter={() => setHoveredBlock(blockPosition)}
            onPointerLeave={() => setHoveredBlock(null)}
            onClick={() => {
              if (
                !markedBlocks.some(
                  (block) =>
                    block.x === blockPosition.x &&
                    block.y === blockPosition.y &&
                    block.z === blockPosition.z
                )
              ) {
                setMarkedBlocks([...markedBlocks, blockPosition]);
              }
            }}
          >
            <meshToonMaterial
              color={
                markedBlocks.some(
                  (block) =>
                    block.x === blockPosition.x &&
                    block.y === blockPosition.y &&
                    block.z === blockPosition.z
                )
                  ? 0xff0000
                  : 0x00ff00
              }
            />
          </RoundedBox>
        ))}

        <OrbitControls />
        <directionalLight position={[0, 2, 3]} intensity={1} />
      </Canvas>
    </div>
  );
}
