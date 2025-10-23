"use client"

export default function SpendingTracker({ transactions, loading, totalRoundups }) {
  // Get emoji based on transaction destination address
  const getTransactionEmoji = (to) => {
    const address = to.toLowerCase()
    if (address.includes("coffee")) return "☕"
    if (address.includes("lunch") || address.includes("food")) return "🍕"
    if (address.includes("ride") || address.includes("uber")) return "🚕"
    if (address.includes("shop") || address.includes("store")) return "🛒"
    if (address.includes("gas")) return "⛽"
    return "💳"
  }

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  // Shorten address for display
  const shortenAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="bg-[#735557]/10 backdrop-blur-xl border border-[#735557]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#735557]/10 transition-all duration-300">
      {/* Header with gradient badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#735557] flex items-center justify-center shadow-lg">
              <span className="text-xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-[#D9D9D9]">Spending Tracker</h2>
          </div>
          <p className="text-sm text-[#735557] mt-1">Your USDC transactions and roundups</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xs text-[#735557] mb-1">Total Roundups</div>
          <div className="text-3xl sm:text-4xl font-black text-[#D9D9D9]">
            ${totalRoundups.toFixed(2)}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#735557]/5 rounded-2xl animate-pulse border border-[#735557]/20">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-[#735557]/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#735557]/10 rounded w-1/3" />
                  <div className="h-3 bg-[#735557]/10 rounded w-1/2" />
                </div>
              </div>
              <div className="h-6 bg-[#735557]/10 rounded w-16" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-20 h-20 rounded-3xl bg-[#735557]/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-[#735557]/30">
            <svg className="w-10 h-10 text-[#735557]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#D9D9D9] mb-2">No transactions yet</h3>
          <p className="text-[#735557] mb-4">
            Start spending with USDC on Base Sepolia to see your roundups here
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#735557]/10 border border-[#735557]/20 rounded-xl text-xs sm:text-sm text-[#D9D9D9] font-mono">
            <span className="hidden sm:inline">USDC:</span>
            <span>0x036C...dCF7e</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div
              key={tx.hash || index}
              className="flex items-center justify-between p-3 sm:p-4 bg-[#735557]/5 hover:bg-[#735557]/15 rounded-2xl border border-[#735557]/20 hover:border-[#735557]/40 transition-all group hover:shadow-lg hover:shadow-[#735557]/10 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#735557]/20 flex items-center justify-center border border-[#735557]/30 flex-shrink-0">
                  <span className="text-2xl">{getTransactionEmoji(tx.to)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-[#D9D9D9] truncate">
                      {shortenAddress(tx.to)}
                    </div>
                    <a
                      href={`https://base-sepolia.blockscout.com/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <svg className="w-4 h-4 text-[#735557] hover:text-[#D9D9D9] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  <div className="text-xs sm:text-sm text-[#735557] mt-1">
                    <span className="hidden sm:inline">${tx.amount.toFixed(2)} → ${tx.roundedAmount.toFixed(2)} • </span>
                    {formatDate(tx.timestamp)}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="text-[#D9D9D9] font-bold text-sm sm:text-base">+${tx.roundup.toFixed(2)}</div>
                <div className="text-[10px] sm:text-xs text-[#735557]">roundup</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#735557]/20">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-[#735557]">
              Showing {transactions.length} recent transaction{transactions.length !== 1 ? "s" : ""}
            </span>
            <button className="text-[#D9D9D9] hover:text-[#735557] font-medium transition-colors">
              View All →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
