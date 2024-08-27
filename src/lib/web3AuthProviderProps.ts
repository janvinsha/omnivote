import { Web3AuthContextConfig } from "@web3auth/modal-react-hooks";
import { Web3AuthOptions } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";
import { WalletConnectModal } from "@walletconnect/modal";
import {
    getWalletConnectV2Settings,
    WalletConnectV2Adapter,
} from "@web3auth/wallet-connect-v2-adapter";

const chainConfig = {
    chainId: "0xaa36a7", // for wallet connect make sure to pass in this chain in the loginSettings of the adapter.
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
    web3AuthNetwork: "sapphire_mainnet",
    chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
});

const coinbaseAdapter = new CoinbaseAdapter({
    clientId,
    sessionTime: 3600, // 1 hour in seconds
    chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
    web3AuthNetwork: "sapphire_mainnet",
});

const openloginAdapter = new OpenloginAdapter();

const walletServicesPlugin = new WalletServicesPlugin({
    wsEmbedOpts: {},
    walletInitOptions: { whiteLabel: { showWidgetButton: true } },
});

// const defaultWcSettings = await getWalletConnectV2Settings(
//     "eip155",
//     ["1"],
//     "04309ed1007e77d1f119b85205bb779d",
// );
// const walletConnectModal = new WalletConnectModal({
//     projectId: "04309ed1007e77d1f119b85205bb779d",
// });
// const walletConnectV2Adapter = new WalletConnectV2Adapter({
//     adapterSettings: { qrcodeModal: walletConnectModal, ...defaultWcSettings.adapterSettings },
//     loginSettings: { ...defaultWcSettings.loginSettings },
// });



export const web3AuthContextConfig: Web3AuthContextConfig = {
    web3AuthOptions,
    adapters: [openloginAdapter, metamaskAdapter, coinbaseAdapter],
    // adapters: adapters,
    plugins: [walletServicesPlugin],
};
