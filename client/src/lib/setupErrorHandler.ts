/**
 * Utility function to handle model loading errors gracefully
 */
import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

/**
 * This function pre-loads the model and sets up error handling
 * to ensure a graceful failure if the model can't be loaded
 */
export function setupModelErrorHandling(modelPath: string) {
  // Pre-cache the error for better error handling
  useEffect(() => {
    // Set up a custom console error handler to catch model loading issues
    const originalConsoleError = console.error;
    console.error = function(message, ...args) {
      // Check if it's a model loading error
      if (typeof message === 'string' && 
          (message.includes('Failed to load resource') || 
           message.includes('Error loading model'))) {
        console.warn('Model loading warning:', message);
        // Display a more user-friendly error in the UI
        const errorElement = document.createElement('div');
        errorElement.style.position = 'absolute';
        errorElement.style.top = '50%';
        errorElement.style.left = '50%';
        errorElement.style.transform = 'translate(-50%, -50%)';
        errorElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        errorElement.style.color = 'white';
        errorElement.style.padding = '20px';
        errorElement.style.borderRadius = '10px';
        errorElement.style.zIndex = '1000';
        errorElement.style.maxWidth = '400px';
        errorElement.style.textAlign = 'center';
        
        errorElement.innerHTML = `
          <h3 style="margin: 0 0 10px 0">3D Model Not Found</h3>
          <p style="margin: 0 0 10px 0">The suitcase model file could not be loaded. Please ensure the 'suitcase.glb' file is placed in the 'client/public/models/' directory.</p>
          <p style="margin: 0; font-size: 0.8em; opacity: 0.7">You can still interact with the configurator UI.</p>
        `;
        
        document.body.appendChild(errorElement);
        
        // After 10 seconds, make the error less obtrusive
        setTimeout(() => {
          errorElement.style.top = '10px';
          errorElement.style.left = '10px';
          errorElement.style.transform = 'none';
          errorElement.style.maxWidth = '300px';
          errorElement.style.fontSize = '0.8em';
          errorElement.style.opacity = '0.8';
        }, 10000);
      } else {
        // Pass through other errors to the original console.error
        originalConsoleError.apply(console, [message, ...args]);
      }
    };
    
    return () => {
      // Restore original console.error on cleanup
      console.error = originalConsoleError;
    };
  }, []);
  
  // Preload the model to trigger any errors early
  useGLTF.preload(modelPath);
}

/**
 * Function to create a fallback mesh when the model can't be loaded
 */
export function createFallbackMesh(scene: THREE.Scene) {
  try {
    // Import three.js if needed
    const THREE = require('three');
    
    // Create a simple box geometry as fallback
    const geometry = new THREE.BoxGeometry(1, 0.5, 1.5);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x1a365d,
      roughness: 0.7,
      metalness: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Create a handle on top
    const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    const handleMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4a5568,
      roughness: 0.9,
      metalness: 0.1
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.z = Math.PI / 2;
    handle.position.y = 0.3;
    
    // Create wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2d3748,
      roughness: 0.5,
      metalness: 0.5
    });
    
    const wheels = [];
    const wheelPositions = [
      [-0.4, -0.3, 0.6],  // front left
      [0.4, -0.3, 0.6],   // front right
      [-0.4, -0.3, -0.6], // back left
      [0.4, -0.3, -0.6]   // back right
    ];
    
    wheelPositions.forEach(position => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(position[0], position[1], position[2]);
      wheels.push(wheel);
    });
    
    // Add some details (zippers)
    const zipperGeometry = new THREE.BoxGeometry(1.02, 0.02, 0.02);
    const zipperMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd69e2e,
      roughness: 0.4,
      metalness: 0.6
    });
    const zipper = new THREE.Mesh(zipperGeometry, zipperMaterial);
    zipper.position.y = 0.15;
    zipper.position.z = 0.75;
    
    // Group everything
    const group = new THREE.Group();
    group.add(mesh);
    group.add(handle);
    wheels.forEach(wheel => group.add(wheel));
    group.add(zipper);
    
    if (scene) {
      scene.add(group);
    }
    
    return {
      group,
      bodyMaterial: material,
      handleMaterial,
      wheelMaterial,
      zipperMaterial
    };
  } catch (error) {
    console.warn("Error creating fallback mesh:", error);
    return null;
  }
}
