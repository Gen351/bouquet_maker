import React from 'react';
import { BouquetItem } from '../types';

interface FlowerArtProps {
  item: BouquetItem;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  onClick: () => void;
}

export const FlowerArt: React.FC<FlowerArtProps> = ({
  item,
  isHovered,
  onHoverChange,
  onClick,
}) => {
  const { type, color, scale, zIndex, brightness, msg, rotation, pollenColor } = item;

  // Custom inline style configuration
  const baseScale = scale || 1.0;
  const currentScale = isHovered ? baseScale * 1.25 : baseScale;
  const currentBrightness = isHovered ? brightness + 15 : brightness;
  const currentZIndex = isHovered ? 30 : zIndex; // Ensure hovered flower pops cleanly above front paper

  const adjustColorBrightness = (hex: string, percent: number): string => {
    let hexClean = hex.replace("#", "");
    if (hexClean.length === 3) {
      hexClean = hexClean[0] + hexClean[0] + hexClean[1] + hexClean[1] + hexClean[2] + hexClean[2];
    }
    const num = parseInt(hexClean, 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
    const hexResult = (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    return `#${hexResult}`;
  };

  // Generate helper colors for CSS art gradients
  const getLighterColor = (hex: string): string => {
    if (hex === '#e11d48') return '#fda4af'; // pink
    if (hex === '#db2777') return '#fbcfe8'; // lighter pink
    if (hex === '#fb7185') return '#ffe4e6'; // warm bloom pink
    if (hex === '#eab308') return '#fef08a'; // pale yellow
    if (hex === '#ea580c') return '#ffedd5'; // cream orange
    if (hex === '#15522e' || hex === '#114224' || hex === '#0d331b') return '#4ade80'; // soft leaf green
    return adjustColorBrightness(hex, 25);
  };

  const getDarkerColor = (hex: string): string => {
    if (hex === '#e11d48') return '#9f1239';
    if (hex === '#db2777') return '#831843';
    if (hex === '#fb7185') return '#be123c';
    if (hex === '#eab308') return '#854d0e';
    if (hex === '#ea580c') return '#7c2d12';
    if (hex === '#15522e') return '#052e16';
    return adjustColorBrightness(hex, -25);
  };

  const lighterColor = getLighterColor(color);
  const darkerColor = getDarkerColor(color);

  // Sway style variable for leaf sway animation
  const swayAngle = rotation || 0;
  const swayClass = zIndex < 8 ? 'animate-sway-slow' : 'animate-sway-med';

  return (
    <div
      id={`flower-item-${item.id}`}
      className={`absolute select-none cursor-pointer group transition-all duration-300 ease-out`}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        transform: `translate(-50%, -50%) scale(${currentScale})`,
        zIndex: currentZIndex,
        filter: `brightness(${currentBrightness}%) drop-shadow(0 4px 8px rgba(0,0,0,0.12))`,
        '--sway-angle': `${swayAngle}deg`,
      } as React.CSSProperties}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onClick={onClick}
    >
      {/* 1. STRUCTURAL LEAF SHAPING */}
      {type === 'leaf' && (
        <div 
          className={`w-14 h-6 rounded-[0_50%_0_50%] border-l border-t border-emerald-400/20 shadow-[inset_-2px_2px_4px_rgba(255,255,255,0.15),_inset_2px_-2px_6px_rgba(0,0,0,0.3)] transition-all duration-300 ${swayClass}`}
          style={{
            background: `linear-gradient(135deg, ${color}, ${darkerColor})`,
            transform: `rotate(${swayAngle}deg)`,
            transformOrigin: '20% 50%',
          }}
        >
          {/* Vein texture (Spine of Leaf) */}
          <div 
            className="absolute top-[50%] left-0 w-[90%] h-[1.5px] bg-emerald-950/40 origin-left" 
            style={{ transform: 'rotate(-10deg) scaleY(0.8)' }}
          />
          <div 
            className="absolute top-[35%] left-[30%] w-[35%] h-[1px] bg-emerald-950/20 origin-left" 
            style={{ transform: 'rotate(25deg)' }}
          />
          <div 
            className="absolute bottom-[35%] left-[45%] w-[30%] h-[1px] bg-emerald-950/20 origin-left" 
            style={{ transform: 'rotate(-25deg)' }}
          />
        </div>
      )}

      {/* 2. OVERLAPPING VELVET TULIP */}
      {type === 'tulip' && (
        <div className="relative w-12 h-14" style={{ transform: `rotate(${swayAngle}deg)` }}>
          {/* Deep green calyx bottom */}
          <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-4 h-3 bg-green-700/80 rounded-b-full z-[1]" />
          
          {/* Petal B: Left Petal (Folds behind right petal, rotates on bottom right) */}
          <div 
            className="absolute bottom-0 left-0 w-[60%] h-[88%] rounded-b-full rounded-t-[55%] origin-bottom-right shadow-[inset_2px_-4px_6px_rgba(0,0,0,0.15)] z-[2]"
            style={{
              background: `linear-gradient(to top right, ${darkerColor}, ${color}, ${lighterColor})`,
              transform: 'rotate(-14deg)',
            }}
          />

          {/* Petal A: Center/Rear Petal (Provides inner body, shadow-depth) */}
          <div 
            className="absolute bottom-0 left-[20%] w-[60%] h-[95%] rounded-b-full rounded-t-[45%] shadow-[inset_0_-8px_10px_rgba(0,0,0,0.22)] z-[1]"
            style={{
              background: `linear-gradient(to top, ${darkerColor}, ${color})`,
            }}
          />

          {/* Petal C: Right Petal (Sits at front, rotates on bottom left) */}
          <div 
            className="absolute bottom-0 right-0 w-[60%] h-[88%] rounded-b-full rounded-t-[55%] origin-bottom-left shadow-[inset_-2px_-4px_6px_rgba(0,0,0,0.15)] z-[3]"
            style={{
              background: `linear-gradient(to top left, ${color}, ${lighterColor})`,
              transform: 'rotate(14deg)',
            }}
          />

          {/* Golden pollen sheen inside (visible at top slit) */}
          <div className="absolute top-[8%] left-[45%] w-2 h-2 rounded-full bg-amber-400 blur-[1px] opacity-75 z-[2]" />
        </div>
      )}

      {/* 3. DYNAMIC SUNFLOWER ROSSETE */}
      {type === 'sunflower' && (
        <div className="relative w-22 h-22 flex items-center justify-center">
          {/* 12 Yellow petals rotated evenly around the center */}
          {[...Array(12)].map((_, i) => {
            const rot = i * 30; // 360 / 12 = 30
            return (
              <div
                key={i}
                className="absolute w-[11%] h-[40%] rounded-[50%_50%_40%_40%] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_1px_2px_3px_rgba(0,0,0,0.1)]"
                style={{
                  background: `linear-gradient(to top, ${color}, ${lighterColor})`,
                  top: '10%',
                  left: '44.5%',
                  transform: `rotate(${rot}deg)`,
                  transformOrigin: '50% 100%', // Rotates perfectly around the exact middle of the 100px square
                }}
              />
            );
          })}

          {/* Inner secondary offset ring of petals for botanical thickness */}
          {[...Array(12)].map((_, i) => {
            const rot = i * 30 + 15; // Offset by 15 degrees
            return (
              <div
                key={`offset-${i}`}
                className="absolute w-[9%] h-[34%] rounded-[50%_50%_45%_45%] opacity-90 scale-[0.9]"
                style={{
                  background: `linear-gradient(to top, ${darkerColor}, ${color})`,
                  top: '16%',
                  left: '45.5%',
                  transform: `rotate(${rot}deg)`,
                  transformOrigin: '50% 100%',
                }}
              />
            );
          })}

          {/* Central seed disc - heavy dark brown textured circle */}
          <div className="absolute w-[36%] h-[36%] rounded-full textured-seed z-[10] flex items-center justify-center border border-amber-500/25">
            {/* Seed head spiral texture (dashed helper outline) */}
            <div className="absolute w-[75%] h-[75%] rounded-full border border-dashed border-amber-600/30 animate-spin" style={{ animationDuration: '40s' }} />
            <div className="absolute w-[45%] h-[45%] rounded-full border border-dashed border-amber-500/20 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
            {/* Center fuzzy gold glow */}
            <div className="w-[20%] h-[20%] bg-amber-400/25 rounded-full blur-[2px]" />
          </div>
        </div>
      )}

      {/* 4. FILLER WHITE DAISY */}
      {type === 'daisy' && (
        <div className="relative w-14 h-14 flex items-center justify-center">
          {/* 8 white petals rotated evenly at 45 degree intervals */}
          {[...Array(8)].map((_, i) => {
            const rot = i * 45;
            return (
              <div
                key={`daisy-${i}`}
                className="absolute w-[12%] h-[42%] rounded-full bg-linear-to-t from-slate-200 to-white shadow-[0_1.5px_2px_rgba(0,0,0,0.06),_inset_0_1px_1px_rgba(255,255,255,0.8)]"
                style={{
                  top: '8%',
                  left: '44%',
                  transform: `rotate(${rot}deg)`,
                  transformOrigin: '50% 100%',
                }}
              />
            );
          })}

          {/* Pollen golden button */}
          <div 
            className="absolute w-[28%] h-[28%] rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),_0_2px_4px_rgba(0,0,0,0.15)] border border-amber-400/30 z-[10]"
            style={{
              background: `radial-gradient(circle, ${pollenColor || '#fbbf24'} 0%, ${darkerColor || '#b45309'} 100%)`,
            }}
          />
        </div>
      )}

      {/* 5. INTERACTIVE MESSAGE GLOW INDICATOR */}
      {msg && (
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-[15]"
          style={{ '--color-glow': type === 'sunflower' ? 'rgba(234, 179, 8, 0.5)' : 'rgba(239, 68, 68, 0.4)' } as React.CSSProperties}
        >
          {/* Glowing pulse ring */}
          <div className="absolute w-8 h-8 rounded-full bg-white/10" style={{ animation: 'pulse-glow 2s infinite ease-in-out' }} />
          
          {/* Tag text inside bubble */}
          <span className="font-mono text-[9px] font-bold text-white bg-slate-950/80 px-1.5 py-0.5 rounded-full border border-white/20 backdrop-blur-xs tracking-wider shadow-lg">
            {msg}
          </span>
        </div>
      )}
    </div>
  );
};
