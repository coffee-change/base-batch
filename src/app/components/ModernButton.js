"use client"

export function ModernButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  size = "default"
}) {
  const baseStyles = "rounded-2xl font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg"

  const variants = {
    primary: "bg-[#735557] text-[#D9D9D9] hover:shadow-2xl hover:shadow-[#735557]/50 hover:-translate-y-0.5 hover:bg-[#735557]/90",
    secondary: "bg-[#D9D9D9]/10 backdrop-blur-md border border-[#D9D9D9]/30 text-[#D9D9D9] hover:bg-[#D9D9D9]/20 hover:border-[#D9D9D9]/50",
    success: "bg-[#735557] text-[#D9D9D9] hover:shadow-2xl hover:shadow-[#735557]/50 hover:bg-[#735557]/90",
    ghost: "bg-transparent border-2 border-[#735557]/50 text-[#735557] hover:bg-[#735557]/10 hover:border-[#735557]"
  }

  const sizes = {
    small: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
