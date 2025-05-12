import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";
import { WheelOptions } from "./WheelOptions";
import { useConfigurator } from "@/lib/stores/useConfigurator";
import { Download, Share2, TimerReset } from "lucide-react";
import { useAudio } from "@/lib/stores/useAudio";

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
  const { playSuccess } = useAudio();
  
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
    <div className={`border-l border-border bg-card text-card-foreground transition-all duration-300 ${isExpanded ? 'w-full md:w-80 lg:w-96' : 'w-14'}`}>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden absolute top-4 right-4 z-10 bg-background/60 backdrop-blur-sm"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "×" : "≡"}
      </Button>
      
      {isExpanded ? (
        <div className="h-full overflow-y-auto flex flex-col">
          <CardHeader className="px-6 pt-6 pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Luggage Configurator</span>
              <Badge variant="outline" className="ml-2">3D</Badge>
            </CardTitle>
          </CardHeader>
          
          <Tabs defaultValue="colors" className="flex-grow">
            <div className="px-6">
              <TabsList className="w-full">
                <TabsTrigger value="colors" className="flex-1">Colors</TabsTrigger>
                <TabsTrigger value="wheels" className="flex-1">Wheels</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="colors" className="flex-grow">
              <CardContent className="px-6 py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Body Color</h3>
                    <ColorPicker 
                      color={bodyColor} 
                      onChange={setBodyColor} 
                      presetColors={["#1a365d", "#2a4365", "#9c1a1c", "#c53030", "#2f855a", "#276749", "#000000", "#1a202c", "#4a5568"]}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Handle Color</h3>
                    <ColorPicker 
                      color={handleColor} 
                      onChange={setHandleColor} 
                      presetColors={["#1a202c", "#2d3748", "#4a5568", "#718096", "#a0aec0", "#cbd5e0", "#f7fafc", "#000000", "#ffffff"]}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Zipper Color</h3>
                    <ColorPicker 
                      color={zipperColor} 
                      onChange={setZipperColor} 
                      presetColors={["#d69e2e", "#b7791f", "#975a16", "#744210", "#f6ad55", "#f6e05e", "#c53030", "#9b2c2c", "#742a2a"]}
                    />
                  </div>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="wheels" className="flex-grow">
              <CardContent className="px-6 py-4">
                <WheelOptions
                  wheelStyle={wheelStyle}
                  onWheelStyleChange={setWheelStyle}
                  wheelColor={wheelColor}
                  onWheelColorChange={setWheelColor}
                />
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <div className="p-6 mt-auto border-t border-border">
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleResetConfig}
              >
                <TimerReset className="h-4 w-4 mr-2" />
                TimerReset
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleShareConfig}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={handleSaveConfig}
              >
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center py-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className="mb-6"
          >
            ≡
          </Button>
        </div>
      )}
    </div>
  );
}
