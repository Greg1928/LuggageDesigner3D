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
    <div className="h-screen w-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden">
      {/* Left panel for 3D view */}
      <div className="flex-grow relative">
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
        
        {/* Floating instructions panel */}
        {showInstructions && (
          <div className="absolute top-4 left-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg max-w-xs">
            <h3 className="font-semibold mb-2">Interaction Controls:</h3>
            <ul className="text-sm">
              <li>• Click and drag to rotate the suitcase</li>
              <li>• Scroll to zoom in/out</li>
              <li>• Right click and drag to pan</li>
              <li>• Use the panel to customize your suitcase</li>
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
