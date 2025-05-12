import { create } from "zustand";

interface ConfiguratorState {
  // Color settings
  bodyColor: string;
  handleColor: string;
  zipperColor: string;
  wheelColor: string;
  
  // Wheel style
  wheelStyle: string;
  
  // Setters for each property
  setBodyColor: (color: string) => void;
  setHandleColor: (color: string) => void;
  setZipperColor: (color: string) => void;
  setWheelColor: (color: string) => void;
  setWheelStyle: (style: string) => void;
  
  // Reset to defaults
  resetAll: () => void;
}

// Default values
const defaultBodyColor = "#1a365d"; // Navy blue
const defaultHandleColor = "#4a5568"; // Gray
const defaultZipperColor = "#d69e2e"; // Gold
const defaultWheelColor = "#2d3748"; // Dark gray
const defaultWheelStyle = "standard";

export const useConfigurator = create<ConfiguratorState>((set) => ({
  // Initial state with defaults
  bodyColor: defaultBodyColor,
  handleColor: defaultHandleColor,
  zipperColor: defaultZipperColor,
  wheelColor: defaultWheelColor,
  wheelStyle: defaultWheelStyle,
  
  // Setters
  setBodyColor: (color: string) => set({ bodyColor: color }),
  setHandleColor: (color: string) => set({ handleColor: color }),
  setZipperColor: (color: string) => set({ zipperColor: color }),
  setWheelColor: (color: string) => set({ wheelColor: color }),
  setWheelStyle: (style: string) => set({ wheelStyle: style }),
  
  // Reset function
  resetAll: () => set({
    bodyColor: defaultBodyColor,
    handleColor: defaultHandleColor,
    zipperColor: defaultZipperColor,
    wheelColor: defaultWheelColor,
    wheelStyle: defaultWheelStyle
  })
}));
