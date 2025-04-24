import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { billboardService } from "./billboardService";

class BillboardController {
  public fetchAdvertisements: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await billboardService.fetchAdvertisements();
    return handleServiceResponse(serviceResponse, res);
  };

  public updateTotalSupply: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await billboardService.updateTotalSupply(req?.body?.totalSupply);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateAdvertisement: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await billboardService.updateAdvertisement(Number(req.params.tokenId), req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public uploadToPinata: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await billboardService.uploadToPinata(req.files);
    return handleServiceResponse(serviceResponse, res);
  };

  public webhook: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await billboardService.webhook(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public approveAdvertisement: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await billboardService.approveAdvertisement(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const billboardController = new BillboardController();
