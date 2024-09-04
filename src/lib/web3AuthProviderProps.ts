import { Web3AuthContextConfig } from "@web3auth/modal-react-hooks";
import { Web3AuthOptions } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";

const chainConfig = {
    chainId: "0xaa36a7", // Sepolia Testnet Chain ID
    displayName: "Ethereum Sepolia",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    tickerName: "Ethereum Sepolia",
    ticker: "ETH",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const clientId = "BAFaW0ALQJvs4fnwoltiqYfhBnieVHoK6HtOoTuvbhm0IllAlMs8dEYLTwuT3_5tWH_2PU3jkEpc3X-d_QcI1KE";

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: {
        chainConfig,
    },
});

const web3AuthOptions: Web3AuthOptions = {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider: privateKeyProvider,
};

const metamaskAdapter = new MetamaskAdapter({
    clientId,
    sessionTime: 3600, // 1 hour in seconds
    chainConfig, // Applying Sepolia config here
});

const coinbaseAdapter = new CoinbaseAdapter({
    clientId,
    sessionTime: 3600, // 1 hour in seconds
    chainConfig, // Applying Sepolia config here
});

const openloginAdapter = new OpenloginAdapter({
    adapterSettings: {
        network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    },
    chainConfig, // Applying Sepolia config here
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
