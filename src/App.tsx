import React, { useState, useMemo } from 'react';
import { 
  wrappingThemes, 
  ribbonThemes,
  backgroundThemes,
  staticFoliage,
  FLOWER_SLOTS
} from './data';
import { BouquetItem, WrappingTheme, RibbonTheme, MessageDetail, BackgroundTheme } from './types';
import { BouquetCanvas } from './components/BouquetCanvas';
import { Modal } from './components/Modal';
import { 
  Sparkles, 
  ClipboardCopy, 
  RotateCcw, 
  Info, 
  Type, 
  Palette, 
  HeartHandshake,
  CheckCircle,
  HelpCircle,
  Flower,
  Plus,
  Trash2,
  Download,
  Upload,
  Eye,
  X,
  BookOpen,
  Maximize
} from 'lucide-react';

const DEFAULT_FLOWERS: MessageDetail[] = [
  {
    id: 'M1',
    title: 'A Radiance of Joy',
    theme: 'sunflower',
    body: 'As the central sunflower in our bouquet, this flower represents pure energy, adoration, and standard-bearing happiness. Just as sunflowers track the path of the sun to expand their life force, we invite you to orient your sights toward light, positive actions, and constant growth.',
    imageUrl: ''
  },
  {
    id: 'M2',
    title: 'Grace & Fresh Beginnings',
    theme: 'tulip',
    body: 'The rose-red tulip stands as a classic symbol of genuine care, affection, and fresh, resilient beginnings. Tulips bloom in cold soil during early spring, showing us how soft layers can yield incredible strength and stand beautifully upright in changing winds.',
    imageUrl: ''
  },
  {
    id: 'M3',
    title: 'The Dance of Velvet Petals',
    theme: 'tulip',
    body: 'A deep orchid-pink tulip represents confident grace, loyalty, and deep, lasting bonds of friendship. This vibrant blossom adds rich emotional balance to the bouquet. Let it whisper appreciation for those who add comfort and sweet laughs to your daily journey.',
    imageUrl: ''
  },
  {
    id: 'M4',
    title: 'Whisper of Pearl Coral',
    theme: 'tulip',
    body: 'Tucked elegantly at the very front focal point, this coral pastel tulip serves as the anchor of our bouquet. It bridges the flaming yellows and emerald leaves with its quiet velvet texture, reminding us that of all forms of expression, active gratitude is the most beautiful.',
    imageUrl: ''
  }
];

export const LEAF_COLORS = [
  { id: 'green', name: 'Forest Green', hex: '#15803d', shadow: '#14532d', bright: '#22c55e', description: 'Classic fresh evergreen foliage' },
  { id: 'yellow', name: 'Golden Harvest', hex: '#ca8a04', shadow: '#713f12', bright: '#facc15', description: 'Vibrant autumn golden yellow leaves' },
  { id: 'orange', name: 'Sunset Amber', hex: '#ea580c', shadow: '#854d0e', bright: '#fdba74', description: 'Warm glowing maple amber leaves' },
  { id: 'red', name: 'Fireside Crimson', hex: '#b91c1c', shadow: '#7f1d1d', bright: '#f87171', description: 'Deep elegant crimson red foliage' },
];

export default function App() {
  // Page states
  const [selectedPaper, setSelectedPaper] = useState<WrappingTheme>(wrappingThemes[0]);
  const [selectedRibbon, setSelectedRibbon] = useState<RibbonTheme>(ribbonThemes[0]);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundTheme>(backgroundThemes[0]);
  const [selectedLeafColor, setSelectedLeafColor] = useState<string>('green');
  const [customMsg, setCustomMsg] = useState<string>('Wishing you endless sunshine!');
  const [hoveredFlowerId, setHoveredFlowerId] = useState<string | null>(null);
  const [selectedFlowerMsg, setSelectedFlowerMsg] = useState<string | null>(null);
  const [showShareNotification, setShowShareNotification] = useState<boolean>(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState<boolean>(false);

  // Dynamic state for adding/editing flowers (Starts with default of 4 message flowers)
  const [activeFlowers, setActiveFlowers] = useState<MessageDetail[]>(DEFAULT_FLOWERS);
  const [editingLetterId, setEditingLetterId] = useState<string>('M1');
  
  // JSON Import storage
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [showImportArea, setShowImportArea] = useState<boolean>(false);

  // Compute dynamic combined bouquet layout consisting of fillers and the custom active message flowers
  const dynamicBouquetLayout = useMemo(() => {
    const selectedPalette = LEAF_COLORS.find(c => c.id === selectedLeafColor) || LEAF_COLORS[0];
    
    // Map leafy greens organically to custom colors if override is active
    const mappedFoliage = staticFoliage.map(item => {
      if (item.type === 'leaf') {
        let mappedColor = item.color;
        if (selectedLeafColor !== 'green') {
          // Check if deep/backing, mid, or light border foliage
          if (item.color === '#15522e' || item.color === '#114224' || item.color === '#0d331b') {
            mappedColor = selectedPalette.shadow;
          } else if (item.color === '#22c55e' || item.color === '#16a34a') {
            mappedColor = selectedPalette.bright;
          } else {
            mappedColor = selectedPalette.hex;
          }
        }
        return { ...item, color: mappedColor };
      }
      return item;
    });

    const list: BouquetItem[] = [...mappedFoliage];
    const N = activeFlowers.length;
    // Scale all flowers down dynamically if there are many active layout items to look decent
    const scaleFactor = Math.max(0.72, 1.0 - Math.max(0, N - 4) * 0.045);

    activeFlowers.forEach((flower, index) => {
      const slot = FLOWER_SLOTS[Math.min(index, FLOWER_SLOTS.length - 1)];
      
      // Rotate blossom coloring palette to build organic diversity
      const color = flower.theme === 'sunflower' 
        ? (index % 3 === 0 ? '#facc15' : index % 3 === 1 ? '#ea580c' : '#eab308')
        : (index % 3 === 0 ? '#e11d48' : index % 3 === 1 ? '#db2777' : '#fb7185');

      list.push({
        id: `flower-${flower.id}`,
        type: flower.theme,
        x: slot.x,
        y: slot.y,
        color: color,
        scale: slot.scale * scaleFactor,
        zIndex: slot.zIndex,
        brightness: 100,
        msg: flower.id,
        rotation: slot.rotation
      });
    });

    return list;
  }, [activeFlowers, selectedLeafColor]);

  // Compute live dictionary details mapping
  const editableMessages = useMemo(() => {
    const map: Record<string, MessageDetail> = {};
    activeFlowers.forEach(f => {
      map[f.id] = f;
    });
    return map;
  }, [activeFlowers]);

  // Math stats computed reactively
  const interactiveFlowers = useMemo(() => {
    return dynamicBouquetLayout.filter(f => f.msg);
  }, [dynamicBouquetLayout]);

  const leafCount = useMemo(() => {
    return dynamicBouquetLayout.filter(f => f.type === 'leaf').length;
  }, [dynamicBouquetLayout]);

  const flowerCount = useMemo(() => {
    return dynamicBouquetLayout.filter(f => f.type !== 'leaf').length;
  }, [dynamicBouquetLayout]);

  // Compute atmospheric background particles based on active theme
  const backgroundParticles = useMemo(() => {
    const bgId = selectedBackground.id;
    const particles = [];
    
    let type = 'dot';
    let colors = ['rgba(255,255,255,0.7)'];
    
    if (bgId === 'classic' || bgId === 'cherry') {
      type = 'petal';
      colors = ['#fbcfe8', '#f3a8c3', '#f472b6', '#fda4af'];
    } else if (bgId === 'city' || bgId === 'cosmic' || bgId === 'aurora' || bgId === 'bedroom') {
      type = 'star';
      colors = bgId === 'aurora' ? ['#a7f3d0', '#6ee7b7', '#fff', '#34d399'] : ['#fef08a', '#fda4af', '#fef3c7', '#fff'];
    } else if (bgId === 'jungle' || bgId === 'forest') {
      type = 'leaf';
      colors = bgId === 'jungle' ? ['#4ade80', '#22c55e', '#bef264', '#fbbf24'] : ['#15803d', '#a3e635', '#22c55e', '#eab308'];
    } else if (bgId === 'taiga') {
      type = 'dot';
      colors = ['rgba(45, 212, 191, 0.4)', 'rgba(20, 184, 166, 0.3)', 'rgba(255,255,255,0.2)'];
    } else if (bgId === 'desert' || bgId === 'sunset') {
      type = 'ember';
      colors = ['#ef4444', '#f97316', '#f59e0b', '#fb7185', '#ea580c'];
    } else if (bgId === 'ocean' || bgId === 'snow') {
      type = 'bubble';
      colors = bgId === 'ocean' ? ['rgba(14, 165, 233, 0.4)', 'rgba(56, 189, 248, 0.3)', 'rgba(255,255,255,0.45)'] : ['#ffffff', '#e0f2fe', '#bae6fd'];
    } else if (bgId === 'school') {
      type = 'dot';
      colors = ['rgba(255,255,255,0.25)', 'rgba(254,240,138,0.2)'];
    }
    
    for (let i = 0; i < 15; i++) {
      const sizeVal = 5 + (i * 7 + 13) % 12; // 5 to 17px
      const leftVal = (i * 23 + 7) % 100;
      const delayVal = ((i * 1.3) % 8).toFixed(1);
      const durationVal = 8 + ((i * 3.7) % 10);
      const color = colors[i % colors.length];
      
      let animationClass = 'animate-drift-down';
      if (type === 'ember' || type === 'bubble') {
        animationClass = 'animate-drift-up';
      } else if (type === 'star' || type === 'dot') {
        animationClass = 'animate-float-gentle';
      }
      
      particles.push({
        id: `part-${i}`,
        className: animationClass,
        style: {
          position: 'absolute',
          left: `${leftVal}%`,
          width: `${sizeVal}px`,
          height: `${sizeVal}px`,
          backgroundColor: type !== 'star' ? color : 'transparent',
          backgroundImage: type === 'star' ? `radial-gradient(circle, ${color} 20%, transparent 80%)` : undefined,
          borderRadius: type === 'petal' ? '0 100% 0 100%' : type === 'leaf' ? '50% 0 50% 0' : '50%',
          boxShadow: type === 'ember' ? `0 0 10px ${color}` : type === 'bubble' ? 'inset 0 0 4px rgba(255,255,255,0.6)' : undefined,
          animationDelay: `${delayVal}s`,
          '--drift-duration': `${durationVal}s`,
          '--float-duration': `${durationVal - 3}s`,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 0,
          transformOrigin: 'center',
        } as React.CSSProperties
      });
    }
    
    return particles;
  }, [selectedBackground]);

  // Handle active flower selection to trigger modal & set current editor ID
  const handleSelectFlowerItem = (item: BouquetItem) => {
    if (item.msg) {
      setSelectedFlowerMsg(item.msg);
      setEditingLetterId(item.msg);
    }
  };

  // Helper to dynamically update fields on a localized message
  const handleUpdateLetterField = (id: string, field: 'title' | 'body' | 'imageUrl' | 'theme', value: string) => {
    setActiveFlowers(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, [field]: value };
      }
      return f;
    }));
  };

  // Add a new message flower dynamically (limits at max support slot length to maintain high visual standard)
  const handleAddFlower = () => {
    if (activeFlowers.length >= FLOWER_SLOTS.length) {
      alert(`The arrangement reaches peak visual harmony at ${FLOWER_SLOTS.length} letter sprouts. Any more would overflow the wrap folds!`);
      return;
    }
    const nextNum = activeFlowers.length + 1;
    const newId = `M${nextNum}`;
    const newTheme = nextNum % 2 === 0 ? 'sunflower' : 'tulip';
    const newFlower: MessageDetail = {
      id: newId,
      title: `Ethereal Blossom ${nextNum}`,
      theme: newTheme,
      body: `This newly sprouted blossom is index ${nextNum} in our responsive bouquet. You can fully customize its name and symbolical message below.`,
      imageUrl: ''
    };
    setActiveFlowers(prev => [...prev, newFlower]);
    setEditingLetterId(newId);
  };

  // Remove the specified flower and automatically re-index the remaining ones chronologically
  const handleRemoveFlower = (id: string) => {
    if (activeFlowers.length <= 1) {
      alert("At least one message flower is required to preserve the bouquet core.");
      return;
    }
    setActiveFlowers(prev => {
      const filtered = prev.filter(f => f.id !== id);
      const remapped = filtered.map((f, idx) => ({
        ...f,
        id: `M${idx + 1}`
      }));
      
      // Sync active view ID
      const stillExists = remapped.some(f => f.id === editingLetterId);
      if (!stillExists && remapped.length > 0) {
        setEditingLetterId(remapped[remapped.length - 1].id);
      }
      return remapped;
    });
  };

  // Reset to default crafting state
  const handleReset = () => {
    setSelectedPaper(wrappingThemes[0]);
    setSelectedRibbon(ribbonThemes[0]);
    setSelectedBackground(backgroundThemes[0]);
    setCustomMsg('Wishing you endless sunshine!');
    setActiveFlowers(DEFAULT_FLOWERS);
    setEditingLetterId('M1');
    setImportJsonText('');
    setShowImportArea(false);
  };

  // Generate of unified HTML, CSS, & JS code of just the bouquet excluding the editor dashboard
  const generateUnifiedBouquetCode = (): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elegant Interactive 3D Bouquet</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;1,450&display=swap" rel="stylesheet">
  <style>
    :root {
      --scaler: 1;
      --paper-back: ${selectedPaper.backColor};
      --paper-mid: ${selectedPaper.midColor};
      --paper-front: ${selectedPaper.frontColor};
      --paper-glow: ${selectedPaper.glowColor};
      --paper-inner: ${selectedPaper.innerGrad};
      --ribbon-primary: ${selectedRibbon.primary};
      --ribbon-secondary: ${selectedRibbon.secondary};
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: ${selectedBackground.cssBackground};
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow-x: hidden;
      color: ${selectedBackground.textColor};
      padding: 30px 15px;
    }

    /* Keyframes Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-12px) rotate(0.8deg); }
    }

    @keyframes drift-down-right {
      0% { transform: translateY(-50px) translateX(-50px) rotate(0deg); opacity: 0; }
      15% { opacity: 0.8; }
      85% { opacity: 0.8; }
      100% { transform: translateY(110vh) translateX(120px) rotate(360deg); opacity: 0; }
    }

    @keyframes drift-up-left {
      0% { transform: translateY(110vh) translateX(50px) scale(0.8); opacity: 0; }
      20% { opacity: 0.7; }
      80% { opacity: 0.7; }
      100% { transform: translateY(-100px) translateX(-100px) scale(1.2); opacity: 0; }
    }

    @keyframes float-gentle {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); opacity: 0.3; }
      50% { transform: translateY(-30px) translateX(20px) scale(1.1) rotate(15deg); opacity: 0.85; }
    }

    @keyframes sway-slow {
      0%, 100% { transform: rotate(calc(var(--angle, 0deg) - 3deg)); }
      50% { transform: rotate(calc(var(--angle, 0deg) + 3deg)); }
    }

    @keyframes sway-med {
      0%, 100% { transform: rotate(calc(var(--angle, 0deg) - 4deg)); }
      50% { transform: rotate(calc(var(--angle, 0deg) + 4deg)); }
    }

    @keyframes card-swing {
      0%, 100% { transform: rotate(-10deg); }
      50% { transform: rotate(-15deg) translateY(1px); }
    }

    @keyframes sparkle {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    @keyframes pulse-glow {
      0%, 100% { transform: scale(0.8); opacity: 0.4; }
      50% { transform: scale(1.3); opacity: 0; }
    }

    .bouquet-scaler-wrapper {
      width: calc(440px * var(--scaler, 1));
      height: calc(585px * var(--scaler, 1));
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
      position: relative;
    }

    .bouquet-scaler-box {
      width: 440px;
      height: 585px;
      transform: scale(var(--scaler, 1));
      transform-origin: center center;
      position: absolute;
    }

    /* Core Bouquet Frame */
    .bouquet-wrapper {
      width: 440px;
      height: 585px;
      position: relative;
      border-radius: 32px;
      animation: float 7s ease-in-out infinite;
      box-shadow: 0 30px 60px -15px rgba(225, 120, 150, 0.22);
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.95) 0%, var(--paper-glow) 65%, rgba(255, 255, 255, 0) 100%);
    }

    /* Paper Wrap Back */
    .wrap-back {
      position: absolute;
      inset: 0;
      z-index: 1;
      clip-path: polygon(15% 10%, 85% 10%, 100% 45%, 50% 100%, 0% 45%);
      background: linear-gradient(135deg, var(--paper-back) 0%, var(--paper-mid) 50%, var(--paper-back) 100%);
      box-shadow: inset 0 0 50px rgba(0,0,0,0.06);
    }

    .wrap-back-shade-left {
      position: absolute;
      inset: 0;
      z-index: 1;
      clip-path: polygon(15% 10%, 50% 10%, 50% 100%, 0% 45%);
      background: linear-gradient(to right, rgba(0,0,0,0.05), transparent);
    }
    
    .wrap-back-shade-right {
      position: absolute;
      inset: 0;
      z-index: 1;
      clip-path: polygon(50% 10%, 85% 10%, 100% 45%, 50% 100%);
      background: linear-gradient(to left, rgba(0,0,0,0.05), transparent);
    }

    /* Paper Wrap Mid Pocket */
    .wrap-mid {
      position: absolute;
      inset: 0;
      z-index: 3;
      clip-path: polygon(5% 42%, 95% 42%, 50% 100%);
      background: var(--paper-inner);
    }

    .wrap-mid-shadow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, transparent 20%, rgba(0,0,0,0.12) 100%);
      mix-blend-mode: multiply;
    }

    /* Paper Wrap Front Collar Collars */
    .wrap-front-left {
      position: absolute;
      inset: 0;
      z-index: 16;
      clip-path: polygon(0% 41%, 50% 77%, 25% 100%, 0% 74%);
      background: linear-gradient(135deg, var(--paper-front) 0%, var(--paper-mid) 50%, rgba(0,0,0,0.04) 100%);
      box-shadow: inset -5px 10px 15px rgba(255,255,255,0.4);
    }

    .wrap-front-right {
      position: absolute;
      inset: 0;
      z-index: 16;
      clip-path: polygon(100% 41%, 100% 74%, 75% 100%, 50% 77%);
      background: linear-gradient(-135deg, var(--paper-front) 0%, var(--paper-mid) 50%, rgba(0,0,0,0.08) 100%);
    }

    .wrap-front-crease-left {
      position: absolute;
      inset: 0;
      z-index: 16;
      clip-path: polygon(0% 41%, 50% 77%, 50% 79%, 0% 43%);
      background: rgba(0,0,0,0.12);
      filter: blur(1.5px);
    }

    .wrap-front-crease-right {
      position: absolute;
      inset: 0;
      z-index: 16;
      clip-path: polygon(50% 77%, 100% 41%, 100% 43%, 50% 79%);
      background: rgba(0,0,0,0.12);
      filter: blur(1.5px);
    }

    .wrap-skirt {
      position: absolute;
      inset: 0;
      z-index: 16;
      clip-path: polygon(15% 76%, 85% 76%, 90% 100%, 10% 100%);
      background: linear-gradient(to bottom, var(--paper-mid), var(--paper-back));
    }

    /* Stems Container */
    .stems-box {
      position: absolute;
      inset: 0;
      z-index: 2;
    }

    .stem-bar {
      transform-origin: bottom center;
      background: linear-gradient(to top, #114224 0%, #15803d 40%, #22c55e 100%);
      border-radius: 1.5px;
      opacity: 0.82;
      box-shadow: 1px 1px 2px rgba(0,0,0,0.15);
    }

    /* Interactive Flower Elements */
    .flower-elm {
      position: absolute;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .flower-elm:hover {
      z-index: 30 !important;
      filter: brightness(115%) drop-shadow(0 10px 15px rgba(0,0,0,0.22)) !important;
      transform: translate(-50%, -50%) scale(1.3) !important;
    }

    /* Foliage structures */
    .leaf-graphic {
      width: 56px;
      height: 24px;
      border-radius: 0 50% 0 50%;
      border-left: 1px solid rgba(255,255,255,0.15);
      border-top: 1px solid rgba(255,255,255,0.15);
      box-shadow: inset -2px 2px 4px rgba(255,255,255,0.15), inset 2px -2px 6px rgba(0,0,0,0.3);
      position: relative;
    }

    .leaf-vein-line {
      position: absolute;
      top: 50%;
      left: 0;
      width: 90%;
      height: 1.5px;
      background: rgba(5, 46, 22, 0.35);
      transform: rotate(-10deg) scaleY(0.8);
      transform-origin: left;
    }

    /* Overlapping Velvet Tulips */
    .tulip-graphic {
      width: 48px;
      height: 56px;
      position: relative;
    }

    .tulip-calyx-node {
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 12px;
      background: rgba(21, 128, 61, 0.8);
      border-radius: 0 0 12px 12px;
      z-index: 1;
    }

    .tulip-petal-back {
      position: absolute;
      bottom: 0;
      left: 20%;
      width: 60%;
      height: 95%;
      border-radius: 0 0 50% 50% / 0 0 45% 45%;
      border-top-left-radius: 45%;
      border-top-right-radius: 45%;
      box-shadow: inset 0 -8px 10px rgba(0,0,0,0.2);
      z-index: 1;
    }

    .tulip-petal-left {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60%;
      height: 88%;
      border-radius: 0 0 50% 50% / 0 0 55% 55%;
      border-top-left-radius: 55%;
      transform: rotate(-14deg);
      transform-origin: bottom right;
      box-shadow: inset 2px -4px 6px rgba(0,0,0,0.15);
      z-index: 2;
    }

    .tulip-petal-right {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 60%;
      height: 88%;
      border-radius: 0 0 50% 50% / 0 0 55% 55%;
      border-top-right-radius: 55%;
      transform: rotate(14deg);
      transform-origin: bottom left;
      box-shadow: inset -2px -4px 6px rgba(0,0,0,0.15);
      z-index: 3;
    }

    /* Large Dynamic Sunflowers */
    .sunflower-graphic {
      width: 88px;
      height: 88px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sunflower-petal-segment {
      position: absolute;
      width: 11%;
      height: 40%;
      border-radius: 50% 50% 40% 40%;
      top: 10%;
      left: 44.5%;
      transform-origin: 50% 100%;
      box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 1px 2px 3px rgba(0,0,0,0.1);
    }

    .sunflower-petal-inner-layer {
      position: absolute;
      width: 9%;
      height: 34%;
      border-radius: 50% 50% 45% 45%;
      top: 16%;
      left: 45.5%;
      transform-origin: 50% 100%;
      opacity: 0.9;
      transform: scale(0.9);
    }

    .sunflower-seed-disc {
      position: absolute;
      width: 36%;
      height: 36%;
      border-radius: 50%;
      background: radial-gradient(circle, #261204 0%, #3a1c02 35%, #592c04 70%, #150901 100%);
      box-shadow: inset 0 0 10px rgba(0,0,0,0.9);
      border: 1px solid rgba(245, 158, 11, 0.25);
      z-index: 10;
    }

    /* Secondary Daisies */
    .daisy-graphic {
      width: 56px;
      height: 56px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .daisy-petal-fringe {
      position: absolute;
      width: 12%;
      height: 42%;
      border-radius: 50%;
      background: linear-gradient(to top, #e2e8f0, #ffffff);
      top: 8%;
      left: 44%;
      transform-origin: 50% 100%;
      box-shadow: 0 1.5px 2px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.8);
    }

    .daisy-pollen-core {
      position: absolute;
      width: 28%;
      height: 28%;
      border-radius: 50%;
      box-shadow: inset 0 2px 4px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.15);
      z-index: 10;
    }

    /* Interaction Nodes */
    .node-glowing-glow {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 15;
    }

    .node-pulse-circle {
      position: absolute;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(245, 158, 11, 0.3);
      border: 1.5px solid rgba(245, 158, 11, 0.8);
      animation: pulse-glow 2s infinite ease-in-out;
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.6);
    }

    .node-core-dot {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #f59e0b;
      box-shadow: 0 0 8px #fde047, 0 0 16px #f59e0b;
    }

    /* Sparkles vectors */
    .sparkle-shape {
      position: absolute;
      background: #ffffff;
      z-index: 15;
      pointer-events: none;
      border-radius: 50%;
      animation: sparkle 2.5s ease-in-out infinite;
      box-shadow: 0 0 8px #ffffff, 0 0 15px #facc15;
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }

    /* Silk Ribbon styling */
    .ribbon-assembly {
      position: absolute;
      z-index: 17;
      transform: translate(-50%, -15%);
    }

    .ribbon-skirt-tail-l {
      position: absolute;
      width: 16px;
      height: 112px;
      border-radius: 0 0 100% 0;
      background: linear-gradient(to bottom right, var(--ribbon-primary), var(--ribbon-secondary));
      transform: rotate(-18deg) skewY(15deg);
      clip-path: polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%);
      left: -14px;
      top: 5px;
      box-shadow: 1px 3px 5px rgba(0,0,0,0.15);
    }

    .ribbon-skirt-tail-r {
      position: absolute;
      width: 16px;
      height: 112px;
      border-radius: 0 0 0 100%;
      background: linear-gradient(to bottom left, var(--ribbon-primary), var(--ribbon-secondary));
      transform: rotate(18deg) skewY(-15deg);
      clip-path: polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%);
      left: 6px;
      top: 5px;
      box-shadow: -1px 3px 5px rgba(0,0,0,0.15);
    }

    .ribbon-petal-loop-l {
      position: absolute;
      width: 56px;
      height: 32px;
      border-radius: 50% 35% 35% 50%;
      background: radial-gradient(ellipse at right, var(--ribbon-primary) 30%, var(--ribbon-secondary) 100%);
      transform: rotate(-20deg);
      transform-origin: right center;
      border: 1px solid rgba(255,255,255,0.15);
      left: -52px;
      top: -14px;
      box-shadow: -3px 3px 6px rgba(0,0,0,0.16);
    }

    .ribbon-petal-loop-r {
      position: absolute;
      width: 56px;
      height: 32px;
      border-radius: 35% 50% 50% 35%;
      background: radial-gradient(ellipse at left, var(--ribbon-primary) 30%, var(--ribbon-secondary) 100%);
      transform: rotate(20deg);
      transform-origin: left center;
      border: 1px solid rgba(255,255,255,0.15);
      left: 12px;
      top: -14px;
      box-shadow: 3px 3px 6px rgba(0,0,0,0.16);
    }

    .ribbon-center-loop-void {
      position: absolute;
      width: 16px;
      height: 8px;
      background: rgba(0,0,0,0.25);
      border-radius: 50%;
      top: 50%;
      transform: translateY(-50%);
    }

    .ribbon-knot-bead {
      position: relative;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      z-index: 2;
      border: 1px solid rgba(255,255,255,0.2);
      background: radial-gradient(circle at 35% 35%, var(--ribbon-primary) 0%, var(--ribbon-secondary) 100%);
      box-shadow: 0 4px 8px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.4);
    }

    /* Hanging Greeting Tag Card */
    .note-card-assembly {
      position: absolute;
      z-index: 18;
      cursor: pointer;
      background: #fafaf9;
      border: 1.5px solid rgba(217, 119, 6, 0.35);
      padding: 10px 12px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      animation: card-swing 5s ease-in-out infinite;
      transform-origin: 50% -10px;
      box-shadow: 2px 8px 15px rgba(120,60,30,0.12);
      left: 58%;
      top: 74%;
      width: 122px;
      min-height: 85px;
    }

    .note-cord-tie {
      position: absolute;
      width: 1px;
      background: rgba(180, 83, 9, 0.5);
      height: 35px;
      top: -35px;
      left: 50%;
    }

    .note-metal-eyelet {
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #f59e0b;
      border: 1px solid #78350f;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .note-eyelet-hole {
      width: 3px;
      height: 3px;
      background: #451a03;
      border-radius: 50%;
    }

    .note-header-txt {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      font-weight: bold;
      color: #78350f;
      letter-spacing: 0.1em;
      text-align: center;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(217, 119, 6, 0.15);
      padding-bottom: 2px;
      margin-top: 4px;
    }

    .note-body-txt {
      font-family: 'Playfair Display', serif;
      font-size: 10px;
      font-style: italic;
      color: #44403c;
      line-height: 1.3;
      text-align: center;
      margin: 6px 0;
    }

    .note-footer-action {
      font-size: 6px;
      text-transform: uppercase;
      color: #a8a29e;
      text-align: center;
      font-weight: bold;
      letter-spacing: 0.1em;
    }

    /* Modal dialog */
    .modal-dialog-box {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(67, 20, 30, 0.15);
      backdrop-filter: blur(10px);
    }

    .modal-content-card {
      position: relative;
      width: 100%;
      max-width: 480px;
      background: #fafaf9;
      color: #1c1917;
      padding: 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      transition: all 0.3s;
    }

    .modal-badge-tag {
      display: inline-block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-weight: bold;
      padding: 4px 10px;
      border-radius: 99px;
      margin-bottom: 16px;
    }

    .modal-headline {
      font-family: 'Cinzel', serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1c1917;
      margin-bottom: 16px;
    }

    .modal-decoration-line {
      height: 1px;
      margin: 16px 0;
    }

    .modal-rich-text {
      font-family: 'Playfair Display', serif;
      font-size: 1.05rem;
      color: #44403c;
      line-height: 1.6;
    }

    .modal-close-trigger {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid #e7e5e4;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #78716c;
      transition: 0.2s;
    }

    .modal-close-trigger:hover {
      background: #f5f5f4;
      color: #1c1917;
    }

    .modal-image-banner {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 16px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      display: block;
    }

    /* Modal Themes matching selected colors */
    .modal-tulip-style {
      border-radius: 30px 110px 30px 110px;
      border: 6px solid #fecdd3;
    }
    .modal-tulip-style .modal-badge-tag {
      background: #ffe4e6;
      color: #9f1239;
    }
    .modal-tulip-style .modal-decoration-line { background-color: #fecdd3; }

    .modal-sunflower-style {
      border-radius: 20px;
      border: 10px solid #facc15;
    }
    .modal-sunflower-dashed-inset {
      position: absolute;
      inset: 4px;
      border: 1.5px dashed #78350f;
      border-radius: 12px;
      pointer-events: none;
      opacity: 0.5;
    }
    .modal-sunflower-style .modal-badge-tag {
      background: #fef3c7;
      color: #92400e;
    }
    .modal-sunflower-style .modal-decoration-line { background-color: #fde047; }
  </style>
</head>
<body>
  <!-- Atmospheric background drift overlay particles -->
  <div id="atmosphere" style="position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0;"></div>

  <div class="bouquet-scaler-wrapper" style="position: relative; z-index: 10;">
    <div class="bouquet-scaler-box">
      <div class="bouquet-wrapper">
        <!-- Paper Wrap Back -->
        <div class="wrap-back"></div>
        <div class="wrap-back-shade-left"></div>
        <div class="wrap-back-shade-right"></div>

        <!-- Mathematical Stems Container -->
        <div class="stems-box" id="stems-target"></div>

        <!-- Wrap Pocket Middle -->
        <div class="wrap-mid">
          <div class="wrap-mid-shadow"></div>
        </div>

        <!-- Flow and leaf container -->
        <div id="flowers-target"></div>

        <!-- Foreground Paper Folds -->
        <div class="wrap-front-left"></div>
        <div class="wrap-front-right"></div>
        <div class="wrap-front-crease-left"></div>
        <div class="wrap-front-crease-right"></div>
        <div class="wrap-skirt"></div>

        <!-- Ribbon Knot & Bow -->
        <div class="ribbon-assembly" id="ribbon-target-el" style="left: 50%; top: 77%; cursor: help;" title="Keep press on ribbon to copy bouquet config JSON string.">
          <div class="ribbon-skirt-tail-l"></div>
          <div class="ribbon-skirt-tail-r"></div>
          <div class="ribbon-petal-loop-l">
            <div class="ribbon-center-loop-void" style="right: 15%;"></div>
          </div>
          <div class="ribbon-petal-loop-r">
            <div class="ribbon-center-loop-void" style="left: 15%;"></div>
          </div>
          <div class="ribbon-knot-bead"></div>
        </div>

        <!-- Hanging greeting card tag -->
        <div class="note-card-assembly" onclick="alert('Card Letter:\\n\\n\\&quot;${customMsg.replace(/'/g, "\\'")}\\&quot;')">
          <div class="note-cord-tie"></div>
          <div class="note-metal-eyelet"><div class="note-eyelet-hole"></div></div>
          <div class="note-title">For You</div>
          <div class="note-body-txt">"${customMsg}"</div>
          <div class="note-footer-action">● Tap Note ●</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Component Dialog -->
  <div class="modal-dialog-box" id="modal-screen" onclick="closeModal()">
    <div class="modal-content-card" id="modal-interior" onclick="event.stopPropagation()">
      <div id="modal-sunflower-ring"></div>
      <button class="modal-close-trigger" onclick="closeModal()">✕</button>
      <img class="modal-image-banner" id="modal-image-banner" alt="Floral letter cover" src="" onerror="handleModalImageError()" />
      <div class="modal-badge-tag" id="modal-header">🌷 Category</div>
      <h2 class="modal-headline" id="modal-title">Flower Profile</h2>
      <div class="modal-decoration-line"></div>
      <div class="modal-rich-text" id="modal-description">Biography details here...</div>
    </div>
  </div>

  <script>
    // Config layout array mapping items
    const layout = ${JSON.stringify(dynamicBouquetLayout)};

    // Message profiles details
    const messages = ${JSON.stringify(editableMessages)};

    const BASE_Y_PERC = 77;
    const BASE_X_PERC = 50;
    const FRAME_W = 440;
    const FRAME_H = 585;

    const stemsContainer = document.getElementById('stems-target');
    const flowersContainer = document.getElementById('flowers-target');

    // Generating Dynamic Stems using trig ratios on load
    layout.forEach(item => {
      const fx = FRAME_W * (item.x / 100);
      const fy = FRAME_H * (item.y / 100);
      const bx = FRAME_W * (BASE_X_PERC / 100);
      const by = FRAME_H * (BASE_Y_PERC / 100);

      const dx = fx - bx;
      const dy = fy - by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      const stemElement = document.createElement('div');
      stemElement.className = 'stem-bar';
      stemElement.style.position = 'absolute';
      stemElement.style.left = bx + 'px';
      stemElement.style.top = (by - dist) + 'px';
      stemElement.style.width = item.type === 'sunflower' ? '3.8px' : '2.8px';
      stemElement.style.height = dist + 'px';
      stemElement.style.transform = 'rotate(' + angle + 'deg)';
      stemsContainer.appendChild(stemElement);

      // Generating CSS Vector Art Node
      const node = document.createElement('div');
      node.className = 'flower-elm';
      node.style.left = item.x + '%';
      node.style.top = item.y + '%';
      node.style.transform = 'translate(-50%, -50%) scale(' + item.scale + ')';
      node.style.zIndex = item.zIndex;
      node.style.filter = 'brightness(' + item.brightness + '%) drop-shadow(0 4px 8px rgba(0,0,0,0.125))';
      node.style.setProperty('--angle', (item.rotation || 0) + 'deg');

      if (item.msg) {
        node.onclick = () => showModal(item.msg);
      }

      // Populate botanical vectors
      if (item.type === 'leaf') {
        const swayClass = item.zIndex < 8 ? 'sway-slow' : 'sway-med';
        const rot = item.rotation || 0;

        const leaf = document.createElement('div');
        leaf.className = 'leaf-graphic';
        leaf.style.background = 'linear-gradient(135deg, ' + item.color + ', ' + getDarkerHex(item.color) + ')';
        leaf.style.transform = 'rotate(' + rot + 'deg)';
        leaf.style.transformOrigin = '20% 50%';
        leaf.style.animation = swayClass + ' ' + (item.zIndex < 8 ? '4.5s' : '3.5s') + ' ease-in-out infinite';

        const vein = document.createElement('div');
        vein.className = 'leaf-vein-line';
        leaf.appendChild(vein);
        node.appendChild(leaf);

      } else if (item.type === 'tulip') {
        const tulip = document.createElement('div');
        tulip.className = 'tulip-graphic';
        tulip.style.transform = 'rotate(' + (item.rotation || 0) + 'deg)';

        const calyx = document.createElement('div');
        calyx.className = 'tulip-calyx-node';

        const pBack = document.createElement('div');
        pBack.className = 'tulip-petal-back';
        pBack.style.background = 'linear-gradient(to top, ' + getDarkerHex(item.color) + ', ' + item.color + ')';

        const pL = document.createElement('div');
        pL.className = 'tulip-petal-left';
        pL.style.background = 'linear-gradient(to top right, ' + getDarkerHex(item.color) + ', ' + item.color + ', ' + getLighterHex(item.color) + ')';

        const pR = document.createElement('div');
        pR.className = 'tulip-petal-right';
        pR.style.background = 'linear-gradient(to top left, ' + item.color + ', ' + getLighterHex(item.color) + ')';

        tulip.appendChild(calyx);
        tulip.appendChild(pBack);
        tulip.appendChild(pL);
        tulip.appendChild(pR);
        node.appendChild(tulip);

      } else if (item.type === 'sunflower') {
        const sf = document.createElement('div');
        sf.className = 'sunflower-graphic';

        // 12 outer petals
        for (let i = 0; i < 12; i++) {
          const petal = document.createElement('div');
          petal.className = 'sunflower-petal-segment';
          petal.style.background = 'linear-gradient(to top, ' + item.color + ', ' + getLighterHex(item.color) + ')';
          petal.style.transform = 'rotate(' + (i * 30) + 'deg)';
          sf.appendChild(petal);
        }

        // 12 inner petals
        for (let i = 0; i < 12; i++) {
          const innerPetal = document.createElement('div');
          innerPetal.className = 'sunflower-petal-inner-layer';
          innerPetal.style.background = 'linear-gradient(to top, ' + getDarkerHex(item.color) + ', ' + item.color + ')';
          innerPetal.style.transform = 'rotate(' + (i * 30 + 15) + 'deg)';
          sf.appendChild(innerPetal);
        }

        const core = document.createElement('div');
        core.className = 'sunflower-seed-disc';
        sf.appendChild(core);
        node.appendChild(sf);

      } else if (item.type === 'daisy') {
        const ds = document.createElement('div');
        ds.className = 'daisy-graphic';

        // 8 white petals
        for (let i = 0; i < 8; i++) {
          const petal = document.createElement('div');
          petal.className = 'daisy-petal-fringe';
          petal.style.transform = 'rotate(' + (i * 45) + 'deg)';
          ds.appendChild(petal);
        }

        const center = document.createElement('div');
        center.className = 'daisy-pollen-core';
        center.style.background = 'radial-gradient(circle, ' + (item.pollenColor || '#fbbf24') + ' 0%, ' + getDarkerHex(item.color) + ' 100%)';
        ds.appendChild(center);
        node.appendChild(ds);
      }

      // Overlay interactive Tag Indicator
      if (item.msg) {
        const assembly = document.createElement('div');
        assembly.className = 'node-glowing-glow';

        const wave = document.createElement('div');
        wave.className = 'node-pulse-circle';

        const core = document.createElement('div');
        core.className = 'node-core-dot';

        assembly.appendChild(wave);
        assembly.appendChild(core);
        node.appendChild(assembly);
      }

      flowersContainer.appendChild(node);
    });

    // Twinkling Sparkles Loader
    const sparklesCoords = [
      { left: '22%', top: '25%', size: '10px', delay: '0s' },
      { left: '78%', top: '28%', size: '8px', delay: '0.6s' },
      { left: '48%', top: '12%', size: '12px', delay: '1.2s' },
      { left: '38%', top: '35%', size: '6px', delay: '0.3s' },
      { left: '62%', top: '32%', size: '9px', delay: '1.8s' },
      { left: '12%', top: '42%', size: '11px', delay: '1.5s' }
    ];
    sparklesCoords.forEach(c => {
      const el = document.createElement('div');
      el.className = 'sparkle-shape';
      el.style.left = c.left;
      el.style.top = c.top;
      el.style.width = c.size;
      el.style.height = c.size;
      el.style.animationDelay = c.delay;
      document.querySelector('.bouquet-wrapper').appendChild(el);
    });

    // HEX Conversion helpers
    function getLighterHex(hex) {
      if (hex === '#e11d48') return '#fda4af';
      if (hex === '#db2777') return '#fbcfe8';
      if (hex === '#fb7185') return '#ffe4e6';
      if (hex === '#eab308') return '#fef08a';
      if (hex === '#ea580c') return '#ffedd5';
      return '#ffffff';
    }

    // HEX Conversion helpers
    function getDarkerHex(hex) {
      if (hex === '#e11d48') return '#9f1239';
      if (hex === '#db2777') return '#831843';
      if (hex === '#fb7185') return '#be123c';
      if (hex === '#eab308') return '#854d0e';
      if (hex === '#ea580c') return '#7c2d12';
      if (hex === '#15522e') return '#052e16';
      return '#475569';
    }

    // Centered Modal controller
    const modalScreen = document.getElementById('modal-screen');
    const modalInterior = document.getElementById('modal-interior');
    const sunflowerOutlineRing = document.getElementById('modal-sunflower-ring');
    const badgeElement = document.getElementById('modal-header');
    const titleElement = document.getElementById('modal-title');
    const bodyElement = document.getElementById('modal-description');
    const imageElement = document.getElementById('modal-image-banner');

    let fallbackUrl = '';

    function showModal(id) {
      const letter = messages[id];
      if (!letter) return;

      titleElement.innerText = letter.title;
      bodyElement.innerText = letter.body;

      const tulipDefault = 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=600';
      const sunflowerDefault = 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=600';

      fallbackUrl = letter.theme === 'tulip' ? tulipDefault : sunflowerDefault;
      imageElement.src = letter.imageUrl || fallbackUrl;

      if (letter.theme === 'tulip') {
        modalInterior.className = 'modal-content-card modal-tulip-style';
        sunflowerOutlineRing.className = '';
        badgeElement.innerText = '🌷 Tulip Blossom';
      } else {
        modalInterior.className = 'modal-content-card modal-sunflower-style';
        sunflowerOutlineRing.className = 'theme-sunflower-outline';
        badgeElement.innerText = '🌻 Sunflower Crown';
      }

      modalScreen.style.display = 'flex';
    }

    function handleModalImageError() {
      if (imageElement && fallbackUrl && imageElement.src !== fallbackUrl) {
        imageElement.src = fallbackUrl;
      }
    }

    function closeModal() {
      modalScreen.style.display = 'none';
    }

    // Generate background atmosphere particles matching selected background
    const bgId = ${JSON.stringify(selectedBackground.id)};
    function injectAtmosphere() {
      const container = document.getElementById('atmosphere');
      if (!container) return;
      
      let type = 'dot';
      let colors = ['rgba(255,255,255,0.7)'];
      
      if (bgId === 'classic' || bgId === 'cherry') {
        type = 'petal';
        colors = ['#fbcfe8', '#f3a8c3', '#f472b6', '#fda4af'];
      } else if (bgId === 'city' || bgId === 'cosmic' || bgId === 'aurora' || bgId === 'bedroom') {
        type = 'star';
        colors = bgId === 'aurora' ? ['#a7f3d0', '#6ee7b7', '#fff', '#34d399'] : ['#fef08a', '#fda4af', '#fef3c7', '#fff'];
      } else if (bgId === 'jungle' || bgId === 'forest') {
        type = 'leaf';
        colors = bgId === 'jungle' ? ['#4ade80', '#22c55e', '#bef264', '#fbbf24'] : ['#15803d', '#a3e635', '#22c55e', '#eab308'];
      } else if (bgId === 'taiga') {
        type = 'dot';
        colors = ['rgba(45, 212, 191, 0.4)', 'rgba(20, 184, 166, 0.3)', 'rgba(255,255,255,0.2)'];
      } else if (bgId === 'desert' || bgId === 'sunset') {
        type = 'ember';
        colors = ['#ef4444', '#f97316', '#f59e0b', '#fb7185', '#ea580c'];
      } else if (bgId === 'ocean' || bgId === 'snow') {
        type = 'bubble';
        colors = bgId === 'ocean' ? ['rgba(14, 165, 233, 0.4)', 'rgba(56, 189, 248, 0.3)', 'rgba(255,255,255,0.45)'] : ['#ffffff', '#e0f2fe', '#bae6fd'];
      } else if (bgId === 'school') {
        type = 'dot';
        colors = ['rgba(255,255,255,0.25)', 'rgba(254,240,138,0.2)'];
      }

      for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        const sizeVal = 5 + (i * 7 + 13) % 12;
        const leftVal = (i * 23 + 7) % 100;
        const delayVal = ((i * 1.3) % 8).toFixed(1);
        const durationVal = 8 + ((i * 3.7) % 10);
        const color = colors[i % colors.length];

        p.style.position = 'absolute';
        p.style.left = leftVal + '%';
        p.style.top = '-20px';
        p.style.width = sizeVal + 'px';
        p.style.height = sizeVal + 'px';
        p.style.pointerEvents = 'none';
        p.style.opacity = '0';
        p.style.zIndex = '0';

        if (type === 'star') {
          p.style.backgroundImage = 'radial-gradient(circle, ' + color + ' 20%, transparent 80%)';
          p.style.animation = 'float-gentle ' + (durationVal - 3) + 's ease-in-out infinite';
          p.style.top = ((i * 17 + 12) % 95) + '%';
        } else {
          p.style.backgroundColor = color;
          if (type === 'petal' || type === 'leaf') {
            p.style.borderRadius = type === 'petal' ? '0 100% 0 100%' : '50% 0 50% 0';
            p.style.animation = 'drift-down-right ' + durationVal + 's linear infinite';
          } else if (type === 'ember') {
            p.style.borderRadius = '50%';
            p.style.boxShadow = '0 0 10px ' + color;
            p.style.animation = 'drift-up-left ' + durationVal + 's linear infinite';
            p.style.top = '105%';
          } else if (type === 'bubble') {
            p.style.borderRadius = '50%';
            p.style.boxShadow = 'inset 0 0 4px rgba(255,255,255,0.6)';
            p.style.animation = 'drift-up-left ' + durationVal + 's linear infinite';
            p.style.top = '105%';
          } else {
            p.style.borderRadius = '50%';
            p.style.animation = 'float-gentle ' + (durationVal - 3) + 's ease-in-out infinite';
            p.style.top = ((i * 17 + 12) % 95) + '%';
          }
        }

        p.style.animationDelay = delayVal + 's';
        container.appendChild(p);
      }
    }

    function adjustScale() {
      const parentWidth = window.innerWidth - 30;
      const parentHeight = window.innerHeight - 60;
      const scaleW = parentWidth / 440;
      const scaleH = parentHeight / 585;
      const scale = Math.min(1, scaleW, scaleH);
      document.documentElement.style.setProperty('--scaler', scale);
    }
    window.addEventListener('resize', adjustScale);
    window.addEventListener('DOMContentLoaded', () => {
      adjustScale();
      injectAtmosphere();
    });
    adjustScale();
    setTimeout(injectAtmosphere, 100);

    // Ribbon Long Press Config Exporter
    const ribbonEl = document.getElementById('ribbon-target-el');
    const bouquetPresets = {
      paperId: ${JSON.stringify(selectedPaper.id)},
      ribbonId: ${JSON.stringify(selectedRibbon.id)},
      backgroundId: ${JSON.stringify(selectedBackground.id)},
      leafColor: ${JSON.stringify(selectedLeafColor)},
      customMsg: ${JSON.stringify(customMsg)},
      flowers: ${JSON.stringify(activeFlowers)}
    };

    let ribbonPressTimer;
    function startRibbonPress(e) {
      if (e.type === 'mousedown' && e.button !== 0) return;
      ribbonPressTimer = setTimeout(() => {
        const jsonStr = JSON.stringify(bouquetPresets, null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {
          alert("✨ Bouquet Style Preset Copied Successfully to Clipboard!\\n\\nYou can share this JSON string or import it back inside the application to replicate this stunning arrangement:\\n\\n" + jsonStr);
        }).catch(() => {
          alert("✨ Bouquet Preset Highlighted!\\n\\nCopy the configuration layout string below to share or import later:\\n\\n" + jsonStr);
        });
      }, 800);
    }
    function clearRibbonPress() {
      clearTimeout(ribbonPressTimer);
    }
    if (ribbonEl) {
      ribbonEl.addEventListener('mousedown', startRibbonPress);
      ribbonEl.addEventListener('touchstart', startRibbonPress, { passive: true });
      ribbonEl.addEventListener('mouseup', clearRibbonPress);
      ribbonEl.addEventListener('mouseleave', clearRibbonPress);
      ribbonEl.addEventListener('touchend', clearRibbonPress);
      ribbonEl.addEventListener('touchcancel', clearRibbonPress);
    }
  </script>
</body>
</html>`;
  };

  // Simulate copying the custom bouquet configuration URL
  const handleCopyLink = () => {
    const standaloneCode = generateUnifiedBouquetCode();
    
    // Copy the entire standalone single-file vector art html component to clipboard
    navigator.clipboard.writeText(standaloneCode)
      .then(() => {
        setShowShareNotification(true);
        setTimeout(() => setShowShareNotification(false), 3000);
      })
      .catch(() => {
        // Fallback if browser permission is blocked in an iframe
        alert("Permission denied. Standalone HTML visualizer code is generated but could not be pasted to clipboard automatically in this iframe frame.");
      });
  };

  const activeMsgData = selectedFlowerMsg ? editableMessages[selectedFlowerMsg] : null;

  return (
    <div className="min-h-screen bg-linear-to-b from-stone-50 via-[#fff7fa] to-[#ffe6ef] text-stone-800 pb-16 pt-8 pr-1 overflow-x-hidden flex flex-col justify-between">
      {/* Container sizing matches responsive standards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* =========================================================================
            1. APP EDITORIAL HERO HEADER
           ========================================================================= */}
        <header className="text-center max-w-3xl mx-auto mb-10 transition-all duration-300">
          <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full text-rose-600 font-sans text-xs font-semibold mb-3.5 shadow-sm animate-pulse">
            <Sparkles size={13} className="text-rose-500" />
            Pure CSS Botanical Artistry
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-none">
            ELEGANT 3D BOUQUET
          </h1>
          <p className="font-display text-sm sm:text-base text-stone-500 tracking-[0.25em] font-medium mt-1 uppercase">
            Interactive Visualizer
          </p>
          
          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-[1px] w-12 bg-linear-to-r from-transparent to-rose-300" />
            <Flower size={16} className="text-rose-400 rotate-12" />
            <div className="h-[1px] w-12 bg-linear-to-l from-transparent to-rose-300" />
          </div>

          <p className="font-serif text-[13px] sm:text-[14px] text-stone-500 italic leading-relaxed">
            "A tactile garden of vector blooms. Hover over flowers to examine their details, tap glowing nodes to read symbolic letters, or use the florist dashboard below to customize your paper wraps, ribbons, and notes."
          </p>
        </header>

        {/* =========================================================================
            2. MAIN CORE LAYOUT SYSTEM (GRID)
           ========================================================================= */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================================
              A. LEFT COLUMN: THE INTERACTIVE CANVAS (lg: col-span-5)
             ========================================================================= */}
          <section 
            className="lg:col-span-5 flex justify-center items-center relative py-8 rounded-3xl border border-white/20 shadow-xl transition-all duration-700 min-h-[620px] overflow-hidden"
            style={{ background: selectedBackground.cssBackground }}
          >
            {/* Dynamic themed ambient particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
              {backgroundParticles.map((p) => (
                <div key={p.id} className={p.className} style={p.style} />
              ))}
            </div>

            {/* Ambient Radial glowing bubble behind the canvas platform */}
            <div 
              className="absolute w-[85%] h-[85%] rounded-full opacity-40 blur-3xl pointer-events-none transition-all duration-700 z-0" 
              style={{ background: `radial-gradient(circle, white 0%, ${selectedBackground.glowColor} 55%, transparent 100%)` }}
            />
            
            <BouquetCanvas
              items={dynamicBouquetLayout}
              activeHoverId={hoveredFlowerId}
              onHoverItem={setHoveredFlowerId}
              onSelectItem={handleSelectFlowerItem}
              paperTheme={selectedPaper}
              ribbonTheme={selectedRibbon}
              customCardMsg={customMsg}
            />
          </section>

          {/* =========================================================================
              B. RIGHT COLUMN: COHESIVE CRAFTING STUDIO CONTROL PANEL (lg: col-span-7)
             ========================================================================= */}
          <section className="lg:col-span-7 bg-white/75 border border-stone-100 rounded-3xl shadow-xl p-6 sm:p-8 backdrop-blur-md flex flex-col gap-6">
            
            {/* Studio Header */}
            <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-stone-950 flex items-center gap-2">
                  <Palette size={18} className="text-amber-600" />
                  Florist Crafting Office
                </h2>
                <p className="text-xs text-stone-400 font-sans mt-0.5">
                  Mix matte wrappings, metallic satin threads, and dedicate a letter.
                </p>
              </div>

              {/* Counter details */}
              <div className="flex gap-2.5">
                <span className="font-sans text-[10px] uppercase font-bold bg-stone-100 px-2.5 py-1 rounded text-stone-500 border border-stone-200 shadow-3xs">
                  💐 {flowerCount} Blooms
                </span>
                <span className="font-sans text-[10px] uppercase font-bold bg-stone-100 px-2.5 py-1 rounded text-stone-500 border border-stone-200 shadow-3xs">
                  🌿 {leafCount} Leaves
                </span>
              </div>
            </div>

            {/* POCKET A: BOUQUET STRUCTURE & WRAP ASSEMBLY */}
            <div className="bg-stone-50/60 border border-stone-200/80 rounded-2xl p-5 shadow-3xs flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60">
                <Palette size={15} className="text-rose-500" />
                <h3 className="font-sans text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Pocket A: Wrap & Tie Elements
                </h3>
              </div>

              {/* CONTROL 1: SELECT WRAPPING THEME */}
              <div className="flex flex-col gap-2.5">
                <label className="font-display text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center gap-1.5">
                  Matte Wrapping Paper Style
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-1">
                  {wrappingThemes.map((theme) => {
                    const isCur = selectedPaper.id === theme.id;
                    return (
                      <button
                        type="button"
                        key={theme.id}
                        onClick={() => setSelectedPaper(theme)}
                        className={`text-left p-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                          isCur 
                            ? 'border-rose-500 bg-rose-50/20 shadow-md ring-1 ring-rose-300' 
                            : 'border-stone-200 hover:border-stone-300 bg-white/70 hover:bg-white/90'
                        }`}
                      >
                        {/* Miniature wrap visual swatch */}
                        <div className="flex gap-1 h-3.5 mb-1.5 rounded overflow-hidden">
                          <div className="flex-1" style={{ backgroundColor: theme.backColor }} />
                          <div className="flex-1" style={{ backgroundColor: theme.midColor }} />
                          <div className="flex-1" style={{ backgroundColor: theme.frontColor }} />
                        </div>

                        <span className="font-sans text-[11px] font-bold text-stone-800 block truncate leading-none">
                          {theme.name}
                        </span>
                        
                        {/* active checkmark indicator */}
                        {isCur && (
                          <div className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 shadow-xs">
                            <CheckCircle size={8} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] italic text-stone-400 mt-1 leading-normal">
                  {selectedPaper.description}
                </p>
              </div>

              {/* CONTROL 2: SELECT RIBBON SILK */}
              <div className="flex flex-col gap-2.5 border-t border-stone-200/60 pt-4">
                <label className="font-display text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center gap-1.5">
                  Satin Attachment Ribbons
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                  {ribbonThemes.map((rib) => {
                    const isCur = selectedRibbon.id === rib.id;
                    return (
                      <button
                        type="button"
                        key={rib.id}
                        onClick={() => setSelectedRibbon(rib)}
                        className={`text-left p-2.5 rounded-xl border transition-all duration-300 relative group cursor-pointer ${
                          isCur 
                            ? 'border-amber-600 bg-amber-50/10 shadow-sm ring-1 ring-amber-400' 
                            : 'border-stone-200 hover:border-stone-300 bg-white/70 hover:bg-white/85'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {/* Metallic loop swatch dot */}
                          <div 
                            className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                            style={{
                              background: `radial-gradient(circle, ${rib.primary} 0%, ${rib.secondary} 100%)`
                            }}
                          />
                          <span className="font-sans text-[11px] font-bold text-stone-800 block truncate leading-none">
                            {rib.name}
                          </span>
                        </div>
                        
                        {isCur && (
                          <div className="absolute top-1 right-1 bg-amber-600 text-white rounded-full p-0.5 shadow-xs">
                            <CheckCircle size={8} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] italic text-stone-400 mt-1 leading-normal">
                  {selectedRibbon.description}
                </p>
              </div>

              {/* CONTROL 2A: SELECT GENERAL FOLIAGE LEAF COLOR */}
              <div className="flex flex-col gap-2.5 border-t border-stone-200/60 pt-4">
                <label className="font-display text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center gap-1.5">
                  Foliage Leaf Color Tint
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                  {LEAF_COLORS.map((lc) => {
                    const isCur = selectedLeafColor === lc.id;
                    return (
                      <button
                        type="button"
                        key={lc.id}
                        onClick={() => setSelectedLeafColor(lc.id)}
                        className={`text-left p-2.5 rounded-xl border transition-all duration-300 relative group cursor-pointer ${
                          isCur 
                            ? 'border-emerald-600 bg-emerald-50/10 shadow-sm ring-1 ring-emerald-450' 
                            : 'border-stone-200 hover:border-stone-300 bg-white/70 hover:bg-white/85'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded border border-black/10 shadow-inner"
                            style={{
                              background: `linear-gradient(135deg, ${lc.hex} 0%, ${lc.shadow} 100%)`
                            }}
                          />
                          <span className="font-sans text-[11px] font-bold text-stone-800 block truncate leading-none">
                            {lc.name}
                          </span>
                        </div>
                        
                        {isCur && (
                          <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                            <CheckCircle size={8} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] italic text-stone-400 mt-1 leading-normal">
                  Charming valid foliage colors including Harvest Yellows, Amber Oranges, and Fireside Crimson.
                </p>
              </div>
            </div>

            {/* POCKET B: SCENIC BACKDROP ATMOSPHERE */}
            <div className="bg-stone-50/60 border border-stone-200/80 rounded-2xl p-5 shadow-3xs flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60">
                <Sparkles size={15} className="text-amber-500 animate-pulse" />
                <h3 className="font-sans text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Pocket B: Ambient Scenery & Presets
                </h3>
              </div>

              {/* CONTROL 2B: SELECT BACKGROUND ATMOSPHERE */}
              <div className="flex flex-col gap-2.5">
                <label className="font-display text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center gap-1.5 flex-wrap">
                  Bouquet Atmosphere Theme Background
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                  {backgroundThemes.map((bg) => {
                    const isCur = selectedBackground.id === bg.id;
                    return (
                      <button
                        type="button"
                        key={bg.id}
                        onClick={() => setSelectedBackground(bg)}
                        className={`text-left p-2 rounded-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                          isCur 
                            ? 'border-amber-600 bg-amber-50/10 shadow-sm ring-1 ring-amber-400' 
                            : 'border-stone-200 hover:border-stone-300 bg-white/70 hover:bg-white/85'
                        }`}
                      >
                        <div className="flex gap-2 items-center">
                          {/* Swatch of background */}
                          <div 
                            className="w-5 h-5 rounded-md border border-neutral-300 shadow-inner shrink-0" 
                            style={{ background: bg.cssBackground }}
                          />
                          <span className="font-sans text-[11px] font-bold text-stone-800 block truncate leading-none">
                            {bg.name}
                          </span>
                        </div>
                        
                        {isCur && (
                          <div className="absolute top-1 right-1 bg-amber-600 text-white rounded-full p-0.5 shadow-xs">
                            <CheckCircle size={8} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] italic text-stone-400 mt-1 leading-normal">
                  {selectedBackground.description} — The matching theme coordinates drifting petals, leaves, embers, or stars respectively.
                </p>
              </div>

            {/* CONTROL 2C: IMPORT / EXPORT PRESETS */}
            <div className="flex flex-col gap-2.5 border-t border-stone-100 pt-5">
              <div className="flex items-center justify-between">
                <label className="font-display text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center gap-1.5">
                  <Download size={14} className="text-stone-500" />
                  Preserved Style Ledger (JSON)
                </label>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const ledger = {
                        paperId: selectedPaper.id,
                        ribbonId: selectedRibbon.id,
                        backgroundId: selectedBackground.id,
                        leafColor: selectedLeafColor,
                        customMsg: customMsg,
                        flowers: activeFlowers
                      };
                      const jsonText = JSON.stringify(ledger, null, 2);
                      navigator.clipboard.writeText(jsonText).then(() => {
                        alert("📋 Success! All Bouquet Styles (Wrapping, ribbon, background, leaves, letter message & botanical texts) copied to clipboard as JSON structure!");
                      });
                    }}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 hover:text-amber-850 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer"
                  >
                    <Download size={11} />
                    Export
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowImportArea(!showImportArea)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-stone-600 hover:text-stone-800 bg-stone-150/60 hover:bg-stone-205 border border-stone-300 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer"
                  >
                    <Upload size={11} />
                    {showImportArea ? 'Hide Import' : 'Import'}
                  </button>
                </div>
              </div>

              {showImportArea && (
                <div className="mt-2 p-3 bg-stone-105/70 rounded-xl border border-stone-200 flex flex-col gap-2">
                  <p className="text-[10px] text-stone-500 leading-normal font-medium">
                    Paste a previously copied Preset JSON string below to rehydrate your entire interactive bouquet setup instantly:
                  </p>
                  <textarea
                    rows={4}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='e.g. { "paperId": "parchment", "ribbonId": "satin", "backgroundId": "aurora", ... }'
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 font-mono text-[10px] text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 leading-normal"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!importJsonText.trim()) return;
                      try {
                        const parsed = JSON.parse(importJsonText);
                        if (!parsed || typeof parsed !== 'object') {
                          throw new Error("Preserves must be structured JSON object");
                        }
                        
                        // Hydrate Wrapping
                        if (parsed.paperId) {
                          const matchedPaper = wrappingThemes.find(p => p.id === parsed.paperId);
                          if (matchedPaper) setSelectedPaper(matchedPaper);
                        }
                        // Hydrate Ribbon
                        if (parsed.ribbonId) {
                          const matchedRibbon = ribbonThemes.find(r => r.id === parsed.ribbonId);
                          if (matchedRibbon) setSelectedRibbon(matchedRibbon);
                        }
                        // Hydrate Background
                        if (parsed.backgroundId) {
                          const matchedBg = backgroundThemes.find(b => b.id === parsed.backgroundId);
                          if (matchedBg) setSelectedBackground(matchedBg);
                        }
                        // Hydrate Leaf Color selection
                        if (parsed.leafColor) {
                          const matchedLeaf = LEAF_COLORS.find(lf => lf.id === parsed.leafColor);
                          if (matchedLeaf) setSelectedLeafColor(parsed.leafColor);
                        }
                        // Hydrate General note card
                        if (typeof parsed.customMsg === 'string') {
                          setCustomMsg(parsed.customMsg);
                        }
                        // Hydrate Active flowers list
                        if (Array.isArray(parsed.flowers)) {
                          setActiveFlowers(parsed.flowers);
                        }
                        
                        alert("🎉 Incredible! Bouquet Style ledger has been successfully imported and rendered in live preview canvas!");
                        setShowImportArea(false);
                      } catch (err) {
                        alert("⚠️ Format Error: Invalid Preset JSON config template. Please verify that the whole text was copied correctly. Detail: " + (err as Error).message);
                      }
                    }}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-850 text-white font-sans text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                  >
                    Parse & Hydrate Bouquet Canvas
                  </button>
                  </div>
              )}
            </div>
            </div>

            {/* POCKET C: DEDICATED LETTERS OFFICE */}
            <div className="bg-stone-50/60 border border-stone-200/80 rounded-2xl p-5 shadow-3xs flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60">
                <BookOpen size={15} className="text-amber-600" />
                <h3 className="font-sans text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Pocket C: Dedications & Letter Office
                </h3>
              </div>

              {/* CONTROL 3: THEMED NOTE CARD WRITER */}
              <div className="flex flex-col gap-2">
                <label 
                  htmlFor="custom-tag-message"
                  className="font-display text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center gap-1.5"
                >
                  Hanging Letter Note
                </label>
                
                <div className="relative mt-1">
                  <textarea
                    id="custom-tag-message"
                    rows={2}
                    maxLength={65}
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    placeholder="Type a heartwarming letter... (max 65 chars)"
                    className="w-full bg-white border border-stone-200 rounded-xl p-3 text-stone-800 font-serif text-[13px] placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none shadow-3xs leading-relaxed"
                  />
                  
                  {/* Length bar counters */}
                  <div className="absolute right-3.5 bottom-2 text-[9px] font-mono text-stone-400 font-semibold bg-stone-100 rounded px-1.5 py-0.2 border border-stone-150">
                    {customMsg.length} / 65
                  </div>
                </div>
              </div>

              {/* CONTROL 4: BOTANICAL DIRECTORY & LETTERS EDITOR */}
              <div className="flex flex-col gap-2 border-t border-stone-200/60 pt-4 mt-1">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <label className="font-display text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center gap-1.5">
                    Botanical Letters Customizer
                  </label>
                  <span className="font-mono text-[9px] text-stone-400 font-semibold tracking-wide">
                    Select a flower code below to edit its letter
                  </span>
                </div>

                {/* Add / Count panel for dynamic message flowers */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 mb-2">
                  <button
                    type="button"
                    onClick={handleAddFlower}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-750 text-white font-sans text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                    title="Sprout another custom flower block"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    Add Msg Flower
                  </button>
                  <div className="font-sans text-[11px] text-stone-500 leading-normal font-semibold">
                    Count: <strong>{interactiveFlowers.length}</strong> | Limit: <strong>{FLOWER_SLOTS.length}</strong>.
                  </div>
                </div>

              {/* Grid of registered botanical messages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interactiveFlowers.map((item) => {
                  const detail = editableMessages[item.msg!];
                  const isHovered = hoveredFlowerId === item.id;
                  const isEditing = editingLetterId === item.msg;
                  
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer ${
                        isEditing 
                          ? 'border-amber-500 bg-amber-50/20 ring-1 ring-amber-300 shadow-xs' 
                          : isHovered
                            ? 'border-rose-300 bg-rose-50/15 shadow-3xs'
                            : 'border-stone-100 bg-stone-50/20 hover:border-stone-200'
                      }`}
                      onMouseEnter={() => setHoveredFlowerId(item.id)}
                      onMouseLeave={() => setHoveredFlowerId(null)}
                      onClick={() => setEditingLetterId(item.msg!)}
                    >
                      <div className="flex items-center gap-2.5 truncate min-w-0 flex-1">
                        {/* Interactive dynamic category badge bead */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFlowerMsg(item.msg!);
                          }}
                          className="w-6.5 h-6.5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 border hover:scale-105 transition-transform cursor-pointer"
                          style={{
                            background: item.type === 'sunflower' ? '#fef3c7' : '#ffa1b8',
                            borderColor: item.type === 'sunflower' ? '#fbbf24' : '#fda4af',
                            color: item.type === 'sunflower' ? '#b45309' : '#e11d48',
                          }}
                          title="Click to view botanical reader modal"
                        >
                          {item.msg}
                        </button>
                        
                        <div className="truncate pr-1">
                          <span className="font-sans text-xs font-bold block text-stone-800 truncate leading-tight">
                            {detail?.title || 'Unknown Letter'}
                          </span>
                          <span className="text-[10px] text-stone-400 font-serif leading-none italic block mt-0.5 capitalize font-medium">
                            {item.type} {isEditing ? '(Active Editor)' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Small action buttons on the far right */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFlowerMsg(item.msg!);
                          }}
                          className="text-stone-600 hover:text-amber-700 transition-colors text-[10px] font-bold uppercase tracking-wider shrink-0 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md cursor-pointer font-mono"
                        >
                          Read
                        </button>
                        {activeFlowers.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFlower(item.msg!);
                            }}
                            className="bg-white border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer hover:border-rose-100"
                            title={`Prune ${item.msg} blossom`}
                          >
                            <Trash2 size={11} strokeWidth={2.2} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Letter Editor Form */}
              {editingLetterId && editableMessages[editingLetterId] && (
                <div className="mt-4 p-4.5 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/5 relative overflow-hidden transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6.5 h-6.5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border shadow-inner"
                        style={{
                          background: editableMessages[editingLetterId].theme === 'sunflower' ? '#fef3c7' : '#ffa1b8',
                          borderColor: editableMessages[editingLetterId].theme === 'sunflower' ? '#fbbf24' : '#fda4af',
                          color: editableMessages[editingLetterId].theme === 'sunflower' ? '#b45309' : '#e11d48',
                        }}
                      >
                        {editingLetterId}
                      </div>
                      <div>
                        <h4 className="font-display text-xs font-bold text-stone-800 uppercase tracking-wider">
                          Edit Blossom Letter [ {editingLetterId} ]
                        </h4>
                        <p className="text-[10px] text-stone-400 capitalize font-medium">
                          Customizes the {editableMessages[editingLetterId].theme} letter content
                        </p>
                      </div>
                    </div>

                    {/* Preview button */}
                    <button
                      type="button"
                      onClick={() => setSelectedFlowerMsg(editingLetterId)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-850 bg-rose-100/50 hover:bg-rose-100 border border-rose-200 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles size={11} className="text-rose-500 animate-spin-slow" />
                      Preview
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Input: Title */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="letter-title" className="text-[9px] uppercase tracking-wider font-bold text-stone-500 font-mono">
                        Letter Title / Symbolism Heading
                      </label>
                      <input
                        id="letter-title"
                        type="text"
                        maxLength={50}
                        value={editableMessages[editingLetterId].title}
                        onChange={(e) => handleUpdateLetterField(editingLetterId, 'title', e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-800 font-sans focus:outline-hidden focus:ring-1 focus:ring-amber-500 shadow-3xs"
                        placeholder="e.g. A Radiance of Joy"
                      />
                    </div>

                    {/* Input: Image URL */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="letter-image-url" className="text-[9px] uppercase tracking-wider font-bold text-stone-500 font-mono">
                        Custom Letter Image URL (Optional)
                      </label>
                      <input
                        id="letter-image-url"
                        type="text"
                        value={editableMessages[editingLetterId].imageUrl || ''}
                        onChange={(e) => handleUpdateLetterField(editingLetterId, 'imageUrl', e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-800 font-sans focus:outline-hidden focus:ring-1 focus:ring-amber-500 shadow-3xs text-ellipsis"
                        placeholder="Paste image link e.g. https://images.unsplash.com/... (defaults to flower if empty)"
                      />
                    </div>

                    {/* Input: Body/Message */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between font-mono text-[9px] font-bold text-stone-500">
                        <label htmlFor="letter-body" className="uppercase tracking-wider">
                          Warm Message / Botanical Biography
                        </label>
                        <span className="text-[9px]">
                          {editableMessages[editingLetterId].body.length} characters
                        </span>
                      </div>
                      <textarea
                        id="letter-body"
                        rows={3}
                        value={editableMessages[editingLetterId].body}
                        onChange={(e) => handleUpdateLetterField(editingLetterId, 'body', e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg p-3 text-xs text-stone-700 font-serif focus:outline-hidden focus:ring-1 focus:ring-amber-500 shadow-3xs leading-relaxed"
                        placeholder="Type the botanical message or heartfelt letter..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* FOOTER ACTION PANEL */}
            <div className="border-t border-stone-100 pt-5 flex flex-col sm:flex-row items-center gap-3 justify-between mt-2">
              <div className="flex items-center gap-2 text-[11px] text-stone-400">
                <HelpCircle size={14} className="text-amber-500 shrink-0" />
                <span>100% vector-free CSS Art</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                {/* Reset button */}
                <button
                  onClick={handleReset}
                  className="px-3 py-2 border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-800 bg-white hover:bg-stone-50 rounded-xl font-sans text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Reset to default florist configuration"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>

                {/* Share copying button */}
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-initial px-4.5 py-2 bg-stone-900 border border-stone-900 hover:bg-stone-800 hover:border-stone-800 text-white rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
                >
                  <ClipboardCopy size={12} />
                  Copy Bouquet Code
                  
                  {/* Floating floating success helper badge */}
                  {showShareNotification && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-950 font-sans text-[10px] font-bold text-white px-2.5 py-1 rounded shadow-lg border border-stone-850 whitespace-nowrap z-[40]">
                      ✓ Code Copied to Clipboard!
                    </div>
                  )}
                </button>
              </div>
            </div>

          </section>
        </main>
      </div>

      {/* =========================================================================
          3. COMPREHENSIVE BOTANICAL EXPLANATION FOOTER
         ========================================================================= */}
      <footer className="mt-16 max-w-2xl mx-auto px-4 font-sans tracking-wide pb-24">
        {/* Layer 1: Pure mechanical vector artwork explanation */}
        <div className="text-center text-[11px] text-stone-400 leading-relaxed mb-6">
          <p className="flex items-center justify-center gap-1.5 font-semibold text-stone-500 uppercase tracking-widest text-[9px]">
            <span>●</span>
            Pure Mechanical Rendering
            <span>●</span>
            No External Assets
            <span>●</span>
            100% Vector CSS Art
          </p>
          <p className="mt-2 text-stone-400 italic">
            Each tulip petal, swaying leaf, and wrap crease is calculated dynamically using DOM nodes and mathematical trigonometry in raw styled CSS.
          </p>
        </div>

        {/* Layer 2: Self-promotional Google AI Studio Showcase card */}
        <div className="bg-white/70 backdrop-blur-xs border border-stone-200/80 rounded-2xl p-5 shadow-3xs text-left text-xs text-stone-705 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-200/10 via-rose-200/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[9px] uppercase font-bold text-stone-450 tracking-wider">
                Google AI Studio Agent Craft
              </span>
            </div>
            <a 
              href="https://ai.studio/build" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-sans text-[10px] font-bold text-amber-700 hover:text-amber-850 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 transition-colors"
            >
              Build your own app ↗
            </a>
          </div>

          <p className="font-serif italic text-stone-800 text-[13px] leading-relaxed mb-3">
            "Hello! I am <strong className="font-sans font-bold text-stone-900 not-italic">Google AI Studio's AI Coding Agent</strong>, powered by the <span className="text-amber-700 font-semibold not-italic">Antigravity</span> system and cutting-edge <span className="text-rose-600 font-semibold not-italic">Gemini</span> model intelligence."
          </p>

          <p className="text-[11px] text-stone-500 leading-relaxed">
            I evolved this application directly from a basic layout into a comprehensive floristry customization canvas. I authored responsive visual scale wrappers, dynamic particle controllers, full clipboard preservation parsing utilities, and dynamic asset structures entirely in code.
          </p>
          
          <div className="mt-3.5 pt-3 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-400">
            <span className="font-mono">Model: Gemini 1.5 Pro</span>
            <a 
              href="https://deepmind.google/technologies/gemini/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-2"
            >
              Learn more about me ↗
            </a>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          4. FLOATING ACTION CONTROLS & OVERLAYS
         ========================================================================= */}
      
      {/* Floating Action Trigger on the bottom-center of the screen */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          onClick={() => setShowFullscreenPreview(true)}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 hover:from-stone-850 hover:to-stone-750 transition-all font-semibold font-sans text-xs tracking-wider uppercase cursor-pointer border border-white/10"
        >
          <Maximize size={13} className="text-amber-400 animate-pulse" />
          Preview Bouquet Theater
        </button>
      </div>

      {/* Immersive theatrical fullscreen visual preview of the bouquet */}
      {showFullscreenPreview && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-3xl transition-all duration-700 select-none"
          style={{ background: selectedBackground.cssBackground }}
        >
          {/* Cascade of theme drifting particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {backgroundParticles.map((p) => (
              <div key={`fs-preview-part-${p.id}`} className={p.className} style={p.style} />
            ))}
          </div>

          {/* Exhibition Canvas Box */}
          <div className="relative w-full max-w-lg z-10 flex flex-col items-center justify-center">
            
            <div className="text-center mb-6">
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-amber-500 bg-black/40 px-3 py-1 rounded-full border border-amber-500/20 shadow-lg">
                ✨ Theater Exhibition Mode ✨
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white mt-2 drop-shadow-sm">
                Your Botanical Masterpiece
              </h2>
              <p className="text-xs text-stone-300 italic font-serif mt-1">
                Tap notes to read dedicated letters or hover to examine blossoms.
              </p>
            </div>

            {/* Scale wrapper */}
            <div className="p-4 sm:p-8 bg-black/15 border border-white/10 rounded-3xl shadow-3xl flex justify-center items-center min-h-[555px] relative overflow-hidden w-full">
              <div 
                className="absolute w-[80%] h-[80%] rounded-full opacity-35 blur-3xl pointer-events-none" 
                style={{ background: `radial-gradient(circle, white 0%, ${selectedBackground.glowColor} 55%, transparent 100%)` }}
              />

              <BouquetCanvas
                items={dynamicBouquetLayout}
                activeHoverId={hoveredFlowerId}
                onHoverItem={setHoveredFlowerId}
                onSelectItem={handleSelectFlowerItem}
                paperTheme={selectedPaper}
                ribbonTheme={selectedRibbon}
                customCardMsg={customMsg}
              />
            </div>

            {/* Control buttons */}
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFullscreenPreview(false)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-neutral-100 text-stone-900 border border-stone-200 shadow-xl rounded-full font-sans text-xs font-bold tracking-wider uppercase transition-all cursor-pointer hover:scale-105"
              >
                <X size={13} className="text-red-500" strokeWidth={3} />
                Return to Workbench
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary category letter reader modal */}
      <Modal
        isOpen={selectedFlowerMsg !== null}
        onClose={() => setSelectedFlowerMsg(null)}
        data={activeMsgData}
      />
    </div>
  );
}
