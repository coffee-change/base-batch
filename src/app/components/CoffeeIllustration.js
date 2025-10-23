"use client"

export function CoffeeIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto animate-float">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Steam */}
        <g className="animate-steam">
          <path d="M180 80 Q175 60, 180 40" stroke="url(#steamGradient)" strokeWidth="3" strokeLinecap="round" opacity="0.6" className="animate-steam-1" />
          <path d="M200 85 Q195 65, 200 45" stroke="url(#steamGradient)" strokeWidth="3" strokeLinecap="round" opacity="0.6" className="animate-steam-2" />
          <path d="M220 80 Q225 60, 220 40" stroke="url(#steamGradient)" strokeWidth="3" strokeLinecap="round" opacity="0.6" className="animate-steam-3" />
        </g>

        {/* Coffee Cup */}
        <path d="M120 150 L120 280 Q120 300, 140 300 L260 300 Q280 300, 280 280 L280 150 Z" fill="url(#cupGradient)" stroke="#8B4513" strokeWidth="4"/>

        {/* Coffee Liquid */}
        <ellipse cx="200" cy="160" rx="75" ry="15" fill="url(#coffeeGradient)" opacity="0.9"/>

        {/* Cup Handle */}
        <path d="M280 180 Q320 180, 320 220 Q320 260, 280 260" stroke="#8B4513" strokeWidth="4" fill="none"/>

        {/* Coins Floating */}
        <g className="animate-coin-float">
          <circle cx="100" cy="180" r="20" fill="url(#coinGradient)" stroke="#FFD700" strokeWidth="2"/>
          <text x="100" y="188" textAnchor="middle" fill="#8B4513" fontSize="16" fontWeight="bold">$</text>
        </g>

        <g className="animate-coin-float-delayed">
          <circle cx="300" cy="200" r="18" fill="url(#coinGradient)" stroke="#FFD700" strokeWidth="2"/>
          <text x="300" y="207" textAnchor="middle" fill="#8B4513" fontSize="14" fontWeight="bold">¢</text>
        </g>

        {/* Sparkles */}
        <g className="animate-sparkle">
          <path d="M340 140 L345 150 L350 140 L345 130 Z" fill="#FFD700"/>
          <path d="M60 220 L65 230 L70 220 L65 210 Z" fill="#FFD700"/>
          <path d="M320 280 L325 290 L330 280 L325 270 Z" fill="#FFD700"/>
        </g>

        {/* Graph Arrow Up */}
        <g className="animate-arrow-up">
          <path d="M150 320 L180 340 L210 310 L240 330 L270 300" stroke="#10B981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M270 300 L260 305 L265 315" fill="#10B981"/>
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="cupGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF" />
            <stop offset="100%" stopColor="#C7D2FE" />
          </linearGradient>
          <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
          <radialGradient id="coinGradient">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </radialGradient>
          <linearGradient id="steamGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes coinFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        @keyframes coinFloatDelayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-180deg); }
        }
        @keyframes steam {
          0% { opacity: 0.6; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-30px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes arrowUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-coin-float {
          animation: coinFloat 4s ease-in-out infinite;
        }
        .animate-coin-float-delayed {
          animation: coinFloatDelayed 4.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .animate-steam-1 {
          animation: steam 2s ease-in-out infinite;
        }
        .animate-steam-2 {
          animation: steam 2s ease-in-out infinite;
          animation-delay: 0.3s;
        }
        .animate-steam-3 {
          animation: steam 2s ease-in-out infinite;
          animation-delay: 0.6s;
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        .animate-arrow-up {
          animation: arrowUp 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
