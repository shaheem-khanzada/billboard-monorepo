import express, { type Router } from "express";
import { billboardController } from "./billboardController";
import { b } from "vitest/dist/chunks/suite.B2jumIFP";

export const billboardRouter: Router = express.Router();



billboardRouter.get("/mint-list", billboardController.mintList);