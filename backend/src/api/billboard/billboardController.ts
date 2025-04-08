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
}

export const billboardController = new BillboardController();
