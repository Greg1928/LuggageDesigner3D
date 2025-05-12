import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";
import { WheelOptions } from "./WheelOptions";
import { useConfigurator } from "@/lib/stores/useConfigurator";
import { Download, Image, Menu, Palette, RefreshCw, Share2, SlidersHorizontal, TimerReset, X } from "lucide-react";
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
    <div className={`border-l border-border bg-card text-card-foreground transition-all duration-300 ${isExpanded ? 'w-full md:w-96 lg:w-[420px]' : 'w-14'}`}>
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
          <CardHeader className="px-6 pt-6 pb-2 bg-primary/5">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className="font-normal text-xs bg-primary/10 hover:bg-primary/20 transition-colors px-2">Premium</Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-xl">Luggage Configurator</CardTitle>
            <CardDescription className="text-sm">
              Customize your perfect suitcase with our interactive 3D designer
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="colors" className="flex-grow">
            <div className="px-6 py-4 border-b">
              <TabsList className="w-full grid grid-cols-2 h-11">
                <TabsTrigger value="colors" className="flex items-center gap-2 text-sm">
                  <Palette className="h-4 w-4" />
                  <span>Colors</span>
                </TabsTrigger>
                <TabsTrigger value="wheels" className="flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Wheels</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="colors" className="flex-grow mt-0">
              <CardContent className="px-6 py-6">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Body Color</h3>
                      <Badge variant="outline" className="font-normal text-xs">Main Surface</Badge>
                    </div>
                    <ColorPicker 
                      color={bodyColor} 
                      onChange={setBodyColor} 
                      presetColors={["#1a365d", "#2a4365", "#9c1a1c", "#c53030", "#2f855a", "#276749", "#000000", "#1a202c", "#4a5568", "#553c9a", "#805ad5", "#6b46c1", "#30436e", "#3b82f6", "#2563eb"]}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Handle Color</h3>
                      <Badge variant="outline" className="font-normal text-xs">Grip Surface</Badge>
                    </div>
                    <ColorPicker 
                      color={handleColor} 
                      onChange={setHandleColor} 
                      presetColors={["#1a202c", "#2d3748", "#4a5568", "#718096", "#a0aec0", "#cbd5e0", "#f7fafc", "#000000", "#ffffff", "#18181b", "#27272a", "#3f3f46", "#52525b", "#71717a", "#a1a1aa"]}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Zipper Color</h3>
                      <Badge variant="outline" className="font-normal text-xs">Accent Detail</Badge>
                    </div>
                    <ColorPicker 
                      color={zipperColor} 
                      onChange={setZipperColor} 
                      presetColors={["#d69e2e", "#b7791f", "#975a16", "#744210", "#f6ad55", "#f6e05e", "#c53030", "#9b2c2c", "#742a2a", "#eab308", "#facc15", "#fde047", "#fef08a", "#ca8a04", "#f59e0b"]}
                    />
                  </div>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="wheels" className="flex-grow mt-0">
              <CardContent className="px-6 py-6">
                <WheelOptions
                  wheelStyle={wheelStyle}
                  onWheelStyleChange={setWheelStyle}
                  wheelColor={wheelColor}
                  onWheelColorChange={setWheelColor}
                />
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <div className="p-6 mt-auto border-t border-border bg-muted/30">
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleResetConfig}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleShareConfig}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={handleSaveConfig}
              >
                <Image className="h-4 w-4" />
                <span>Save</span>
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
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
