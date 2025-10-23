"use client"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import config from "@/rainbowKitConfig"
import {WagmiProvider} from "wagmi"
import {RainbowKitProvider} from "@rainbow-me/rainbowkit"
import {useState} from "react"
import "@rainbow-me/rainbowkit/styles.css"

export function Providers({children}){
    const [queryClient] = useState(() => new QueryClient())
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}