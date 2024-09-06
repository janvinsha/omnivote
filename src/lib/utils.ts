import { baseChainId, baseChainSelector, baseContractAddress, sepoliaChainId, sepoliaChainSelector, sepoliaContractAddress } from "@/data/contracts"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { baseSepoliaChainConfig, sepoliaChainConfig } from "./web3AuthProviderProps";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Return chain image based on contract address
export function getChainImage(contractAddress: string) {
  const chainToImg = {
    [sepoliaContractAddress]: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    [baseContractAddress]: "https://web3auth.io/images/web3authlog.png"
  };
  return chainToImg[contractAddress] || "https://cryptologos.cc/logos/ethereum-eth-logo.png";
}

// Return chain name based on contract address
export function getChainName(contractAddress: string) {
  const chainToName = {
    [sepoliaContractAddress]: "Ethereum Sepolia",
    [baseContractAddress]: "Base Sepolia"
  };
  return chainToName[contractAddress] || "Ethereum Sepolia";
}

// Return the opposite chain selector based on contract address
export function getChainSelectorCrossChain(contractAddress: string) {
  const chainToSelector = {
    [sepoliaContractAddress]: baseChainSelector,
    [baseContractAddress]: sepoliaChainSelector
  };
  return chainToSelector[contractAddress];
}

// Return the receiver address for cross-chain interaction based on contract address
export function getRecieverAddressCrossChain(contractAddress: string) {
  const chainToRecieverAddress = {
    [sepoliaContractAddress]: baseContractAddress,
    [baseContractAddress]: sepoliaContractAddress
  };
  return chainToRecieverAddress[contractAddress];
}

// Return chain ID based on contract address
export function getChainId(contractAddress: string) {
  const chainToChainId = {
    [sepoliaContractAddress]: sepoliaChainId,
    [baseContractAddress]: baseChainId
  };
  return chainToChainId[contractAddress];
}
export function getChainNameSignProtocol(contractAddress: string) {
  const chainToChainId = {
    [sepoliaContractAddress]: "sepolia",
    [baseContractAddress]: "baseSepolia"
  };
  return chainToChainId[contractAddress];
}
export function getChainConfig(contractAddress: string) {
  const chainToChainId = {
    [sepoliaContractAddress]: sepoliaChainConfig,
    [baseContractAddress]: baseSepoliaChainConfig
  };
  return chainToChainId[contractAddress];
}
