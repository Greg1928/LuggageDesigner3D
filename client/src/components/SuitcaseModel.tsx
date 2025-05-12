import { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useConfigurator } from "@/lib/stores/useConfigurator";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { setupModelErrorHandling, createFallbackMesh } from "@/lib/setupErrorHandler";

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

export function SuitcaseModel() {
  // Set up error handling for model loading
  setupModelErrorHandling("/models/suitcase.glb");
  
  // State to track if we need to use the fallback model
  const [useFallback, setUseFallback] = useState(false);
  
  // Try to load the model, falling back gracefully if it fails
  const { scene, nodes, materials } = useGLTF("/models/suitcase.glb") as GLTFResult;
  
  // Set up error handler for model loading failures
  useEffect(() => {
    if (!scene) {
      console.warn("Failed to load suitcase model, using fallback");
      setUseFallback(true);
    }
  }, [scene]);
  
  // Get configuration from store
  const { 
    bodyColor, 
    handleColor, 
    zipperColor,
    wheelStyle,
    wheelColor
  } = useConfigurator();
  
  // References to materials for updating
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const handleMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const zipperMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const wheelMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  
  // Reference to the fallback model if needed
  const fallbackRef = useRef<THREE.Group | null>(null);
  const fallbackMaterialsRef = useRef<{
    bodyMaterial?: THREE.MeshStandardMaterial;
    handleMaterial?: THREE.MeshStandardMaterial;
    wheelMaterial?: THREE.MeshStandardMaterial;
    zipperMaterial?: THREE.MeshStandardMaterial;
  }>({});
  
  // Create fallback model if needed
  useEffect(() => {
    if (useFallback && !fallbackRef.current) {
      const sceneObj = new THREE.Scene();
      const result = createFallbackMesh(sceneObj);
      
      if (result) {
        fallbackRef.current = result.group;
        fallbackMaterialsRef.current = {
          bodyMaterial: result.bodyMaterial as THREE.MeshStandardMaterial,
          handleMaterial: result.handleMaterial as THREE.MeshStandardMaterial,
          wheelMaterial: result.wheelMaterial as THREE.MeshStandardMaterial,
          zipperMaterial: result.zipperMaterial as THREE.MeshStandardMaterial
        };
      }
    }
  }, [useFallback]);
  
  // For the real model: clone and prepare materials for modification
  useEffect(() => {
    // Only run this for the real model
    if (useFallback || !materials) return;
    
    try {
      console.log("Setting up materials for the suitcase model");
      
      // Log all available materials for debugging
      const materialNames = Object.keys(materials);
      console.log("Available material keys:", materialNames);
      
      // Map to collect all mesh names and materials for better debugging
      const meshMap = new Map<string, THREE.Mesh>();
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshMap.set(child.name, child);
          console.log(`Mesh: ${child.name}`, {
            position: child.position,
            material: Array.isArray(child.material) 
              ? child.material.map(m => m.name)
              : child.material.name
          });
        }
      });
      
      // Based on the model structure, create our material assignments
      
      // Create a mapping for different parts
      interface PartAssignments {
        bodyMeshes: string[];
        handleMeshes: string[];
        zipperMeshes: string[];
        wheelMeshes: string[];
      }
      
      // Define which meshes belong to which part based on inspection of the model
      // From the logs, we can see the specific mesh names available in your model
      const partMappings: PartAssignments = {
        bodyMeshes: ["Cube228", "Cube228_1"], // Main body parts
        handleMeshes: [], // No handle meshes found yet, will rely on size/position detection
        zipperMeshes: ["Cube228_2"], // Zipper mesh identified from logs
        wheelMeshes: ["Cube228_3"] // Wheel mesh based on position/size
      };
      
      // Create materials for each part
      // We'll use the first available material as a base and then modify it
      if (Object.keys(materials).length > 0) {
        // Pick the first material as a base
        const baseMaterial = Object.values(materials)[0];
        
        // Create a standard material for each part
        const bodyMat = new THREE.MeshStandardMaterial({
          name: 'body-material',
          color: new THREE.Color(bodyColor),
          roughness: 0.7,
          metalness: 0.2
        });
        bodyMaterialRef.current = bodyMat;
        
        const handleMat = new THREE.MeshStandardMaterial({
          name: 'handle-material',
          color: new THREE.Color(handleColor),
          roughness: 0.5,
          metalness: 0.3
        });
        handleMaterialRef.current = handleMat;
        
        const zipperMat = new THREE.MeshStandardMaterial({
          name: 'zipper-material',
          color: new THREE.Color(zipperColor),
          roughness: 0.4,
          metalness: 0.6
        });
        zipperMaterialRef.current = zipperMat;
        
        const wheelMat = new THREE.MeshStandardMaterial({
          name: 'wheel-material',
          color: new THREE.Color(wheelColor),
          roughness: 0.8,
          metalness: 0.4
        });
        wheelMaterialRef.current = wheelMat;
        
        // Based on the logs, we see we have Cube228, Cube228_1, Cube228_2, Cube228_3
        // Let's manually assign materials based on mesh names
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const name = child.name;
            
            // Specific assignments based on mesh names
            if (name === "Cube228") {
              console.log(`Assigning body material to: ${name}`);
              if (Array.isArray(child.material)) {
                child.material = child.material.map(() => bodyMaterialRef.current!);
              } else {
                child.material = bodyMaterialRef.current!;
              }
            }
            else if (name === "Cube228_1") {
              console.log(`Assigning handle material to: ${name}`);
              if (Array.isArray(child.material)) {
                child.material = child.material.map(() => handleMaterialRef.current!);
              } else {
                child.material = handleMaterialRef.current!;
              }
            }
            else if (name === "Cube228_2") {
              console.log(`Assigning zipper material to: ${name}`);
              if (Array.isArray(child.material)) {
                child.material = child.material.map(() => zipperMaterialRef.current!);
              } else {
                child.material = zipperMaterialRef.current!;
              }
            }
            else if (name === "Cube228_3") {
              console.log(`Assigning wheel material to: ${name}`);
              if (Array.isArray(child.material)) {
                child.material = child.material.map(() => wheelMaterialRef.current!);
              } else {
                child.material = wheelMaterialRef.current!;
              }
              
              // Apply wheel style modifications
              applyWheelStyle(child, wheelStyle);
            }
          }
        });
      } else {
        console.warn("No materials found in the model");
        setUseFallback(true);
      }
    } catch (error) {
      console.error("Error setting up suitcase materials:", error);
      setUseFallback(true);
    }
  }, [useFallback, scene, materials, wheelStyle]);
  
  // Combined effect to update all colors when any configuration changes
  useEffect(() => {
    if (useFallback) return;
    
    console.log("Updating colors:", { bodyColor, handleColor, zipperColor, wheelColor });
    
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.color.set(bodyColor);
      bodyMaterialRef.current.needsUpdate = true;
    }
    
    if (handleMaterialRef.current) {
      handleMaterialRef.current.color.set(handleColor);
      handleMaterialRef.current.needsUpdate = true;
    }
    
    if (zipperMaterialRef.current) {
      zipperMaterialRef.current.color.set(zipperColor);
      zipperMaterialRef.current.needsUpdate = true;
    }
    
    if (wheelMaterialRef.current) {
      wheelMaterialRef.current.color.set(wheelColor);
      wheelMaterialRef.current.needsUpdate = true;
    }
  }, [useFallback, bodyColor, handleColor, zipperColor, wheelColor]);
  
  // Update colors for fallback model
  useEffect(() => {
    if (!useFallback) return;
    
    if (fallbackMaterialsRef.current.bodyMaterial) {
      fallbackMaterialsRef.current.bodyMaterial.color.set(bodyColor);
      fallbackMaterialsRef.current.bodyMaterial.needsUpdate = true;
    }
    
    if (fallbackMaterialsRef.current.handleMaterial) {
      fallbackMaterialsRef.current.handleMaterial.color.set(handleColor);
      fallbackMaterialsRef.current.handleMaterial.needsUpdate = true;
    }
    
    if (fallbackMaterialsRef.current.zipperMaterial) {
      fallbackMaterialsRef.current.zipperMaterial.color.set(zipperColor);
      fallbackMaterialsRef.current.zipperMaterial.needsUpdate = true;
    }
    
    if (fallbackMaterialsRef.current.wheelMaterial) {
      fallbackMaterialsRef.current.wheelMaterial.color.set(wheelColor);
      fallbackMaterialsRef.current.wheelMaterial.needsUpdate = true;
    }
  }, [useFallback, bodyColor, handleColor, zipperColor, wheelColor]);
  
  // Function to apply wheel style changes
  const applyWheelStyle = (wheelMesh: THREE.Mesh, style: string) => {
    if (!wheelMesh || !wheelMesh.geometry) return;
    
    switch (style) {
      case 'standard':
        // Default wheel style - reset any modifications
        wheelMesh.scale.set(1, 1, 1);
        break;
        
      case 'sporty':
        // More complex wheels with spokes look
        wheelMesh.scale.set(1, 1, 0.85); // Make slightly thinner
        break;
        
      case 'rugged':
        // Thicker, more robust wheels
        wheelMesh.scale.set(1.15, 1.15, 1.25); // Make thicker
        break;
    }
  };
  
  // Determine what to render based on model availability
  if (useFallback && fallbackRef.current) {
    return <primitive object={fallbackRef.current} scale={1.5} />;
  } else if (!useFallback && scene) {
    // Clone the scene to avoid modifying the cached original
    const clonedScene = scene.clone();
    return <primitive object={clonedScene} scale={1.5} />;
  } else {
    // Render an empty group while loading or if both options fail
    return <group />;
  }
}
