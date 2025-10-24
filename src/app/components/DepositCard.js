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
    <div className="bg-gradient-to-br from-[#CD7F32]/12 to-[#CD7F32]/5 backdrop-blur-2xl border border-[#CD7F32]/25 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-[#CD7F32]/15 transition-all duration-300 lg:sticky lg:top-24 hover:shadow-[#CD7F32]/20 perspective-1000">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#CD7F32] to-[#1C1410] flex items-center justify-center shadow-lg shadow-[#CD7F32]/30 transform hover:scale-110 transition-all duration-300 preserve-3d hover:rotateY-12 flex-shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-lg">Deposit ETH</h3>
      </div>

      {/* Progress Bar to $1 */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm text-[#CD7F32] font-medium tracking-wide">Progress to $1.00</span>
          <span className="text-xs sm:text-sm font-bold text-[#D9D9D9] tracking-tight">{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="relative h-3 sm:h-4 bg-[#1C1410]/20 rounded-full overflow-hidden border border-[#CD7F32]/20 shadow-inner">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#CD7F32] to-[#1C1410] rounded-full transition-all duration-1000 ease-out shadow-lg shadow-[#CD7F32]/40"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 10 && (
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <span className="text-xs sm:text-sm font-semibold text-[#FFFFF0]">${totalRoundupsUSD.toFixed(2)}</span>
          <span className="text-xs sm:text-sm font-semibold text-[#CD7F32]">$1.00</span>
        </div>
      </div>

      {/* ETH Price Display */}
      <div className="bg-gradient-to-br from-[#1C1410]/15 to-[#CD7F32]/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-[#CD7F32]/20 shadow-md backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm text-[#CD7F32] font-semibold tracking-wide">ETH Price</span>
          {priceAge && (
            <span className="text-[10px] sm:text-xs text-[#CD7F32]/70 font-medium">{formatTimeAgo(priceAge)}</span>
          )}
        </div>
        {ethPrice ? (
          <div className="text-2xl sm:text-3xl font-black text-[#D9D9D9] tracking-tight">
            ${ethPrice.toLocaleString()}
          </div>
        ) : (
          <div className="h-8 sm:h-9 bg-[#CD7F32]/10 rounded-xl animate-pulse" />
        )}
        <div className="text-[10px] sm:text-xs text-[#CD7F32]/80 mt-1.5 sm:mt-2 font-medium">via Chronicle Oracle</div>
      </div>

      {/* Roundup Summary */}
      <div className="space-y-1 mb-6 sm:mb-8">
        <div className="flex items-center justify-between py-3 sm:py-4 border-b border-[#CD7F32]/15">
          <span className="text-xs sm:text-sm text-[#CD7F32] font-semibold">Total Roundups</span>
          <span className="font-bold text-[#D9D9D9] text-base sm:text-lg tracking-tight">${totalRoundupsUSD.toFixed(2)}</span>
        </div>

        {requiredETH && (
          <>
            <div className="flex items-center justify-between py-3 sm:py-4 border-b border-[#CD7F32]/15">
              <span className="text-xs sm:text-sm text-[#CD7F32] font-semibold">Required ETH</span>
              <span className="font-bold text-[#D9D9D9] text-base sm:text-lg tracking-tight">{requiredETH.toFixed(6)} ETH</span>
            </div>

            <div className="flex items-center justify-between py-3 sm:py-4">
              <span className="text-xs sm:text-sm text-[#CD7F32] font-semibold">Rate</span>
              <span className="text-xs sm:text-sm text-[#D9D9D9]/80 font-medium">1 ETH = ${ethPrice?.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {/* Deposit Button */}
      <button
        onClick={handleDeposit}
        disabled={!canDeposit || loading || isPending || isConfirming}
        className="relative w-full px-6 sm:px-7 py-3.5 sm:py-4 bg-gradient-to-r from-[#CD7F32] to-[#1C1410] text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base tracking-tight hover:shadow-2xl hover:shadow-[#CD7F32]/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:from-[#CD7F32]/50 disabled:to-[#1C1410]/50 border-t-2 border-t-white/20 border-b-2 border-b-black/20 shadow-lg overflow-hidden group min-h-[48px] touch-manipulation"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative z-10">
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
            `Deposit ${requiredETH?.toFixed(6) || 0} ETH`
          )}
        </span>
      </button>

      {isSuccess && (
        <div className="mt-5 sm:mt-6 p-4 sm:p-5 bg-gradient-to-br from-[#CD7F32]/25 to-[#1C1410]/15 border border-[#CD7F32]/40 rounded-xl sm:rounded-2xl backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2.5 sm:gap-3 text-[#FFFFF0]">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#CD7F32] flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-semibold text-sm sm:text-base text-[#FFFFF0]">Deposit successful!</span>
          </div>
          {hash && (
            <a
              href={`https://base-sepolia.blockscout.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-[#CD7F32] hover:text-white hover:underline mt-2.5 sm:mt-3 block transition-colors font-medium touch-manipulation"
            >
              View transaction →
            </a>
          )}
        </div>
      )}

      {error && (
        <div className="mt-5 sm:mt-6 p-4 sm:p-5 bg-[#CD7F32]/10 border border-[#CD7F32]/30 rounded-xl sm:rounded-2xl backdrop-blur-sm shadow-md">
          <div className="text-xs sm:text-sm text-[#D9D9D9] font-medium">
            Error: {error.message?.split("\n")[0] || "Transaction failed"}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#CD7F32]/15">
        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#CD7F32]">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-relaxed">Your ETH will be automatically invested to Aave V3 when it reaches $1.00</span>
          </div>
          <div className="flex items-start gap-2.5 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="leading-relaxed">You can withdraw your ETH + yield at any time</span>
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
