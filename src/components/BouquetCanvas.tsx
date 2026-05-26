import React, { useState, useEffect, useRef } from 'react';
import { BouquetItem, WrappingTheme, RibbonTheme } from '../types';
import { FlowerArt } from './FlowerArt';

interface BouquetCanvasProps {
  items: BouquetItem[];
  activeHoverId: string | null;
  onHoverItem: (id: string | null) => void;
  onSelectItem: (item: BouquetItem) => void;
  paperTheme: WrappingTheme;
  ribbonTheme: RibbonTheme;
  customCardMsg: string;
}

export const BouquetCanvas: React.FC<BouquetCanvasProps> = ({
  items,
  activeHoverId,
  onHoverItem,
  onSelectItem,
  paperTheme,
  ribbonTheme,
  customCardMsg,
}) => {
  // Constant pixel size of bouquet coordinate container for precise trigonometry
  const WIDTH = 440;
  const HEIGHT = 585;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const parentWidth = entry.contentRect.width;
      // Allow safety padding (e.g., 8px) on edges for small viewports
      const targetWidth = Math.max(280, Math.min(WIDTH, parentWidth - 8));
      setScale(targetWidth / WIDTH);
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // BasePoint where ribbon sits and stems converge
  const basePointPercent = { x: 50, y: 77 }; // percentage
  const baseX = WIDTH * (basePointPercent.x / 100);
  const baseY = HEIGHT * (basePointPercent.y / 100);

  // Sparkles database - simple fixed coordinates for magical twinkling stars of different sizes
  const sparkles = [
    { left: '22%', top: '25%', size: '10px', delay: '0s' },
    { left: '78%', top: '28%', size: '8px', delay: '0.6s' },
    { left: '48%', top: '12%', size: '12px', delay: '1.2s' },
    { left: '38%', top: '35%', size: '6px', delay: '0.3s' },
    { left: '62%', top: '32%', size: '9px', delay: '1.8s' },
    { left: '50%', top: '48%', size: '7px', delay: '0.9s' },
    { left: '12%', top: '42%', size: '11px', delay: '1.5s' },
    { left: '88%', top: '45%', size: '8px', delay: '2.1s' },
  ];

  return (
    <div ref={containerRef} className="w-full flex justify-center items-center overflow-visible">
      {/* Scaled frame bounding box ensuring parent heights fit exactly */}
      <div 
        className="relative flex items-center justify-center transition-all duration-300 origin-center overflow-visible"
        style={{
          width: `${WIDTH * scale}px`,
          height: `${HEIGHT * scale}px`,
        }}
      >
        {/* Bouquet Frame with subtle radial backing white glow */}
        <div 
          className="absolute shadow-2xl rounded-3xl select-none animate-float transition-all duration-700 overflow-visible p-2 border border-white/20 origin-center"
          style={{
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            transform: `scale(${scale})`,
            background: `radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.9) 0%, ${paperTheme.glowColor} 65%, rgba(255, 255, 255, 0) 100%)`,
          }}
        >
        {/* =========================================================================
            LAYER 1: WRAPPING PAPER - BACK LAYER (zIndex: 1)
            Extends outwards flaring, forming the structural shell envelope 
           ========================================================================= */}
        <div 
          className="absolute inset-0 tracking-wider wrapping-shadow opacity-95 transition-all duration-500"
          style={{
            zIndex: 1,
            clipPath: 'polygon(15% 10%, 85% 10%, 100% 45%, 50% 100%, 0% 45%)',
            background: `linear-gradient(135deg, ${paperTheme.backColor} 0%, ${paperTheme.midColor} 50%, ${paperTheme.backColor} 100%)`,
          }}
        >
          {/* Internal shading crease */}
          <div className="absolute inset-0 bg-black/5 paper-inner-shadow" />
        </div>

        {/* Outer Backing Fold Overlays for realistic wrapping layers */}
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{
            zIndex: 1,
            clipPath: 'polygon(15% 10%, 50% 10%, 50% 100%, 0% 45%)',
            background: 'linear-gradient(to right, rgba(0,0,0,0.06), transparent)',
          }}
        />
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{
            zIndex: 1,
            clipPath: 'polygon(50% 10%, 85% 10%, 100% 45%, 50% 100%)',
            background: 'linear-gradient(to left, rgba(0,0,0,0.06), transparent)',
          }}
        />

        {/* =========================================================================
            LAYER 2: MATH-CALCULATED STEMS (zIndex: 2)
            All converge perfectly at the ribbon knot.
           ========================================================================= */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {items.map((item) => {
            // Translate percentage coordinates to exact canvas pixel locations (centroids)
            const fx = WIDTH * (item.x / 100);
            const fy = HEIGHT * (item.y / 100);

            // Distance vector calculations
            const dx = fx - baseX;
            const dy = fy - baseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Trigonometry: angle in radians, converted to degrees and aligned with standard vertical axes (+90deg)
            const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

            // Render thin green stems
            return (
              <div
                key={`stem-${item.id}`}
                className="transition-all duration-300"
                style={{
                  position: 'absolute',
                  left: `${baseX}px`,
                  top: `${baseY - distance}px`, // This places the bottom of the stem strip exactly at baseY
                  width: item.type === 'sunflower' ? '3.8px' : '2.8px', // Slightly thicker for larger flower heads
                  height: `${distance}px`,
                  transform: `rotate(${angleDeg}deg)`,
                  transformOrigin: 'bottom center',
                  background: 'linear-gradient(to top, #114224 0%, #15803d 40%, #22c55e 100%)',
                  borderRadius: '1.5px',
                  opacity: 0.82,
                  boxShadow: '1px 1px 2px rgba(0,0,0,0.15)',
                }}
              />
            );
          })}
        </div>

        {/* =========================================================================
            LAYER 3: WRAPPING PAPER - MIDDLE LAYER (zIndex: 3)
            Tucked behind flowers but on top of structural stems to build 3D depth pocket
           ========================================================================= */}
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{
            zIndex: 3,
            clipPath: 'polygon(5% 42%, 95% 42%, 50% 100%)',
            background: paperTheme.innerGrad,
          }}
        >
          {/* Overlay drop shadow inside pocket */}
          <div className="absolute inset-0 bg-radial-gradient from-black/0 via-black/3 to-black/15 mix-blend-multiply" />
        </div>

        {/* =========================================================================
            LAYER 4: GREENERY AND FLOWERS CONTAINER (zIndex: 4 to 15)
            Renders Leaf, Tulip, Sunflower, Daisy CSS art instances
           ========================================================================= */}
        {items.map((item) => (
          <FlowerArt
            key={item.id}
            item={item}
            isHovered={item.id === activeHoverId}
            onHoverChange={(hovered) => onHoverItem(hovered ? item.id : null)}
            onClick={() => onSelectItem(item)}
          />
        ))}

        {/* Magical Twinkling Sparkles on high levels */}
        {sparkles.map((sp, idx) => (
          <div
            key={`sparkle-${idx}`}
            className="absolute bg-white z-[15] pointer-events-none opacity-40 rounded-full animate-sparkle"
            style={{
              left: sp.left,
              top: sp.top,
              width: sp.size,
              height: sp.size,
              animationDelay: sp.delay,
              boxShadow: '0 0 8px #ffffff, 0 0 15px #facc15',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          />
        ))}

        {/* =========================================================================
            LAYER 5: WRAPPING PAPER - FRONT SHIELDS (zIndex: 16)
            Hand-wrapped, folding collared matte sheets containing the bouquet body.
           ========================================================================= */}
        {/* Left Collar Flap */}
        <div
          className="absolute inset-0 transition-all duration-500 paper-inner-shadow"
          style={{
            zIndex: 16,
            clipPath: 'polygon(0% 41%, 50% 77%, 25% 100%, 0% 74%)',
            background: `linear-gradient(135deg, ${paperTheme.frontColor} 0%, ${paperTheme.midColor} 50%, rgba(0,0,0,0.04) 100%)`,
            boxShadow: 'inset -5px 10px 15px rgba(255,255,255,0.4)',
          }}
        >
          {/* Shaded fold lip */}
          <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent border-r-2 border-white/20" />
        </div>

        {/* Right Collar Flap (Overlaps Left) */}
        <div
          className="absolute inset-0 transition-all duration-500 paper-inner-shadow"
          style={{
            zIndex: 16,
            clipPath: 'polygon(100% 41%, 100% 74%, 75% 100%, 50% 77%)',
            background: `linear-gradient(-135deg, ${paperTheme.frontColor} 0%, ${paperTheme.midColor} 50%, rgba(0,0,0,0.08) 100%)`,
          }}
        >
          {/* Shaded fold lip */}
          <div className="absolute inset-0 bg-linear-to-l from-white/10 to-transparent border-l-2 border-white/20" />
        </div>

        {/* Under Gather Skirt (Bottom Flare of Paper) */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            zIndex: 16,
            clipPath: 'polygon(15% 76%, 85% 76%, 90% 100%, 10% 100%)',
            background: `linear-gradient(to bottom, ${paperTheme.midColor}, ${paperTheme.backColor})`,
          }}
        />

        {/* Front Gather V-Shadow (to create separation lines) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 16,
            clipPath: 'polygon(50% 77%, 100% 41%, 100% 43%, 50% 79%)',
            background: 'rgba(0,0,0,0.12)',
            filter: 'blur(1.5px)',
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 16,
            clipPath: 'polygon(0% 41%, 50% 77%, 50% 79%, 0% 43%)',
            background: 'rgba(0,0,0,0.12)',
            filter: 'blur(1.5px)',
          }}
        />

        {/* =========================================================================
            LAYER 6: THE RIBBON & BOW (zIndex: 17)
            Tied beautifully at the gathering waist point (baseX, baseY).
           ========================================================================= */}
        <div 
          className="absolute"
          style={{
            zIndex: 17,
            left: `${baseX}px`,
            top: `${baseY}px`,
            transform: 'translate(-50%, -15%)',
          }}
        >
          {/* Hanging Ribbon Tails */}
          {/* Left tail */}
          <div 
            className="absolute w-4 h-28 origin-top shadow-md"
            style={{
              left: '-14px',
              top: '5px',
              borderRadius: '0 0 100% 0',
              background: `linear-gradient(to bottom right, ${ribbonTheme.primary}, ${ribbonTheme.secondary})`,
              transform: 'rotate(-18deg) skewY(15deg)',
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)'
            }}
          />
          {/* Right tail */}
          <div 
            className="absolute w-4 h-28 origin-top shadow-md"
            style={{
              left: '6px',
              top: '5px',
              borderRadius: '0 0 0 100%',
              background: `linear-gradient(to bottom left, ${ribbonTheme.primary}, ${ribbonTheme.secondary})`,
              transform: 'rotate(18deg) skewY(-15deg)',
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)'
            }}
          />

          {/* Left Ribbon Bow Loop */}
          <div 
            className="absolute w-14 h-8 origin-right shadow-lg hover:brightness-110 transition-all"
            style={{
              left: '-52px',
              top: '-14px',
              borderRadius: '50% 35% 35% 50%',
              background: `radial-gradient(ellipse at right, ${ribbonTheme.primary} 30%, ${ribbonTheme.secondary} 100%)`,
              transform: 'rotate(-20deg)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {/* Loop inner hole */}
            <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-4 h-2 bg-black/30 rounded-full" />
          </div>

          {/* Right Ribbon Bow Loop */}
          <div 
            className="absolute w-14 h-8 origin-left shadow-lg hover:brightness-110 transition-all"
            style={{
              left: '12px',
              top: '-14px',
              borderRadius: '35% 50% 50% 35%',
              background: `radial-gradient(ellipse at left, ${ribbonTheme.primary} 30%, ${ribbonTheme.secondary} 100%)`,
              transform: 'rotate(20deg)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {/* Loop inner hole */}
            <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-4 h-2 bg-black/30 rounded-full" />
          </div>

          {/* Golden/Burgundy Central Knot Tie */}
          <div 
            className="relative w-7 h-7 rounded-full shadow-[0_3px_6px_rgba(0,0,0,0.35),_inset_0_2px_4px_rgba(255,255,255,0.4)] z-[2] border border-white/20"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${ribbonTheme.primary} 0%, ${ribbonTheme.secondary} 100%)`,
            }}
          />
        </div>

        {/* =========================================================================
            LAYER 7: PERSISTENT IN-SCENE GREETING CARD (zIndex: 18)
            Tangled to the ribbon, sways slowly. Clickable / highly interactive.
           ========================================================================= */}
        <div 
          className="absolute cursor-pointer animate-card-swing origin-[50%_-10px] bg-slate-50 border-[1.5px] border-amber-600/35 px-2.5 py-3 rounded shadow-md group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          style={{
            zIndex: 18,
            left: '58%',
            top: '74%',
            width: '122px',
            minHeight: '80px',
            boxShadow: '2px 8px 15px rgba(120,60,30,0.18)',
          }}
        >
          {/* Little metallic gold eyelet */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500 border border-amber-800 shadow-inner flex items-center justify-center">
            {/* Tiny center hole */}
            <div className="w-[3px] h-[3px] bg-amber-950 rounded-full" />
          </div>

          {/* Gold string connecting card to ribbon */}
          <div 
            className="absolute w-[1px] bg-amber-600/50 origin-bottom"
            style={{
              height: '35px',
              top: '-35px',
              left: '50%',
              transform: 'rotate(-5deg)',
            }}
          />

          <div className="text-center mt-1 border-b border-amber-600/20 pb-0.5">
            <span className="font-display text-[9px] font-bold text-amber-800/80 tracking-[0.12em] block uppercase">
              For You
            </span>
          </div>

          <div className="my-1.5 flex-1 flex items-center justify-center">
            <p className="font-serif text-[10px] italic text-slate-700 font-medium leading-normal line-clamp-3 text-center">
              "{customCardMsg || 'A bouquet curated just for you!'}"
            </p>
          </div>
          
          <div className="text-center font-sans text-[7px] text-slate-400 tracking-wider flex items-center justify-center gap-1">
            <span>●</span>
            <span className="uppercase font-bold text-[6px]">Tap to Write</span>
            <span>●</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
