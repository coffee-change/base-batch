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
    <header className="w-full px-4 sm:px-6 py-4 sticky top-0 z-50 bg-[#2D2016]/80 backdrop-blur-xl border-b border-[#735557]/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <img src="/CCtrans.png" alt="Coffee Change" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-black text-[#D9D9D9]">
              Coffee Change
            </h1>
            <span className="text-[10px] text-[#735557] -mt-1 hidden sm:block">Save with every purchase</span>
          </div>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-2">
          {isConnected && (
            <>
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/dashboard')
                    ? 'bg-[#735557] text-[#D9D9D9] shadow-lg'
                    : 'text-[#735557] hover:text-[#D9D9D9] hover:bg-[#735557]/20'
                }`}
              >
                💰 Dashboard
              </Link>
              <Link
                href="/portfolio"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/portfolio')
                    ? 'bg-[#735557] text-[#D9D9D9] shadow-lg'
                    : 'text-[#735557] hover:text-[#D9D9D9] hover:bg-[#735557]/20'
                }`}
              >
                📊 Portfolio
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
        <div className="md:hidden flex gap-2 mt-3 overflow-x-auto pb-2">
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              isActive('/dashboard')
                ? 'bg-[#735557] text-[#D9D9D9] shadow-lg'
                : 'text-[#735557] hover:text-[#D9D9D9] hover:bg-[#735557]/20'
            }`}
          >
            💰 Dashboard
          </Link>
          <Link
            href="/portfolio"
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              isActive('/portfolio')
                ? 'bg-[#735557] text-[#D9D9D9] shadow-lg'
                : 'text-[#735557] hover:text-[#D9D9D9] hover:bg-[#735557]/20'
            }`}
          >
            📊 Portfolio
          </Link>
        </div>
      )}
    </header>
  )
}
