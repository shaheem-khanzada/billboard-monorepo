import express, { type Router } from "express";
import { billboardController } from "./billboardController";
import { uploadMiddleware } from "@/common/middleware/upload";

export const billboardRouter: Router = express.Router();

billboardRouter.get("/mint-list", billboardController.mintList);
billboardRouter.post("/upload", uploadMiddleware, billboardController.uploadToPinata);