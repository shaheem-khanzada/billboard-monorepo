import { env } from "@/common/utils/envConfig";
import Web3 from "web3";
import {
  decodeEventLog,
  Hex,
} from "viem";

const EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "advertisementId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsURI",
        type: "string"
      }
    ],
    name: "AdvertisementMinted",
    type: "event"
  },
];

export class BillboardRepository {

  async fetchIPFSData(ipfsURI: string, retries = 3) {
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


  public async parseEventData({ data, topics }: { data: Hex; topics: [Hex, ...Hex[]] }) {
    const viemTopics = decodeEventLog({
      abi: EVENT_ABI,
      data,
      topics,
    }) as any;

    if (viemTopics.eventName !== "AdvertisementMinted") {
      return null;
    }

    const args = viemTopics?.args;

    if (!args || !args.owner || !args.advertisementId || !args.ipfsURI) {
      return null;
    }

    const metadata = await this.fetchIPFSData(args.ipfsURI);
    const { advertisementId, ...rest } = args;

    return { ...rest, tokenId: Number(advertisementId), metadata };
  };


  public signMintParams({ wallet, ipfsURI, advertisementId }: any) {
    const web3 = new Web3(env.RPC_URL);
    const privateKey = env.ETHEREUM_PRIVATE_KEY;

    const encoded = web3.eth.abi.encodeParameters(
      ['address', 'string', 'uint256'],
      [wallet, ipfsURI, Number(advertisementId)]
    )

    const hash = web3.utils.keccak256(encoded)

    const { signature } = web3.eth.accounts.sign(hash, privateKey)

    return signature
  }

}

export const billboardRepository = new BillboardRepository();
