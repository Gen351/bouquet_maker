import React, { useEffect } from 'react';
import { MessageDetail } from '../types';
import { X, ExternalLink, Leaf } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MessageDetail | null;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const isTulip = data.theme === 'tulip';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 1. BLURRED BACKDROP OVERLAY */}
      <div 
        className="fixed inset-0 bg-rose-950/20 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
        onClick={onClose}
      />

      {/* 2. THEMED CENTERED CARD */}
      <div
        className="relative w-full max-w-lg bg-stone-50 text-stone-900 shadow-2xl p-8 z-10 transition-all duration-300 max-h-[85vh] overflow-y-auto"
        style={{
          animation: 'pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          // Theme A: Tulip petal styling
          borderRadius: isTulip ? '30px 110px 30px 110px' : '24px',
          // Theme B: Sunflower double yellow borders
          border: isTulip ? '6px solid #fecdd3' : '10px solid #facc15',
          boxShadow: isTulip 
            ? '0 25px 50px -12px rgba(225, 120, 150, 0.4), inset 0 0 30px rgba(244, 63, 94, 0.04)' 
            : '0 25px 50px -12px rgba(180, 83, 9, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Sunflower theme dashed outline offset inside */}
        {!isTulip && (
          <div className="absolute inset-2 border-2 border-dashed border-amber-800 rounded-xl pointer-events-none opacity-60" />
        )}

        {/* Decorative Flower Silhouette Background Accent */}
        <div className="absolute -bottom-8 -right-8 text-stone-200/45 pointer-events-none transform -rotate-12 select-none">
          <Leaf size={140} strokeWidth={0.8} />
        </div>

        {/* Close Button Header */}
        <div className="flex justify-end relative z-20">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200/80 text-stone-500 hover:text-stone-800 transition-all duration-200 cursor-pointer border border-stone-200"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 relative z-10">
          {/* Custom Botanical Banner Image */}
          <div className="w-full h-40 sm:h-48 overflow-hidden rounded-xl border border-stone-200 shadow-3xs mb-5 relative bg-stone-100">
            <img 
              src={data.imageUrl || (data.theme === 'sunflower' 
                ? 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=600'
                : 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=600'
              )} 
              alt={data.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = data.theme === 'sunflower' 
                  ? 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=600'
                  : 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=600';
              }}
            />
          </div>

          {/* Small Category Badge */}
          <div className="flex items-center gap-1">
            <span 
              className={`inline-block text-[10px] uppercase tracking-[0.2em] font-bold font-sans px-2.5 py-1 rounded-full ${
                isTulip 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}
            >
              {data.theme === 'tulip' ? '🌷 Tulip Blossom' : '🌻 Sunflower Crown'}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${isTulip ? 'bg-rose-400 animate-ping' : 'bg-amber-400 animate-ping'}`} />
          </div>

          {/* Title */}
          <h2 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 pr-4">
            {data.title}
          </h2>

          {/* Ornamental Divider line */}
          <div className="my-5 flex items-center gap-3">
            <div className={`h-[1px] flex-1 ${isTulip ? 'bg-rose-200' : 'bg-amber-300'}`} />
            <Leaf size={14} className={isTulip ? 'text-rose-400' : 'text-amber-500'} />
            <div className={`h-[1px] flex-1 ${isTulip ? 'bg-rose-200' : 'bg-amber-300'}`} />
          </div>

          {/* Detailed Message Text */}
          <div className="font-serif text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 pr-1">
            <p className="first-letter:text-4xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:font-bold first-letter:text-stone-900">
              {data.body}
            </p>
          </div>

          {/* Simple Clean Signature Footer */}
          <div className="mt-8 pt-5 border-t border-stone-200 flex items-center justify-between">
            <span className="text-[11px] font-sans text-stone-400">
              Discovered from digital botanical archive
            </span>
            <span className={`text-[10px] font-mono tracking-wide ${isTulip ? 'text-rose-400' : 'text-amber-500'} font-bold`}>
              {data.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
