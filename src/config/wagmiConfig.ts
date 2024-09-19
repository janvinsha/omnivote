import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism, baseSepolia, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = '<WALLETCONNECT_PROJECT_ID>'

export const config = createConfig({
    chains: [sepolia, mainnet, base, baseSepolia],
    // connectors: [
    //     injected(),
    //     // walletConnect({ projectId }),
    //     metaMask(),
    //     safe(),
    // ],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
        [baseSepolia.id]: http(),
        [sepolia.id]: http(),
    },
})
