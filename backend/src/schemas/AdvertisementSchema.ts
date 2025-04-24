import mongoose, { Schema, Document } from "mongoose";

export interface IAdvertisement extends Document {
  owner: string,
  price: number;
  isFreeMint: boolean;
  isMinted: boolean;
  tokenId: number;
  ipfsURI: string;
  metadata: any;
  transactionHash: string;
  blockNumber: number;
  isApproved: boolean;
}

const AdvertisementSchema = new Schema<IAdvertisement>({
  owner: { type: String, default: null },
  price: { type: Number, default: 0.5 },
  isFreeMint: { type: Boolean, default: false },
  isMinted: { type: Boolean, default: false },
  tokenId: { type: Number, unique: true  },
  ipfsURI: { type: String, default: null },
  metadata: { type: Object, default: null },
  isApproved: { type: Boolean, default: false },
  transactionHash: { type: String, default: null },
  blockNumber: { type: Number, default: null },
}, { timestamps: true });

const AdvertisementModel = mongoose.model<IAdvertisement>("Advertisement", AdvertisementSchema);

export { AdvertisementModel };
