"use client"

import { useAccount } from "wagmi"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useOraclePrice } from "../hooks/useOraclePrice"

export default function Portfolio() {
  const { address, isConnected, isConnecting } = useAccount()
  const router = useRouter()
  const { ethPrice } = useOraclePrice()

  const [depositedRoundups, setDepositedRoundups] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalDeposited, setTotalDeposited] = useState(0)

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected && !isConnecting) {
      const timer = setTimeout(() => {
        router.push("/")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isConnected, isConnecting, router])

  // Fetch deposited roundups (status = true)
  useEffect(() => {
    if (!address) return

    const fetchDepositedRoundups = async () => {
      try {
        setLoading(true)

        const response = await fetch('/api/get-deposited-roundups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address })
        })

        if (!response.ok) {
          throw new Error('Failed to fetch deposited roundups')
        }

        const data = await response.json()

        setDepositedRoundups(data.roundups || [])
        setTotalDeposited(data.totalDeposited || 0)

      } catch (error) {
        console.error("Error fetching deposited roundups:", error)
        setDepositedRoundups([])
        setTotalDeposited(0)
      } finally {
        setLoading(false)
      }
    }

    fetchDepositedRoundups()
  }, [address])

  // Show loading state while checking wallet connection
  if (isConnecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Checking wallet connection...</p>
      </div>
    )
  }

  // Show connect prompt if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="text-muted-foreground mb-6">Please connect your wallet to view your portfolio</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1410] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-64 sm:w-96 h-64 sm:h-96 bg-[#CD7F32] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob" />
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-64 sm:w-96 h-64 sm:h-96 bg-[#CD7F32] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-48 sm:w-80 h-48 sm:h-80 bg-[#1C1410] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 md:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#CD7F32]/25 to-[#1C1410]/15 backdrop-blur-md border border-[#CD7F32]/30 mb-4 sm:mb-6 shadow-lg shadow-[#CD7F32]/10">
              <div className="w-2 h-2 rounded-full bg-[#D9D9D9] animate-pulse shadow-lg shadow-[#D9D9D9]/50" />
              <span className="text-xs sm:text-sm font-semibold text-[#D9D9D9] tracking-wide">Your Portfolio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 tracking-tight drop-shadow-lg">
              Portfolio
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#FFFFF0]/80 font-normal tracking-tight">Your deposited roundups and investment history</p>
          </div>
          <Link
            href="/dashboard"
            className="px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm bg-gradient-to-r from-[#CD7F32]/20 to-[#1C1410]/10 backdrop-blur-md border border-[#CD7F32]/30 rounded-2xl hover:from-[#CD7F32]/30 hover:to-[#1C1410]/20 hover:border-[#CD7F32]/40 transition-all duration-300 text-[#D9D9D9] font-semibold hover:shadow-xl hover:shadow-[#CD7F32]/20 hover:scale-105 min-h-[44px] flex items-center touch-manipulation whitespace-nowrap"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 animate-fade-in-up animation-delay-200">
          {/* Total Deposited USD */}
          <div className="bg-gradient-to-br from-[#CD7F32]/12 to-[#CD7F32]/5 backdrop-blur-2xl border border-[#CD7F32]/25 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#CD7F32]/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-[#CD7F32]/25 hover:scale-105">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#CD7F32] to-[#1C1410] flex items-center justify-center shadow-lg shadow-[#CD7F32]/30 flex-shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xs sm:text-sm text-[#D9D9D9] font-semibold uppercase tracking-wider">Total Deposited</div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3 drop-shadow-lg">
              ${totalDeposited.toFixed(2)}
            </div>
            <div className="text-xs sm:text-sm text-[#D9D9D9] font-medium">USD value at deposit</div>
          </div>

          {/* Total Deposited ETH */}
          <div className="bg-gradient-to-br from-[#CD7F32]/12 to-[#CD7F32]/5 backdrop-blur-2xl border border-[#CD7F32]/25 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#CD7F32]/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-[#CD7F32]/25 hover:scale-105">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#CD7F32] to-[#1C1410] flex items-center justify-center shadow-lg shadow-[#CD7F32]/30 flex-shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-xs sm:text-sm text-[#D9D9D9] font-semibold uppercase tracking-wider">Total ETH</div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3 drop-shadow-lg">
              {ethPrice ? (totalDeposited / ethPrice).toFixed(6) : '0.000000'}
            </div>
            <div className="text-xs sm:text-sm text-[#D9D9D9] font-medium">Invested in Aave V3</div>
          </div>

          {/* Number of Deposits */}
          <div className="bg-gradient-to-br from-[#CD7F32]/12 to-[#CD7F32]/5 backdrop-blur-2xl border border-[#CD7F32]/25 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#CD7F32]/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-[#CD7F32]/25 hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#CD7F32] to-[#1C1410] flex items-center justify-center shadow-lg shadow-[#CD7F32]/30 flex-shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-xs sm:text-sm text-[#D9D9D9] font-semibold uppercase tracking-wider">Transactions</div>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3 drop-shadow-lg">
              {depositedRoundups.length}
            </div>
            <div className="text-xs sm:text-sm text-[#D9D9D9] font-medium">Deposited roundups</div>
          </div>
        </div>

        {/* Deposited Roundups Table */}
        <div className="bg-gradient-to-br from-[#CD7F32]/10 to-[#CD7F32]/5 backdrop-blur-2xl border border-[#CD7F32]/25 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-[#CD7F32]/15 animate-fade-in-up animation-delay-400">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#CD7F32] to-[#1C1410] flex items-center justify-center shadow-lg shadow-[#CD7F32]/30">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <svg className="w-7 h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">Deposit History</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-[#CD7F32]/5 rounded-2xl animate-pulse border border-[#CD7F32]/20">
                  <div className="h-4 bg-[#CD7F32]/10 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-[#CD7F32]/10 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : depositedRoundups.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 rounded-3xl bg-[#CD7F32]/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-[#CD7F32]/30">
                <svg className="w-10 h-10 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#D9D9D9] mb-2">No deposits yet</h3>
              <p className="text-[#CD7F32] mb-6">
                Once you deposit your roundups, they will appear here
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-[#CD7F32] text-[#D9D9D9] rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#CD7F32]/50 transition-all hover:scale-105"
              >
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-[#CD7F32]/20">
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#CD7F32]">Transaction</th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#CD7F32]">USDC</th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#CD7F32]">Roundup</th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#CD7F32]">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depositedRoundups.map((roundup, index) => (
                      <tr key={roundup.id || index} className="border-b border-[#CD7F32]/10 hover:bg-[#CD7F32]/5 transition-colors">
                        <td className="py-4 px-2 sm:px-4">
                          <a
                            href={`https://base-sepolia.blockscout.com/tx/${roundup.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#CD7F32] hover:text-[#D9D9D9] hover:underline font-mono text-xs sm:text-sm transition-colors"
                          >
                            {roundup.tx_hash ? `${roundup.tx_hash.slice(0, 6)}...${roundup.tx_hash.slice(-4)}` : 'N/A'}
                          </a>
                        </td>
                        <td className="py-4 px-2 sm:px-4 text-[#D9D9D9] font-medium text-sm">
                          ${parseFloat(roundup.usdc_amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-2 sm:px-4 text-[#D9D9D9] font-semibold text-sm">
                          +${parseFloat(roundup.roundup_amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-2 sm:px-4 text-[#CD7F32] text-xs sm:text-sm">
                          <span className="hidden sm:inline">
                            {new Date(roundup.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="sm:hidden">
                            {new Date(roundup.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-br from-[#CD7F32]/10 to-[#CD7F32]/5 backdrop-blur-xl rounded-2xl p-8 border border-[#CD7F32]/20 shadow-lg animate-fade-in-up animation-delay-600">
          <h3 className="font-bold text-white mb-6 flex items-center gap-3 text-lg drop-shadow-md">
            <svg className="w-6 h-6 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Your Portfolio
          </h3>
          <div className="space-y-4 text-sm text-[#FFFFF0]">
            <p className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#CD7F32] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>These roundups have been deposited to the smart contract and are earning yield in Aave V3</span>
            </p>
            <p className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#CD7F32] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Your ETH is automatically invested when pending roundups reach $1.00</span>
            </p>
            <p className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#CD7F32] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>You can withdraw your deposits + yield anytime from the smart contract</span>
            </p>
            <p className="flex items-start gap-3 pt-2 border-t border-[#CD7F32]/20">
              <svg className="w-5 h-5 text-[#CD7F32] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Current ETH/USD price from Chronicle Oracle: <span className="font-bold text-[#FFFFF0]">${ethPrice?.toLocaleString() || 'Loading...'}</span></span>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
