import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hexToRgb, rgbToHex, isLightColor } from "@/lib/helpers";
import { Check, CheckCircle, ChevronDown, PaintBucket } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

export function ColorPicker({ color, onChange, presetColors = [] }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [tempColor, setTempColor] = useState(color);
  const [inputColor, setInputColor] = useState(color);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  
  // RGB sliders state
  const rgb = hexToRgb(color);
  const [red, setRed] = useState(rgb?.r || 0);
  const [green, setGreen] = useState(rgb?.g || 0);
  const [blue, setBlue] = useState(rgb?.b || 0);
  
  // Sync the input value with the color prop
  useEffect(() => {
    setInputColor(color);
    setTempColor(color);
    
    const rgb = hexToRgb(color);
    if (rgb) {
      setRed(rgb.r);
      setGreen(rgb.g);
      setBlue(rgb.b);
    }
  }, [color]);
  
  // Update RGB when sliders change
  const updateRgb = (r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b);
    setTempColor(hex);
    setInputColor(hex);
  };
  
  const handleRedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setRed(value);
    updateRgb(value, green, blue);
  };
  
  const handleGreenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setGreen(value);
    updateRgb(red, value, blue);
  };
  
  const handleBlueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setBlue(value);
    updateRgb(red, green, value);
  };
  
  // Handle direct hex input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputColor(value);
    
    // Validate that it's a proper hex color
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setTempColor(value);
      
      const rgb = hexToRgb(value);
      if (rgb) {
        setRed(rgb.r);
        setGreen(rgb.g);
        setBlue(rgb.b);
      }
    }
  };
  
  const handlePresetColorClick = (presetColor: string) => {
    setTempColor(presetColor);
    setInputColor(presetColor);
    
    const rgb = hexToRgb(presetColor);
    if (rgb) {
      setRed(rgb.r);
      setGreen(rgb.g);
      setBlue(rgb.b);
    }
    
    // Auto-apply when clicking a preset
    onChange(presetColor);
  };
  
  const handleApply = () => {
    onChange(tempColor);
    setOpen(false);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between group transition-all",
            open && "ring-2 ring-primary ring-offset-1"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-6 w-6 rounded-full border border-border shadow-sm transition-transform group-hover:scale-110"
              style={{ backgroundColor: color }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center">
                {isLightColor(color) ? 
                  <PaintBucket className="h-3 w-3 text-gray-600 opacity-0 group-hover:opacity-60" /> : 
                  <PaintBucket className="h-3 w-3 text-white opacity-0 group-hover:opacity-60" />
                }
              </div>
            </div>
            <span className="font-medium text-sm">{color}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden rounded-lg shadow-lg border-border">
        {/* Color preview at the top */}
        <div 
          className="w-full h-16 flex items-end justify-end p-2"
          style={{ backgroundColor: tempColor }}
        >
          <span className={`text-xs font-mono px-2 py-1 rounded bg-background/80 backdrop-blur-sm ${isLightColor(tempColor) ? 'text-gray-800' : 'text-white'}`}>
            {tempColor}
          </span>
        </div>
        
        {/* Tabs for presets/custom */}
        <div className="flex border-b border-border">
          <button
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'presets' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('presets')}
          >
            Color Presets
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'custom' ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('custom')}
          >
            Custom Color
          </button>
        </div>
        
        <div className="p-4">
          {activeTab === 'presets' ? (
            <div className="grid grid-cols-7 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className={cn(
                    "h-10 w-10 rounded-full border border-border flex items-center justify-center transition-all hover:scale-110",
                    tempColor === presetColor && "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handlePresetColorClick(presetColor)}
                >
                  {tempColor === presetColor && (
                    <CheckCircle className={`h-5 w-5 ${isLightColor(presetColor) ? 'text-gray-800' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="text-sm font-medium">Hex Value</label>
                  <input
                    type="text"
                    value={inputColor}
                    onChange={handleInputChange}
                    className="h-9 w-full rounded-md border border-border px-3 text-sm focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Red</label>
                      <span className="text-xs text-muted-foreground">{red}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={red}
                      onChange={handleRedChange}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-red-200 to-red-500"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Green</label>
                      <span className="text-xs text-muted-foreground">{green}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={green}
                      onChange={handleGreenChange}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-200 to-green-500"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Blue</label>
                      <span className="text-xs text-muted-foreground">{blue}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={blue}
                      onChange={handleBlueChange}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-200 to-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleApply} className="w-full">
                Apply Color
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
