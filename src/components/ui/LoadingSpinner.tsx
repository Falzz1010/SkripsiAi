import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="relative w-20 h-20">
      {/* Rotating squares */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-full h-full border-4 border-black dark:border-white bg-[#FFD23F]
                     animate-[spin_3s_linear_infinite]`}
          style={{
            animationDelay: `${-i * 0.3}s`,
            transform: `rotate(${i * 15}deg)`,
            opacity: 1 - i * 0.2,
          }}
        />
      ))}
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-black dark:bg-white" />
      </div>
    </div>
  );
}
