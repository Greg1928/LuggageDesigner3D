// Wheel style options
export type WheelStyle = "standard" | "sporty" | "rugged";

// RGB color representation
export interface RGB {
  r: number;
  g: number;
  b: number;
}

// Configuration settings
export interface SuitcaseConfig {
  bodyColor: string;
  handleColor: string;
  zipperColor: string;
  wheelColor: string;
  wheelStyle: WheelStyle;
}

// Material group mapping
export interface MaterialGroups {
  body: string[];
  handle: string[];
  zipper: string[];
  wheels: string[];
}
