
import React, { useState } from 'react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after }) => {
  const [sliderPos, setSliderPos] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div className="relative w-full aspect-video overflow-hidden group select-none cursor-ew-resize">
      {/* After Image (Background) */}
      <img 
        src={after} 
        alt="Depois" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Before Image (Foreground) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img 
          src={before} 
          alt="Antes" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slider Control Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div 
          className="h-full w-1 bg-[#FACC15] relative shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ left: `calc(${sliderPos}% - 0.5px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-[#FACC15] rounded-full flex items-center justify-center shadow-lg border-2 border-[#121212]">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-[#121212]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <input 
        type="range" 
        min="0" 
        max="100" 
        value={sliderPos} 
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
      />

      <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-black/60 px-2 md:px-3 py-0.5 md:py-1 rounded text-[8px] md:text-xs font-bold uppercase tracking-widest text-white pointer-events-none">Antes</div>
      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-yellow-500/80 px-2 md:px-3 py-0.5 md:py-1 rounded text-[8px] md:text-xs font-bold uppercase tracking-widest text-black pointer-events-none">Depois</div>
    </div>
  );
};
