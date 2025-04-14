import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { billboardService } from "./billboardService";

class BillboardController {
  public mintList: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await billboardService.mintList();
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
