
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

type PlaneProps = {
  clicked: boolean,
  position: [number, number, number],
  scale: number,
};

function SmallBlob(props: PlaneProps) {
  const ref: any = useRef();

  // animate
  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;

    if (props.clicked) {
      ref.current.scale.x += 0.01;
      ref.current.scale.y += 0.01;
      ref.current.scale.z += 0.01;
    }
  })



  const rand = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  }

  
  return (
    <mesh
      position={props.position}
      ref={ref}
      onPointerOut={(event) => {}}>
      <sphereGeometry args={[props.scale, rand(3, 8)]} />
      <meshNormalMaterial 
        flatShading={true}
      />
    </mesh>
  )
}

export default SmallBlob;