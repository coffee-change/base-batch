"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

export default function Home() {
  const parallaxRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#2D2016] relative overflow-hidden overflow-x-hidden">
      {/* Parallax Background */}
      <div ref={parallaxRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#735557] rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-[#735557] rounded-full mix-blend-multiply filter blur-3xl opacity-15" />
      </div>

      {/* Hero Section - Full Height Minimalistic */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#735557] rounded-full opacity-40" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#D9D9D9] rounded-full opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-[#735557] rounded-full opacity-50" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Minimalistic Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#735557]/30 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#735557] animate-pulse" />
            <span className="text-xs text-[#D9D9D9]/70 tracking-wide">SAVE AUTOMATICALLY</span>
          </div>

          {/* Large Minimalistic Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#D9D9D9] mb-6 leading-tight tracking-tight">
            Save Money,
            <br />
            <span className="font-bold text-[#735557]">One Coffee</span>
            <br />
            <span className="font-light">at a Time</span>
          </h1>

          {/* Minimal Description */}
          <p className="text-base sm:text-lg text-[#D9D9D9]/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Round up every purchase. Invest the spare change. Earn yield automatically.
          </p>

          {/* Single CTA */}
          <Link href="/dashboard">
            <button className="group relative px-8 py-4 bg-[#735557] text-[#D9D9D9] rounded-full font-medium hover:bg-[#735557]/90 transition-all hover:shadow-2xl hover:shadow-[#735557]/30 hover:scale-105">
              <span className="relative z-10">Launch App</span>
              <div className="absolute inset-0 rounded-full bg-[#D9D9D9] opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </Link>

          {/* Minimal Stats */}
          <div className="flex items-center justify-center gap-12 mt-20">
            <div>
              <div className="text-3xl font-light text-[#D9D9D9] mb-1">$2.4M+</div>
              <div className="text-xs text-[#735557] uppercase tracking-wider">Saved</div>
            </div>
            <div className="w-px h-12 bg-[#735557]/20" />
            <div>
              <div className="text-3xl font-light text-[#D9D9D9] mb-1">12K+</div>
              <div className="text-xs text-[#735557] uppercase tracking-wider">Users</div>
            </div>
            <div className="w-px h-12 bg-[#735557]/20" />
            <div>
              <div className="text-3xl font-light text-[#D9D9D9] mb-1">24/7</div>
              <div className="text-xs text-[#735557] uppercase tracking-wider">Active</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs text-[#735557] uppercase tracking-wider">Scroll</span>
              <svg className="w-5 h-5 text-[#735557]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Minimalistic Cards with Parallax */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-[#D9D9D9] mb-4">
              How it <span className="font-bold text-[#735557]">Works</span>
            </h2>
            <p className="text-[#D9D9D9]/60 font-light">Simple, automatic, effortless</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="border border-[#735557]/20 rounded-2xl p-8 hover:border-[#735557]/40 transition-all hover:-translate-y-2">
                <div className="w-12 h-12 rounded-full bg-[#735557]/10 flex items-center justify-center mb-6">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-light text-[#D9D9D9] mb-3">
                  Make your money <span className="font-bold">move</span>
                </h3>
                <p className="text-sm text-[#D9D9D9]/60 font-light leading-relaxed">
                  Every purchase rounds up automatically. No complex wallets, no confusing DeFi — just passive growth, on autopilot.
                </p>
              </div>
            </div>

            <div className="group md:mt-12">
              <div className="border border-[#735557]/20 rounded-2xl p-8 hover:border-[#735557]/40 transition-all hover:-translate-y-2">
                <div className="w-12 h-12 rounded-full bg-[#735557]/10 flex items-center justify-center mb-6">
                  <span className="text-2xl">💸</span>
                </div>
                <h3 className="text-xl font-light text-[#D9D9D9] mb-3">
                  Micro investing <span className="font-bold">simplified</span>
                </h3>
                <p className="text-sm text-[#D9D9D9]/60 font-light leading-relaxed">
                  Every few cents from daily transactions get stacked and invested automatically. Small habits build big bags.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="border border-[#735557]/20 rounded-2xl p-8 hover:border-[#735557]/40 transition-all hover:-translate-y-2">
                <div className="w-12 h-12 rounded-full bg-[#735557]/10 flex items-center justify-center mb-6">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-light text-[#D9D9D9] mb-3">
                  Powered by <span className="font-bold">DeFi</span>
                </h3>
                <p className="text-sm text-[#D9D9D9]/60 font-light leading-relaxed">
                  We tap into the best Base DeFi vaults via Aave, bringing real yield to everyone without touching a smart contract.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Horizontal Scroll */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-[#D9D9D9] mb-4">
              The <span className="font-bold text-[#735557]">Process</span>
            </h2>
            <p className="text-[#D9D9D9]/60 font-light">Four steps to financial freedom</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", icon: "🛒", title: "Spend", desc: "Use USDC for everyday purchases" },
              { step: "02", icon: "🔄", title: "Round up", desc: "We round to the nearest dollar" },
              { step: "03", icon: "💎", title: "Deposit", desc: "Hit $1, deposit ETH automatically" },
              { step: "04", icon: "🚀", title: "Earn", desc: "Your ETH earns yield on Aave V3" }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="border-l-2 border-[#735557]/20 pl-6 pb-8">
                  <div className="absolute left-0 top-0 w-3 h-3 bg-[#735557] rounded-full -translate-x-[7px]" />
                  <div className="text-xs text-[#735557] font-light mb-2 tracking-widest">{item.step}</div>
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-light text-[#D9D9D9] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#D9D9D9]/60 font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Minimalistic List */}
      <section className="relative py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-[#D9D9D9] mb-4">
              Why <span className="font-bold text-[#735557]">Coffee Change</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { icon: "📊", title: "Average 5-8% APY", desc: "Earn competitive yields while you save" },
              { icon: "🔒", title: "Fully Secured", desc: "Your keys, your crypto, always in your control" },
              { icon: "⚡", title: "Instant Withdrawals", desc: "Access your funds anytime, no lock-ups" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 border-l-2 border-[#735557]/20 pl-6 py-4 hover:border-[#735557]/40 transition-all">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-light text-[#D9D9D9] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#D9D9D9]/60 font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Minimalistic */}
      <section className="relative py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-light text-[#D9D9D9] mb-6">
            Ready to <span className="font-bold text-[#735557]">Start Saving?</span>
          </h2>
          <p className="text-[#D9D9D9]/60 font-light mb-12 text-lg">
            Join thousands building wealth with every purchase
          </p>

          <Link href="/dashboard">
            <button className="group relative px-10 py-5 bg-[#735557] text-[#D9D9D9] rounded-full font-medium hover:bg-[#735557]/90 transition-all hover:shadow-2xl hover:shadow-[#735557]/30 hover:scale-105 text-lg">
              <span className="relative z-10">Get Started Now</span>
              <div className="absolute inset-0 rounded-full bg-[#D9D9D9] opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </Link>

          <div className="mt-12 flex items-center justify-center gap-6 text-xs text-[#735557] uppercase tracking-wider">
            <span>No credit card</span>
            <span>•</span>
            <span>100% Secure</span>
            <span>•</span>
            <span>Start in 30s</span>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-20" />
    </div>
  )
}
