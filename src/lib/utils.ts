// @ts-nocheck
import { amoyContractAddress, bscTestContractAddress, avaxContractAddress, polygonContractAddress, bscContractAddress, avalanceContractAddress, amoyChainSelector, bscTestChainSelector, avaxChainSelector, polygonChainSelector, bscChainSelector, avalanceChainSelector, amoyChainId, bscTestChainId, avaxChainId, polygonChainId, bscChainId, avalanceChainId, sepoliaContractAddress, ethContractAddress, sepoliaChainSelector, ethChainSelector, sepoliaChainId, ethChainId, sepoliaScanUrl, amoyScanUrl, bscTestScanUrl, avaxScanUrl, ethScanUrl, polygonScanUrl, bscScanUrl, avalanceScanUrl } from "@/data/contracts"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const appEnv = process.env.NEXT_PUBLIC_APP_ENV || "testnet"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//TODO: get the chain URLS
// Return chain image based on contract address
export function getChainImage(contractAddress: string) {

  const chainToImg = {
    [sepoliaContractAddress]: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    [amoyContractAddress]: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
    [bscTestContractAddress]: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
    [avaxContractAddress]: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg",

    [ethContractAddress]: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    [polygonContractAddress]: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
    [bscContractAddress]: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
    [avalanceContractAddress]: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg",
  };
  return chainToImg[contractAddress] || "https://chainlist.org/unknown-logo.png";
}

// Return chain name based on contract address
export function getChainName(contractAddress: string) {
  const chainToName = {
    [sepoliaContractAddress]: "Ethereum Sepolia Testnet",
    [amoyContractAddress]: "Polygon Amoy Testnet",
    [bscTestContractAddress]: "Binance Smart Chain Testnet",
    [avaxContractAddress]: "Avalance Testnet",

    [ethContractAddress]: "Ethereum Mainnet",
    [polygonContractAddress]: "Polygon Mainnet",
    [bscContractAddress]: "Binance Smart Chain Mainnet",
    [avalanceContractAddress]: "Avalanche Mainnet",
  };
  return chainToName[contractAddress] || "Polygon Amoy Testnet";
}

// Return chain getChainTokenName based on contract address
export function getChainTokenName(contractAddress: string) {
  const chainToName = {
    [sepoliaContractAddress]: "Eth testnet",
    [amoyContractAddress]: "Matic testnet",
    [bscTestContractAddress]: "TBnb",
    [avaxContractAddress]: "Avax testnet",

    [ethContractAddress]: "Eth",
    [polygonContractAddress]: "Matic",
    [bscContractAddress]: "Bnb",
    [avalanceContractAddress]: "Avax",
  };
  return chainToName[contractAddress] || "Matic testnet";
}

export function getCreationFee(contractAddress: string) {
  const chainToName = {
    [sepoliaContractAddress]: "0.0001",
    [amoyContractAddress]: "0.0004",
    [bscTestContractAddress]: "0.0005",
    [avaxContractAddress]: "0.01",

    [ethContractAddress]: "0.0001",
    [polygonContractAddress]: "0.0004",
    [bscContractAddress]: "0.0005",
    [avalanceContractAddress]: "0.01",
  };
  return chainToName[contractAddress] || "0.0004";
}

export function getVoteFee(contractAddress: string) {
  const chainToName = {
    [sepoliaContractAddress]: "0.000025",
    [amoyContractAddress]: "0.0001",
    [bscTestContractAddress]: "0.00025",
    [avaxContractAddress]: "0.0025",

    [ethContractAddress]: "0.000025",
    [polygonContractAddress]: "0.0001",
    [bscContractAddress]: "0.000125",
    [avalanceContractAddress]: "0.0025",
  };
  return chainToName[contractAddress] || "0.000125";
}

export const omnivoteContractList = appEnv === "testnet"
  ? [
    //   {

    //   value: sepoliaContractAddress, name: "Ethereum Sepolia"
    // }, 

    {

      value: amoyContractAddress, name: "Polygon Amoy"
    }, {
      value: bscTestContractAddress, name: "BSC Testnet"
    },
    {
      value: avaxContractAddress, name: "Avalanche Testnet"
    }
  ] : [
    //   {
    //   value: ethContractAddress, name: "Ethereum Mainnet"
    // },

    {
      value: polygonContractAddress, name: "Polygon Mainnet"
    }, {
      value: bscContractAddress, name: "BSC Mainnet"
    },
    {
      value: avalanceContractAddress, name: "Avalanche Mainnet"
    }
  ]

// Return the opposite chain selector based on contract address
export function getChainSelectorCrossChain(contractAddress: string) {
  const chainToSelector = {
    [sepoliaContractAddress]: sepoliaChainSelector,
    [amoyContractAddress]: amoyChainSelector,
    [bscTestContractAddress]: bscTestChainSelector,
    [avaxContractAddress]: avaxChainSelector,

    [ethContractAddress]: ethChainSelector,
    [polygonContractAddress]: polygonChainSelector,
    [bscContractAddress]: bscChainSelector,
    [avalanceContractAddress]: avalanceChainSelector,
  };
  return chainToSelector[contractAddress];
}


// Return chain ID based on contract address
export function getChainId(contractAddress: string) {
  const chainToChainId = {
    [sepoliaContractAddress]: sepoliaChainId,
    [amoyContractAddress]: amoyChainId,
    [bscTestContractAddress]: bscTestChainId,
    [avaxContractAddress]: avaxChainId,

    [ethContractAddress]: ethChainId,
    [polygonContractAddress]: polygonChainId,
    [bscContractAddress]: bscChainId,
    [avalanceContractAddress]: avalanceChainId,
  };
  return chainToChainId[contractAddress];
}


// Return chain ID based on contract address
export function getContractUrl(contractAddress: string) {
  const chainToChainId = {
    [sepoliaContractAddress]: sepoliaScanUrl,
    [amoyContractAddress]: amoyScanUrl,
    [bscTestContractAddress]: bscTestScanUrl,
    [avaxContractAddress]: avaxScanUrl,

    [ethContractAddress]: ethScanUrl,
    [polygonContractAddress]: polygonScanUrl,
    [bscContractAddress]: bscScanUrl,
    [avalanceContractAddress]: avalanceScanUrl,
  };
  return chainToChainId[contractAddress];
}
