"use client"

export function GlassCard({ children, className = "", hover = true }) {
  const hoverStyles = hover ? "hover:bg-[#735557]/20 hover:border-[#735557]/60 hover:shadow-2xl hover:shadow-[#735557]/20 hover:-translate-y-1" : ""

  return (
    <div className={`bg-[#735557]/10 backdrop-blur-xl border border-[#735557]/30 rounded-3xl p-6 transition-all duration-300 shadow-xl ${hoverStyles} ${className}`}>
      {children}
    </div>
  )
}
