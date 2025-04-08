import multer from "multer";

export const uploadMiddleware = multer({ storage: multer.memoryStorage() }).fields([
  { name: "file", maxCount: 1 },
  { name: "metadata", maxCount: 1 },
]);