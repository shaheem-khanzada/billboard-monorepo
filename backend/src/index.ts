import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import mongoose from "mongoose";

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(env.MONGO_URI, { dbName: "billboard" });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

connectToDatabase().then(() => { console.log("DB Connection Successful") }).catch(err => { console.log(err) })

const server = app.listen(env.PORT, async () => {
  const { NODE_ENV, HOST, PORT } = env;

  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
