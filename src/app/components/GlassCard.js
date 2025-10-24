"use client"

export function GlassCard({ children, className = "", hover = true, variant = "default" }) {
  // Premium hover states with refined animations
  const hoverStyles = hover
    ? "hover:bg-[#CD7F32]/15 hover:border-[#CD7F32]/50 hover:shadow-2xl hover:shadow-[#CD7F32]/25 hover:-translate-y-0.5 hover:scale-[1.01]"
    : ""

  // Variant styles for different card types
  const variantStyles = {
    default: "bg-[#CD7F32]/8 border-[#CD7F32]/25",
    elevated: "bg-[#CD7F32]/12 border-[#CD7F32]/30 shadow-lg shadow-[#CD7F32]/10",
    minimal: "bg-[#CD7F32]/5 border-[#CD7F32]/20",
    highlight: "bg-gradient-to-br from-[#CD7F32]/15 to-[#CD7F32]/5 border-[#CD7F32]/35"
  }

  const selectedVariant = variantStyles[variant] || variantStyles.default

  return (
    <div
      className={`
        ${selectedVariant}
        backdrop-blur-xl
        border
        rounded-3xl
        p-6 sm:p-8
        transition-all
        duration-300
        ease-out
        shadow-lg
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
