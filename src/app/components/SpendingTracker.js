"use client"

export default function SpendingTracker({ transactions, loading, totalRoundups }) {
  // Get icon SVG based on transaction destination address
  const getTransactionIcon = (to) => {
    const address = to?.toLowerCase() || ""

    // Default transaction icon
    return (
      <svg className="w-7 h-7 text-[#FFFFF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
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
    <div className="bg-gradient-to-br from-[#CD7F32]/10 to-[#CD7F32]/5 backdrop-blur-2xl border border-[#CD7F32]/25 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl shadow-[#CD7F32]/15 transition-all duration-300 hover:shadow-[#CD7F32]/20">
      {/* Header with gradient badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#CD7F32] to-[#1C1410] flex items-center justify-center shadow-lg shadow-[#CD7F32]/30 transform hover:scale-110 transition-all duration-300 flex-shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-lg">Spending Tracker</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#D9D9D9] font-medium tracking-wide">Your USDC transactions and roundups</p>
        </div>
        <div className="text-left sm:text-right bg-gradient-to-br from-[#1C1410]/15 to-[#CD7F32]/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#CD7F32]/20 shadow-md">
          <div className="text-[10px] sm:text-xs text-[#CD7F32] mb-1 sm:mb-2 font-semibold tracking-wider uppercase">Total Roundups</div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#D9D9D9] tracking-tight">
            ${totalRoundups.toFixed(2)}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 sm:p-5 bg-gradient-to-r from-[#CD7F32]/8 to-[#CD7F32]/3 rounded-xl sm:rounded-2xl animate-pulse border border-[#CD7F32]/15 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#CD7F32]/15 shadow-md flex-shrink-0" />
                <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                  <div className="h-4 sm:h-5 bg-[#CD7F32]/15 rounded-lg w-1/3" />
                  <div className="h-3 sm:h-4 bg-[#CD7F32]/10 rounded-lg w-1/2" />
                </div>
              </div>
              <div className="h-6 sm:h-7 bg-[#CD7F32]/15 rounded-lg w-16 sm:w-20 flex-shrink-0" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 sm:py-16 md:py-20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#CD7F32]/20 to-[#1C1410]/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm border border-[#CD7F32]/25 shadow-lg">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#CD7F32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#D9D9D9] mb-2 sm:mb-3 tracking-tight px-4">No transactions yet</h3>
          <p className="text-sm sm:text-base text-[#CD7F32] mb-4 sm:mb-6 font-medium px-4">
            Start spending with USDC on Base Sepolia to see your roundups here
          </p>
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-br from-[#CD7F32]/15 to-[#1C1410]/5 border border-[#CD7F32]/25 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-[#D9D9D9] font-mono shadow-md">
            <span className="hidden sm:inline font-semibold">USDC:</span>
            <span className="truncate">0x036C...dCF7e</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {transactions.map((tx, index) => (
            <div
              key={tx.hash || index}
              className="flex items-center justify-between p-3 sm:p-4 md:p-5 bg-gradient-to-r from-[#CD7F32]/8 to-[#CD7F32]/3 hover:from-[#CD7F32]/15 hover:to-[#CD7F32]/8 rounded-xl sm:rounded-2xl border border-[#CD7F32]/20 hover:border-[#CD7F32]/35 transition-all duration-300 group hover:shadow-xl hover:shadow-[#CD7F32]/15 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-1 min-w-0">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#CD7F32]/25 to-[#1C1410]/15 flex items-center justify-center border border-[#CD7F32]/25 flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent"></div>
                  <div className="relative z-10">{getTransactionIcon(tx.to)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="font-bold text-sm sm:text-base text-[#D9D9D9] truncate tracking-tight">
                      {shortenAddress(tx.to)}
                    </div>
                    <a
                      href={`https://base-sepolia.blockscout.com/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center -m-2"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CD7F32] hover:text-[#D9D9D9] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-[#CD7F32] mt-1 sm:mt-1.5 font-medium">
                    <span className="hidden sm:inline">${tx.amount.toFixed(2)} → ${tx.roundedAmount.toFixed(2)} • </span>
                    {formatDate(tx.timestamp)}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2 sm:ml-3">
                <div className="text-[#D9D9D9] font-black text-sm sm:text-base md:text-lg tracking-tight">+${tx.roundup.toFixed(2)}</div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-[#CD7F32] font-semibold uppercase tracking-wide">roundup</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#CD7F32]/15">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-[#CD7F32] font-medium">
              Showing {transactions.length} recent transaction{transactions.length !== 1 ? "s" : ""}
            </span>
            <button className="text-[#D9D9D9] hover:text-[#CD7F32] font-semibold transition-colors hover:scale-105 transform touch-manipulation min-h-[44px] flex items-center">
              View All →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
