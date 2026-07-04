/**
 * Theme color utility functions for MomenKu editor.
 * These helpers allow runtime color manipulation based on CSS custom properties.
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 5, g: 150, b: 105 } // default emerald
}

export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function lighten(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex)
  const amt = Math.round(2.55 * percent)
  return `rgb(${Math.min(255, r + amt)}, ${Math.min(255, g + amt)}, ${Math.min(255, b + amt)})`
}

export function darken(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex)
  const amt = Math.round(2.55 * percent)
  return `rgb(${Math.max(0, r - amt)}, ${Math.max(0, g - amt)}, ${Math.max(0, b - amt)})`
}
