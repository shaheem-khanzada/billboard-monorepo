import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { AdvertisementModel, IAdvertisement } from "@/schemas/AdvertisementSchema";
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

  async fetchAdvertisements() {
    try {
      const advertisements = await AdvertisementModel.find().sort({ tokenId: 1 }).lean();
      const totalSupply = await AdvertisementModel.countDocuments();
      if (!advertisements) {
        return ServiceResponse.success("success", { advertisements, totalSupply }, StatusCodes.OK)
      }
      return ServiceResponse.success("success", { advertisements, totalSupply }, StatusCodes.OK);
    } catch (error: any) {
      return ServiceResponse.success("Failed to fetch tokens", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAdvertisement(tokenId: number, updateData: Partial<IAdvertisement>) {
    try {
      const updated = await AdvertisementModel.findOneAndUpdate(
        { tokenId },
        { $set: updateData },
        { new: true }
      ).lean();

      if (!updated) {
        return ServiceResponse.success("Advertisement not found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success("Advertisement updated successfully", { advertisement: updated }, StatusCodes.OK);
    } catch (error: any) {
      return ServiceResponse.success("Failed to update advertisement", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTotalSupply(totalSupply: number) {
    try {
      if (!totalSupply || isNaN(totalSupply) || totalSupply <= 0) {
        return ServiceResponse.failure(
          "Invalid 'totalSupply' value. It must be a positive number.",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
  
      if (totalSupply < 100) {
        return ServiceResponse.failure(
          "Total supply cannot be less than 100.",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
  
      const currentSupply = await AdvertisementModel.countDocuments();
  
      const lastMintedAd = await AdvertisementModel
        .findOne({ isMinted: true })
        .sort({ tokenId: -1 })
        .lean();
  
      if (lastMintedAd && totalSupply < lastMintedAd.tokenId) {
        return ServiceResponse.failure(
          `Cannot reduce supply to ${totalSupply} because token #${lastMintedAd.tokenId} is already minted. Supply must be increased beyond this minted tokenId.`,
          null,
          StatusCodes.BAD_REQUEST
        );
      }
  
      // CASE 1: Increasing supply
      if (totalSupply > currentSupply) {
        const toCreate = totalSupply - currentSupply;
  
        const newAds = Array.from({ length: toCreate }, (_, i) => {
          const tokenId = currentSupply + i + 1;
          return { tokenId };
        });
  
        await AdvertisementModel.insertMany(newAds);
  
        return ServiceResponse.success("Advertisements increased", {
          added: newAds.length,
          newTotal: currentSupply + newAds.length
        }, StatusCodes.OK);
      }
  
      // CASE 2: Decreasing supply (safe removal)
      if (totalSupply < currentSupply) {
        const removableAds = await AdvertisementModel.find({
          tokenId: { $gt: totalSupply },
          isMinted: { $ne: true }
        });
  
        const removableIds = removableAds.map(ad => ad._id);
  
        if (removableIds.length) {
          await AdvertisementModel.deleteMany({ _id: { $in: removableIds } });
        }
  
        return ServiceResponse.success("Advertisements decreased", {
          removed: removableIds.length,
          newTotal: await AdvertisementModel.countDocuments()
        }, StatusCodes.OK);
      }
  
      // CASE 3: No change
      return ServiceResponse.success("No changes made to supply", {
        currentSupply
      }, StatusCodes.OK);
  
    } catch (error: any) {
      console.error("Error updating totalSupply:", error);
      return ServiceResponse.failure("Failed to update totalSupply", null, StatusCodes.INTERNAL_SERVER_ERROR);
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
    console.log('webhook', body)
    try {
      const {
        event: {
          data: {
            block: { hash: transactionHash, logs, number: blockNumber },
          },
        },
      } = body;

      if (!logs || logs.length === 0 || !transactionHash) {
        return ServiceResponse.success('no logs or hash found', null, StatusCodes.OK);
      }

      const mint = await billboardRepository.parseEventData(logs[0] as any);

      if (!mint) {
        return ServiceResponse.success("can't parse event", null, StatusCodes.OK);
      }

      Object.assign(mint, { transactionHash, blockNumber, isMinted: true });

      const { tokenId } = mint;

      console.log("Parsed Log:", mint);

      await AdvertisementModel.updateOne({ tokenId }, { $set: mint });

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
