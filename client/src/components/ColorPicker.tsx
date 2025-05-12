import { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hexToRgb, rgbToHex } from "@/lib/helpers";
import { Check, ChevronDown } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

export function ColorPicker({ color, onChange, presetColors = [] }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [tempColor, setTempColor] = useState(color);
  const [inputColor, setInputColor] = useState(color);
  const [isCustomColorActive, setIsCustomColorActive] = useState(false);
  
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
    setIsCustomColorActive(true);
  };
  
  const handleGreenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setGreen(value);
    updateRgb(red, value, blue);
    setIsCustomColorActive(true);
  };
  
  const handleBlueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setBlue(value);
    updateRgb(red, green, value);
    setIsCustomColorActive(true);
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
      
      setIsCustomColorActive(true);
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
    
    setIsCustomColorActive(false);
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
            "w-full justify-between",
            open && "ring-2 ring-ring ring-offset-2"
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border border-border"
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Presets</h4>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className={cn(
                    "h-8 w-8 rounded-full border border-border flex items-center justify-center",
                    tempColor === presetColor && "ring-2 ring-ring ring-offset-2"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handlePresetColorClick(presetColor)}
                >
                  {tempColor === presetColor && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Custom</h4>
            <div>
              <div className="mb-2">
                <div className="h-10 rounded-md border border-border" style={{ backgroundColor: tempColor }} />
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 items-center gap-2">
                  <label className="text-xs">Hex</label>
                  <input
                    type="text"
                    value={inputColor}
                    onChange={handleInputChange}
                    className="h-8 w-full rounded-md border border-border px-2 text-xs"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-xs">R: {red}</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={red}
                    onChange={handleRedChange}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-red-200"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-xs">G: {green}</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={green}
                    onChange={handleGreenChange}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-green-200"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-xs">B: {blue}</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={blue}
                    onChange={handleBlueChange}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-200"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Button onClick={handleApply} className="w-full">Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
