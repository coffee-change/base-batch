"use client"

export function ModernButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  size = "default"
}) {
  const baseStyles = `
    rounded-2xl
    font-semibold
    tracking-tight
    transition-all
    duration-300
    ease-out
    transform
    active:scale-95
    disabled:opacity-40
    disabled:cursor-not-allowed
    disabled:active:scale-100
    disabled:shadow-none
    shadow-lg
    relative
    overflow-hidden
    focus:outline-none
    focus:ring-2
    focus:ring-[#CD7F32]
    focus:ring-offset-2
    focus:ring-offset-transparent
  `

  const variants = {
    primary: `
      bg-[#CD7F32]
      text-white
      hover:shadow-2xl
      hover:shadow-[#CD7F32]/40
      hover:-translate-y-0.5
      hover:bg-[#1C1410]
      border
      border-[#CD7F32]/20
    `,
    secondary: `
      bg-[#D9D9D9]/10
      backdrop-blur-md
      border
      border-[#CD7F32]/30
      text-[#1C1410]
      hover:bg-[#CD7F32]/20
      hover:border-[#CD7F32]/50
      hover:shadow-xl
      hover:shadow-[#CD7F32]/20
      hover:-translate-y-0.5
    `,
    success: `
      bg-gradient-to-r
      from-[#CD7F32]
      to-[#1C1410]
      text-white
      hover:shadow-2xl
      hover:shadow-[#CD7F32]/50
      hover:-translate-y-0.5
      hover:scale-105
      border
      border-[#CD7F32]/30
    `,
    ghost: `
      bg-transparent
      border-2
      border-[#CD7F32]/40
      text-[#CD7F32]
      hover:bg-[#CD7F32]/15
      hover:border-[#CD7F32]/70
      hover:shadow-lg
      hover:shadow-[#CD7F32]/20
      hover:-translate-y-0.5
    `
  }

  const sizes = {
    small: "px-5 py-2.5 text-sm",
    default: "px-7 py-3.5 text-base",
    large: "px-9 py-4 text-lg"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
