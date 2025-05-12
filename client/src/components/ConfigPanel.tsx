import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";
import { WheelOptions } from "./WheelOptions";
import { useConfigurator } from "@/lib/stores/useConfigurator";
import { 
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, 
  Download, Image, Menu, Palette, RefreshCw, Share2, SlidersHorizontal, X 
} from "lucide-react";
import { useAudio } from "@/lib/stores/useAudio";

// New predefined color options similar to the image
const COLOR_PRESETS = [
  "#000000", // Black
  "#FFFFFF", // White
  "#192B4A", // Navy Blue
  "#B22234", // Red
  "#1E3A8A", // Royal Blue
  "#F5F5DC", // Beige
  "#D2B48C", // Tan
  "#BC8F8F", // Rosewood
  "#94A3B8", // Light Blue
  "#AEC670", // Olive
  "#F0E68C", // Light Yellow
];

export function ConfigPanel() {
  const { 
    bodyColor, setBodyColor,
    handleColor, setHandleColor,
    zipperColor, setZipperColor,
    wheelColor, setWheelColor,
    wheelStyle, setWheelStyle,
    resetAll
  } = useConfigurator();
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedPart, setSelectedPart] = useState("base"); // base, wheels, handle
  const { playSuccess } = useAudio();
  
  // Navigation state for base tab (1/10)
  const [baseStep, setBaseStep] = useState(1);
  const totalBaseSteps = 10;
  
  const handleColorSelect = (color: string) => {
    switch(selectedPart) {
      case "base":
        setBodyColor(color);
        break;
      case "wheels":
        setWheelColor(color);
        break;
      case "handle":
        setHandleColor(color);
        break;
      default:
        break;
    }
  };
  
  const handleResetConfig = () => {
    resetAll();
  };
  
  const handleSaveConfig = () => {
    // In a real app, this would save the configuration
    // For this demo, we'll just play a success sound
    playSuccess();
    
    // Mock saving to PDF or image (would be implemented in a real app)
    alert("Configuration saved! In a real app, this would download a PDF or image.");
  };
  
  const handleShareConfig = () => {
    // In a real app, this would generate a shareable link
    // For this demo, we'll just play a success sound
    playSuccess();
    
    // Create a mock share dialog
    const shareText = `Check out my custom luggage design:\n• Body: ${bodyColor}\n• Handle: ${handleColor}\n• Zippers: ${zipperColor}\n• Wheels: ${wheelStyle} (${wheelColor})`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Custom Luggage Design',
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        alert("Sharing failed. You can copy this instead:\n\n" + shareText);
      });
    } else {
      alert("Sharing not supported on this browser. You can copy this instead:\n\n" + shareText);
    }
  };
  
  return (
    <div className={`border-l border-border bg-white text-card-foreground transition-all ${isExpanded ? 'w-full md:w-96 lg:w-[420px]' : 'w-14'}`}>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden absolute top-4 right-4 z-10 bg-background/60 backdrop-blur-sm"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {isExpanded ? (
        <div className="h-full overflow-y-auto flex flex-col">
          {/* Top header with product info */}
          <div className="relative px-6 pt-6 pb-4">
            {/* Close button in the top right */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 h-8 w-8"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Brand logo */}
            <div className="text-red-600 font-semibold text-lg mb-2">
              RONCATO
            </div>
            
            {/* Product Name */}
            <h2 className="text-sm font-medium">Trolley Medio</h2>
            <p className="text-xs text-gray-500">e-lite trolley medio 72 cm (72 x 46.5 x 24cm)</p>
            <p className="text-sm mt-1">€ 449,00</p>
            
            {/* Share button */}
            <div className="absolute top-4 right-12">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleShareConfig}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </Button>
            </div>
          </div>
          
          {/* Navigation progress with arrows */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-b border-gray-200">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-sm font-medium">
              Base <span className="text-gray-500">{baseStep}/{totalBaseSteps}</span>
            </div>
            
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Tab selection */}
          <div className="grid grid-cols-3 border-b border-gray-200">
            <Button 
              variant={selectedPart === "base" ? "ghost" : "ghost"} 
              className={`py-3 rounded-none border-b-2 ${selectedPart === "base" ? 'border-black' : 'border-transparent'}`}
              onClick={() => setSelectedPart("base")}
            >
              <span className="text-sm">Guscio</span>
            </Button>
            <Button 
              variant={selectedPart === "wheels" ? "ghost" : "ghost"} 
              className={`py-3 rounded-none border-b-2 ${selectedPart === "wheels" ? 'border-black' : 'border-transparent'}`}
              onClick={() => setSelectedPart("wheels")}
            >
              <span className="text-sm">Ruote</span>
            </Button>
            <Button 
              variant={selectedPart === "handle" ? "ghost" : "ghost"} 
              className={`py-3 rounded-none border-b-2 ${selectedPart === "handle" ? 'border-black' : 'border-transparent'}`}
              onClick={() => setSelectedPart("handle")}
            >
              <span className="text-sm">Manico</span>
            </Button>
          </div>
          
          {/* Color selection */}
          <div className="p-6">
            <div className="grid grid-cols-5 gap-4">
              {COLOR_PRESETS.map((color, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-full border ${
                    (selectedPart === "base" && color === bodyColor) ||
                    (selectedPart === "wheels" && color === wheelColor) ||
                    (selectedPart === "handle" && color === handleColor)
                      ? "ring-2 ring-black ring-offset-2" 
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                >
                  {index === 0 && selectedPart === "base" && color === bodyColor && (
                    <div className="w-full text-center mt-12 text-xs">Nero</div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Menu button at the bottom */}
          <div className="mt-auto border-t border-gray-200 p-4 flex justify-end">
            <Button variant="outline" className="rounded-md">
              <span className="mr-2">Menu</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8H20M4 16H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center py-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
