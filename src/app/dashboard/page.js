"use client"

import { useAccount } from "wagmi"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SpendingTracker from "../components/SpendingTracker"
import DepositCard from "../components/DepositCard"

export default function Dashboard() {
  const { address, isConnected, isConnecting } = useAccount() // Add isConnecting
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRoundups, setTotalRoundups] = useState(0)

  // Redirect if not connected (but wait for wallet check to complete)
  useEffect(() => {
    // Only redirect if we're sure the wallet is disconnected (not just loading)
    if (!isConnected && !isConnecting) {
      const timer = setTimeout(() => {
        router.push("/")
      }, 500) // Small delay to allow wallet connection to initialize
      
      return () => clearTimeout(timer)
    }
  }, [isConnected, isConnecting, router])

  // Sync transactions and fetch roundups from database
  useEffect(() => {
    if (!address) return

    const syncAndFetchData = async () => {
      try {
        setLoading(true)

        // Step 1: Sync transactions from Blockscout to database
        const syncResponse = await fetch('/api/sync-transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address })
        })

        if (!syncResponse.ok) {
          console.error('Failed to sync transactions')
        }

        // Step 2: Get pending roundups from database
        const roundupsResponse = await fetch('/api/get-roundups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address })
        })

        if (!roundupsResponse.ok) {
          throw new Error('Failed to fetch roundups')
        }

        const roundupsData = await roundupsResponse.json()

        // Transform database roundups to display format
        const processedTxs = roundupsData.roundups.map(r => ({
          hash: r.tx_hash,
          timestamp: r.created_at,
          amount: parseFloat(r.usdc_amount),
          roundedAmount: Math.ceil(parseFloat(r.usdc_amount)),
          roundup: parseFloat(r.roundup_amount),
          to: r.tx_hash.slice(0, 10) + '...',
        }))

        setTransactions(processedTxs)
        setTotalRoundups(roundupsData.totalPending)

      } catch (error) {
        console.error("Error fetching data:", error)
        // Fallback to empty state
        setTransactions([])
        setTotalRoundups(0)
      } finally {
        setLoading(false)
      }
    }

    syncAndFetchData()

  }, [address])

  // Show loading state while checking wallet connection
  if (isConnecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Checking wallet connection...</p>
      </div>
    )
  }

  // Show connect prompt if not connected (instead of redirecting immediately)
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="text-muted-foreground mb-6">Please connect your wallet to view the dashboard</p>
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
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#735557]/20 backdrop-blur-md border border-[#735557]/40 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#D9D9D9] animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-[#D9D9D9]">Live Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#D9D9D9] mb-2">
            Your Dashboard
          </h1>
          <p className="text-lg text-[#D9D9D9]/70">Track your spending and manage your roundup deposits</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 animate-fade-in-up animation-delay-200">
            <SpendingTracker
              transactions={transactions}
              loading={loading}
              totalRoundups={totalRoundups}
            />
          </div>

          <div className="lg:col-span-1 animate-fade-in-up animation-delay-400">
            <DepositCard totalRoundupsUSD={totalRoundups} />
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