import { useRef } from "react";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SuitcaseModel } from "./SuitcaseModel";

export function Experience() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Add a gentle rotation to the suitcase when it's not being controlled
  useFrame((state, delta) => {
    if (groupRef.current && !state.mouse.buttons) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });
  
  return (
    <>
      {/* Lighting */}
      <color attach="background" args={["#f5f5f5"]} />
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.5} 
      />
      
      {/* Environment and shadows */}
      <Environment preset="city" />
      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.75}
        scale={10}
        blur={2.5}
        far={4}
      />
      
      {/* 3D Model */}
      <group ref={groupRef} position={[0, -1, 0]}>
        <SuitcaseModel />
      </group>
      
      {/* Controls */}
      <OrbitControls 
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={10}
      />
    </>
  );
}
