// models/User.ts
import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  userId: string;
  email: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  otp?: string;
  botList: mongoose.Types.ObjectId[];
  ResourcesWithCount: { dockey: string; chunk_count: number }[];
  usedResources: string[];
  penddingJobs: {
    id: string;
    type: string;
    status: string;
    metadata: object;
  }[];
  offer?: boolean;
  plan: { type: string; createdAt: Date; expiredAt: Date };
  payments: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  paymentHistory: any[];
  crawl_domains: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  facebookId: { type: String },
  otp: { type: String },
  botList: [{ type: Schema.Types.ObjectId, ref: "Bot" }],
  ResourcesWithCount: [
    { dockey: { type: String, required: true }, chunk_count: { type: Number } },
  ],
  usedResources: [String],
  penddingJobs: [
    {
      id: { type: String, required: true },
      type: { type: String, required: true },
      status: { type: String, required: true },
      metadata: { type: Object },
    },
  ],
  offer: { type: Boolean },
  plan: {
    type: { type: String, default: "free" },
    createdAt: { type: Date, default: Date.now },
    expiredAt: {
      type: Date,
      default: () => Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  },
  payments: {
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
  },
  paymentHistory: [Schema.Types.Mixed],
  crawl_domains: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
