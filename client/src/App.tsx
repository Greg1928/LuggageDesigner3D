import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { ConfigPanel } from "./components/ConfigPanel";
import { Experience } from "./components/Experience";
import { OrbitControls } from "@react-three/drei";
import "@fontsource/inter";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const headerRef = useRef(null);
  const footerRef = useRef(null);

  // Calculate canvas height dynamically
  useEffect(() => {
    const updateCanvasHeight = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const footerHeight = footerRef.current?.offsetHeight || 0;
      const availableHeight = window.innerHeight - headerHeight - footerHeight;
      
      // Reduce canvas height by 10% (you can adjust this percentage)
      const reducedHeight = availableHeight * 0.95;
      
      setCanvasHeight(reducedHeight);
    };

    updateCanvasHeight();

    const resizeObserver = new ResizeObserver(updateCanvasHeight);
    if (headerRef.current) resizeObserver.observe(headerRef.current);
    if (footerRef.current) resizeObserver.observe(footerRef.current);
    window.addEventListener("resize", updateCanvasHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCanvasHeight);
    };
  }, []);

  // Load audio
  useEffect(() => {
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");

    useAudio.setState({
      backgroundMusic,
      hitSound,
      successSound,
    });

    setLoaded(true);

    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-xl">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-foreground overflow-hidden">
      {/* Header */}
      <div ref={headerRef} className="px-4 pt-4 pb-2 relative">
        <div className="text-center">
          <div className="text-red-600 font-semibold text-base mb-1">RONCATO</div>
        </div>
        <h2 className="text-sm font-medium">Trolley Medio</h2>
        <p className="text-xs text-gray-500">
          e-lite trolley medio 72 cm (72 x 46.5 x 24cm)
        </p>
        <p className="text-xs mt-0.5">€ 449,00</p>

        <div className="absolute top-4 right-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </div>
      </div>

      {/* Canvas area with dynamic height */}
      <div className="relative w-full" style={{ height: canvasHeight }}>
        <Canvas
          camera={{
            position: [0, 0, 1.5],
            fov: 30,
            near: 0.01,
            far: 1000,
          }}
          shadows
          dpr={[1, 1.5]}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
          <OrbitControls
            enablePan={false}
            minDistance={0.5}
            maxDistance={5}
            zoomSpeed={2}
            dampingFactor={0.05}
          />
        </Canvas>

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

      {/* Config Panel */}
      <div ref={footerRef} className="px-2 bg-white">
        <div className="w-full h-full bg-white rounded-lg">
          <ConfigPanel />
        </div>
      </div>
    </div>
  );
}

export default App;