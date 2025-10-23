"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { useOraclePrice } from "../hooks/useOraclePrice"

// CoffeeChangeV2 contract on Base Sepolia
const COFFEE_CHANGE_ADDRESS = "0x449c5730788b0eebcbFF1D2935Ff107999328D61"

// CoffeeChangeV2 ABI
const COFFEE_CHANGE_ABI = [
  {
    inputs: [{ internalType: "address", name: "_oracleReader", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "CoffeeChangeV2__CannotBeLessThanOrEqualToZero",
    type: "error"
  },
  {
    inputs: [],
    name: "AAVE_CONTRACT",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getBalanceInUsdValue",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "oracleReader",
    outputs: [{ internalType: "contract OracleReader", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "s_balanceOfContractInEth",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "s_userPositions",
    outputs: [
      { internalType: "uint256", name: "depositsInContract", type: "uint256" },
      { internalType: "uint256", name: "depositedInAave", type: "uint256" },
      { internalType: "uint256", name: "userFirstContributionTimestamp", type: "uint256" },
      { internalType: "uint256", name: "timestampToWithdraw", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "userDepositEth",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
]

export default function DepositCard({ totalRoundupsUSD }) {
  const { address } = useAccount()
  const { ethPrice, priceAge, loading: priceLoading } = useOraclePrice()

  const [requiredETH, setRequiredETH] = useState(null)
  const [loading, setLoading] = useState(false)
  const [canDeposit, setCanDeposit] = useState(false)

  // Contract write hook
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Check if total >= $1.00
  useEffect(() => {
    setCanDeposit(totalRoundupsUSD >= 1.0)
  }, [totalRoundupsUSD])

  // Calculate required ETH amount
  useEffect(() => {
    if (ethPrice && totalRoundupsUSD > 0) {
      const required = totalRoundupsUSD / ethPrice
      setRequiredETH(required)
    } else {
      setRequiredETH(null)
    }
  }, [ethPrice, totalRoundupsUSD])

  // Handle deposit
  const handleDeposit = async () => {
    if (!requiredETH || !address || !canDeposit) return

    try {
      setLoading(true)

      console.log("=== DEPOSIT INITIATED ===")
      console.log("USD Value:", totalRoundupsUSD)
      console.log("ETH Price:", ethPrice)
      console.log("Required ETH:", requiredETH)

      // Call userDepositEth on CoffeeChangeV2 contract
      writeContract({
        address: COFFEE_CHANGE_ADDRESS,
        abi: COFFEE_CHANGE_ABI,
        functionName: "userDepositEth",
        value: parseEther(requiredETH.toFixed(18)),
      })

      console.log("Transaction sent to wallet for confirmation...")
    } catch (error) {
      console.error("Deposit failed:", error)
      setLoading(false)
    }
  }

  // Mark roundups as deposited in database
  const markRoundupsAsDeposited = async () => {
    if (!hash || !address) return

    try {
      const response = await fetch('/api/mark-deposited', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          txHash: hash
        })
      })

      if (!response.ok) {
        console.error('Failed to mark roundups as deposited')
      } else {
        console.log('Successfully marked roundups as deposited')
      }
    } catch (error) {
      console.error('Error marking roundups:', error)
    }
  }

  // Call markRoundupsAsDeposited when transaction is successful
  useEffect(() => {
    if (isSuccess && hash) {
      console.log("✅ Transaction successful! Hash:", hash)
      markRoundupsAsDeposited()
      setLoading(false)

      // Refresh page after 2 seconds to show updated data
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }, [isSuccess, hash, address])

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      console.error("❌ Transaction error:", error)
      setLoading(false)
    }
  }, [error])

  // Reset loading state when pending
  useEffect(() => {
    if (isPending) {
      console.log("⏳ Waiting for wallet confirmation...")
    }
  }, [isPending])

  useEffect(() => {
    if (isConfirming) {
      console.log("🔄 Transaction confirming on blockchain...")
    }
  }, [isConfirming])

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return ""
    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  // Calculate progress percentage
  const progressPercentage = Math.min((totalRoundupsUSD / 1.0) * 100, 100)

  return (
    <div className="bg-[#735557]/10 backdrop-blur-xl border border-[#735557]/30 rounded-3xl p-6 shadow-2xl shadow-[#735557]/10 transition-all duration-300 sticky top-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-[#735557] flex items-center justify-center shadow-lg">
          <span className="text-xl">💎</span>
        </div>
        <h3 className="text-xl font-bold text-[#D9D9D9]">Deposit ETH</h3>
      </div>

      {/* Progress Bar to $1 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#735557]">Progress to $1.00</span>
          <span className="text-xs font-bold text-[#D9D9D9]">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="relative h-3 bg-[#735557]/10 rounded-full overflow-hidden border border-[#735557]/30">
          <div
            className="absolute inset-y-0 left-0 bg-[#735557] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 10 && (
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-[#D9D9D9]/30 to-transparent" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-[#735557]">${totalRoundupsUSD.toFixed(2)}</span>
          <span className="text-xs text-[#735557]">$1.00</span>
        </div>
      </div>

      {/* ETH Price Display */}
      <div className="bg-[#735557]/5 rounded-2xl p-4 mb-6 border border-[#735557]/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#735557]">ETH Price</span>
          {priceAge && (
            <span className="text-[10px] text-[#735557]">{formatTimeAgo(priceAge)}</span>
          )}
        </div>
        {ethPrice ? (
          <div className="text-2xl font-bold text-[#D9D9D9]">
            ${ethPrice.toLocaleString()}
          </div>
        ) : (
          <div className="h-8 bg-[#735557]/10 rounded animate-pulse" />
        )}
        <div className="text-[10px] text-[#735557] mt-1">via Chronicle Oracle</div>
      </div>

      {/* Roundup Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between py-3 border-b border-[#735557]/20">
          <span className="text-sm text-[#735557]">Total Roundups</span>
          <span className="font-bold text-[#D9D9D9]">${totalRoundupsUSD.toFixed(2)}</span>
        </div>

        {requiredETH && (
          <>
            <div className="flex items-center justify-between py-3 border-b border-[#735557]/20">
              <span className="text-sm text-[#735557]">Required ETH</span>
              <span className="font-bold text-[#D9D9D9]">{requiredETH.toFixed(6)} ETH</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-[#735557]">Rate</span>
              <span className="text-xs text-[#D9D9D9]/70">1 ETH = ${ethPrice?.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {/* Deposit Button */}
      <button
        onClick={handleDeposit}
        disabled={!canDeposit || loading || isPending || isConfirming}
        className="w-full px-6 py-4 bg-[#735557] text-[#D9D9D9] rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#735557]/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-[#735557]/50"
      >
        {loading || isPending || isConfirming ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {isPending ? "Confirm in wallet..." : isConfirming ? "Confirming..." : "Processing..."}
          </span>
        ) : !canDeposit ? (
          `Need $${(1.0 - totalRoundupsUSD).toFixed(2)} more`
        ) : (
          `💎 Deposit ${requiredETH?.toFixed(6) || 0} ETH`
        )}
      </button>

      {isSuccess && (
        <div className="mt-4 p-4 bg-[#735557]/20 border border-[#735557]/40 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[#D9D9D9]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Deposit successful!</span>
          </div>
          {hash && (
            <a
              href={`https://base-sepolia.blockscout.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#735557] hover:text-[#D9D9D9] hover:underline mt-2 block transition-colors"
            >
              View transaction →
            </a>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-[#735557]/10 border border-[#735557]/30 rounded-2xl backdrop-blur-sm">
          <div className="text-sm text-[#D9D9D9]">
            Error: {error.message?.split("\n")[0] || "Transaction failed"}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 pt-6 border-t border-[#735557]/20">
        <div className="space-y-3 text-xs text-[#735557]">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#735557]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your ETH will be automatically invested to Aave V3 when it reaches $1.00</span>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#735557]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>You can withdraw your ETH + yield at any time</span>
          </div>
        </div>
      </div>

      {/* Shimmer animation style */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
