export type FlowerType = 'tulip' | 'sunflower' | 'daisy' | 'rose' | 'leaf';

export interface BouquetItem {
  id: string;
  type: FlowerType;
  x: number; // Percentage coordinate (0-100) inside the bouquet viewport
  y: number; // Percentage coordinate (0-100) inside the bouquet viewport
  color: string; // Theme color (hex code)
  scale: number; // Vector scale multiplier
  zIndex: number; // CSS z-index layering
  brightness: number; // Base brightness percentage (e.g. 100)
  msg?: string; // Interactive message ID (e.g. 'M1', 'M2')
  rotation?: number; // Base self-rotation in degrees
  pollenColor?: string; // Optional daisy pollen center color
}

export interface MessageDetail {
  id: string;
  title: string;
  body: string;
  link?: string;
  imageUrl?: string;
  theme: 'tulip' | 'sunflower';
}

export interface WrappingTheme {
  id: string;
  name: string;
  backColor: string;
  midColor: string;
  frontColor: string;
  innerGrad: string;
  glowColor: string;
  description: string;
}

export interface RibbonTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  description: string;
}
