
import React from 'react';

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} bg-univida-green rounded-full flex items-center justify-center shadow-lg shadow-univida-green/20 overflow-hidden p-1.5 transition-all group-hover:scale-110`}>
    <svg viewBox="0 0 100 100" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
      {/* 12 narrow flower petals */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
        <ellipse 
          key={deg} 
          cx="50" cy="30" rx="6" ry="25" 
          transform={`rotate(${deg} 50 50)`} 
        />
      ))}
      {/* Center heart */}
      <path d="M50 58 C44 52 40 46 50 42 C60 46 56 52 50 58" />
    </svg>
  </div>
);

export const Branding = ({ light = false }: { light?: boolean }) => (
  <div className="flex items-center gap-3 group">
    <Logo />
    <div className="flex flex-col">
       <span className={`text-2xl font-black tracking-tighter leading-none ${light ? 'text-white' : 'text-univida-dark'}`}>UNIVIDA</span>
       <span className={`text-[9px] font-black uppercase tracking-[0.3em] -mt-0.5 ${light ? 'text-white/60' : 'text-univida-green'}`}>Protege</span>
    </div>
  </div>
);
