"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"
import { useAccount } from "wagmi"
import { usePathname } from "next/navigation"

export default function Header() {
  const { isConnected } = useAccount()
  const pathname = usePathname()

  const isActive = (path) => pathname === path

  return (
    <header className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 sticky top-0 z-50 bg-[#1C1410]/90 backdrop-blur-2xl border-b border-[#CD7F32]/20 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group touch-manipulation min-h-[44px]">
        <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out bg-gradient-to-br from-[#735557] via-[#2D2016] to-[#D9D9D9]/30 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg flex-shrink-0 overflow-hidden">
        <img
              src="/CCtrans.png"
              alt="Coffee Change"
              className="w-full h-full object-contain scale-150 drop-shadow-[0_0_6px_#ffffff] drop-shadow-[0_0_4px_#735557] brightness-110 contrast-125"
            />

          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              Coffee Change
            </h1>
            <span className="text-[10px] sm:text-[11px] text-[#D9D9D9] -mt-0.5 hidden sm:block tracking-wide font-semibold">
              Save with every purchase
            </span>
          </div>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-3">
          {isConnected && (
            <>
              <Link
                href="/dashboard"
                className={`
                  px-4 sm:px-5 py-2.5 rounded-2xl text-sm font-semibold tracking-tight min-h-[44px] flex items-center touch-manipulation
                  transition-all duration-300 ease-out
                  ${isActive('/dashboard')
                    ? 'bg-[#CD7F32] text-white shadow-xl shadow-[#CD7F32]/30 scale-105'
                    : 'text-[#D9D9D9] hover:text-white hover:bg-[#CD7F32]/90 hover:shadow-lg hover:shadow-[#CD7F32]/20 hover:scale-105'
                  }
                `}
              >
                Dashboard
              </Link>
              <Link
                href="/portfolio"
                className={`
                  px-4 sm:px-5 py-2.5 rounded-2xl text-sm font-semibold tracking-tight min-h-[44px] flex items-center touch-manipulation
                  transition-all duration-300 ease-out
                  ${isActive('/portfolio')
                    ? 'bg-[#CD7F32] text-white shadow-xl shadow-[#CD7F32]/30 scale-105'
                    : 'text-[#D9D9D9] hover:text-white hover:bg-[#CD7F32]/90 hover:shadow-lg hover:shadow-[#CD7F32]/20 hover:scale-105'
                  }
                `}
              >
                Portfolio
              </Link>
            </>
          )}
        </nav>

        {/* Connect Button */}
        <div className="flex items-center gap-3">
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full'
            }}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isConnected && (
        <div className="md:hidden flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          <Link
            href="/dashboard"
            className={`
              px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap tracking-tight min-h-[44px] flex items-center touch-manipulation
              transition-all duration-300 ease-out
              ${isActive('/dashboard')
                ? 'bg-[#CD7F32] text-white shadow-lg shadow-[#CD7F32]/30'
                : 'text-[#D9D9D9] hover:text-white hover:bg-[#CD7F32]/90 hover:shadow-md'
              }
            `}
          >
            Dashboard
          </Link>
          <Link
            href="/portfolio"
            className={`
              px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap tracking-tight min-h-[44px] flex items-center touch-manipulation
              transition-all duration-300 ease-out
              ${isActive('/portfolio')
                ? 'bg-[#CD7F32] text-white shadow-lg shadow-[#CD7F32]/30'
                : 'text-[#D9D9D9] hover:text-white hover:bg-[#CD7F32]/90 hover:shadow-md'
              }
            `}
          >
            Portfolio
          </Link>
        </div>
      )}
    </header>
  )
}
