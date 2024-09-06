import { Web3AuthContextConfig } from "@web3auth/modal-react-hooks";
import { Web3AuthOptions } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";

// Sepolia Testnet Config
export const sepoliaChainConfig = {
    chainId: "0xaa36a7", // Sepolia Testnet Chain ID
    displayName: "Ethereum Sepolia",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    tickerName: "Ethereum Sepolia",
    ticker: "ETH",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

// Base Sepolia Config
export const baseSepoliaChainConfig = {
    chainId: "0x14a34",
    displayName: "Base Sepolia",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    tickerName: "Base Sepolia",
    ticker: "ETH",
    rpcTarget: "https://sepolia.base.org",
    blockExplorerUrl: "https://base-sepolia.blockscout.com",
    logo: "https://assets.website-files.com/63bc8f67cc61074f9e12b30c/63e65c4fc7f6782f19a68e58_base-coinbase-logo.png",
};

const clientId = "BAFaW0ALQJvs4fnwoltiqYfhBnieVHoK6HtOoTuvbhm0IllAlMs8dEYLTwuT3_5tWH_2PU3jkEpc3X-d_QcI1KE";

// Sepolia Private Key Provider
const sepoliaPrivateKeyProvider = new EthereumPrivateKeyProvider({
    config: {
        chainConfig: sepoliaChainConfig,
    },
});

// Base Sepolia Private Key Provider
const basePrivateKeyProvider = new EthereumPrivateKeyProvider({
    config: {
        chainConfig: baseSepoliaChainConfig,
    },
});

const web3AuthOptions: Web3AuthOptions = {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider: sepoliaPrivateKeyProvider, // You can switch between `sepoliaPrivateKeyProvider` and `basePrivateKeyProvider`
};

const metamaskAdapter = new MetamaskAdapter({
    clientId,
    sessionTime: 3600, // 1 hour in seconds
    chainConfig: sepoliaChainConfig, // Applying Sepolia config here, you can switch to baseSepoliaChainConfig
});

const coinbaseAdapter = new CoinbaseAdapter({
    clientId,
    sessionTime: 3600, // 1 hour in seconds
    chainConfig: sepoliaChainConfig, // Applying Sepolia config here, you can switch to baseSepoliaChainConfig
});

const openloginAdapter = new OpenloginAdapter({
    adapterSettings: {
        network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    },
    chainConfig: sepoliaChainConfig, // Applying Sepolia config here, you can switch to baseSepoliaChainConfig
});

const walletServicesPlugin = new WalletServicesPlugin({
    wsEmbedOpts: {},
    walletInitOptions: { whiteLabel: { showWidgetButton: true } },
});

export const web3AuthContextConfig: Web3AuthContextConfig = {
    web3AuthOptions,
    adapters: [openloginAdapter, metamaskAdapter, coinbaseAdapter],
    plugins: [walletServicesPlugin],
};

// To switch between Sepolia and Base Sepolia, you can adjust the chainConfig properties in the `privateKeyProvider`, `metamaskAdapter`, `coinbaseAdapter`, and `openloginAdapter`.
