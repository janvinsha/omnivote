import { ethers, BrowserProvider, parseUnits } from "ethers";

class Web3Adapter {
    private provider;
    private signer;
    private contract;

    private constructor(provider: any, signer: any, contract: ethers.Contract) {
        this.provider = provider;
        this.signer = signer;
        this.contract = contract;
    }

    // Static method to asynchronously initialize the Web3Adapter
    static async create(provider: any, contractAddress: string, contractABI: any): Promise<Web3Adapter> {
        const browserProvider = new ethers.BrowserProvider(provider);
        const signer = await browserProvider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        return new Web3Adapter(browserProvider, signer, contract);
    }

    // Method to get the user's address
    async getAddress(): Promise<string> {
        try {
            const address = await this.signer.getAddress();
            return address;
        } catch (error) {
            console.error("Error getting address:", error);
            throw error;
        }
    }

    // Method to get the current network
    async getNetwork() {
        try {
            const network = await this.provider.getNetwork();
            return network;
        } catch (error) {
            console.error("Error getting network:", error);
            throw error;
        }
    }

    // Method to interact with the smart contract (example: call a function)
    async callContractFunction(functionName: string, ...args: any[]): Promise<any> {
        try {
            const response = await this.contract[functionName](...args);
            return response;
        } catch (error) {
            console.error(`Error calling function ${functionName}:`, error);
            throw error;
        }
    }

    // Method to send a transaction to the smart contract (example: send ether)
    async sendTransaction(functionName: string, eventName: string, ...args: any[]) {
        try {
            // Send the transaction
            const transactionResponse = await this.contract[functionName](...args);

            // Wait for the transaction to be mined
            const receipt = await transactionResponse.wait();

            // Get the block number where the transaction was mined
            const blockNumber = receipt.blockNumber;

            const pollInterval = 5000; // Poll every 5 seconds
            const maxPollingTime = 180000; // Maximum polling time of 3 minutes (180,000 ms)
            const startTime = Date.now();

            while (Date.now() - startTime < maxPollingTime) {
                // Query the blockchain for the event
                const events = await this.contract.queryFilter(
                    this.contract.filters[eventName](),
                    blockNumber,
                    "latest" // Search from the block where the transaction was mined to the latest block
                );

                if (events.length > 0) {
                    console.log(`${eventName} Event Args:`, events[0]?.args);
                    return events[0]?.args; // Return the first occurrence of the event
                }

                // Wait for the next poll
                await new Promise((resolve) => setTimeout(resolve, pollInterval));
            }

            throw new Error(`Event ${eventName} not found within 3 minutes of polling`);
        } catch (error) {
            console.error(`Error sending transaction to ${functionName}:`, error);
            throw error;
        }
    }
}

export default Web3Adapter;
