import { ethers } from "ethers";
import cron from "node-cron";
import { abi, address } from "@/contract/abi.json";
import { env } from "@/common/utils/envConfig";
import { AdvertisementModel } from "../schemas/AdvertisementSchema";
import { getEventLastBlock, saveEventLastBlock } from "./dbUtils";

let provider: ethers.WebSocketProvider;
let contract: ethers.Contract;
let eventListenerActive = false;

// ✅ Function to create a WebSocket provider with auto-reconnect
async function createWebSocketProvider() {
  console.log("[WebSocket] Initializing WebSocket provider...");
  if (provider) provider.removeAllListeners(); // Remove old listeners before re-creating
  if (contract) contract.removeAllListeners(); // Remove old listeners before re-creating

  provider = new ethers.WebSocketProvider(env.RPC_WEBSOCKET_ENDPOINT);
  contract = new ethers.Contract(address, abi, provider);
  listenForEvents(); // Restart event listeners after reconnect
  await fetchPastEvents();
}

// ✅ Function to disconnect WebSocket and reconnect every hour
function restartWebSocketConnection() {
  console.log("[WebSocket] Restarting WebSocket connection to prevent memory leaks...");
  provider.removeAllListeners(); // Remove all active event listeners
  provider.destroy();
  contract.removeAllListeners();
  eventListenerActive = false;
  createWebSocketProvider(); // Reinitialize the WebSocket provider
}

// ✅ Function with retry logic for IPFS fetch
async function fetchIPFSData(ipfsURI: string, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!ipfsURI.startsWith("http")) throw new Error(`Invalid IPFS URI: ${ipfsURI}`);
      const response = await fetch(ipfsURI);
      if (!response.ok) throw new Error(`IPFS request failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error(`IPFS fetch attempt ${attempt} failed:`, error);
      if (attempt === retries) return null;
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
}

// ✅ Function with retry logic for event processing
async function processEvent(event: any, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { owner, tokenId, ipfsURI, blockNumber, transactionHash } = event;

      console.log(`[Event] Processing AdvertisementMinted: ${tokenId}`, event);

      if (!tokenId || !ipfsURI) {
        console.warn("[Event] Invalid event data, skipping...");
        return;
      }

      const metadata = await fetchIPFSData(ipfsURI);
      if (!metadata) {
        console.warn("[Event] Skipping event due to missing metadata.");
        return;
      }

      const existingAd = await AdvertisementModel.findOne({ tokenId }).lean();
      if (!existingAd) {
        await AdvertisementModel.create({ owner, tokenId, ipfsURI, metadata, blockNumber, transactionHash });
        console.log("[MongoDB] Advertisement saved.");
      } else {
        console.log("[MongoDB] Advertisement already exists, skipping...");
      }
      return;
    } catch (error) {
      console.error(`[Event] Processing attempt ${attempt} failed:`, error);
      if (attempt === retries) return;
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
}

// ✅ Function to fetch past events with batch processing
async function fetchPastEvents() {
  if (eventListenerActive) {
    try {
      const lastEvent = await getEventLastBlock({ query: 'AdvertisementMinted' });
      const latestBlock = await provider.getBlockNumber();
      console.log(`[Past Events] Latest block: ${latestBlock}`);
      let lastProcessedBlock = lastEvent ? lastEvent.lastBlock : Math.max(0, latestBlock - 1000);
      console.log(`[Past Events] Last processed block: ${lastProcessedBlock}`);


      if (lastProcessedBlock >= latestBlock) return;

      console.log(`[Past Events] Fetching from block ${lastProcessedBlock} to ${latestBlock}...`);
      const filter = contract.filters.AdvertisementMinted();
      const batchSize = 1000; // Number of blocks to process in each batch

      while (lastProcessedBlock < latestBlock) {
        const toBlock = Math.min(lastProcessedBlock + batchSize, latestBlock);

        const events = await contract.queryFilter(filter, lastProcessedBlock, toBlock);

        const processedEvents = await AdvertisementModel.find({
          transactionHash: { $in: events.map((event) => event.transactionHash) }
        }).lean();

        if (processedEvents.length !== events.length) {
          console.log(`Found ${events.length - processedEvents.length} unprocessed AdvertisementMinted events`)
        }

        const filteredEvents = events.filter(event => {
          const eventHash = event.transactionHash;
          return !processedEvents.some(processedEvent => processedEvent.transactionHash === eventHash);
        });

        console.log(`Processing filteredEvents ${filteredEvents.length} unprocessed AdvertisementMinted events...`);

        for (const event of filteredEvents) {
          // @ts-ignore
          const [owner, tokenId, ipfsUri] = event.args;
          const parsedEvent = {
            owner,
            tokenId: Number(tokenId),
            ipfsURI: ipfsUri.toString(),
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
          };
          await processEvent(parsedEvent);
        }

        lastProcessedBlock = toBlock;
      }

      await saveEventLastBlock({
        query: 'AdvertisementMinted',
        collectionName: 'events',
        lastBlock: latestBlock,
      });
      console.log(`[Past Events] Updated last processed block to ${latestBlock} in database.`);
    } catch (error) {
      console.error("[Past Events] Error fetching past events:", error);
    }
  }
}

// ✅ Listen for real-time events with auto-recovery
function listenForEvents() {
  if (eventListenerActive) return;
  console.log("[WebSocket] Listening for real-time AdvertisementMinted events...");
  eventListenerActive = true;

  contract.on("AdvertisementMinted", async (...args) => {
    try {
      const event = args[args.length - 1]; // Last argument is event metadata
      const [owner, tokenId, ipfsUri] = event.args;
      const parsedEvent = {
        owner,
        tokenId: Number(tokenId),
        ipfsURI: ipfsUri.toString(),
        blockNumber: event.log.blockNumber,
        transactionHash: event.log.transactionHash,
      };
      console.log("Real-time Advertisement Minted:", parsedEvent);
      await processEvent(parsedEvent);
    } catch (error) {
      console.error("[WebSocket] Error handling real-time event:", error);
    }
  });
}

// ✅ Schedule periodic fetch for past events
cron.schedule("*/10 * * * *", async () => {
  console.log("[Cron] Running scheduled task: Fetching past missed events...");
  await fetchPastEvents();
});

// ✅ Schedule WebSocket restart every 1 hour to prevent block limit issues
cron.schedule("0 * * * *", async () => {
  console.log("[Cron] Restarting WebSocket connection to prevent block limits...");
  restartWebSocketConnection();
});

// ✅ Initialize event processing with fail-proof logic
(async () => {
  await createWebSocketProvider();
  console.log("[Startup] Fetching past events on startup...");
  console.log("[Startup] Listening for new AdvertisementMinted events...");
})();
