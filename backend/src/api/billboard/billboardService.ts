import { ServiceResponse } from "@/common/models/serviceResponse";
import { AdvertisementModel } from "@/schemas/AdvertisementSchema";
import { StatusCodes } from "http-status-codes";

export class BillboardService {
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
}

export const billboardService = new BillboardService();
