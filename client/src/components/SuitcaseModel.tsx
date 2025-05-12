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
  
  // Set up error handling in case the model fails to load properly
  useEffect(() => {
    if (!scene || !materials) {
      console.warn("Failed to load suitcase model properly, using fallback");
      setUseFallback(true);
    }
  }, [scene, materials]);
  
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
  
  // Setup materials for the model parts
  useEffect(() => {
    // Only run this if we're not using fallback and the scene is loaded
    if (useFallback || !scene) return;
    
    try {
      console.log("Setting up materials for the suitcase model");
      
      // Start with base materials for our four parts - we'll enhance these
      // with the original model's texture maps
      let bodyMaterial: THREE.MeshStandardMaterial;
      let handleMaterial: THREE.MeshStandardMaterial;
      let zipperMaterial: THREE.MeshStandardMaterial;
      let wheelMaterial: THREE.MeshStandardMaterial;
      
      // First try to clone the original materials from the GLB to preserve textures
      if (materials) {
        // Find the main material used in the model
        const mainMaterial = materials["STCGE5VWEWTRJHQY"];
        const wheelsMaterial = materials["STCGE5VWEWTRJHQY.001"] || mainMaterial;
        
        if (mainMaterial instanceof THREE.MeshStandardMaterial) {
          // Create new materials based on the original ones to keep all textures
          bodyMaterial = mainMaterial.clone();
          bodyMaterial.name = "body-material";
          bodyMaterial.color.set(bodyColor);
          
          handleMaterial = mainMaterial.clone();
          handleMaterial.name = "handle-material";
          handleMaterial.color.set(handleColor);
          
          zipperMaterial = mainMaterial.clone();
          zipperMaterial.name = "zipper-material";
          zipperMaterial.color.set(zipperColor);
          
          if (wheelsMaterial instanceof THREE.MeshStandardMaterial) {
            wheelMaterial = wheelsMaterial.clone();
          } else {
            wheelMaterial = mainMaterial.clone();
          }
          wheelMaterial.name = "wheel-material";
          wheelMaterial.color.set(wheelColor);
        } else {
          // Fallback if the original material isn't a MeshStandardMaterial
          bodyMaterial = new THREE.MeshStandardMaterial({ 
            name: "body-material", 
            color: new THREE.Color(bodyColor),
            roughness: 0.5,
            metalness: 0
          });
          
          handleMaterial = new THREE.MeshStandardMaterial({ 
            name: "handle-material", 
            color: new THREE.Color(handleColor),
            roughness: 0.5,
            metalness: 0
          });
          
          zipperMaterial = new THREE.MeshStandardMaterial({ 
            name: "zipper-material", 
            color: new THREE.Color(zipperColor),
            roughness: 0.5,
            metalness: 0
          });
          
          wheelMaterial = new THREE.MeshStandardMaterial({ 
            name: "wheel-material", 
            color: new THREE.Color(wheelColor),
            roughness: 0.5,
            metalness: 0
          });
        }
      } else {
        // Pure fallback materials if no original materials exist
        bodyMaterial = new THREE.MeshStandardMaterial({ 
          name: "body-material", 
          color: new THREE.Color(bodyColor),
          roughness: 0.7,
          metalness: 0.2
        });
        
        handleMaterial = new THREE.MeshStandardMaterial({ 
          name: "handle-material", 
          color: new THREE.Color(handleColor),
          roughness: 0.8,
          metalness: 0.1
        });
        
        zipperMaterial = new THREE.MeshStandardMaterial({ 
          name: "zipper-material", 
          color: new THREE.Color(zipperColor),
          roughness: 0.4,
          metalness: 0.6 
        });
        
        wheelMaterial = new THREE.MeshStandardMaterial({ 
          name: "wheel-material", 
          color: new THREE.Color(wheelColor),
          roughness: 0.5,
          metalness: 0.5
        });
      }
      
      // Make sure the materials will update with new colors
      bodyMaterial.needsUpdate = true;
      handleMaterial.needsUpdate = true;
      zipperMaterial.needsUpdate = true;
      wheelMaterial.needsUpdate = true;
      
      // Debug: log available material keys
      if (materials) {
        console.log("Available material keys:", Object.keys(materials));
      }
      
      // First pass - gather original materials
      const meshes: {
        body?: THREE.Mesh,
        handle?: THREE.Mesh,
        zipper?: THREE.Mesh,
        wheel?: THREE.Mesh
      } = {};
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Log basic info for each mesh
          console.log("Mesh:", child.name, {
            position: child.position,
            material: typeof child.material === 'object' ? 
              (child.material as THREE.Material).name : 'unknown'
          });
          
          // Store meshes by name
          if (child.name === "Cube228") {
            meshes.body = child;
          }
          else if (child.name === "Cube228_1") {
            meshes.handle = child;
          }
          else if (child.name === "Cube228_2") {
            meshes.zipper = child;
          }
          else if (child.name === "Cube228_3") {
            meshes.wheel = child;
          }
        }
      });
      
      // Transfer texture properties from original materials if they exist
      // This preserves the texture and normal maps while allowing color changes
      const transferProperties = (
        sourceMesh: THREE.Mesh | undefined, 
        targetMaterial: THREE.MeshStandardMaterial
      ) => {
        if (!sourceMesh || !sourceMesh.material) return;
        
        const srcMat = sourceMesh.material as THREE.Material;
        
        if (srcMat instanceof THREE.MeshStandardMaterial) {
          // Copy texture maps from the original material
          if (srcMat.map) targetMaterial.map = srcMat.map;
          if (srcMat.normalMap) targetMaterial.normalMap = srcMat.normalMap;
          if (srcMat.bumpMap) targetMaterial.bumpMap = srcMat.bumpMap;
          if (srcMat.roughnessMap) targetMaterial.roughnessMap = srcMat.roughnessMap;
          if (srcMat.metalnessMap) targetMaterial.metalnessMap = srcMat.metalnessMap;
          if (srcMat.envMap) targetMaterial.envMap = srcMat.envMap;
          
          // Copy other relevant properties
          targetMaterial.roughness = srcMat.roughness;
          targetMaterial.metalness = srcMat.metalness;
          targetMaterial.normalScale.copy(srcMat.normalScale);
          
          // Ensure textures are rendered
          targetMaterial.needsUpdate = true;
        }
      };
      
      // Apply texture properties from original materials
      transferProperties(meshes.body, bodyMaterial);
      transferProperties(meshes.handle, handleMaterial);
      transferProperties(meshes.zipper, zipperMaterial);
      transferProperties(meshes.wheel, wheelMaterial);
      
      // Try to extract material properties from the GLB's native materials
      if (materials) {
        // Get detailed info about all available materials in the GLB file
        Object.entries(materials).forEach(([key, material]) => {
          // Log detailed info about the original material
          console.log("Original material:", key, {
            type: material.type,
            name: material.name,
            uuid: material.uuid,
            hasMap: material instanceof THREE.MeshStandardMaterial && !!material.map,
            hasNormalMap: material instanceof THREE.MeshStandardMaterial && !!material.normalMap,
            hasBumpMap: material instanceof THREE.MeshStandardMaterial && !!material.bumpMap,
            hasRoughnessMap: material instanceof THREE.MeshStandardMaterial && !!material.roughnessMap,
            roughness: material instanceof THREE.MeshStandardMaterial ? material.roughness : 'n/a',
            metalness: material instanceof THREE.MeshStandardMaterial ? material.metalness : 'n/a',
            color: material instanceof THREE.MeshStandardMaterial ? 
              `#${material.color.getHexString()}` : 'n/a',
          });
          
          // If the material is a standard material, we can extract properties
          if (material instanceof THREE.MeshStandardMaterial) {
            // Clone the original materials to preserve their properties
            const originalMat = material.clone();
            
            // Create a blended material that has the original texture but our custom color
            const createBlendedMaterial = (targetMaterial: THREE.MeshStandardMaterial) => {
              // Copy all texture maps from original
              if (originalMat.map) targetMaterial.map = originalMat.map;
              if (originalMat.normalMap) targetMaterial.normalMap = originalMat.normalMap;
              if (originalMat.bumpMap) targetMaterial.bumpMap = originalMat.bumpMap;
              if (originalMat.roughnessMap) targetMaterial.roughnessMap = originalMat.roughnessMap;
              if (originalMat.metalnessMap) targetMaterial.metalnessMap = originalMat.metalnessMap;
              if (originalMat.envMap) targetMaterial.envMap = originalMat.envMap;
              
              // Copy material properties from original but keep our color
              targetMaterial.roughness = originalMat.roughness;
              targetMaterial.metalness = originalMat.metalness;
              targetMaterial.envMapIntensity = originalMat.envMapIntensity;
              targetMaterial.normalScale.copy(originalMat.normalScale);
              
              // Keep our custom color
              // Already set in the material creation
              
              targetMaterial.needsUpdate = true;
            };
            
            // Apply to all four of our materials
            createBlendedMaterial(bodyMaterial);
            createBlendedMaterial(handleMaterial);
            createBlendedMaterial(zipperMaterial);
            createBlendedMaterial(wheelMaterial);
          }
        });
      }
      
      // Store materials in refs for later updates
      bodyMaterialRef.current = bodyMaterial;
      handleMaterialRef.current = handleMaterial;
      zipperMaterialRef.current = zipperMaterial;
      wheelMaterialRef.current = wheelMaterial;
      
      // Assign materials based on mesh name or position/size
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Body is usually the main large part (Cube228)
          if (child.name === "Cube228") {
            console.log("Assigning body material to:", child.name);
            child.material = bodyMaterial;
          }
          // Handle is usually a separate part (Cube228_1)
          else if (child.name === "Cube228_1") {
            console.log("Assigning handle material to:", child.name);
            child.material = handleMaterial;
          }
          // Zipper part (Cube228_2)
          else if (child.name === "Cube228_2") {
            console.log("Assigning zipper material to:", child.name);
            child.material = zipperMaterial;
          }
          // Wheels (Cube228_3)
          else if (child.name === "Cube228_3") {
            console.log("Assigning wheel material to:", child.name);
            child.material = wheelMaterial;
            
            // Apply wheel style changes
            applyWheelStyle(child, wheelStyle);
          }
          // Fallback detection based on volume/position if specific names don't match
          else {
            const bbox = new THREE.Box3().setFromObject(child);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const volume = size.x * size.y * size.z;
            
            if (volume > 1) {
              child.material = bodyMaterial;
            } else if (child.position.y > 0.5) {
              child.material = handleMaterial;
            } else if (child.position.y < -0.3) {
              child.material = wheelMaterial;
              applyWheelStyle(child, wheelStyle);
            } else if (size.x < 0.2 && size.y < 0.2 && size.z < 0.2) {
              child.material = zipperMaterial;
            }
          }
        }
      });
    } catch (error) {
      console.error("Error setting up suitcase materials:", error);
      setUseFallback(true);
    }
  }, [scene, useFallback, bodyColor, handleColor, zipperColor, wheelColor, wheelStyle]);
  
  // Update colors when configuration changes - for real model
  useEffect(() => {
    if (useFallback || !bodyMaterialRef.current) return;
    bodyMaterialRef.current.color.set(bodyColor);
    bodyMaterialRef.current.needsUpdate = true;
  }, [useFallback, bodyColor]);
  
  useEffect(() => {
    if (useFallback || !handleMaterialRef.current) return;
    handleMaterialRef.current.color.set(handleColor);
    handleMaterialRef.current.needsUpdate = true;
  }, [useFallback, handleColor]);
  
  useEffect(() => {
    if (useFallback || !zipperMaterialRef.current) return;
    zipperMaterialRef.current.color.set(zipperColor);
    zipperMaterialRef.current.needsUpdate = true;
  }, [useFallback, zipperColor]);
  
  useEffect(() => {
    if (useFallback || !wheelMaterialRef.current) return;
    wheelMaterialRef.current.color.set(wheelColor);
    wheelMaterialRef.current.needsUpdate = true;
  }, [useFallback, wheelColor]);
  
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
