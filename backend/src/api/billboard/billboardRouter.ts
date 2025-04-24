import express, { type Router } from "express";
import { billboardController } from "./billboardController";
import { uploadMiddleware } from "@/common/middleware/upload";

export const billboardRouter: Router = express.Router();

billboardRouter.get("/advertisements", billboardController.fetchAdvertisements);
billboardRouter.put("/update-advertisement/:tokenId", billboardController.updateAdvertisement);
billboardRouter.post("/approve-advertisement", billboardController.approveAdvertisement);
billboardRouter.put("/update-supply", billboardController.updateTotalSupply);
billboardRouter.post("/upload", uploadMiddleware, billboardController.uploadToPinata);
billboardRouter.post("/webhook", billboardController.webhook);