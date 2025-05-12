import { RGB } from "./types";

/**
 * Converts a hex color string to RGB values
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts RGB values to a hex color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

/**
 * Converts a single RGB component to hex
 */
function componentToHex(c: number): string {
  const hex = Math.max(0, Math.min(255, c)).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

/**
 * Generates a random hex color
 */
export function getRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Determines if a color is light or dark
 * Returns true if the color is light
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  
  // Calculate perceived brightness using the formula
  // (0.299*R + 0.587*G + 0.114*B)
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  
  // If brightness is greater than 128, color is considered light
  return brightness > 128;
}
