import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "./ColorPicker";
import { Badge } from "@/components/ui/badge";
import { Check, Circle } from "lucide-react";

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
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Wheel Style</h3>
          <Badge variant="outline" className="font-normal text-xs">Performance Options</Badge>
        </div>
        
        <RadioGroup 
          value={wheelStyle} 
          onValueChange={onWheelStyleChange} 
          className="grid gap-3"
        >
          <label 
            className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:bg-accent/50 ${wheelStyle === "standard" ? "border-primary bg-accent/30" : "hover:border-accent"}`}
            htmlFor="standard"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary">
              {wheelStyle === "standard" && <Circle className="h-2.5 w-2.5 fill-primary text-primary" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">Standard</div>
                {wheelStyle === "standard" && <Check className="h-4 w-4 text-primary" />}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">Classic smooth wheels for everyday use</div>
            </div>
            <RadioGroupItem value="standard" id="standard" className="sr-only" />
          </label>
          
          <label 
            className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:bg-accent/50 ${wheelStyle === "sporty" ? "border-primary bg-accent/30" : "hover:border-accent"}`}
            htmlFor="sporty"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary">
              {wheelStyle === "sporty" && <Circle className="h-2.5 w-2.5 fill-primary text-primary" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">Sporty</div>
                {wheelStyle === "sporty" && <Check className="h-4 w-4 text-primary" />}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">Performance wheels with enhanced grip and control</div>
            </div>
            <RadioGroupItem value="sporty" id="sporty" className="sr-only" />
          </label>
          
          <label 
            className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:bg-accent/50 ${wheelStyle === "rugged" ? "border-primary bg-accent/30" : "hover:border-accent"}`}
            htmlFor="rugged"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary">
              {wheelStyle === "rugged" && <Circle className="h-2.5 w-2.5 fill-primary text-primary" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">Rugged</div>
                {wheelStyle === "rugged" && <Check className="h-4 w-4 text-primary" />}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">All-terrain, durable wheels for rough surfaces</div>
            </div>
            <RadioGroupItem value="rugged" id="rugged" className="sr-only" />
          </label>
        </RadioGroup>
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Wheel Color</h3>
          <Badge variant="outline" className="font-normal text-xs">Appearance</Badge>
        </div>
        <ColorPicker 
          color={wheelColor} 
          onChange={onWheelColorChange} 
          presetColors={["#000000", "#1a202c", "#2d3748", "#4a5568", "#718096", "#a0aec0", "#cbd5e0", "#e2e8f0", "#f7fafc", "#292524", "#44403c", "#57534e", "#78716c", "#a8a29e", "#d6d3d1"]}
        />
      </div>
    </div>
  );
}
