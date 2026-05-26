import { BouquetItem, MessageDetail, WrappingTheme, RibbonTheme, BackgroundTheme } from './types';

export const BASE_POINT = { x: 50, y: 78 }; // Tie point where ribbon lies

export const bouquetLayout: BouquetItem[] = [
  // --- BACKGROUND FOREST GREENERY (zIndex: 4) ---
  { id: 'leaf-bg-1', type: 'leaf', x: 20, y: 38, color: '#15522e', scale: 1.15, zIndex: 4, brightness: 75, rotation: -45 },
  { id: 'leaf-bg-2', type: 'leaf', x: 80, y: 38, color: '#15522e', scale: 1.15, zIndex: 4, brightness: 75, rotation: 45 },
  { id: 'leaf-bg-3', type: 'leaf', x: 30, y: 22, color: '#114224', scale: 1.25, zIndex: 4, brightness: 80, rotation: -20 },
  { id: 'leaf-bg-4', type: 'leaf', x: 70, y: 22, color: '#114224', scale: 1.25, zIndex: 4, brightness: 80, rotation: 20 },
  { id: 'leaf-bg-5', type: 'leaf', x: 50, y: 15, color: '#0d331b', scale: 1.15, zIndex: 4, brightness: 70, rotation: 5 },

  // --- LOWER BACKGROUND DAISIES ---
  { id: 'ds-bg-1', type: 'daisy', x: 18, y: 44, color: '#ffffff', scale: 0.95, zIndex: 5, brightness: 90, pollenColor: '#fbbf24' },
  { id: 'ds-bg-2', type: 'daisy', x: 82, y: 44, color: '#faf5ff', scale: 0.95, zIndex: 5, brightness: 90, pollenColor: '#f59e0b' },

  // --- FLOATING BACKGROUND FOLIAGE ---
  { id: 'leaf-mid-1', type: 'leaf', x: 12, y: 52, color: '#166534', scale: 1.05, zIndex: 6, brightness: 85, rotation: -75 },
  { id: 'leaf-mid-2', type: 'leaf', x: 88, y: 52, color: '#166534', scale: 1.05, zIndex: 6, brightness: 85, rotation: 75 },

  // --- INTERACTIVE & MAIN FLOWERS LAYOUT (zIndex: 8-13) ---
  // M1: Central Master Sunflower (Huge and Radiant)
  { id: 'sf-center', type: 'sunflower', x: 50, y: 30, color: '#facc15', scale: 1.35, zIndex: 12, brightness: 100, msg: 'M1' },
  
  // M2: Deep Pink Passionate Tulip (Upper Left)
  { id: 'tl-left-top', type: 'tulip', x: 33, y: 33, color: '#e11d48', scale: 1.12, zIndex: 10, brightness: 95, msg: 'M2', rotation: -12 },
  
  // M3: Vivid Orchid Tulip (Upper Right)
  { id: 'tl-right-top', type: 'tulip', x: 67, y: 33, color: '#db2777', scale: 1.12, zIndex: 10, brightness: 95, msg: 'M3', rotation: 12 },
  
  // M4: Autumn Copper Sunflower (Mid-Lower Left)
  { id: 'sf-left-mid', type: 'sunflower', x: 28, y: 48, color: '#ea580c', scale: 1.18, zIndex: 11, brightness: 100, msg: 'M4', rotation: -8 },
  
  // M5: Golden Amber Sunflower (Mid-Lower Right)
  { id: 'sf-right-mid', type: 'sunflower', x: 72, y: 48, color: '#eab308', scale: 1.18, zIndex: 11, brightness: 100, msg: 'M5', rotation: 8 },
  
  // M6: Pastel Coral Velvet Tulip (Lower Center, overlaps beautifully)
  { id: 'tl-front-center', type: 'tulip', x: 50, y: 54, color: '#fb7185', scale: 1.25, zIndex: 13, brightness: 100, msg: 'M6' },

  // --- FILLER EMBELLISHMENTS / SECONDARY FLOWERS ---
  // Creamy Yellow/Vanilla Tulip in the gaps
  { id: 'tl-filler-left', type: 'tulip', x: 41, y: 43, color: '#fef08a', scale: 0.95, zIndex: 9, brightness: 90, rotation: -6 },
  // Pale Rose Tulip in the gaps
  { id: 'tl-filler-right', type: 'tulip', x: 59, y: 43, color: '#fbcfe8', scale: 0.95, zIndex: 9, brightness: 90, rotation: 6 },

  // Pure White Daisies at the front corners
  { id: 'daisy-front-left', type: 'daisy', x: 35, y: 64, color: '#ffffff', scale: 0.88, zIndex: 14, brightness: 100, pollenColor: '#fcd34d' },
  { id: 'daisy-front-right', type: 'daisy', x: 65, y: 64, color: '#ffffff', scale: 0.88, zIndex: 14, brightness: 100, pollenColor: '#fcd34d' },

  // --- FORGROUND BORDERS GREENERY (zIndex: 14) ---
  { id: 'leaf-fg-left', type: 'leaf', x: 23, y: 62, color: '#22c55e', scale: 0.98, zIndex: 14, brightness: 100, rotation: -50 },
  { id: 'leaf-fg-right', type: 'leaf', x: 77, y: 62, color: '#22c55e', scale: 0.98, zIndex: 14, brightness: 100, rotation: 50 },
  { id: 'leaf-fg-inner-l', type: 'leaf', x: 42, y: 20, color: '#16a34a', scale: 0.85, zIndex: 5, brightness: 80, rotation: -12 },
  { id: 'leaf-fg-inner-r', type: 'leaf', x: 58, y: 20, color: '#16a34a', scale: 0.85, zIndex: 5, brightness: 80, rotation: 12 },
];

export const messageDetails: Record<string, MessageDetail> = {
  M1: {
    id: 'M1',
    title: 'A Radiance of Joy',
    theme: 'sunflower',
    body: 'As the central sunflower in our bouquet, this flower represents pure energy, adoration, and standard-bearing happiness. Just as sunflowers track the path of the sun to expand their life force, we invite you to orient your sights toward light, positive actions, and constant growth.',
    link: 'https://en.wikipedia.org/wiki/Common_sunflower'
  },
  M2: {
    id: 'M2',
    title: 'Grace & Fresh Beginnings',
    theme: 'tulip',
    body: 'The rose-red tulip stands as a classic symbol of genuine care, affection, and fresh, resilient beginnings. Tulips bloom in cold soil during early spring, showing us how soft layers can yield incredible strength and stand beautifully upright in changing winds.',
    link: 'https://en.wikipedia.org/wiki/Tulip'
  },
  M3: {
    id: 'M3',
    title: 'The Dance of Velvet Petals',
    theme: 'tulip',
    body: 'A deep orchid-pink tulip represents confident grace, loyalty, and deep, lasting bonds of friendship. This vibrant blossom adds rich emotional balance to the bouquet. Let it whisper appreciation for those who add comfort and sweet laughs to your daily journey.',
    link: 'https://en.wikipedia.org/wiki/Tulip'
  },
  M4: {
    id: 'M4',
    title: 'Golden Fire Perseverance',
    theme: 'sunflower',
    body: 'Dressed in burnt orange-amber shades, this sunflower stands for passion, creativity, and the warmth of late harvest afternoons. It reminds us of structural perseverance: of having strong subterranean roots so we can hold a majestic crown of light overhead with pride.',
    link: 'https://en.wikipedia.org/wiki/Common_sunflower'
  },
  M5: {
    id: 'M5',
    title: 'Adoration & Shared Harmony',
    theme: 'sunflower',
    body: 'This classic golden sunflower embodies absolute focus and shared harmony. Its seed pad pattern is organized into a perfect Fibonacci spiral, a masterwork of natural geometry. Let this design bring mathematical precision, balance, and sun-kissed tranquility to your mind.',
    link: 'https://en.wikipedia.org/wiki/Common_sunflower'
  },
  M6: {
    id: 'M6',
    title: 'Whisper of Pearl Coral',
    theme: 'tulip',
    body: 'Tucked elegantly at the very front focal point, this coral pastel tulip serves as the anchor of our bouquet. It bridges the flaming yellows and emerald leaves with its quiet velvet texture, reminding us that of all forms of expression, active gratitude is the most beautiful.',
    link: 'https://en.wikipedia.org/wiki/Tulip'
  }
};

export const wrappingThemes: WrappingTheme[] = [
  {
    id: 'blush',
    name: 'Blush Velvet',
    backColor: '#fda4af', // pink-300
    midColor: '#fecdd3', // pink-200
    frontColor: '#ffe4e6', // pink-100
    innerGrad: 'linear-gradient(to top, #ffe4e6, #fff1f2)',
    glowColor: 'rgba(251, 113, 133, 0.25)',
    description: 'Soft blush pink wraps creating a dreamy, classic romantic tone.',
  },
  {
    id: 'midnight',
    name: 'Midnight Starry',
    backColor: '#1e1b4b', // indigo-950
    midColor: '#312e81', // indigo-900
    frontColor: '#4338ca', // indigo-700
    innerGrad: 'linear-gradient(to top, #312e81, #1e1b4b)',
    glowColor: 'rgba(129, 140, 248, 0.35)',
    description: 'Immersive deep rich indigo paper, reflecting a magical twilight sky.',
  },
  {
    id: 'lavender',
    name: 'Royal Lilac',
    backColor: '#c084fc', // purple-400
    midColor: '#d8b4fe', // purple-300
    frontColor: '#f3e8ff', // purple-100
    innerGrad: 'linear-gradient(to top, #f3e8ff, #faf5ff)',
    glowColor: 'rgba(192, 132, 252, 0.25)',
    description: 'Luxurious violet/lavender matte finish for royal elegance.',
  },
  {
    id: 'sage',
    name: 'Eucalyptus Sage',
    backColor: '#15803d', // green-700
    midColor: '#4ade80', // green-400
    frontColor: '#bbf7d0', // green-200
    innerGrad: 'linear-gradient(to top, #bbf7d0, #f0fdf4)',
    glowColor: 'rgba(74, 222, 128, 0.25)',
    description: 'Organic fresh green paper folds mimicking botanical gardens.',
  },
  {
    id: 'babyblue',
    name: 'Baby Blue Whisper',
    backColor: '#60a5fa', // blue-400
    midColor: '#93c5fd', // blue-300
    frontColor: '#dbeafe', // blue-100
    innerGrad: 'linear-gradient(to top, #dbeafe, #eff6ff)',
    glowColor: 'rgba(96, 165, 250, 0.25)',
    description: 'Serene, clean sky blue wrap with soft ivory inner texture.',
  },
  {
    id: 'parchment',
    name: 'Golden Parchment',
    backColor: '#b45309',
    midColor: '#fde68a',
    frontColor: '#fffbeb',
    innerGrad: 'linear-gradient(to top, #fffbeb, #fef3c7)',
    glowColor: 'rgba(217, 119, 6, 0.2)',
    description: 'Warm textured linen paper for rustic hand-picked vintage card details.',
  },
  {
    id: 'ebony',
    name: 'Obsidian Velvet',
    backColor: '#0f172a',
    midColor: '#1e293b',
    frontColor: '#334155',
    innerGrad: 'linear-gradient(to top, #1e293b, #0f172a)',
    glowColor: 'rgba(51, 65, 85, 0.3)',
    description: 'Sleek matte charcoal paper, adding striking contrast to golden petals.',
  },
  {
    id: 'plum',
    name: 'Bordeaux Silk',
    backColor: '#701a75',
    midColor: '#c084fc',
    frontColor: '#fdf4ff',
    innerGrad: 'linear-gradient(to top, #fdf4ff, #fae8ff)',
    glowColor: 'rgba(162, 28, 175, 0.25)',
    description: 'Deep plum-burgundy folds with sweet lavender interior margins.',
  }
];

export const ribbonThemes: RibbonTheme[] = [
  {
    id: 'burgundy',
    name: 'Burgundy Velvet',
    primary: '#9f1239', // rose-800
    secondary: '#4c0519', // rose-950
    description: 'Deep royal crimson-wine satin bow.'
  },
  {
    id: 'gold',
    name: 'Satin Gold',
    primary: '#d97706', // amber-600
    secondary: '#78350f', // amber-900
    description: 'Polished golden thread ribbon with metallic highlights.'
  },
  {
    id: 'emerald',
    name: 'Forest Satin',
    primary: '#047857', // emerald-700
    secondary: '#064e3b', // emerald-950
    description: 'Rich dark green textured silky thread.'
  },
  {
    id: 'white',
    name: 'White Premium Silk',
    primary: '#f8fafc', // slate-50
    secondary: '#cbd5e1', // slate-300
    description: 'Elegant ivory cream pure silk ribbon.'
  },
  {
    id: 'ocean_blue',
    name: 'Ocean Blue Silk',
    primary: '#0284c7',
    secondary: '#0c4a6e',
    description: 'Vibrant sea-blue satin thread with high luxury finish.'
  },
  {
    id: 'sweet_rose',
    name: 'Blossom Pink Satin',
    primary: '#ec4899',
    secondary: '#9d174d',
    description: 'Sweet pastel pink ribbon, matching romantic notes.'
  },
  {
    id: 'bronze',
    name: 'Antique Bronze',
    primary: '#b45309',
    secondary: '#451a03',
    description: 'Noble rustic bronze ribbon with classical thread details.'
  }
];

export const backgroundThemes: BackgroundTheme[] = [
  {
    id: 'classic',
    name: 'Classic Warm',
    cssBackground: 'linear-gradient(135deg, #fff5f7 0%, #ffeec3 100%)',
    glowColor: 'rgba(251, 113, 133, 0.2)',
    textColor: '#292524',
    description: 'Soft warm pink-yellow cream gradient'
  },
  {
    id: 'city',
    name: 'City Dusk',
    cssBackground: 'linear-gradient(135deg, #0b0f19 0%, #1e293b 50%, #312e81 100%)',
    glowColor: 'rgba(250, 204, 21, 0.3)',
    textColor: '#f8fafc',
    description: 'Deep midnight blue with amber skyline lights'
  },
  {
    id: 'jungle',
    name: 'Deep Jungle',
    cssBackground: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)',
    glowColor: 'rgba(74, 222, 128, 0.35)',
    textColor: '#f0fdf4',
    description: 'Tropical rich canopy with warm moss gold tones'
  },
  {
    id: 'forest',
    name: 'Ancient Forest',
    cssBackground: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #15803d 100%)',
    glowColor: 'rgba(34, 197, 94, 0.3)',
    textColor: '#f0fdf4',
    description: 'Majestic evergreen woodland shades'
  },
  {
    id: 'taiga',
    name: 'Misty Taiga',
    cssBackground: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)',
    glowColor: 'rgba(45, 212, 191, 0.3)',
    textColor: '#f1f5f9',
    description: 'Boreal dark spruces meets foggy mountain teal'
  },
  {
    id: 'desert',
    name: 'Sahara Sands',
    cssBackground: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)',
    glowColor: 'rgba(254, 215, 170, 0.35)',
    textColor: '#fff7ed',
    description: 'Warm glowing dune dust with sunset skies'
  },
  {
    id: 'snow',
    name: 'Arctic Snow',
    cssBackground: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #93c5fd 100%)',
    glowColor: 'rgba(255, 255, 255, 0.7)',
    textColor: '#1e293b',
    description: 'Frosty cool ice-blue skies with white sparkles'
  },
  {
    id: 'aurora',
    name: 'Celestial Aurora',
    cssBackground: 'linear-gradient(135deg, #030712 0%, #1e1b4b 60%, #0d9488 100%)',
    glowColor: 'rgba(52, 211, 153, 0.45)',
    textColor: '#f8fafc',
    description: 'Midnight star canopy with waves of stellar teal'
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    cssBackground: 'linear-gradient(135deg, #fff1f2 0%, #fbcfe8 50%, #f472b6 100%)',
    glowColor: 'rgba(244, 114, 182, 0.35)',
    textColor: '#1e293b',
    description: 'Ethereal sakura shower in beautiful spring bloom'
  },
  {
    id: 'school',
    name: 'Vintage Classroom',
    cssBackground: 'linear-gradient(135deg, #064e3b 0%, #0f5132 50%, #78350f 100%)',
    glowColor: 'rgba(251, 191, 36, 0.3)',
    textColor: '#f8fafc',
    description: 'Deep mahogany desks and vintage dark slate blackboard'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Starfield',
    cssBackground: 'linear-gradient(135deg, #090514 0%, #1e1b4b 60%, #4c1d95 100%)',
    glowColor: 'rgba(167, 139, 250, 0.45)',
    textColor: '#f8fafc',
    description: 'Deep galaxies and violet stardust nebula clouds'
  },
  {
    id: 'sunset',
    name: 'Dusk Sunset',
    cssBackground: 'linear-gradient(135deg, #881337 0%, #db2777 45%, #ea580c 100%)',
    glowColor: 'rgba(251, 146, 60, 0.45)',
    textColor: '#fff5f5',
    description: 'Brilliant horizontal sunset rays over autumn haze'
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    cssBackground: 'linear-gradient(135deg, #082f49 0%, #0284c7 60%, #0d9488 100%)',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    textColor: '#f0f9ff',
    description: 'Breathtaking aquatic depths with bioluminescent reefs'
  },
  {
    id: 'bedroom',
    name: 'Cozy Bedroom',
    cssBackground: 'linear-gradient(135deg, #fdf8f5 0%, #f5ebd8 55%, #dfa04b 100%)',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    textColor: '#332715',
    description: 'Warm nightstand lamp sepia linen glows'
  }
];

export const staticFoliage: BouquetItem[] = bouquetLayout.filter(f => !f.msg);

export const FLOWER_SLOTS = [
  { id: '1', theme: 'sunflower' as const, x: 50, y: 31, scale: 1.34, zIndex: 12, rotation: 0 },
  { id: '2', theme: 'tulip' as const, x: 36, y: 35, scale: 1.15, zIndex: 10, rotation: -12 },
  { id: '3', theme: 'tulip' as const, x: 64, y: 35, scale: 1.15, zIndex: 10, rotation: 12 },
  { id: '4', theme: 'tulip' as const, x: 50, y: 48, scale: 1.28, zIndex: 13, rotation: 0 },
  { id: '5', theme: 'sunflower' as const, x: 34, y: 44, scale: 1.20, zIndex: 11, rotation: -8 },
  { id: '6', theme: 'sunflower' as const, x: 66, y: 44, scale: 1.20, zIndex: 11, rotation: 8 },
  { id: '7', theme: 'tulip' as const, x: 50, y: 22, scale: 1.10, zIndex: 6, rotation: 4 },
  { id: '8', theme: 'sunflower' as const, x: 26, y: 33, scale: 1.08, zIndex: 8, rotation: -20 },
  { id: '9', theme: 'sunflower' as const, x: 74, y: 33, scale: 1.08, zIndex: 8, rotation: 20 },
  { id: '10', theme: 'tulip' as const, x: 24, y: 49, scale: 1.05, zIndex: 12, rotation: -30 },
  { id: '11', theme: 'tulip' as const, x: 76, y: 49, scale: 1.05, zIndex: 12, rotation: 30 },
  { id: '12', theme: 'tulip' as const, x: 42, y: 41, scale: 1.0, zIndex: 9, rotation: -6 },
  { id: '13', theme: 'tulip' as const, x: 58, y: 41, scale: 1.0, zIndex: 9, rotation: 6 }
];


