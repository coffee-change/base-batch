"use client"

export function MoneyGrowthIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 300 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Plant Pot */}
        <path d="M80 280 L100 320 L200 320 L220 280 Z" fill="url(#potGradient)" stroke="#8B4513" strokeWidth="3"/>
        <ellipse cx="150" cy="280" rx="70" ry="15" fill="#654321" opacity="0.5"/>

        {/* Soil */}
        <ellipse cx="150" cy="285" rx="60" ry="12" fill="#3B2817"/>

        {/* Plant Stem */}
        <path d="M150 285 Q145 240, 150 200" stroke="#10B981" strokeWidth="6" strokeLinecap="round" className="animate-grow"/>

        {/* Leaves */}
        <g className="animate-leaf-1">
          <ellipse cx="130" cy="230" rx="25" ry="15" fill="#10B981" transform="rotate(-30 130 230)"/>
        </g>
        <g className="animate-leaf-2">
          <ellipse cx="170" cy="250" rx="25" ry="15" fill="#10B981" transform="rotate(30 170 250)"/>
        </g>

        {/* Money Tree Top - Coins as Fruits */}
        <g className="animate-float-coins">
          {/* Center Coin */}
          <g className="coin">
            <circle cx="150" cy="120" r="30" fill="url(#goldGradient)" stroke="#FFD700" strokeWidth="3"/>
            <text x="150" y="130" textAnchor="middle" fill="#8B4513" fontSize="24" fontWeight="bold">$</text>
            <circle cx="150" cy="120" r="30" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.3" className="pulse-ring"/>
          </g>

          {/* Left Coins */}
          <g className="coin-sm">
            <circle cx="100" cy="140" r="20" fill="url(#goldGradient)" stroke="#FFD700" strokeWidth="2"/>
            <text x="100" y="147" textAnchor="middle" fill="#8B4513" fontSize="16" fontWeight="bold">¢</text>
          </g>

          {/* Right Coins */}
          <g className="coin-sm">
            <circle cx="200" cy="160" r="20" fill="url(#goldGradient)" stroke="#FFD700" strokeWidth="2"/>
            <text x="200" y="167" textAnchor="middle" fill="#8B4513" fontSize="16" fontWeight="bold">¢</text>
          </g>

          {/* Top Coins */}
          <g className="coin-xs">
            <circle cx="150" cy="70" r="15" fill="url(#goldGradient)" stroke="#FFD700" strokeWidth="2"/>
            <text x="150" y="76" textAnchor="middle" fill="#8B4513" fontSize="12" fontWeight="bold">$</text>
          </g>
        </g>

        {/* Sparkles around coins */}
        <g className="animate-sparkle-money">
          <circle cx="180" cy="100" r="3" fill="#FFD700" className="sparkle"/>
          <circle cx="120" cy="110" r="3" fill="#FFD700" className="sparkle"/>
          <circle cx="160" cy="50" r="2" fill="#FFD700" className="sparkle"/>
          <circle cx="190" cy="140" r="2" fill="#FFD700" className="sparkle"/>
        </g>

        {/* Percentage Growth Arrow */}
        <g className="animate-bounce-arrow">
          <path d="M240 100 L260 80 L240 60" stroke="#10B981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M260 80 L240 80" stroke="#10B981" strokeWidth="4" strokeLinecap="round"/>
          <text x="275" y="75" fill="#10B981" fontSize="20" fontWeight="bold">+24%</text>
        </g>

        {/* Ground decoration */}
        <ellipse cx="150" cy="325" rx="100" ry="8" fill="#1F2937" opacity="0.2"/>

        {/* Gradients */}
        <defs>
          <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <radialGradient id="goldGradient">
            <stop offset="0%" stopColor="#FFF4D6" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </radialGradient>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes grow {
          0% { stroke-dasharray: 0 100; }
          100% { stroke-dasharray: 100 0; }
        }
        @keyframes leafGrow1 {
          0%, 100% { transform: scale(0.9) rotate(-30deg); }
          50% { transform: scale(1.1) rotate(-35deg); }
        }
        @keyframes leafGrow2 {
          0%, 100% { transform: scale(0.9) rotate(30deg); }
          50% { transform: scale(1.1) rotate(35deg); }
        }
        @keyframes floatCoins {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes sparkleMoney {
          0%, 100% { opacity: 0.3; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes bounceArrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseRing {
          0% { r: 30; opacity: 0.3; }
          100% { r: 40; opacity: 0; }
        }
        .animate-grow {
          animation: grow 2s ease-out;
        }
        .animate-leaf-1 {
          animation: leafGrow1 2s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-leaf-2 {
          animation: leafGrow2 2.5s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-float-coins {
          animation: floatCoins 3s ease-in-out infinite;
        }
        .animate-sparkle-money {
          animation: sparkleMoney 2s ease-in-out infinite;
        }
        .sparkle {
          animation: sparkleMoney 1.5s ease-in-out infinite;
        }
        .animate-bounce-arrow {
          animation: bounceArrow 1.5s ease-in-out infinite;
        }
        .pulse-ring {
          animation: pulseRing 2s ease-out infinite;
        }
      `}</style>
    </div>
  )
}
