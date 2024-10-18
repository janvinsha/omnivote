import { http, createConfig } from 'wagmi'
import { polygonAmoy, avalancheFuji, bscTestnet, sepolia, mainnet } from 'wagmi/chains'

export const config = createConfig({
    chains: [sepolia, polygonAmoy, avalancheFuji, bscTestnet],
    transports: {
        [sepolia.id]: http(),
        [polygonAmoy.id]: http("https://polygon-amoy.drpc.org"),
        [avalancheFuji.id]: http("https://api.avax-test.network/ext/bc/C/rpc"),
        [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545/"),
    },
})
