import mongoose, { Schema, Document } from "mongoose";

export interface IAdvertisement extends Document {
  owner: string,
  tokenId: number;
  ipfsURI: string;
  metadata: any;
  transactionHash: string;
  blockNumber: number;
  isApproved: boolean;
}

const AdvertisementSchema = new Schema<IAdvertisement>({
  owner: { type: String, required: true },
  tokenId: { type: Number, required: true },
  ipfsURI: { type: String, required: true },
  metadata: Object,
  isApproved: { type: Boolean, default: false },
  transactionHash: { type: String, required: true, unique: true },
  blockNumber: { type: Number, required: true },
}, { timestamps: true });

const AdvertisementModel = mongoose.model<IAdvertisement>("Advertisement", AdvertisementSchema);

export { AdvertisementModel };
