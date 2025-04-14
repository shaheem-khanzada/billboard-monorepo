import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { AdvertisementModel } from "@/schemas/AdvertisementSchema";
import { StatusCodes } from "http-status-codes";
import { PinataSDK } from "pinata";
import { billboardRepository } from "./billboardRepository";

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

  async approveAdvertisement({ tokenId }: { tokenId: number }) {
    try {
      const advertisement = await AdvertisementModel.findOneAndUpdate(
        { tokenId },
        { $set: { isApproved: true } },
        { new: true }
      );
  
      if (!advertisement) {
        return ServiceResponse.failure("Advertisement not found", null, StatusCodes.NOT_FOUND);
      }
  
      return ServiceResponse.success("Advertisement approved successfully", { advertisement }, StatusCodes.OK);
    } catch (error: any) {
      console.error("Error approving advertisement:", error);
      return ServiceResponse.failure("Failed to approve advertisement", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async webhook(body: any) {
    try {
      const {
        event: {
          data: {
            block: { hash: txHash, logs, number },
          },
        },
      } = body;

      if (!logs || logs.length === 0 || !txHash) {
        return ServiceResponse.success('no logs or hash found', null, StatusCodes.OK);
      }
      
      const parsedLog = await billboardRepository.parseEventData(logs[0] as any);

      if (!parsedLog) {
        return ServiceResponse.success("can't parse event", null, StatusCodes.OK);
      }

      parsedLog.transactionHash = txHash;
      parsedLog.blockNumber = number;

      console.log("Parsed Log:", parsedLog);

      return ServiceResponse.success("success", {}, StatusCodes.OK);
    } catch (error: any) {
      return ServiceResponse.success("Failed to fetch tokens", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }


  async uploadToPinata(files: any) {
    try {
      console.log("Files received for upload:", files);
      const file = files["file"]?.[0];  // the image file
      const metadata = files["metadata"]?.[0];  // the metadata file

      // Check if both files are available
      if (!file || !metadata) {
        return ServiceResponse.failure("Missing file or metadata", null, StatusCodes.BAD_REQUEST);
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

      const signature = billboardRepository.signMintParams({ wallet, ipfsURI, advertisementId });

      return ServiceResponse.success("success", [ipfsURI, Number(advertisementId), signature], StatusCodes.OK);
    } catch (error: any) {
      return ServiceResponse.failure("Failed to upload to Pinata", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const billboardService = new BillboardService();
