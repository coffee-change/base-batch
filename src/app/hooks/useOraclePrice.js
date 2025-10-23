"use client"

import { useState, useEffect } from "react"
import { usePublicClient } from "wagmi"
import { formatEther } from "viem"
import { baseSepolia } from "wagmi/chains"

// Oracle contract on Base Sepolia
const ORACLE_ADDRESS = "0x3590Fe3A70Aee3EeE7D07e6a15b02F089853B3b2"

const ORACLE_ABI = [
  {
    inputs: [],
    name: "chronicle",
    outputs: [{ internalType: "contract IChronicle", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "read",
    outputs: [
      { internalType: "uint256", name: "val", type: "uint256" },
      { internalType: "uint256", name: "age", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "selfKisser",
    outputs: [{ internalType: "contract ISelfKisser", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
]

export function useOraclePrice() {
  const [ethPrice, setEthPrice] = useState(null)
  const [priceAge, setPriceAge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const publicClient = usePublicClient({ chainId: baseSepolia.id })

  useEffect(() => {
    const fetchPrice = async () => {
      if (!publicClient) return

      try {
        setLoading(true)
        setError(null)

        // Read price from Oracle contract
        const [val, age] = await publicClient.readContract({
          address: ORACLE_ADDRESS,
          abi: ORACLE_ABI,
          functionName: "read"
        })

        // Convert from 18 decimals to USD
        const priceInUSD = Number(formatEther(val))

        setEthPrice(priceInUSD)
        setPriceAge(Number(age))

        console.log('Oracle ETH/USD Price:', priceInUSD, 'Age:', new Date(Number(age) * 1000))
      } catch (err) {
        console.error("Error fetching Oracle price:", err)
        setError(err.message)
        // Fallback to mock price
        setEthPrice(2500)
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()

    // Refresh every 30 seconds
    const interval = setInterval(fetchPrice, 30000)

    return () => clearInterval(interval)
  }, [publicClient])

  return { ethPrice, priceAge, loading, error }
}
