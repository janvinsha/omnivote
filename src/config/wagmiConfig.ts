import { http, createConfig } from 'wagmi'
import { polygonAmoy, avalancheFuji, bscTestnet, sepolia, mainnet, polygon, bsc, avalanche } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ""
const walletConnector = walletConnect({
    projectId,
});
export const config = createConfig({
    chains: [sepolia, polygonAmoy, avalancheFuji, bscTestnet, polygon, bsc, avalanche],
    connectors: [
        walletConnector
    ],
    ssr: true,
    transports: {
        [sepolia.id]: http(),
        [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
        [avalancheFuji.id]: http("https://api.avax-test.network/ext/bc/C/rpc"),
        [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545/"),
        [polygon.id]: http(),
        [avalanche.id]: http("https://api.avax.network/ext/bc/C/rpc"),
        [bsc.id]: http("https://bsc-dataseed1.binance.org/"),
    },
})
