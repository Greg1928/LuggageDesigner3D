import { useRef } from "react";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SuitcaseModel } from "./SuitcaseModel";

export function Experience() {
  const groupRef = useRef<THREE.Group>(null);
  
  return (
    <>
      {/* Clean white background like in the reference image */}
      <color attach="background" args={["#ffffff"]} />
      
      {/* Softer lighting for a cleaner look */}
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.3} 
      />
      
      {/* Environment and subtle shadows */}
      <Environment preset="city" />
      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.3}  // Lighter shadow
        scale={10}
        blur={3}
        far={4}
      />
      
      {/* 3D Model - centered and slightly elevated */}
      <group ref={groupRef} position={[0, -0.9, 0]} rotation={[0, Math.PI / 8, 0]}>
        <SuitcaseModel />
      </group>
      
      {/* Controls - more limited to match the reference image view */}
      <OrbitControls 
        makeDefault
        enablePan={false}  // Disable panning for a more controlled view
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={Math.PI / 4}  // More limited vertical rotation
        maxPolarAngle={Math.PI / 2.2}
        minDistance={4}  // Keep minimum distance to prevent getting too close
        maxDistance={8}  // Limit maximum distance
        // Set initial rotation to match reference image
        target={[0, 0, 0]}
      />
    </>
  );
}
