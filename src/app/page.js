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
    <div className="min-h-screen bg-[#1C1410] relative overflow-hidden overflow-x-hidden">
      {/* Parallax Background */}
      <div ref={parallaxRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-[#CD7F32] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-[#CD7F32] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#1C1410] rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      {/* Hero Section - Full Height Minimalistic */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#CD7F32] rounded-full opacity-40" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#D9D9D9] rounded-full opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-[#CD7F32] rounded-full opacity-50" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Minimalistic Badge */}
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full border border-[#CD7F32]/30 mb-8 sm:mb-10 bg-[#CD7F32]/5 backdrop-blur-sm shadow-lg shadow-[#CD7F32]/10">
            <div className="w-2 h-2 rounded-full bg-[#CD7F32] animate-pulse shadow-lg shadow-[#CD7F32]/50" />
            <span className="text-xs sm:text-sm text-[#D9D9D9] tracking-wider font-semibold uppercase">Save Automatically</span>
          </div>

          {/* Large Minimalistic Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-[#D9D9D9] mb-6 sm:mb-8 leading-tight tracking-tighter px-2 sm:px-0">
            Save Money,
            <br />
            <span className="font-black text-[#CD7F32] tracking-tight">One Coffee</span>
            <br />
            <span className="font-light">at a Time</span>
          </h1>

          {/* Minimal Description */}
          <p className="text-base sm:text-lg md:text-xl text-[#D9D9D9]/70 max-w-2xl mx-auto mb-10 sm:mb-14 font-normal leading-relaxed tracking-tight px-4 sm:px-0">
            Round up every purchase. Invest the spare change. Earn yield automatically.
          </p>

          {/* Single CTA */}
          <Link href="/dashboard">
            <button className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#CD7F32] to-[#1C1410] text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-[#CD7F32]/40 transition-all duration-300 hover:scale-105 active:scale-95 border border-[#CD7F32]/30 shadow-xl tracking-tight text-base sm:text-lg min-h-[48px] touch-manipulation">
              <span className="relative z-10">Launch App</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </Link>

          {/* Minimal Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 md:gap-16 mt-16 sm:mt-20 md:mt-24 flex-wrap sm:flex-nowrap">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#D9D9D9] mb-1 sm:mb-2 tracking-tight">$2.4M+</div>
              <div className="text-xs sm:text-sm text-[#CD7F32] uppercase tracking-widest font-semibold">Saved</div>
            </div>
            <div className="w-px h-12 sm:h-16 bg-gradient-to-b from-transparent via-[#CD7F32]/30 to-transparent" />
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#D9D9D9] mb-1 sm:mb-2 tracking-tight">12K+</div>
              <div className="text-xs sm:text-sm text-[#CD7F32] uppercase tracking-widest font-semibold">Users</div>
            </div>
            <div className="w-px h-12 sm:h-16 bg-gradient-to-b from-transparent via-[#CD7F32]/30 to-transparent" />
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#D9D9D9] mb-1 sm:mb-2 tracking-tight">24/7</div>
              <div className="text-xs sm:text-sm text-[#CD7F32] uppercase tracking-widest font-semibold">Active</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 hidden sm:block">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs text-[#CD7F32] uppercase tracking-wider">Scroll</span>
              <svg className="w-5 h-5 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Minimalistic Cards with Parallax */}
      <section className="relative py-16 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#D9D9D9] mb-3 sm:mb-4 px-4">
              How it <span className="font-bold text-[#CD7F32]">Works</span>
            </h2>
            <p className="text-sm sm:text-base text-[#D9D9D9]/60 font-light">Simple, automatic, effortless</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group sm:col-span-2 md:col-span-1">
              <div className="bg-gradient-to-br from-[#CD7F32]/10 to-[#CD7F32]/5 border border-[#CD7F32]/25 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#CD7F32]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#CD7F32]/20 backdrop-blur-sm">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CD7F32] to-[#1C1410] flex items-center justify-center mb-6 sm:mb-8 shadow-lg group-hover:scale-110 transition-transform">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <svg className="w-7 h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-normal text-[#D9D9D9] mb-3 sm:mb-4 tracking-tight">
                  Make your money <span className="font-bold">move</span>
                </h3>
                <p className="text-sm sm:text-base text-[#D9D9D9]/70 font-normal leading-relaxed">
                  Every purchase rounds up automatically. No complex wallets, no confusing DeFi — just passive growth, on autopilot.
                </p>
              </div>
            </div>

            <div className="group sm:col-span-2 md:col-span-1 md:mt-12">
              <div className="bg-gradient-to-br from-[#CD7F32]/10 to-[#CD7F32]/5 border border-[#CD7F32]/25 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#CD7F32]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#CD7F32]/20 backdrop-blur-sm">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CD7F32] to-[#1C1410] flex items-center justify-center mb-6 sm:mb-8 shadow-lg group-hover:scale-110 transition-transform">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <svg className="w-7 h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-normal text-[#D9D9D9] mb-3 sm:mb-4 tracking-tight">
                  Micro investing <span className="font-bold">simplified</span>
                </h3>
                <p className="text-sm sm:text-base text-[#D9D9D9]/70 font-normal leading-relaxed">
                  Every few cents from daily transactions get stacked and invested automatically. Small habits build big bags.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-[#CD7F32]/10 to-[#CD7F32]/5 border border-[#CD7F32]/25 rounded-3xl p-10 hover:border-[#CD7F32]/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#CD7F32]/20 backdrop-blur-sm">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CD7F32] to-[#1C1410] flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <svg className="w-7 h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-normal text-[#D9D9D9] mb-3 sm:mb-4 tracking-tight">
                  Powered by <span className="font-bold">DeFi</span>
                </h3>
                <p className="text-sm sm:text-base text-[#D9D9D9]/70 font-normal leading-relaxed">
                  We tap into the best Base DeFi vaults via Aave, bringing real yield to everyone without touching a smart contract.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Horizontal Scroll */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#D9D9D9] mb-3 sm:mb-4 px-4">
              The <span className="font-bold text-[#CD7F32]">Process</span>
            </h2>
            <p className="text-sm sm:text-base text-[#D9D9D9]/60 font-light">Four steps to financial freedom</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                icon: <svg className="w-8 h-8 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>,
                title: "Spend",
                desc: "Use USDC for everyday purchases"
              },
              {
                step: "02",
                icon: <svg className="w-8 h-8 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>,
                title: "Round up",
                desc: "We round to the nearest dollar"
              },
              {
                step: "03",
                icon: <svg className="w-8 h-8 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>,
                title: "Deposit",
                desc: "Hit $1, deposit ETH automatically"
              },
              {
                step: "04",
                icon: <svg className="w-8 h-8 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>,
                title: "Earn",
                desc: "Your ETH earns yield on Aave V3"
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="border-l-2 border-[#CD7F32]/20 pl-4 sm:pl-6 pb-6 sm:pb-8">
                  <div className="absolute left-0 top-0 w-3 h-3 bg-[#CD7F32] rounded-full -translate-x-[7px]" />
                  <div className="text-xs text-[#CD7F32] font-light mb-2 tracking-widest">{item.step}</div>
                  <div className="mb-3 sm:mb-4">{item.icon}</div>
                  <h3 className="text-lg sm:text-xl font-light text-[#D9D9D9] mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#D9D9D9]/60 font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Minimalistic List */}
      <section className="relative py-16 sm:py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#D9D9D9] mb-3 sm:mb-4 px-4">
              Why <span className="font-bold text-[#CD7F32]">Coffee Change</span>
            </h2>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {[
              {
                icon: <svg className="w-8 h-8 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>,
                title: "Average 5-8% APY",
                desc: "Earn competitive yields while you save"
              },
              {
                icon: <svg className="w-8 h-8 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>,
                title: "Fully Secured",
                desc: "Your keys, your crypto, always in your control"
              },
              {
                icon: <svg className="w-8 h-8 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>,
                title: "Instant Withdrawals",
                desc: "Access your funds anytime, no lock-ups"
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 sm:gap-6 border-l-2 border-[#CD7F32]/20 pl-4 sm:pl-6 py-3 sm:py-4 hover:border-[#CD7F32]/40 transition-all">
                <div className="flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-light text-[#D9D9D9] mb-1">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#D9D9D9]/60 font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Minimalistic */}
      <section className="relative py-16 sm:py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#D9D9D9] mb-6 sm:mb-8 tracking-tight px-2">
            Ready to <span className="font-black text-[#CD7F32]">Start Saving?</span>
          </h2>
          <p className="text-[#D9D9D9]/70 font-normal mb-10 sm:mb-14 text-base sm:text-lg md:text-xl leading-relaxed px-4">
            Join thousands building wealth with every purchase
          </p>

          <Link href="/dashboard">
            <button className="group relative px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-[#CD7F32] to-[#1C1410] text-white rounded-full font-bold hover:shadow-2xl hover:shadow-[#CD7F32]/40 transition-all duration-300 hover:scale-105 active:scale-95 text-base sm:text-lg md:text-xl tracking-tight border border-[#CD7F32]/30 shadow-xl min-h-[48px] touch-manipulation">
              <span className="relative z-10">Get Started Now</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </Link>

          <div className="mt-10 sm:mt-14 flex items-center justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-[#CD7F32] uppercase tracking-widest font-semibold flex-wrap">
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
