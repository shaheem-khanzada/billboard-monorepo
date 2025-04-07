const { ethers } = require('ethers');
require('dotenv').config();

// Contract ABI (only the events and functions we need)
const BILLBOARD_ABI = [
    "event AdvertisementMinted(uint256 indexed tokenId, address indexed owner, string ipfsUri, uint256 price)",
    "function owner() view returns (address)",
    "function maxSupply() view returns (uint256)",
    "function totalSupply() view returns (uint256)",
    "function mintAdvertisement(uint256 advertisementId, string memory ipfsUri) public payable",
    "function withdraw() public"
];

async function getPastEvents(contract, fromBlock = 0) {
    try {
        console.log("\nFetching past AdvertisementMinted events...");
        const filter = contract.filters.AdvertisementMinted();
        const events = await contract.queryFilter(filter, fromBlock);
        
        console.log(`Found ${events.length} past events:\n`);
        events.forEach((event) => {
            const [tokenId, owner, ipfsUri, price] = event.args;
            console.log("Past Advertisement Minted:");
            console.log("=========================");
            console.log(`Token ID: ${tokenId.toString()}`);
            console.log(`Owner: ${owner}`);
            console.log(`IPFS URI: ${ipfsUri}`);
            console.log(`Price: ${ethers.formatEther(price)} ETH`);
            console.log(`Block Number: ${event.blockNumber}`);
            console.log(`Transaction Hash: ${event.transactionHash}`);
            console.log("=========================\n");
        });
    } catch (error) {
        console.error("Error fetching past events:", error);
    }
}

async function listenToEvents(contract) {
    console.log("\nStarting real-time event listener for AdvertisementMinted events...");
    
    // Listen for new events
    contract.on("AdvertisementMinted", (tokenId, owner, ipfsUri, price, event) => {
        console.log("\nNew Advertisement Minted!");
        console.log("=========================");
        console.log(`Token ID: ${tokenId.toString()}`);
        console.log(`Owner: ${owner}`);
        console.log(`IPFS URI: ${ipfsUri}`);
        console.log(`Price: ${ethers.formatEther(price)} ETH`);
        console.log(`Block Number: ${event.blockNumber}`);
        console.log(`Transaction Hash: ${event.transactionHash}`);
        console.log("=========================\n");
    });

    // Error handling for the event listener
    contract.on("error", (error) => {
        console.error("Event listener error:", error);
    });
}

async function main() {
    try {
        // Replace with your contract address
        const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
        
        // Create provider (using WebSocket for real-time events)
        const provider = new ethers.WebSocketProvider(
            process.env.WS_RPC_URL || "ws://127.0.0.1:8545"
        );
        
        // Create contract instance
        const billboard = new ethers.Contract(
            CONTRACT_ADDRESS,
            BILLBOARD_ABI,
            provider
        );

        // Get current block number
        const currentBlock = await provider.getBlockNumber();
        console.log(`Current block number: ${currentBlock}`);

        // Get past events (last 1000 blocks)
        await getPastEvents(billboard, currentBlock - 1000);

        // Start listening for new events
        await listenToEvents(billboard);

        // Keep the script running
        console.log("Event listener is active. Press Ctrl+C to stop.");

        // Handle provider disconnection
        provider.on("error", (error) => {
            console.error("Provider error:", error);
        });

        provider.on("close", () => {
            console.log("Provider connection closed. Attempting to reconnect...");
            setTimeout(main, 5000); // Reconnect after 5 seconds
        });

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nStopping event listener...');
    process.exit(0);
});

main(); 