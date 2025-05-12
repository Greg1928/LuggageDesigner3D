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
  const { scene, nodes, materials } = useGLTF("/models/suitcase.glb", undefined, 
    (error) => {
      console.warn("Failed to load suitcase model, using fallback:", error);
      setUseFallback(true);
    }) as GLTFResult;
  
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
      // Clone the materials to avoid modifying the cached originals
      // For body material (main large parts)
      if (materials.Body) {
        const bodyMat = materials.Body.clone();
        bodyMat.needsUpdate = true;
        bodyMaterialRef.current = bodyMat;
      } else if (materials.Suitcase_Body) {  // Try alternative names
        const bodyMat = materials.Suitcase_Body.clone();
        bodyMat.needsUpdate = true;
        bodyMaterialRef.current = bodyMat;
      } else {
        // Find by largest mesh if not named explicitly
        console.log("Body material not found by name, looking at all materials");
      }
      
      // For handle material
      if (materials.Handle) {
        const handleMat = materials.Handle.clone();
        handleMat.needsUpdate = true;
        handleMaterialRef.current = handleMat;
      } else if (materials.Suitcase_Handle) {
        const handleMat = materials.Suitcase_Handle.clone();
        handleMat.needsUpdate = true;
        handleMaterialRef.current = handleMat;
      }
      
      // For zipper material
      if (materials.Zipper) {
        const zipperMat = materials.Zipper.clone();
        zipperMat.needsUpdate = true;
        zipperMaterialRef.current = zipperMat;
      } else if (materials.Suitcase_Zipper) {
        const zipperMat = materials.Suitcase_Zipper.clone();
        zipperMat.needsUpdate = true;
        zipperMaterialRef.current = zipperMat;
      }
      
      // For wheel material
      if (materials.Wheels) {
        const wheelMat = materials.Wheels.clone();
        wheelMat.needsUpdate = true;
        wheelMaterialRef.current = wheelMat;
      } else if (materials.Suitcase_Wheels) {
        const wheelMat = materials.Suitcase_Wheels.clone();
        wheelMat.needsUpdate = true;
        wheelMaterialRef.current = wheelMat;
      }
      
      // If we couldn't find materials by name, try to identify them by traversing the model
      if (!bodyMaterialRef.current || !handleMaterialRef.current || 
          !zipperMaterialRef.current || !wheelMaterialRef.current) {
            
        // Map to collect all material names for logging
        const materialMap = new Map<string, THREE.Material>();
        
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            // Log all material names for debugging
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                materialMap.set(mat.name, mat);
              });
            } else {
              materialMap.set(child.material.name, child.material);
            }
          }
        });
        
        console.log("Available materials:", Array.from(materialMap.keys()));
        
        // Try to identify materials by mesh size or position as a fallback
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Get the volume of the mesh as a simple heuristic
            const bbox = new THREE.Box3().setFromObject(child);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const volume = size.x * size.y * size.z;
            
            // Largest mesh is likely the body
            if (volume > 1 && !bodyMaterialRef.current) {
              console.log("Identified potential body by size:", child.name, "volume:", volume);
              if (Array.isArray(child.material)) {
                bodyMaterialRef.current = child.material[0].clone() as THREE.MeshStandardMaterial;
              } else {
                bodyMaterialRef.current = child.material.clone() as THREE.MeshStandardMaterial;
              }
              bodyMaterialRef.current.needsUpdate = true;
            }
            
            // Wheels are likely small cylindrical objects near the bottom
            if (child.position.y < -0.5 && size.y < 0.3 && !wheelMaterialRef.current) {
              console.log("Identified potential wheel:", child.name);
              if (Array.isArray(child.material)) {
                wheelMaterialRef.current = child.material[0].clone() as THREE.MeshStandardMaterial;
              } else {
                wheelMaterialRef.current = child.material.clone() as THREE.MeshStandardMaterial;
              }
              wheelMaterialRef.current.needsUpdate = true;
            }
            
            // Handle is likely a long thin object on top
            if (child.position.y > 0.5 && size.x > size.y && size.x > size.z && !handleMaterialRef.current) {
              console.log("Identified potential handle:", child.name);
              if (Array.isArray(child.material)) {
                handleMaterialRef.current = child.material[0].clone() as THREE.MeshStandardMaterial;
              } else {
                handleMaterialRef.current = child.material.clone() as THREE.MeshStandardMaterial;
              }
              handleMaterialRef.current.needsUpdate = true;
            }
            
            // Zipper is likely a small detail on the front
            if (size.x < 0.2 && size.y < 0.2 && size.z < 0.2 && !zipperMaterialRef.current) {
              console.log("Identified potential zipper:", child.name);
              if (Array.isArray(child.material)) {
                zipperMaterialRef.current = child.material[0].clone() as THREE.MeshStandardMaterial;
              } else {
                zipperMaterialRef.current = child.material.clone() as THREE.MeshStandardMaterial;
              }
              zipperMaterialRef.current.needsUpdate = true;
            }
          }
        });
      }
      
      // Apply the cloned materials to the model
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const name = child.name.toLowerCase();
          
          // Apply materials based on part naming or best guess
          if ((name.includes('body') || name.includes('case') || name.includes('main')) && bodyMaterialRef.current) {
            if (Array.isArray(child.material)) {
              child.material = child.material.map(m => 
                m.name.toLowerCase().includes('body') ? bodyMaterialRef.current! : m
              );
            } else {
              child.material = bodyMaterialRef.current;
            }
          } 
          else if ((name.includes('handle') || name.includes('grip')) && handleMaterialRef.current) {
            if (Array.isArray(child.material)) {
              child.material = child.material.map(m => 
                m.name.toLowerCase().includes('handle') ? handleMaterialRef.current! : m
              );
            } else {
              child.material = handleMaterialRef.current;
            }
          } 
          else if ((name.includes('zipper') || name.includes('zip') || name.includes('fastener')) && zipperMaterialRef.current) {
            if (Array.isArray(child.material)) {
              child.material = child.material.map(m => 
                m.name.toLowerCase().includes('zipper') ? zipperMaterialRef.current! : m
              );
            } else {
              child.material = zipperMaterialRef.current;
            }
          } 
          else if ((name.includes('wheel') || name.includes('caster')) && wheelMaterialRef.current) {
            if (Array.isArray(child.material)) {
              child.material = child.material.map(m => 
                m.name.toLowerCase().includes('wheel') ? wheelMaterialRef.current! : m
              );
            } else {
              child.material = wheelMaterialRef.current;
              
              // Apply wheel style changes to the geometry
              applyWheelStyle(child, wheelStyle);
            }
          }
        }
      });
    } catch (error) {
      console.error("Error setting up suitcase materials:", error);
      setUseFallback(true);
    }
  }, [useFallback, scene, materials, wheelStyle]);
  
  // Update colors when configuration changes - for real model
  useEffect(() => {
    if (useFallback) return;
    
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.color.set(bodyColor);
      bodyMaterialRef.current.needsUpdate = true;
    }
  }, [useFallback, bodyColor]);
  
  useEffect(() => {
    if (useFallback) return;
    
    if (handleMaterialRef.current) {
      handleMaterialRef.current.color.set(handleColor);
      handleMaterialRef.current.needsUpdate = true;
    }
  }, [useFallback, handleColor]);
  
  useEffect(() => {
    if (useFallback) return;
    
    if (zipperMaterialRef.current) {
      zipperMaterialRef.current.color.set(zipperColor);
      zipperMaterialRef.current.needsUpdate = true;
    }
  }, [useFallback, zipperColor]);
  
  useEffect(() => {
    if (useFallback) return;
    
    if (wheelMaterialRef.current) {
      wheelMaterialRef.current.color.set(wheelColor);
      wheelMaterialRef.current.needsUpdate = true;
    }
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
