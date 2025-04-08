import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { AdvertisementModel } from "@/schemas/AdvertisementSchema";
import { StatusCodes } from "http-status-codes";
import { PinataSDK } from "pinata";
import Web3 from "web3";

export class BillboardService {
  public pinata: PinataSDK;
  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.GATEWAY_URL
    });
  }
  async mintList() {
    try {
      const advertisement = await AdvertisementModel.find().sort({ tokenId: 1 }).lean();
      if (!advertisement) {
        return ServiceResponse.success("success", { advertisement }, StatusCodes.OK)
      }
      return ServiceResponse.success("success", { advertisement }, StatusCodes.OK);
    } catch (error: any) {
      return ServiceResponse.success("Failed to fetch tokens", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  signMintParams({ wallet, ipfsURI, advertisementId }: any) {
    const web3 = new Web3(env.RPC_URL);
    const privateKey = env.ETHEREUM_PRIVATE_KEY;

    console.log("Private Key:", privateKey);

    const encoded = web3.eth.abi.encodeParameters(
      ['address', 'string', 'uint256'],
      [wallet, ipfsURI, Number(advertisementId)]
    )

    const hash = web3.utils.keccak256(encoded)

    const { signature } = web3.eth.accounts.sign(hash, privateKey)

    return signature
  }

  public async uploadToPinata(files: any) {
    console.log("Files received for upload:", files);
    const file = files["file"]?.[0];  // the image file
    const metadata = files["metadata"]?.[0];  // the metadata file

    // Check if both files are available
    if (!file || !metadata) {
      return { success: false, error: "Missing file or metadata" };
    }

    const imageFile = new File([file.buffer], file.originalname, { type: file.mimetype });
    const { cid } = await this.pinata.upload.public.file(imageFile);
    const imageUrl = `${env.GATEWAY_URL}/ipfs/${cid}`;

    const { title, description, industry, slotPosition: advertisementId, websiteURL, wallet } = JSON.parse(metadata.buffer.toString());

    const tokenMetadata = {
      name: title,
      image: imageUrl,
      description,
      external_link: "https://www.blockchainbillboard.io/",
      attributes: [
        { trait_type: "Industry", value: industry },
        { trait_type: "Blockchain Billboard", value: `#${advertisementId}` },
        { display_type: "number", trait_type: "Original", value: 1 },
        { trait_type: "Website", value: websiteURL },
      ],
    };

    const updatedMetadataFile = new File([JSON.stringify(tokenMetadata)], "metadata.json", { type: "application/json" });

    const metadataUpload = await this.pinata.upload.public.file(updatedMetadataFile);

    const ipfsURI = `${env.GATEWAY_URL}/ipfs/${metadataUpload.cid}`;

    const signature = this.signMintParams({ wallet, ipfsURI, advertisementId });

    return ServiceResponse.success("success", [ipfsURI, Number(advertisementId), signature], StatusCodes.OK);
    
  }
}

export const billboardService = new BillboardService();
