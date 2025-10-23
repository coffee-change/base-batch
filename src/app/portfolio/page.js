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
    <div className="min-h-screen bg-[#2D2016] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#735557] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#735557] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#735557] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#735557]/20 backdrop-blur-md border border-[#735557]/40 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#D9D9D9] animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-[#D9D9D9]">Your Portfolio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#D9D9D9] mb-2">
              Portfolio
            </h1>
            <p className="text-lg text-[#D9D9D9]/70">Your deposited roundups and investment history</p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm bg-[#735557]/20 backdrop-blur-md border border-[#735557]/40 rounded-xl hover:bg-[#735557]/30 transition-all text-[#D9D9D9] font-medium hover:shadow-lg"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 animate-fade-in-up animation-delay-200">
          {/* Total Deposited USD */}
          <div className="bg-[#735557]/10 backdrop-blur-xl border border-[#735557]/30 rounded-3xl p-6 shadow-2xl shadow-[#735557]/10 transition-all hover:-translate-y-1 hover:shadow-[#735557]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#735557] flex items-center justify-center shadow-lg">
                <span className="text-xl">💰</span>
              </div>
              <div className="text-sm text-[#735557]">Total Deposited</div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#D9D9D9]">
              ${totalDeposited.toFixed(2)}
            </div>
            <div className="text-xs text-[#735557] mt-2">USD value at deposit</div>
          </div>

          {/* Total Deposited ETH */}
          <div className="bg-[#735557]/10 backdrop-blur-xl border border-[#735557]/30 rounded-3xl p-6 shadow-2xl shadow-[#735557]/10 transition-all hover:-translate-y-1 hover:shadow-[#735557]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#735557] flex items-center justify-center shadow-lg">
                <span className="text-xl">⚡</span>
              </div>
              <div className="text-sm text-[#735557]">Total ETH</div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#D9D9D9]">
              {ethPrice ? (totalDeposited / ethPrice).toFixed(6) : '0.000000'}
            </div>
            <div className="text-xs text-[#735557] mt-2">Invested in Aave V3</div>
          </div>

          {/* Number of Deposits */}
          <div className="bg-[#735557]/10 backdrop-blur-xl border border-[#735557]/30 rounded-3xl p-6 shadow-2xl shadow-[#735557]/10 transition-all hover:-translate-y-1 hover:shadow-[#735557]/20 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#735557] flex items-center justify-center shadow-lg">
                <span className="text-xl">📊</span>
              </div>
              <div className="text-sm text-[#735557]">Transactions</div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#D9D9D9]">
              {depositedRoundups.length}
            </div>
            <div className="text-xs text-[#735557] mt-2">Deposited roundups</div>
          </div>
        </div>

        {/* Deposited Roundups Table */}
        <div className="bg-[#735557]/10 backdrop-blur-xl border border-[#735557]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#735557]/10 animate-fade-in-up animation-delay-400">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#735557] flex items-center justify-center shadow-lg">
              <span className="text-xl">📜</span>
            </div>
            <h2 className="text-2xl font-bold text-[#D9D9D9]">Deposit History</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-[#735557]/5 rounded-2xl animate-pulse border border-[#735557]/20">
                  <div className="h-4 bg-[#735557]/10 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-[#735557]/10 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : depositedRoundups.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 rounded-3xl bg-[#735557]/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-[#735557]/30">
                <svg className="w-10 h-10 text-[#735557]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#D9D9D9] mb-2">No deposits yet</h3>
              <p className="text-[#735557] mb-6">
                Once you deposit your roundups, they will appear here
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-[#735557] text-[#D9D9D9] rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#735557]/50 transition-all hover:scale-105"
              >
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-[#735557]/20">
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#735557]">Transaction</th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#735557]">USDC</th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#735557]">Roundup</th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#735557]">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depositedRoundups.map((roundup, index) => (
                      <tr key={roundup.id || index} className="border-b border-[#735557]/10 hover:bg-[#735557]/5 transition-colors">
                        <td className="py-4 px-2 sm:px-4">
                          <a
                            href={`https://base-sepolia.blockscout.com/tx/${roundup.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#735557] hover:text-[#D9D9D9] hover:underline font-mono text-xs sm:text-sm transition-colors"
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
                        <td className="py-4 px-2 sm:px-4 text-[#735557] text-xs sm:text-sm">
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
        <div className="mt-8 bg-[#735557]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#735557]/20 animate-fade-in-up animation-delay-600">
          <h3 className="font-semibold text-[#D9D9D9] mb-4 flex items-center gap-2">
            <span className="text-lg">💡</span>
            About Your Portfolio
          </h3>
          <div className="space-y-3 text-sm text-[#735557]">
            <p className="flex items-start gap-2">
              <span className="text-[#D9D9D9] flex-shrink-0">✓</span>
              <span>These roundups have been deposited to the smart contract and are earning yield in Aave V3</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#D9D9D9] flex-shrink-0">✓</span>
              <span>Your ETH is automatically invested when pending roundups reach $1.00</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#D9D9D9] flex-shrink-0">✓</span>
              <span>You can withdraw your deposits + yield anytime from the smart contract</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#D9D9D9] flex-shrink-0">⚡</span>
              <span>Current ETH/USD price from Chronicle Oracle: <span className="font-bold text-[#D9D9D9]">${ethPrice?.toLocaleString() || 'Loading...'}</span></span>
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
