import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "./ColorPicker";

interface WheelOptionsProps {
  wheelStyle: string;
  onWheelStyleChange: (style: string) => void;
  wheelColor: string;
  onWheelColorChange: (color: string) => void;
}

export function WheelOptions({
  wheelStyle,
  onWheelStyleChange,
  wheelColor,
  onWheelColorChange
}: WheelOptionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Wheel Style</h3>
        <RadioGroup value={wheelStyle} onValueChange={onWheelStyleChange} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3 rounded-md border p-3">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="flex items-center">
              <div className="ml-2">
                <div className="font-medium">Standard</div>
                <div className="text-xs text-muted-foreground">Classic smooth wheels</div>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 rounded-md border p-3">
            <RadioGroupItem value="sporty" id="sporty" />
            <Label htmlFor="sporty" className="flex items-center">
              <div className="ml-2">
                <div className="font-medium">Sporty</div>
                <div className="text-xs text-muted-foreground">Performance with enhanced grip</div>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 rounded-md border p-3">
            <RadioGroupItem value="rugged" id="rugged" />
            <Label htmlFor="rugged" className="flex items-center">
              <div className="ml-2">
                <div className="font-medium">Rugged</div>
                <div className="text-xs text-muted-foreground">All-terrain, durable wheels</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-3">Wheel Color</h3>
        <ColorPicker 
          color={wheelColor} 
          onChange={onWheelColorChange} 
          presetColors={["#000000", "#1a202c", "#2d3748", "#4a5568", "#718096", "#a0aec0", "#cbd5e0", "#e2e8f0", "#f7fafc"]}
        />
      </div>
    </div>
  );
}
