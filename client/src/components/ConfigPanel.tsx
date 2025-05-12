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
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Image,
  Menu,
  Palette,
  RefreshCw,
  Share2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useAudio } from "@/lib/stores/useAudio";

const COLOR_PRESETS = [
  "#000000",
  "#FFFFFF",
  "#192B4A",
  "#B22234",
  "#1E3A8A",
  "#F5F5DC",
  // "#D2B48C",
  // "#BC8F8F",
  // "#94A3B8",
  // "#AEC670",
  // "#F0E68C",
];

export function ConfigPanel() {
  const {
    bodyColor,
    setBodyColor,
    handleColor,
    setHandleColor,
    zipperColor,
    setZipperColor,
    wheelColor,
    setWheelColor,
    wheelStyle,
    setWheelStyle,
    resetAll,
  } = useConfigurator();

  const [selectedPart, setSelectedPart] = useState("base");
  const { playSuccess } = useAudio();

  const [baseStep, setBaseStep] = useState(1);
  const totalBaseSteps = 10;

  const handleColorSelect = (color) => {
    switch (selectedPart) {
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
    playSuccess();
    alert("Configuration saved! In a real app, this would download a PDF or image.");
  };

  const handleShareConfig = () => {
    playSuccess();
    const shareText = `Check out my custom luggage design:\n• Body: ${bodyColor}\n• Handle: ${handleColor}\n• Zippers: ${zipperColor}\n• Wheels: ${wheelStyle} (${wheelColor})`;

    if (navigator.share) {
      navigator
        .share({
          title: "My Custom Luggage Design",
          text: shareText,
          url: window.location.href,
        })
        .catch(() => {
          alert("Sharing failed. You can copy this instead:\n\n" + shareText);
        });
    } else {
      alert("Sharing not supported on this browser. You can copy this instead:\n\n" + shareText);
    }
  };

  return (
    <div className="w-full bg-white overflow-hidden">
      <div className="flex flex-col">
        {/* Navigation progress with arrows */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBaseStep((prev) => Math.max(1, prev - 1))}
            disabled={baseStep === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-sm font-medium">
            Base <span className="text-gray-500">{baseStep}/{totalBaseSteps}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBaseStep((prev) => Math.min(totalBaseSteps, prev + 1))}
            disabled={baseStep === totalBaseSteps}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab selection */}
        <div className="flex justify-center gap-2 py-3">
          {["base", "wheels", "handle"].map((part) => (
            <Button
              key={part}
              variant="ghost"
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors duration-150 ${
                selectedPart === part
                  ? "bg-gray-100 border-black text-black"
                  : "border-gray-300 text-gray-500 hover:border-black hover:text-black"
              }`}
              onClick={() => setSelectedPart(part)}
            >
              {{
                base: "Guscio",
                wheels: "Ruote",
                handle: "Manico",
              }[part]}
            </Button>
          ))}
        </div>

        {/* Color selection */}
        <div className="px-4 py-2">
          <div className="flex justify-center items-center space-x-8">
            {COLOR_PRESETS.map((color, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  (selectedPart === "base" && color === bodyColor) ||
                  (selectedPart === "wheels" && color === wheelColor) ||
                  (selectedPart === "handle" && color === handleColor)
                    ? "ring-2 ring-black ring-offset-2 scale-110"
                    : "border-gray-300 hover:scale-110"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}