import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { ConfigPanel } from "./components/ConfigPanel";
import { Experience } from "./components/Experience";
import "@fontsource/inter";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Setup audio elements
  useEffect(() => {
    // We're not actually playing background music by default,
    // but we'll set up the audio elements for potential use
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    useAudio.setState({
      backgroundMusic,
      hitSound,
      successSound
    });
    
    setLoaded(true);
    
    // After 5 seconds, hide the instructions
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!loaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-xl">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-white text-foreground flex flex-col md:flex-row overflow-hidden">
      {/* Left panel for 3D view */}
      <div className="flex-grow relative">
        {/* Top navigation with close button - like in reference image */}
        <div className="absolute top-0 right-0 left-0 p-4 z-10 flex justify-end">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2L2 14M2 2L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <Canvas
          camera={{
            position: [0, 1, 5],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          shadows
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
        
        {/* Hidden instructions panel - reduce visual clutter */}
        {showInstructions && (
          <div className="absolute bottom-4 left-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-md max-w-xs border border-gray-200">
            <h3 className="font-medium text-sm mb-1">Interaction Controls:</h3>
            <ul className="text-xs text-gray-600">
              <li>• Click and drag to rotate the suitcase</li>
              <li>• Scroll to zoom in/out</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Right panel for controls */}
      <ConfigPanel />
    </div>
  );
}

export default App;
