import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

// Custom shader material for cloth animation
const ClothMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.9, 0.9, 0.9),
    amplitude: 0.2,
    frequency: 3.0,
    twistFactor: 0.5,
    pulseFactor: 0.2,
    distortionFactor: 0.3,
  },
  // Vertex shader
  `
    uniform float time;
    uniform float amplitude;
    uniform float frequency;
    uniform float twistFactor;
    uniform float pulseFactor;
    uniform float distortionFactor;
    varying vec2 vUv;
    varying float vElevation;

    // Pseudo-random function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // Simplex-like noise function
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vUv = uv;
      
      // Calculate displacement for cloth effect
      vec3 pos = position;
      
      // Add non-uniform variation based on position
      float noiseVal = noise(pos.xy * 2.0 + time * 0.1) * 0.3 - 0.15;
      float vertexVariation = sin(pos.x * pos.y * 2.0) * 0.1;
      
      // Use different frequencies for each dimension
      float freqX = frequency * (1.0 + 0.2 * sin(pos.y));
      float freqY = frequency * (1.0 + 0.2 * cos(pos.z));
      float freqZ = frequency * (1.0 + 0.2 * sin(pos.x));
      
      float waveX = sin(pos.x * freqX + time) * amplitude;
      float waveY = sin(pos.y * freqY + time) * amplitude;
      float waveZ = sin(pos.z * freqZ + time) * amplitude;
      
      // Apply displacement with different phases for more organic movement
      pos.x += waveX * 0.2 + noiseVal + vertexVariation;
      pos.y += waveY * 0.2 + noiseVal + vertexVariation;
      pos.z += waveZ * 0.2 + noiseVal + vertexVariation;
      
      // POST-PROCESSING EFFECTS
      
      // 1. Twist effect around Y axis
      float angle = length(pos.xz) * twistFactor * sin(time * 0.5);
      float cosA = cos(angle);
      float sinA = sin(angle);
      vec3 twisted = vec3(
        pos.x * cosA - pos.z * sinA,
        pos.y,
        pos.x * sinA + pos.z * cosA
      );
      
      // 2. Pulsation effect (breathing)
      float pulse = 1.0 + sin(time * 2.0) * pulseFactor;
      vec3 pulsed = twisted * pulse;
      
      // 3. Distortion based on noise
      float distortion = noise(pulsed.xy * 3.0 + time * 0.2) * distortionFactor;
      pulsed += normalize(pulsed) * distortion;
      
      // Track elevation for color
      vElevation = waveX + waveY + waveZ + distortion;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pulsed, 1.0);
      gl_PointSize = 2.0;
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      // Gradient color based on elevation
      vec3 colorVariation = vec3(1.0 + vElevation * 0.8, 1.0 + vElevation * 0.4, 1.0 + vElevation);
      gl_FragColor = vec4(color * colorVariation, 1.0);
      
      // Circle pattern for points
      if (length(gl_PointCoord - 0.5) > 0.5) discard;
    }
  `
);

// Register the custom material
extend({ ClothMaterial });

// Add type declaration for the custom material
declare module "@react-three/fiber" {
  interface ThreeElements {
    clothMaterial: {
      ref?: React.RefObject<any>;
      time?: number;
      color?: THREE.Color;
      amplitude?: number;
      frequency?: number;
      twistFactor?: number;
      pulseFactor?: number;
      distortionFactor?: number;
      transparent?: boolean;
      depthWrite?: boolean;
    };
  }
}

export default function Geo() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(undefined);

  // Animate the cloth effect
  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.time += delta * 0.1;
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.01;
    }
  });

  return (
    <points ref={meshRef} position={[1.5, 0, 4.5]}>
      <torusGeometry args={[1.5, 0.9, 64, 128]} />
      <clothMaterial
        ref={materialRef}
        color={new THREE.Color(0.8, 0.8, 1.0)}
        amplitude={0.2}
        frequency={3.0}
        twistFactor={0.5}
        pulseFactor={0.2}
        distortionFactor={0.3}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
