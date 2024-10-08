import React, { createContext, useContext, useEffect, useState } from "react";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import RPC from "../lib/ethersRPC";

// Define the types for the context state
interface Web3AuthContextState {
    provider: IProvider | null;
    initialized: boolean;
    loggedIn: boolean;
    init: () => Promise<void>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<any>;
    getAccounts: () => Promise<any>;
    getBalance: () => Promise<any>;
    signMessage: () => Promise<void>;
    sendTransaction: () => Promise<void>;
}

// Create the Web3Auth context with default values
const Web3AuthContext = createContext<Web3AuthContextState | undefined>(undefined);

// Define the clientId and chainConfig
const clientId = "BAFaW0ALQJvs4fnwoltiqYfhBnieVHoK6HtOoTuvbhm0IllAlMs8dEYLTwuT3_5tWH_2PU3jkEpc3X-d_QcI1KE";
const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

// Create the Web3Auth provider component
export const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig },
    });

    const web3auth = new Web3Auth({
        clientId,
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        privateKeyProvider,
    });

    const init = async () => {
        try {
            console.log("Initializing Web3Auth modal...");
            await web3auth.initModal();
            await web3auth.initModal();
            await web3auth.initModal();
            await web3auth.initModal();
            await web3auth.initModal();
            console.log("Web3Auth modal initialized.");
            setProvider(web3auth.provider);
            setInitialized(true); // Set initialized to true once complete
            if (web3auth.connected) {
                setLoggedIn(true);

            }
        } catch (error: any) {
            if (error.message === "Wallet is not ready yet, Adapter is already initialized") {
                setInitialized(true); // Set initialized to true once complete 
            }
            console.log(error.message);
        }
    };

    useEffect(() => {
        init();
    }, []);

    const login = async () => {
        try {
            console.log("THE WALLET HAS BEEN INITIALIZED", initialized)
            if (initialized) {
                const web3authProvider = await web3auth.connect();
                setProvider(web3authProvider);
            }
            if (web3auth.connected) {
                setLoggedIn(true);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getUserInfo = async () => {
        try {
            const user = await web3auth.getUserInfo();
            uiConsole(user);
            return user;
        } catch (error) {
            console.log(error)
        }
    };

    const logout = async () => {
        try {
            await web3auth.logout();
            setProvider(null);
            setLoggedIn(false);
            uiConsole("logged out");
        } catch (error) {
            console.log(error)
        }
    };

    const getAccounts = async () => {
        try {
            if (!provider) {
                uiConsole("provider not initialized yet");
                return;
            }
            const address = await RPC.getAccounts(provider);
            uiConsole(address);
            return address;
        } catch (error) {
            console.log(error)
        }
    };

    const getBalance = async () => {
        try {
            if (!provider) {
                uiConsole("provider not initialized yet");
                return;
            }
            const balance = await RPC.getBalance(provider);
            uiConsole(balance);
            return balance;
        } catch (error) {
            console.log(error)
        }
    };

    const signMessage = async () => {
        try {
            if (!provider) {
                uiConsole("provider not initialized yet");
                return;
            }
            const signedMessage = await RPC.signMessage(provider);
            uiConsole(signedMessage);
        } catch (error) {
            console.log(error)
        }
    };

    const sendTransaction = async () => {
        try {
            if (!provider) {
                uiConsole("provider not initialized yet");
                return;
            }
            uiConsole("Sending Transaction...");
            const transactionReceipt = await RPC.sendTransaction(provider);
            uiConsole(transactionReceipt);
            return transactionReceipt;
        } catch (error) {
            console.log(error)
        }
    };

    function uiConsole(...args: any[]): void {
        const el = document.querySelector("#console>p");
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2);
            console.log(...args);
        }
    }

    return (
        <Web3AuthContext.Provider
            value={{
                provider,
                loggedIn,
                initialized,
                init, // Expose the init function
                login,
                logout,
                getUserInfo,
                getAccounts,
                getBalance,
                signMessage,
                sendTransaction,
            }}
        >
            {children}
        </Web3AuthContext.Provider>
    );
};

// Custom hook to use the Web3Auth context
export const useWeb3Auth = () => {
    const context = useContext(Web3AuthContext);
    if (!context) {
        throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
    }
    return context;
};
